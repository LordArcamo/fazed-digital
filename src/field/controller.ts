// GL controller: owns the field across ClientRouter swaps, maps page sections to formations.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createField, type Field } from './field';
import { TIERS } from './tiers';
import * as F from './formations';
import { Watchdog } from './watchdog';
import { bus } from '../lib/bus';
import type { Gate } from '../boot/gpu';
import type { Flags } from '../boot/flags';

gsap.registerPlugin(ScrollTrigger);
const html = document.documentElement;
const ILIGAN: [number, number] = [8.228, 124.2452];

type Rect = { left: number; top: number; width: number; height: number };
const rectOf = (el: Element | null): Rect | null => {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { left: r.left, top: r.top, width: r.width, height: r.height };
};

// data cache
const cache = new Map<string, Promise<ArrayBuffer>>();
const bin = (name: string) => {
  if (!cache.has(name)) cache.set(name, fetch(`/formations/${name}.bin`).then((r) => { if (!r.ok) throw new Error(name); return r.arrayBuffer(); }));
  return cache.get(name)!;
};

export async function start(g: Gate, flags: Flags) {
  const canvas = document.getElementById('field') as HTMLCanvasElement | null;
  if (!canvas || g.tier === 't0' || !g.backend) return null;
  const spec = { ...TIERS[g.tier] };
  const field = await createField(canvas, g.backend, spec);
  const u = field.u;
  bus.field = field;
  (window as any).__field = {
    ripple: (x: number, y: number, a = 1) => field.ripple(x, y, a),
    signal: () => { field.ripple(innerWidth / 2, innerHeight / 2, 1.2); },
    info: () => ({ backend: field.backend, n: field.n, tier: g.tier, timings: field.timings, formation: field.current()?.id }),
  };
  const desktop = () => innerWidth >= 1024 && matchMedia('(pointer: fine)').matches;
  const record = flags.record;

  const view = (): F.View => {
    const c = document.querySelector('.container');
    const pitch = innerWidth >= 768 ? 24 : 16;
    let originX = 0;
    if (c) originX = c.getBoundingClientRect().left + parseFloat(getComputedStyle(c).paddingLeft);
    return { w: innerWidth, h: innerHeight, pitch, originX };
  };
  const scrollY = () => (bus.lenis ? bus.lenis.scroll : window.scrollY);

  /** move a viewport formation into page space + focus layer so it scrolls with its section */
  // focus-layer anchor: the attached formation follows this element (works for sticky ones too)
  let anchorEl: Element | null = null, anchorTop0 = 0, anchorSy0 = 0;
  const attach = (f: F.Formation, el?: Element | null) => {
    const sy = scrollY();
    anchorEl = el ?? null;
    anchorTop0 = el ? el.getBoundingClientRect().top : 0;
    anchorSy0 = sy;
    for (let i = 0; i < f.visible; i++) {
      const o = i * 4;
      if (f.alpha[i] < 0) continue; // dust stays viewport-fixed
      if (f.data[o + 2] < 0.5) f.data[o + 2] = 2;
      f.data[o + 1] += sy;
    }
    return f;
  };

  /* ── formation builders ─────────────────────────────────────────────── */
  const n = field.n;
  let mask: F.Mask | null = null, glyphs: F.Glyphs | null = null, land: Uint8Array | null = null, word: ReturnType<typeof F.parseWordmark> | null = null;
  const shots = new Map<string, F.Shot>();
  const preload = async () => {
    const tasks: Promise<unknown>[] = [bin('mark-mask').then((b) => (mask = F.parseMask(b)))];
    await Promise.all(tasks);
    // the rest lazily, in idle time
    const later = () => {
      bin('glyphs').then((b) => (glyphs = F.parseGlyphs(b))).catch(() => {});
      bin('globe').then((b) => (land = new Uint8Array(b))).catch(() => {});
      bin('wordmark').then((b) => (word = F.parseWordmark(b))).catch(() => {});
    };
    'requestIdleCallback' in window ? (window as any).requestIdleCallback(later, { timeout: 2000 }) : setTimeout(later, 500);
  };
  const shot = async (id: string) => {
    if (!shots.has(id)) shots.set(id, F.parseShot(await bin(`shot-${id}`)));
    return shots.get(id)!;
  };

  const build = (id: string, el?: Element | null): F.Formation | null => {
    const v = view();
    const vmin = Math.min(v.w, v.h);
    switch (id) {
      case 'mark': {
        const r = rectOf(document.getElementById('mark-poster'));
        if (!r || !mask) return F.lattice(v, n);
        return attach(F.mark(r, mask, n, v), document.getElementById('mark-poster'));
      }
      case 'lattice': {
        // the unfold ruler: one row of lime dots on the 12 column lines
        const cols = [...document.querySelectorAll('.ruler span:not(.ruler-pitch)')].map((e) => e.getBoundingClientRect()).filter((r) => r.width > 0);
        const ry = cols[0] ? cols[0].top + cols[0].height / 2 : -1e4;
        return F.lattice(v, n, { lit: (x, y) => (Math.abs(y - ry) <= v.pitch / 2 && cols.some((c) => Math.abs(c.left - x) <= v.pitch / 2) ? 2 : 0) });
      }
      case 'work': return F.lattice(v, n);
      case 'pentagon': {
        const cx = desktop() ? v.w * 0.7 : v.w / 2, cy = v.h * 0.53;
        const r = Math.min(v.w * 0.17, v.h * 0.3);
        return F.pentagon({ x: cx, y: cy }, r, n, v, svcStep, glyphs ?? undefined, Math.min(240, r * 0.95));
      }
      case 'path4': {
        const r = rectOf(document.querySelector('[data-path-anchor]'));
        if (!r) return null;
        return attach(F.path4({ left: r.left, top: r.top - 40, width: r.width, height: 60 }, n, v, !desktop()));
      }
      case 'globe': {
        const gel = document.querySelector('[data-globe]');
        const r = rectOf(gel);
        if (!r || !land) return null;
        const R = Math.min(r.width, r.height) * 0.46;
        globeC = { x: r.left + r.width / 2, y: r.top + r.height / 2 + scrollY() };
        globeR = R;
        return attach(F.globe({ x: r.left + r.width / 2, y: r.top + r.height / 2 }, R, land, n, v, [ILIGAN, ...arcList().map((a) => a.to)]), gel);
      }
      case 'rings': {
        if (v.w < 768) return F.lattice(v, n);
        const r = rectOf(document.querySelector('[data-rings-anchor]'));
        if (!r) return null;
        ringsC = { x: r.left + r.width / 2, y: r.top + r.height / 2 + scrollY() };
        return attach(F.rings({ x: r.left + r.width / 2, y: r.top + r.height / 2 }, Math.min(vmin, r.width * 1.25), n, v, 4, person));
      }
      case 'node': {
        const r = rectOf(document.querySelector('[data-node-anchor]'));
        if (!r) return null;
        return attach(F.node({ x: r.left, y: r.top }, n, v));
      }
      case 'wordmark': {
        const r = rectOf(document.querySelector('[data-wordmark]'));
        if (!r || !word) return null;
        return attach(F.wordmark(r, word, n, v));
      }
      case 'scatter': return F.scatter(n, v);
      case 'flood': return F.lattice(v, n);
      default: return F.lattice(v, n);
    }
  };

  /* ── state ──────────────────────────────────────────────────────────── */
  let beat = '';
  let svcStep = 0, person = -1;
  let globeC = { x: 0, y: 0 }, globeR = 300, ringsC = { x: 0, y: 0 };
  let morphTween: gsap.core.Tween | null = null;
  let heroScrub = false;
  let heroP = 0;
  let markF: F.Formation | null = null, latF: F.Formation | null = null;
  const morph = (f: F.Formation | null, dur = 1.1, ease = 'power3.inOut', anchor?: [number, number]) => {
    if (!f) return;
    morphTween?.kill();
    field.target(f, anchor ? { anchor } : undefined);
    if (bus.rm) { u.uMorph.value = 1; morphTween = null; return; }
    morphTween = gsap.to(u.uMorph, { value: 1, duration: dur, ease });
  };
  const setBeat = (id: string, el?: Element | null) => {
    if (id === beat) return;
    const prev = beat;
    beat = id;
    // per-beat uniforms
    gsap.to(u.uDim, { value: id === 'work' || id === 'flood' ? 0.35 : 1, duration: 0.6 });
    gsap.to(u.uBack, { value: id === 'globe' ? 1 : 0, duration: 0.6 });
    u.uLight.value = id === 'wordmark' && desktop() ? 1 : 0;
    field.setArcs(null);
    if (id === 'hero') {
      // back into the hero: morph to the mark, then hand back to the scrub
      markF = build('mark');
      latF = build('lattice');
      heroScrub = false;
      morph(markF, 0.9);
      const back = () => { if (beat === 'hero') { pairMarkLattice(); heroScrub = true; } };
      if (morphTween) morphTween.eventCallback('onComplete', back); else back();
      return;
    }
    heroScrub = false;
    const f = build(id, el);
    if (id === 'globe' && f) {
      morph(f, 1.1);
      const arcs = arcList();
      const draw = () => { if (beat !== 'globe') return; field.setArcs(arcs, globeC, globeR); field.arcProgress = bus.rm ? 1 : 0; if (!bus.rm) gsap.to(field, { arcProgress: 1, duration: 3, ease: 'none' }); };
      if (morphTween) morphTween.eventCallback('onComplete', draw); else draw();
      return;
    }
    morph(f, prev === 'hero' ? 1.1 : 1.1);
  };
  const globeC0 = () => ({ x: globeC.x, y: globeC.y - scrollY() });
  const arcList = () => {
    // arcs come from cases.ts countries only (rendered into the DOM as data-arcs)
    const raw = document.querySelector<HTMLElement>('[data-arcs]')?.dataset.arcs;
    const dests: [number, number][] = raw ? JSON.parse(raw) : [];
    return dests.map((d) => ({ from: ILIGAN, to: d }));
  };
  /** hero pair: A = mark, B = lattice; uMorph = scroll progress */
  const pairMarkLattice = () => {
    if (!markF || !latF) return;
    field.set(markF);
    field.target(latF);
    u.uMorph.value = heroP;
  };

  /* ── page wiring ────────────────────────────────────────────────────── */
  let triggers: ScrollTrigger[] = [];
  let listeners: [string, EventListener][] = [];
  const on = (t: string, f: EventListener) => { document.addEventListener(t, f); listeners.push([t, f]); };

  const setupPage = () => {
    triggers.forEach((t) => t.kill());
    triggers = [];
    listeners.forEach(([t, f]) => document.removeEventListener(t, f));
    listeners = [];
    beat = '';
    const pageF = html.dataset.formation || 'lattice';
    const hero = document.querySelector('[data-f="mark"]');
    if (hero) {
      markF = build('mark');
      latF = build('lattice');
      beat = 'hero';
      if (!field.current()) { field.set(markF!); } else { morph(markF); }
      latF && field.current() && (heroScrub = false);
      // hero scrub: mark dissolves into the lattice over the first viewport of scroll
      triggers.push(ScrollTrigger.create({
        trigger: hero, start: 'top top', end: 'bottom 20%',
        onUpdate: (s) => {
          heroP = s.progress;
          if (beat !== 'hero') return;
          if (!heroScrub && s.progress > 0.001 && markF && latF && (!morphTween || !morphTween.isActive())) { pairMarkLattice(); heroScrub = true; }
          if (heroScrub) u.uMorph.value = gsap.parseEase('power2.in')(s.progress);
        },
        onEnterBack: () => setBeat('hero'),
      }));
    } else {
      const f = build(pageF);
      if (!field.current()) { if (f) field.set(f); } else morph(f);
      beat = pageF;
    }
    document.querySelectorAll<HTMLElement>('[data-f]').forEach((el) => {
      const id = el.dataset.f!;
      if (id === 'mark') return;
      if (id === 'pentagon' && !desktop()) return; // mobile: unpinned rows, field stays lattice
      triggers.push(ScrollTrigger.create({
        trigger: el, start: 'top 55%', end: 'bottom 45%',
        onToggle: (s) => { if (s.isActive) setBeat(id, el); },
      }));
    });
    const foot = document.querySelector('[data-wordmark]');
    if (foot && desktop()) {
      triggers.push(ScrollTrigger.create({ trigger: foot, start: 'top 85%', end: 'bottom top', onToggle: (s) => { if (s.isActive && word) { setBeat('wordmark', foot); foot.classList.add('gl-owned'); } } }));
    }
    on('fz:svc', ((e: CustomEvent) => {
      svcStep = e.detail;
      if (beat !== 'pentagon') return;
      morph(build('pentagon'), 0.6, 'power2.out');
    }) as EventListener);
    on('fz:shot', (async (e: CustomEvent) => {
      if (beat !== 'work') return;
      const d = e.detail as { id: string; el: HTMLElement } | null;
      if (!d) { morph(F.lattice(view(), n), 0.6, 'power2.out'); return; }
      const s = await shot(d.id);
      const r = rectOf(d.el)!;
      morph(F.shot(`shot-${d.id}`, r, s, n, view(), spec.densify), 0.6, 'power2.out', [r.left + r.width / 2, r.top]);
    }) as EventListener);
    on('fz:person', ((e: CustomEvent) => {
      person = e.detail;
      if (beat !== 'rings') return;
      morph(build('rings'), 0.5, 'power2.out');
    }) as EventListener);
    watchdog.reset();
  };

  /* ── loop ───────────────────────────────────────────────────────────── */
  const watchdog = new Watchdog(() => {
    // fire once: stop the loop, drop Lenis, back to poster mode, keep the scroll position
    const y = window.scrollY;
    gsap.ticker.remove(loop);
    bus.lenis?.destroy();
    bus.lenis = null;
    html.classList.remove('gl-live', 'lenis', 'lenis-smooth');
    html.dataset.gl = 't0';
    bus.field = null;
    field.dispose();
    window.scrollTo(0, y);
    console.info('[field] watchdog: sustained <24fps, switched to poster mode');
  });
  const t0 = performance.now();
  let simT = 0;
  let scatter = 0;
  const tiltTo = { x: 0, y: 0 }, tilt = { x: 0, y: 0 };
  addEventListener('pointermove', (e) => {
    if (!desktop()) return;
    tiltTo.x = ((e.clientX / innerWidth) - 0.5) * 2 * (6 * Math.PI / 180);
    tiltTo.y = ((e.clientY / innerHeight) - 0.5) * 2 * (4 * Math.PI / 180);
  }, { passive: true });
  addEventListener('pointerdown', (e) => {
    const t = e.target as HTMLElement;
    if (e.pointerType !== 'mouse' && !t.closest('a, button, input, select, textarea, label')) field.ripple(e.clientX, e.clientY, 1);
  }, { passive: true });

  function loop(_time: number, deltaMs: number) {
    if (document.hidden) return;
    const dt = record ? 1 / 60 : Math.min(0.1, deltaMs / 1000);
    simT += dt;
    const t = record ? simT : (performance.now() - t0) / 1000;
    const vel = bus.lenis ? Math.abs(bus.lenis.velocity) : 0;
    scatter += (Math.min(1, vel / 40) * 0.6 - scatter) * 0.1;
    u.uScatter.value = bus.rm ? 0 : scatter;
    u.uFocusY.value = anchorEl && anchorEl.isConnected ? -anchorSy0 + (anchorEl.getBoundingClientRect().top - anchorTop0) : -scrollY();
    if (beat === 'hero') {
      tilt.x += (tiltTo.x - tilt.x) * 0.06; tilt.y += (tiltTo.y - tilt.y) * 0.06;
      const k = 1 - heroP;
      u.uTilt.value.set(tilt.x * k, tilt.y * k);
      const r = document.getElementById('mark-poster')?.getBoundingClientRect();
      if (r) u.uTiltC.value.set(r.left + r.width / 2, r.top + r.height / 2, 0);
      // wake (§1): planes separate, then breathe ±8% on a 6s sine; depth eases out with scroll
      const w = wake.depth * (1 + 0.08 * Math.sin((t * Math.PI * 2) / 6));
      u.uDepth.value = 40 * w * (1 - heroP);
    } else if (beat === 'globe') {
      u.uDepth.value = globeR;
      u.uTilt.value.set(Math.sin(t * 0.12) * 0.42, 0); // sway ±24° around 160°E so PH/AU/US stay in view
      u.uTiltC.value.set(globeC.x, globeC.y + u.uFocusY.value, 0);
    } else if (beat === 'rings') {
      u.uDepth.value = Math.min(innerWidth, innerHeight) * 0.4;
      u.uTilt.value.set((t * 9 * Math.PI) / 180, 0);
      u.uTiltC.value.set(ringsC.x, ringsC.y + u.uFocusY.value, 0);
    } else {
      u.uTilt.value.set(0, 0);
    }
    if (beat === 'node' && Math.floor(t / 2.4) !== lastPulse) {
      lastPulse = Math.floor(t / 2.4);
      const r = document.querySelector('[data-node-anchor]')?.getBoundingClientRect();
      if (r) field.ripple(r.left, r.top, 0.7);
    }
    field.tick(dt, t);
    if (!record) watchdog.frame(deltaMs, t);
  }
  let lastPulse = -1;
  const wake = { depth: 0 };

  addEventListener('resize', () => {
    field.resize(innerWidth, innerHeight);
    const f = build(beat === 'hero' ? 'mark' : beat);
    if (beat === 'hero') { markF = f; latF = build('lattice'); pairMarkLattice(); }
    else if (f) field.retarget(f);
  });
  document.addEventListener('visibilitychange', () => watchdog.reset());

  /* ── route lifecycle (canvas is transition:persist) ─────────────────── */
  bus.onSwap.add(() => {
    triggers.forEach((t) => t.kill()); triggers = [];
    morphTween?.kill();
    // release state while the DOM swaps
    gsap.to(u.uScatter, { value: 0.4, duration: 0.25 });
    watchdog.reset();
  });
  bus.onPage.add(() => { requestAnimationFrame(() => { setupPage(); ScrollTrigger.refresh(); }); });

  /* ── handshake: frame 1 = poster, then wake ─────────────────────────── */
  await preload();
  u.uLitGain.value = 0; u.uDust.value = 0; u.uCurl.value = 0; u.uDepth.value = 0;
  setupPage();
  field.render();
  await new Promise((r) => requestAnimationFrame(r));
  await new Promise<void>((r) => requestAnimationFrame(() => { field.render(); html.classList.add('gl-live'); r(); }));
  gsap.ticker.add(loop);
  const d0 = bus.rm ? 0 : 0.3;
  if (bus.rm) { u.uLitGain.value = 1; u.uDust.value = 1; u.uCurl.value = 0; wake.depth = 1; }
  else {
    gsap.to(u.uDust, { value: 1, duration: 0.8, delay: d0, ease: 'power1.out' });
    gsap.to(u.uLitGain, { value: 1, duration: 0.8, delay: d0, ease: 'power2.out' });
    gsap.to(u.uCurl, { value: 4, duration: 1.2, delay: d0 });
    gsap.to(wake, { depth: 1, duration: 1.2, delay: d0, ease: 'expo.out' });
  }
  if (record) startRecord(record);
  return field;
}

/* ?record: deterministic scripted scroll (home 30s path) */
function startRecord(mode: string) {
  if (mode !== 'home') return;
  const l = bus.lenis;
  const sec = (id: string) => (document.getElementById(id)?.getBoundingClientRect().top ?? 0) + window.scrollY;
  const plan: [number, () => number][] = [
    [4, () => sec('unfold')], [7, () => sec('services')], [9.5, () => sec('services') + innerHeight * 0.9], [12, () => sec('work') + 40],
    [16, () => sec('flood') - innerHeight * 0.1], [19, () => sec('process') - 60], [21, () => sec('connections') - 40], [25, () => sec('people') - 40], [27, () => sec('contact') - 40],
  ];
  plan.forEach(([t, y]) => setTimeout(() => (l ? l.scrollTo(y(), { duration: 1.6 }) : window.scrollTo({ top: y(), behavior: 'smooth' })), t * 1000));
}

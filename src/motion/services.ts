// Home services deck. A flat miniature of this page tips back and fans into five sheets; scroll, hover or keyboard focus
// stands one up. The stage is CSS position: sticky, so nothing here moves layout: it only writes transforms and opacity.
// Layout lives in the media queries in pages/index.astro; these strings must match them.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { bus } from '../lib/bus';

const LIVE = '(scripting: enabled) and (prefers-reduced-motion: no-preference) and (min-height: 560px)';
const WIDE = '(min-width: 1024px)';
const N = 5;
const Q0 = 0.3; // share of the desktop scroll spent tipping the deck before the first sheet stands
const FAN_TILT = 68, STAND_TILT = 5, STAND = 1.12;
// A sheet at 68° is drawn about 0.3 of its height, and the GPU shrinks a layer that hard by dropping pixel rows: crossbars
// fall out of the text. So past SQUASH_AT a sheet is painted pre-squashed (a plain 2D scaleY inside the layer, so the text
// is drawn as vectors at that shape) and the layer's transform stretches it back. Same picture, sampled about 1:1.
const SQUASH = 0.4, SQUASH_AT = 50;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

export function initServices(svc: HTMLElement) {
  const rig = svc.querySelector<HTMLElement>('.rig')!;
  const stage = svc.querySelector<HTMLElement>('.stage')!;
  const scene = svc.querySelector<HTMLElement>('.scene')!;
  const planes = [...svc.querySelectorAll<HTMLElement>('.plane')];
  const faces = planes.map((p) => p.querySelector<HTMLElement>('.pl-in')!);
  const shades = planes.map((p) => p.querySelector<HTMLElement>('.shade')!);
  const labels = [...svc.querySelectorAll<HTMLElement>('.layer')];
  const live = matchMedia(LIVE), wide = matchMedia(WIDE);

  const act = planes.map(() => 0);
  const seen: string[] = [];
  const squashed = planes.map(() => false);
  let e = 0, eT = 0, active = -1, lit = -2;
  let hold = -1, byKey = false, holdY = 0; // hold: a sheet stood up by hover or focus, over the one scroll chose
  let px = -1, py = -1, sceneH = 0, sheetH = 0, base = 1, running = false, snap = true, labelsOn = -1;

  const measure = () => {
    sceneH = scene.clientHeight;
    base = wide.matches ? 1.34 : STAND; // the largest scale a sheet reaches; CSS lays sheets out at this size
    sheetH = planes[0].offsetHeight / base;
  };

  const setLit = (i: number) => {
    if (i === lit) return;
    lit = i;
    labels.forEach((l, k) => l.classList.toggle('is-on', k === i));
    planes.forEach((p, k) => { p.style.zIndex = String(k === i ? 20 : 10 - k); });
  };

  function frame(_t: number, dt: number) {
    const k = hold >= 0 ? hold : active;
    const step60 = dt / (1000 / 60);
    const fE = snap ? 1 : 1 - Math.pow(0.86, step60), fA = snap ? 1 : 1 - Math.pow(0.87, step60);
    e = lerp(e, eT, fE);
    let moving = Math.abs(e - eT) > 0.001;
    act.forEach((v, i) => {
      const t = i === k ? 1 : 0;
      act[i] = lerp(v, t, fA);
      if (Math.abs(act[i] - t) > 0.002) moving = true; else act[i] = t;
    });
    if (!moving) { e = eT; }
    const A = Math.max(...act), ee = ease(e);
    const step = ((sceneH - sheetH * 0.4) / (N - 1)) * 0.92;
    const grown = wide.matches ? lerp(1.34, 1, ee) : 1;
    planes.forEach((p, i) => {
      const a = act[i], side = k < 0 ? 0 : Math.sign(i - k);
      const y = lerp((i - 2) * step * ee * lerp(1, 0.72, A) + side * sheetH * 0.2 * A, 0, a * 0.92);
      const th = lerp(e < 0.02 ? 0 : lerp(0, FAN_TILT, ee), STAND_TILT, a);
      const s = lerp(grown, STAND, a) / base;
      const sq = th > SQUASH_AT;
      if (sq !== squashed[i]) { squashed[i] = sq; faces[i].style.transform = shades[i].style.transform = sq ? `scaleY(${SQUASH})` : ''; }
      const css = `translate3d(0,${y.toFixed(1)}px,0) rotateX(${th.toFixed(2)}deg) scale(${s.toFixed(4)})${sq ? ` scaleY(${1 / SQUASH})` : ''}`;
      if (css !== seen[i]) { seen[i] = css; p.style.transform = css; }
      const vis = i > 0 && ee < 0.02 ? 'hidden' : 'visible';
      if (p.style.visibility !== vis) p.style.visibility = vis;
      shades[i].style.opacity = (A * (1 - a) * 0.42).toFixed(3);
    });
    const on = wide.matches ? clamp((e - 0.35) / 0.4) : 1;
    if (on !== labelsOn) { labelsOn = on; labels.forEach((l) => { l.style.opacity = on.toFixed(3); }); }
    snap = false;
    if (!moving && running) { running = false; gsap.ticker.remove(frame); }
  }
  const kick = () => { if (!running) { running = true; gsap.ticker.add(frame); } };

  const sync = () => {
    if (!live.matches) return;
    const vh = innerHeight, r = rig.getBoundingClientRect();
    let next: number;
    if (wide.matches) {
      eT = clamp((vh * 0.1 - r.top) / (vh * 0.6));
      const q = clamp(-r.top / (r.height - vh));
      next = q < Q0 ? -1 : Math.min(N - 1, Math.floor(((q - Q0) / (1 - Q0)) * N));
    } else {
      eT = clamp((vh * 0.6 - r.top) / (vh * 0.5));
      const line = scene.getBoundingClientRect().bottom + 40 + vh * 0.12;
      next = 0;
      labels.forEach((l, i) => { if (l.getBoundingClientRect().top < line) next = i; });
      if (r.top > vh * 0.05) next = -1;
    }
    if (next !== active) { active = next; if (!byKey) hold = -1; } // scrolling hands the deck back from a resting pointer
    if (byKey && Math.abs(scrollY - holdY) > vh * 0.25) { byKey = false; hold = -1; } // ...and from a focused link
    setLit(hold >= 0 ? hold : active);
    kick();
  };

  // where sheet i stands on the desktop scroll
  const yFor = (i: number) => {
    const r = rig.getBoundingClientRect();
    return r.top + scrollY + (r.height - innerHeight) * (Q0 + ((1 - Q0) * (i + 0.5)) / N);
  };
  const jump = (y: number) => { if (bus.lenis) bus.lenis.scrollTo(y, { immediate: true, force: true }); else scrollTo(0, y); };

  // pointermove, not pointerover: the sheets slide under a resting pointer during scroll, and that must not grab the deck
  const move = (ev: PointerEvent) => {
    if (ev.pointerType === 'touch' || !wide.matches || (ev.clientX === px && ev.clientY === py)) return;
    px = ev.clientX; py = ev.clientY;
    if (eT < 0.6) return;
    const n = (ev.target as Element).closest<HTMLElement>('[data-i]');
    if (!n || +n.dataset.i! === hold) return;
    hold = +n.dataset.i!; byKey = false;
    setLit(hold);
    kick();
  };
  const leave = () => { if (byKey) return; hold = -1; setLit(active); kick(); };
  const focus = (ev: FocusEvent) => {
    const el = ev.target as HTMLElement, n = el.closest<HTMLElement>('[data-i]');
    if (!n || !el.matches(':focus-visible')) return;
    hold = +n.dataset.i!; byKey = true;
    setLit(hold);
    if (wide.matches) jump(yFor(hold));
    kick();
    // the browser's own reveal scroll lands after this event; measure the drift from where it settles
    requestAnimationFrame(() => requestAnimationFrame(() => { holdY = scrollY; }));
    holdY = scrollY;
  };
  const blur = () => { if (!byKey) return; byKey = false; hold = -1; setLit(active); kick(); };

  const clear = () => {
    if (running) { running = false; gsap.ticker.remove(frame); }
    planes.forEach((p, i) => { p.style.removeProperty('transform'); p.style.removeProperty('visibility'); p.style.removeProperty('z-index'); faces[i].style.removeProperty('transform'); squashed[i] = false; shades[i].removeAttribute('style'); });
    labels.forEach((l) => { l.style.removeProperty('opacity'); l.classList.remove('is-on'); });
    seen.length = 0; lit = -2; labelsOn = -1; active = -1; hold = -1; byKey = false;
  };
  const start = () => {
    if (!live.matches) { clear(); return; }
    measure();
    snap = true;
    seen.length = 0;
    sync();
  };

  stage.addEventListener('pointermove', move, { passive: true });
  stage.addEventListener('pointerleave', leave);
  rig.addEventListener('focusin', focus);
  rig.addEventListener('focusout', blur);
  live.addEventListener('change', start);
  wide.addEventListener('change', start);
  const st = ScrollTrigger.create({ trigger: rig, start: 'top bottom', end: 'bottom top', onUpdate: sync, onRefresh: start });

  start();
  const m = location.hash.match(/^#svc-(.+)$/);
  const linked = m ? labels.findIndex((l) => l.id === `svc-${m[1]}`) : -1;
  if (linked >= 0 && live.matches && wide.matches) jump(yFor(linked));

  return () => {
    st.kill();
    stage.removeEventListener('pointermove', move);
    stage.removeEventListener('pointerleave', leave);
    rig.removeEventListener('focusin', focus);
    rig.removeEventListener('focusout', blur);
    live.removeEventListener('change', start);
    wide.removeEventListener('change', start);
    clear();
  };
}

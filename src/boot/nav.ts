// SIGNAL DOCK runtime: dock state (hysteresis 120/80), mobile collapse, live Iligan clock,
// open/closed node, hover/focus connection line, footer hide. Classes only; CSS animates.
const html = document.documentElement;
const tz = 'Asia/Manila';
const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', weekday: 'short', hour12: false });

export function dockState(y: number, lastY: number) {
  const d = html.classList.contains('is-docked');
  if (!d && y > 120) { html.classList.add('is-docked'); html.classList.remove('undocking'); blobRelayout(); }
  else if (d && y < 80) { html.classList.remove('is-docked'); html.classList.add('undocking'); setTimeout(() => html.classList.remove('undocking'), 400); blobRelayout(); }
  if (y < 40) html.classList.remove('dock-min');
  else if (y - lastY > 8) html.classList.add('dock-min');
  else if (lastY - y > 8) html.classList.remove('dock-min');
}

let clock = 0;
let io: IntersectionObserver | null = null;
export function initNav() {
  clearInterval(clock);
  io?.disconnect();
  const t = document.querySelectorAll<HTMLElement>('[data-clock]');
  const tick = () => {
    const p: Record<string, string> = {};
    fmt.formatToParts(new Date()).forEach((x) => (p[x.type] = x.value));
    t.forEach((el) => (el.innerHTML = `${p.hour}:${p.minute}<span class="t-s">:${p.second}</span>`));
    const m = +p.hour * 60 + +p.minute;
    const open = !/Sat|Sun/.test(p.weekday) && m >= 510 && m < 1020;
    document.querySelectorAll('[data-open]').forEach((o) => o.classList.toggle('is-open', open));
    document.querySelectorAll('[data-open-l]').forEach((l) => (l.textContent = open ? 'Open now' : 'Closed'));
    document.querySelectorAll('[data-open-x]').forEach((l) => (l.textContent = open ? '' : ' · Replies next business day'));
  };
  if (t.length) { tick(); clock = window.setInterval(tick, 1000); }
  const lpd = document.getElementById('sd-lp');
  html.classList.remove('lp-dock');
  if (lpd) {
    const seen = new Map<Element, boolean>();
    const hero = document.querySelector('.lp-cta'), gs = document.getElementById('get-started');
    io = new IntersectionObserver((ents) => {
      ents.forEach((e) => seen.set(e.target, e.isIntersecting));
      html.classList.toggle('lp-dock', !!hero && !seen.get(hero) && !(gs && seen.get(gs)) && scrollY > 200);
    });
    [hero, gs].forEach((el) => el && io!.observe(el));
    return;
  }
  const f = document.getElementById('footer');
  if (f) { io = new IntersectionObserver(([e]) => html.classList.toggle('dock-hide', e.intersectionRatio >= 0.3), { threshold: [0, 0.3] }); io.observe(f); }
  initBlob();
}

// Liquid lime indicator: a head spring and a slower tail spring under an SVG goo threshold.
// It slides + stretches to the hovered/focused link, settles on the active page and, after a
// route change, travels from where it was to the new page's link. Real elapsed time; reduced
// motion snaps. The links and the CTA pull ≤6px toward the pointer (CSS spring on release).
type Sp = { x: number; v: number; w: number; vw: number };
const sp = (): Sp => ({ x: 0, v: 0, w: 0, vw: 0 });
let H = sp(), T = sp(), tx = 0, tw = 0, raf = 0, last = 0, mag = 0;
let lw: HTMLElement | null = null, b1: HTMLElement | null = null, b2: HTMLElement | null = null, ink: HTMLElement | null = null;
let LW = 0, LH = 0, BH = 36;
let target: HTMLElement | null = null, from: { x: number; w: number } | null = null;
const active = () => lw?.querySelector<HTMLElement>('.sd-a[aria-current]') ?? null;
function aim(a: HTMLElement | null, snap = false) {
  if (!lw) return;
  target?.classList.remove('is-blob');
  target = a;
  if (a) {
    const li = a.parentElement as HTMLElement; // layout box: immune to the dock's scale-in and the magnetic translate
    tx = li.offsetLeft + li.offsetWidth / 2; tw = li.offsetWidth;
    LW = lw.offsetWidth; LH = lw.offsetHeight; BH = b1?.offsetHeight || 36;
  } else tw = 0;
  if (!H.w && !T.w && a) { H.x = T.x = tx; }
  if (snap || html.classList.contains('rm')) { H.x = T.x = tx; H.w = T.w = tw; H.v = T.v = H.vw = T.vw = 0; }
  kick();
}
function step(sp: Sp, k: number, z: number, dt: number, x: number, w: number) {
  const c = 2 * Math.sqrt(k) * z;
  sp.v += (k * (x - sp.x) - c * sp.v) * dt; sp.x += sp.v * dt;
  sp.vw += (k * (w - sp.w) - c * sp.vw) * dt; sp.w += sp.vw * dt;
}
function draw() {
  if (!b1 || !b2) return;
  const st = Math.min(48, Math.abs(H.v) * 0.035), sq = 1 - Math.min(0.28, Math.abs(H.v) / 5200);
  const put = (el: HTMLElement, s: Sp, extra: number, sy: number) => {
    const w = Math.max(0, s.w + extra);
    el.style.width = `${w.toFixed(1)}px`;
    el.style.transform = `translate3d(${(s.x + mag - w / 2).toFixed(1)}px,0,0) scaleY(${(sy * Math.min(1, w / 30)).toFixed(3)})`;
  };
  put(b1, H, st, sq);
  put(b2, T, -6, 1);
  // the #090909 label copy is clipped to the blob, so every label it passes over reads dark on lime
  if (ink) {
    const wh = Math.max(0, H.w + st), wt = Math.max(0, T.w - 6);
    const l = Math.min(H.x - wh / 2, wt > 2 ? T.x - wt / 2 : 1e9) + mag, r = Math.max(H.x + wh / 2, wt > 2 ? T.x + wt / 2 : -1e9) + mag;
    const h = BH * sq * Math.min(1, wh / 30), t = (LH - h) / 2;
    ink.style.clipPath = r - l < 1 ? 'inset(50%)' : `inset(${t.toFixed(1)}px ${(LW - r).toFixed(1)}px ${t.toFixed(1)}px ${l.toFixed(1)}px round ${(h / 2).toFixed(1)}px)`;
  }
  // the label turns #090909 only once the lime is under it
  target?.classList.toggle('is-blob', Math.abs(H.x - tx) < tw * 0.3 && H.w > tw * 0.6);
}
function frame(now: number) {
  raf = 0;
  const dt = Math.min(1 / 30, Math.max(0.001, (now - last) / 1000)); last = now;
  step(H, 420, 0.62, dt, tx, tw);
  step(T, 150, 0.78, dt, tx, tw);
  draw();
  const busy = [H.v, T.v, H.vw, T.vw].some((v) => Math.abs(v) > 0.6) || Math.abs(H.x - tx) + Math.abs(T.x - tx) + Math.abs(H.w - tw) + Math.abs(T.w - tw) > 0.4;
  if (busy) kick(); else { H.x = T.x = tx; H.w = T.w = tw; draw(); }
}
function kick() { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } }

function initBlob() {
  lw = document.querySelector('.sd-lw');
  b1 = lw?.querySelector('.sd-b1') ?? null; b2 = lw?.querySelector('.sd-b2') ?? null;
  H = sp(); T = sp(); target = null; mag = 0; ink = null;
  if (!lw || lw.dataset.bound || !lw.getClientRects().length && innerWidth < 1024) { from = null; return; }
  lw.dataset.bound = '1';
  const ul = lw.querySelector('ul');
  if (ul) {
    ink = ul.cloneNode(true) as HTMLElement;
    ink.removeAttribute('id');
    ink.classList.add('sd-ink');
    ink.setAttribute('aria-hidden', 'true');
    ink.inert = true;
    // spans, not hrefless <a>s (crawlers flag those); attributes are copied so the scoped styles still match
    ink.querySelectorAll('a').forEach((a) => {
      const sp = document.createElement('span');
      for (const at of a.attributes) if (at.name !== 'href' && at.name !== 'aria-current') sp.setAttribute(at.name, at.value);
      sp.innerHTML = a.innerHTML;
      a.replaceWith(sp);
    });
    ink.style.clipPath = 'inset(50%)';
    lw.appendChild(ink);
  }
  const inkOf = (el: HTMLElement) => { const i = [...lw!.querySelectorAll('ul:not(.sd-ink) .sd-a')].indexOf(el); return i < 0 ? null : ink?.querySelectorAll<HTMLElement>('.sd-a')[i] ?? null; };
  const a = active();
  if (from && a && !html.classList.contains('rm')) {
    const lr = lw.getBoundingClientRect();
    H.x = T.x = from.x - lr.left; H.w = T.w = from.w;
    aim(a);
  } else aim(a, true);
  from = null;
  const nav = lw.closest<HTMLElement>('.sd')!;
  const pick = (e: Event) => (e.target as HTMLElement).closest<HTMLElement>('ul:not(.sd-ink) .sd-a');
  lw.addEventListener('pointerover', (e) => { const l = pick(e); if (l && l !== target) aim(l); });
  lw.addEventListener('pointerleave', () => { mag = 0; aim(active()); });
  lw.addEventListener('focusin', (e) => { const l = pick(e); if (l) aim(l); });
  lw.addEventListener('focusout', (e) => { if (!lw!.contains((e as FocusEvent).relatedTarget as Node)) aim(active()); });
  // magnetic pull (pointer:fine only)
  if (matchMedia('(pointer: fine)').matches) {
    let on: HTMLElement | null = null;
    nav.addEventListener('pointermove', (e) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>('.sd-a, .sd-cta');
      if (on && on !== el) { on.classList.remove('mag'); on.style.translate = ''; const k = inkOf(on); if (k) { k.classList.remove('mag'); k.style.translate = ''; } }
      on = el;
      if (!el || html.classList.contains('rm')) return;
      const r = el.getBoundingClientRect();
      const dx = Math.max(-6, Math.min(6, (e.clientX - r.left - r.width / 2) * 0.18));
      const dy = Math.max(-4, Math.min(4, (e.clientY - r.top - r.height / 2) * 0.18));
      el.classList.add('mag');
      el.style.translate = `${dx.toFixed(1)}px ${dy.toFixed(1)}px`;
      const k = inkOf(el); if (k) { k.classList.add('mag'); k.style.translate = el.style.translate; }
      if (el === target) { mag = dx; kick(); }
    }, { passive: true });
    nav.addEventListener('pointerleave', () => { if (on) { on.classList.remove('mag'); on.style.translate = ''; const k = inkOf(on); if (k) { k.classList.remove('mag'); k.style.translate = ''; } on = null; } mag = 0; kick(); });
  }
}
// dock ↔ rail layouts change the link positions: re-aim without travel
export function blobRelayout() { if (lw) { const t = target; requestAnimationFrame(() => aim(t, true)); } }

let once = false;
export function bindNavOnce() {
  if (once) return;
  once = true;
  document.addEventListener('astro:before-swap', () => {
    if (lw && b1 && (H.w > 1 || target)) {
      const lr = lw.getBoundingClientRect();
      from = { x: lr.left + H.x, w: Math.max(H.w, 24) };
    }
    cancelAnimationFrame(raf); raf = 0;
  });
  // <1024: the keyboard is up while a text field has focus, so the dock steps aside
  const kb = (e: FocusEvent) => {
    const t = e.target as HTMLElement;
    const on = e.type === 'focusin' && innerWidth < 1024 && t.matches?.('input:not([type=checkbox]):not([type=radio]):not([type=submit]):not([type=button]), textarea, select, [contenteditable="true"]');
    html.classList.toggle('dock-kb', !!on);
  };
  document.addEventListener('focusin', kb);
  document.addEventListener('focusout', kb);
  addEventListener('resize', blobRelayout, { passive: true });
}

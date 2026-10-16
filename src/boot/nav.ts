// SIGNAL DOCK runtime: dock state (hysteresis 120/80), mobile collapse, live Iligan clock,
// open/closed node, hover/focus connection line, footer hide. Classes only; CSS animates.
const html = document.documentElement;
const tz = 'Asia/Manila';
const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', weekday: 'short', hour12: false });

export function dockState(y: number, lastY: number) {
  const d = html.classList.contains('is-docked');
  if (!d && y > 120) { html.classList.add('is-docked'); html.classList.remove('undocking'); }
  else if (d && y < 80) { html.classList.remove('is-docked'); html.classList.add('undocking'); setTimeout(() => html.classList.remove('undocking'), 400); }
  if (y < 40) html.classList.remove('dock-min');
  else if (y - lastY > 8) html.classList.add('dock-min');
  else if (lastY - y > 8) html.classList.remove('dock-min');
}

let clock = 0;
let io: IntersectionObserver | null = null;
export function initNav() {
  clearInterval(clock);
  io?.disconnect();
  const t = document.querySelector<HTMLElement>('[data-clock]');
  const o = document.querySelector<HTMLElement>('[data-open]');
  const tick = () => {
    const p: Record<string, string> = {};
    fmt.formatToParts(new Date()).forEach((x) => (p[x.type] = x.value));
    if (t) t.innerHTML = `${p.hour}:${p.minute}<span class="t-s">:${p.second}</span>`;
    const m = +p.hour * 60 + +p.minute;
    const open = !/Sat|Sun/.test(p.weekday) && m >= 510 && m < 1020;
    if (o) { o.classList.toggle('is-open', open); o.title = open ? 'Open' : 'Closed'; }
  };
  if (t) { tick(); clock = window.setInterval(tick, 1000); }
  const f = document.getElementById('footer');
  if (f) { io = new IntersectionObserver(([e]) => html.classList.toggle('dock-hide', e.intersectionRatio >= 0.3), { threshold: [0, 0.3] }); io.observe(f); }
  const list = document.getElementById('sd-list');
  const line = list?.querySelector<HTMLElement>('.sd-line');
  if (!list || !line || list.dataset.bound) return;
  list.dataset.bound = '1';
  const show = (a: HTMLElement | null) => {
    if (!a || a.getAttribute('aria-current')) { line.classList.remove('on'); return; }
    const lr = list.getBoundingClientRect();
    const nx = (el: Element) => { const r = el.querySelector('.sd-n')!.getBoundingClientRect(); return r.left + r.width / 2 - lr.left; };
    const act = list.querySelector('[aria-current] .sd-n')?.parentElement;
    const from = act ? nx(act) : 0, to = nx(a);
    line.style.setProperty('--l', `${Math.min(from, to)}px`);
    line.style.setProperty('--w', `${Math.abs(to - from)}px`);
    line.style.setProperty('--o', from <= to ? 'left' : 'right');
    line.classList.add('on');
  };
  list.addEventListener('pointerover', (e) => show((e.target as HTMLElement).closest('.sd-a')));
  list.addEventListener('pointerleave', () => show(null));
  list.addEventListener('focusin', (e) => { const a = (e.target as HTMLElement).closest<HTMLElement>('.sd-a'); if (a?.matches(':focus-visible')) show(a); });
  list.addEventListener('focusout', () => show(null));
}

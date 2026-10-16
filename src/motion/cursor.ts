import { gsap } from 'gsap';
import { bus } from '../lib/bus';
// Cursor node. It never sits on the text it points at:
// - nav, dock and menu: the custom cursor steps aside (the nav has its own node + line feedback)
// - links/buttons: the ring contracts to a small hollow lime ring (no fill)
// - labelled targets (data-cursor): the label is an offset chip below-right of the pointer,
//   flipped left/up near the viewport edges
const NAV = '#hdr, #menu, .sd-lp, [data-cursor-off]';
export function initCursor() {
  if (!matchMedia('(pointer: fine)').matches) return;
  const root = document.getElementById('cursor');
  if (!root || root.dataset.bound) return;
  root.dataset.bound = '1';
  const html = document.documentElement;
  const dot = root.querySelector<HTMLElement>('.cur-dot')!, ring = root.querySelector<HTMLElement>('.cur-ring')!;
  const label = root.querySelector<HTMLElement>('.cur-label')!;
  const dx = gsap.quickTo(dot, 'x', { duration: 0.08 }), dy = gsap.quickTo(dot, 'y', { duration: 0.08 });
  const rx = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3.out' }), ry = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3.out' });
  let txt = false;
  addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    html.classList.add('cur-on');
    html.classList.remove('cur-off');
    dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
    if (txt) {
      html.classList.toggle('cur-fx', e.clientX > innerWidth - 180);
      html.classList.toggle('cur-fy', e.clientY > innerHeight - 72);
    }
    bus.field?.cursor(e.clientX, e.clientY, true);
  }, { passive: true });
  document.addEventListener('pointerleave', () => { html.classList.remove('cur-on'); bus.field?.cursor(0, 0, false); });
  addEventListener('keydown', (e) => { if (e.key === 'Tab') html.classList.add('cur-off'); });
  document.addEventListener('pointerover', (e) => {
    const t = e.target as HTMLElement;
    if (t.closest('input, textarea, select')) { html.classList.add('cur-off'); return; }
    const nav = !!t.closest(NAV);
    html.classList.toggle('cur-nav', nav);
    const a = nav ? null : t.closest<HTMLElement>('a, button, [data-cursor]');
    const s = a?.dataset.cursor || (a?.matches('a[target=_blank]') ? 'OPEN ↗' : '');
    txt = !!s;
    html.classList.toggle('cur-big', !!a);
    html.classList.toggle('cur-txt', txt);
    if (!txt) html.classList.remove('cur-fx', 'cur-fy');
    label.textContent = s;
  });
  // a route swap can remove the hovered element without a pointerover
  bus.onSwap.add(() => { html.classList.remove('cur-big', 'cur-txt', 'cur-nav', 'cur-fx', 'cur-fy'); txt = false; });
}

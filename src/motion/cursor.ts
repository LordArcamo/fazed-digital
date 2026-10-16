import { gsap } from 'gsap';
import { bus } from '../lib/bus';
export function initCursor() {
  if (!matchMedia('(pointer: fine)').matches) return;
  const root = document.getElementById('cursor');
  if (!root) return;
  const html = document.documentElement;
  const dot = root.querySelector<HTMLElement>('.cur-dot')!, ring = root.querySelector<HTMLElement>('.cur-ring')!;
  const label = root.querySelector<HTMLElement>('.cur-label')!;
  const dx = gsap.quickTo(dot, 'x', { duration: 0.08 }), dy = gsap.quickTo(dot, 'y', { duration: 0.08 });
  const rx = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3.out' }), ry = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3.out' });
  addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    html.classList.add('cur-on');
    html.classList.remove('cur-off');
    dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
    bus.field?.cursor(e.clientX, e.clientY, true);
  }, { passive: true });
  document.addEventListener('pointerleave', () => { html.classList.remove('cur-on'); bus.field?.cursor(0, 0, false); });
  addEventListener('keydown', (e) => { if (e.key === 'Tab') html.classList.add('cur-off'); });
  document.addEventListener('pointerover', (e) => {
    const t = e.target as HTMLElement;
    if (t.closest('input, textarea, select')) { html.classList.add('cur-off'); return; }
    const a = t.closest<HTMLElement>('a, button, [data-cursor]');
    const txt = a?.dataset.cursor || (a?.matches('a[target=_blank]') ? 'OPEN ↗' : '');
    html.classList.toggle('cur-big', !!a);
    html.classList.toggle('cur-txt', !!txt);
    label.textContent = txt;
  });
}

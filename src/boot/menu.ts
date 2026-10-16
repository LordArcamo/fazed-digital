// Dot-field menu. No JS: a native popover (Esc + light-dismiss). With JS: a modal under the dock
// (the dock stays on top as the close control), clip-path circle reveal from the Menu button,
// focus trap, Esc, M key, inert page, focus returned. The dot canvas is a lazy chunk (menu-dots.ts).
import { bus } from '../lib/bus';
const html = document.documentElement;
let menu: HTMLElement | null = null;
let btn: HTMLButtonElement | null = null;
let back: HTMLElement | null = null;
let timer = 0;
let dots: Promise<typeof import('./menu-dots')> | null = null;
const vis = (el: Element | null): el is HTMLElement => !!el && (el as HTMLElement).getClientRects().length > 0;
const isOpen = () => html.classList.contains('menu-open');

function set(open: boolean) {
  if (!menu || !btn || open === isOpen()) return;
  clearTimeout(timer);
  if (open) {
    back = document.activeElement as HTMLElement | null;
    const r = vis(btn) ? btn.getBoundingClientRect() : null;
    menu.style.setProperty('--mx', r ? `${r.left + r.width / 2}px` : `${innerWidth - 40}px`);
    menu.style.setProperty('--my', r ? `${r.top + r.height / 2}px` : '36px');
    menu.hidden = false;
    void menu.offsetWidth;
    menu.classList.add('is-open');
    const m = menu;
    (dots ??= import('./menu-dots')).then((d) => isOpen() && d.open(m, bus.rm)).catch(() => {});
  } else {
    menu.classList.remove('is-open');
    dots?.then((d) => d.close());
    const m = menu;
    timer = window.setTimeout(() => { m.hidden = true; }, bus.rm ? 150 : 360);
  }
  html.classList.toggle('menu-open', open);
  document.querySelectorAll('#menu-btn, [data-menu-alt]').forEach((b) => b.setAttribute('aria-expanded', String(open)));
  btn.setAttribute('aria-label', open ? 'Close menu' : 'Menu');
  for (const id of ['main', 'footer']) document.getElementById(id)?.toggleAttribute('inert', open);
  if (open) { bus.lenis?.stop(); menu.querySelector<HTMLElement>('.menu-link')?.focus({ preventScroll: true }); }
  // rail + M key: the menu button is hidden, so focus falls back to <main>, never <body>
  else { bus.lenis?.start(); (vis(back) && back !== document.body ? back : vis(btn) ? btn : document.getElementById('main'))?.focus({ preventScroll: true }); }
}

export function initMenu() {
  menu = document.getElementById('menu');
  btn = document.getElementById('menu-btn') as HTMLButtonElement | null;
  html.classList.remove('menu-open');
  if (!menu || !btn || menu.dataset.bound) return;
  menu.dataset.bound = '1';
  // upgrade the popover to the JS modal
  if (menu.matches(':popover-open')) (menu as any).hidePopover?.();
  menu.removeAttribute('popover');
  menu.hidden = true;
  menu.classList.add('js');
  menu.setAttribute('role', 'dialog');
  menu.setAttribute('aria-modal', 'true');
  document.querySelectorAll('[popovertarget="menu"]').forEach((b) => { b.removeAttribute('popovertarget'); b.removeAttribute('popovertargetaction'); });
}

let bound = false;
export function bindMenuOnce() {
  if (bound) return;
  bound = true;
  document.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    if (t.closest('#menu-btn, [data-menu-alt]')) { set(!isOpen()); return; }
    if (t.closest('.menu-x')) { set(false); return; }
    if (isOpen() && t.closest('#menu a')) set(false);
  });
  const word = (e: Event) => {
    const a = (e.target as HTMLElement).closest<HTMLElement>('.menu-link');
    if (a && isOpen()) dots?.then((d) => d.word(a.dataset.word || ''));
  };
  document.addEventListener('pointerover', word, { passive: true });
  document.addEventListener('focusin', word);
  document.addEventListener('keydown', (e) => {
    const k = e.key;
    if ((k === 'm' || k === 'M') && !e.metaKey && !e.ctrlKey && !e.altKey && menu && btn) {
      const t = e.target as HTMLElement;
      if (!t.closest('input, textarea, select, [contenteditable=""], [contenteditable="true"]')) { e.preventDefault(); set(!isOpen()); }
      return;
    }
    if (!isOpen() || !menu) return;
    if (k === 'Escape') { e.preventDefault(); set(false); return; }
    if (k !== 'Tab') return;
    const f = [btn, ...menu.querySelectorAll<HTMLElement>('a, button')].filter(vis);
    const i = f.indexOf(document.activeElement as HTMLElement);
    if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && (i === f.length - 1 || i < 0)) { e.preventDefault(); f[0].focus(); }
  });
  document.addEventListener('astro:before-swap', () => {
    if (!isOpen()) return;
    html.classList.remove('menu-open');
    dots?.then((d) => d.close(true));
    bus.lenis?.start();
  });
}

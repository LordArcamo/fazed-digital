// Full-screen menu: focus trap, Esc closes, focus returns to the trigger, inert on <main>.
export function initMenu() {
  const btn = document.getElementById('menu-btn') as HTMLButtonElement | null;
  const menu = document.getElementById('menu');
  if (!btn || !menu || btn.dataset.bound) return;
  btn.dataset.bound = '1';
  const label = btn.querySelector('.hdr-menu-l');
  const set = (open: boolean) => {
    menu.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (label) label.textContent = open ? 'Close' : 'Menu';
    document.documentElement.classList.toggle('menu-open', open);
    for (const id of ['main', 'footer']) document.getElementById(id)?.toggleAttribute('inert', open);
    if (open) (menu.querySelector('a') as HTMLElement | null)?.focus();
    else btn.focus();
  };
  btn.addEventListener('click', () => set(menu.hidden));
  menu.addEventListener('click', (e) => { if ((e.target as HTMLElement).closest('a')) set(false); });
  document.addEventListener('keydown', (e) => {
    if (menu.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); set(false); return; }
    if (e.key !== 'Tab') return;
    const f = [btn, ...menu.querySelectorAll<HTMLElement>('a, button')];
    const i = f.indexOf(document.activeElement as HTMLElement);
    if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
  });
  document.addEventListener('astro:before-swap', () => { if (!menu.hidden) set(false); });
}

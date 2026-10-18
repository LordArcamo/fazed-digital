// Eager shell for the 7-Day questionnaire (keeps the LP's pre-3D JS small).
// It catches every CTA / pricing button / start tile, stops Lenis from scrolling the page behind the modal,
// and opens the sheet through the engine (lp.ts), which loads at idle or on the first sign of intent.
type Engine = typeof import('./lp');
let engine: Promise<Engine> | null = null;
const load = () => (engine ??= import('./lp').then((m) => { m.initLpForms(); return m; }));
let delegated = false;

export function initLpShell() {
  const root = document.querySelector<HTMLElement>('[data-lp-form]');
  if (!root) return;
  if (!root.dataset.shell) {
    root.dataset.shell = '1';
    // warm the engine: at idle, or as soon as someone reaches for the form
    const idle = (window as any).requestIdleCallback ?? ((f: () => void) => setTimeout(f, 1200));
    idle(() => load(), { timeout: 4000 });
    root.addEventListener('pointerdown', () => load(), { once: true });
    root.addEventListener('focusin', () => load(), { once: true });
    // a ClientRouter swap brings new form markup; the cached engine binds it
    if (engine) engine.then((m) => m.initLpForms());
  }
  if (delegated) return;
  delegated = true;
  // Capture phase on window: runs before ClientRouter's and Lenis's own link handlers, which would otherwise
  // treat "#get-started" as an in-page jump and scroll the page behind the modal.
  window.addEventListener('click', (ev) => {
    const el = (ev.target as Element).closest<HTMLElement>('[data-choose], a[href="#get-started"], [data-start], [data-resume-btn]');
    if (!el || ev.metaKey || ev.ctrlKey || ev.shiftKey || el.closest('[data-sheet]')) return;
    const here = document.querySelector<HTMLElement>('[data-lp-form]');
    if (!here) return;
    ev.preventDefault();
    ev.stopPropagation();
    const variant = here.dataset.variant === 'php' ? 'php' : 'usd';
    load().then((m) => m.openLp(variant, el.dataset.choose ?? el.dataset.start, el));
  }, true);
}

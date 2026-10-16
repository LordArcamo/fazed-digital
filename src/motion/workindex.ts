// Work index preview (home §4 + /work): frame follows the cursor y, hover/focus parity,
// row thumbnail cloned into the frame, fz:shot → the field resolves the screenshot from dots.
const emit = (type: string, detail?: unknown) => document.dispatchEvent(new CustomEvent(type, { detail }));
export function initWorkIndex() {
  const wi = document.querySelector<HTMLElement>('[data-windex]');
  const prev = document.querySelector<HTMLElement>('[data-wprev]');
  if (!wi || !prev || wi.dataset.bound || !matchMedia('(min-width: 1024px)').matches) return;
  wi.dataset.bound = '1';
  /* §4 work index: preview frame follows the cursor y, hover/focus parity */
  {
    const yTo = (y: number) => { prev.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`; }; // CSS transition = quickTo 0.4s (no gsap in the pre-3D bundle)
    let on: string | null = null;
    const activate = (row: HTMLElement | null, ev?: PointerEvent) => {
      const id = row?.dataset.shot ?? null;
      if (row) {
        const wr = wi.getBoundingClientRect(), rr = row.getBoundingClientRect();
        const y = (ev ? ev.clientY : rr.top + rr.height / 2) - wr.top - prev.offsetHeight / 2;
        yTo(Math.max(0, Math.min(wr.height - prev.offsetHeight, y)));
      }
      if (id === on) return;
      on = id;
      wi.querySelectorAll('.wrow').forEach((r) => r.classList.toggle('is-on', r === row));
      prev.classList.toggle('is-on', !!id);
      wi.classList.toggle('has-on', !!id);
      // the preview reuses the row's own <picture> (cloned once), so there is one image set in the HTML
      if (row && id && !prev.querySelector(`[data-for="${id}"]`)) {
        const pic = row.querySelector('picture')?.cloneNode(true) as HTMLElement | undefined;
        if (pic) { pic.dataset.for = id; pic.querySelector('img')?.setAttribute('alt', ''); pic.querySelector('img')?.setAttribute('loading', 'eager'); prev.prepend(pic); }
      }
      prev.querySelectorAll<HTMLElement>('[data-for]').forEach((p) => {
        const img = p.querySelector('img') ?? p;
        img.classList.toggle('is-on', p.dataset.for === id);
      });
      // let the scan restart
      const scan = prev.querySelector<HTMLElement>('.wprev-scan');
      if (scan) { scan.style.animation = 'none'; void scan.offsetWidth; scan.style.animation = ''; }
      emit('fz:shot', id ? { id, el: prev } : null);
    };
    const move = (e: PointerEvent) => activate((e.target as HTMLElement).closest<HTMLElement>('a.wrow'), e);
    const leave = () => activate(null);
    const focus = (e: FocusEvent) => activate((e.target as HTMLElement).closest<HTMLElement>('a.wrow'));
    wi.addEventListener('pointermove', move);
    wi.addEventListener('pointerleave', leave);
    wi.addEventListener('focusin', focus);
    wi.addEventListener('focusout', leave);
  }

}

// Work index preview (home §4 + /work): a fixed slot over the right-hand columns (which step out
// while it shows), hover/focus parity, the row's own <picture> cloned into the slot, and
// fz:shot → the field resolves the screenshot from dots in ≤0.6s before the real image fades in.
// Scrolling hides it; when the scroll settles, the row under the pointer comes back.
// /lab reuses it: rows are any a[data-shot], and data-event on the index names the field event (fz:lab).
const emit = (type: string, detail?: unknown) => document.dispatchEvent(new CustomEvent(type, { detail }));
export function initWorkIndex() {
  const wi = document.querySelector<HTMLElement>('[data-windex]');
  const prev = document.querySelector<HTMLElement>('[data-wprev]');
  if (!wi || !prev || wi.dataset.bound || !matchMedia('(min-width: 1024px)').matches) return;
  wi.dataset.bound = '1';
  const cap = prev.querySelector<HTMLElement>('[data-wcap]');
  const ev = wi.dataset.event || 'fz:shot', R = 'a[data-shot]';
  let on: string | null = null;
  let px = -1, py = -1, st = 0;
  const activate = (row: HTMLElement | null) => {
    const id = row?.dataset.shot ?? null;
    if (id === on) return;
    on = id;
    wi.querySelectorAll(R).forEach((r) => r.classList.toggle('is-on', r === row));
    prev.classList.toggle('is-on', !!id);
    wi.classList.toggle('has-on', !!id);
    if (cap && row) cap.textContent = row.dataset.cap!;
    if (row) clone(row);
    prev.querySelectorAll<HTMLElement>('[data-for]').forEach((p) => (p.querySelector('img') ?? p).classList.toggle('is-on', p.dataset.for === id));
    const scan = prev.querySelector<HTMLElement>('.wprev-scan');
    if (scan) { scan.style.animation = 'none'; void scan.offsetWidth; scan.style.animation = ''; }
    emit(ev, id ? { id, el: prev } : null);
  };
  // the slot reuses each row's own <picture> (one image set in the HTML), cloned on first intent
  const clone = (row: HTMLElement) => {
    const id = row.dataset.shot;
    if (!id || prev.querySelector(`[data-for="${id}"]`)) return;
    const pic = row.querySelector('picture')?.cloneNode(true) as HTMLElement | undefined;
    if (!pic) return;
    pic.dataset.for = id;
    const img = pic.querySelector('img');
    if (img) { img.removeAttribute('class'); img.alt = ''; img.loading = 'eager'; img.decoding = 'async'; }
    prev.prepend(pic);
  };
  wi.addEventListener('pointerenter', () => wi.querySelectorAll<HTMLElement>(R).forEach(clone), { once: true });
  const rowAt = (x: number, y: number) => (document.elementFromPoint(x, y) as HTMLElement | null)?.closest<HTMLElement>(R) ?? null;
  wi.addEventListener('pointermove', (e) => { px = e.clientX; py = e.clientY; activate((e.target as HTMLElement).closest<HTMLElement>(R)); });
  wi.addEventListener('pointerleave', () => { px = -1; activate(null); });
  wi.addEventListener('focusin', (e) => activate((e.target as HTMLElement).closest<HTMLElement>(R)));
  wi.addEventListener('focusout', (e) => { if (!wi.contains((e as FocusEvent).relatedTarget as Node)) activate(null); });
  const onScroll = () => {
    if (on && !wi.contains(document.activeElement)) activate(null);
    clearTimeout(st);
    st = window.setTimeout(() => { if (px >= 0 && wi.isConnected) activate(rowAt(px, py)); }, 160);
  };
  addEventListener('scroll', onScroll, { passive: true });
  document.addEventListener('astro:before-swap', () => { removeEventListener('scroll', onScroll); clearTimeout(st); }, { once: true });
}

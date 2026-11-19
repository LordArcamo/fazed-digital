// Shared one-question-per-screen helpers: the 7-day brief (lp.ts) and the website check quiz (quiz.ts) both use these,
// so email checks, typo hints, number-key picks, motion timing and analytics behave the same on every form.

export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
export const desktop = () => matchMedia('(min-width: 1024px)').matches;
export const pad = (n: number) => String(n).padStart(2, '0');
const DOMAINS = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'ymail.com'];

/** One edit away from a common mail domain → suggest it (gmial.com → gmail.com). '' when nothing to suggest. */
export function typoFix(email: string): string {
  const [user, dom] = email.toLowerCase().split('@');
  if (!user || !dom || DOMAINS.includes(dom)) return '';
  const near = (a: string, b: string) => {
    if (Math.abs(a.length - b.length) > 1) return false;
    let i = 0, j = 0, edits = 0;
    while (i < a.length && j < b.length) {
      if (a[i] === b[j]) { i++; j++; continue; }
      if (++edits > 1) return false;
      if (a.length > b.length) i++; else if (a.length < b.length) j++; else if (a[i + 1] === b[j] && a[i] === b[j + 1]) { i += 2; j += 2; } else { i++; j++; }
    }
    return edits + (a.length - i) + (b.length - j) <= 1;
  };
  const hit = DOMAINS.find((d) => near(dom, d));
  return hit ? `${user}@${hit}` : '';
}

/** A bare 1–9 key press on a choice screen (never while typing, never with a modifier): the option it picks, else null. */
export function numberKey<T extends HTMLInputElement>(ev: KeyboardEvent, inputs: ArrayLike<T>): T | null {
  const t = ev.target as HTMLElement & { type?: string };
  const typing = t.tagName === 'TEXTAREA' || (t.tagName === 'INPUT' && t.type !== 'radio' && t.type !== 'checkbox');
  if (typing || ev.metaKey || ev.ctrlKey || ev.altKey || !/^[1-9]$/.test(ev.key)) return null;
  return inputs[Number(ev.key) - 1] ?? null;
}

/** A pointer tap (not a keyboard-triggered click, which has detail 0): only taps auto-advance. */
export const isTap = (ev: MouseEvent) => ev.detail !== 0;

/** One analytics call for both GA4 (loaded only after consent, see boot/cookies.ts) and Vercel Web Analytics.
 *  Both are no-ops when absent. Vercel only takes flat string/number/boolean values. */
export function track(name: string, data: Record<string, string | number | boolean> = {}) {
  const w = window as any;
  w.gtag?.('event', name, data);
  w.va?.('event', { name, data });
}

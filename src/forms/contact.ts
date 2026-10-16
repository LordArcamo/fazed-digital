// Vanilla contact form (ports ContactSection.tsx). Payload to /api/contact keeps the same
// shape { name, email, service, message, captchaToken } plus optional company + budget.
const SITE_KEY = '6LdYgc0sAAAAAJy0R-ZRG3VKjadhIoWs_-9VOZ1x';
let recaptcha: Promise<void> | null = null;
export const loadRecaptcha = () => (recaptcha ??= new Promise<void>((res, rej) => {
  const s = document.createElement('script');
  s.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
  s.async = true;
  s.onload = () => res();
  s.onerror = () => rej(new Error('recaptcha'));
  document.head.appendChild(s);
}));
export async function captcha(action: string): Promise<string> {
  await loadRecaptcha();
  const g = (window as any).grecaptcha;
  return new Promise((res, rej) => g.ready(() => g.execute(SITE_KEY, { action }).then(res, rej)));
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export interface ContactPayload { name: string; email: string; company: string; service: string; budget: string; message: string }
export function serialise(form: HTMLFormElement): ContactPayload {
  const d = new FormData(form);
  const g = (k: string) => String(d.get(k) ?? '').trim();
  return { name: g('name'), email: g('email'), company: g('company'), service: g('service'), budget: g('budget'), message: g('message') };
}
export function validate(p: ContactPayload): Record<string, string> {
  const e: Record<string, string> = {};
  if (!p.name) e.name = 'Please add your name.';
  if (!p.email) e.email = 'Please add your email so we can reply.';
  else if (!EMAIL.test(p.email)) e.email = 'That email doesn’t look right. Check for typos?';
  if (!p.message) e.message = 'Tell us a little about the project. One sentence is fine.';
  return e;
}

export function initContactForms() {
  document.querySelectorAll<HTMLElement>('[data-contact-form]').forEach((root) => {
    if (root.dataset.bound) return;
    root.dataset.bound = '1';
    const form = root.querySelector('form')!;
    const ok = root.querySelector<HTMLElement>('.cf-ok')!;
    const err = root.querySelector<HTMLElement>('.cf-err')!;
    const sum = root.querySelector<HTMLElement>('.cf-summary')!;
    const label = root.querySelector<HTMLElement>('.cf-label')!;
    const q = new URLSearchParams(location.search).get('service');
    if (q) { const sel = form.querySelector<HTMLSelectElement>('select[name=service]'); if (sel && [...sel.options].some((o) => o.value === q)) sel.value = q; }
    form.addEventListener('focusin', () => { loadRecaptcha().catch(() => {}); }, { once: true });
    form.addEventListener('focusin', () => (window as any).__field?.ripple?.(innerWidth * 0.25, innerHeight * 0.5, 0.6));
    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      err.hidden = true;
      const p = serialise(form);
      const e = validate(p);
      for (const k of ['name', 'email', 'message']) {
        const input = form.querySelector<HTMLElement>(`[name=${k}]`)!;
        const out = form.querySelector<HTMLElement>(`#${input.id}-e`);
        input.setAttribute('aria-invalid', e[k] ? 'true' : 'false');
        if (out) out.textContent = e[k] ?? '';
      }
      if (Object.keys(e).length) {
        const n = Object.keys(e).length;
        sum.textContent = n === 1 ? 'One field needs attention. It’s highlighted below.' : 'A couple of fields need attention. They’re highlighted below.';
        sum.hidden = false;
        form.querySelector<HTMLElement>(`[name=${Object.keys(e)[0]}]`)?.focus();
        return;
      }
      sum.hidden = true;
      label.textContent = 'Sending…';
      try {
        const captchaToken = await captcha('contact');
        const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...p, captchaToken }) });
        if (res.status === 429) throw new Error('You’ve sent a few messages in a row. Give it a minute, then try again.');
        if (!res.ok) throw new Error('Something went wrong on our side and your message didn’t send. Please try again, or email us at info@fazeddigital.com.');
        form.hidden = true;
        ok.hidden = false;
        const first = p.name.split(' ')[0];
        ok.querySelector('.cf-ok-b')!.textContent = `Thanks, ${first}. We’ll reply to ${p.email} within one business day, Monday to Friday. Want to keep exploring in the meantime?`;
        const now = new Date();
        ok.querySelector('.cf-ok-sig')!.textContent = `SIGNAL RECEIVED · ${now.toLocaleDateString('en-PH', { timeZone: 'Asia/Manila' })} · ${now.toLocaleTimeString('en-PH', { timeZone: 'Asia/Manila', hour: '2-digit', minute: '2-digit' })} PHT`;
        ok.querySelector<HTMLElement>('.cf-ok-h')!.focus();
        (window as any).__field?.signal?.();
      } catch (x: any) {
        err.textContent = x?.message === 'recaptcha' || !x?.message ? 'We couldn’t confirm you’re human. Please refresh the page and try again, or email info@fazeddigital.com.' : x.message;
        err.hidden = false;
      } finally {
        label.textContent = 'Send my brief';
      }
    });
    root.querySelector('.cf-again')?.addEventListener('click', () => { form.reset(); ok.hidden = true; form.hidden = false; form.querySelector<HTMLElement>('input')?.focus(); });
  });
}

import { captcha, loadRecaptcha } from './captcha';
export { captcha, loadRecaptcha };
// Vanilla contact form (ports ContactSection.tsx). Payload to /api/contact keeps the same
// shape { name, email, service, message, captchaToken } plus optional company + budget.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 7–15 digits once spaces, dashes, dots and brackets are ignored (optional leading +)
export const PHONE = /^\+?[\d\s().-]{7,20}$/;
const digits = (v: string) => v.replace(/\D/g, '').length;
export interface ContactPayload { name: string; email: string; phone: string; company: string; service: string; budget: string; message: string; website: string }
export function serialise(form: HTMLFormElement): ContactPayload {
  const d = new FormData(form);
  const g = (k: string) => String(d.get(k) ?? '').trim();
  return { name: g('name'), email: g('email'), phone: g('phone'), company: g('company'), service: g('service'), budget: g('budget'), message: g('message'), website: g('website') };
}
export function validate(p: ContactPayload): Record<string, string> {
  const e: Record<string, string> = {};
  if (!p.name) e.name = 'Please add your name.';
  if (!p.email) e.email = 'Please add your email so we can reply.';
  else if (!EMAIL.test(p.email)) e.email = 'That email doesn’t look right. Check for typos?';
  if (!p.message) e.message = 'Tell us a little about the project. One sentence is fine.';
  if (p.phone && (!PHONE.test(p.phone) || digits(p.phone) < 7 || digits(p.phone) > 15)) e.phone = 'That number looks incomplete. Check it, or leave it blank.';
  return e;
}

const MSG = {
  captcha: 'We couldn’t confirm you’re human. Refresh the page and try again, or email info@fazeddigital.com.',
  network: 'Your message didn’t send. Check your connection and try again, or email info@fazeddigital.com.',
  rate: 'You’ve sent a few messages in a row. Give it a minute, then try again.',
  server: 'Something went wrong on our side, so your message didn’t send. Try again, or email us at info@fazeddigital.com.',
};

export function initContactForms() {
  document.querySelectorAll<HTMLElement>('[data-contact-form]').forEach((root) => {
    if (root.dataset.bound) return;
    root.dataset.bound = '1';
    const form = root.querySelector('form')!;
    const ok = root.querySelector<HTMLElement>('.cf-ok')!;
    const err = root.querySelector<HTMLElement>('.cf-err')!;
    const sum = root.querySelector<HTMLElement>('.cf-summary')!;
    const label = root.querySelector<HTMLElement>('.cf-label')!;
    const btn = form.querySelector<HTMLButtonElement>('button[type=submit]')!;
    const q = new URLSearchParams(location.search).get('service');
    if (q) { const sel = form.querySelector<HTMLSelectElement>('select[name=service]'); if (sel && [...sel.options].some((o) => o.value === q)) sel.value = q; }
    const svc = form.querySelector<HTMLSelectElement>('select[name=service]');
    const tip = form.querySelector<HTMLElement>('.cf-tip');
    const syncTip = () => { if (tip && svc) tip.hidden = svc.value !== '7day'; };
    svc?.addEventListener('change', syncTip);
    syncTip();
    form.addEventListener('focusin', () => { loadRecaptcha().catch(() => {}); }, { once: true });
    form.addEventListener('focusin', () => (window as any).__field?.ripple?.(innerWidth * 0.25, innerHeight * 0.5, 0.6));
    // a field's error clears as soon as the person starts fixing it
    form.addEventListener('input', (ev) => {
      const input = ev.target as HTMLElement;
      if (input.getAttribute('aria-invalid') !== 'true') return;
      input.setAttribute('aria-invalid', 'false');
      const out = form.querySelector<HTMLElement>(`#${input.id}-e`);
      if (out) out.textContent = '';
      if (!form.querySelector('[aria-invalid="true"]')) sum.hidden = true;
    });
    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      err.hidden = true;
      const p = serialise(form);
      const e = validate(p);
      for (const k of ['name', 'email', 'phone', 'message']) {
        const input = form.querySelector<HTMLElement>(`[name=${k}]`)!;
        const out = form.querySelector<HTMLElement>(`#${input.id}-e`);
        input.setAttribute('aria-invalid', e[k] ? 'true' : 'false');
        if (out) out.textContent = e[k] ?? '';
      }
      if (Object.keys(e).length) {
        const n = Object.keys(e).length;
        sum.textContent = n === 1 ? 'One field needs attention. It’s highlighted below.' : 'A few fields need attention. They’re highlighted below.';
        sum.hidden = false;
        form.querySelector<HTMLElement>(`[name=${Object.keys(e)[0]}]`)?.focus();
        return;
      }
      sum.hidden = true;
      if (btn.disabled) return; // a send is already in flight (double tap)
      btn.disabled = true;
      btn.setAttribute('aria-busy', 'true');
      label.textContent = 'Sending…';
      try {
        const captchaToken = await captcha('contact'); // '' if blocked or slow: never stops the send
        const ac = new AbortController();
        const kill = setTimeout(() => ac.abort(), 20000);
        let res: Response;
        try { res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...p, captchaToken }), signal: ac.signal }); }
        catch { throw new Error(MSG.network); }
        finally { clearTimeout(kill); }
        if (res.status === 429) throw new Error(MSG.rate);
        if (!res.ok) throw new Error(MSG.server);
        form.hidden = true;
        ok.hidden = false;
        const first = p.name.split(' ')[0];
        ok.querySelector('.cf-ok-b')!.textContent = `Thanks, ${first}. We’ll reply to ${p.email} within one business day, Monday to Friday.`;
        const now = new Date();
        ok.querySelector('.cf-ok-sig')!.textContent = `SIGNAL RECEIVED · ${now.toLocaleDateString('en-PH', { timeZone: 'Asia/Manila' })} · ${now.toLocaleTimeString('en-PH', { timeZone: 'Asia/Manila', hour: '2-digit', minute: '2-digit' })} PHT`;
        ok.querySelector<HTMLElement>('.cf-ok-h')!.focus();
        (window as any).__field?.signal?.();
      } catch (x: any) {
        // only our own messages reach the visitor, never raw browser error text
        err.textContent = Object.values(MSG).includes(x?.message) ? x.message : MSG.network;
        err.hidden = false;
      } finally {
        label.textContent = 'Send my brief';
        btn.disabled = false;
        btn.removeAttribute('aria-busy');
      }
    });
    root.querySelector('.cf-again')?.addEventListener('click', () => { form.reset(); ok.hidden = true; form.hidden = false; form.querySelector<HTMLElement>('input')?.focus(); });
  });
}

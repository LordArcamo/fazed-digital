// LP multi-step form (port of LpForm.tsx). Same validation order, same payload to /api/lp-submit.
import { captcha, loadRecaptcha } from './contact';
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STYLE: Record<string, string> = { minimal: 'Minimal & clean', bold: 'Bold & vibrant', corporate: 'Corporate & professional', playful: 'Playful & fun' };
const GOAL: Record<string, string> = { leads: 'Get more leads & enquiries', sell: 'Sell products online', credibility: 'Build credibility & trust', replace: 'Replace an outdated website', launch: 'Launch a new business', other: 'Something else' };

export function lpPayload(form: HTMLFormElement) {
  const d = new FormData(form);
  const g = (k: string) => String(d.get(k) ?? '').trim();
  const extra = [g('currentWebsite') && `Current website: ${g('currentWebsite')}`, g('facebookPage') && `Facebook page: ${g('facebookPage')}`].filter(Boolean);
  return {
    package: g('package'), businessName: g('businessName'), industry: g('industry'), goal: g('goal'), styleVibe: g('styleVibe'),
    pagesNeeded: d.getAll('pagesNeeded').map(String), brandColors: g('brandColors'), inspirationUrls: g('inspirationUrls'),
    name: g('name'), email: g('email'), phone: g('phone'), referral: g('referral'), notes: [g('notes'), ...extra].filter(Boolean).join('\n'),
  };
}
export function lpValidate(step: number, p: ReturnType<typeof lpPayload>): string {
  if (step === 1 && !p.package) return 'Please choose a package to continue.';
  if (step === 2) { if (!p.businessName) return 'Please add your business name.'; if (!p.industry) return 'Please choose your industry.'; if (!p.goal) return 'Please choose your main goal.'; }
  if (step === 3) { if (!p.styleVibe) return 'Please choose a style.'; if (!p.pagesNeeded.length) return 'Please pick at least one page.'; }
  if (step >= 4) { if (!p.name) return 'Please add your name.'; if (!p.email) return 'Please add your email.'; if (!EMAIL.test(p.email)) return 'That email doesn’t look right. Check for typos?'; }
  return '';
}

export function initLpForms() {
  document.querySelectorAll<HTMLElement>('[data-lp-form]').forEach((root) => {
    if (root.dataset.bound) return;
    root.dataset.bound = '1';
    const form = root.querySelector('form')!;
    const steps = [...root.querySelectorAll<HTMLElement>('.lpf-step')];
    const rail = [...root.querySelectorAll<HTMLElement>('[data-rail]')];
    const err = root.querySelector<HTMLElement>('.lpf-err')!;
    const back = root.querySelector<HTMLButtonElement>('[data-back]')!, next = root.querySelector<HTMLButtonElement>('[data-next]')!, submit = root.querySelector<HTMLButtonElement>('[data-submit]')!;
    let step = 1;
    const show = (n: number) => {
      step = n;
      steps.forEach((s, i) => (s.hidden = i !== n - 1));
      rail.forEach((r, i) => { r.toggleAttribute('aria-current', i === n - 1); if (i === n - 1) r.setAttribute('aria-current', 'step'); r.classList.toggle('is-done', i < n - 1); });
      back.hidden = n === 1; next.hidden = n === 5; submit.hidden = n !== 5;
      err.textContent = '';
      if (n === 5) review();
      (steps[n - 1].querySelector('legend .t-h3') as HTMLElement | null)?.setAttribute('tabindex', '-1');
      (steps[n - 1].querySelector('legend .t-h3') as HTMLElement | null)?.focus({ preventScroll: false });
    };
    const review = () => {
      const p = lpPayload(form);
      const pk = form.querySelector<HTMLInputElement>(`input[name=package][value="${p.package}"]`)?.closest('label')?.querySelector('.lpf-name')?.textContent ?? p.package;
      const rows: [string, string][] = [['Package', pk], ['Business', `${p.businessName} · ${p.industry}`], ['Goal', GOAL[p.goal] ?? p.goal], ['Style', STYLE[p.styleVibe] ?? p.styleVibe], ['Pages', p.pagesNeeded.join(', ')], ['Contact', `${p.name} · ${p.email}${p.phone ? ' · ' + p.phone : ''}`]];
      const dl = root.querySelector('[data-review]')!;
      dl.replaceChildren(...rows.flatMap(([k, v]) => { const dt = document.createElement('dt'); dt.textContent = k; const dd = document.createElement('dd'); dd.textContent = v || '—'; return [dt, dd]; }));
    };
    form.addEventListener('focusin', () => loadRecaptcha().catch(() => {}), { once: true });
    form.addEventListener('change', () => { err.textContent = ''; });
    next.addEventListener('click', () => { const e = lpValidate(step, lpPayload(form)); if (e) { err.textContent = e; return; } show(step + 1); });
    back.addEventListener('click', () => show(step - 1));
    // package buttons on the page pre-select a plan and jump here
    document.querySelectorAll<HTMLElement>('[data-choose]').forEach((b) => b.addEventListener('click', () => {
      const r = form.querySelector<HTMLInputElement>(`input[name=package][value="${b.dataset.choose}"]`);
      if (r) { r.checked = true; show(step === 1 ? 2 : step); }
    }));
    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const p = lpPayload(form);
      const e = lpValidate(5, p);
      if (e) { err.textContent = e; return; }
      const label = submit.querySelector('.lpf-label')!;
      label.textContent = 'Sending your brief…';
      submit.disabled = true;
      try {
        const captchaToken = await captcha('lp_submit');
        const res = await fetch('/api/lp-submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...p, captchaToken }) });
        if (!res.ok) throw new Error();
        form.hidden = true;
        const ok = root.querySelector<HTMLElement>('.lpf-ok')!;
        ok.hidden = false;
        ok.querySelector('.lpf-ok-b')!.textContent = `We’ll email ${p.email} within one business day with your confirmed start date and what we need for Day 1.`;
        ok.querySelector<HTMLElement>('h3')!.focus();
      } catch {
        err.textContent = 'Your brief didn’t send. That’s on us. Try again, or email it to info@fazeddigital.com.';
      } finally { label.textContent = 'Send my 7-day brief'; submit.disabled = false; }
    });
  });
}

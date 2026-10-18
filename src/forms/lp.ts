// 7-Day Website questionnaire engine (spec: docs/forms-redesign/ux-directions.md, copy: copy.md).
// An inline start card opens a <dialog> with one question per screen. Choice screens advance on a pointer tap
// or a number key (never on arrow keys); answers persist for the visit; the brief rail mirrors every answer.
import { captcha, loadRecaptcha } from './captcha';
import { bus } from '../lib/bus';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const digits = (v: string) => v.replace(/\D/g, '').length;
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const desktop = () => matchMedia('(min-width: 1024px)').matches;
const pad = (n: number) => String(n).padStart(2, '0');
const DOMAINS = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'ymail.com'];
const FIELDS = ['package', 'industry', 'industryOther', 'goal', 'timeline', 'styleVibe', 'businessName', 'facebookPage', 'currentWebsite', 'name', 'email', 'phone', 'notes'];

const MSG = {
  package: 'Pick a package, or tap “Not sure yet”.',
  industry: 'Pick the closest match, or tap Other.',
  goal: 'Pick the one that matters most.',
  timeline: 'Pick a rough timeline. It doesn’t lock you in.',
  style: 'Pick the closest feel. We’ll fine-tune it on Day 1.',
  businessName: 'Add your business name. A working name is fine.',
  facebookPage: 'That doesn’t look like a Facebook link. Check it, or leave it blank.',
  currentWebsite: 'That link doesn’t look right. Check it, or leave it blank.',
  name: 'Add your name so we know who we’re replying to.',
  emailBlank: 'Add your email. That’s where your start date goes.',
  emailBad: 'That email doesn’t look right. Check for typos?',
  phoneUsd: 'That number looks incomplete. Check it, or leave it blank.',
  phonePhp: 'Use a mobile number like 09XX XXX XXXX, or leave it blank.',
  network: 'Your brief didn’t send. That’s on us. Try again, or email it to info@fazeddigital.com.',
  offline: 'You’re offline. Your answers are still here. Reconnect, then tap Send again.',
};

// First-touch lead source for the whole visit (ClientRouter swaps pages without reloading).
function leadSource(): string {
  const KEY = 'fz-src';
  try { const s = sessionStorage.getItem(KEY); if (s) return s; } catch {}
  const q = new URLSearchParams(location.search);
  const parts = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].filter((k) => q.get(k)).map((k) => `${k.slice(4)}=${q.get(k)}`);
  if (q.get('gclid')) parts.push('google-ads click');
  if (q.get('fbclid')) parts.push('facebook click');
  try { const r = document.referrer && new URL(document.referrer); if (r && r.host !== location.host) parts.push(`ref=${r.host}`); } catch {}
  const s = [parts.join(' · ') || 'direct / unknown', `landing=${location.pathname}`].join(' · ');
  try { sessionStorage.setItem(KEY, s); } catch {}
  return s;
}

// One edit away from a common mail domain → suggest it (gmial.com → gmail.com).
function typoFix(email: string): string {
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

const openers = new Map<string, (pkg?: string, from?: HTMLElement | null) => void>(); // variant → open()

export function initLpForms() {
  document.querySelectorAll<HTMLElement>('[data-lp-form]').forEach((root) => {
    if (root.dataset.bound) return;
    root.dataset.bound = '1';
    const variant = root.dataset.variant === 'php' ? 'php' : 'usd';
    const php = variant === 'php';
    const STORE = `fz-brief-v1-${variant}`;
    const sheet = root.querySelector<HTMLDialogElement>('[data-sheet]')!;
    const form = sheet.querySelector('form')!;
    const screens = [...form.querySelectorAll<HTMLElement>('[data-q]')];
    const $ = <T extends Element = HTMLElement>(s: string) => sheet.querySelector<T>(s)!;
    const bar = $('[data-bar]'), count = $('[data-count]'), live = $('[data-live]'), hint = $('[data-hint]');
    const back = $<HTMLButtonElement>('[data-back]'), next = $<HTMLButtonElement>('[data-next]'), send = $<HTMLButtonElement>('[data-submit]');
    const sendLabel = send.querySelector<HTMLElement>('[data-label]')!;
    const chip = $('[data-chosen]'), fine = $('[data-fine]'), mail = $('[data-mail]');
    const source = leadSource();
    const skip = new Set<string>();
    let cur = 0, timer = 0, openedAt = 0, opener: HTMLElement | null = null, sending = false;
    let idem = '';

    const val = (n: string) => String(new FormData(form).get(n) ?? '').trim();
    const active = () => screens.filter((s) => !skip.has(s.dataset.q!));
    const isChoice = (s: HTMLElement) => s.dataset.kind === 'choice';
    const errEl = (s: HTMLElement) => s.querySelector<HTMLElement>('[data-err]')!;
    const status = $('[data-status]');
    // which field a message belongs to, so it can be marked invalid and focused
    const FIELD_OF = new Map<string, string>([[MSG.businessName, 'businessName'], [MSG.facebookPage, 'facebookPage'], [MSG.currentWebsite, 'currentWebsite'], [MSG.name, 'name'], [MSG.emailBlank, 'email'], [MSG.emailBad, 'email'], [MSG.phoneUsd, 'phone'], [MSG.phonePhp, 'phone']]);
    function clearErr(s: HTMLElement) {
      errEl(s).textContent = '';
      s.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
    }
    function showErr(s: HTMLElement, m: string) {
      clearErr(s);
      errEl(s).textContent = m;
      const f = FIELD_OF.get(m);
      const input = f ? s.querySelector<HTMLInputElement>(`[name="${f}"]`) : s.querySelector<HTMLInputElement>('input[type=radio]');
      if (!input) return;
      input.setAttribute('aria-invalid', 'true');
      const ids = new Set((input.getAttribute('aria-describedby') ?? '').split(' ').filter(Boolean)); ids.add(errEl(s).id);
      input.setAttribute('aria-describedby', [...ids].join(' '));
      if (f) input.focus();
    }
    const optLabel = (name: string) => form.querySelector<HTMLInputElement>(`input[name="${name}"]:checked`)?.closest('label')?.querySelector('[data-opt]')?.textContent?.trim() ?? '';

    /* ── persistence (sessionStorage; cleared on success) ── */
    function save() {
      const o: Record<string, string> = {};
      FIELDS.forEach((f) => { const v = val(f); if (v) o[f] = v; });
      o._skip = skip.has('package') ? '1' : '';
      try { sessionStorage.setItem(STORE, JSON.stringify(o)); } catch {}
      syncCard();
    }
    function restore() {
      let o: Record<string, string> = {};
      try { o = JSON.parse(sessionStorage.getItem(STORE) || '{}'); } catch {}
      FIELDS.forEach((f) => {
        const v = o[f]; if (!v) return;
        const radio = form.querySelector<HTMLInputElement>(`input[type=radio][name="${f}"][value="${CSS.escape(v)}"]`);
        if (radio) radio.checked = true;
        else { const el = form.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${f}"]`); if (el) el.value = v; }
      });
      if (o._skip) skip.add('package');
      if (o.notes) { $('[data-note]').hidden = false; $('[data-note-toggle]').hidden = true; }
      conditional();
    }
    const answered = () => active().filter((s) => !validate(s)).length;
    function syncCard() {
      // a package picked from the pricing table counts as answered even though its screen is skipped
      const n = answered() + (skip.has('package') && val('package') ? 1 : 0), any = FIELDS.some((f) => val(f));
      const r = root.querySelector<HTMLElement>('[data-resume]');
      if (!r) return;
      r.hidden = !any;
      const label = root.querySelector<HTMLElement>('[data-resume-label]')!;
      label.innerHTML = n >= 7 ? 'Your brief is ready · Review and send' : `Continue your brief · <span data-resume-n>${n}</span> of 7 answered`;
    }

    /* ── conditional fields ── */
    function conditional() {
      const other = val('industry') === 'Other';
      const ow = $('[data-other-wrap]'); ow.hidden = !other;
      const cw = $('[data-replace-only]'); cw.hidden = val('goal') !== 'replace';
    }

    /* ── validation ── */
    function validate(s: HTMLElement): string {
      const q = s.dataset.q;
      if (q === 'package' && !val('package')) return MSG.package;
      if (q === 'industry' && !val('industry')) return MSG.industry;
      if (q === 'goal' && !val('goal')) return MSG.goal;
      if (q === 'timeline' && !val('timeline')) return MSG.timeline;
      if (q === 'style' && !val('styleVibe')) return MSG.style;
      if (q === 'business') {
        if (!val('businessName')) return MSG.businessName;
        const fb = val('facebookPage');
        if (fb && !/(facebook\.com|fb\.com|fb\.me)\//i.test(fb) && !/^@?[\w.]{3,}$/.test(fb)) return MSG.facebookPage;
        const cw = val('goal') === 'replace' ? val('currentWebsite') : '';
        if (cw && !/^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/i.test(cw)) return MSG.currentWebsite;
      }
      if (q === 'contact') {
        if (!val('name')) return MSG.name;
        if (!val('email')) return MSG.emailBlank;
        if (!EMAIL.test(val('email'))) return MSG.emailBad;
        const ph = val('phone');
        if (ph && (!/^\+?[\d\s().-]+$/.test(ph) || digits(ph) < (php ? 10 : 7) || digits(ph) > 15)) return php ? MSG.phonePhp : MSG.phoneUsd;
      }
      return '';
    }

    /* ── brief rail ── */
    function rail() {
      const v: Record<string, string> = {
        package: skip.has('package') || val('package') ? (form.querySelector<HTMLInputElement>('input[name=package]:checked')?.closest('label')?.dataset.chip ?? '') : '',
        industry: val('industry') === 'Other' && val('industryOther') ? val('industryOther') : optLabel('industry'),
        goal: optLabel('goal'), timeline: optLabel('timeline'), style: optLabel('styleVibe'),
        business: val('businessName'), contact: [val('name'), val('email')].filter(Boolean).join(' · '),
      };
      let n = 0;
      sheet.querySelectorAll<HTMLElement>('[data-row]').forEach((row) => {
        const k = row.dataset.row!, x = v[k] || '';
        row.classList.toggle('is-set', !!x);
        const b = row.querySelector<HTMLButtonElement>('[data-jump]')!;
        b.querySelector('[data-v]')!.textContent = x || '—';
        b.disabled = !x;
        b.setAttribute('aria-label', x ? `Change ${row.querySelector('dt')!.textContent!.toLowerCase()}: ${x}` : `${row.querySelector('dt')!.textContent}: not answered yet`);
        if (x) n++;
      });
      $('[data-rail-empty]').hidden = n > 0;
      const price = $('[data-price]');
      const chipText = v.package;
      price.hidden = !chipText || val('package') === 'unsure';
      if (!price.hidden) price.textContent = `${chipText} · 7 business days`;
    }

    /* ── render the current screen ── */
    function render(focus = true, dir: 'fwd' | 'back' = 'fwd') {
      const list = active();
      cur = Math.max(0, Math.min(cur, list.length - 1));
      const s = list[cur];
      sheet.dataset.dir = dir;
      sheet.dataset.step = s.dataset.q;
      screens.forEach((x) => { const on = x === s; x.hidden = !on; x.inert = !on; });
      const n = cur + 1, total = list.length;
      bar.style.setProperty('--p', String(n / total));
      count.innerHTML = `<b>${pad(n)}</b> / ${pad(total)}`;
      // screen readers hear the position as part of the question heading
      const h = s.querySelector<HTMLElement>('[data-h]')!;
      h.querySelector('.sr-only')?.remove();
      h.insertAdjacentHTML('afterbegin', `<span class="sr-only">Question ${n} of ${total}: </span>`);
      back.hidden = cur === 0;
      const last = cur === total - 1;
      send.hidden = !last;
      fine.hidden = !last;
      syncNext(s);
      const opts = s.querySelectorAll('input[type=radio]').length;
      hint.textContent = isChoice(s) ? `Press 1–${Math.min(opts, 9)} or Enter` : 'or press Enter ↵';
      chip.hidden = !(skip.has('package') && cur === 0);
      clearErr(s);
      status.textContent = '';
      mail.hidden = true;
      rail();
      if (focus) {
        // on desktop, typing should go straight into the first empty field; the legend still names the question
        const empty = !isChoice(s) && matchMedia('(pointer: fine)').matches ? [...s.querySelectorAll<HTMLInputElement>('.f:not([hidden]) input')].find((i) => !i.value) : null;
        (empty ?? h).focus({ preventScroll: true });
        $('.brief-main').scrollTop = 0;
        (window as any).gtag?.('event', 'lp_form_step', { step: s.dataset.q, n });
      }
    }

    // Continue: always on text screens; on choice screens a quiet ghost button once something is chosen
    function syncNext(s: HTMLElement) {
      const last = cur === active().length - 1;
      const choice = isChoice(s);
      next.hidden = last || (choice && !s.querySelector('input[type=radio]:checked'));
      next.classList.toggle('btn--ghost', choice);
      next.classList.toggle('btn--lime', !choice);
    }

    function go(delta: number) {
      const list = active(), s = list[cur];
      if (delta > 0) {
        const e = validate(s);
        if (e) { showErr(s, e); return; }
        if (cur === list.length - 1) return;
      }
      cur += delta;
      render(true, delta < 0 ? 'back' : 'fwd');
    }
    const firstOpen = () => { const i = active().findIndex((s) => validate(s)); return i < 0 ? active().length - 1 : i; };

    /* ── open / close the sheet ── */
    function open(pkg?: string, from?: HTMLElement | null) {
      opener = from ?? (document.activeElement as HTMLElement);
      if (pkg) {
        const r = form.querySelector<HTMLInputElement>(`input[name=package][value="${pkg}"]`);
        if (r) { r.checked = true; skip.add('package'); chip.querySelector('[data-chosen-label]')!.textContent = r.closest('label')?.dataset.chip ?? pkg; save(); }
      }
      cur = firstOpen();
      if (!sheet.open) {
        sheet.showModal();
        cleaned = false;
        document.documentElement.classList.add('brief-open');
        bus.lenis?.stop?.();
        openedAt ||= Date.now();
        idem ||= (crypto as any).randomUUID?.() ?? String(Math.random()).slice(2);
        loadRecaptcha().catch(() => {});
      }
      render(true);
    }
    openers.set(variant, open);
    // Cleanup runs directly from every way we close (×, Esc, navigation). The native 'close' event is only a
    // backup: it's queued, and can lag when the tab isn't painting.
    let cleaned = true;
    function cleanup() {
      if (cleaned) return;
      cleaned = true;
      document.documentElement.classList.remove('brief-open');
      bus.lenis?.start?.();
      clearTimeout(timer);
      // one tick later: on Esc, Chrome restores focus itself after our handler runs
      const o = opener; setTimeout(() => o?.focus?.({ preventScroll: true }), 0);
      syncCard();
    }
    function closeSheet() { if (sheet.open) sheet.close(); cleanup(); }
    sheet.addEventListener('close', cleanup);
    sheet.addEventListener('cancel', (e) => { e.preventDefault(); closeSheet(); }); // Esc / Android back
    sheet.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', closeSheet));
    document.addEventListener('astro:before-swap', closeSheet, { once: true });

    /* ── choices: pointer tap or number key advances; arrows only select ── */
    function advanceSoon() {
      clearTimeout(timer); // a quick correction restarts the timer instead of skipping a screen
      timer = window.setTimeout(() => go(1), reduced() ? 450 : 280);
    }
    form.addEventListener('click', (ev) => {
      const lab = (ev.target as Element).closest<HTMLLabelElement>('label.qt');
      if (!lab || ev.detail === 0) return; // keyboard-triggered clicks have detail 0
      const input = lab.querySelector<HTMLInputElement>('input[type=radio]');
      const s = lab.closest<HTMLElement>('[data-q]');
      if (!input || !s || !isChoice(s)) return;
      if (input.value === 'Other') return; // needs typing, so Continue appears instead
      if (desktop() && !reduced()) (window as any).__field?.ripple?.((ev as MouseEvent).clientX, (ev as MouseEvent).clientY, 0.35);
      requestAnimationFrame(() => { if (input.checked) advanceSoon(); });
    });
    form.addEventListener('change', (ev) => {
      const t = ev.target as HTMLInputElement;
      const s = t.closest<HTMLElement>('[data-q]');
      if (s) clearErr(s);
      conditional();
      if (t.type === 'radio' && s) {
        live.textContent = `${t.closest('label')?.querySelector('[data-opt]')?.textContent?.trim() ?? t.value} selected.`;
        syncNext(s);
        if (t.value === 'Other') form.querySelector<HTMLInputElement>('[name=industryOther]')?.focus();
      }
      if (t.name === 'email') {
        const fix = typoFix(t.value.trim());
        const box = $('[data-typo]'); box.hidden = !fix;
        if (fix) $('[data-typo-fix]').textContent = fix;
      }
      save(); rail();
    });
    form.addEventListener('input', (ev) => {
      const s = (ev.target as Element).closest<HTMLElement>('[data-q]');
      if (s && errEl(s).textContent) clearErr(s);
      save();
    });
    $('[data-typo-fix]').addEventListener('click', (ev) => {
      const e = form.querySelector<HTMLInputElement>('[name=email]')!;
      e.value = (ev.currentTarget as HTMLElement).textContent!;
      $('[data-typo]').hidden = true; save(); rail(); e.focus();
    });

    form.addEventListener('keydown', (ev) => {
      const s = active()[cur];
      const t = ev.target as HTMLElement & { type?: string };
      if (ev.key === 'Enter' && t.tagName !== 'TEXTAREA' && t.tagName !== 'BUTTON' && t.tagName !== 'A') {
        ev.preventDefault();
        // Enter moves to the next empty field on text screens, then continues
        const fields = [...s.querySelectorAll<HTMLInputElement>('.f:not([hidden]) input')];
        const i = fields.indexOf(t as HTMLInputElement);
        if (i >= 0 && i < fields.length - 1) { fields[i + 1].focus(); return; }
        if (send.hidden) go(1); else form.requestSubmit(send);
        return;
      }
      const typing = t.tagName === 'TEXTAREA' || (t.tagName === 'INPUT' && t.type !== 'radio');
      if (isChoice(s) && !typing && /^[1-9]$/.test(ev.key) && !ev.metaKey && !ev.ctrlKey && !ev.altKey) {
        const opt = s.querySelectorAll<HTMLInputElement>('input[type=radio]')[Number(ev.key) - 1];
        if (!opt) return;
        ev.preventDefault();
        opt.checked = true; opt.focus();
        opt.dispatchEvent(new Event('change', { bubbles: true }));
        if (opt.value !== 'Other') advanceSoon();
      }
    });

    next.addEventListener('click', () => { clearTimeout(timer); go(1); });
    back.addEventListener('click', () => { clearTimeout(timer); go(-1); });
    $('[data-note-toggle]').addEventListener('click', (ev) => {
      (ev.currentTarget as HTMLElement).hidden = true;
      $('[data-note]').hidden = false;
      form.querySelector<HTMLTextAreaElement>('[name=notes]')?.focus();
    });
    chip.querySelector('[data-change]')!.addEventListener('click', () => { skip.delete('package'); save(); cur = 0; render(true, 'back'); });
    sheet.querySelectorAll<HTMLButtonElement>('[data-jump]').forEach((b) => b.addEventListener('click', () => {
      const i = active().findIndex((s) => s.dataset.q === b.dataset.jump);
      if (i >= 0) { clearTimeout(timer); const d = i < cur ? 'back' : 'fwd'; cur = i; render(true, d); }
    }));

    /* ── send ── */
    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      if (sending) return; // double tap / double Enter
      for (const [i, x] of active().entries()) { const m = validate(x); if (m) { cur = i; render(); showErr(x, m); return; } }
      const s = active()[cur];
      if (!navigator.onLine) { showErr(s, MSG.offline); return; }

      const industry = val('industry') === 'Other' && val('industryOther') ? `Other: ${val('industryOther')}` : val('industry');
      const p = {
        variant, package: val('package'), packageFrom: skip.has('package') ? 'pricing' : 'asked', industry, goal: val('goal'),
        timeline: val('timeline'), styleVibe: val('styleVibe'), businessName: val('businessName'), facebookPage: val('facebookPage'),
        currentWebsite: val('goal') === 'replace' ? val('currentWebsite') : '', name: val('name'), email: val('email'),
        phone: val('phone'), notes: val('notes'), source, website: val('website'), t: openedAt ? Date.now() - openedAt : 0, idem,
      };
      sending = true;
      send.disabled = true;
      send.setAttribute('aria-busy', 'true');
      sendLabel.textContent = 'Sending your brief…';
      live.textContent = 'Sending your brief…';
      const slow = setTimeout(() => { live.textContent = status.textContent = 'Still sending. Your answers are saved.'; }, 8000);
      const ac = new AbortController();
      const kill = setTimeout(() => ac.abort(), 20000);
      try {
        const captchaToken = await captcha('lp_submit'); // '' if blocked or slow: never stops a lead
        let res: Response;
        try { res = await fetch('/api/lp-submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...p, captchaToken }), signal: ac.signal }); }
        catch { throw new Error(MSG.network); }
        if (!res.ok) throw new Error(MSG.network);
        (window as any).gtag?.('event', 'lp_form_submit', { package: p.package, variant });
        dispatchEvent(new CustomEvent('fz:lead', { detail: { form: 'lp', variant, package: p.package } }));
        success(p);
      } catch {
        status.textContent = '';
        showErr(s, MSG.network);
        // never lose the brief: offer it as a ready-written email
        const body = Object.entries(p).filter(([k, v]) => v && !['website', 't', 'idem', 'variant'].includes(k)).map(([k, v]) => `${k}: ${v}`).join('\n');
        $<HTMLAnchorElement>('[data-mail-link]').href = `mailto:info@fazeddigital.com?subject=${encodeURIComponent(`7-day brief: ${p.businessName || p.name}`)}&body=${encodeURIComponent(body)}`;
        mail.hidden = false;
        sending = false;
        send.disabled = false;
      } finally {
        clearTimeout(slow); clearTimeout(kill);
        send.removeAttribute('aria-busy');
        sendLabel.textContent = 'Send my 7-day brief';
      }
    });

    function success(p: { name: string; email: string; package: string; timeline: string; facebookPage: string }) {
      const ok = $('[data-ok]');
      const first = p.name.split(/\s+/)[0];
      ok.querySelector('[data-ok-lead]')!.textContent = p.timeline === 'exploring'
        ? `Thanks, ${first}. We’ll email ${p.email} within one business day with next steps. No pressure.`
        : p.package === 'unsure'
          ? `Thanks, ${first}. We’ll email ${p.email} within one business day with the package we’d suggest, a confirmed start date and what we need for Day 1.`
          : `Thanks, ${first}. We’ll email ${p.email} within one business day with your confirmed start date and what we need for Day 1.`;
      ok.querySelector<HTMLElement>('[data-ok-fb]')?.toggleAttribute('hidden', !(php && p.facebookPage));
      const m = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' }));
      const mins = m.getHours() * 60 + m.getMinutes();
      ok.querySelector<HTMLElement>('[data-ok-after]')!.hidden = m.getDay() > 0 && m.getDay() < 6 && mins >= 510 && mins < 1020;
      const now = new Date();
      ok.querySelector('[data-ok-stamp]')!.textContent = `SIGNAL RECEIVED · ${now.toLocaleDateString('en-PH', { timeZone: 'Asia/Manila' })} · ${now.toLocaleTimeString('en-PH', { timeZone: 'Asia/Manila', hour: '2-digit', minute: '2-digit' })} PHT`;
      form.hidden = true; chip.hidden = true; back.hidden = true;
      sheet.dataset.step = 'sent';
      ok.hidden = false;
      bar.style.setProperty('--p', '1');
      count.textContent = 'SENT';
      try { sessionStorage.removeItem(STORE); } catch {}
      root.querySelector<HTMLElement>('[data-card-ok]')!.hidden = false;
      root.querySelectorAll<HTMLElement>('.qf-card-pk, [data-resume], .qf-card-h, .qf-card-sub').forEach((e) => (e.hidden = true));
      ok.querySelector<HTMLElement>('[data-ok-h]')!.focus();
      (window as any).__field?.signal?.();
    }

    restore();
    render(false);
    syncCard();
  });

}

/** Called by the shell (lp-shell.ts) when a CTA, pricing button or start tile is clicked. */
export function openLp(variant: 'usd' | 'php', pkg?: string, from?: HTMLElement | null) {
  initLpForms();
  openers.get(variant)?.(pkg, from);
}

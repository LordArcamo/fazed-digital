// Website quiz engine (/quiz), Direction B "Lime Room". Plan: docs/marketing/quiz-lp-plan.md. Copy + scoring: copy/quiz.md.
// Content arrives as one JSON block from Quiz.astro (src/data/quiz.ts), so no data file, price or case import lands here.
// Q1 is server-rendered on the first screen (no Start gate). Same interaction model as the 7-day brief (lp.ts) through
// the shared helpers in steps.ts: a pointer tap or a number key picks and advances, arrows and Space only select,
// Enter continues, answers persist for the visit (sessionStorage).
// PREVIEW (local dev, localhost or ?preview): the email gate never calls the API; the payload is logged instead.
import { EMAIL, reduced, typoFix, numberKey, isTap, track } from './steps';
import { captcha, loadRecaptcha } from './captcha';
import { leadSource } from '../lib/source';
import { bus } from '../lib/bus';

type AreaId = 'first' | 'clarity' | 'trust' | 'persuasion' | 'ease';
type Ans = Record<string, string | string[]>;
interface Opt { v: string; label: string; pts?: number; coach?: string }
interface Q { id: string; n: string; kind: 'choice' | 'multi'; path?: string; area?: AreaId; none?: string; cap?: number; h: string; opts: Opt[] }
interface Fix { id: string; area: AreaId; problem: string; principleName: string; principle: string; note?: string; ex: Record<string, [string, string]> }
interface Band { id: string; min: number; name: string; h: string; summary: string; next: 'sevenday' | 'audit' | 'service' | 'seo' }
interface Card { h: string; body: string; cta: string; href: string }
interface Data {
  preview: boolean; emailLive: boolean; noSite: string[]; q: Q[]; areas: { id: AreaId; name: string }[]; priority: AreaId[];
  levels: { min: number; label: string }[]; fixes: Fix[]; bands: Band[]; bizPhrase: Record<string, string>;
  next: { sevenday: { h: string; body: { usd: string; php: string }; cta: string; href: { usd: string; php: string } }; audit: Card; branding: Card; web: Card; seo: Card };
  nosite: {
    h: string; summary: string; facebookPH: string; prices: Record<'usd' | 'php', Record<string, { name: string; price: string }>>;
    picks: Record<string, { pkg: string; name?: string; line: string }>; timeline: Record<string, string>;
  };
  cases: Record<string, { slugs: string[]; heading: 'match' | 'local' | 'any' }>;
  t: Record<string, string>; facts: { site: string[]; nosite: string[] }; msg: Record<string, string>;
}

const STORE = 'fz-quiz-v1';
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const tpl = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ''));
const LOCK = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><rect x="5" y="10.5" width="14" height="10" rx="2.5" fill="currentColor"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" fill="none" stroke="currentColor" stroke-width="2.2"/></svg>';

export function initQuiz(root: HTMLElement) {
  const D: Data = JSON.parse(root.querySelector('[data-quiz-data]')!.textContent!);
  const $ = <T extends Element = HTMLElement>(s: string) => root.querySelector<T>(s)!;
  const $$ = <T extends Element = HTMLElement>(s: string) => [...root.querySelectorAll<T>(s)];
  const form = $<HTMLFormElement>('[data-form]');
  const screens = $$('fieldset[data-q]');
  const room = $('[data-room]'), adding = $('[data-adding]'), res = $('[data-result]');
  const back = $<HTMLButtonElement>('[data-back]'), live = $('[data-live]'), hint = $('[data-hint]'), coach = $('[data-coach]');
  const gate = $<HTMLFormElement>('[data-gate]'), gateBtn = $<HTMLButtonElement>('[data-gate-btn]');
  const Q = new Map(D.q.map((q) => [q.id, q]));
  const FIX = new Map(D.fixes.map((f) => [f.id, f]));
  const AREA = new Map(D.areas.map((x) => [x.id, x.name]));
  const html = document.documentElement;
  const preview = D.preview || /[?&]preview\b/.test(location.search) || /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  root.classList.toggle('is-preview-badge', /[?&]preview\b/.test(location.search)); // the corner badge only with ?preview
  // market for prices and the lead tag: the site's geo flag (Base.astro), Australia from the time zone
  const tz = (() => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone; } catch { return ''; } })();
  const market = html.dataset.geo === 'ph' ? 'PH' : tz.startsWith('Australia/') ? 'AU' : 'US';
  const money = market === 'PH' ? 'php' : 'usd';

  let a: Ans = {}, cur = 0, timer = 0, coachT = 0, started = false, finished = false, unlocked = false, firstName = '', t0 = 0, dropSent = false, sending = false;
  let idem = '', pendingCoach = '', resumeAt = -1;

  /* ── state ── */
  const path = () => (D.noSite.includes(String(a.has ?? '')) ? 'nosite' : 'site');
  const active = () => screens.filter((s) => !s.dataset.path || s.dataset.path === path());
  const answered = (id: string) => { const v = a[id]; return Array.isArray(v) ? v.length > 0 : !!v; };
  const biz = () => String(a.biz || 'other');
  const view = () => root.dataset.view;
  function save() {
    try { sessionStorage.setItem(STORE, JSON.stringify({ a, step: active()[cur]?.dataset.q ?? '', finished, unlocked, name: firstName })); } catch {}
  }
  function restore() {
    let o: any = {};
    try { o = JSON.parse(sessionStorage.getItem(STORE) || '{}'); } catch {}
    a = o.a && typeof o.a === 'object' ? o.a : {};
    finished = !!o.finished; unlocked = !!o.unlocked; firstName = String(o.name || '');
    syncInputs();
    const i = active().findIndex((s) => s.dataset.q === o.step);
    return i;
  }
  function syncInputs() {
    form.querySelectorAll<HTMLInputElement>('input').forEach((i) => { const v = a[i.name]; i.checked = Array.isArray(v) ? v.includes(i.value) : v === i.value; });
  }

  /* ── views ── */
  function show(v: 'q' | 'adding' | 'result') {
    root.dataset.view = v;
    room.hidden = v !== 'q';
    adding.hidden = v !== 'adding';
    res.hidden = v !== 'result';
  }
  const toTop = () => { if (scrollY > 0) { if (bus.lenis) bus.lenis.scrollTo(0, { immediate: true, force: true }); else scrollTo(0, 0); } };

  /* ── one question per screen ── */
  function render(dir: 'fwd' | 'back' = 'fwd', focus = true) {
    const list = active();
    cur = Math.max(0, Math.min(cur, list.length - 1));
    const s = list[cur], q = Q.get(s.dataset.q!)!;
    root.dataset.dir = dir;
    root.dataset.step = cur === 0 ? 'first' : 'mid';
    screens.forEach((x) => { const on = x === s; x.hidden = !on; x.inert = !on; });
    const n = cur + 1, total = list.length, p = ((n - 0.5) / total) * 100;
    $('[data-count-n]').textContent = String(n);
    $('[data-count-of]').textContent = `${D.t.of} ${total}`;
    const area = q.area ? AREA.get(q.area)! : D.t.aboutYou;
    $('[data-count-chip]').textContent = total >= 10 && n === Math.ceil(total / 2) ? `${area} · ${D.t.halfway}` : area;
    $('[data-bar]').style.width = `${p}%`;
    $('[data-knob]').style.left = `${p}%`;
    back.hidden = cur === 0;
    const h = s.querySelector<HTMLElement>('[data-h]')!;
    h.querySelector('.sr-only')?.remove();
    h.insertAdjacentHTML('afterbegin', `<span class="sr-only">Question ${n} of ${total}: </span>`);
    const qh = s.querySelector<HTMLElement>('[data-qhint]');
    if (qh) { qh.dataset.base ??= qh.textContent!; qh.textContent = a.has === 'building' && qh.dataset.alt ? qh.dataset.alt : qh.dataset.base!; }
    hint.textContent = tpl(D.t.hint, { n: Math.min(s.querySelectorAll('input').length, 9) });
    clearErr(s);
    say(dir === 'fwd' ? pendingCoach : '');
    pendingCoach = '';
    if (cur > 0) toTop();
    if (focus) h.focus({ preventScroll: true });
  }
  // micro-feedback: a chip at the top of the next screen for about 1.5 s; a polite live region, never blocks a tap
  function say(line: string) {
    clearTimeout(coachT);
    coach.textContent = line;
    coach.classList.toggle('is-on', !!line);
    if (line) coachT = window.setTimeout(() => coach.classList.remove('is-on'), 1700);
  }
  const coachFor = (q: Q) => {
    const v = a[q.id];
    if (q.kind === 'multi') return Array.isArray(v) && v.length >= 3 && !v.includes(q.none!) ? D.t.coachProof : q.opts.find((o) => o.v === q.none && v?.includes(o.v))?.coach ?? '';
    return q.opts.find((o) => o.v === v)?.coach ?? '';
  };
  const errEl = (s: HTMLElement) => s.querySelector<HTMLElement>('[data-err]')!;
  function clearErr(s: HTMLElement) { errEl(s).textContent = ''; s.querySelectorAll('[aria-invalid]').forEach((i) => i.removeAttribute('aria-invalid')); }
  function go(delta: number) {
    clearTimeout(timer);
    const list = active(), s = list[cur], id = s.dataset.q!;
    if (delta < 0) {
      if (cur === 0) return;
      cur--; save(); render('back'); return;
    }
    if (!answered(id)) {
      errEl(s).textContent = Q.get(id)!.kind === 'multi' ? D.msg.multi : D.msg.pick;
      s.querySelectorAll('input').forEach((i) => i.setAttribute('aria-invalid', 'true'));
      return;
    }
    if (!started) { started = true; t0 = Date.now(); track('quiz_start', { market, resume: false }); }
    $('[data-resume-row]').hidden = true;
    pendingCoach = coachFor(Q.get(id)!);
    if (cur === list.length - 1) return finish();
    cur++; save(); render('fwd');
  }
  // the selected slab shows for 250 ms (it presses down), then the next question; instant with reduced motion
  function advanceSoon() {
    clearTimeout(timer); // a quick correction restarts the timer instead of skipping a screen
    timer = window.setTimeout(() => go(1), reduced() ? 0 : 250);
  }

  /* ── answers ── */
  form.addEventListener('change', (ev) => {
    const t = ev.target as HTMLInputElement, s = t.closest<HTMLElement>('fieldset[data-q]');
    if (!s) return;
    const q = Q.get(s.dataset.q!)!;
    clearErr(s);
    const text = t.closest('label')?.querySelector('[data-opt]')?.textContent?.trim() ?? t.value;
    if (t.type === 'radio') {
      a[q.id] = t.value;
      live.textContent = `${text} selected.`;
      track('quiz_answer', { q: q.n, a: t.value, n: cur + 1, path: path() });
    } else {
      // "Nothing yet" clears the others, and any real answer clears "Nothing yet"
      const boxes = [...s.querySelectorAll<HTMLInputElement>('input[type=checkbox]')];
      if (t.checked) boxes.forEach((b) => { if (b !== t && (t.value === q.none || b.value === q.none)) b.checked = false; });
      a[q.id] = boxes.filter((b) => b.checked).map((b) => b.value);
      live.textContent = `${text} ${t.checked ? 'ticked' : 'unticked'}.`;
    }
    if (q.id === 'has') {
      // switching branch drops the other branch's answers
      const other = path() === 'site' ? 'nosite' : 'site';
      D.q.filter((x) => x.path === other).forEach((x) => delete a[x.id]);
      syncInputs();
    }
    save();
  });
  form.addEventListener('click', (ev) => {
    const lab = (ev.target as Element).closest<HTMLLabelElement>('label.slab');
    if (!lab || !isTap(ev as MouseEvent)) return; // keyboard clicks (Space) only select
    const input = lab.querySelector<HTMLInputElement>('input[type=radio]');
    if (input) requestAnimationFrame(() => { if (input.checked) advanceSoon(); });
  });
  // keys work from anywhere on a question screen (on arrival nothing is focused yet): 1–9 answer, Enter continues
  const onKey = (ev: KeyboardEvent) => {
    if (view() !== 'q' || !root.isConnected) return;
    const t = ev.target as HTMLElement;
    const s = active()[cur];
    if (!s) return;
    if (ev.key === 'Enter') {
      if (!form.contains(t) || t.tagName === 'BUTTON' || t.tagName === 'A') return;
      ev.preventDefault(); go(1); return;
    }
    const opt = numberKey(ev, s.querySelectorAll<HTMLInputElement>('input'));
    if (!opt) return;
    ev.preventDefault();
    if (opt.type === 'checkbox') opt.checked = !opt.checked; else opt.checked = true;
    opt.focus({ preventScroll: true });
    opt.dispatchEvent(new Event('change', { bubbles: true }));
    if (opt.type === 'radio') advanceSoon();
  };
  document.addEventListener('keydown', onKey);
  document.addEventListener('astro:before-swap', () => document.removeEventListener('keydown', onKey), { once: true });
  form.addEventListener('submit', (ev) => { ev.preventDefault(); go(1); });
  form.querySelectorAll('[data-next]').forEach((b) => b.addEventListener('click', () => go(1)));
  back.addEventListener('click', () => go(-1));

  /* ── scoring (copy/quiz.md §2, §4) ── */
  const pts = (id: string) => {
    const q = Q.get(id)!, v = a[id];
    if (q.kind === 'multi') return Math.min(q.cap ?? 3, (Array.isArray(v) ? v : []).filter((x) => (q.opts.find((o) => o.v === x)?.pts ?? 0) > 0).length);
    return q.opts.find((o) => o.v === v)?.pts ?? 0;
  };
  // which fix shows for an area: the one tied to its lower-scoring question (ties → the first fix listed)
  function fixFor(area: AreaId): string {
    const p = pts;
    if (area === 'first') return p('brand') < p('first') ? 'FI-2' : 'FI-1';
    if (area === 'clarity') return p('voice') < p('headline') ? 'CL-2' : 'CL-1';
    if (area === 'trust') {
      if (p('photos') < p('proof')) return 'TR-2';
      if (p('proof') <= 1) return 'TR-1';
      const g = Array.isArray(a.proof) && a.proof.includes('guarantee');
      return !g && p('photos') === 3 ? 'TR-3' : 'TR-1';
    }
    if (area === 'persuasion') return p('price') < p('cta') ? 'PE-3' : a.cta === 'noreason' ? 'PE-2' : 'PE-1';
    return p('find') < p('reach') ? 'EA-2' : 'EA-1';
  }
  function score() {
    const per = D.areas.map((ar) => {
      const got = D.q.filter((q) => q.area === ar.id).reduce((n, q) => n + pts(q.id), 0);
      return { ...ar, got, max: 6, fix: fixFor(ar.id) };
    });
    const raw = per.reduce((n, x) => n + x.got, 0);
    const total = Math.round((raw / 30) * 100);
    const band = D.bands.find((b) => total >= b.min)!;
    const weak = per.filter((x) => x.got < x.max).sort((x, y) => x.got - y.got || D.priority.indexOf(x.id) - D.priority.indexOf(y.id)).slice(0, 3);
    return { per, total, band, weak };
  }
  const label = (id: string) => { const v = a[id]; return (Array.isArray(v) ? v : [v]).map((x) => Q.get(id)?.opts.find((o) => o.v === x)?.label ?? x).join(', '); };
  const level = (got: number) => D.levels.find((l) => got >= l.min)!.label;

  /* ── result ── */
  function finish() {
    finished = true;
    save();
    // "Adding up your answers…": under a second, so the score feels earned (shorter with reduced motion)
    $('[data-adding-t]').textContent = path() === 'site' ? D.t.coachLast : D.t.adding;
    show('adding');
    toTop();
    pendingCoach = '';
    window.setTimeout(() => {
      renderResult(true);
      show('result');
      toTop();
      $('[data-res-h]').focus({ preventScroll: true });
      const r = score();
      track('quiz_result', path() === 'site' ? { path: 'site', score: r.total, band: r.band.id, biz: biz(), market } : { path: 'nosite', biz: biz(), market });
    }, reduced() ? 300 : 850);
  }

  function nextCard(id: 'sevenday' | 'audit' | 'branding' | 'web' | 'seo') {
    const c = id === 'sevenday'
      ? { h: D.next.sevenday.h, body: D.next.sevenday.body[money], cta: D.next.sevenday.cta, href: D.next.sevenday.href[money] }
      : D.next[id];
    $('[data-next-h]').textContent = c.h;
    $('[data-next-b]').textContent = c.body;
    $('[data-next-cta]').textContent = c.cta;
    const l = $<HTMLAnchorElement>('[data-next-link]');
    l.href = c.href; l.dataset.nextLink = id;
  }

  function renderResult(animate: boolean) {
    const site = path() === 'site', r = score();
    res.dataset.path = site ? 'site' : 'nosite';
    res.dataset.band = site ? r.band.id : 'nosite';
    $('[data-res-label]').textContent = site ? D.t.label : D.t.nosLabel;
    $('[data-building]').hidden = !(site && a.has === 'building');
    if (site) {
      $('[data-band-name]').textContent = r.band.name;
      $('[data-res-h-t]').textContent = r.band.h;
      $('[data-res-sum]').textContent = r.band.summary;
      $('[data-score-sr]').textContent = `Based on your answers, your website scores ${r.total} out of 100: ${r.band.name}. `;
      countUp($('[data-score]'), r.total, animate);
      r.per.forEach((x) => {
        const row = root.querySelector<HTMLElement>(`[data-area-row="${x.id}"]`)!;
        row.querySelectorAll('.qz-meter i').forEach((i, k) => i.classList.toggle('on', k < x.got));
        row.querySelector('[data-area-l]')!.textContent = level(x.got);
        row.querySelector('[data-area-v]')!.textContent = `${x.got}/${x.max}`;
        row.classList.toggle('is-low', x.got <= 2); // "Needs work"
      });
      // secondary CTA by band; band 3 points at the service page for the weakest area
      nextCard(r.band.next === 'service' ? (r.weak[0]?.id === 'first' && r.weak[0].fix === 'FI-2' ? 'branding' : 'web') : r.band.next);
    } else {
      $('[data-res-h-t]').textContent = D.nosite.h;
      $('[data-res-sum]').textContent = D.nosite.summary;
      $('[data-score-sr]').textContent = '';
      const goal = String(a.goal || 'calls');
      const pick = D.nosite.picks[goal === 'calls' && a.who === 'far' ? 'callsFar' : goal] ?? D.nosite.picks.calls;
      const pk = pick.pkg ? D.nosite.prices[money][pick.pkg] : null;
      $('[data-plan-name]').textContent = pk ? `${pk.name},` : pick.name ?? '';
      $('[data-plan-price]').textContent = pk ? pk.price : '';
      $('[data-plan-line]').textContent = pick.line;
      $('[data-plan-fb]').hidden = !(a.has === 'facebook' && market === 'PH');
      $('[data-plan-when]').textContent = D.nosite.timeline[String(a.when)] ?? '';
      $('[data-plan-dl]').innerHTML = ['has', 'biz', 'goal', 'who', 'when'].filter(answered).map((id) => `<div><dt>${esc(Q.get(id)!.h)}</dt><dd>${esc(label(id))}</dd></div>`).join('');
      nextCard('sevenday');
    }
    renderFixes(false);
    // 2–3 real cases matched to the business type, honestly labelled
    const pick = D.cases[biz()] ?? D.cases.other, list = $('[data-cases]');
    $$('[data-case]').forEach((c) => (c.hidden = true));
    pick.slugs.forEach((slug) => { const c = root.querySelector<HTMLElement>(`[data-case="${slug}"]`); if (c) { c.hidden = false; list.appendChild(c); } });
    $('[data-cases-h]').textContent = pick.heading === 'match' ? D.t.casesMatch : pick.heading === 'local' ? D.t.casesLocal : D.t.casesAny;
  }

  // the 3 fixes: problem line free; the real before/after blurred (and hidden from screen readers) until the email
  function renderFixes(fresh: boolean) {
    const site = path() === 'site', r = score(), b = biz() === 'other' ? 'pro' : biz(), phrase = D.bizPhrase[biz()] ?? D.bizPhrase.other;
    const none = site && r.weak.length === 0;
    $('[data-fixes-h]').textContent = none ? D.t.noFixesH : D.t.fixesH;
    $('[data-fixes-sub]').textContent = none ? D.t.noFixesSub : unlocked ? tpl(D.t.fixesSubDone, { biz: phrase }) : D.t.fixesSub;
    $('[data-gate-line]').textContent = tpl(D.t.gateLine, { biz: phrase });
    $('[data-fixes]').innerHTML = !site ? '' : r.weak.map((w, i) => {
      const f = FIX.get(w.fix)!, [before, after] = f.ex[b] ?? f.ex.pro, lockd = !unlocked;
      const t = (s: string) => `<span class="qz-ba-t${lockd ? ' is-blur' : ''}"${lockd ? ' aria-hidden="true"' : ''}>${esc(s)}</span>`;
      return `<article class="qz-fix${fresh ? ' is-new' : ''}" style="--n:${i}">
        <p class="qz-fix-k"><span class="qz-fix-n">${i + 1}</span><span>${esc(w.name)}</span><span class="qz-fix-s">${w.got}/${w.max}</span></p>
        <h3 class="qz-fix-h">“${esc(f.problem)}”</h3>
        <div class="qz-ba">
          <p class="qz-ba-row qz-ba-before"><span class="qz-ba-l">${esc(D.t.before)}</span>${t(before)}</p>
          <p class="qz-ba-row qz-ba-after"><span class="qz-ba-l">${esc(D.t.after)}</span>${t(after)}</p>
          ${lockd ? `<p class="qz-ba-lock">${LOCK}<span>${esc(tpl(D.t.lockLine, { biz: phrase }))}</span><span class="sr-only"> ${esc(D.t.lockedSr)}</span></p>` : ''}
        </div>
        ${lockd ? '' : `<p class="qz-fix-why"><b>${esc(D.t.why)}: ${esc(f.principleName.toLowerCase())}.</b> ${esc(f.principle)}</p>${f.note ? `<p class="qz-fix-note">${esc(f.note)}</p>` : ''}`}
      </article>`;
    }).join('');
    gate.hidden = !site || none || unlocked;
    const done = $('[data-gate-done]');
    done.hidden = !unlocked || !site;
    if (unlocked) $('[data-done-h]').innerHTML = esc(tpl(D.t.doneH, { name: firstName || 'there', email: gval('email') || 'your inbox' })).replace(/^(Done, [^.]*\.)/, '<b>$1</b>');
    // the Book card: "Want help with them?" once the fixes are open; facts for the path
    $$('[data-book-h]').forEach((h) => (h.textContent = unlocked && site ? D.t.helpH : h.dataset.bookH === 'rail' ? D.t.bookRail : D.t.bookInline));
    $$('[data-book-sub]').forEach((p) => (p.hidden = !(unlocked && site)));
    $$('[data-spam]').forEach((p) => (p.hidden = !(unlocked && site && D.emailLive)));
    $$('[data-book-facts]').forEach((ul) => (ul.innerHTML = (site ? D.facts.site : D.facts.nosite).map((f) => `<li>${esc(f)}</li>`).join('')));
  }

  function countUp(el: HTMLElement, to: number, animate: boolean) {
    if (!animate || reduced()) { el.textContent = String(to); return; }
    const t = performance.now(), ms = 900;
    const step = (now: number) => {
      const k = Math.min(1, (now - t) / ms);
      el.textContent = String(Math.round(to * (1 - Math.pow(1 - k, 3))));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ── the email gate ── */
  const gval = (n: string) => String(new FormData(gate).get(n) ?? '').trim();
  const gerr = $('[data-gate-err]');
  function gateError(m: string, field?: string) {
    gerr.textContent = m;
    gate.querySelectorAll('[aria-invalid]').forEach((i) => { i.removeAttribute('aria-invalid'); i.removeAttribute('aria-describedby'); });
    const i = field ? gate.querySelector<HTMLInputElement>(`[name="${field}"]`) : null;
    if (i) { i.setAttribute('aria-invalid', 'true'); i.setAttribute('aria-describedby', gerr.id); i.focus(); }
  }
  gate.addEventListener('focusin', () => { idem ||= (crypto as any).randomUUID?.() ?? String(Math.random()).slice(2); if (!preview) loadRecaptcha().catch(() => {}); }, { once: true });
  gate.addEventListener('change', (ev) => {
    const t = ev.target as HTMLInputElement;
    if (t.name !== 'email') return;
    const fix = typoFix(t.value.trim()), box = $('[data-typo]');
    box.hidden = !fix;
    if (fix) $('[data-typo-fix]').textContent = fix;
  });
  $('[data-typo-fix]').addEventListener('click', (ev) => {
    const e = gate.querySelector<HTMLInputElement>('[name=email]')!;
    e.value = (ev.currentTarget as HTMLElement).textContent!;
    $('[data-typo]').hidden = true; e.focus();
  });
  // the optional website field stays folded behind "+ Add your website (optional)" so it never looks required
  $('[data-site-add]').addEventListener('click', (ev) => {
    (ev.currentTarget as HTMLElement).hidden = true;
    $('[data-site-fld]').hidden = false;
    gate.querySelector<HTMLInputElement>('[name=currentWebsite]')!.focus();
  });
  gate.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    if (sending) return;
    const name = gval('name'), email = gval('email'), url = gval('currentWebsite');
    if (!name) return gateError(D.msg.name, 'name');
    if (!email) return gateError(D.msg.emailBlank, 'email');
    if (!EMAIL.test(email)) return gateError(D.msg.emailBad, 'email');
    if (url && !/^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/i.test(url)) return gateError(D.msg.site, 'currentWebsite');
    if (!preview && !navigator.onLine) return gateError(D.msg.offline);
    gateError('');
    const r = score();
    const answers = active().map((s) => s.dataset.q!).filter(answered)
      .map((id) => { const q = Q.get(id)!; return `${q.n}. ${q.h} → ${label(id)}${q.area ? ` (${pts(id)}/3)` : ''}`; }).join('\n');
    const p = {
      kind: 'quiz', name, email, currentWebsite: url, market, path: 'site',
      score: r.total, band: r.band.name, business: label('biz'), hasSite: label('has'),
      weakest: r.weak.map((w) => `${w.name} ${w.got}/6 (${w.fix})`).join(', '), answers,
      source: `quiz · ${leadSource()}`, website: gval('fz_check'), t: t0 ? Date.now() - t0 : 0, idem,
    };
    sending = true;
    gateBtn.disabled = true;
    gateBtn.setAttribute('aria-busy', 'true');
    const lbl = $('[data-gate-label]'), was = lbl.textContent;
    lbl.textContent = D.t.gateSending;
    try {
      if (preview) {
        console.info('[quiz] PREVIEW: nothing was sent. This is what /api/lp-submit would get:', p);
        await new Promise((ok) => setTimeout(ok, 350));
      } else {
        const captchaToken = await captcha('quiz_submit'); // '' if blocked or slow: never stops a lead
        const ac = new AbortController(), kill = setTimeout(() => ac.abort(), 20000);
        let resp: Response;
        try { resp = await fetch('/api/lp-submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...p, captchaToken }), signal: ac.signal }); }
        finally { clearTimeout(kill); }
        if (!resp.ok) throw new Error('send');
      }
      unlocked = true; firstName = name.split(/\s+/)[0];
      save();
      track('quiz_email', { band: r.band.id, score: r.total, market, preview });
      dispatchEvent(new CustomEvent('fz:lead', { detail: { form: 'quiz', band: r.band.id } }));
      renderFixes(true);
      // focus the confirmation (not the vanished button), and bring it into view
      const done = $('[data-done-h]');
      done.focus({ preventScroll: true });
      done.closest('[data-gate-done]')!.scrollIntoView({ block: 'start', behavior: reduced() ? 'auto' : 'smooth' });
    } catch {
      gateError(D.msg.network);
    } finally {
      sending = false;
      gateBtn.disabled = false;
      gateBtn.removeAttribute('aria-busy');
      lbl.textContent = was;
    }
  });

  /* ── CTAs, share, retake (the bar's "Book a call" pill sits outside the quiz root) ── */
  const onClick = (ev: MouseEvent) => {
    const t = ev.target as Element;
    const book = t.closest<HTMLElement>('[data-book]');
    if (book) track('quiz_book_click', { from: book.dataset.book || '', band: finished ? String(res.dataset.band) : 'none', market });
    const nx = t.closest<HTMLElement>('[data-next-link]');
    if (nx) track(nx.dataset.nextLink === 'sevenday' ? 'quiz_7day_click' : 'quiz_next_click', { to: nx.dataset.nextLink || '', band: String(res.dataset.band), market });
    const cs = t.closest<HTMLElement>('[data-case-link]');
    if (cs) track('quiz_case_click', { slug: cs.closest<HTMLElement>('[data-case]')?.dataset.case ?? '' });
  };
  document.addEventListener('click', onClick);
  document.addEventListener('astro:before-swap', () => document.removeEventListener('click', onClick), { once: true });
  $('[data-retake]').addEventListener('click', () => {
    track('quiz_retake', { band: String(res.dataset.band) });
    a = {}; cur = 0; finished = false; started = false; dropSent = false;
    syncInputs(); save();
    show('q'); render('back'); toTop();
  });
  $('[data-share]').addEventListener('click', async () => {
    const url = `${location.origin}${location.pathname}`, note = $('[data-share-note]');
    try {
      if (navigator.share) await navigator.share({ title: document.title.split('|')[0].trim(), text: D.t.shareText, url });
      else { await navigator.clipboard.writeText(`${D.t.shareText} ${url}`); note.textContent = D.t.shared; setTimeout(() => (note.textContent = ''), 2400); }
      track('quiz_share', { band: String(res.dataset.band) });
    } catch {}
  });
  // saved answers: a small "Continue where you left off" line above Q1
  $('[data-resume]').addEventListener('click', () => {
    if (resumeAt < 0) return;
    started = true; t0 = Date.now(); track('quiz_start', { market, resume: true });
    $('[data-resume-row]').hidden = true;
    cur = resumeAt; render('fwd'); save();
  });
  $('[data-restart]').addEventListener('click', () => {
    a = {}; cur = 0; syncInputs(); save();
    $('[data-resume-row]').hidden = true;
    render('back');
  });

  // drop-off: the step they were on when they left (once per hide)
  const drop = () => {
    if (!started || finished || dropSent) return;
    dropSent = true;
    track('quiz_dropoff', { step: active()[cur]?.dataset.q ?? 'has', n: cur + 1, market });
  };
  addEventListener('pagehide', drop);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') drop(); else dropSent = false; });
  document.addEventListener('astro:before-swap', drop, { once: true });

  /* ── boot: Q1 is already on screen ── */
  const tapped = form.querySelector<HTMLInputElement>('input[name=has]:checked')?.value; // tapped before the engine loaded
  const savedAt = restore();
  if (finished) { renderResult(false); show('result'); }
  else {
    cur = 0;
    show('q');
    render('fwd', false);
    if (savedAt > 0) {
      resumeAt = savedAt;
      $('[data-resume-label]').textContent = `${D.t.resume} · ${savedAt + 1} ${D.t.of} ${active().length}`;
      $('[data-resume-row]').hidden = false;
    }
    if (tapped && !finished) {
      const i = form.querySelector<HTMLInputElement>(`input[name=has][value="${tapped}"]`)!;
      i.checked = true; i.dispatchEvent(new Event('change', { bubbles: true })); advanceSoon();
    }
  }
  root.classList.add('is-ready');
}

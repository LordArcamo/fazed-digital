// Website quiz engine (/quiz). Plan: docs/marketing/quiz-lp-plan.md. Copy + scoring rules: copy/quiz.md.
// Content arrives as one JSON block from Quiz.astro (src/data/quiz.ts), so no data file, price or case import lands here.
// Same interaction model as the 7-day brief (lp.ts) through the shared helpers in steps.ts: a pointer tap or a number key
// picks and advances, arrow keys and Space only select, Enter continues, answers persist for the visit (sessionStorage).
// PREVIEW (local dev, localhost or ?preview): the email gate never calls the API; the payload is logged instead.
import { EMAIL, reduced, desktop, typoFix, numberKey, isTap, track } from './steps';
import { captcha, loadRecaptcha } from './captcha';
import { leadSource } from '../lib/source';
import { bus } from '../lib/bus';

type AreaId = 'first' | 'clarity' | 'trust' | 'persuasion' | 'ease';
type Ans = Record<string, string | string[]>;
interface Opt { v: string; label: string; pts?: number; coach?: string }
interface Q { id: string; n: string; kind: 'choice' | 'multi'; path?: string; area?: AreaId; none?: string; cap?: number; h: string; hint?: string; hintBuilding?: string; opts: Opt[] }
interface Fix { id: string; area: AreaId; problem: string; principleName: string; principle: string; note?: string; ex: Record<string, [string, string]> }
interface Band { id: string; min: number; name: string; h: string; summary: string; next: 'sevenday' | 'audit' | 'service' | 'seo' }
interface Card { h: string; body: string; cta: string; href: string }
interface Data {
  preview: boolean; emailLive: boolean; noSite: string[]; q: Q[]; areas: { id: AreaId; name: string }[]; priority: AreaId[];
  levels: { min: number; label: string }[]; fixes: Fix[]; bands: Band[]; bizPhrase: Record<string, string>;
  next: { sevenday: { h: string; body: { usd: string; php: string }; cta: string; href: { usd: string; php: string } }; audit: Card; branding: Card; web: Card; seo: Card };
  nosite: {
    h: string; summary: string; fixed: string; facebookPH: string; prices: Record<'usd' | 'php', Record<string, { name: string; price: string }>>;
    picks: Record<string, { pkg: string; name?: string; line: string }>; timeline: Record<string, string>;
  };
  cases: Record<string, { slugs: string[]; heading: 'match' | 'local' | 'any' }>;
  t: Record<string, string>; msg: Record<string, string>;
}

const STORE = 'fz-quiz-v1';
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const tpl = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ''));

export function initQuiz(root: HTMLElement) {
  const D: Data = JSON.parse(root.querySelector('[data-quiz-data]')!.textContent!);
  const $ = <T extends Element = HTMLElement>(s: string) => root.querySelector<T>(s)!;
  const form = $<HTMLFormElement>('[data-form]');
  const screens = [...form.querySelectorAll<HTMLElement>('fieldset[data-q]')];
  const startEl = $('[data-start-screen]'), top = $('[data-top]'), bar = $('[data-bar]'), count = $('[data-count]');
  const back = $<HTMLButtonElement>('[data-back]'), live = $('[data-live]'), res = $('[data-result]'), hint = $('[data-hint]');
  const coach = $('[data-coach]'), adding = $('[data-adding]');
  const gate = $<HTMLFormElement>('[data-gate]'), gateBtn = $<HTMLButtonElement>('[data-gate-btn]');
  const Q = new Map(D.q.map((q) => [q.id, q]));
  const FIX = new Map(D.fixes.map((f) => [f.id, f]));
  const html = document.documentElement;
  const preview = D.preview || /[?&]preview\b/.test(location.search) || /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  root.classList.toggle('is-preview', preview);
  // market for prices and the lead tag: the site's geo flag (Base.astro), Australia from the time zone
  const tz = (() => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone; } catch { return ''; } })();
  const market = html.dataset.geo === 'ph' ? 'PH' : tz.startsWith('Australia/') ? 'AU' : 'US';
  const money = market === 'PH' ? 'php' : 'usd';

  let a: Ans = {}, cur = 0, timer = 0, coachT = 0, started = false, finished = false, unlocked = false, firstName = '', t0 = 0, dropSent = false, sending = false;
  let idem = '', pendingCoach = '';

  /* ── state ── */
  const path = () => (D.noSite.includes(String(a.has ?? '')) ? 'nosite' : 'site');
  const active = () => screens.filter((s) => !s.dataset.path || s.dataset.path === path());
  const answered = (id: string) => { const v = a[id]; return Array.isArray(v) ? v.length > 0 : !!v; };
  const biz = () => String(a.biz || 'other');
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
    cur = i >= 0 ? i : 0;
    return Object.keys(a).length;
  }
  function syncInputs() {
    form.querySelectorAll<HTMLInputElement>('input').forEach((i) => { const v = a[i.name]; i.checked = Array.isArray(v) ? v.includes(i.value) : v === i.value; });
  }

  /* ── views ── */
  function show(view: 'start' | 'q' | 'adding' | 'result') {
    root.dataset.view = view;
    // the consent banner waits while a question is on screen (on phones it covered the answers and "Done, next");
    // it shows on the start screen and the result. GA stays off until consent either way (boot/cookies.ts).
    html.classList.toggle('quiz-q', view === 'q' || view === 'adding');
    startEl.hidden = view !== 'start';
    form.hidden = view !== 'q';
    top.hidden = view !== 'q';
    adding.hidden = view !== 'adding';
    res.hidden = view !== 'result';
    const y = Math.max(0, root.getBoundingClientRect().top + scrollY - 8);
    if (scrollY > y) { if (bus.lenis) bus.lenis.scrollTo(y, { immediate: true, force: true }); else scrollTo(0, y); }
  }

  /* ── one question per screen ── */
  function render(dir: 'fwd' | 'back' = 'fwd', focus = true) {
    const list = active();
    cur = Math.max(0, Math.min(cur, list.length - 1));
    const s = list[cur], q = Q.get(s.dataset.q!)!;
    root.dataset.dir = dir;
    screens.forEach((x) => { const on = x === s; x.hidden = !on; x.inert = !on; });
    const n = cur + 1, total = list.length;
    bar.style.setProperty('--p', String(cur / total));
    count.innerHTML = `<b>${n}</b> ${D.t.of} ${total}`;
    const h = s.querySelector<HTMLElement>('[data-h]')!;
    h.querySelector('.sr-only')?.remove();
    h.insertAdjacentHTML('afterbegin', `<span class="sr-only">Question ${n} of ${total}: </span>`);
    const qh = s.querySelector<HTMLElement>('[data-qhint]');
    if (qh) { qh.dataset.base ??= qh.textContent!; qh.textContent = a.has === 'building' && qh.dataset.alt ? qh.dataset.alt : qh.dataset.base; }
    const opts = Math.min(s.querySelectorAll('input').length, 9);
    hint.textContent = tpl(q.kind === 'multi' ? D.t.hintMulti : D.t.hint, { n: opts });
    clearErr(s);
    if (dir === 'fwd' && pendingCoach) say(pendingCoach); else say('');
    pendingCoach = '';
    if (focus) h.focus({ preventScroll: true });
  }
  // micro-feedback: about 1.5 s at the top of the next screen; a polite live region, never blocks a tap
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
      if (cur === 0) { show('start'); $('[data-go]').focus({ preventScroll: true }); return; }
      cur--; save(); render('back'); return;
    }
    if (!answered(id)) {
      errEl(s).textContent = Q.get(id)!.kind === 'multi' ? D.msg.multi : D.msg.pick;
      s.querySelectorAll('input').forEach((i) => i.setAttribute('aria-invalid', 'true'));
      return;
    }
    pendingCoach = coachFor(Q.get(id)!);
    if (cur === list.length - 1) return finish();
    cur++; save(); render('fwd');
  }
  function advanceSoon() {
    clearTimeout(timer); // a quick correction restarts the timer instead of skipping a screen
    timer = window.setTimeout(() => go(1), reduced() ? 260 : 190);
  }

  function begin(resume: boolean) {
    if (!resume) { a = {}; cur = 0; finished = false; syncInputs(); }
    if (!started) { started = true; t0 = Date.now(); track('quiz_start', { resume, market }); }
    show('q');
    render('fwd');
    save();
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
    const lab = (ev.target as Element).closest<HTMLLabelElement>('label.qt');
    if (!lab || !isTap(ev as MouseEvent)) return; // keyboard clicks (Space) only select
    const input = lab.querySelector<HTMLInputElement>('input[type=radio]');
    if (!input) return;
    if (desktop() && !reduced()) (window as any).__field?.ripple?.((ev as MouseEvent).clientX, (ev as MouseEvent).clientY, 0.35);
    requestAnimationFrame(() => { if (input.checked) advanceSoon(); });
  });
  form.addEventListener('keydown', (ev) => {
    const s = active()[cur];
    if (!s) return;
    const t = ev.target as HTMLElement;
    if (ev.key === 'Enter' && t.tagName !== 'BUTTON' && t.tagName !== 'A') { ev.preventDefault(); go(1); return; }
    const opt = numberKey(ev, s.querySelectorAll<HTMLInputElement>('input'));
    if (!opt) return;
    ev.preventDefault();
    if (opt.type === 'checkbox') opt.checked = !opt.checked; else opt.checked = true;
    opt.focus();
    opt.dispatchEvent(new Event('change', { bubbles: true }));
    if (opt.type === 'radio') advanceSoon();
  });
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
    bar.style.setProperty('--p', '1');
    save();
    // "Adding up your answers…": under a second, so the score feels earned (shorter with reduced motion)
    $('[data-adding-t]').textContent = path() === 'site' ? D.t.coachLast : D.t.adding;
    show('adding');
    adding.focus?.();
    pendingCoach = '';
    window.setTimeout(() => {
      renderResult(true);
      show('result');
      $<HTMLElement>('[data-res-h]').focus({ preventScroll: true });
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
    $('[data-book-under]').textContent = site ? D.t.bookUnder : D.t.bookUnderNoSite;
    if (site) {
      $('[data-band-name]').textContent = r.band.name;
      $('[data-res-h-t]').textContent = r.band.h;
      $('[data-res-sum]').textContent = r.band.summary;
      $('[data-score-sr]').textContent = `Your website scores ${r.total} out of 100: ${r.band.name}. `;
      countUp($('[data-score]'), r.total, animate);
      r.per.forEach((x) => {
        const row = root.querySelector<HTMLElement>(`[data-area-row="${x.id}"]`)!;
        row.querySelectorAll('.qz-meter i').forEach((i, k) => i.classList.toggle('on', k < x.got));
        row.querySelector('[data-area-l]')!.textContent = level(x.got);
        row.querySelector('[data-area-v]')!.textContent = `${x.got}/${x.max}`;
        row.classList.toggle('is-weak', r.weak.some((w) => w.id === x.id));
      });
      // secondary CTA by band; band 3 points at the service page for the weakest area
      const nx = r.band.next === 'service' ? (r.weak[0]?.id === 'first' && r.weak[0].fix === 'FI-2' ? 'branding' : 'web') : r.band.next;
      nextCard(nx);
    } else {
      $('[data-res-h-t]').textContent = D.nosite.h;
      $('[data-res-sum]').textContent = D.nosite.summary;
      $('[data-score-sr]').textContent = '';
      const goal = String(a.goal || 'calls');
      const pick = D.nosite.picks[goal === 'calls' && a.who === 'far' ? 'callsFar' : goal] ?? D.nosite.picks.calls;
      const pk = pick.pkg ? D.nosite.prices[money][pick.pkg] : null;
      $('[data-plan-name]').textContent = pk ? pk.name : pick.name ?? '';
      $('[data-plan-price]').textContent = pk ? `${pk.price}` : '';
      $('[data-plan-line]').textContent = pick.line;
      $('[data-plan-fb]').hidden = !(a.has === 'facebook' && market === 'PH');
      $('[data-plan-when]').textContent = D.nosite.timeline[String(a.when)] ?? '';
      $('[data-plan-dl]').innerHTML = ['has', 'biz', 'goal', 'who', 'when'].filter(answered).map((id) => `<div><dt>${esc(Q.get(id)!.h)}</dt><dd>${esc(label(id))}</dd></div>`).join('');
      nextCard('sevenday');
    }
    renderFixes(false);
    // 2–3 real cases matched to the business type, honestly labelled
    const pick = D.cases[biz()] ?? D.cases.other, list = $('[data-cases]');
    root.querySelectorAll<HTMLElement>('[data-case]').forEach((c) => (c.hidden = true));
    pick.slugs.forEach((slug) => { const c = root.querySelector<HTMLElement>(`[data-case="${slug}"]`); if (c) { c.hidden = false; list.appendChild(c); } });
    $('[data-cases-h]').textContent = pick.heading === 'match' ? D.t.casesMatch : pick.heading === 'local' ? D.t.casesLocal : D.t.casesAny;
  }

  function renderFixes(fresh: boolean) {
    if (path() !== 'site') return;
    const r = score(), b = biz() === 'other' ? 'pro' : biz();
    const none = r.weak.length === 0;
    $('[data-fixes-h]').textContent = none ? D.t.noFixesH : D.t.fixesH;
    $('[data-fixes-sub]').textContent = none ? D.t.noFixesSub : D.t.fixesSub;
    $('[data-gate-line]').textContent = tpl(D.t.gateLine, { biz: D.bizPhrase[biz()] ?? D.bizPhrase.other });
    $('[data-fixes]').innerHTML = r.weak.map((w, i) => {
      const f = FIX.get(w.fix)!;
      const head = `<p class="mono qz-fx-k"><span>0${i + 1} · ${esc(w.name)}</span><span>${w.got}/${w.max}</span></p><p class="qz-fx-p">“${esc(f.problem)}”</p>`;
      if (!unlocked) return `<li class="qz-fx is-locked">${head}<div class="qz-fx-lock" aria-hidden="true"><i></i><i></i><i></i></div><p class="mono qz-fx-tag"><span class="qz-lock" aria-hidden="true"></span>${esc(D.t.locked)}</p></li>`;
      const [before, after] = f.ex[b] ?? f.ex.pro;
      return `<li class="qz-fx${fresh ? ' is-new' : ''}" style="--n:${i}">${head}<p class="mono">${esc(D.t.example)}</p><dl class="qz-ba"><div><dt class="mono">${esc(D.t.before)}</dt><dd>${esc(before)}</dd></div><div class="is-after"><dt class="mono">${esc(D.t.after)}</dt><dd>${esc(after)}</dd></div></dl><p class="qz-why"><b>${esc(D.t.why)}: ${esc(f.principleName.toLowerCase())}.</b> ${esc(f.principle)}</p>${f.note ? `<p class="qz-fx-note">${esc(f.note)}</p>` : ''}</li>`;
    }).join('');
    $('[data-gate-wrap]').hidden = none;
    gate.hidden = unlocked;
    $('[data-gate-done]').hidden = !unlocked;
    if (unlocked) $('[data-done-h]').textContent = tpl(D.t.doneH, { name: firstName || 'there', email: gval('email') || 'your inbox' });
  }

  function countUp(el: HTMLElement, to: number, animate: boolean) {
    if (!animate || reduced()) { el.textContent = String(to); return; }
    const t = performance.now(), ms = 800;
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
    gate.querySelectorAll('[aria-invalid]').forEach((i) => i.removeAttribute('aria-invalid'));
    const i = field ? gate.querySelector<HTMLInputElement>(`[name="${field}"]`) : null;
    if (i) { i.setAttribute('aria-invalid', 'true'); i.setAttribute('aria-describedby', gerr.id || (gerr.id = 'qz-gate-err')); i.focus(); }
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
      $('[data-done-h]').focus();
      (window as any).__field?.signal?.();
    } catch {
      gateError(D.msg.network);
    } finally {
      sending = false;
      gateBtn.disabled = false;
      gateBtn.removeAttribute('aria-busy');
      lbl.textContent = was;
    }
  });

  /* ── CTAs, share, retake ── */
  root.addEventListener('click', (ev) => {
    const t = ev.target as Element;
    const book = t.closest<HTMLElement>('[data-book]');
    if (book) track('quiz_book_click', { from: book.dataset.book || '', band: finished ? String(res.dataset.band) : 'none', market });
    const nx = t.closest<HTMLElement>('[data-next-link]');
    if (nx) track(nx.dataset.nextLink === 'sevenday' ? 'quiz_7day_click' : 'quiz_next_click', { to: nx.dataset.nextLink || '', band: String(res.dataset.band), market });
    const cs = t.closest<HTMLElement>('[data-case-link]');
    if (cs) track('quiz_case_click', { slug: cs.closest<HTMLElement>('[data-case]')?.dataset.case ?? '' });
  });
  $('[data-retake]').addEventListener('click', () => {
    track('quiz_retake', { band: String(res.dataset.band) });
    started = false; dropSent = false;
    begin(false);
  });
  $('[data-share]').addEventListener('click', async () => {
    const url = `${location.origin}${location.pathname}`, note = $('[data-share-note]');
    try {
      if (navigator.share) await navigator.share({ title: document.title.split('|')[0].trim(), text: D.t.shareText, url });
      else { await navigator.clipboard.writeText(`${D.t.shareText} ${url}`); note.textContent = D.t.shared; setTimeout(() => (note.textContent = ''), 2400); }
      track('quiz_share', { band: String(res.dataset.band) });
    } catch {}
  });

  /* ── start screen ── */
  $('[data-go]').addEventListener('click', () => begin(root.dataset.resume === '1'));
  $('[data-restart]').addEventListener('click', () => { root.dataset.resume = ''; $('[data-resume-row]').hidden = true; begin(false); });

  // drop-off: the step they were on when they left (once per hide)
  const drop = () => {
    if (!started || finished || dropSent) return;
    dropSent = true;
    track('quiz_dropoff', { step: active()[cur]?.dataset.q ?? 'start', n: cur + 1, market });
  };
  addEventListener('pagehide', drop);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') drop(); else dropSent = false; });
  document.addEventListener('astro:before-swap', () => { drop(); html.classList.remove('quiz-q'); }, { once: true });

  /* ── boot ── */
  const had = restore();
  if (finished) { renderResult(false); show('result'); }
  else if (had) {
    root.dataset.resume = '1';
    $('[data-resume-row]').hidden = false;
    $('[data-go-label]').textContent = `${D.t.resume} · ${cur + 1} ${D.t.of} ${active().length}`;
    show('start');
  } else show('start');
  root.classList.add('is-ready');
  if (root.dataset.pending) { delete root.dataset.pending; begin(root.dataset.resume === '1'); }
}

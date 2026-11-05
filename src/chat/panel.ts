// The chat panel, loaded on first open. A message log on a signal line: one node per message, like the dock's stations.
// The conversation lives in sessionStorage (this tab only). Text is only ever set as text nodes; links must pass isSitePath.
import css from './panel.css?inline';
import { BOT, LIMITS, isSitePath } from './links';
import { HEAD, fazzyRows, sprite } from './fazzy';
import { bus } from '../lib/bus';
import { leadSource } from '../lib/source';

interface Msg { role: 'user' | 'assistant'; content: string; sig?: string }
const KEY = 'fz-chat';
const html = document.documentElement;
const phone = () => matchMedia('(max-width: 767px)').matches;
const geo = () => (html.dataset.geo === 'ph' ? 'ph' : 'intl');
const uid = () => crypto.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;

const GREETING = `Hi, I’m ${BOT}, Fazed Digital’s AI assistant. Ask me about services, prices, timelines or our work.`;
const CHIPS: [string, string?][] = [['How much is a website?'], ['How fast can you build it?'], ['Show me work like mine'], ['Talk to a person', 'form']];
const FALLBACK = ' You can also [send us a brief](/contact#brief), and a real person replies within one business day.';
const ERRORS: Record<string, string> = {
  rate: `You’re moving fast, so I’ve paused for a few minutes.${FALLBACK}`,
  busy: `I’m at capacity for today.${FALLBACK}`,
  turns: `We’ve reached the end of what I can do in one chat.${FALLBACK}`,
  long: `That message is a bit long for me. Could you shorten it?`,
  other: `Something went wrong on my side.${FALLBACK}`,
};

const TINY_HEAD = sprite(HEAD, 'fm-h');
const two = (pose: 'wave' | 'walk', cls: string) => `<span class="fzy-2 ${cls}" aria-hidden="true">${sprite(fazzyRows(pose, 0))}${sprite(fazzyRows(pose, 1))}</span>`;

let state = load();
let root: HTMLElement | null = null, trigger: HTMLElement | null = null;
let panel: HTMLElement, log: HTMLElement, input: HTMLTextAreaElement, sendBtn: HTMLButtonElement, status: HTMLElement, chips: HTMLElement, count: HTMLElement;
let busy = false, pinned = true;

function load(): { sid: string; msgs: Msg[]; notes: Record<number, string>; leadSent: boolean } {
  try {
    const s = JSON.parse(sessionStorage.getItem(KEY) ?? 'null');
    if (s?.sid && Array.isArray(s.msgs)) return { notes: {}, leadSent: false, ...s };
  } catch {}
  return { sid: uid(), msgs: [], notes: {}, leadSent: false };
}
const save = () => { try { sessionStorage.setItem(KEY, JSON.stringify(state)); } catch {} };

/* ── text: links, bold, the two phone numbers and the email ── */
const TOKENS = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|(\+\d[\d\s-]{8,}\d)|([\w.+-]+@[\w-]+\.[\w.-]*\w)/g;
function anchor(label: string, href: string) {
  const a = document.createElement('a');
  a.href = href;
  a.textContent = label;
  a.addEventListener('click', () => { if (phone()) closeChat(); });
  return a;
}
function rich(el: HTMLElement, text: string, streaming = false) {
  // while streaming, an unfinished link or bold stays out of sight until it completes
  const t = (streaming ? text.replace(/\[[^\]]*$|\[[^\]]*\]\([^)]*$|\*\*[^*]*$/, '') : text).replace(/^- /gm, '• ');
  const out = document.createDocumentFragment();
  let at = 0;
  for (const m of t.matchAll(TOKENS)) {
    out.append(t.slice(at, m.index));
    at = m.index + m[0].length;
    if (m[1]) out.append(isSitePath(m[2]) ? anchor(m[1], m[2]) : m[1]);
    else if (m[3]) { const b = document.createElement('strong'); b.textContent = m[3]; out.append(b); }
    else if (m[4]) out.append(anchor(m[4], `tel:${m[4].replace(/[\s-]/g, '')}`));
    else out.append(anchor(m[5], `mailto:${m[5]}`));
  }
  out.append(t.slice(at));
  el.replaceChildren(out);
}

function entry(who: 'bot' | 'you', text: string) {
  const li = document.createElement('li');
  li.className = `fm fm--${who}`;
  const k = document.createElement('p');
  k.className = 'fm-k';
  k.textContent = who === 'bot' ? BOT : 'You';
  const b = document.createElement('p');
  b.className = 'fm-t';
  rich(b, text);
  li.append(k, b);
  if (who === 'bot') li.insertAdjacentHTML('afterbegin', TINY_HEAD);
  log.append(li);
  scroll();
  return b;
}
function scroll() { if (pinned) log.scrollTop = log.scrollHeight; }

function note(text: string) {
  state.notes[state.msgs.length] = text;
  save();
  return entry('bot', text);
}
function setBusy(on: boolean) {
  busy = on;
  sendBtn.disabled = on;
  panel.toggleAttribute('data-busy', on);
}
const atLimit = () => state.msgs.filter((m) => m.role === 'user').length >= LIMITS.turns;

/* ── a turn ── */
async function ask(text: string) {
  if (busy || !text.trim()) return;
  if (atLimit()) { note(ERRORS.turns); return; }
  chips.hidden = true;
  state.msgs.push({ role: 'user', content: text });
  save();
  entry('you', text);
  input.value = '';
  fitInput();
  setBusy(true);
  pinned = true;

  const li = document.createElement('li');
  li.className = 'fm fm--bot fm--wait';
  li.innerHTML = `${TINY_HEAD}<p class="fm-k"></p><p class="fm-t">${two('walk', 'fm-walk')}</p>`;
  li.querySelector('.fm-k')!.textContent = BOT;
  log.append(li);
  scroll();
  status.textContent = `${BOT} is writing`;
  const body = li.querySelector<HTMLElement>('.fm-t')!;

  let reply = '', sig = '', form = false, failed = '';
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sid: state.sid, messages: state.msgs, market: geo(), tz: Intl.DateTimeFormat().resolvedOptions().timeZone, page: location.pathname, leadSent: state.leadSent }),
    });
    if (!res.ok || !res.body) {
      const code = await res.json().then((j) => j.code, () => '');
      failed = ERRORS[code] ? code : 'other';
    } else {
      const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
      let buf = '', frame = 0;
      const paint = () => { frame = 0; li.classList.remove('fm--wait'); rich(body, reply, true); scroll(); };
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += value;
        const rows = buf.split('\n');
        buf = rows.pop()!;
        for (const row of rows) {
          if (!row) continue;
          const ev = JSON.parse(row);
          if (ev.t === 'd') reply += ev.v;
          else if (ev.t === 'swap') reply = ev.v;
          else if (ev.t === 'end') { sig = ev.sig; form = ev.form; }
          else if (ev.t === 'err') failed = 'other';
        }
        frame ||= requestAnimationFrame(paint);
      }
      cancelAnimationFrame(frame);
      if (!sig) failed ||= 'other';
    }
  } catch { failed = 'other'; }

  if (failed) {
    // the visitor's message is taken back so the conversation stays valid, and handed back to the box to retry
    state.msgs.pop();
    li.remove();
    input.value = text;
    fitInput();
    note(ERRORS[failed]);
    status.textContent = 'The message didn’t send.';
  } else {
    li.classList.remove('fm--wait');
    rich(body, reply);
    state.msgs.push({ role: 'assistant', content: reply, sig });
    save();
    status.textContent = `${BOT} says: ${body.textContent}`;
    if (form && !state.leadSent) leadForm();
    else if (atLimit()) note(ERRORS.turns);
  }
  setBusy(false);
  scroll();
  if (!phone()) input.focus();
}

/* ── the visitor's own details: the only way a lead is sent ── */
function field(label: string, name: string, type: string, auto: string, required: boolean, placeholder = '') {
  const l = document.createElement('label');
  l.className = 'fl-f';
  const s = document.createElement('span');
  s.textContent = required ? label : `${label} (optional)`;
  const i = document.createElement('input');
  Object.assign(i, { name, type, autocomplete: auto, required, placeholder, maxLength: 200 });
  l.append(s, i);
  return l;
}
function leadForm() {
  if (log.querySelector('.fl')) { log.querySelector<HTMLElement>('.fl input')?.focus(); return; }
  chips.hidden = true;
  const li = document.createElement('li');
  li.className = 'fm fm--bot';
  const f = document.createElement('form');
  f.className = 'fl';
  f.noValidate = true;
  f.setAttribute('aria-label', 'Leave your details for the team');
  const consent = document.createElement('label');
  consent.className = 'fl-c';
  const box = document.createElement('input');
  Object.assign(box, { type: 'checkbox', name: 'consent', required: true });
  const txt = document.createElement('span');
  rich(txt, 'Fazed Digital can contact me about this and keep a copy of this chat. [Privacy](/privacy#chat)');
  consent.append(box, txt);
  const trap = document.createElement('input');
  Object.assign(trap, { type: 'text', name: 'fz_check', tabIndex: -1, autocomplete: 'off', className: 'fl-hp' });
  trap.setAttribute('aria-hidden', 'true');
  trap.setAttribute('data-1p-ignore', '');
  trap.setAttribute('data-lpignore', 'true');
  const err = document.createElement('p');
  err.className = 'fl-e';
  err.setAttribute('role', 'alert');
  const row = document.createElement('div');
  row.className = 'fl-b';
  const send = document.createElement('button');
  send.type = 'submit';
  send.className = 'btn btn--lime';
  send.textContent = 'Send to the team';
  const skip = document.createElement('button');
  skip.type = 'button';
  skip.className = 'fl-x';
  skip.textContent = 'Not now';
  skip.addEventListener('click', () => { li.remove(); input.focus(); });
  row.append(send, skip);
  f.append(
    field('Name', 'name', 'text', 'name', true),
    field('Email', 'email', 'email', 'email', true),
    field('Phone', 'phone', 'tel', 'tel', false, geo() === 'ph' ? '+63 9XX XXX XXXX' : '+1 555 000 0000'),
    field('Business', 'business', 'text', 'organization', false),
    trap, consent, err, row,
  );
  const idem = uid();
  f.addEventListener('submit', async (e) => {
    e.preventDefault();
    const d = new FormData(f);
    const name = String(d.get('name') ?? '').trim(), email = String(d.get('email') ?? '').trim();
    err.textContent = !name || !email ? 'Please add your name and email.' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'That email doesn’t look right.' : !box.checked ? 'Please tick the box so we can contact you.' : '';
    if (err.textContent) return;
    send.disabled = true;
    send.textContent = 'Sending…';
    try {
      const res = await fetch('/api/chat-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, email, phone: d.get('phone'), business: d.get('business'), website: d.get('fz_check'), consent: box.checked, idem,
          market: geo(), page: location.pathname, source: leadSource(), transcript: state.msgs.map(({ role, content }) => ({ role, content })),
        }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error);
      state.leadSent = true;
      save();
      li.remove();
      const done = 'Got it, thanks. It’s with the team now, and a real person will reply within one business day.';
      note(done).insertAdjacentHTML('beforeend', sprite(fazzyRows('hype'), 'fm-hype'));
      status.textContent = done;
      if (!phone()) input.focus();
    } catch (x) {
      err.textContent = (x as Error).message || 'That didn’t send. Please try again, or email info@fazeddigital.com.';
      send.disabled = false;
      send.textContent = 'Try again';
    }
  });
  li.append(f);
  log.append(li);
  pinned = true;
  scroll();
  f.querySelector('input')?.focus();
}

/* ── the panel ── */
function fitInput() {
  input.style.height = 'auto';
  input.style.height = `${Math.min(input.scrollHeight, 120)}px`;
  const left = LIMITS.userChars - input.value.length;
  count.textContent = left < 100 ? String(left) : '';
}
function fitViewport() {
  const v = visualViewport;
  if (!v || !phone()) { panel.style.removeProperty('--fc-h'); panel.style.removeProperty('--fc-top'); return; }
  panel.style.setProperty('--fc-h', `${v.height}px`);
  panel.style.setProperty('--fc-top', `${v.offsetTop}px`);
  scroll();
}
function build(host: HTMLElement) {
  if (!document.getElementById('fc-css')) {
    const st = document.createElement('style');
    st.id = 'fc-css';
    st.textContent = css;
    document.head.append(st);
  }
  panel = document.createElement('section');
  panel.className = 'fcp';
  panel.hidden = true;
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-labelledby', 'fcp-h');
  panel.setAttribute('data-lenis-prevent', '');
  panel.innerHTML = `
    <header class="fcp-hd">
      ${sprite(HEAD, 'fcp-head')}
      <div><h2 id="fcp-h" class="fcp-name" tabindex="-1"></h2><p class="fcp-sub">AI assistant · Fazed Digital</p></div>
      <button class="fcp-x" type="button" aria-label="Close chat"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" stroke-width="1.5" fill="none"/></svg></button>
    </header>
    <ol class="fcp-log" aria-label="Conversation" tabindex="0"></ol>
    <div class="fcp-chips"></div>
    <form class="fcp-in">
      <label class="sr-only" for="fcp-q">Your message</label>
      <textarea id="fcp-q" rows="1" enterkeyhint="send" placeholder="Ask about a website, price or timeline"></textarea>
      <span class="fcp-count" aria-hidden="true"></span>
      <button class="fcp-send" type="submit" aria-label="Send message"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" fill="none"/></svg></button>
    </form>
    <p class="fcp-fine"></p>
    <p class="sr-only" role="status" aria-live="polite"></p>`;
  panel.querySelector('.fcp-name')!.textContent = BOT;
  rich(panel.querySelector<HTMLElement>('.fcp-fine')!, 'AI can get things wrong, so the team confirms every price. Chats go to Anthropic to write replies. [Privacy](/privacy#chat)');
  log = panel.querySelector('.fcp-log')!;
  input = panel.querySelector('textarea')!;
  input.maxLength = LIMITS.userChars;
  sendBtn = panel.querySelector('.fcp-send')!;
  status = panel.querySelector('[role=status]')!;
  chips = panel.querySelector('.fcp-chips')!;
  count = panel.querySelector('.fcp-count')!;

  entry('bot', GREETING).insertAdjacentHTML('afterend', two('wave', 'fm-wave'));
  state.msgs.forEach((m, i) => {
    if (state.notes[i]) entry('bot', state.notes[i]);
    entry(m.role === 'user' ? 'you' : 'bot', m.content);
  });
  if (state.notes[state.msgs.length]) entry('bot', state.notes[state.msgs.length]);
  chips.hidden = state.msgs.length > 0;
  for (const [label, act] of CHIPS) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = label;
    b.addEventListener('click', () => (act === 'form' ? leadForm() : ask(label)));
    chips.append(b);
  }

  panel.querySelector('.fcp-x')!.addEventListener('click', closeChat);
  panel.querySelector('.fcp-in')!.addEventListener('submit', (e) => { e.preventDefault(); ask(input.value.trim()); });
  input.addEventListener('input', fitInput);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); ask(input.value.trim()); } });
  log.addEventListener('scroll', () => { pinned = log.scrollHeight - log.scrollTop - log.clientHeight < 40; }, { passive: true });
  panel.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { e.stopPropagation(); closeChat(); return; }
    if (e.key !== 'Tab' || !phone()) return; // full screen on phones, so focus stays inside
    const items = [...panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not(.fl-hp), textarea, [tabindex="0"]')].filter((el) => el.getClientRects().length);
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  host.append(panel);
}

export function openChat(host: HTMLElement, btn: HTMLElement) {
  root = host;
  trigger = btn;
  if (!panel || !host.contains(panel)) { state = load(); build(host); }
  panel.hidden = false;
  panel.setAttribute('aria-modal', String(phone()));
  host.dataset.open = '';
  btn.setAttribute('aria-expanded', 'true');
  visualViewport?.addEventListener('resize', fitViewport);
  visualViewport?.addEventListener('scroll', fitViewport);
  fitViewport();
  if (phone()) { bus.lenis?.stop(); document.body.style.overflow = 'hidden'; }
  requestAnimationFrame(() => {
    panel.classList.add('is-open');
    pinned = true;
    scroll();
    // no keyboard popping up over the greeting on a phone
    (phone() ? panel.querySelector<HTMLElement>('.fcp-name')! : input).focus({ preventScroll: true });
  });
}

function closeChat() {
  if (!root) return;
  panel.classList.remove('is-open');
  panel.hidden = true;
  delete root.dataset.open;
  trigger?.setAttribute('aria-expanded', 'false');
  visualViewport?.removeEventListener('resize', fitViewport);
  visualViewport?.removeEventListener('scroll', fitViewport);
  bus.lenis?.start();
  document.body.style.overflow = '';
  trigger?.focus({ preventScroll: true });
}

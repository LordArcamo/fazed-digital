// Pre-3D entry (budget ≤12KB gz): header state, menu, consent, route lifecycle,
// then the motion chunk at idle and the GL chunk after load (desktop) / first interaction (mobile).
import { readFlags } from './flags';
import { initMenu } from './menu';
import { initCookies } from './cookies';
import { bus } from '../lib/bus';

const flags = readFlags();
const html = document.documentElement;
bus.rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
bus.record = flags.record;

// header scrolled state (passive, rAF-coalesced)
let ticking = false;
const onScroll = () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => { html.classList.toggle('scrolled', scrollY > 24); ticking = false; });
};
addEventListener('scroll', onScroll, { passive: true });

const idle = (fn: () => void, timeout = 1500) =>
  'requestIdleCallback' in window ? (window as any).requestIdleCallback(fn, { timeout }) : setTimeout(fn, 200);

let motion: Promise<any> | null = null;
const loadMotion = () => (motion ??= import('../motion/motion').then((m) => { m.start(flags); return m; }));

let gl: Promise<any> | null = null;
const loadGL = () => (gl ??= (async () => {
  const { gate } = await import('./gpu');
  const g = await gate(flags);
  html.dataset.gl = g.tier;
  if (flags.debug) console.info('[field] gate', g);
  if (g.tier === 't0') return null;
  await loadMotion(); // one clock: gsap.ticker drives lenis + the field
  const c = await import('../field/controller');
  return c.start(g, flags);
})().catch((e) => { console.warn('[field] off:', e?.message || e); html.dataset.gl = 't0'; return null; }));

function boot() {
  initMenu();
  initCookies();
  const mobile = matchMedia('(pointer: coarse)').matches || innerWidth < 768;
  if (flags.record) { loadMotion(); loadGL(); return; }
  idle(loadMotion);
  if (flags.gl === 'off') return;
  if (html.dataset.formation === 'none' && flags.gl !== 'force') return; // reading pages: no GL on a cold load
  if (mobile) {
    const go = () => { ['scroll', 'touchstart', 'pointermove', 'keydown'].forEach((t) => removeEventListener(t, go)); loadGL(); };
    ['scroll', 'touchstart', 'pointermove', 'keydown'].forEach((t) => addEventListener(t, go, { passive: true, once: true }));
  } else {
    const after = () => idle(loadGL, 2000);
    if (document.readyState === 'complete') after(); else addEventListener('load', after, { once: true });
  }
}

// ClientRouter: bundled modules run once; per-page work goes through these events.
// The initial astro:page-load can fire before this module evaluates (ClientRouter lives in
// <head>), so run once now and de-duplicate per swapped <body>.
let first = true;
let lastBody: HTMLElement | null = null;
function onPage() {
  if (document.body === lastBody) return;
  lastBody = document.body;
  html.classList.toggle('scrolled', scrollY > 24);
  if (first) { first = false; boot(); }
  else {
    initMenu();
    initCookies();
    if (!gl && flags.gl !== 'off' && html.dataset.formation !== 'none') idle(loadGL, 2000);
    const ann = document.getElementById('route-announcer');
    if (ann) ann.textContent = `${document.title.split('|')[0].trim()} loaded`;
  }
  bus.onPage.forEach((f) => f());
}
document.addEventListener('astro:page-load', onPage);
document.addEventListener('astro:before-swap', () => bus.onSwap.forEach((f) => f()));
if (document.readyState !== 'loading') onPage(); else document.addEventListener('DOMContentLoaded', onPage, { once: true });

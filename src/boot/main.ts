// Pre-3D entry (budget ≤12KB gz): header state, menu, consent, route lifecycle,
// then the motion chunk at idle and the GL chunk after load (desktop) / first interaction (mobile).
import { readFlags } from './flags';
import { initMenu, bindMenuOnce } from './menu';
import { initCookies } from './cookies';
import { initNav, dockState, bindNavOnce } from './nav';
import { bus } from '../lib/bus';

const flags = readFlags();
const html = document.documentElement;
bus.rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
bus.record = flags.record;

// header scrolled state (passive, rAF-coalesced)
let ticking = false;
let lastY = scrollY;
const onScroll = () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => { const y = scrollY; dockState(y, lastY); lastY = y; ticking = false; });
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
  bindMenuOnce();
  bindNavOnce();
  initMenu();
  initCookies();
  const mobile = matchMedia('(pointer: coarse)').matches || innerWidth < 768;
  if (flags.record) { loadMotion(); loadGL(); return; }
  // reading pages (blog posts, legal): native scroll, no motion chunk, no GL on a cold load
  if (html.dataset.formation === 'none' && flags.gl !== 'force') return;
  idle(loadMotion);
  if (flags.gl === 'off') return;
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
  lastY = scrollY; dockState(scrollY, scrollY + 1);
  initNav();
  if (first) { first = false; boot(); }
  else {
    initMenu();
    initCookies();
    if (html.dataset.formation !== 'none') idle(loadMotion);
    if (!gl && flags.gl !== 'off' && html.dataset.formation !== 'none') idle(loadGL, 2000);
    const ann = document.getElementById('route-announcer');
    if (ann) ann.textContent = `${document.title.split('|')[0].trim()} loaded`;
  }
  bus.onPage.forEach((f) => f());
}
document.addEventListener('astro:page-load', onPage);
// ClientRouter swaps <html> attributes for the incoming document's: carry the runtime state over
const RUNTIME = ['js', 'rm', 'record', 'gl-live', 'js-motion', 'lenis', 'lenis-smooth', 'is-docked', 'dock-min', 'dock-hide', 'lp-dock', 'cur-on', 'cur-off'];
document.addEventListener('astro:before-swap', (e: any) => {
  const nd = e.newDocument?.documentElement as HTMLElement | undefined;
  if (nd) {
    RUNTIME.forEach((c) => html.classList.contains(c) && nd.classList.add(c));
    if (html.dataset.gl) nd.dataset.gl = html.dataset.gl;
  }
  bus.onSwap.forEach((f) => f());
});
// forward ClientRouter navigations open at the top (Lenis keeps its own position otherwise);
// back/forward ('traverse') keeps the browser's restored position
let navType = 'push';
document.addEventListener('astro:before-preparation', (e: any) => { navType = e.navigationType || 'push'; });
document.addEventListener('astro:after-swap', () => {
  if (navType !== 'traverse' && !location.hash) {
    window.scrollTo(0, 0);
    bus.lenis?.scrollTo(0, { immediate: true, force: true });
  }
  bus.lenis?.resize();
});
if (document.readyState !== 'loading') onPage(); else document.addEventListener('DOMContentLoaded', onPage, { once: true });

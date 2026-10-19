// Pre-3D entry (budget ≤12KB gz): header state, menu, consent, route lifecycle,
// then the motion chunk at idle and the GL chunk after load (desktop) / first interaction (mobile).
import { readFlags } from './flags';
import { initMenu, bindMenuOnce } from './menu';
import { initCookies } from './cookies';
import { initNav, dockState, bindNavOnce } from './nav';
import { bus } from '../lib/bus';

const flags = readFlags();
const html = document.documentElement;
// --screen-h: the real visible height, measured once (and again only when the width changes, i.e. rotation).
// On iPhone Chrome 100svh comes out ~40px shorter than what is visible, so the phone hero was short and its mark
// small; dvh would track the toolbars and shift the page while scrolling.
let screenW = innerWidth; // the <head> boot script already set --screen-h before first paint
const measureScreen = () => { if (innerWidth === screenW) return; screenW = innerWidth; html.style.setProperty('--screen-h', `${innerHeight}px`); };
addEventListener('resize', measureScreen, { passive: true });
bus.rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
bus.record = flags.record;
// prefers-reduced-motion: the SSR SVG posters ARE the experience, the GL field never boots
// (?gl=force / ?record still override for QA and capture)
const noGL = flags.gl === 'off' || (bus.rm && flags.gl !== 'force' && !flags.record);

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
  if (noGL) { html.dataset.gl = 't0'; return null; }
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
  if (noGL) return;
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
let landing = false; // see landNewPage()
function onPage() {
  if (document.body === lastBody) return;
  lastBody = document.body;
  landNewPage();
  lastY = scrollY; dockState(scrollY, scrollY + 1);
  initNav();
  if (first) { first = false; boot(); }
  else {
    initMenu();
    initCookies();
    if (html.dataset.formation !== 'none') idle(loadMotion);
    if (!gl && !noGL && html.dataset.formation !== 'none') idle(loadGL, 2000);
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
    const sh = html.style.getPropertyValue('--screen-h');
    if (sh) nd.style.setProperty('--screen-h', sh); // the swap replaces <html> attributes, inline style included
  }
  bus.onSwap.forEach((f) => f());
});
// forward ClientRouter navigations open at the top (Lenis keeps its own position otherwise);
// back/forward ('traverse') keeps the browser's restored position
let navType = 'push';
document.addEventListener('astro:before-preparation', (e: any) => { navType = e.navigationType || 'push'; });
// Where a forward navigation should open: the top, or the linked section (/lab#lab-06). Applied right after the swap
// AND again at page-load before any ScrollTrigger.refresh(): Lenis and ScrollTrigger both remember the previous
// page's position (from the footer that's the bottom of a long page) and would put the new page back there.
function landNewPage() {
  if (!landing) return;
  bus.lenis?.resize();
  const target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (target) { bus.lenis?.scrollTo(target, { immediate: true, force: true }); return; }
  window.scrollTo(0, 0);
  bus.lenis?.scrollTo(0, { immediate: true, force: true });
}
document.addEventListener('astro:after-swap', () => {
  landing = navType !== 'traverse';
  if (!landing) { bus.lenis?.resize(); return; }
  landNewPage();
});
document.addEventListener('astro:page-load', () => { landing = false; });
if (document.readyState !== 'loading') onPage(); else document.addEventListener('DOMContentLoaded', onPage, { once: true });

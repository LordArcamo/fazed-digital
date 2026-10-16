// Motion chunk: GSAP (ScrollTrigger) + Lenis on one ticker, reveals, cursor node, magnetic CTAs.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { bus } from '../lib/bus';
import type { Flags } from '../boot/flags';
import { initCursor } from './cursor';
import { initMagnetic } from './magnetic';
import { initHome } from './home';

gsap.registerPlugin(ScrollTrigger);
let started = false;
let pageCleanups: (() => void)[] = [];

export function start(flags: Flags) {
  if (started) return;
  started = true;
  (window as any).__ST = ScrollTrigger; // leak checks: __ST.getAll().length
  const html = document.documentElement;
  html.classList.add('js-motion');
  gsap.ticker.lagSmoothing(0);
  if (!bus.rm) {
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true, autoRaf: false, anchors: true });
    bus.lenis = lenis;
    (window as any).__lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
  }
  if (!flags.record) initCursor();
  pageLoad();
  bus.onPage.add(pageLoad);
  bus.onSwap.add(pageSwap);
}

function pageLoad() {
  // reveal: IO adds .rv-in (content is visible without JS; .rv only hides under html.js-motion)
  const els = document.querySelectorAll<HTMLElement>('.rv:not(.rv-in)');
  if (bus.rm) els.forEach((e) => e.classList.add('rv-in'));
  else {
    const io = new IntersectionObserver((ents) => ents.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target as HTMLElement;
      const sib = el.parentElement ? [...el.parentElement.children].filter((c) => c.classList.contains('rv')).indexOf(el) : 0;
      el.style.transitionDelay = `${Math.min(6, Math.max(0, sib)) * 0.06}s`;
      el.classList.add('rv-in');
      io.unobserve(el);
    }), { rootMargin: '0px 0px -8% 0px' });
    els.forEach((e) => io.observe(e));
    pageCleanups.push(() => io.disconnect());
  }
  pageCleanups.push(initMagnetic());
  if (document.querySelector('[data-page="home"]')) pageCleanups.push(initHome(bus.rm));
  // case plates: the full-page capture scrolls inside the browser frame (scrubbed)
  if (!bus.rm) document.querySelectorAll<HTMLElement>('[data-plate]').forEach((plate) => {
    const view = plate.querySelector<HTMLElement>('.browser-view'), img = view?.querySelector('img');
    if (!view || !img) return;
    const tw = gsap.to(img, { y: () => -Math.max(0, img.offsetHeight - view.offsetHeight), ease: 'none', scrollTrigger: { trigger: plate, start: 'top 75%', end: 'bottom 25%', scrub: 0.6, invalidateOnRefresh: true } });
    pageCleanups.push(() => { tw.scrollTrigger?.kill(); tw.kill(); });
  });
  ScrollTrigger.refresh();
}

function pageSwap() {
  pageCleanups.forEach((f) => f());
  pageCleanups = [];
  ScrollTrigger.getAll().forEach((t) => t.kill());
  bus.lenis?.scrollTo(0, { immediate: true });
  if ((window as any).__debugTriggers) console.info('[motion] triggers after swap', ScrollTrigger.getAll().length);
}

export { gsap, ScrollTrigger };

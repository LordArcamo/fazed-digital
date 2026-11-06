// Consent banner: GA4 (G-FL744H1NJ7) loads only after "Accept analytics". Vercel Analytics is cookieless.
const KEY = 'fz-consent';
const GA = 'G-FL744H1NJ7';
let gaLoaded = false;
function loadGA() {
  if (gaLoaded) return;
  gaLoaded = true;
  const w = window as any;
  w.dataLayer = w.dataLayer || [];
  w.gtag = function () { w.dataLayer.push(arguments); };
  w.gtag('js', new Date());
  w.gtag('config', GA, { anonymize_ip: true }); // sends the first page view; GA's history tracking counts ClientRouter navigations
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA}`;
  document.head.appendChild(s);
}
let stopWait: (() => void) | null = null;
export function initCookies() {
  const el = document.getElementById('cookie');
  const v = localStorage.getItem(KEY);
  if (v === 'granted') loadGA();
  if (!el) return;
  // waits for the first scroll (or 4s) so it never covers the first screen's buttons; GA stays off until consent either way
  stopWait?.();
  if (!v && !document.documentElement.classList.contains('record')) {
    const show = () => { stopWait?.(); if (!localStorage.getItem(KEY)) el.hidden = false; };
    const t = setTimeout(show, 4000);
    addEventListener('scroll', show, { passive: true });
    stopWait = () => { clearTimeout(t); removeEventListener('scroll', show); stopWait = null; };
  }
  if (el.dataset.bound) return;
  el.dataset.bound = '1';
  el.addEventListener('click', (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>('[data-consent]');
    if (!b) return;
    const c = b.dataset.consent!;
    localStorage.setItem(KEY, c);
    if (c === 'granted') loadGA();
    const toast = el.querySelector('.ck-toast');
    if (toast) toast.textContent = 'Got it. You can change this any time in the footer.';
    el.querySelector('.ck-btns')?.setAttribute('hidden', '');
    setTimeout(() => { el.hidden = true; el.querySelector('.ck-btns')?.removeAttribute('hidden'); if (toast) toast.textContent = ''; }, 2400);
  });
  document.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    if (t.closest('[data-cookie-settings]')) { el.hidden = false; (el.querySelector('button') as HTMLElement)?.focus(); }
    const a = t.closest<HTMLAnchorElement>('a[href^="tel:"], a[href^="mailto:"]');
    if (a) (window as any).gtag?.('event', a.protocol === 'tel:' ? 'phone_click' : 'email_click', { page_path: location.pathname });
  });
}

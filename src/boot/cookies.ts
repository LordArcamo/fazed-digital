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
  w.gtag('config', GA, { anonymize_ip: true });
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA}`;
  document.head.appendChild(s);
}
export function initCookies() {
  const el = document.getElementById('cookie');
  const v = localStorage.getItem(KEY);
  if (v === 'granted') loadGA();
  if (gaLoaded && location.pathname) (window as any).gtag?.('event', 'page_view', { page_path: location.pathname });
  if (!el) return;
  if (!v && !document.documentElement.classList.contains('record')) el.hidden = false;
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
    if ((e.target as HTMLElement).closest('[data-cookie-settings]')) { el.hidden = false; (el.querySelector('button') as HTMLElement)?.focus(); }
  });
}

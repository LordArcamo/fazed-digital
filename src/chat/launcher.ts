// The only chat code on the first page load. Everything else is imported the first time someone reaches for the button.
const BOTS = /bot|crawl|spider|slurp|lighthouse|pagespeed|headless/i; // same list as the market script in Base.astro

let panel: Promise<typeof import('./panel')> | null = null;
const load = () => (panel ??= import('./panel'));

export function initChat() {
  const root = document.getElementById('fz-chat');
  if (!root || root.dataset.bound || navigator.webdriver || BOTS.test(navigator.userAgent)) return;
  root.dataset.bound = '1';
  root.hidden = false;
  const btn = root.querySelector('button')!;
  btn.addEventListener('pointerenter', load, { once: true });
  btn.addEventListener('focus', load, { once: true });
  btn.addEventListener('click', () => load().then((m) => m.openChat(root, btn), () => { panel = null; location.href = '/contact#brief'; }));
}

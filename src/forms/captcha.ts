// reCAPTCHA v3, shared by both forms. Never blocks a lead: if the script is blocked (ad blockers) or slow,
// we send with an empty token after 4 s. The server logs the score; it does not reject on it.
const SITE_KEY = '6LdYgc0sAAAAAJy0R-ZRG3VKjadhIoWs_-9VOZ1x';
let loading: Promise<void> | null = null;

export const loadRecaptcha = () => (loading ??= new Promise<void>((res, rej) => {
  const s = document.createElement('script');
  s.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
  s.async = true;
  s.onload = () => res();
  s.onerror = () => rej(new Error('recaptcha'));
  document.head.appendChild(s);
}));

async function execute(action: string): Promise<string> {
  await loadRecaptcha();
  const g = (window as any).grecaptcha;
  return new Promise((res, rej) => g.ready(() => g.execute(SITE_KEY, { action }).then(res, rej)));
}

/** A token, or '' when reCAPTCHA is blocked, fails or takes longer than `ms`. */
export function captcha(action: string, ms = 4000): Promise<string> {
  return Promise.race([execute(action), new Promise<string>((r) => setTimeout(() => r(''), ms))]).catch(() => '');
}

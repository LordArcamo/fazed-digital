// First-touch lead source for the whole visit. boot/main.ts calls it on the first page, so the campaign tags and the
// landing page are read before ClientRouter swaps them away; the forms read the stored value when they send.
export function leadSource(): string {
  const KEY = 'fz-src';
  try { const s = sessionStorage.getItem(KEY); if (s) return s; } catch {}
  const q = new URLSearchParams(location.search);
  const parts = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].filter((k) => q.get(k)).map((k) => `${k.slice(4)}=${q.get(k)}`);
  if (q.get('gclid')) parts.push('google-ads click');
  if (q.get('fbclid')) parts.push('facebook click');
  try { const r = document.referrer && new URL(document.referrer); if (r && r.host !== location.host) parts.push(`ref=${r.host}`); } catch {}
  const s = [parts.join(' · ') || 'direct / unknown', `landing=${location.pathname}`].join(' · ');
  try { sessionStorage.setItem(KEY, s); } catch {}
  return s;
}

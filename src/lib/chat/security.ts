// Gatekeeping for the two chat routes. The Anthropic key stays in this server code; nothing here reaches the browser.
// Limits live in the warm function instance (like the duplicate guard in lp-submit.ts): strong, but one instance's count,
// so the Anthropic Console's monthly spend limit is the hard ceiling. IPs are held only as keyed hashes, in memory.
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { SITE_URL } from '../../data/site';

export const API_KEY = String(import.meta.env.ANTHROPIC_API_KEY ?? process.env.ANTHROPIC_API_KEY ?? '');
// Set explicitly so the key can only ever go to Anthropic; CHAT_API_BASE is for local tests against a stand-in.
export const API_BASE = String(import.meta.env.CHAT_API_BASE ?? 'https://api.anthropic.com');
const SECRET = createHash('sha256').update(`fazed-chat:${API_KEY}`).digest();

const BOT_UA = /bot|crawl|spider|slurp|lighthouse|pagespeed|headless|curl|wget|python|scrapy|httpclient|okhttp|go-http|node-fetch|axios|postman|insomnia/i;

export const json = (data: object, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

/** Refuses anything that isn't a browser on this site posting JSON. Returns the error response, or null to carry on. */
export function gate(request: Request): Response | null {
  if (!API_KEY) return json({ code: 'off' }, 404);
  const h = request.headers;
  const ua = h.get('user-agent') ?? '';
  if (!ua || BOT_UA.test(ua)) return json({ code: 'blocked' }, 403);
  if (!(h.get('content-type') ?? '').startsWith('application/json')) return json({ code: 'blocked' }, 415);
  const site = h.get('sec-fetch-site');
  if (site && site !== 'same-origin') return json({ code: 'blocked' }, 403);
  let originHost = '';
  try { originHost = new URL(h.get('origin') ?? '').host; } catch {}
  const hosts = [h.get('x-forwarded-host'), h.get('host'), new URL(SITE_URL).host];
  if (!originHost || !hosts.includes(originHost)) return json({ code: 'blocked' }, 403);
  return null;
}

/** The body as JSON, or null if it is too big or isn't valid. */
export async function readBody<T>(request: Request, maxBytes: number): Promise<T | null> {
  if (Number(request.headers.get('content-length') ?? 0) > maxBytes) return null;
  try {
    const text = await request.text();
    return text.length > maxBytes ? null : (JSON.parse(text) as T);
  } catch {
    return null;
  }
}

export function ipKey(request: Request, clientAddress?: string): string {
  const h = request.headers;
  const ip = h.get('x-real-ip') ?? h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? clientAddress ?? 'unknown';
  return createHmac('sha256', SECRET).update(ip).digest('base64url').slice(0, 22);
}

// Sliding windows: a list of hit times per key, trimmed as it is read.
const hits = new Map<string, number[]>();
export function allow(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  if (hits.size > 20_000) for (const [k, v] of hits) if (now - v[v.length - 1] > 86_400_000) hits.delete(k);
  const list = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  const ok = list.length < max;
  if (ok) list.push(now);
  hits.set(key, list);
  return ok;
}

/** A reply is signed when sent, so a visitor can't hand back a forged history of things the bot "said". */
export const signReply = (sid: string, index: number, text: string) =>
  createHmac('sha256', SECRET).update(`${sid}|${index}|${text}`).digest('base64url').slice(0, 32);

export function validReply(sid: string, index: number, text: string, sig: unknown): boolean {
  if (typeof sig !== 'string') return false;
  const want = Buffer.from(signReply(sid, index, text));
  const got = Buffer.from(sig);
  return want.length === got.length && timingSafeEqual(want, got);
}

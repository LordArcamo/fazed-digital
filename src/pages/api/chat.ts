export const prerender = false;

import type { APIRoute } from 'astro';
import Anthropic from '@anthropic-ai/sdk';
import { LIMITS } from '../../chat/links';
import type { Market } from '../../lib/chat/knowledge';
import { DEFAULT_MODEL, END_TOOL, FORM_TOOL, chatRequest } from '../../lib/chat/request';
import { guard, SAFE_LINE } from '../../lib/chat/guard';
import { liveNote, validZone } from '../../lib/chat/live';
import { API_BASE, API_KEY, allow, gate, ipKey, json, readBody, signReply, validReply } from '../../lib/chat/security';

// The site chat. Off (404) until ANTHROPIC_API_KEY is set in Vercel and the site is redeployed.
// Logged per turn: market, turn number and token counts. Never the visitor's words, never an IP.

const MODEL = import.meta.env.CHAT_MODEL ?? process.env.CHAT_MODEL ?? DEFAULT_MODEL;
const MAX_TURNS_PER_DAY_SITEWIDE = 3000; // about $100 at worst on Sonnet; this instance stops here for the day

const client = API_KEY ? new Anthropic({ apiKey: API_KEY, baseURL: API_BASE, maxRetries: 1, timeout: 30_000 }) : null;

interface Turn { role: 'user' | 'assistant'; content: string; sig?: string }
interface ChatBody { sid?: unknown; messages?: unknown; market?: unknown; tz?: unknown; page?: unknown; leadSent?: unknown }

/** Checks the whole conversation. Returns the turns, or an error code. */
function readTurns(sid: string, raw: unknown): Turn[] | string {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length % 2 === 0) return 'bad';
  if (raw.length > LIMITS.turns * 2 - 1) return 'turns';
  const turns: Turn[] = [];
  for (let i = 0; i < raw.length; i++) {
    const t = raw[i] as Turn;
    const role = i % 2 === 0 ? 'user' : 'assistant';
    if (!t || t.role !== role || typeof t.content !== 'string' || !t.content.trim()) return 'bad';
    if (t.content.length > (role === 'user' ? LIMITS.userChars : LIMITS.botChars)) return 'long';
    if (role === 'assistant' && !validReply(sid, i, t.content, t.sig)) return 'bad';
    turns.push({ role, content: t.content });
  }
  return turns;
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const refused = gate(request);
  if (refused) return refused;

  const body = await readBody<ChatBody>(request, LIMITS.bodyBytes);
  if (!body) return json({ code: 'bad' }, 400);
  const sid = typeof body.sid === 'string' && /^[\w-]{16,64}$/.test(body.sid) ? body.sid : '';
  if (!sid) return json({ code: 'bad' }, 400);
  const turns = readTurns(sid, body.messages);
  if (typeof turns === 'string') return json({ code: turns }, turns === 'turns' ? 429 : 400);

  const ip = ipKey(request, clientAddress);
  if (!allow(`ip:${ip}`, 20, 600_000) || !allow(`day:${ip}`, 80, 86_400_000) || !allow(`sid:${sid}`, 40, 86_400_000)) return json({ code: 'rate' }, 429);
  if (!allow('site', MAX_TURNS_PER_DAY_SITEWIDE, 86_400_000)) return json({ code: 'busy' }, 503);

  // The page's own market (html[data-geo]), so the bot always matches the prices on screen; the IP country is the fallback.
  const country = (request.headers.get('x-vercel-ip-country') ?? '').slice(0, 2);
  const mkt: Market = body.market === 'ph' || body.market === 'intl' ? body.market : country === 'PH' ? 'ph' : 'intl';
  const page = typeof body.page === 'string' && /^\/[\w\-/]{0,120}$/.test(body.page) ? body.page : '/';
  const note = liveNote({ market: mkt, country, tz: validZone(body.tz) ? body.tz : '', page, leadSent: body.leadSent === true });
  const turn = (turns.length + 1) / 2;
  const replyIndex = turns.length;

  const enc = new TextEncoder();
  const stream = new ReadableStream({
    async start(ctrl) {
      const send = (o: object) => ctrl.enqueue(enc.encode(`${JSON.stringify(o)}\n`));
      const finish = (text: string, form: boolean, done = false) => send({ t: 'end', form, done, sig: signReply(sid, replyIndex, text) });
      let full = '';
      try {
        const reply = client!.messages.stream(chatRequest(MODEL, mkt, note, turns), { signal: request.signal });

        for await (const ev of reply) {
          if (ev.type !== 'content_block_delta' || ev.delta.type !== 'text_delta') continue;
          full += ev.delta.text;
          if (!guard(full, mkt)) {
            reply.abort();
            console.warn(`chat guard: market=${mkt} turn=${turn}`);
            send({ t: 'swap', v: SAFE_LINE });
            finish(SAFE_LINE, false);
            ctrl.close();
            return;
          }
          send({ t: 'd', v: ev.delta.text });
        }

        const final = await reply.finalMessage();
        const u = final.usage;
        console.log(`chat turn: model=${MODEL} market=${mkt} turn=${turn} stop=${final.stop_reason} in=${u.input_tokens} cached=${u.cache_read_input_tokens ?? 0} wrote=${u.cache_creation_input_tokens ?? 0} out=${u.output_tokens}`);
        if (final.stop_reason === 'refusal' || (!full.trim() && final.stop_reason !== 'tool_use')) {
          send({ t: 'swap', v: SAFE_LINE });
          finish(SAFE_LINE, false);
        } else {
          const called = (tool: Anthropic.Tool) => final.content.some((b) => b.type === 'tool_use' && b.name === tool.name);
          const form = called(FORM_TOOL), done = called(END_TOOL);
          const text = full.trim() || (done ? 'Thanks for stopping by. I’m here if you need anything.' : 'Sure. Pop your details in below and the team will reply within one business day.');
          if (text !== full) send({ t: 'swap', v: text });
          finish(text, form, done);
        }
      } catch (err) {
        if (!request.signal.aborted) {
          const status = err instanceof Anthropic.APIError ? err.status : 'network';
          console.error(`chat error: model=${MODEL} status=${status}`);
          send({ t: 'err' });
        }
      }
      try { ctrl.close(); } catch {}
    },
  });

  return new Response(stream, { headers: { 'Content-Type': 'application/x-ndjson; charset=utf-8', 'Cache-Control': 'no-store', 'X-Accel-Buffering': 'no' } });
};

export const ALL: APIRoute = () => json({ code: 'blocked' }, 405);

// Website quiz leads (/quiz email gate), handled inside /api/lp-submit when the body has kind: 'quiz'.
// Same pipeline as every other lead: CRM Inbox (once CRM_KEY is set) + Gmail alert to the team + HubSpot contact.
// Tagged source "quiz · …" with the score, band, answers and market (US/AU/PH).
// The lead's own result email (copy/quiz.md §7, src/lib/quiz-email.ts) goes while QUIZ_RESULT_EMAIL is on (data/quiz.ts).
import { sendLead, LEAD_TO, LEAD_CC } from './mail';
import { quizEmail } from './quiz-email';
import { QUIZ_RESULT_EMAIL } from '../data/quiz';
import { NAP } from '../data/site';
import { saveToHubSpot } from './hubspot';
import { saveToCrm, markCrmAlert } from './crm';

const s = (v: unknown, max = 300) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const sent = new Map<string, number>(); // best-effort duplicate guard per warm instance (the client also blocks double taps)
const mailed = new Map<string, number>(); // one result email per address per 10 minutes, so the gate can't flood an inbox

export async function quizLead(body: Record<string, unknown>, referer: string): Promise<Response> {
  const d = {
    name: s(body.name, 160), email: s(body.email, 200), website: s(body.currentWebsite), market: ['US', 'AU', 'PH'].includes(s(body.market)) ? s(body.market) : 'US',
    score: typeof body.score === 'number' && body.score >= 0 && body.score <= 100 ? Math.round(body.score) : null,
    band: s(body.band, 80), business: s(body.business, 80), hasSite: s(body.hasSite, 80), weakest: s(body.weakest, 300),
    answers: s(body.answers, 6000), source: s(body.source) || 'quiz', idem: s(body.idem, 64),
    bandId: s(body.bandId, 20), bizId: s(body.bizId, 20), fixIds: Array.isArray(body.fixIds) ? body.fixIds.slice(0, 3).map((x) => s(x, 8)) : [],
  };
  const flagged = !!s(body.website); // honeypot: flagged, never dropped; inbox only
  const fast = typeof body.t === 'number' && body.t > 0 && body.t < 8000; // 12 taps in under 8 s: likely a bot (flag only)

  if (!d.name || !d.email) return json({ error: 'Please fill in all required fields.' }, 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) return json({ error: 'Please enter a valid email address.' }, 400);
  const now = Date.now();
  for (const [k, at] of sent) if (now - at > 600_000) sent.delete(k);
  if (d.idem && sent.has(d.idem)) return json({ ok: true });

  console.log('Quiz lead:', JSON.stringify({ ...d, answers: undefined, flagged, fast }));
  const scoreLabel = d.score === null ? d.band : `${d.score}/100 · ${d.band}`;
  const rows: [string, string][] = ([
    ['Score', scoreLabel], ['Weakest areas', d.weakest], ['Business', d.business], ['Has a website', d.hasSite],
    ['Website', d.website], ['Market', d.market], ['Name', d.name], ['Email', d.email], ['Source', d.source], ['Answers', d.answers],
  ] as [string, string][]).filter(([, v]) => v);

  const [crm, mail, hs] = await Promise.all([
    flagged ? null : saveToCrm({
      ref: d.idem, form: 'contact', pipeline: d.market === 'PH' ? 'ph' : 'us',
      name: d.name, email: d.email, website: d.website, service: 'Website quiz', package: scoreLabel, message: d.answers, source: d.source,
      details: { Score: scoreLabel, 'Weakest areas': d.weakest, Business: d.business, 'Has a website': d.hasSite, Market: d.market },
    }),
    sendLead({
      to: LEAD_TO, cc: LEAD_CC, replyTo: d.email,
      subject: `${flagged ? '[check] ' : ''}${fast ? '[fast] ' : ''}New quiz lead: ${d.name} (${scoreLabel})`,
      html: alertHtml(rows, d.name, scoreLabel),
    }),
    flagged ? null : saveToHubSpot({
      name: d.name, email: d.email, serviceLabel: 'Website quiz', pageUri: referer || 'https://www.fazeddigital.com/quiz',
      pageName: 'Fazed Digital — Website quiz', message: rows.filter(([k]) => k !== 'Name' && k !== 'Email').map(([k, v]) => `${k}: ${v}`).join('\n'),
    }),
  ]);
  console.log(`Quiz lead: email=${mail || 'failed'} hubspot=${hs} crm=${crm ?? 'off'}`);
  await markCrmAlert(crm, !!mail);
  if (!crm && !mail && hs !== 'ok') return json({ error: 'Your details didn’t send. Please try again.' }, 502);
  if (d.idem) sent.set(d.idem, now);
  // the lead's own copy of the result: never for flagged or too-fast submissions, never fails the lead
  if (QUIZ_RESULT_EMAIL && !flagged && !fast && d.score !== null) {
    const k = d.email.toLowerCase();
    for (const [e, at] of mailed) if (now - at > 600_000) mailed.delete(e);
    const m = mailed.has(k) ? null : quizEmail({ name: d.name, score: d.score, bandId: d.bandId, bizId: d.bizId, fixIds: d.fixIds, market: d.market });
    if (m) {
      mailed.set(k, now);
      const r = await sendLead({ to: [d.email], replyTo: NAP.email, fromName: 'Lord at Fazed Digital', subject: m.subject, html: m.html, text: m.text });
      console.log(`Quiz result email: ${r || 'failed'}`);
    }
  }
  return json({ ok: true });
}

function alertHtml(rows: [string, string][], name: string, scoreLabel: string): string {
  const tr = rows.map(([k, v]) => `<tr><td style="padding:10px 14px;border-bottom:1px solid #2a2a2a;color:#888;font-family:monospace;font-size:11px;letter-spacing:.06em;text-transform:uppercase;width:140px;vertical-align:top;">${esc(k)}</td><td style="padding:10px 14px;border-bottom:1px solid #2a2a2a;color:#eaeaea;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:14px;line-height:1.5;white-space:pre-wrap;">${esc(v)}</td></tr>`).join('');
  return `<!doctype html><html><body style="margin:0;background:#0a0a0a;padding:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:640px;margin:0 auto;background:#111;border:1px solid #2a2a2a;border-radius:14px;overflow:hidden;">
    <div style="padding:22px 24px;border-bottom:1px solid #2a2a2a;background:rgba(201,255,87,0.04);">
      <div style="font-size:11px;font-family:monospace;letter-spacing:.12em;text-transform:uppercase;color:#C9FF57;margin-bottom:6px;">New lead · Website quiz</div>
      <div style="font-size:20px;font-weight:700;color:#fff;letter-spacing:-.02em;">${esc(name)}</div>
      <div style="font-size:13px;color:#888;margin-top:4px;">${esc(scoreLabel)}</div>
    </div>
    <table style="width:100%;border-collapse:collapse;">${tr}</table>
    <div style="padding:16px 24px;background:#0a0a0a;font-size:12px;color:#666;">Reply to this email to reach ${esc(name)}. Scores are based on their answers, not a scan of their site.</div>
  </div></body></html>`;
}
const esc = (v: string) => v.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
function json(data: object, status = 200) { return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } }); }

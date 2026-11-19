// The quiz result email to the lead (copy/quiz.md §7, Version A; owner said start it 2026-11-19).
// Sent from info@ as "Lord at Fazed Digital" through the same Gmail transport as the 7-day confirmation (src/lib/mail.ts).
// Every line comes from src/data/quiz.ts: the client only says which band, business type and fix ids it showed.
import { fixes, bands, bizPhrase, nextSteps, areas, result, type BizId } from '../data/quiz';
import { NAP, SITE_URL, BOOK } from '../data/site';

export interface QuizMail { name: string; score: number; bandId: string; bizId: string; fixIds: string[]; market: string }

export function quizEmail(q: QuizMail): { subject: string; html: string; text: string } | null {
  const band = bands.find((b) => b.id === q.bandId);
  const fx = q.fixIds.slice(0, 3).map((id) => fixes.find((f) => f.id === id));
  if (!band || fx.some((f) => !f) || !(q.score >= 0 && q.score <= 100)) return null;
  const biz: BizId = q.bizId in bizPhrase ? (q.bizId as BizId) : 'other';
  const exKey = biz === 'other' ? 'pro' : biz; // "Something else" uses the Professional services example
  const php = q.market === 'PH';
  const phone = php ? NAP.phone : NAP.phoneUS;
  const first = q.name.split(/\s+/)[0] || 'there';
  const list = fx.map((f, i) => ({ n: i + 1, area: areas.find((a) => a.id === f!.area)!.name, problem: f!.problem, before: f!.ex[exKey][0], after: f!.ex[exKey][1], why: f!.principle }));

  const n = band.next;
  const card =
    n === 'sevenday' ? { h: nextSteps.sevenday.h, body: nextSteps.sevenday.body(php ? nextSteps.sevenday.price.php : nextSteps.sevenday.price.usd), cta: nextSteps.sevenday.cta, href: php ? nextSteps.sevenday.href.php : nextSteps.sevenday.href.usd }
    : n === 'service' ? (q.fixIds[0] === 'FI-2' ? nextSteps.service.branding : nextSteps.service.web)
    : nextSteps[n];
  const abs = (p: string) => (p.startsWith('http') ? p : `${SITE_URL}${p}`);

  const subject = `${first}, your website score: ${q.score}/100`;
  const preview = `Your 3 fixes, with examples for ${bizPhrase[biz]}. Based on your answers.`;
  const footer = `You’re getting this because you asked for your quiz result on fazeddigital.com. Reply “stop” and we won’t email you again. Fazed Digital, ${NAP.city}, ${NAP.region} ${NAP.postal}, ${NAP.country}.`;

  const text = [
    `Hi ${first},`, '',
    'Thanks for taking the Fazed website quiz. Here’s your result.', '',
    `Based on your answers, your site scores ${q.score}/100: ${band.name}.`, '',
    band.summary, '',
    ...(list.length
      ? ['YOUR 3 FIXES', '', ...list.flatMap((f) => [`${f.n}. ${f.area}: ${f.problem}`, `Example before: ${f.before}`, `Example after: ${f.after}`, `Why it works: ${f.why}`, ''])]
      : [result.noFixesH, result.noFixesSub, '']),
    'WANT HELP WITH THEM?',
    'Book a free 15-minute call with me on Google Meet. We’ll open your site together, go through these 3 fixes and work out which one to do first. You leave with the fixes, whether you hire us or not.',
    `Book a 15-min call with Lord: ${BOOK}`, '',
    `${card.h} ${card.body}`, `${card.cta}: ${abs(card.href)}`, '',
    'Lord Arcamo', 'Founder, Fazed Digital', `${NAP.city}, ${NAP.country} · ${phone}`, 'www.fazeddigital.com', '',
    'P.S. Your score is based on your answers, not a scan of your site. On the call we look at the real thing.', '',
    footer,
  ].join('\n');

  const font = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
  const fixHtml = list.length
    ? list.map((f) => `
      <tr><td style="padding:0 0 14px;">
        <div style="border:1px solid #e2e1dc;border-radius:14px;padding:18px 18px 16px;background:#ffffff;">
          <div style="font-size:12px;font-weight:700;color:#6b6a66;margin-bottom:6px;">${f.n} · ${esc(f.area)}</div>
          <div style="font-size:17px;font-weight:700;color:#090909;line-height:1.3;margin-bottom:12px;">“${esc(f.problem)}”</div>
          <div style="font-size:14px;line-height:1.5;color:#6b6a66;margin-bottom:6px;"><b style="color:#090909;">Example before:</b> ${esc(f.before)}</div>
          <div style="font-size:14px;line-height:1.5;color:#090909;background:#eefcc9;border-radius:10px;padding:10px 12px;margin-bottom:8px;"><b>Example after:</b> ${esc(f.after)}</div>
          <div style="font-size:14px;line-height:1.5;color:#090909;"><b>Why it works:</b> ${esc(f.why)}</div>
        </div>
      </td></tr>`).join('')
    : `<tr><td style="padding:0 0 14px;font-size:15px;line-height:1.55;color:#090909;"><b>${esc(result.noFixesH)}</b> ${esc(result.noFixesSub)}</td></tr>`;

  const html = `<!doctype html><html><body style="margin:0;background:#F5F4F0;font-family:${font};">
<div style="display:none;max-height:0;overflow:hidden;">${esc(preview)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F5F4F0;"><tr><td align="center" style="padding:28px 14px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">
  <tr><td style="padding:0 4px 18px;font-size:16px;font-weight:700;color:#090909;">Fazed <span style="color:#8a8984;font-weight:600;">Digital</span></td></tr>
  <tr><td style="background:#ffffff;border:1px solid #e2e1dc;border-radius:20px;padding:28px 24px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="font-size:16px;line-height:1.55;color:#090909;padding-bottom:16px;">Hi ${esc(first)},<br><br>Thanks for taking the Fazed website quiz. Here’s your result.</td></tr>
      <tr><td style="padding-bottom:6px;font-size:13px;font-weight:600;color:#6b6a66;">Based on your answers</td></tr>
      <tr><td style="padding-bottom:10px;"><span style="font-size:56px;font-weight:800;letter-spacing:-2px;color:#090909;line-height:1;">${q.score}</span><span style="font-size:18px;font-weight:700;color:#6b6a66;">/100</span>
        &nbsp;<span style="display:inline-block;vertical-align:middle;background:#e4ff9a;color:#090909;font-size:13px;font-weight:700;border-radius:999px;padding:5px 12px;">${esc(band.name)}</span></td></tr>
      <tr><td style="font-size:15px;line-height:1.55;color:#3b3a37;padding-bottom:24px;">${esc(band.summary)}</td></tr>
      <tr><td style="font-size:19px;font-weight:800;color:#090909;padding-bottom:12px;">Your 3 fixes</td></tr>
      ${fixHtml}
      <tr><td style="padding:10px 0 6px;font-size:19px;font-weight:800;color:#090909;">Want help with them?</td></tr>
      <tr><td style="font-size:15px;line-height:1.55;color:#090909;padding-bottom:16px;">Book a free 15-minute call with me on Google Meet. We’ll open your site together, go through these 3 fixes and work out which one to do first. You leave with the fixes, whether you hire us or not.</td></tr>
      <tr><td style="padding-bottom:24px;"><a href="${BOOK}" style="display:inline-block;background:#C9FF57;color:#090909;text-decoration:none;font-weight:700;font-size:16px;border-radius:999px;padding:14px 24px;border:1.5px solid #090909;">Book a 15-min call with Lord →</a></td></tr>
      <tr><td style="border-top:1px solid #e2e1dc;padding:18px 0 0;font-size:14px;line-height:1.55;color:#090909;"><b>${esc(card.h)}</b> ${esc(card.body)}<br><a href="${abs(card.href)}" style="color:#090909;font-weight:700;">${esc(card.cta)} →</a></td></tr>
      <tr><td style="padding-top:24px;font-size:14px;line-height:1.6;color:#090909;">Lord Arcamo<br><span style="color:#6b6a66;">Founder, Fazed Digital<br>${NAP.city}, ${NAP.country} · ${phone}<br><a href="${SITE_URL}" style="color:#6b6a66;">www.fazeddigital.com</a></span></td></tr>
      <tr><td style="padding-top:18px;font-size:13px;line-height:1.55;color:#6b6a66;">P.S. Your score is based on your answers, not a scan of your site. On the call we look at the real thing.</td></tr>
    </table>
  </td></tr>
  <tr><td style="padding:16px 8px 0;font-size:11px;line-height:1.5;color:#8a8984;">${esc(footer)}</td></tr>
</table></td></tr></table></body></html>`;
  return { subject, html, text };
}

const esc = (v: string) => v.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export const prerender = false;

import type { APIRoute } from 'astro';
import { sendLead } from '../../lib/mail';
import { saveToHubSpot } from '../../lib/hubspot';
import { offerPrice, FOUNDING_PH } from '../../data/offers';
import { NAP, SITE_URL } from '../../data/site';

// Every lead: Gmail alert to the team (src/lib/mail.ts) + a HubSpot contact for the leads list (src/lib/hubspot.ts).
const LEAD_TO = [
  'reancirl@gmail.com',
  'russeljessheyrana@gmail.com',
  'lordrynkartracydwight@gmail.com',
  'justinjacobsumaya8@gmail.com',
  'info@fazeddigital.com',
];

const PACKAGE_NAMES: Record<string, string> = { starter: 'Starter', growth: 'Growth', pro: 'Pro', unsure: 'Not sure, help me choose' };
const GOAL_LABELS: Record<string, string> = {
  leads: 'Get more leads & inquiries', sell: 'Sell products online', credibility: 'Build credibility & trust',
  replace: 'Replace old/outdated website', launch: 'Launch a new business', other: 'Something else',
};
const STYLE_LABELS: Record<string, string> = {
  minimal: 'Minimal & Clean', bold: 'Bold & Vibrant', corporate: 'Corporate & Professional', playful: 'Playful & Fun',
};
const TIMELINE_LABELS: Record<string, string> = {
  asap: 'As soon as possible', month: 'Within a month', quarter: 'In 1–3 months', exploring: 'Just exploring for now',
};

// Accepts the questionnaire payload and the older 5-step form's payload (pages, colours, inspiration, referral).
interface LpSubmitBody {
  variant?: 'usd' | 'php';
  package?: string; businessName?: string; industry?: string; goal?: string; timeline?: string; styleVibe?: string;
  facebookPage?: string; currentWebsite?: string; name?: string; email?: string; phone?: string; notes?: string; source?: string;
  pagesNeeded?: string[]; brandColors?: string; inspirationUrls?: string; referral?: string;
  packageFrom?: string; // 'pricing' (a pricing button picked it) | 'asked'
  t?: number;           // ms from opening the form to sending
  idem?: string;        // one id per brief, to drop double sends
  website?: string; // honeypot: real people never see or fill it
  captchaToken?: string;
}

// Best-effort duplicate guard: a brief id that was SENT in the last 10 minutes is accepted but not sent again.
// Marked only after a successful send, so a retry after a failure always goes through.
// (Lives in the warm function instance; the client also blocks double taps.)
const sent = new Map<string, number>();
// One confirmation per address per 10 minutes, so the form can't be used to flood someone's inbox.
const confirmed = new Map<string, number>();
function confirmAllowed(email: string): boolean {
  const now = Date.now(), k = email.toLowerCase();
  for (const [e, at] of confirmed) if (now - at > 600_000) confirmed.delete(e);
  if (confirmed.has(k)) return false;
  confirmed.set(k, now);
  return true;
}
function sentRecently(id: string): boolean {
  const now = Date.now();
  for (const [k, at] of sent) if (now - at > 600_000) sent.delete(k);
  return !!id && sent.has(id);
}

export const POST: APIRoute = async ({ request }) => {
  let body: LpSubmitBody;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request' }, 400);
  }

  const s = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
  const referer = request.headers.get('referer') ?? '';
  const variant: Lead['variant'] = body.variant === 'php' || body.variant === 'usd' ? body.variant : referer.includes('/lp/7-day-website/ph') ? 'php' : 'usd';
  const d: Lead = {
    variant,
    pkg: s(body.package), businessName: s(body.businessName), industry: s(body.industry), goal: s(body.goal),
    timeline: s(body.timeline), styleVibe: s(body.styleVibe), facebookPage: s(body.facebookPage), currentWebsite: s(body.currentWebsite),
    name: s(body.name), email: s(body.email), phone: s(body.phone), notes: s(body.notes), source: s(body.source),
    pagesNeeded: Array.isArray(body.pagesNeeded) ? body.pagesNeeded.map(String) : [],
    brandColors: s(body.brandColors), inspirationUrls: s(body.inspirationUrls), referral: s(body.referral),
    packageFrom: s(body.packageFrom),
  };

  /* ── Bots fill the hidden honeypot; pretend success, send nothing ── */
  if (s(body.website)) {
    console.warn('LP honeypot hit, dropped:', JSON.stringify({ email: d.email, source: d.source }));
    return json({ ok: true });
  }

  if (!d.name || !d.email) return json({ error: 'Please fill in all required fields.' }, 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) return json({ error: 'Please enter a valid email address.' }, 400);

  if (sentRecently(s(body.idem))) {
    console.warn('LP duplicate brief dropped:', s(body.idem));
    return json({ ok: true });
  }
  // Sent within 2.5 s of opening: likely a bot. Flag it in the subject, never block it.
  const fast = typeof body.t === 'number' && body.t > 0 && body.t < 2500;

  /* ── Always log first, so a lead is never lost even if every service fails ── */
  console.log('LP form submission:', JSON.stringify(d));

  const pkgLabel = packageLabel(d.pkg, variant);
  const pageUri = referer || `https://www.fazeddigital.com/lp/7-day-website${variant === 'php' ? '/ph' : ''}`;
  const [mail, hs] = await Promise.all([
    sendLead({
      to: LEAD_TO,
      replyTo: d.email,
      subject: `${fast ? '[fast] ' : ''}New 7-Day Website lead: ${d.businessName || d.name} (${pkgLabel})`,
      html: buildHtml(d, pkgLabel),
    }),
    saveToHubSpot({
      name: d.name, email: d.email, serviceLabel: '7-Day Website Package', pageUri,
      pageName: `Fazed Digital — 7-Day LP (${variant.toUpperCase()})`,
      message: briefText(d, pkgLabel),
    }),
  ]);
  console.log(`LP lead: email=${mail || 'failed'} hubspot=${hs}`);

  // Nothing reached the team: tell the visitor, so the form keeps their answers and offers "Email it instead".
  if (!mail && hs !== 'ok') return json({ error: 'Your brief didn’t send. Please try again, or email it to info@fazeddigital.com.' }, 502);
  if (s(body.idem)) sent.set(s(body.idem), Date.now());

  // The lead's own copy: what happens next + their answers. Only once the team has it, never for a [fast] send.
  if (!fast && confirmAllowed(d.email)) {
    const c = await sendLead({
      to: [d.email],
      replyTo: NAP.email,
      fromName: 'Lord at Fazed Digital',
      subject: `Got it, ${firstName(d.name)}. Your 7-day website brief is in`,
      html: buildConfirmHtml(d, pkgLabel),
      text: buildConfirmText(d, pkgLabel),
    });
    console.log(`LP confirmation: ${c || 'failed'}`);
  }
  return json({ ok: true });
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
interface Lead {
  variant: 'usd' | 'php'; pkg: string; businessName: string; industry: string; goal: string; timeline: string;
  styleVibe: string; facebookPage: string; currentWebsite: string; name: string; email: string; phone: string; notes: string; source: string;
  pagesNeeded: string[]; brandColors: string; inspirationUrls: string; referral: string; packageFrom: string;
}

function packageLabel(pkg: string, variant: 'usd' | 'php'): string {
  const name = PACKAGE_NAMES[pkg];
  if (!name) return pkg || 'Package not selected';
  const { price, founding } = offerPrice(variant, pkg);
  if (founding) return `${name} (${price} founding rate, standard ${FOUNDING_PH.standard})`;
  return price ? `${name} (${price})` : name;
}

/** The lead's answers as label/value rows; empty answers are left out. */
function rows(d: Lead, pkgLabel: string): [string, string][] {
  const all: [string, string][] = [
    ['Package', pkgLabel + (d.packageFrom === 'pricing' ? ' (picked from the pricing table)' : '')],
    ['Page', d.variant === 'php' ? 'Philippines (₱)' : 'International ($)'],
    ['Business', d.businessName],
    ['Industry', d.industry],
    ['Goal', GOAL_LABELS[d.goal] ?? d.goal],
    ['Launch', TIMELINE_LABELS[d.timeline] ?? d.timeline],
    ['Style', STYLE_LABELS[d.styleVibe] ?? d.styleVibe],
    ['Facebook page', d.facebookPage],
    ['Current website', d.currentWebsite],
    ['Pages needed', d.pagesNeeded.join(', ')],
    ['Brand colors', d.brandColors],
    ['Inspiration', d.inspirationUrls],
    ['Name', d.name],
    ['Email', d.email],
    ['Phone', d.phone || '—'],
    ['Heard from', d.referral],
    ['Notes', d.notes],
    ['Source', d.source],
  ];
  return all.filter(([, v]) => v);
}

function briefText(d: Lead, pkgLabel: string): string {
  return rows(d, pkgLabel).filter(([k]) => k !== 'Name' && k !== 'Email').map(([k, v]) => `${k}: ${v}`).join('\n');
}

function buildHtml(d: Lead, pkgLabel: string): string {
  const tableRows = rows(d, pkgLabel).map(([k, v]) => `
    <tr>
      <td style="padding:10px 14px;border-bottom:1px solid #2a2a2a;color:#888;font-family:monospace;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;width:140px;vertical-align:top;">${escape(k)}</td>
      <td style="padding:10px 14px;border-bottom:1px solid #2a2a2a;color:#eaeaea;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:14px;line-height:1.5;white-space:pre-wrap;">${escape(v)}</td>
    </tr>`).join('');

  return `
<!doctype html>
<html><body style="margin:0;background:#0a0a0a;padding:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:640px;margin:0 auto;background:#111;border:1px solid #2a2a2a;border-radius:14px;overflow:hidden;">
    <div style="padding:22px 24px;border-bottom:1px solid #2a2a2a;background:rgba(201,255,87,0.04);">
      <div style="font-size:11px;font-family:monospace;letter-spacing:0.12em;text-transform:uppercase;color:#C9FF57;margin-bottom:6px;">New LP Lead · 7-Day Website</div>
      <div style="font-size:20px;font-weight:700;color:#fff;letter-spacing:-0.02em;">${escape(d.businessName || d.name)}</div>
      <div style="font-size:13px;color:#888;margin-top:4px;">${escape(pkgLabel)} · ${escape(d.email)}${d.phone ? ' · ' + escape(d.phone) : ''}</div>
    </div>
    <table style="width:100%;border-collapse:collapse;">${tableRows}</table>
    <div style="padding:16px 24px;background:#0a0a0a;font-size:12px;color:#666;">
      Reply directly to this email to reach <strong style="color:#aaa;">${escape(d.name)}</strong> at ${escape(d.email)}. Also saved in HubSpot.
    </div>
  </div>
</body></html>`;
}

/* ── The lead's confirmation email ── */
const firstName = (n: string) => n.split(/\s+/)[0] || 'there';

function nextSteps(d: Lead): string[] {
  const founding = d.variant === 'php' && offerPrice('php', d.pkg).founding;
  return [
    d.pkg === 'unsure'
      ? 'Within one business day, we reply with the package we’d suggest, your confirmed start date and a fixed quote.'
      : 'Within one business day, we reply with your confirmed start date and a fixed quote.',
    founding
      ? 'No payment until you approve the quote. Your founding-rate deposit is refundable before work starts.'
      : 'No payment until you approve the quote.',
    d.variant === 'php' && d.facebookPage
      ? 'Day 1: you send your logo, photos and text, or we pull them from your Facebook page. Missing something? We’ll help.'
      : 'Day 1: you send your logo, photos and text. Missing something? We’ll help.',
    'Day 7: your site goes live on the host you prefer. If we miss the deadline on our side, you get 20% off.',
  ];
}

/** The answers worth showing back to the lead (contact details left out: they know them). */
function confirmRows(d: Lead, pkgLabel: string): [string, string][] {
  return rows(d, pkgLabel).filter(([k]) => !['Page', 'Name', 'Email', 'Phone', 'Source', 'Heard from'].includes(k))
    .map(([k, v]) => [k, k === 'Package' ? pkgLabel : v]);
}

function buildConfirmText(d: Lead, pkgLabel: string): string {
  return [
    `Hi ${firstName(d.name)},`,
    '',
    `Thanks for sending your brief${d.businessName ? ` for ${d.businessName}` : ''}. It’s with our team now, and a real person will reply.`,
    '',
    'WHAT HAPPENS NEXT',
    ...nextSteps(d).map((t, i) => `${i + 1}. ${t}`),
    '',
    'YOUR BRIEF',
    ...confirmRows(d, pkgLabel).map(([k, v]) => `${k}: ${v}`),
    '',
    'Want to add something or change an answer? Just reply to this email.',
    '',
    'Lord Arcamo',
    'Founder, Fazed Digital',
    `${NAP.phone} (call or text) · ${NAP.hours}`,
    SITE_URL,
    '',
    `While you wait: Dotted Studios went live one week after the build started. ${SITE_URL}/work/09`,
  ].join('\n');
}

function buildConfirmHtml(d: Lead, pkgLabel: string): string {
  const font = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
  const mono = "'SFMono-Regular',Menlo,Consolas,monospace";
  const steps = nextSteps(d).map((t, i) => `
      <tr>
        <td style="width:34px;padding:0 0 14px;vertical-align:top;"><div style="width:24px;height:24px;border-radius:12px;background:#090909;color:#C9FF57;font:700 12px/24px ${mono};text-align:center;">${i + 1}</div></td>
        <td style="padding:2px 0 14px;font:15px/1.55 ${font};color:#222;">${escape(t)}</td>
      </tr>`).join('');
  const brief = confirmRows(d, pkgLabel).map(([k, v]) => `
      <tr>
        <td style="padding:9px 0;border-bottom:1px solid #e6e5e0;font:11px/1.5 ${mono};letter-spacing:.06em;text-transform:uppercase;color:#77766f;width:130px;vertical-align:top;">${escape(k)}</td>
        <td style="padding:9px 0;border-bottom:1px solid #e6e5e0;font:14px/1.5 ${font};color:#222;white-space:pre-wrap;">${escape(v)}</td>
      </tr>`).join('');
  const preheader = 'A real person replies within one business day with your start date and a fixed quote.';

  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>Your brief is in</title></head>
<body style="margin:0;padding:0;background:#F5F4F0;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escape(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F5F4F0;"><tr><td align="center" style="padding:28px 14px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid #e6e5e0;border-radius:16px;overflow:hidden;">
      <tr><td style="background:#090909;padding:22px 28px;">
        <div style="font:700 18px/1 ${font};letter-spacing:.14em;color:#F5F4F0;">FAZED<span style="color:#C9FF57;">.</span></div>
        <div style="margin-top:14px;font:11px/1.4 ${mono};letter-spacing:.12em;text-transform:uppercase;color:#C9FF57;">Brief received · 7-day website</div>
      </td></tr>
      <tr><td style="padding:28px 28px 8px;">
        <h1 style="margin:0 0 12px;font:700 24px/1.25 ${font};letter-spacing:-.02em;color:#090909;">Thanks, ${escape(firstName(d.name))}. Your brief is in.</h1>
        <p style="margin:0;font:15px/1.6 ${font};color:#444;">It’s with our team now${d.businessName ? `, and we’re already looking at <strong style="color:#090909;">${escape(d.businessName)}</strong>` : ''}. A real person will reply, not a bot.</p>
      </td></tr>
      <tr><td style="padding:22px 28px 6px;">
        <div style="font:11px/1.4 ${mono};letter-spacing:.12em;text-transform:uppercase;color:#77766f;margin-bottom:14px;">What happens next</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${steps}</table>
      </td></tr>
      <tr><td style="padding:10px 28px 4px;">
        <div style="font:11px/1.4 ${mono};letter-spacing:.12em;text-transform:uppercase;color:#77766f;margin-bottom:4px;">Your brief</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${brief}</table>
        <p style="margin:14px 0 0;font:14px/1.55 ${font};color:#444;">Want to add something or change an answer? Just reply to this email.</p>
      </td></tr>
      <tr><td style="padding:24px 28px;">
        <table role="presentation" cellpadding="0" cellspacing="0"><tr>
          <td style="padding-right:14px;vertical-align:middle;"><img src="${SITE_URL}/images/team/lord.jpeg" width="52" height="52" alt="Lord Arcamo" style="display:block;border-radius:26px;object-fit:cover;"></td>
          <td style="vertical-align:middle;font:14px/1.5 ${font};color:#444;">
            <strong style="color:#090909;">Lord Arcamo</strong><br>Founder, Fazed Digital<br>
            <a href="tel:${NAP.tel}" style="color:#090909;">${NAP.phone}</a> (call or text) · ${NAP.hours}
          </td>
        </tr></table>
      </td></tr>
      <tr><td style="background:#090909;padding:18px 28px;font:14px/1.55 ${font};color:#cfcec9;">
        While you wait: <a href="${SITE_URL}/work/09" style="color:#C9FF57;">see Dotted Studios</a>, live one week after the build started.
      </td></tr>
    </table>
    <p style="margin:16px 0 0;font:12px/1.5 ${font};color:#77766f;">You’re getting this because you sent a brief at <a href="${SITE_URL}" style="color:#77766f;">fazeddigital.com</a>. ${NAP.city}, ${NAP.country}.</p>
  </td></tr></table>
</body></html>`;
}

function escape(s: string): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function json(data: object, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
}

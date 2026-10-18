export const prerender = false;

import type { APIRoute } from 'astro';
import { sendLead } from '../../lib/mail';
import { saveToHubSpot } from '../../lib/hubspot';
import { prices } from '../../data/proof';

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

// Best-effort duplicate guard: the same brief id within 10 minutes is accepted but not sent twice.
// (Lives in the warm function instance; the client also blocks double taps.)
const seen = new Map<string, number>();
function duplicate(id: string): boolean {
  if (!id) return false;
  const now = Date.now();
  for (const [k, at] of seen) if (now - at > 600_000) seen.delete(k);
  if (seen.has(id)) return true;
  seen.set(id, now);
  return false;
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

  if (duplicate(s(body.idem))) {
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

  // Soft-fail: the lead is already in the log above, so the visitor always gets a success.
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
  const price = (prices[variant] as Record<string, string>)[pkg];
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

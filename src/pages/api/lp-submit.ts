export const prerender = false;

import type { APIRoute } from 'astro';
import { sendLead } from '../../lib/mail';

// ─── Lead notification recipients (Google Workspace first, Resend fallback: src/lib/mail.ts) ──
const LEAD_TO = [
  'reancirl@gmail.com',
  'russeljessheyrana@gmail.com',
  'lordrynkartracydwight@gmail.com',
  'justinjacobsumaya8@gmail.com',
  'info@fazeddigital.com',
];

// ─── Label maps (match LpForm.tsx values) ────────────────────────────────────
const PACKAGE_LABELS: Record<string, string> = {
  starter: 'Starter ($499)',
  growth:  'Growth ($899)',
  pro:     'Pro ($1,499)',
};

const GOAL_LABELS: Record<string, string> = {
  leads:       'Get more leads & inquiries',
  sell:        'Sell products online',
  credibility: 'Build credibility & trust',
  replace:     'Replace old/outdated website',
  launch:      'Launch a new business',
  other:       'Something else',
};

const STYLE_LABELS: Record<string, string> = {
  minimal:   'Minimal & Clean',
  bold:      'Bold & Vibrant',
  corporate: 'Corporate & Professional',
  playful:   'Playful & Fun',
};

// ─── Request body type ────────────────────────────────────────────────────────
interface LpSubmitBody {
  package?: string;
  businessName?: string;
  industry?: string;
  goal?: string;
  styleVibe?: string;
  pagesNeeded?: string[];
  brandColors?: string;
  inspirationUrls?: string;
  name?: string;
  email?: string;
  phone?: string;
  referral?: string;
  notes?: string;
  captchaToken?: string;
}

export const POST: APIRoute = async ({ request }) => {
  /* ── Parse ─────────────────────────────────────────────── */
  let body: LpSubmitBody;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request' }, 400);
  }

  const {
    package: pkg = '',
    businessName = '',
    industry = '',
    goal = '',
    styleVibe = '',
    pagesNeeded = [],
    brandColors = '',
    inspirationUrls = '',
    name = '',
    email = '',
    phone = '',
    referral = '',
    notes = '',
  } = body;

  /* ── Validate ──────────────────────────────────────────── */
  if (!name.trim() || !email.trim()) {
    return json({ error: 'Please fill in all required fields.' }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: 'Please enter a valid email address.' }, 400);
  }

  /* ── Always log so a lead is never lost even if email fails ─────── */
  const payload = { name, email, phone, pkg, businessName, industry, goal, styleVibe, pagesNeeded, brandColors, inspirationUrls, referral, notes };
  console.log('LP form submission:', JSON.stringify(payload));

  /* ── Send notification email (Gmail → Resend fallback) ─── */
  const subject = `New 7-Day Website lead: ${businessName || name} (${PACKAGE_LABELS[pkg] ?? pkg})`;
  const via = await sendLead({
    to: LEAD_TO,
    replyTo: email,
    subject,
    html: buildHtml({
      pkg, businessName, industry, goal, styleVibe, pagesNeeded,
      brandColors, inspirationUrls, name, email, phone, referral, notes,
    }),
  });
  // Soft-fail: the lead is already in the log above, so the visitor always gets a success.
  if (via) console.log(`LP lead emailed via ${via}`);

  return json({ ok: true });
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function buildHtml(d: {
  pkg: string; businessName: string; industry: string; goal: string;
  styleVibe: string; pagesNeeded: string[]; brandColors: string; inspirationUrls: string;
  name: string; email: string; phone: string; referral: string; notes: string;
}): string {
  const rows: [string, string][] = [
    ['Package',          PACKAGE_LABELS[d.pkg] ?? d.pkg ?? '—'],
    ['Business',         d.businessName || '—'],
    ['Industry',         d.industry || '—'],
    ['Goal',             GOAL_LABELS[d.goal] ?? d.goal ?? '—'],
    ['Style vibe',       STYLE_LABELS[d.styleVibe] ?? d.styleVibe ?? '—'],
    ['Pages needed',     d.pagesNeeded?.length ? d.pagesNeeded.join(', ') : '—'],
    ['Brand colors',     d.brandColors || '—'],
    ['Inspiration URLs', d.inspirationUrls || '—'],
    ['Name',             d.name],
    ['Email',            d.email],
    ['Phone',            d.phone || '—'],
    ['Heard from',       d.referral || '—'],
    ['Notes',            d.notes || '—'],
  ];

  const tableRows = rows.map(([k, v]) => `
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
      <div style="font-size:13px;color:#888;margin-top:4px;">${escape(PACKAGE_LABELS[d.pkg] ?? d.pkg ?? 'Package not selected')} · ${escape(d.email)}</div>
    </div>
    <table style="width:100%;border-collapse:collapse;">${tableRows}</table>
    <div style="padding:16px 24px;background:#0a0a0a;font-size:12px;color:#666;">
      Reply directly to this email to reach <strong style="color:#aaa;">${escape(d.name)}</strong> at ${escape(d.email)}.
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
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

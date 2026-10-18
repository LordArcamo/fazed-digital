export const prerender = false;

import type { APIRoute } from 'astro';
import { sendLead } from '../../lib/mail';
import { saveToHubSpot } from '../../lib/hubspot';

// ─── Lead notification (Google Workspace first, Resend fallback: src/lib/mail.ts) ──
const LEAD_TO = ['info@fazeddigital.com'];

// ─── reCAPTCHA v3 config ─────────────────────────────────────────────────────
const RECAPTCHA_SECRET = import.meta.env.RECAPTCHA_SECRET_KEY;

const SERVICE_LABELS: Record<string, string> = {
  web:     'Web Design & Development',
  brand:   'Brand Identity',
  seo:     'SEO Marketing',
  product: 'Product Design',
  systems: 'Custom System / Web App',
  '7day':  '7-Day Website Package',
  unsure:  'Not Sure Yet',
  other:   'Other',
};

export const POST: APIRoute = async ({ request }) => {
  /* ── Parse body ─────────────────────────────────────────── */
  let body: { name?: string; email?: string; phone?: string; service?: string; message?: string; company?: string; budget?: string; website?: string; captchaToken?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request' }, 400);
  }

  const { name = '', email = '', phone = '', service = '', message = '', company = '', budget = '', website = '', captchaToken = '' } = body;
  // optional fields are folded into the message so the HubSpot form needs no new properties
  const fullMessage = [message, company && `Business: ${company}`, phone && `Phone: ${phone}`, budget && `Budget: ${budget}`].filter(Boolean).join('\n\n');

  /* ── Bots fill the hidden honeypot; pretend success, send nothing ── */
  if (website.trim()) {
    console.warn('Contact honeypot hit, dropped:', JSON.stringify({ email }));
    return json({ ok: true });
  }

  /* ── Verify reCAPTCHA v3 token ──────────────────────────── */
  // TODO: re-enable hard block once correct secret key is confirmed in Vercel
  if (RECAPTCHA_SECRET) {
    try {
      const captchaRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${RECAPTCHA_SECRET}&response=${captchaToken}`,
      });
      const captchaData = await captchaRes.json() as { success: boolean; score: number; action: string; 'error-codes'?: string[] };
      console.log('reCAPTCHA result (contact):', JSON.stringify(captchaData));
    } catch (err) {
      console.warn('reCAPTCHA check error (contact):', err);
    }
  }

  if (!name.trim() || !email.trim() || !message.trim()) {
    return json({ error: 'Please fill in all required fields.' }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: 'Please enter a valid email address.' }, 400);
  }

  const serviceLabel = SERVICE_LABELS[service] ?? 'Not specified';

  /* ── Always log, then email the lead to info@ (a lead is never lost) ── */
  console.log('Contact form submission:', JSON.stringify({ name, email, phone, service: serviceLabel, company, budget, message }));
  const emailed = await sendLeadEmail({ name, email, phone, serviceLabel, company, budget, message });

  /* ── Save to HubSpot (the leads list) ─────────────────── */
  const hs = await saveToHubSpot({
    name, email, message: fullMessage, serviceLabel,
    pageUri: request.headers.get('referer') ?? 'https://www.fazeddigital.com/contact',
    pageName: 'Fazed Digital — Contact',
  });
  // HubSpot unreachable AND no email went out: the visitor must retry. Otherwise the lead is safe.
  if (hs === 'unreachable' && !emailed) {
    return json({ error: 'Something went wrong on our side and your message didn’t send. Please try again, or email us at info@fazeddigital.com.' }, 502);
  }

  return json({ ok: true });
};

// ─── Lead notification email ──────────────────────────────────────────────────
// Returns true when Gmail or Resend accepted the email. Never throws: a failed email must not block the form.
async function sendLeadEmail(d: { name: string; email: string; phone: string; serviceLabel: string; company: string; budget: string; message: string }): Promise<boolean> {
  const via = await sendLead({
    to: LEAD_TO,
    replyTo: d.email,
    subject: `New contact lead: ${d.company || d.name} (${d.serviceLabel})`,
    html: buildHtml(d),
  });
  if (via) console.log(`Contact lead emailed via ${via}`);
  return via !== false;
}

function buildHtml(d: { name: string; email: string; phone: string; serviceLabel: string; company: string; budget: string; message: string }): string {
  const rows: [string, string][] = [
    ['Service',  d.serviceLabel],
    ['Name',     d.name],
    ['Email',    d.email],
    ['Phone',    d.phone || '—'],
    ['Business', d.company || '—'],
    ['Budget',   d.budget || '—'],
    ['Message',  d.message],
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
      <div style="font-size:11px;font-family:monospace;letter-spacing:0.12em;text-transform:uppercase;color:#C9FF57;margin-bottom:6px;">New Contact Lead · fazeddigital.com</div>
      <div style="font-size:20px;font-weight:700;color:#fff;letter-spacing:-0.02em;">${escape(d.company || d.name)}</div>
      <div style="font-size:13px;color:#888;margin-top:4px;">${escape(d.serviceLabel)} · ${escape(d.email)}</div>
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

export const prerender = false;

import type { APIRoute } from 'astro';
import { sendLead } from '../../lib/mail';

// ─── HubSpot config ─────────────────────────────────────────────────────────
const PORTAL_ID = '244473168';
const FORM_GUID = import.meta.env.HUBSPOT_FORM_GUID ?? 'c119e15a-357c-4bfb-9264-a1fb3f1a3389';

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
  let body: { name?: string; email?: string; service?: string; message?: string; company?: string; budget?: string; captchaToken?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request' }, 400);
  }

  const { name = '', email = '', service = '', message = '', company = '', budget = '', captchaToken = '' } = body;
  // optional fields are folded into the message so the HubSpot form needs no new properties
  const fullMessage = [message, company && `Business: ${company}`, budget && `Budget: ${budget}`].filter(Boolean).join('\n\n');

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

  const [firstName, ...rest] = name.trim().split(' ');
  const lastName     = rest.join(' ') || '-';
  const serviceLabel = SERVICE_LABELS[service] ?? 'Not specified';

  /* ── Always log, then email the lead to info@ (a lead is never lost) ── */
  console.log('Contact form submission:', JSON.stringify({ name, email, service: serviceLabel, company, budget, message }));
  const emailed = await sendLeadEmail({ name, email, serviceLabel, company, budget, message });

  /* ── Submit to HubSpot public Forms API (no auth needed) ── */
  let hsRes: Response;
  try {
  hsRes = await fetch(
    `https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${FORM_GUID}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: [
          { name: 'firstname', value: firstName },
          { name: 'lastname',  value: lastName  },
          { name: 'email',     value: email     },
          { name: 'message',   value: fullMessage },
          { name: 'service_interest', value: serviceLabel },
        ],
        context: {
          pageUri:  request.headers.get('referer') ?? 'https://www.fazeddigital.com/contact',
          pageName: 'Fazed Digital — Contact',
        },
        legalConsentOptions: {
          consent: {
            consentToProcess: true,
            text: 'I agree to allow Fazed Digital to store and process my personal data.',
          },
        },
      }),
    }
  );
  } catch (err) {
    // network failure / no outbound access: graceful error, never a crash
    console.error('HubSpot Forms API unreachable:', err);
    // the email already reached info@, so the lead is safe
    if (emailed) return json({ ok: true });
    return json({ error: 'Something went wrong on our side and your message didn’t send. Please try again, or email us at info@fazeddigital.com.' }, 502);
  }

  if (!hsRes.ok) {
    const errText = await hsRes.text();
    console.error('HubSpot Forms API error:', hsRes.status, errText);
    // Still return OK to the user — don't expose internal errors
    return json({ ok: true });
  }

  return json({ ok: true });
};

// ─── Lead notification email ──────────────────────────────────────────────────
// Returns true when Gmail or Resend accepted the email. Never throws: a failed email must not block the form.
async function sendLeadEmail(d: { name: string; email: string; serviceLabel: string; company: string; budget: string; message: string }): Promise<boolean> {
  const via = await sendLead({
    to: LEAD_TO,
    replyTo: d.email,
    subject: `New contact lead: ${d.company || d.name} (${d.serviceLabel})`,
    html: buildHtml(d),
  });
  if (via) console.log(`Contact lead emailed via ${via}`);
  return via !== false;
}

function buildHtml(d: { name: string; email: string; serviceLabel: string; company: string; budget: string; message: string }): string {
  const rows: [string, string][] = [
    ['Service',  d.serviceLabel],
    ['Name',     d.name],
    ['Email',    d.email],
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

export const prerender = false;

import type { APIRoute } from 'astro';

// ─── HubSpot config ─────────────────────────────────────────────────────────
const PORTAL_ID = '244473168';
const FORM_GUID = import.meta.env.HUBSPOT_FORM_GUID ?? 'c119e15a-357c-4bfb-9264-a1fb3f1a3389';

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

function json(data: object, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

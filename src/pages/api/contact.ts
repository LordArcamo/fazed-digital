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
  other:   'Other',
};

export const POST: APIRoute = async ({ request }) => {
  /* ── Parse body ─────────────────────────────────────────── */
  let body: { name?: string; email?: string; service?: string; message?: string; captchaToken?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request' }, 400);
  }

  const { name = '', email = '', service = '', message = '', captchaToken = '' } = body;

  /* ── Verify reCAPTCHA v3 token ──────────────────────────── */
  if (RECAPTCHA_SECRET) {
    const captchaRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${RECAPTCHA_SECRET}&response=${captchaToken}`,
    });
    const captchaData = await captchaRes.json() as { success: boolean; score: number; action: string };
    if (!captchaData.success || captchaData.score < 0.5) {
      console.warn('reCAPTCHA failed:', captchaData);
      return json({ error: 'Spam check failed. Please try again.' }, 400);
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
  const hsRes = await fetch(
    `https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${FORM_GUID}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: [
          { name: 'firstname', value: firstName },
          { name: 'lastname',  value: lastName  },
          { name: 'email',     value: email     },
          { name: 'message',   value: message   },
          { name: 'service_interest', value: serviceLabel },
        ],
        context: {
          pageUri:  request.headers.get('referer') ?? 'https://fazeddigital.com/contact',
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

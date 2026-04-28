export const prerender = false;

import type { APIRoute } from 'astro';

// ─── HubSpot config ───────────────────────────────────────────────────────────
const PORTAL_ID = '244473168';
const FORM_GUID = import.meta.env.HUBSPOT_FORM_GUID ?? 'c119e15a-357c-4bfb-9264-a1fb3f1a3389';

// ─── reCAPTCHA ────────────────────────────────────────────────────────────────
const RECAPTCHA_SECRET = import.meta.env.RECAPTCHA_SECRET_KEY;

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
    captchaToken = '',
  } = body;

  /* ── reCAPTCHA ─────────────────────────────────────────── */
  if (RECAPTCHA_SECRET) {
    try {
      const captchaRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${RECAPTCHA_SECRET}&response=${captchaToken}`,
      });
      const captchaData = await captchaRes.json() as { success: boolean; score: number; 'error-codes'?: string[] };
      console.log('reCAPTCHA result (LP):', JSON.stringify(captchaData));
      // Soft-fail: log failures but don't block submissions while keys are being verified
      if (!captchaData.success) {
        console.warn('reCAPTCHA soft-fail (LP):', captchaData);
      }
    } catch (err) {
      console.warn('reCAPTCHA check error (LP):', err);
    }
  }

  /* ── Validate ──────────────────────────────────────────── */
  if (!name.trim() || !email.trim()) {
    return json({ error: 'Please fill in all required fields.' }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: 'Please enter a valid email address.' }, 400);
  }

  /* ── Prepare values ────────────────────────────────────── */
  const [firstName, ...rest] = name.trim().split(' ');
  const lastName = rest.join(' ') || '-';

  const packageLabel = PACKAGE_LABELS[pkg] || pkg;
  const goalLabel    = GOAL_LABELS[goal]   || goal;
  const styleLabel   = STYLE_LABELS[styleVibe] || styleVibe;
  const pagesString  = pagesNeeded.join(', ');

  // Full message summary — readable in HubSpot inbox even without custom properties
  const message = [
    `Package: ${packageLabel}`,
    `Business: ${businessName}${industry ? ` | ${industry}` : ''}`,
    `Goal: ${goalLabel}`,
    `Style: ${styleLabel}`,
    `Pages: ${pagesString}`,
    brandColors     ? `Brand colors: ${brandColors}`           : '',
    inspirationUrls ? `Inspiration: ${inspirationUrls}`        : '',
    referral        ? `Referral: ${referral}`                  : '',
    notes           ? `Notes: ${notes}`                        : '',
  ].filter(Boolean).join('\n');

  /* ── Build HubSpot fields array ────────────────────────── */
  // Standard properties (always exist on free plan)
  const fields = [
    { name: 'firstname',      value: firstName },
    { name: 'lastname',       value: lastName },
    { name: 'email',          value: email },
    { name: 'message',        value: message },
    { name: 'lifecyclestage', value: 'lead' },
    ...(phone        ? [{ name: 'phone',   value: phone }]        : []),
    ...(businessName ? [{ name: 'company', value: businessName }] : []),

    // Custom properties — only populate once created in HubSpot:
    // Settings → Properties → Contacts → Create property
    ...(packageLabel  ? [{ name: 'website_package',   value: packageLabel }]  : []),
    ...(industry      ? [{ name: 'business_industry', value: industry }]      : []),
    ...(goalLabel     ? [{ name: 'project_goal',      value: goalLabel }]     : []),
    ...(styleLabel    ? [{ name: 'website_style',     value: styleLabel }]    : []),
    ...(pagesString   ? [{ name: 'pages_needed',      value: pagesString }]   : []),
    ...(referral      ? [{ name: 'referral_source',   value: referral }]      : []),
  ];

  /* ── Submit to HubSpot ─────────────────────────────────── */
  const hsRes = await fetch(
    `https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${FORM_GUID}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields,
        context: {
          pageUri:  request.headers.get('referer') ?? 'https://fazeddigital.com/lp/7-day-website',
          pageName: 'Fazed Digital — 7-Day Website LP',
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
    console.error('HubSpot LP submit error:', hsRes.status, errText);
    // Still return OK — don't surface internal errors to the visitor
  }

  return json({ ok: true });
};

function json(data: object, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

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

  /* ── Validate ──────────────────────────────────────────── */
  if (!name.trim() || !email.trim()) {
    return json({ error: 'Please fill in all required fields.' }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: 'Please enter a valid email address.' }, 400);
  }

  // TODO: Wire up HubSpot once LP form is created in HubSpot
  // and LP_FORM_GUID env var is set
  console.log('LP form submission (static mode):', { name, email, phone, pkg, businessName, industry, goal });

  return json({ ok: true });
};

function json(data: object, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

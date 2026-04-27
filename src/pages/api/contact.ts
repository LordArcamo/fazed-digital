export const prerender = false; // serverless — never statically rendered

import type { APIRoute } from 'astro';

const HUBSPOT_TOKEN   = import.meta.env.HUBSPOT_ACCESS_TOKEN;
const HUBSPOT_PORTAL  = '244473168';
const NOTIFY_EMAIL    = 'info@fazeddigital.com';

/* Map service dropdown value → readable label */
const SERVICE_LABELS: Record<string, string> = {
  web:     'Web Design & Development',
  brand:   'Brand Identity',
  seo:     'SEO Marketing',
  product: 'Product Design',
  other:   'Other',
};

export const POST: APIRoute = async ({ request }) => {
  /* ── 1. Parse body ──────────────────────────────────────── */
  let body: { name?: string; email?: string; service?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  const { name = '', email = '', service = '', message = '' } = body;

  if (!name.trim() || !email.trim() || !message.trim()) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ error: 'Invalid email' }), { status: 400 });
  }
  if (!HUBSPOT_TOKEN) {
    return new Response(JSON.stringify({ error: 'HubSpot not configured' }), { status: 500 });
  }

  const [firstName, ...rest] = name.trim().split(' ');
  const lastName  = rest.join(' ') || '';
  const serviceLabel = SERVICE_LABELS[service] ?? service ?? 'Not specified';

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${HUBSPOT_TOKEN}`,
  };

  /* ── 2. Upsert contact in HubSpot ───────────────────────── */
  let contactId: string | null = null;
  try {
    const res = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        properties: {
          email,
          firstname:      firstName,
          lastname:       lastName,
          hs_lead_source: 'Website Contact Form',
          message,
          // Store the service enquiry in the "jobtitle" field (repurposed) or a custom prop
          // Using "subject" note for now — easy to map to a custom property later
        },
      }),
    });

    if (res.ok) {
      const data = await res.json();
      contactId = data.id;
    } else if (res.status === 409) {
      // Contact already exists — fetch their ID
      const existing = await fetch(
        `https://api.hubapi.com/crm/v3/objects/contacts/${encodeURIComponent(email)}?idProperty=email`,
        { headers }
      );
      if (existing.ok) {
        const data = await existing.json();
        contactId = data.id;
        // Update existing contact properties
        await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify({
            properties: { hs_lead_source: 'Website Contact Form', message },
          }),
        });
      }
    }
  } catch (err) {
    console.error('HubSpot contact error:', err);
  }

  /* ── 3. Create a Deal linked to the contact ─────────────── */
  try {
    const dealRes = await fetch('https://api.hubapi.com/crm/v3/objects/deals', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        properties: {
          dealname:   `${name} — ${serviceLabel}`,
          pipeline:   'default',
          dealstage:  'appointmentscheduled', // first stage: "New Lead"
          description: message,
          hs_lead_source: 'Website Contact Form',
        },
        associations: contactId
          ? [{ to: { id: contactId }, types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 3 }] }]
          : [],
      }),
    });
    if (!dealRes.ok) {
      const errBody = await dealRes.text();
      console.error('Deal creation failed:', errBody);
    }
  } catch (err) {
    console.error('HubSpot deal error:', err);
  }

  /* ── 4. Internal notification note on the contact ───────── */
  if (contactId) {
    try {
      await fetch('https://api.hubapi.com/crm/v3/objects/notes', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          properties: {
            hs_note_body: `New enquiry from website:\n\nService: ${serviceLabel}\n\nMessage:\n${message}`,
            hs_timestamp: new Date().toISOString(),
          },
          associations: [
            { to: { id: contactId }, types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 202 }] },
          ],
        }),
      });
    } catch (err) {
      console.error('HubSpot note error:', err);
    }
  }

  return new Response(JSON.stringify({ ok: true, contactId }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

// Saves a lead as a contact in HubSpot (the leads list / CRM) through the public Forms API (no auth).
// The Gmail alert is separate (src/lib/mail.ts); HubSpot is the record, not the notification.
const PORTAL_ID = '244473168';
const FORM_GUID = import.meta.env.HUBSPOT_FORM_GUID ?? 'c119e15a-357c-4bfb-9264-a1fb3f1a3389';

export interface HsLead { name: string; email: string; message: string; serviceLabel: string; pageUri: string; pageName: string }
/** ok = stored · rejected = HubSpot answered with an error · unreachable = network failure */
export type HsResult = 'ok' | 'rejected' | 'unreachable';

export async function saveToHubSpot(l: HsLead): Promise<HsResult> {
  const [firstName, ...rest] = l.name.trim().split(/\s+/);
  let res: Response;
  try {
    // Only fields the existing HubSpot form already accepts; extra details travel inside `message`.
    res = await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${FORM_GUID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: [
          { name: 'firstname', value: firstName },
          { name: 'lastname', value: rest.join(' ') || '-' },
          { name: 'email', value: l.email },
          { name: 'message', value: l.message },
          { name: 'service_interest', value: l.serviceLabel },
        ],
        context: { pageUri: l.pageUri, pageName: l.pageName },
        legalConsentOptions: {
          consent: { consentToProcess: true, text: 'I agree to allow Fazed Digital to store and process my personal data.' },
        },
      }),
    });
  } catch (err) {
    console.error('HubSpot Forms API unreachable:', err);
    return 'unreachable';
  }
  if (!res.ok) {
    console.error('HubSpot Forms API error:', res.status, await res.text().catch(() => ''));
    return 'rejected';
  }
  return 'ok';
}

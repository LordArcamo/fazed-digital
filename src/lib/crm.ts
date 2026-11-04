// Saves every lead to the private CRM (the Inbox in fazed-lead-app), alongside the Gmail alert, so a Gmail failure can't
// lose a lead and the Inbox can show which alerts never went out. Off until these are set in Vercel, then redeploy:
//   CRM_URL     the lead app's address
//   CRM_KEY     the website key (lead app → Workspaces → Website connection)
//   CRM_BYPASS  only if the lead app sits behind Vercel's login (Protection Bypass for Automation secret)
const CRM_URL = String(import.meta.env.CRM_URL ?? '').replace(/\/+$/, '');
const CRM_KEY = import.meta.env.CRM_KEY;
const CRM_BYPASS = import.meta.env.CRM_BYPASS;

export interface CrmLead {
  ref?: string; form: 'contact' | 'seven-day'; pipeline?: 'us' | 'ph';
  name: string; email: string; phone?: string; business?: string; website?: string;
  service?: string; package?: string; budget?: string; message?: string; source?: string;
  details?: Record<string, string>;
}

const clip = (v: string | undefined, max: number) => (v ? v.slice(0, max) : undefined);

function call(method: 'POST' | 'PATCH', body: object) {
  return fetch(`${CRM_URL}/api/inbound`, {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${CRM_KEY}`, ...(CRM_BYPASS ? { 'x-vercel-protection-bypass': CRM_BYPASS } : {}) },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(8000), // the free database can take a few seconds to wake
  });
}

/** Never throws: returns the lead's CRM key, or null if it wasn't saved (or the CRM isn't connected yet). */
export async function saveToCrm(l: CrmLead): Promise<string | null> {
  if (!CRM_URL || !CRM_KEY) return null;
  const details = Object.fromEntries(Object.entries(l.details ?? {}).filter(([, v]) => v).map(([k, v]) => [k.slice(0, 60), v.slice(0, 1000)]));
  try {
    const res = await call('POST', {
      ref: l.ref && /^[\w-]{6,48}$/.test(l.ref) ? l.ref : crypto.randomUUID(),
      form: l.form, pipeline: l.pipeline,
      // the CRM refuses over-long fields, and a lead must never be refused
      name: clip(l.name, 160), email: clip(l.email, 200), phone: clip(l.phone, 60), business: clip(l.business, 200), website: clip(l.website, 300),
      service: clip(l.service, 120), package: clip(l.package, 160), budget: clip(l.budget, 120), message: clip(l.message, 6000), source: clip(l.source, 300),
      details,
    });
    if (!res.ok) {
      console.error('CRM save failed:', res.status, await res.text().catch(() => ''));
      return null;
    }
    return ((await res.json()) as { key?: string }).key ?? null;
  } catch (err) {
    console.error('CRM save error:', err);
    return null;
  }
}

/** Tells the CRM whether the Gmail alert went out. Never throws. */
export async function markCrmAlert(key: string | null, sent: boolean) {
  if (!key) return;
  try {
    const res = await call('PATCH', { key, alert: sent ? 'sent' : 'failed' });
    if (!res.ok) console.error('CRM alert update failed:', res.status);
  } catch (err) {
    console.error('CRM alert update error:', err);
  }
}

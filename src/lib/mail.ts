// Lead email. Sends through Google Workspace (Gmail SMTP), so leads go Google → Google into info@ with our own SPF.
// Env (Vercel → Settings → Environment Variables, then redeploy):
//   GMAIL_APP_PASSWORD  App Password for the Workspace account below (2-Step Verification required)
//   GMAIL_USER          the Workspace account that signs in (default info@fazeddigital.com)
//   RESEND_API_KEY      Resend, for the contact form forward below. Unset: nothing is forwarded
//   RESEND_FROM         a sender on a domain verified in Resend
import nodemailer, { type Transporter } from 'nodemailer';

const GMAIL_USER = import.meta.env.GMAIL_USER ?? 'info@fazeddigital.com';
const GMAIL_APP_PASSWORD = String(import.meta.env.GMAIL_APP_PASSWORD ?? '').replace(/\s+/g, '');
const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
const RESEND_FROM = import.meta.env.RESEND_FROM ?? 'Fazed Digital <onboarding@resend.dev>';

// Every team alert (contact + 7-day forms): info@, copied to Lord and Russel.
export const LEAD_TO = ['info@fazeddigital.com'];
export const LEAD_CC = ['lordrynkartracydwight@gmail.com', 'russeljessheyrana@gmail.com'];
// General contact form only: the 7-day forms and the chat are not forwarded.
export const CONTACT_FORWARD_TO = ['reancirl@gmail.com'];

export interface LeadMail { to: string[]; cc?: string[]; subject: string; html: string; replyTo: string; text?: string; fromName?: string }
export type SentVia = 'gmail' | false;

// Reused across warm invocations so we don't open a new SMTP session per lead.
let gmail: Transporter | null = null;
function gmailTransport(): Transporter | null {
  if (!GMAIL_APP_PASSWORD) return null;
  gmail ??= nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
    // keep the form responsive if Google is slow
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });
  return gmail;
}

/** Sends a lead email (the team alert, or the lead's own confirmation via fromName). Never throws: returns 'gmail', or false if it failed. */
export async function sendLead(m: LeadMail): Promise<SentVia> {
  const t = gmailTransport();
  if (!t) {
    console.error('Gmail is not set up: GMAIL_APP_PASSWORD is missing');
    return false;
  }
  try {
    await t.sendMail({ from: `"${m.fromName ?? 'Fazed Digital Leads'}" <${GMAIL_USER}>`, to: m.to, cc: m.cc, replyTo: m.replyTo, subject: m.subject, html: m.html, text: m.text });
    return 'gmail';
  } catch (err) {
    console.error('Gmail send failed:', err);
    return false;
  }
}

/** An extra copy through Resend, on top of the Gmail alert. Never throws, and a failure here never fails the form. */
export async function forwardViaResend(m: Pick<LeadMail, 'to' | 'subject' | 'html' | 'replyTo'>): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.error('Resend is not set up: RESEND_API_KEY is missing');
    return false;
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: RESEND_FROM, to: m.to, reply_to: m.replyTo, subject: m.subject, html: m.html }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error('Resend send failed:', res.status, await res.text().catch(() => ''));
    return res.ok;
  } catch (err) {
    console.error('Resend send error:', err);
    return false;
  }
}

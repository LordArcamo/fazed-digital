// Lead notification email. Sends through Google Workspace (Gmail SMTP) first, so leads go
// Google → Google into info@ with our own SPF; falls back to Resend if Gmail is not set up or fails.
// Env (Vercel → Settings → Environment Variables, then redeploy):
//   GMAIL_APP_PASSWORD  App Password for the Workspace account below (2-Step Verification required)
//   GMAIL_USER          the Workspace account that signs in (default info@fazeddigital.com)
//   RESEND_API_KEY / RESEND_FROM  the fallback, unchanged
import nodemailer, { type Transporter } from 'nodemailer';

const GMAIL_USER = import.meta.env.GMAIL_USER ?? 'info@fazeddigital.com';
const GMAIL_APP_PASSWORD = String(import.meta.env.GMAIL_APP_PASSWORD ?? '').replace(/\s+/g, '');
const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
const RESEND_FROM = import.meta.env.RESEND_FROM ?? 'Fazed Digital <onboarding@resend.dev>';

export interface LeadMail { to: string[]; subject: string; html: string; replyTo: string }
export type SentVia = 'gmail' | 'resend' | false;

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

/** Sends the lead email. Never throws: returns which service delivered it, or false. */
export async function sendLead(m: LeadMail): Promise<SentVia> {
  const t = gmailTransport();
  if (t) {
    try {
      await t.sendMail({ from: `"Fazed Digital Leads" <${GMAIL_USER}>`, to: m.to, replyTo: m.replyTo, subject: m.subject, html: m.html });
      return 'gmail';
    } catch (err) {
      console.error('Gmail send failed, falling back to Resend:', err);
    }
  }

  if (!RESEND_API_KEY) {
    console.error('No working mail service (GMAIL_APP_PASSWORD and RESEND_API_KEY both missing or failed)');
    return false;
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: RESEND_FROM, to: m.to, reply_to: m.replyTo, subject: m.subject, html: m.html }),
    });
    if (!res.ok) {
      console.error('Resend send failed:', res.status, await res.text().catch(() => ''));
      return false;
    }
    return 'resend';
  } catch (err) {
    console.error('Resend send error:', err);
    return false;
  }
}

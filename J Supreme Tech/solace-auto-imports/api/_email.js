import { adminEmails } from './_supabase.js';

const RESEND_API_KEY = env('RESEND_API_KEY');
const EMAIL_FROM = env('EMAIL_FROM') || 'Solace Auto Imports <onboarding@resend.dev>';
const ADMIN_NOTIFICATION_EMAIL =
  env('ADMIN_NOTIFICATION_EMAIL') ||
  env('SOLACE_NOTIFICATION_EMAIL') ||
  adminEmails()[0] ||
  'solaceimports@gmail.com';

function env(name) {
  return String(process.env[name] || '')
    .replace(/^["']+|["']+$/g, '')
    .replace(/\\r\\n|\\n|\\r/gi, '')
    .replace(/\r?\n/g, '')
    .trim();
}

export function emailConfigured() {
  return Boolean(RESEND_API_KEY);
}

export async function sendLeadEmails(lead) {
  if (!emailConfigured()) return { skipped: true };

  const adminText = [
    'A new Solace Auto Imports inquiry was submitted.',
    '',
    `Name: ${lead.name || ''}`,
    `Phone: ${lead.phone || ''}`,
    `Email: ${lead.email || ''}`,
    `Interest: ${lead.interest || ''}`,
    `Source: ${lead.source || ''}`,
    '',
    'Message:',
    lead.message || '',
  ].join('\n');

  const sends = [
    sendEmail({
      to: ADMIN_NOTIFICATION_EMAIL,
      subject: `New Solace inquiry: ${lead.interest || lead.source || 'Website lead'}`,
      text: adminText,
    }),
  ];

  if (lead.email) {
    sends.push(
      sendEmail({
        to: lead.email,
        subject: 'We received your Solace Auto Imports inquiry',
        text: [
          `Hi ${lead.name || 'there'},`,
          '',
          'Thanks for contacting Solace Auto Imports. We received your inquiry and will follow up shortly.',
          '',
          'For urgent help, call or WhatsApp (876) 456-6976.',
          '',
          'Solace Auto Imports Limited',
        ].join('\n'),
      }),
    );
  }

  return Promise.allSettled(sends);
}

async function sendEmail({ to, subject, text }) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: EMAIL_FROM,
      to,
      subject,
      text,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`Resend email failed (${response.status}): ${body}`);
  }

  return response.json();
}

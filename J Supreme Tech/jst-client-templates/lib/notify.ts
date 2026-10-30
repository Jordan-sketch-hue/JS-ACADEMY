/**
 * Notification stubs — Resend email + WhatsApp Cloud API
 * All functions are graceful no-ops when env vars are absent.
 * Wire in keys via Vercel env vars to activate:
 *   RESEND_API_KEY          — Resend API key (re_...)
 *   RESEND_FROM_EMAIL       — verified sender, e.g. orders@jsupremetech.online
 *   WA_PHONE_NUMBER_ID      — WhatsApp Cloud API phone number ID
 *   WA_ACCESS_TOKEN         — WhatsApp Cloud API permanent token
 */

export interface LeadPayload {
  clientName: string;
  clientSlug: string;
  clientEmail?: string;
  name: string;
  phone: string;
  email?: string;
  message: string;
}

// ─── Resend email notification ───────────────────────────────────────────────

export async function sendLeadEmail(lead: LeadPayload): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!key || !from) return;

  const to = lead.clientEmail ?? from;
  const subject = `New lead for ${lead.clientName}`;
  const html = `
    <h2>New enquiry — ${lead.clientName}</h2>
    <p><strong>From:</strong> ${lead.name}</p>
    <p><strong>Phone:</strong> ${lead.phone}</p>
    ${lead.email ? `<p><strong>Email:</strong> ${lead.email}</p>` : ""}
    <p><strong>Message:</strong></p>
    <blockquote style="background:#f9fafb;padding:12px;border-left:4px solid #111">${lead.message.replace(/\n/g, "<br>")}</blockquote>
    <hr>
    <p style="font-size:12px;color:#6b7280">Sent via JST Client Templates — ${lead.clientSlug}</p>
  `;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, subject, html }),
  }).catch(() => {});
}

// ─── WhatsApp Cloud API notification ────────────────────────────────────────

export async function sendLeadWhatsApp(lead: LeadPayload): Promise<void> {
  const phoneNumberId = process.env.WA_PHONE_NUMBER_ID;
  const token = process.env.WA_ACCESS_TOKEN;
  const recipientPhone = process.env.WA_NOTIFY_PHONE; // owner's WA number in E.164 e.g. 18761234567
  if (!phoneNumberId || !token || !recipientPhone) return;

  const text = [
    `New lead — ${lead.clientName}`,
    `Name: ${lead.name}`,
    `Phone: ${lead.phone}`,
    lead.email ? `Email: ${lead.email}` : "",
    `\n${lead.message}`,
  ].filter(Boolean).join("\n");

  await fetch(`https://graph.facebook.com/v20.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: recipientPhone,
      type: "text",
      text: { body: text },
    }),
  }).catch(() => {});
}

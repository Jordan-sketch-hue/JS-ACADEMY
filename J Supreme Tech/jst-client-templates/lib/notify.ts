import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const RAILWAY_BOT_URL = "https://whatsapp-jarvis-bot-production.up.railway.app/send";
const OWNER_JID = process.env.WA_NOTIFY_JID ?? "6582182282@s.whatsapp.net";

async function pingRailwayBot(text: string) {
  const secret = process.env.WA_SEND_SECRET;
  if (!secret) return;
  try {
    await fetch(RAILWAY_BOT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-send-secret": secret },
      body: JSON.stringify({ jid: OWNER_JID, text }),
    });
  } catch {
    // non-blocking — never throw
  }
}

export async function sendEmail(opts: {
  clientId: string;
  to: string;
  subject: string;
  html: string;
  template: string;
  relatedId?: string;
}) {
  const resend = getResend();
  if (!resend) return false;
  const { data, error } = await resend.emails.send({
    from: "noreply@jsupremetech.online",
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
  });

  await supabase.from("ct_notifications").insert({
    client_id: opts.clientId,
    type: "email",
    recipient: opts.to,
    template: opts.template,
    related_id: opts.relatedId,
    status: error ? "failed" : "sent",
    provider_response: error ? { error } : { id: data?.id },
  });

  return !error;
}

export async function sendLeadEmail(payload: {
  clientName: string;
  clientSlug: string;
  clientEmail?: string;
  name: string;
  phone: string;
  email?: string;
  message: string;
}) {
  const resend = getResend();
  if (!resend) return;
  const to = payload.email || payload.clientEmail;
  if (!to) return;
  const isOrder = payload.message.startsWith("ORDER:");
  const isBooking = payload.message.startsWith("BOOKING");
  const subject = isOrder
    ? `Order Received — ${payload.clientName}`
    : isBooking
    ? `Booking Request — ${payload.clientName}`
    : `Message from ${payload.clientName}`;
  const html = `<p>Hi ${payload.name},</p><p>${payload.message}</p><p>— ${payload.clientName}</p>`;
  try {
    await resend.emails.send({ from: "noreply@jsupremetech.online", to, subject, html });
  } catch {
    // non-blocking
  }
}

export async function sendLeadWhatsApp(payload: {
  clientName: string;
  clientSlug: string;
  name: string;
  phone: string;
  message: string;
}) {
  const lines = [
    `📥 *New Lead — ${payload.clientName}*`,
    `From: ${payload.name} | ${payload.phone}`,
    payload.message.slice(0, 400),
  ];
  await pingRailwayBot(lines.join("\n"));
}

export async function sendBookingNotification(payload: {
  clientName: string;
  customerName: string;
  customerPhone: string;
  service: string;
  bookingDate?: string;
  bookingTime?: string;
}) {
  const text = [
    `📅 *New Booking — ${payload.clientName}*`,
    `Customer: ${payload.customerName} | ${payload.customerPhone}`,
    `Service: ${payload.service}`,
    payload.bookingDate ? `Date: ${payload.bookingDate}` : "",
    payload.bookingTime ? `Time: ${payload.bookingTime}` : "",
  ].filter(Boolean).join("\n");
  await pingRailwayBot(text);
}

export function buildOrderConfirmationEmail(opts: {
  businessName: string;
  customerName: string;
  orderId: string;
  items: string;
  total: string;
}) {
  return {
    subject: `Order Confirmed — ${opts.businessName}`,
    html: `<h2>Order Confirmed</h2><p>Hi ${opts.customerName},</p><p>Your order <strong>#${opts.orderId}</strong> has been received.</p><p>${opts.items}</p><p><strong>Total: ${opts.total}</strong></p><p>Thank you for choosing ${opts.businessName}.</p>`,
  };
}

export function buildAppointmentConfirmationEmail(opts: {
  businessName: string;
  customerName: string;
  service: string;
  dateTime: string;
}) {
  return {
    subject: `Appointment Confirmed — ${opts.businessName}`,
    html: `<h2>Appointment Confirmed</h2><p>Hi ${opts.customerName},</p><p>Your appointment for <strong>${opts.service}</strong> on <strong>${opts.dateTime}</strong> is confirmed.</p><p>— ${opts.businessName}</p>`,
  };
}

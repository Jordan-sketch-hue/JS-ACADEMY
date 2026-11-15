/**
 * WhatsApp Cloud API Integration
 * Sends order alerts to store owner + customer support link on storefront
 *
 * Uses: Meta Cloud API (direct) — NOT the Railway WA bot
 * Docs: https://developers.facebook.com/docs/whatsapp/cloud-api
 */

const WA_API_URL     = "https://graph.facebook.com/v19.0";
const PHONE_ID       = process.env.WHATSAPP_PHONE_NUMBER_ID ?? "";
const ACCESS_TOKEN   = process.env.WHATSAPP_ACCESS_TOKEN    ?? "";
const OWNER_PHONE    = process.env.WHATSAPP_OWNER_PHONE     ?? "";  // e.g. "18765551234"

if (!PHONE_ID || !ACCESS_TOKEN) {
  console.warn("[whatsapp] WHATSAPP_PHONE_NUMBER_ID or ACCESS_TOKEN not set");
}

interface WATextMessage {
  to: string;        // E.164 without + (e.g. "18765551234")
  body: string;
}

async function sendText({ to, body }: WATextMessage): Promise<void> {
  const res = await fetch(`${WA_API_URL}/${PHONE_ID}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type:    "individual",
      to,
      type: "text",
      text: { body },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`[whatsapp] sendText failed: ${res.status} — ${err}`);
    // Non-fatal: log but don't throw — WA failure must not block payment flow
  }
}

/** Notify store owner of a new order */
export async function notifyOwnerNewOrder(params: {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  totalJMD: number;
  deliveryMethod: string;
  itemsSummary: string;
}): Promise<void> {
  if (!OWNER_PHONE) return;

  const totalDisplay = `J$${(params.totalJMD / 100).toLocaleString("en-JM", { minimumFractionDigits: 2 })}`;
  const body =
    `NEW ORDER — House of Isabelle\n` +
    `Order: ${params.orderNumber}\n` +
    `Customer: ${params.customerName} · ${params.customerPhone}\n` +
    `Items: ${params.itemsSummary}\n` +
    `Total: ${totalDisplay}\n` +
    `Delivery: ${params.deliveryMethod}\n\n` +
    `View: ${process.env.NEXT_PUBLIC_SITE_URL}/admin/orders`;

  await sendText({ to: OWNER_PHONE, body });
}

/** Notify store owner of an appointment booking */
export async function notifyOwnerNewBooking(params: {
  serviceName: string;
  customerName: string;
  customerPhone: string;
  scheduledAt: string;
}): Promise<void> {
  if (!OWNER_PHONE) return;

  const body =
    `NEW BOOKING — House of Isabelle\n` +
    `Service: ${params.serviceName}\n` +
    `Customer: ${params.customerName} · ${params.customerPhone}\n` +
    `Scheduled: ${new Date(params.scheduledAt).toLocaleString("en-JM")}\n\n` +
    `View: ${process.env.NEXT_PUBLIC_SITE_URL}/admin/appointments`;

  await sendText({ to: OWNER_PHONE, body });
}

/** Returns a WhatsApp deep link for the customer-facing chat button */
export function getWhatsAppChatUrl(message?: string): string {
  const phone = (OWNER_PHONE || "").replace(/\D/g, "");
  const encoded = encodeURIComponent(message ?? "Hi! I would like to enquire about your hair products.");
  return `https://wa.me/${phone}?text=${encoded}`;
}

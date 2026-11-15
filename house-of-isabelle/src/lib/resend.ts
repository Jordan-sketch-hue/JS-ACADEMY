/**
 * Resend Email Integration
 * Docs: https://resend.com/docs
 *
 * Templates:
 *   order_confirm     — fired from Fygaro webhook
 *   abandoned_cart    — fired from /api/cart/abandon cron (24h cooldown)
 *   booking_confirm   — fired from /api/appointments POST
 *   promo_blast       — manual from /admin/marketing
 */

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM   = process.env.RESEND_FROM_EMAIL ?? "orders@houseofisabelle.com";
const SITE   = process.env.NEXT_PUBLIC_SITE_URL ?? "https://houseofisabelle.com";

/** Order confirmation email */
export async function sendOrderConfirmation(params: {
  to: string;
  customerName: string;
  orderNumber: string;
  itemsSummary: string;
  totalJMD: number;
  deliveryMethod: string;
  deliveryAddress?: string;
}): Promise<string | null> {
  const totalDisplay = `J$${(params.totalJMD / 100).toLocaleString("en-JM", { minimumFractionDigits: 2 })}`;

  const { data, error } = await resend.emails.send({
    from:    `House of Isabelle <${FROM}>`,
    to:      [params.to],
    subject: `Order Confirmed — ${params.orderNumber}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:32px">
        <h2 style="color:#1a1a1a">Your order is confirmed</h2>
        <p>Hi ${params.customerName},</p>
        <p>Thank you for your order. Here is your summary:</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <tr><td style="padding:8px 0;color:#666">Order Number</td><td><strong>${params.orderNumber}</strong></td></tr>
          <tr><td style="padding:8px 0;color:#666">Items</td><td>${params.itemsSummary}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Total</td><td><strong>${totalDisplay}</strong></td></tr>
          <tr><td style="padding:8px 0;color:#666">Delivery</td><td>${params.deliveryMethod}${params.deliveryAddress ? ` — ${params.deliveryAddress}` : ""}</td></tr>
        </table>
        <p>We will notify you when your order has been shipped.</p>
        <p>Questions? Reply to this email or WhatsApp us at <a href="${SITE}">${SITE}</a>.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
        <p style="color:#999;font-size:12px">House of Isabelle · Premium Hair Extensions · Jamaica</p>
      </div>
    `,
  });

  if (error) {
    console.error("[resend] sendOrderConfirmation error:", error);
    return null;
  }

  return data?.id ?? null;
}

/** Abandoned cart reminder email */
export async function sendAbandonedCartReminder(params: {
  to: string;
  customerName: string;
  cartItems: string;   // human-readable summary
  totalJMD: number;
  cartUrl: string;
}): Promise<string | null> {
  const totalDisplay = `J$${(params.totalJMD / 100).toLocaleString("en-JM", { minimumFractionDigits: 2 })}`;

  const { data, error } = await resend.emails.send({
    from:    `House of Isabelle <${FROM}>`,
    to:      [params.to],
    subject: "You left something behind",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:32px">
        <h2 style="color:#1a1a1a">Your cart is waiting</h2>
        <p>Hi ${params.customerName},</p>
        <p>You left some items in your cart:</p>
        <p style="background:#f9f9f9;padding:16px;border-radius:8px">${params.cartItems}</p>
        <p><strong>Total: ${totalDisplay}</strong></p>
        <a href="${params.cartUrl}" style="display:inline-block;background:#1a1a1a;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;margin:16px 0">Complete Your Order</a>
        <p style="color:#666;font-size:14px">This offer is valid while stock lasts.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
        <p style="color:#999;font-size:12px">House of Isabelle · Premium Hair Extensions · Jamaica</p>
      </div>
    `,
  });

  if (error) {
    console.error("[resend] sendAbandonedCartReminder error:", error);
    return null;
  }

  return data?.id ?? null;
}

/** Appointment confirmation email */
export async function sendBookingConfirmation(params: {
  to: string;
  customerName: string;
  serviceName: string;
  scheduledAt: string;
  durationMin: number;
}): Promise<string | null> {
  const dateStr = new Date(params.scheduledAt).toLocaleString("en-JM", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  const { data, error } = await resend.emails.send({
    from:    `House of Isabelle <${FROM}>`,
    to:      [params.to],
    subject: `Booking Confirmed — ${params.serviceName}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:32px">
        <h2 style="color:#1a1a1a">Your appointment is confirmed</h2>
        <p>Hi ${params.customerName},</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <tr><td style="padding:8px 0;color:#666">Service</td><td><strong>${params.serviceName}</strong></td></tr>
          <tr><td style="padding:8px 0;color:#666">Date &amp; Time</td><td>${dateStr}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Duration</td><td>${params.durationMin} minutes</td></tr>
        </table>
        <p>Please arrive 10 minutes early. To reschedule, contact us via WhatsApp.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
        <p style="color:#999;font-size:12px">House of Isabelle · Premium Hair Extensions · Jamaica</p>
      </div>
    `,
  });

  if (error) {
    console.error("[resend] sendBookingConfirmation error:", error);
    return null;
  }

  return data?.id ?? null;
}

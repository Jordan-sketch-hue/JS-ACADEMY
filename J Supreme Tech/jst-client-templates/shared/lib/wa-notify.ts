/**
 * shared/lib/wa-notify.ts — WhatsApp Cloud API notification hooks.
 *
 * Used by booking, order, and lead events to notify the business owner
 * and/or the customer via WhatsApp Business Cloud API.
 *
 * Credentials: WHATSAPP_TOKEN + WHATSAPP_PHONE_NUMBER_ID in env.
 * Never expose these client-side.
 */

export interface WAMessage {
  to: string;        // E.164 format, e.g. "+18761234567"
  templateName: string;
  languageCode?: string;
  components?: WAComponent[];
}

export interface WAComponent {
  type: "header" | "body" | "button";
  parameters: { type: "text" | "image" | "document"; text?: string; image?: { link: string } }[];
}

export interface WAResult { success: boolean; messageId?: string; error?: string; }

export async function sendWATemplateMessage(msg: WAMessage): Promise<WAResult> {
  const token   = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneId) {
    console.warn("[wa-notify] Credentials not configured — message not sent.");
    return { success: false, error: "WhatsApp credentials not configured." };
  }

  const body = {
    messaging_product: "whatsapp",
    to: msg.to,
    type: "template",
    template: {
      name: msg.templateName,
      language: { code: msg.languageCode ?? "en_US" },
      ...(msg.components?.length && { components: msg.components }),
    },
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/v19.0/${phoneId}/messages`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );
    const data = await res.json() as { messages?: { id: string }[]; error?: { message: string } };
    if (data.messages?.[0]?.id) {
      return { success: true, messageId: data.messages[0].id };
    }
    return { success: false, error: data.error?.message ?? "WA send failed." };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

// ─── Convenience hooks ────────────────────────────────────────────────────────

export async function notifyNewBooking(opts: {
  ownerPhone: string;
  clientName: string;
  service: string;
  date: string;
  time: string;
}) {
  return sendWATemplateMessage({
    to: opts.ownerPhone,
    templateName: "jst_new_booking",
    components: [{
      type: "body",
      parameters: [
        { type: "text", text: opts.clientName },
        { type: "text", text: opts.service },
        { type: "text", text: `${opts.date} at ${opts.time}` },
      ],
    }],
  });
}

export async function notifyNewLead(opts: {
  ownerPhone: string;
  clientName: string;
  clientPhone: string;
  source?: string;
}) {
  return sendWATemplateMessage({
    to: opts.ownerPhone,
    templateName: "jst_new_lead",
    components: [{
      type: "body",
      parameters: [
        { type: "text", text: opts.clientName },
        { type: "text", text: opts.clientPhone },
        { type: "text", text: opts.source ?? "website" },
      ],
    }],
  });
}

export async function notifyOrderConfirmed(opts: {
  customerPhone: string;
  orderRef: string;
  total: string;
}) {
  return sendWATemplateMessage({
    to: opts.customerPhone,
    templateName: "jst_order_confirmed",
    components: [{
      type: "body",
      parameters: [
        { type: "text", text: opts.orderRef },
        { type: "text", text: opts.total },
      ],
    }],
  });
}

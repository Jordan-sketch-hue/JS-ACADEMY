import { site } from "@/lib/site";

// Strip control chars / BOM (65279) / zero-width space (8203) / whitespace
// that can sneak into env values. A leading BOM in the API key would break
// the HTTP Authorization header (ByteString conversion error).
function clean(v?: string): string {
  let out = "";
  for (const ch of v || "") {
    const c = ch.charCodeAt(0);
    if (c >= 32 && c !== 127 && c !== 8203 && c !== 65279) out += ch;
  }
  return out.trim();
}

const FROM = clean(process.env.EMAIL_FROM) || "Ship 2 Door JA <onboarding@resend.dev>";
const OPS = clean(process.env.EMAIL_TO) || site.contact.email;

export type SendResult = { ok: boolean; id?: string; error?: string; skipped?: boolean };

// ---------------------------------------------------------------------
// Send via Resend's REST API with the built-in fetch — no SDK, so there's
// nothing for the bundler to evaluate or trace. No key -> { skipped:true }.
// ---------------------------------------------------------------------
async function send(opts: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<SendResult> {
  const key = clean(process.env.RESEND_API_KEY);
  if (!key) return { ok: false, skipped: true, error: "RESEND_API_KEY not configured" };
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM,
        to: Array.isArray(opts.to) ? opts.to : [opts.to],
        subject: opts.subject,
        html: opts.html,
        reply_to: opts.replyTo,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: data?.message || `Resend HTTP ${res.status}` };
    return { ok: true, id: data?.id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown send error" };
  }
}

// ----------------------------- template ------------------------------
const C = { navy: "#0c2750", navyDeep: "#06163a", sky: "#27b9ff", gold: "#f5c04a", ink: "#1c2533", muted: "#5a6072" };

function shell(opts: {
  preheader?: string;
  heading: string;
  intro?: string;
  bodyHtml?: string;
  rows?: [string, string][];
  ctaText?: string;
  ctaHref?: string;
  note?: string;
}): string {
  const rowsHtml = (opts.rows ?? [])
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 0;color:${C.muted};font-size:14px;width:42%;">${k}</td><td style="padding:8px 0;color:${C.ink};font-size:14px;font-weight:600;">${v}</td></tr>`
    )
    .join("");

  const cta = opts.ctaText && opts.ctaHref
    ? `<tr><td style="padding-top:8px;"><a href="${opts.ctaHref}" style="display:inline-block;background:${C.sky};color:${C.navyDeep};text-decoration:none;font-weight:700;font-size:15px;padding:13px 26px;border-radius:10px;">${opts.ctaText}</a></td></tr>`
    : "";

  return `<!doctype html><html><body style="margin:0;background:#eef3f9;font-family:Segoe UI,Helvetica,Arial,sans-serif;">
  <span style="display:none;max-height:0;overflow:hidden;opacity:0;">${opts.preheader ?? ""}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef3f9;padding:28px 12px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 8px 30px rgba(12,39,80,0.10);">
        <tr><td style="background:linear-gradient(125deg,${C.navyDeep},${C.navy} 60%,#16407f);padding:26px 32px;">
          <div style="color:#fff;font-size:22px;font-weight:800;letter-spacing:-0.5px;">Ship 2 Door <span style="color:${C.sky};">JA</span></div>
          <div style="color:${C.sky};font-size:11px;letter-spacing:3px;font-weight:700;margin-top:4px;">TRANSPORT &middot; TRANSITION &middot; MODERN DELIVERY</div>
        </td></tr>
        <tr><td style="padding:32px;">
          <h1 style="margin:0 0 12px;color:${C.navy};font-size:22px;">${opts.heading}</h1>
          ${opts.intro ? `<p style="margin:0 0 18px;color:${C.muted};font-size:15px;line-height:1.6;">${opts.intro}</p>` : ""}
          ${opts.rows?.length ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #eef1f6;border-bottom:1px solid #eef1f6;margin:6px 0 18px;">${rowsHtml}</table>` : ""}
          ${opts.bodyHtml ?? ""}
          <table role="presentation" cellpadding="0" cellspacing="0">${cta}</table>
          ${opts.note ? `<p style="margin:18px 0 0;color:#9aa6b8;font-size:12px;line-height:1.5;">${opts.note}</p>` : ""}
        </td></tr>
        <tr><td style="background:#f6f9fc;padding:22px 32px;border-top:1px solid #eef1f6;">
          <p style="margin:0;color:${C.navy};font-size:13px;font-weight:700;">Ship 2 Door JA</p>
          <p style="margin:6px 0 0;color:${C.muted};font-size:12px;line-height:1.7;">
            ${site.contact.phone} &nbsp;&middot;&nbsp; ${site.contact.instagram} &nbsp;&middot;&nbsp; ${site.url.replace("https://", "")}<br>
            ${site.contact.location}
          </p>
        </td></tr>
      </table>
      <p style="color:#9aa6b8;font-size:11px;margin:16px 0 0;">&copy; ${new Date().getFullYear()} Ship 2 Door JA &middot; USA to Jamaica package forwarding</p>
    </td></tr>
  </table></body></html>`;
}

// ----------------------------- senders -------------------------------

/** Customer contact enquiry -> ops inbox + auto-reply to the customer. */
export async function sendContact(input: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}): Promise<SendResult> {
  const opsHtml = shell({
    preheader: `New enquiry from ${input.name}`,
    heading: "New website enquiry",
    intro: "Someone just reached out through the website contact form.",
    rows: [
      ["Name", input.name],
      ["Email", input.email],
      ["Phone", input.phone || "-"],
    ],
    bodyHtml: `<p style="margin:0;color:${C.ink};font-size:15px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(input.message)}</p>`,
    note: "Reply directly to this email to respond to the customer.",
  });

  const ops = await send({
    to: OPS,
    subject: `New enquiry - ${input.name}`,
    html: opsHtml,
    replyTo: input.email,
  });

  await send({
    to: input.email,
    subject: "We got your message - Ship 2 Door JA",
    html: shell({
      preheader: "Thanks for reaching out to Ship 2 Door JA.",
      heading: `Thanks, ${input.name.split(" ")[0]}!`,
      intro: "We received your message and a real person will get back to you shortly. For the fastest reply you can also reach us on WhatsApp.",
      ctaText: "Chat on WhatsApp",
      ctaHref: site.contact.whatsappHref,
      note: "You're receiving this because you contacted Ship 2 Door JA.",
    }),
  });

  return ops;
}

/** Package pre-alert -> ops queue + (optional) customer confirmation. */
export async function sendPreAlert(input: {
  name: string;
  email?: string;
  store: string;
  desc: string;
  tracking?: string;
  value?: string;
  weight?: string;
}): Promise<SendResult> {
  const rows: [string, string][] = [
    ["Customer", input.name],
    ["Store", input.store],
    ["Item", input.desc],
    ["Tracking #", input.tracking || "-"],
    ["Declared value", input.value ? `US$${input.value}` : "-"],
    ["Est. weight", input.weight ? `${input.weight} lb` : "-"],
  ];

  const ops = await send({
    to: OPS,
    subject: `Pre-alert - ${input.name} (${input.store})`,
    html: shell({
      preheader: `Pre-alert: ${input.desc} from ${input.store}`,
      heading: "New package pre-alert",
      intro: "A customer expects this package at the U.S. warehouse.",
      rows,
    }),
    replyTo: input.email,
  });

  if (input.email) {
    await send({
      to: input.email,
      subject: "Pre-alert received - Ship 2 Door JA",
      html: shell({
        preheader: "We'll watch for your package.",
        heading: "Your pre-alert is in",
        intro: `We'll watch for your ${input.desc} from ${input.store} and notify you the moment it lands at our U.S. warehouse.`,
        rows,
        note: "No action needed - we'll take it from here.",
      }),
    });
  }

  return ops;
}

/** Shipment status update -> customer. */
export async function sendStatusUpdate(input: {
  to: string;
  name: string;
  packageId: string;
  store: string;
  status: string;
  eta?: string;
}): Promise<SendResult> {
  return send({
    to: input.to,
    subject: `Update: ${input.packageId} is now "${input.status}"`,
    html: shell({
      preheader: `${input.packageId} - ${input.status}`,
      heading: `Your package is ${input.status.toLowerCase()}`,
      intro: `Hi ${input.name.split(" ")[0]}, here's the latest on your shipment.`,
      rows: [
        ["Tracking #", input.packageId],
        ["From", input.store],
        ["Status", input.status],
        ["ETA", input.eta || "-"],
      ],
      ctaText: "Track in your portal",
      ctaHref: `${site.url}/portal`,
    }),
  });
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

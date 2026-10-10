import "server-only";

import {
  notifyRecipients,
  sendNotificationEmail,
  type SendEmailResult,
} from "@/lib/notify/email";
import { APP_URL, emailShell, escapeHtml } from "@/lib/notify/format";
import { formatCurrencyAmount } from "@/lib/utils";
import { cadenceFeePhrase } from "@/lib/invoices/recurrence";
import type { ContractListItem } from "@/lib/data/contracts";

/** Personal sender for client-facing sends — friendlier inboxing than "Alerts". */
const CLIENT_FROM = "Jordan Morris | J Supreme <alerts@jsupremeconglomerate.online>";

function signUrl(c: ContractListItem): string {
  return `${APP_URL}/sign/${c.sign_token}`;
}

function feeSummary(c: ContractListItem): string {
  if (c.fee_amount <= 0) return "";
  const amount = formatCurrencyAmount(c.fee_amount, c.currency);
  return c.contract_type === "retainer"
    ? `${amount} ${cadenceFeePhrase(c.billing_cadence)}`
    : amount;
}

function termRows(c: ContractListItem): string {
  const rows: [string, string][] = [];
  const fee = feeSummary(c);
  if (fee) rows.push(["Fee", fee]);
  if (c.deposit_amount && c.deposit_amount > 0) {
    rows.push([
      "To start",
      `${formatCurrencyAmount(c.deposit_amount, c.currency)} initial deposit`,
    ]);
  }
  if (c.valid_until) rows.push(["Offer valid until", c.valid_until]);
  if (!rows.length) return "";
  const tr = rows
    .map(
      ([k, v]) => `<tr>
        <td style="padding:7px 18px 7px 0;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#6b7280;white-space:nowrap">${escapeHtml(k)}</td>
        <td style="padding:7px 0;font-size:14px;font-weight:600;color:#111827">${escapeHtml(v)}</td>
      </tr>`,
    )
    .join("");
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:14px 0 4px">${tr}</table>`;
}

/** Signing invitation → the client. */
export function sendSignInviteEmail(
  c: ContractListItem,
  to: string,
): Promise<SendEmailResult> {
  const provider = c.company_name?.trim() || "J Supreme Conglomerate";
  const html = emailShell({
    eyebrow: "Agreement for signature",
    heading: c.title,
    subheading: `${provider} has prepared this agreement for you. Review it and sign electronically — it takes under a minute.`,
    inner: `
      ${termRows(c)}
      <p style="margin:14px 0 0;font-size:14px;line-height:1.65;color:#374151">
        Open the link, read the agreement through, then type or draw your
        signature at the bottom. Once you sign, the same link becomes your
        permanent signed copy — you can print it or save it as a PDF anytime,
        and a copy is emailed to you automatically.
      </p>`,
    cta: { label: "Review & sign", href: signUrl(c) },
    footer: `Sent by ${provider} · ${APP_URL.replace(/^https?:\/\//, "")}`,
  });
  return sendNotificationEmail({
    to,
    // Operator gets a blind copy of everything sent on their behalf.
    bcc: notifyRecipients(),
    from: CLIENT_FROM,
    subject: `For your signature: ${c.title}`,
    html,
    replyTo: "global.jsuprememarketing@gmail.com",
  });
}

/** Signed copy → the client, right after they e-sign. */
export function sendSignedCopyEmail(
  c: ContractListItem,
  to: string,
): Promise<SendEmailResult> {
  const provider = c.company_name?.trim() || "J Supreme Conglomerate";
  const html = emailShell({
    eyebrow: "Signed agreement",
    heading: "Your signed copy",
    subheading: `${c.title} — signed${c.client_signer_name ? ` by ${c.client_signer_name}` : ""}. Welcome aboard!`,
    inner: `
      ${termRows(c)}
      <p style="margin:14px 0 0;font-size:14px;line-height:1.65;color:#374151">
        Keep this email for your records. The button below opens your signed
        agreement — use <strong>Print / save PDF</strong> on that page to
        download a copy. The link stays live as your permanent signed copy.
      </p>`,
    cta: { label: "View / save your signed copy", href: signUrl(c) },
    footer: `Sent by ${provider} · ${APP_URL.replace(/^https?:\/\//, "")}`,
  });
  return sendNotificationEmail({
    to,
    // Operator gets a blind copy of the client's signed copy too.
    bcc: notifyRecipients(),
    from: CLIENT_FROM,
    subject: `Signed copy: ${c.title}`,
    html,
    replyTo: "global.jsuprememarketing@gmail.com",
  });
}

/** Operator alert → Jordan, when a client signs. */
export function notifyOperatorContractSigned(
  c: ContractListItem,
): Promise<SendEmailResult> {
  const html = emailShell({
    eyebrow: "Contracts",
    heading: "Contract signed",
    subheading: c.title,
    inner: `
      <p style="margin:0;font-size:14px;line-height:1.65;color:#374151">
        Signed by <strong>${escapeHtml(c.client_signer_name ?? "client")}</strong>
        ${c.client_signer_email ? ` (${escapeHtml(c.client_signer_email)})` : ""}.
        ${c.deposit_amount && c.deposit_amount > 0 ? `Next step: collect the ${escapeHtml(formatCurrencyAmount(c.deposit_amount, c.currency))} initial deposit before work starts.` : ""}
      </p>
      ${termRows(c)}`,
    cta: { label: "Open contract", href: `${APP_URL}/contracts/${c.id}` },
  });
  return sendNotificationEmail({
    subject: `Signed: ${c.title}`,
    html,
  });
}

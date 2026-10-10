import "server-only";
import crypto from "node:crypto";
import type { SalesSettings } from "@/lib/sales/types";

/**
 * Legal/deliverability compliance helpers.
 *
 * Cold B2B outreach is lawful in most markets ONLY with: a truthful sender
 * identity, a valid physical postal address, and a working, honoured opt-out.
 * (CAN-SPAM in the US; PECR/GDPR legitimate-interest in the EU/UK; CASL in CA.)
 * These helpers make those non-negotiable parts of every send.
 */

function secret(): string {
  return (
    process.env.SALES_UNSUBSCRIBE_SECRET?.trim() ||
    process.env.CRON_SECRET?.trim() ||
    "js-sales-dev-secret-change-me"
  );
}

function b64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromB64url(input: string): Buffer {
  const pad = input.length % 4 === 0 ? "" : "=".repeat(4 - (input.length % 4));
  return Buffer.from(input.replace(/-/g, "+").replace(/_/g, "/") + pad, "base64");
}

/** Signed, stateless unsubscribe token: base64url(payload).hmac. */
export function makeUnsubscribeToken(owner: string, email: string): string {
  const payload = b64url(JSON.stringify({ o: owner, e: email.toLowerCase() }));
  const sig = b64url(
    crypto.createHmac("sha256", secret()).update(payload).digest(),
  );
  return `${payload}.${sig}`;
}

export function verifyUnsubscribeToken(
  token: string,
): { owner: string; email: string } | null {
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = b64url(
    crypto.createHmac("sha256", secret()).update(payload).digest(),
  );
  // Constant-time compare to avoid timing leaks on the signature.
  if (
    sig.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  ) {
    return null;
  }
  try {
    const obj = JSON.parse(fromB64url(payload).toString("utf8")) as {
      o?: string;
      e?: string;
    };
    if (!obj.o || !obj.e) return null;
    return { owner: obj.o, email: obj.e };
  } catch {
    return null;
  }
}

export function baseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.APP_URL?.trim() ||
    "https://jsupremeconglomerate.online"
  );
}

export function unsubscribeUrl(token: string): string {
  return `${baseUrl()}/api/sales/unsubscribe?token=${encodeURIComponent(token)}`;
}

/**
 * RFC 8058 one-click unsubscribe headers. Gmail/Yahoo require these for bulk
 * senders and they materially improve inbox placement.
 */
export function listUnsubscribeHeaders(
  token: string,
  fromEmail: string,
): Record<string, string> {
  const url = unsubscribeUrl(token);
  return {
    "List-Unsubscribe": `<${url}>, <mailto:${fromEmail}?subject=unsubscribe>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
  };
}

/**
 * The legally-required footer block (postal address + identity + opt-out).
 * `optin` switches the consent basis: B2C promos go only to people who signed up
 * or are customers; B2B cold mail rests on legitimate interest (one-to-one
 * business message), with an explicit EU note.
 */
export function complianceFooterHtml(
  s: SalesSettings,
  unsubUrl: string,
  region: string,
  optin = false,
): string {
  const basis = optin
    ? `You're receiving this because you signed up for updates from ${escapeHtml(
        s.company_name,
      )} or are an existing customer. `
    : `This is a one-to-one business message from ${escapeHtml(s.from_name)}. ` +
      (region === "europe"
        ? `You're receiving it because we believe ${escapeHtml(
            s.company_name,
          )}'s services are relevant to your business (legitimate-interest basis). `
        : "");
  return `
  <tr>
    <td style="padding:20px 32px 28px;border-top:1px solid #e5e7eb;color:#6b7280;font-size:11px;line-height:1.6;font-family:Arial,Helvetica,sans-serif;">
      <strong style="color:#374151;">${escapeHtml(s.company_name)}</strong> · ${escapeHtml(
        s.postal_address,
      )}<br/>
      ${basis}If you'd rather not hear from us, you can
      <a href="${unsubUrl}" style="color:#6b7280;text-decoration:underline;">unsubscribe here</a>
      and we'll never email you again.
    </td>
  </tr>`;
}

export function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

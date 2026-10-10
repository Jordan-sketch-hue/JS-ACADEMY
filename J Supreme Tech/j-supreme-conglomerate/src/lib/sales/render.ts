import "server-only";
import {
  type MergeContext,
  type Region,
  type SalesProspect,
  type SalesSettings,
  type SalesTemplate,
} from "@/lib/sales/types";
import { complianceFooterHtml, escapeHtml } from "@/lib/sales/compliance";

const REGION_NAME: Record<string, string> = {
  local: "Jamaica",
  caribbean: "the Caribbean",
  europe: "Europe",
  americas: "North America",
};

const SERVICE_LINE: Record<string, string> = {
  tech: "custom software, web apps & automation",
  marketing: "marketing, branding & growth campaigns",
  both: "tech builds and marketing growth",
};

/** Build the merge-tag context (the "common identifiers") for one prospect. */
export function buildMergeContext(
  p: Pick<
    SalesProspect,
    "first_name" | "contact_name" | "company" | "industry" | "country" | "region" | "domain" | "service_focus"
  >,
  s: SalesSettings,
): MergeContext {
  const first =
    (p.first_name && p.first_name.trim()) ||
    (p.contact_name && p.contact_name.trim().split(/\s+/)[0]) ||
    "there";
  return {
    first_name: first,
    contact_name: (p.contact_name && p.contact_name.trim()) || first,
    company: p.company?.trim() || "your team",
    industry: p.industry?.trim() || "your industry",
    country: p.country?.trim() || REGION_NAME[p.region] || "your market",
    region: REGION_NAME[p.region] || p.region,
    domain: p.domain?.trim() || "",
    service_line: (s.offering && s.offering.trim()) || SERVICE_LINE[p.service_focus] || SERVICE_LINE.both,
    sender_name: s.from_name.split("·")[0].trim() || s.from_name,
    company_name: s.company_name,
    site_url: s.site_url,
    portfolio_url: s.site_url,
    calendar_url: s.calendar_url || s.site_url,
  };
}

/** Replace {{tag}} placeholders (whitespace-tolerant) with merge values. */
export function applyMerge(body: string, ctx: MergeContext): string {
  return body.replace(/\{\{\s*([a-z_]+)\s*\}\}/gi, (_m, key: string) => {
    const v = (ctx as Record<string, string>)[key.toLowerCase()];
    return v != null ? v : "";
  });
}

/** Plain-text body from a merged template (paragraphs preserved). */
function toPlainText(
  merged: string,
  ctx: MergeContext,
  unsubUrl: string,
  optin = false,
): string {
  const proof = optin ? "" : `\n\nSee our recent work: ${ctx.portfolio_url}`;
  return (
    merged.trim() +
    proof +
    `\n\n— ${ctx.sender_name}\n${ctx.company_name}\n${ctx.site_url}` +
    `\n\nNot relevant? Unsubscribe: ${unsubUrl}`
  );
}

function bodyToHtml(merged: string): string {
  return merged
    .trim()
    .split(/\n{2,}/)
    .map(
      (para) =>
        `<p style="margin:0 0 16px;color:#1f2937;font-size:15px;line-height:1.65;">${escapeHtml(
          para,
        ).replace(/\n/g, "<br/>")}</p>`,
    )
    .join("\n");
}

export type RenderedEmail = { subject: string; html: string; text: string };

/**
 * Wrap a merged body in the branded, email-client-safe shell:
 * header (wordmark) → body → CTA → signature → compliance footer.
 */
export function renderEmail(
  template: Pick<SalesTemplate, "subject" | "body_md">,
  ctx: MergeContext,
  s: SalesSettings,
  region: Region,
  unsubUrl: string,
  optin = false,
): RenderedEmail {
  const subject = applyMerge(template.subject, ctx).trim();
  const merged = applyMerge(template.body_md, ctx);
  const bodyHtml = bodyToHtml(merged);
  const accent = s.accent_color || "#0b5cff";
  const ctaLabel = s.cta_label || "Tell us your budget — we'll scope it";
  const ctaUrl = s.cta_url || ctx.calendar_url || ctx.site_url;
  const portfolioUrl = ctx.portfolio_url || ctx.site_url;
  const wordmark = (s.brand_name || "J Supreme").toUpperCase();
  const tagline = s.brand_tagline || "TECH · MARKETING · GROWTH";

  // B2C opt-in mail signs off as the brand; B2B cold mail signs off as the sender.
  const sig =
    s.signature_html ||
    (optin
      ? `<strong style="color:#111827;">${escapeHtml(ctx.company_name)}</strong><br/>
         <a href="${escapeHtml(ctx.site_url)}" style="color:${accent};text-decoration:none;">${escapeHtml(
           ctx.site_url.replace(/^https?:\/\//, ""),
         )}</a>`
      : `<strong style="color:#111827;">${escapeHtml(ctx.sender_name)}</strong><br/>
         ${escapeHtml(ctx.company_name)}<br/>
         <a href="${escapeHtml(ctx.site_url)}" style="color:${accent};text-decoration:none;">${escapeHtml(
           ctx.site_url.replace(/^https?:\/\//, ""),
         )}</a>`);

  // "See our recent work" only makes sense for cold B2B pitches.
  const proofLine = optin
    ? ""
    : `<p style="margin:0 0 18px;font-size:14px;line-height:1.6;font-family:Arial,Helvetica,sans-serif;color:#374151;">
        Want proof first? <a href="${escapeHtml(portfolioUrl)}" style="color:${accent};font-weight:600;text-decoration:none;">See our recent work →</a>
      </p>`;

  const html = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${escapeHtml(subject)}</title></head>
<body style="margin:0;padding:0;background:#f3f4f6;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e5e7eb;">
  <tr>
    <td style="padding:22px 32px;background:#0b0d12;border-bottom:3px solid ${accent};">
      <span style="color:#ffffff;font-size:17px;font-weight:800;letter-spacing:.06em;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(
        wordmark,
      )}</span>
      <span style="color:#9aa4b2;font-size:11px;letter-spacing:.14em;font-family:Arial,Helvetica,sans-serif;display:block;margin-top:2px;">${escapeHtml(
        tagline,
      )}</span>
    </td>
  </tr>
  <tr>
    <td style="padding:30px 32px 8px;font-family:Arial,Helvetica,sans-serif;">
      ${bodyHtml}
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 20px;">
        <tr><td style="border-radius:10px;background:${accent};">
          <a href="${escapeHtml(ctaUrl)}" style="display:inline-block;padding:12px 22px;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(
            ctaLabel,
          )} →</a>
        </td></tr>
      </table>
      ${proofLine}
      <div style="color:#374151;font-size:14px;line-height:1.6;font-family:Arial,Helvetica,sans-serif;">${sig}</div>
    </td>
  </tr>
  ${complianceFooterHtml(s, unsubUrl, region, optin)}
</table>
</td></tr>
</table>
</body></html>`;

  return { subject, html, text: toPlainText(merged, ctx, unsubUrl, optin) };
}

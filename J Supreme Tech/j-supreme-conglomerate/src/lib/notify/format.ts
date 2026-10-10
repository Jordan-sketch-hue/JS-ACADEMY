/** Shared HTML building blocks for notification emails.
 *
 * Brand: J Supreme pure mono identity — white-dominant, ink-scale only,
 * NO color accent. Mirrors jsupremetech.online.
 * Type: Space Grotesk (display) · JetBrains Mono (labels/eyebrows/buttons)
 * · Inter (body). Table layout + inline styles for email-client compatibility. */

export function escapeHtml(s: unknown): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export type EmailTone = "neutral" | "alert";

/* ── Brand tokens — mirrors globals.css ink scale ── */
const C = {
  ink950: "#0A0A0A",
  ink900: "#141414",
  ink800: "#1F1F1F",
  ink700: "#3D3D3D",
  ink600: "#525252",
  ink500: "#737373",
  ink400: "#A3A3A3",
  ink300: "#CFCFCF",
  ink200: "#E6E6E6",
  ink100: "#F4F4F4",
  ink50:  "#FAFAFA",
  white:  "#FFFFFF",
} as const;

const F = {
  display: "'Space Grotesk',system-ui,-apple-system,'Segoe UI',Arial,sans-serif",
  mono:    "'JetBrains Mono',ui-monospace,'SF Mono',Menlo,Consolas,monospace",
  sans:    "Inter,system-ui,-apple-system,'Segoe UI',Arial,sans-serif",
} as const;

const FONT_LINK =
  '<link rel="preconnect" href="https://fonts.googleapis.com">' +
  '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;600&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">';

export const APP_URL = (
  process.env.NEXT_PUBLIC_APP_URL || "https://jsupremeconglomerate.online"
).replace(/\/$/, "");
export const EMAIL_LOGO_URL = `${APP_URL}/icon-192.png`;
/** Animated brand mark (sheen sweep). First frame is the clean logo, so
 *  clients that don't animate GIFs (Outlook/Windows) still show the mark. */
export const EMAIL_MOTION_URL = `${APP_URL}/email/jsupreme-motion.gif`;

export type Kpi = { value: string | number; label: string };
export type EmailCta = { label: string; href?: string };

/** Hairline + uppercase mono eyebrow — JST editorial label style. */
function eyebrowHtml(text: string): string {
  return `<span style="display:inline-flex;align-items:center;gap:9px;font-family:${F.mono};font-size:10px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:${C.ink500}"><span style="display:inline-block;width:20px;border-top:1px solid ${C.ink300}"></span>${escapeHtml(text)}</span>`;
}

/** JS brand tile — animated mark (sheen sweep), static-logo fallback for non-animating clients. */
function brandTile(): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:separate;display:inline-table">
    <tr><td align="center" valign="middle" width="54" height="54"
      style="width:54px;height:54px;border-radius:12px;background:${C.ink950};
             font-family:${F.mono};color:${C.white};font-weight:700;font-size:15px;letter-spacing:.04em">
      <img src="${EMAIL_MOTION_URL}" width="54" height="54" alt="J Supreme"
        style="display:block;width:54px;height:54px;border-radius:12px;background:${C.ink950}" />
    </td></tr>
  </table>`;
}

/** KPI stat band — ink-50 tiles, display numerals, mono labels. */
function kpiBand(kpis: Kpi[]): string {
  if (!kpis.length) return "";
  const cells = kpis
    .map(
      (k) => `<td align="center" valign="top" style="padding:0 4px">
        <div style="background:${C.ink50};border:1px solid ${C.ink200};border-radius:10px;padding:13px 8px 11px">
          <div style="font-family:${F.display};font-size:24px;font-weight:700;color:${C.ink900};line-height:1;letter-spacing:-.03em">${escapeHtml(k.value)}</div>
          <div style="font-family:${F.mono};font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:.14em;color:${C.ink500};margin-top:5px">${escapeHtml(k.label)}</div>
        </div>
      </td>`,
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:18px 0 4px">
    <tr>${cells}</tr>
  </table>`;
}

/** Black pill CTA — mirrors site .btn-dark. */
function ctaButton(cta: EmailCta): string {
  const href = cta.href || APP_URL;
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:separate;margin:26px 0 4px">
    <tr><td align="center" style="border-radius:999px;background:${C.ink950}">
      <a href="${escapeHtml(href)}" target="_blank"
        style="display:inline-block;padding:13px 32px;font-family:${F.mono};font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:${C.white};text-decoration:none">
        ${escapeHtml(cta.label)} &nbsp;→
      </a>
    </td></tr>
  </table>`;
}

/** Full J Supreme branded email shell — white-dominant, mono editorial. */
export function emailShell(opts: {
  heading: string;
  subheading?: string;
  inner: string;
  tone?: EmailTone;
  footer?: string;
  eyebrow?: string;
  kpis?: Kpi[];
  cta?: EmailCta;
}): string {
  const isAlert = opts.tone === "alert";
  const eyebrow = opts.eyebrow ?? (isAlert ? "Alert · J Supreme" : "J Supreme Conglomerate");
  const topBorder = isAlert ? C.ink700 : C.ink950;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="color-scheme" content="light only" />
<meta name="supported-color-schemes" content="light" />
<title>${escapeHtml(opts.heading)}</title>
${FONT_LINK}
</head>
<body style="margin:0;padding:0;background:${C.ink100};-webkit-text-size-adjust:100%;mso-line-height-rule:exactly">
  <!-- Preview text -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all">${escapeHtml(opts.subheading || opts.heading)} · J Supreme</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:${C.ink100}">
    <tr><td align="center" style="padding:32px 16px 24px">
      <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:separate;width:100%;max-width:580px">

        <!-- ── top accent rule ── -->
        <tr><td style="background:${topBorder};height:3px;border-radius:3px 3px 0 0;font-size:0;line-height:0">&nbsp;</td></tr>

        <!-- ── header (pure white) ── -->
        <tr><td style="background:${C.white};padding:26px 28px 22px;border-left:1px solid ${C.ink200};border-right:1px solid ${C.ink200}">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
            <tr>
              <td width="54" valign="middle" style="width:54px">${brandTile()}</td>
              <td style="padding-left:14px;vertical-align:middle">
                <div style="font-family:${F.mono};font-size:9px;font-weight:600;letter-spacing:.26em;text-transform:uppercase;color:${C.ink500}">J SUPREME</div>
                <div style="font-family:${F.mono};font-size:9px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:${C.ink400};margin-top:2px">Creative Technology · Digital Systems</div>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- ── divider ── -->
        <tr><td style="background:${C.ink100};border-left:1px solid ${C.ink200};border-right:1px solid ${C.ink200};height:1px;font-size:0;line-height:0"><div style="background:${C.ink200};height:1px"></div></td></tr>

        <!-- ── hero ── -->
        <tr><td style="background:${C.white};padding:28px 28px 6px;border-left:1px solid ${C.ink200};border-right:1px solid ${C.ink200}">
          <div style="margin-bottom:10px">${eyebrowHtml(eyebrow)}</div>
          <div style="font-family:${F.display};font-size:28px;font-weight:700;color:${C.ink950};line-height:1.15;letter-spacing:-.03em">${escapeHtml(opts.heading)}</div>
          ${opts.subheading
            ? `<div style="font-family:${F.sans};font-size:13px;color:${C.ink500};margin-top:7px;font-weight:400">${escapeHtml(opts.subheading)}</div>`
            : ""}
          ${opts.kpis?.length ? kpiBand(opts.kpis) : ""}
        </td></tr>

        <!-- ── body ── -->
        <tr><td style="background:${C.white};padding:8px 28px 28px;border-left:1px solid ${C.ink200};border-right:1px solid ${C.ink200}">
          ${opts.inner}
          ${opts.cta ? ctaButton(opts.cta) : ""}
        </td></tr>

        <!-- ── bottom rule ── -->
        <tr><td style="background:${C.ink200};height:1px;font-size:0;line-height:0;border-left:1px solid ${C.ink200};border-right:1px solid ${C.ink200}">&nbsp;</td></tr>

        <!-- ── footer ── -->
        <tr><td style="background:${C.white};border-radius:0 0 12px 12px;border:1px solid ${C.ink200};border-top:none;padding:16px 28px 20px;text-align:center">
          <div style="font-family:${F.display};font-size:14px;font-weight:700;letter-spacing:-.01em;color:${C.ink900}">J Supreme</div>
          <div style="font-family:${F.mono};font-size:9px;font-weight:600;letter-spacing:.24em;text-transform:uppercase;color:${C.ink400};margin-top:4px">Operating since Kingston, JA</div>
          <div style="font-family:${F.sans};font-size:11px;color:${C.ink400};margin-top:10px;line-height:1.55">${escapeHtml(opts.footer ?? "Automated message from your J Supreme workspace.")}</div>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/** A titled section rendered as a clean mono card. */
export function section(
  title: string,
  rows: { label: string; meta?: string; tone?: "due" | "over" | "normal" }[],
  emptyOk = false,
): string {
  if (!rows.length && !emptyOk) return "";

  const pill = (tone: string, meta: string) => {
    if (!meta) return "";
    if (tone === "over")
      return `<span style="display:inline-block;background:${C.ink950};color:${C.white};font-family:${F.mono};font-size:10px;font-weight:600;letter-spacing:.04em;padding:3px 10px;border-radius:999px;white-space:nowrap">${escapeHtml(meta)}</span>`;
    if (tone === "due")
      return `<span style="display:inline-block;background:${C.white};border:1px solid ${C.ink300};color:${C.ink700};font-family:${F.mono};font-size:10px;font-weight:600;letter-spacing:.04em;padding:2px 9px;border-radius:999px;white-space:nowrap">${escapeHtml(meta)}</span>`;
    return `<span style="font-family:${F.mono};font-size:11px;color:${C.ink500};white-space:nowrap">${escapeHtml(meta)}</span>`;
  };

  const body = rows.length
    ? rows
        .map((r, i) => {
          const tone = r.tone ?? "normal";
          const border = i === 0 ? "" : `border-top:1px solid ${C.ink100};`;
          return `<tr>
            <td style="${border}padding:11px 0;font-family:${F.sans};font-size:13px;font-weight:500;color:${C.ink900}">${escapeHtml(r.label)}</td>
            <td style="${border}padding:11px 0;text-align:right;vertical-align:middle">${pill(tone, r.meta ?? "")}</td>
          </tr>`;
        })
        .join("")
    : `<tr><td style="padding:11px 0;font-family:${F.sans};font-size:13px;color:${C.ink400}">Nothing to show.</td></tr>`;

  return `<div style="margin-top:20px">
    <div style="margin-bottom:8px">${eyebrowHtml(title)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
      style="border-collapse:collapse;background:${C.white};border:1px solid ${C.ink200};border-radius:12px">
      <tr><td style="padding:2px 14px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">${body}</table>
      </td></tr>
    </table>
  </div>`;
}

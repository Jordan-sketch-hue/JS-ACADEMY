import { emailShell, section, escapeHtml, APP_URL } from "@/lib/notify/format";

export type BriefPayload = {
  date: string;
  dayName: string;
};

const LIVE_PROJECTS = [
  "courier-app", "supreme-suite", "j-supreme-conglomerate", "language-cradle",
  "solidtrust-courier", "the-mover-guy", "jst-website", "nexpro",
  "aboo-tours", "the-cleanser-ja", "unique-solid-surfaces", "ridelink-jamaica",
  "fabworks-ja", "crown-district-ja", "courier-logistics", "trella-marketing",
  "lumina-entertainment",
];

const C = {
  ink950: "#0A0A0A",
  ink900: "#141414",
  ink500: "#737373",
  ink400: "#A3A3A3",
  ink200: "#E6E6E6",
  ink100: "#F4F4F4",
  ink50:  "#FAFAFA",
  white:  "#FFFFFF",
} as const;

const F = {
  mono: "'JetBrains Mono',ui-monospace,'SF Mono',Menlo,Consolas,monospace",
  sans: "Inter,system-ui,-apple-system,'Segoe UI',Arial,sans-serif",
} as const;

function pill(text: string): string {
  return `<span style="display:inline-block;background:${C.ink50};border:1px solid ${C.ink200};border-radius:6px;padding:3px 8px;font-family:${F.mono};font-size:10px;font-weight:500;color:${C.ink500};margin:2px 2px 2px 0;white-space:nowrap">${escapeHtml(text)}</span>`;
}

function alertRow(text: string): string {
  return `<tr>
    <td style="padding:9px 13px;border-top:1px solid ${C.ink100};font-family:${F.sans};font-size:12px;color:${C.ink900};line-height:1.5">
      <span style="font-family:${F.mono};font-size:10px;font-weight:600;letter-spacing:.06em;color:${C.ink500};margin-right:8px">⚠</span>${escapeHtml(text)}
    </td>
  </tr>`;
}

function readRow(label: string, desc: string, url: string, tag: string): string {
  return `<tr>
    <td style="padding:10px 14px;border-top:1px solid ${C.ink100}">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
        <tr>
          <td>
            <a href="${escapeHtml(url)}" target="_blank"
               style="font-family:${F.sans};font-size:13px;font-weight:600;color:${C.ink900};text-decoration:none">${escapeHtml(label)}</a>
            <div style="font-family:${F.sans};font-size:11px;color:${C.ink500};margin-top:2px">${escapeHtml(desc)}</div>
          </td>
          <td align="right" valign="middle" style="padding-left:12px;white-space:nowrap">
            <span style="font-family:${F.mono};font-size:9px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:${C.ink400};background:${C.ink50};border:1px solid ${C.ink200};border-radius:5px;padding:2px 7px">${escapeHtml(tag)}</span>
          </td>
        </tr>
      </table>
    </td>
  </tr>`;
}

export function buildDailyBriefEmail({ date, dayName }: BriefPayload): string {
  const systemChecks = section("System checks", [
    { label: "Vercel deployments", meta: "vercel.com/dashboard", tone: "normal" },
    { label: "Pipeline intake submissions", meta: "pipeline-intake", tone: "normal" },
    { label: "CRM overdue follow-ups", meta: "crm", tone: "normal" },
    { label: "Outstanding invoices", meta: "invoices", tone: "normal" },
    { label: "Supabase health (rate limits / errors)", meta: "supabase.com", tone: "normal" },
    { label: "Open tasks blocking projects", meta: "todos", tone: "normal" },
    { label: "EAS mobile builds (iOS / Android)", meta: "expo.dev", tone: "normal" },
  ]);

  const gotchas = `<div style="margin-top:20px">
    <div style="margin-bottom:8px">
      <span style="font-family:${F.mono};font-size:10px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:${C.ink500}"><span style="display:inline-block;width:20px;border-top:1px solid #CFCFCF;vertical-align:middle;margin-right:9px"></span>Standing reminders</span>
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
      style="border-collapse:collapse;background:${C.white};border:1px solid ${C.ink200};border-radius:12px">
      <tr><td style="padding:0">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
          <tr><td style="padding:9px 13px;font-family:${F.sans};font-size:12px;color:${C.ink900};line-height:1.5">
            <span style="font-family:${F.mono};font-size:10px;font-weight:600;letter-spacing:.06em;color:${C.ink500};margin-right:8px">⚠</span>Never run <code style="font-family:${F.mono};font-size:11px;background:${C.ink100};padding:1px 5px;border-radius:4px">vercel env pull</code> — creates .env.production.local with EMPTY Sensitive values that shadow .env.local and break auth.
          </td></tr>
          ${alertRow("PWA auto-popup must never be re-added to any project (removed fleet-wide 2026-06-10).")}
          ${alertRow("Always use real logo files (logo.jpg / logo.png) — never the bundled SVG approximations.")}
          ${alertRow("PS 5.1: use cmd /c echo VALUE for vercel env add — Write-Output adds BOM and breaks Vercel env parsing.")}
          ${alertRow("forgeworks-jamaica and the-mover-guy have auto-restore — use fresh file paths only.")}
        </table>
      </td></tr>
    </table>
  </div>`;

  const reads = `<div style="margin-top:20px">
    <div style="margin-bottom:8px">
      <span style="font-family:${F.mono};font-size:10px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:${C.ink500}"><span style="display:inline-block;width:20px;border-top:1px solid #CFCFCF;vertical-align:middle;margin-right:9px"></span>Daily reads</span>
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
      style="border-collapse:collapse;background:${C.white};border:1px solid ${C.ink200};border-radius:12px">
      <tr><td style="padding:0">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
          <tr><td style="padding:10px 14px">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
              <tr>
                <td>
                  <a href="https://www.awwwards.com/" target="_blank" style="font-family:${F.sans};font-size:13px;font-weight:600;color:${C.ink900};text-decoration:none">Awwwards SOTD</a>
                  <div style="font-family:${F.sans};font-size:11px;color:${C.ink500};margin-top:2px">Today's best UI design — check what wins</div>
                </td>
                <td align="right" valign="middle" style="padding-left:12px;white-space:nowrap">
                  <span style="font-family:${F.mono};font-size:9px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:${C.ink400};background:${C.ink50};border:1px solid ${C.ink200};border-radius:5px;padding:2px 7px">Design</span>
                </td>
              </tr>
            </table>
          </td></tr>
          ${readRow("Dribbble trending UI", "Component and layout inspiration", "https://dribbble.com/shots/popular/ui-ux", "Design")}
          ${readRow("Mobbin new screens", "Latest iOS app screens added", "https://mobbin.com/screens?platform=ios&sort=new", "Design")}
          ${readRow("Next.js blog", "Releases and upgrade notices", "https://nextjs.org/blog", "Dev")}
          ${readRow("web.dev blog", "Chrome team performance updates", "https://web.dev/blog/", "Dev")}
          ${readRow("IG Algorithm guide", "Social media best practices", "https://later.com/blog/how-instagram-algorithm-works/", "Marketing")}
        </table>
      </td></tr>
    </table>
  </div>`;

  const projectPills = `<div style="margin-top:20px">
    <div style="margin-bottom:10px">
      <span style="font-family:${F.mono};font-size:10px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;color:${C.ink500}"><span style="display:inline-block;width:20px;border-top:1px solid #CFCFCF;vertical-align:middle;margin-right:9px"></span>Live projects · check in</span>
    </div>
    <div>${LIVE_PROJECTS.map(pill).join("")}</div>
  </div>`;

  const inner = systemChecks + gotchas + reads + projectPills;

  return emailShell({
    eyebrow: "Daily Brief",
    heading: `Good morning, Jordan.`,
    subheading: `${dayName}, ${date}`,
    inner,
    cta: { label: "Open dashboard", href: `${APP_URL}/dashboard` },
    footer: `Sent automatically every morning at 7 AM Jamaica time (UTC-5). Trigger manually at ${APP_URL}/daily-brief`,
  });
}

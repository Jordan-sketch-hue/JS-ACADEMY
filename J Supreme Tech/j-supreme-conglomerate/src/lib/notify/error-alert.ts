import "server-only";
import { isEmailConfigured, sendNotificationEmail } from "@/lib/notify/email";
import { emailShell, escapeHtml } from "@/lib/notify/format";

/**
 * Emails an error/bug alert. Safe to call from anywhere — never throws, and
 * throttles repeats of the same error so an incident can't flood the inbox.
 */

const THROTTLE_MS = 5 * 60 * 1000;
const lastSent = new Map<string, number>();

function signatureOf(context: string, message: string): string {
  return `${context}::${message.split("\n")[0].slice(0, 140)}`;
}

function toMessage(error: unknown): { message: string; stack: string | null } {
  if (error instanceof Error) {
    return { message: error.message || error.name, stack: error.stack ?? null };
  }
  if (typeof error === "string") return { message: error, stack: null };
  try {
    return { message: JSON.stringify(error).slice(0, 500), stack: null };
  } catch {
    return { message: String(error), stack: null };
  }
}

export async function reportError(
  context: string,
  error: unknown,
  meta?: Record<string, string | undefined>,
): Promise<void> {
  try {
    // Only alert from real deployments, not local dev noise.
    const env = process.env.VERCEL_ENV ?? process.env.NODE_ENV;
    if (env !== "production") return;
    if (!isEmailConfigured()) return;

    const { message, stack } = toMessage(error);
    const sig = signatureOf(context, message);
    const now = Date.now();
    const prev = lastSent.get(sig);
    if (prev && now - prev < THROTTLE_MS) return;
    lastSent.set(sig, now);

    const metaRows = Object.entries(meta ?? {})
      .filter(([, v]) => v)
      .map(
        ([k, v]) =>
          `<tr><td style="padding:3px 10px 3px 0;color:#6b7280;font-size:12px">${escapeHtml(k)}</td><td style="padding:3px 0;font-size:12px;font-family:ui-monospace,monospace">${escapeHtml(v)}</td></tr>`,
      )
      .join("");

    const inner = `
      <p style="margin:14px 0 6px;font-weight:600;color:#b91c1c">${escapeHtml(context)}</p>
      <p style="margin:0 0 12px;font-size:14px;font-family:ui-monospace,monospace;background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:10px;color:#7f1d1d">${escapeHtml(message)}</p>
      ${metaRows ? `<table style="border-collapse:collapse;margin:0 0 12px">${metaRows}</table>` : ""}
      ${stack ? `<details><summary style="cursor:pointer;color:#6b7280;font-size:12px">Stack trace</summary><pre style="white-space:pre-wrap;font-size:11px;color:#4b5563;background:#f9fafb;border-radius:8px;padding:10px;overflow:auto">${escapeHtml(stack.slice(0, 4000))}</pre></details>` : ""}
    `;

    await sendNotificationEmail({
      subject: `🐞 ${context} — ${message.slice(0, 80)}`,
      html: emailShell({
        heading: "Something broke",
        subheading: context,
        inner,
        tone: "alert",
      }),
      text: `${context}\n\n${message}\n\n${stack ?? ""}`,
    });
  } catch {
    // Reporting must never cascade into another failure.
  }
}

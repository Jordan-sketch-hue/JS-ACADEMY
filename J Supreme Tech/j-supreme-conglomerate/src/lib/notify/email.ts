import "server-only";

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const DEFAULT_FROM = "J Supreme Alerts <alerts@jsupremeconglomerate.online>";

export type SendEmailInput = {
  subject: string;
  html?: string;
  text?: string;
  /** Defaults to NOTIFY_EMAIL. */
  to?: string | string[];
  /** Blind copy (e.g. the operator on client-facing sends). */
  bcc?: string | string[];
  /** Sender display override — MUST use a Resend-verified domain address. */
  from?: string;
  replyTo?: string;
  /** Resend attachments: `content` is base64. */
  attachments?: { filename: string; content: string }[];
};

export type SendEmailResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

export function notifyRecipient(): string | null {
  return process.env.NOTIFY_EMAIL?.trim() || null;
}

/** NOTIFY_EMAIL supports a comma-separated list — every address gets the email. */
export function notifyRecipients(): string[] {
  return (process.env.NOTIFY_EMAIL ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim() && notifyRecipient());
}

/**
 * Sends transactional/alert email via Resend. Never throws — returns a result
 * so callers (error handlers, crons) can degrade gracefully.
 */
export async function sendNotificationEmail(
  input: SendEmailInput,
): Promise<SendEmailResult> {
  const key = process.env.RESEND_API_KEY?.trim();
  const defaults = notifyRecipients();
  const to = input.to ?? (defaults.length ? defaults : null);
  const from = input.from?.trim() || process.env.MAIL_FROM?.trim() || DEFAULT_FROM;

  if (!key) return { ok: false, error: "RESEND_API_KEY is not set." };
  if (!to) return { ok: false, error: "No recipient (NOTIFY_EMAIL is not set)." };
  if (!input.html && !input.text) {
    return { ok: false, error: "Email needs html or text." };
  }

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: Array.isArray(to) ? to : [to],
        subject: input.subject,
        ...(input.bcc && (Array.isArray(input.bcc) ? input.bcc.length : true)
          ? { bcc: Array.isArray(input.bcc) ? input.bcc : [input.bcc] }
          : {}),
        ...(input.html ? { html: input.html } : {}),
        ...(input.text ? { text: input.text } : {}),
        ...(input.replyTo ? { reply_to: input.replyTo } : {}),
        ...(input.attachments?.length ? { attachments: input.attachments } : {}),
      }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return { ok: false, error: `Resend ${res.status}: ${body.slice(0, 300)}` };
    }
    const data = (await res.json().catch(() => ({}))) as { id?: string };
    return { ok: true, id: String(data?.id ?? "") };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Network error" };
  }
}

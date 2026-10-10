import "server-only";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export type SalesSendInput = {
  from: string;
  fromName?: string;
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  bcc?: string;
  /** RFC 8058 one-click unsubscribe + any custom headers. */
  headers?: Record<string, string>;
  /** Stored so inbound replies can be threaded back to the right conversation. */
  tags?: { name: string; value: string }[];
};

export type SalesSendResult =
  | { ok: true; id: string }
  | { ok: false; error: string; transient: boolean };

function fromHeader(input: SalesSendInput): string {
  if (input.fromName) return `${input.fromName} <${input.from}>`;
  return input.from;
}

/** Resend statuses worth one retry (rate limit / transient upstream). */
function isTransient(status: number): boolean {
  return status === 429 || status >= 500;
}

/**
 * Sends a single outreach email through Resend. Never throws — the engine relies
 * on the typed result to mark the outbox row sent / retry / failed.
 */
export async function sendSalesEmail(
  input: SalesSendInput,
): Promise<SalesSendResult> {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return { ok: false, error: "RESEND_API_KEY is not set.", transient: false };

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromHeader(input),
        to: [input.to],
        subject: input.subject,
        html: input.html,
        text: input.text,
        ...(input.replyTo ? { reply_to: input.replyTo } : {}),
        ...(input.bcc ? { bcc: [input.bcc] } : {}),
        ...(input.headers ? { headers: input.headers } : {}),
        ...(input.tags?.length ? { tags: input.tags } : {}),
      }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return {
        ok: false,
        error: `Resend ${res.status}: ${body.slice(0, 240)}`,
        transient: isTransient(res.status),
      };
    }
    const data = (await res.json().catch(() => ({}))) as { id?: string };
    return { ok: true, id: String(data?.id ?? "") };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Network error",
      transient: true,
    };
  }
}

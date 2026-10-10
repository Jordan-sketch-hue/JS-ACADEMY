import { rateLimit } from "@/lib/cyber/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Receives client-side error reports from the global error boundary and emails
 * an alert (throttled + production-only inside reportError). Same-origin only. */
export async function POST(req: Request) {
  try {
    // Bound how often a single client can trigger alert emails.
    const gate = rateLimit(req, { limit: 20, windowMs: 60_000, key: "notify-error" });
    if (!gate.ok) return gate.response;

    const origin = req.headers.get("origin");
    const host = req.headers.get("host");
    if (origin && host && !origin.includes(host)) {
      return Response.json({ ok: false }, { status: 403 });
    }

    const body = (await req.json().catch(() => ({}))) as {
      message?: string;
      stack?: string;
      url?: string;
      digest?: string;
    };

    const err = new Error(String(body.message ?? "Client error"));
    if (body.stack) err.stack = String(body.stack);

    const { reportError } = await import("@/lib/notify/error-alert");
    await reportError("Client error", err, {
      url: body.url,
      digest: body.digest,
    });

    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: true });
  }
}

/**
 * GET|POST /api/sales/unsubscribe?token=...
 *
 * Public, no auth beyond the HMAC-signed token embedded in every outreach email
 * (List-Unsubscribe header + footer link). Honours the opt-out immediately by
 * adding the address to the suppression list — the engine never emails it again.
 * GET returns a confirmation page; POST satisfies RFC 8058 one-click unsubscribe.
 */
import { verifyUnsubscribeToken } from "@/lib/sales/compliance";
import { addSuppression } from "@/lib/sales/suppressions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function page(title: string, body: string, status = 200): Response {
  return new Response(
    `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${title}</title></head>
<body style="margin:0;font-family:Arial,Helvetica,sans-serif;background:#f3f4f6;">
<div style="max-width:520px;margin:64px auto;background:#fff;border:1px solid #e5e7eb;border-radius:14px;padding:40px;text-align:center;">
<div style="font-size:18px;font-weight:800;letter-spacing:.06em;color:#0b0d12;">J SUPREME</div>
<h1 style="font-size:20px;color:#111827;margin:24px 0 8px;">${title}</h1>
<p style="color:#4b5563;font-size:14px;line-height:1.6;">${body}</p>
</div></body></html>`,
    { status, headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}

async function unsubscribe(token: string | null): Promise<Response> {
  if (!token) return page("Invalid link", "This unsubscribe link is missing its token.", 400);
  const parsed = verifyUnsubscribeToken(token);
  if (!parsed) return page("Invalid link", "This unsubscribe link is invalid or expired.", 400);
  await addSuppression(parsed.owner, parsed.email, "unsubscribed", "one-click");
  return page(
    "You're unsubscribed",
    `<strong>${parsed.email}</strong> has been removed. You won't receive any more emails from us. Sorry for the interruption.`,
  );
}

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token");
  return unsubscribe(token);
}

export async function POST(req: Request) {
  // One-click clients POST; the token may be in the query or form body.
  const url = new URL(req.url);
  let token = url.searchParams.get("token");
  if (!token) {
    try {
      const form = await req.formData();
      token = (form.get("token") as string) || null;
    } catch {
      /* ignore */
    }
  }
  return unsubscribe(token);
}

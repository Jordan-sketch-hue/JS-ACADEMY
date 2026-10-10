import { buildDigest } from "@/lib/notify/digest";
import { sendNotificationEmail } from "@/lib/notify/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Authorized via the cron secret: Vercel Cron sends `Authorization: Bearer <CRON_SECRET>`
 * automatically; manual runs can pass `?key=<CRON_SECRET>`. */
function authorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  if (req.headers.get("authorization") === `Bearer ${secret}`) return true;
  try {
    return new URL(req.url).searchParams.get("key") === secret;
  } catch {
    return false;
  }
}

export async function GET(req: Request) {
  if (!authorized(req)) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const owner =
    process.env.DIGEST_OWNER_CLERK_ID?.trim() || "user_setup_full_access";
  try {
    const digest = await buildDigest(owner);
    const sent = await sendNotificationEmail({
      subject: digest.subject,
      html: digest.html,
      text: digest.text,
    });
    if (!sent.ok) return Response.json({ ok: false, error: sent.error }, { status: 502 });
    return Response.json({ ok: true, id: sent.id });
  } catch (e) {
    return Response.json(
      { ok: false, error: e instanceof Error ? e.message : "digest failed" },
      { status: 500 },
    );
  }
}

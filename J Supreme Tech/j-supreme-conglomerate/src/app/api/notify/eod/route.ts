import { generateAndDeliverEod } from "@/lib/notify/eod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Vercel Cron sends `Authorization: Bearer <CRON_SECRET>`; manual runs can pass `?key=`. */
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
    const result = await generateAndDeliverEod(owner);
    return Response.json({
      ok: true,
      saved: !!result.report,
      emailed: result.emailed,
      saveError: result.saveError,
      emailError: result.emailError,
      report_date: result.report?.report_date,
    });
  } catch (e) {
    return Response.json(
      { ok: false, error: e instanceof Error ? e.message : "eod failed" },
      { status: 500 },
    );
  }
}

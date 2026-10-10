/**
 * GET|POST /api/cron/jarvis-angel
 *
 * Vercel Cron tick (see vercel.json). Self-authorising — no Clerk cookie on a
 * cron request — via the x-vercel-cron header or CRON_SECRET. Pulls every brand
 * inbox and keeps the Angel queue fresh so drafts are ready when you open it.
 */
import { syncAllBrands } from "@/lib/jarvis/angel/sync";
import { isAngelConfigured } from "@/lib/jarvis/angel/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

function authorized(req: Request): boolean {
  if (req.headers.get("x-vercel-cron") === "1") return true;
  const secrets = [
    process.env.CRON_SECRET?.trim(),
    process.env.ANGEL_CRON_SECRET?.trim(),
  ].filter((s): s is string => !!s);
  if (secrets.length === 0) return false;
  const auth = req.headers.get("authorization");
  if (auth && secrets.some((s) => auth === `Bearer ${s}`)) return true;
  try {
    const key = new URL(req.url).searchParams.get("key");
    return !!key && secrets.includes(key);
  } catch {
    return false;
  }
}

async function handle(req: Request) {
  if (!authorized(req)) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  if (!isAngelConfigured()) {
    return Response.json({ ok: false, skipped: "not configured" });
  }
  try {
    const results = await syncAllBrands();
    const created = results.reduce((a, r) => a + r.created, 0);
    const fetched = results.reduce((a, r) => a + r.fetched, 0);
    return Response.json({ ok: true, fetched, created, results });
  } catch (e) {
    return Response.json(
      { ok: false, error: e instanceof Error ? e.message : "error" },
      { status: 500 },
    );
  }
}

export const GET = handle;
export const POST = handle;

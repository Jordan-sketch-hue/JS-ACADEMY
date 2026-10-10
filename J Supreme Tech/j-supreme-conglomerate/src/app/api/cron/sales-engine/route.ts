/**
 * GET|POST /api/cron/sales-engine
 *
 * Scheduler tick for the Sales Department. Vercel Cron hits this on a schedule
 * (see vercel.json) with the cron secret. It runs the outreach engine for every
 * operator that has a sales_settings row (sourcing + paced sending up to the
 * warm-up ceiling). Self-authorising — no Clerk cookie on a cron request.
 */
import { runSalesEngine, type EngineResult } from "@/lib/sales/engine";
import { listBrands, seedAllBrands } from "@/lib/sales/brands";
import { logHunterAccount } from "@/lib/sales/sources/hunter";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

function authorized(req: Request): boolean {
  if (req.headers.get("x-vercel-cron") === "1") return true;
  const secrets = [
    process.env.CRON_SECRET?.trim(),
    process.env.SALES_CRON_SECRET?.trim(),
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

async function brandSlugs(): Promise<string[]> {
  let brands = await listBrands({ activeOnly: true });
  // First tick on a fresh deploy: provision the roster from code (BRAND_SEEDS).
  if (brands.length === 0) {
    await seedAllBrands(process.env.SALES_OWNER_CLERK_ID?.trim() || null);
    brands = await listBrands({ activeOnly: true });
  }
  return brands.map((b) => b.slug);
}

async function handle(req: Request) {
  if (!authorized(req)) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const ignoreWindow = (() => {
    try {
      return new URL(req.url).searchParams.get("force") === "1";
    } catch {
      return false;
    }
  })();

  const slugs = await brandSlugs();
  await logHunterAccount();
  const results: Record<string, EngineResult> = {};
  for (const slug of slugs) {
    try {
      results[slug] = await runSalesEngine(slug, { ignoreWindow });
    } catch (e) {
      results[slug] = {
        ok: false,
        status: "error",
        sourced: 0,
        sent: 0,
        failed: 0,
        skipped: 0,
        ceiling: 0,
        sentToday: 0,
        remaining: 0,
        notes: [e instanceof Error ? e.message : "engine error"],
      };
    }
  }
  const sent = Object.values(results).reduce((a, r) => a + r.sent, 0);
  const sourced = Object.values(results).reduce((a, r) => a + r.sourced, 0);
  return Response.json({ ok: true, brands: slugs.length, sent, sourced, results });
}

export const GET = handle;
export const POST = handle;

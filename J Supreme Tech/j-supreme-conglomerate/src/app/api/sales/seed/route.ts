/**
 * GET|POST /api/sales/seed
 *
 * Provisions (or refreshes) the multi-brand roster from code (BRAND_SEEDS):
 * registry rows + per-brand settings + starter templates. Idempotent and safe to
 * re-run — never resets a brand's sending_live / active flags. Guarded by the
 * cron secret. Pass ?operator=<clerk id> to stamp ownership on first seed.
 */
import { seedAllBrands } from "@/lib/sales/brands";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 120;

function authorized(req: Request): boolean {
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

async function handle(req: Request) {
  if (!authorized(req)) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const operator =
    (() => {
      try {
        return new URL(req.url).searchParams.get("operator");
      } catch {
        return null;
      }
    })() ||
    process.env.SALES_OWNER_CLERK_ID?.trim() ||
    null;

  const result = await seedAllBrands(operator);
  return Response.json({ ok: true, ...result });
}

export const GET = handle;
export const POST = handle;

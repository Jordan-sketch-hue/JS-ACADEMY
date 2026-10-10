/**
 * GET|POST /api/cron/marketing-publish
 *
 * The scheduler tick. Vercel Cron hits this on a schedule (see vercel.json) with
 * `Authorization: Bearer <CRON_SECRET>`. For each due post it does a compare-and-swap
 * claim, publishes, then records the outcome (posted / retry / failed).
 *
 * Public in middleware (no Clerk cookie on a cron request) — it self-authorizes
 * with the cron secret instead.
 */
import {
  claimForPublish,
  dueForPublishing,
  markPosted,
  markResult,
} from "@/lib/data/social-posts";
import { MAX_PUBLISH_ATTEMPTS, publishSocialPost } from "@/lib/marketing/dispatch";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

function authorized(req: Request): boolean {
  const secrets = [
    process.env.CRON_SECRET?.trim(),
    process.env.MARKETING_CRON_SECRET?.trim(),
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

type TickResult = {
  id: string;
  status: "posted" | "retry" | "failed";
  externalId?: string;
  attempts?: number;
  error?: string;
};

async function handle(req: Request) {
  if (!authorized(req)) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const due = await dueForPublishing(10);
  const results: TickResult[] = [];

  for (const post of due) {
    // Compare-and-swap: only the tick that flips scheduled→publishing proceeds.
    if (!(await claimForPublish(post.id))) continue;

    const attempts = (post.attempts ?? 0) + 1;
    const res = await publishSocialPost(post);

    if (res.ok) {
      await markPosted(post.id, res.externalId);
      results.push({ id: post.id, status: "posted", externalId: res.externalId });
    } else if (res.transient && attempts < MAX_PUBLISH_ATTEMPTS) {
      await markResult(post.id, { status: "scheduled", error: res.error, attempts });
      results.push({ id: post.id, status: "retry", attempts, error: res.error });
    } else {
      await markResult(post.id, { status: "failed", error: res.error, attempts });
      results.push({ id: post.id, status: "failed", attempts, error: res.error });
    }
  }

  return Response.json({ ok: true, processed: results.length, results });
}

export const GET = handle;
export const POST = handle;

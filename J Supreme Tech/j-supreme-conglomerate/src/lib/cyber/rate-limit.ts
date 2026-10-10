/**
 * Lightweight in-memory rate limiter (token bucket).
 * ------------------------------------------------------------------
 * No external dependency — works today on a single warm function
 * instance (Fluid Compute reuses instances, so this holds for typical
 * abuse bursts). For TRUE fleet-wide distributed limits across all
 * serverless instances, back this with Upstash Redis (drop-in: swap
 * the Map for Redis INCR + EXPIRE). The call sites don't change.
 *
 * Usage in a route:
 *   const gate = rateLimit(req, { limit: 10, windowMs: 60_000, key: "book" });
 *   if (!gate.ok) return gate.response;   // 429 with Retry-After
 */

import { NextResponse } from "next/server";

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Opportunistic sweep so the Map can't grow unbounded on a long-lived instance.
let lastSweep = 0;
function sweep(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
}

/** Best-effort client IP from the standard proxy headers (Vercel sets these). */
export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export type RateLimitOptions = {
  /** Max requests per window. */
  limit: number;
  /** Window length in ms. */
  windowMs: number;
  /** Namespace so different routes don't share a bucket. */
  key: string;
  /** Override the identity (defaults to client IP). */
  id?: string;
};

export type RateLimitResult =
  | { ok: true; remaining: number; resetAt: number }
  | { ok: false; remaining: 0; resetAt: number; retryAfter: number; response: NextResponse };

export function rateLimit(req: Request, opts: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const id = opts.id ?? clientIp(req);
  const bucketKey = `${opts.key}:${id}`;
  const existing = buckets.get(bucketKey);

  if (!existing || existing.resetAt <= now) {
    buckets.set(bucketKey, { count: 1, resetAt: now + opts.windowMs });
    return { ok: true, remaining: opts.limit - 1, resetAt: now + opts.windowMs };
  }

  if (existing.count >= opts.limit) {
    const retryAfter = Math.ceil((existing.resetAt - now) / 1000);
    const response = NextResponse.json(
      { ok: false, error: "Too many requests. Please slow down." },
      { status: 429 },
    );
    response.headers.set("Retry-After", String(retryAfter));
    response.headers.set("X-RateLimit-Limit", String(opts.limit));
    response.headers.set("X-RateLimit-Remaining", "0");
    response.headers.set("X-RateLimit-Reset", String(Math.ceil(existing.resetAt / 1000)));
    return { ok: false, remaining: 0, resetAt: existing.resetAt, retryAfter, response };
  }

  existing.count += 1;
  return { ok: true, remaining: opts.limit - existing.count, resetAt: existing.resetAt };
}

/**
 * GET /api/v1/cyber/scan
 * ------------------------------------------------------------------
 * Live fleet security scan. Operator-only (Clerk middleware gates
 * everything under /api/v1 that isn't on the public allowlist).
 *
 * Probes every property in the FLEET registry in parallel, grading each
 * by its real response security headers + TLS + reachability, and returns
 * a fleet-wide posture summary.
 *
 *   ?id=<propertyId>   scan a single property
 */

import { NextResponse } from "next/server";
import { FLEET } from "@/lib/cyber/data";
import { scanProperty, type ScanResult } from "@/lib/cyber/scan";
import { rateLimit } from "@/lib/cyber/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: Request) {
  // Defense-in-depth: even behind operator auth, cap how often the scan fires
  // (each call fans out fetches to every property).
  const gate = rateLimit(req, { limit: 20, windowMs: 60_000, key: "cyber-scan" });
  if (!gate.ok) return gate.response;

  const { searchParams } = new URL(req.url);
  const onlyId = searchParams.get("id");
  const targets = onlyId ? FLEET.filter((p) => p.id === onlyId) : FLEET;

  if (!targets.length) {
    return NextResponse.json({ ok: false, error: "Unknown property id." }, { status: 404 });
  }

  const settled = await Promise.allSettled(targets.map((p) => scanProperty(p)));
  const results: ScanResult[] = settled.map((s, i) =>
    s.status === "fulfilled"
      ? s.value
      : {
          id: targets[i].id,
          name: targets[i].name,
          url: targets[i].url,
          tier: targets[i].tier,
          sensitivity: targets[i].sensitivity,
          reachable: false,
          https: targets[i].url.startsWith("https://"),
          status: null,
          latencyMs: null,
          score: 0,
          grade: "—" as const,
          checks: [],
          error: "scan failed",
        },
  );

  const reachable = results.filter((r) => r.reachable);
  const avgScore = reachable.length
    ? Math.round(reachable.reduce((s, r) => s + r.score, 0) / reachable.length)
    : 0;

  const distribution = results.reduce(
    (acc, r) => ((acc[r.grade] = (acc[r.grade] ?? 0) + 1), acc),
    {} as Record<string, number>,
  );

  return NextResponse.json({
    ok: true,
    scannedAt: Date.now(),
    summary: {
      total: results.length,
      reachable: reachable.length,
      down: results.length - reachable.length,
      avgScore,
      distribution,
    },
    results: results.sort((a, b) => a.score - b.score), // worst first — triage order
  });
}

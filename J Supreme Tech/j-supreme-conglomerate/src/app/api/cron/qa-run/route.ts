import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export const maxDuration = 60;

type ProjectCheck = {
  id: string;
  name: string;
  url: string;
};

const PROJECTS: ProjectCheck[] = [
  { id: "j-supreme-conglomerate", name: "J Supreme Conglomerate", url: "https://jsupremeconglomerate.online" },
  { id: "aboo-tours",             name: "AbooTours",              url: "https://abootours.com" },
  { id: "bp-couriers",            name: "BP Couriers",            url: "https://courier-app-gamma.vercel.app" },
  { id: "language-cradle",        name: "The Language Cradle",    url: "https://thelanguagecradle.vercel.app" },
  { id: "solace-auto-imports",    name: "Solace Auto Imports",    url: "https://solaceautoimportsltd.com" },
  { id: "the-cleanser-ja",        name: "The Cleanser JA",        url: "https://the-cleanser-ja.vercel.app" },
  { id: "the-mover-guy",          name: "The MoverGuy",           url: "https://themoverguy.online" },
  { id: "solid-trust-courier",    name: "Solid Trust Courier",    url: "https://solidtrustservices.com" },
  { id: "ship2door",              name: "Ship 2 Door JA",         url: "https://ship2doorja.com" },
];

async function checkProject(p: ProjectCheck) {
  const start = Date.now();
  try {
    const res = await fetch(p.url, {
      method: "HEAD",
      signal: AbortSignal.timeout(8000),
      redirect: "follow",
    });
    const ms = Date.now() - start;
    const passed = res.status < 400;
    return {
      ...p,
      http_status: res.status,
      response_ms: ms,
      passed,
      checks: { status_ok: passed, fast: ms < 3000 },
      error: passed ? null : `HTTP ${res.status}`,
    };
  } catch (err) {
    return {
      ...p,
      http_status: null,
      response_ms: Date.now() - start,
      passed: false,
      checks: { status_ok: false, fast: false },
      error: err instanceof Error ? err.message : "fetch failed",
    };
  }
}

export async function GET(req: Request) {
  const secret = req.headers.get("authorization");
  const expected = `Bearer ${process.env.CRON_SECRET ?? ""}`;
  if (process.env.CRON_SECRET && secret !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const connStr = process.env.NEON_QA_DATABASE_URL;
  if (!connStr) {
    return NextResponse.json({ error: "NEON_QA_DATABASE_URL not set" }, { status: 503 });
  }

  const sql = neon(connStr);
  const runStart = Date.now();

  // Create run record
  const [run] = await sql`
    INSERT INTO qa_runs (status) VALUES ('running')
    RETURNING id
  `;
  const runId: string = run.id;

  // Run all checks in parallel
  const settled = await Promise.allSettled(PROJECTS.map(checkProject));
  const results = settled.map((s) =>
    s.status === "fulfilled" ? s.value : { ...PROJECTS[settled.indexOf(s)], http_status: null, response_ms: 0, passed: false, checks: {}, error: "runner error" }
  );

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  // Write results
  for (const r of results) {
    await sql`
      INSERT INTO qa_results (run_id, project_id, project_name, url, http_status, response_ms, passed, checks, error)
      VALUES (
        ${runId}, ${r.id}, ${r.name}, ${r.url},
        ${r.http_status}, ${r.response_ms}, ${r.passed},
        ${JSON.stringify(r.checks)}, ${r.error ?? null}
      )
    `;
  }

  // Write alerts for failures
  const alerts: string[] = [];
  for (const r of results) {
    if (!r.passed) {
      const msg = `${r.name}: ${r.error ?? "failed"} (${r.http_status ?? "no response"})`;
      alerts.push(msg);
      await sql`
        INSERT INTO qa_alerts (run_id, project_id, project_name, alert_type, severity, message)
        VALUES (
          ${runId}, ${r.id}, ${r.name},
          ${r.http_status ? "http_error" : "timeout"},
          'critical',
          ${msg}
        )
      `;
    }
  }

  // Mark run done
  await sql`
    UPDATE qa_runs
    SET status = 'done', total = ${PROJECTS.length}, passed = ${passed}, failed = ${failed},
        duration_ms = ${Date.now() - runStart}, finished_at = now()
    WHERE id = ${runId}
  `;

  // Fire alert webhook if there are failures
  if (failed > 0) {
    const alertUrl = process.env.NEXT_PUBLIC_APP_URL
      ? `${process.env.NEXT_PUBLIC_APP_URL}/api/qa/alert`
      : "https://jsupremeconglomerate.online/api/qa/alert";
    await fetch(alertUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-jarvis-secret": process.env.JARVIS_NOTIFY_SECRET ?? "",
      },
      body: JSON.stringify({
        run_id: runId,
        critical_count: failed,
        warning_count: 0,
        alerts,
      }),
    }).catch(() => null); // best-effort
  }

  return NextResponse.json({ run_id: runId, passed, failed, total: PROJECTS.length, duration_ms: Date.now() - runStart });
}

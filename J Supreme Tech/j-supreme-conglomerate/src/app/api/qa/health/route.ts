import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";

// Returns latest QA run + per-project results for the /jarvis health dashboard

export async function GET() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const connStr = process.env.NEON_QA_DATABASE_URL;
  if (!connStr)
    return NextResponse.json({ error: "NEON_QA_DATABASE_URL not set" }, { status: 503 });

  try {
    const sql = neon(connStr);

    // Latest completed run
    const runs = await sql`
      SELECT * FROM qa_runs
      WHERE status != 'running'
      ORDER BY run_at DESC
      LIMIT 1
    `;
    const run = runs[0] ?? null;

    if (!run) {
      return NextResponse.json({ run: null, results: [], alerts: [] });
    }

    // Results for that run
    const results = await sql`
      SELECT project_id, project_name, url, http_status, response_ms, passed, checks, error
      FROM qa_results
      WHERE run_id = ${run.id}
      ORDER BY project_name
    `;

    // Open (unresolved) alerts
    const alerts = await sql`
      SELECT project_id, project_name, alert_type, severity, message, fired_at
      FROM qa_alerts
      WHERE resolved_at IS NULL
      ORDER BY fired_at DESC
      LIMIT 50
    `;

    return NextResponse.json({ run, results, alerts });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

import { getServiceSupabase } from "@/lib/supabase/admin";

export type EodReport = {
  id: string;
  owner_clerk_id: string;
  report_date: string;
  title: string;
  html: string;
  text: string | null;
  metrics: Record<string, number>;
  created_at: string;
  updated_at: string;
};

const SELECT =
  "id,owner_clerk_id,report_date,title,html,text,metrics,created_at,updated_at";

function mapRow(r: Record<string, unknown>): EodReport {
  return {
    id: String(r.id),
    owner_clerk_id: String(r.owner_clerk_id),
    report_date: String(r.report_date).slice(0, 10),
    title: String(r.title ?? ""),
    html: String(r.html ?? ""),
    text: r.text != null ? String(r.text) : null,
    metrics:
      r.metrics && typeof r.metrics === "object"
        ? (r.metrics as Record<string, number>)
        : {},
    created_at: String(r.created_at),
    updated_at: String(r.updated_at),
  };
}

export async function listEodReports(
  owner: string,
  limit = 60,
): Promise<EodReport[]> {
  const sb = getServiceSupabase();
  if (!sb) return [];
  try {
    const { data, error } = await sb
      .from("eod_reports")
      .select(SELECT)
      .eq("owner_clerk_id", owner)
      .order("report_date", { ascending: false })
      .limit(limit);
    if (error) return [];
    return (data ?? []).map((r) => mapRow(r as Record<string, unknown>));
  } catch {
    return [];
  }
}

export type SaveEodInput = {
  report_date: string;
  title: string;
  html: string;
  text?: string | null;
  metrics?: Record<string, number>;
};

export type SaveEodResult =
  | { ok: true; report: EodReport }
  | { ok: false; error: string };

/** Upsert by (owner, report_date) so re-running the same day updates, never dupes. */
export async function saveEodReport(
  owner: string,
  input: SaveEodInput,
): Promise<SaveEodResult> {
  const sb = getServiceSupabase();
  if (!sb) {
    return { ok: false, error: "Supabase not configured — EOD reports need the cloud DB." };
  }
  try {
    const { data, error } = await sb
      .from("eod_reports")
      .upsert(
        {
          owner_clerk_id: owner,
          report_date: input.report_date,
          title: input.title,
          html: input.html,
          text: input.text ?? null,
          metrics: input.metrics ?? {},
          updated_at: new Date().toISOString(),
        },
        { onConflict: "owner_clerk_id,report_date" },
      )
      .select(SELECT)
      .single();
    if (error) {
      const hint = /relation|does not exist|schema cache/i.test(error.message)
        ? " Run supabase/migrations/20260531160000_eod_reports.sql."
        : "";
      return { ok: false, error: `${error.message}${hint}` };
    }
    return { ok: true, report: mapRow(data as Record<string, unknown>) };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

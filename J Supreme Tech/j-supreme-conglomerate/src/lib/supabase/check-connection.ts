import { getServiceSupabase } from "@/lib/supabase/admin";

export type SupabaseConnectionResult =
  | { ok: true; pingMs: number }
  | { ok: false; code: "missing_env"; message: string }
  | { ok: false; code: "request_failed"; message: string }
  | { ok: false; code: "tables_missing"; message: string };

/**
 * Server-only: verifies env is present and Postgres responds via PostgREST.
 * Does not expose secrets.
 */
export async function checkSupabaseConnection(): Promise<SupabaseConnectionResult> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url?.trim() || !key?.trim()) {
    return {
      ok: false,
      code: "missing_env",
      message:
        "Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local (Supabase → Settings → API).",
    };
  }

  const sb = getServiceSupabase();
  if (!sb) {
    return {
      ok: false,
      code: "missing_env",
      message: "Supabase client could not be created. Check env values are non-empty.",
    };
  }

  const started = Date.now();
  const { error } = await sb.from("todos").select("id").limit(1);

  if (!error) {
    return { ok: true, pingMs: Date.now() - started };
  }

  const msg = error.message ?? String(error);
  const missingRelation =
    /does not exist|schema cache/i.test(msg) ||
    error.code === "PGRST204" ||
    error.code === "42P01";

  if (missingRelation) {
    return {
      ok: false,
      code: "tables_missing",
      message:
        "API answered but the `todos` table is missing. Run migrations in supabase/migrations (SQL Editor or `supabase db push`).",
    };
  }

  return {
    ok: false,
    code: "request_failed",
    message: msg,
  };
}

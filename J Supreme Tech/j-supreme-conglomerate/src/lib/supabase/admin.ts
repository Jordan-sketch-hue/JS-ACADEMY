import { createClient, SupabaseClient } from "@supabase/supabase-js";

/** Cap each Supabase HTTP round-trip so serverless pages don’t hang on a stuck connection. */
const SUPABASE_FETCH_TIMEOUT_MS = 12_000;

function createTimeoutFetch(): typeof fetch {
  return (input, init) => {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), SUPABASE_FETCH_TIMEOUT_MS);
    const p = fetch(input as RequestInfo, { ...init, signal: ctrl.signal });
    return p.finally(() => clearTimeout(t));
  };
}

let admin: SupabaseClient | null = null;

function normalizeSupabaseUrl(raw: string): string {
  const trimmed = raw.trim().replace(/\/+$/, "");
  return trimmed;
}

export function getServiceSupabase(): SupabaseClient | null {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  /** Service role (legacy) or secret key (e.g. sb_secret_… via SUPABASE_SECRET_KEY in newer projects). */
  const rawKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
  const url = rawUrl ? normalizeSupabaseUrl(rawUrl) : "";
  const key = rawKey?.trim() ?? "";
  if (!url || !key) return null;
  // REST client must use the HTTPS project URL from Settings → API, not a postgres:// connection string.
  if (!/^https:\/\//i.test(url)) {
    return null;
  }
  if (!admin) {
    admin = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      global: {
        fetch: createTimeoutFetch(),
      },
    });
  }
  return admin;
}

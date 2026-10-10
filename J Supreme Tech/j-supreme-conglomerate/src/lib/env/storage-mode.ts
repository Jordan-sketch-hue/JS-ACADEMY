/**
 * Server-only secret key for Supabase admin/service client.
 * Must stay in sync with {@link getServiceSupabase} in `@/lib/supabase/admin`.
 */
export function getSupabaseServerSecretTrimmed(): string | undefined {
  const legacy = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const secret = process.env.SUPABASE_SECRET_KEY?.trim();
  if (legacy && legacy.length > 0) return legacy;
  if (secret && secret.length > 0) return secret;
  return undefined;
}

/**
 * Server-only: project URL (public or server env).
 */
export function getSupabaseProjectUrlTrimmed(): string | undefined {
  const pub = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const srv = process.env.SUPABASE_URL?.trim();
  if (pub && pub.length > 0) return pub;
  if (srv && srv.length > 0) return srv;
  return undefined;
}

/**
 * Server-only: whether task/CRM/etc. writes go to Supabase (durable) or in-memory fallback.
 * Requires an HTTPS REST URL (same rule as {@link getServiceSupabase}); a `postgres://` DSN alone is not valid.
 */
export function isSupabasePersistenceEnabled(): boolean {
  const url = getSupabaseProjectUrlTrimmed();
  const key = getSupabaseServerSecretTrimmed();
  if (!url || !key) return false;
  return /^https:\/\//i.test(url);
}

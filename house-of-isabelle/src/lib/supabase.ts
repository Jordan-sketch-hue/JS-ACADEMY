/**
 * Supabase Client
 * Project: ibtadbwtrxglujkzqofs (ALWAYS use this one)
 *
 * - `supabaseAnon`  — browser-safe anon key; respects RLS
 * - `supabaseAdmin` — service role key; bypasses RLS; SERVER ONLY
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON_KEY      = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SERVICE_KEY   = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !ANON_KEY) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

/** Anon client — safe to use in browser components */
export const supabaseAnon = createClient(SUPABASE_URL, ANON_KEY);

/** Admin client — server-side only; bypasses RLS */
export function getSupabaseAdmin() {
  if (!SERVICE_KEY) throw new Error("SUPABASE_SERVICE_ROLE_KEY not set");
  return createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false },
  });
}

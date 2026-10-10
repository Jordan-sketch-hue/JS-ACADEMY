/**
 * WhatsApp reader — Supabase reads for the operator surface (jarvis_wa_* tables).
 *
 * The Railway bot is the only writer of thread/update rows; the app only reads
 * them and flips card status (done / dismissed). Uses the service-role client —
 * access is already fenced by the operator middleware.
 */
import { getServiceSupabase } from "@/lib/supabase/admin";
import type { WaSettingsRow, WaThreadRow } from "./types";

function db() {
  const client = getServiceSupabase();
  if (!client) {
    throw new Error("Supabase is not configured (need SUPABASE_URL + a service/secret key).");
  }
  return client;
}

export async function listThreads(opts: { statuses?: string[]; limit?: number } = {}): Promise<WaThreadRow[]> {
  let q = db()
    .from("jarvis_wa_threads")
    .select("*")
    .order("last_message_at", { ascending: false, nullsFirst: false })
    .limit(opts.limit ?? 300);
  if (opts.statuses?.length) q = q.in("status", opts.statuses);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return (data as WaThreadRow[]) ?? [];
}

export async function setThreadStatus(id: string, status: "open" | "done" | "dismissed"): Promise<void> {
  const { error } = await db().from("jarvis_wa_threads").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function getThread(id: string): Promise<WaThreadRow | null> {
  const { data, error } = await db().from("jarvis_wa_threads").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return (data as WaThreadRow | null) ?? null;
}

/**
 * Persist a drafted reply on the thread's `meta` jsonb (no schema change — same
 * trick Angel uses for ephemeral fields). Read-modify-write so other meta keys
 * (e.g. relationship) survive.
 */
export async function setThreadDraft(id: string, draft: string | null, engine: string): Promise<void> {
  const c = db();
  const { data } = await c.from("jarvis_wa_threads").select("meta").eq("id", id).maybeSingle();
  const meta = {
    ...((data?.meta as Record<string, unknown>) ?? {}),
    draft,
    draft_engine: engine,
    draft_at: new Date().toISOString(),
  };
  const { error } = await c.from("jarvis_wa_threads").update({ meta }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function getSettings(): Promise<WaSettingsRow | null> {
  const { data, error } = await db()
    .from("jarvis_wa_settings")
    .select("*")
    .eq("id", "default")
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as WaSettingsRow | null) ?? null;
}

export async function patchSettings(patch: Partial<WaSettingsRow>): Promise<void> {
  const { error } = await db()
    .from("jarvis_wa_settings")
    .upsert({ id: "default", ...patch, updated_at: new Date().toISOString() }, { onConflict: "id" });
  if (error) throw new Error(error.message);
}

/** True once the migration has been applied (table exists & is reachable). */
export async function isWhatsappConfigured(): Promise<boolean> {
  const client = getServiceSupabase();
  if (!client) return false;
  const { error } = await client.from("jarvis_wa_settings").select("id").limit(1);
  return !error;
}

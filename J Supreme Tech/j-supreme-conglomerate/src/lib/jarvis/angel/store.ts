/**
 * Angel — Supabase persistence (jarvis_angel_* tables).
 *
 * Uses the service-role client, so RLS is bypassed; access is already fenced by
 * the operator middleware. Rows are keyed by brand, not per-user (single-operator).
 */
import { getServiceSupabase } from "@/lib/supabase/admin";
import type { AngelMessage, AngelThreadRow } from "./types";

const T_THREADS = "jarvis_angel_threads";
const T_MESSAGES = "jarvis_angel_messages";
const T_ACTIONS = "jarvis_angel_actions";
const T_SETTINGS = "jarvis_angel_settings";

export type AngelSettingsRow = {
  brand: string;
  auto_sync: boolean;
  auto_draft: boolean;
  ig_permission_ok: boolean;
  autonomy: string;
  follow_up_enabled: boolean;
  forward_crm: boolean;
  /** Send a discount-hook nudge a few minutes after a lead reads our reply but doesn't answer. */
  seen_hook_enabled?: boolean | null;
  /** The promo line the seen-hook offers, e.g. "lock in 10% off if you start this week". */
  hook_offer?: string | null;
  last_sync_at: string | null;
  last_sync_note: string | null;
  updated_at: string;
};

export type AngelMessageRow = {
  id: string;
  thread_uuid: string;
  message_id: string;
  from_id: string | null;
  from_name: string | null;
  from_client: boolean;
  body: string | null;
  created_time: string | null;
};

function db() {
  const client = getServiceSupabase();
  if (!client) {
    throw new Error("Supabase is not configured (need SUPABASE_URL + a service/secret key).");
  }
  return client;
}

export async function getThreadByKey(
  brand: string,
  platform: string,
  threadId: string,
): Promise<AngelThreadRow | null> {
  const { data, error } = await db()
    .from(T_THREADS)
    .select("*")
    .eq("brand", brand)
    .eq("platform", platform)
    .eq("thread_id", threadId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as AngelThreadRow | null) ?? null;
}

export async function getThreadById(id: string): Promise<AngelThreadRow | null> {
  const { data, error } = await db().from(T_THREADS).select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return (data as AngelThreadRow | null) ?? null;
}

/**
 * Most-recent thread for a person, keyed on the stable identity (brand + platform
 * + participant id). Polling keys rows by Meta's conversation id while the webhook
 * keys by `platform:senderId`, so the same person can have two rows — matching on
 * participant id lets a read receipt find whichever one is live.
 */
export async function getThreadByParticipant(
  brand: string,
  platform: string,
  participantId: string,
): Promise<AngelThreadRow | null> {
  const { data, error } = await db()
    .from(T_THREADS)
    .select("*")
    .eq("brand", brand)
    .eq("platform", platform)
    .eq("participant_id", participantId)
    .order("last_message_at", { ascending: false, nullsFirst: false })
    .limit(1);
  if (error) throw new Error(error.message);
  return ((data as AngelThreadRow[] | null)?.[0]) ?? null;
}

export async function insertThread(
  row: Record<string, unknown>,
): Promise<AngelThreadRow> {
  const { data, error } = await db().from(T_THREADS).insert(row).select("*").single();
  if (error) throw new Error(error.message);
  return data as AngelThreadRow;
}

export async function updateThread(
  id: string,
  patch: Record<string, unknown>,
): Promise<AngelThreadRow> {
  const { data, error } = await db()
    .from(T_THREADS)
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data as AngelThreadRow;
}

/**
 * Merge `partial` into a thread's `meta` JSON without clobbering keys written
 * elsewhere (e.g. the Angel-sent fingerprints stamped during a send). Read-modify-
 * write — fine at Angel's volume, and the only safe way to update one meta key
 * when several code paths touch `meta` in the same run.
 */
export async function patchThreadMeta(
  id: string,
  partial: Record<string, unknown>,
): Promise<AngelThreadRow> {
  const current = await getThreadById(id);
  const merged = { ...((current?.meta ?? {}) as Record<string, unknown>), ...partial };
  return updateThread(id, { meta: merged });
}

export async function upsertMessages(
  threadUuid: string,
  messages: AngelMessage[],
): Promise<void> {
  if (!messages.length) return;
  const rows = messages.map((m) => ({
    thread_uuid: threadUuid,
    message_id: m.messageId,
    from_id: m.fromId,
    from_name: m.fromName,
    from_client: m.fromClient,
    body: m.body,
    created_time: m.createdTime,
  }));
  const { error } = await db()
    .from(T_MESSAGES)
    .upsert(rows, { onConflict: "thread_uuid,message_id", ignoreDuplicates: true });
  if (error) throw new Error(error.message);
}

export async function listMessages(threadUuid: string): Promise<AngelMessageRow[]> {
  const { data, error } = await db()
    .from(T_MESSAGES)
    .select("*")
    .eq("thread_uuid", threadUuid)
    .order("created_time", { ascending: true });
  if (error) throw new Error(error.message);
  return (data as AngelMessageRow[]) ?? [];
}

export async function listThreads(opts: {
  statuses?: string[];
  brand?: string;
  limit?: number;
}): Promise<AngelThreadRow[]> {
  let q = db()
    .from(T_THREADS)
    .select("*")
    .order("last_message_at", { ascending: false, nullsFirst: false })
    .limit(opts.limit ?? 250);
  if (opts.brand) q = q.eq("brand", opts.brand);
  if (opts.statuses?.length) q = q.in("status", opts.statuses);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return (data as AngelThreadRow[]) ?? [];
}

export async function logAction(entry: {
  threadUuid?: string | null;
  brand?: string | null;
  action: string;
  detail?: string;
  payload?: Record<string, unknown>;
}): Promise<void> {
  const { error } = await db().from(T_ACTIONS).insert({
    thread_uuid: entry.threadUuid ?? null,
    brand: entry.brand ?? null,
    action: entry.action,
    detail: entry.detail ?? null,
    payload: entry.payload ?? {},
  });
  if (error) {
    // Audit logging must never break the action it's recording.
    console.error("[angel] logAction failed:", error.message);
  }
}

export async function getSettings(brand: string): Promise<AngelSettingsRow | null> {
  const { data, error } = await db()
    .from(T_SETTINGS)
    .select("*")
    .eq("brand", brand)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as AngelSettingsRow | null) ?? null;
}

export async function upsertSettings(
  brand: string,
  patch: Record<string, unknown>,
): Promise<void> {
  const { error } = await db()
    .from(T_SETTINGS)
    .upsert({ brand, ...patch, updated_at: new Date().toISOString() }, { onConflict: "brand" });
  if (error) throw new Error(error.message);
}

/**
 * Data access for connected Meta assets (Pages / IG accounts / Ad accounts).
 *
 * Tokens are AES-256-GCM encrypted on the way in and only decrypted by
 * `getConnectionToken()` inside the server publish path. The list/read models
 * never carry the token.
 */
import { getServiceSupabase } from "@/lib/supabase/admin";
import { decryptToken, encryptToken } from "@/lib/marketing/meta/crypto";
import {
  toMetaConnection,
  type MetaConnection,
  type MetaConnectionKind,
  type MetaConnectionRow,
} from "@/lib/marketing/meta/types";

const SAFE_COLS =
  "id, owner_clerk_id, kind, external_id, name, token_expires_at, scopes, meta, created_at, updated_at";

export async function upsertConnection(params: {
  ownerClerkId: string;
  kind: MetaConnectionKind;
  externalId: string;
  name?: string | null;
  /** Plaintext token — encrypted here before it touches the DB. */
  accessToken: string;
  tokenExpiresAt?: string | null;
  scopes?: string[];
  meta?: Record<string, unknown>;
}): Promise<{ ok: true; connection: MetaConnection } | { ok: false; error: string }> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, error: "Supabase is not configured." };

  let cipher: string;
  try {
    cipher = encryptToken(params.accessToken);
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Token encryption failed.",
    };
  }

  const row = {
    owner_clerk_id: params.ownerClerkId,
    kind: params.kind,
    external_id: params.externalId,
    name: params.name ?? null,
    access_token: cipher,
    token_expires_at: params.tokenExpiresAt ?? null,
    scopes: params.scopes ?? null,
    meta: params.meta ?? {},
  };

  const { data, error } = await sb
    .from("meta_connections")
    .upsert(row, { onConflict: "owner_clerk_id,kind,external_id" })
    .select(SAFE_COLS)
    .single();

  if (error || !data) return { ok: false, error: error?.message ?? "Upsert failed." };
  return { ok: true, connection: toMetaConnection(data as MetaConnectionRow) };
}

export async function listConnections(
  ownerClerkId: string,
  kind?: MetaConnectionKind,
): Promise<MetaConnection[]> {
  const sb = getServiceSupabase();
  if (!sb) return [];
  let q = sb.from("meta_connections").select(SAFE_COLS).eq("owner_clerk_id", ownerClerkId);
  if (kind) q = q.eq("kind", kind);
  const { data, error } = await q.order("created_at", { ascending: true });
  if (error || !data) return [];
  return data.map((r) => toMetaConnection(r as MetaConnectionRow));
}

/**
 * SERVER-ONLY: returns the DECRYPTED token for a connection, scoped to its owner.
 * Used by the publish path. Never return this to a client payload.
 */
export async function getConnectionToken(
  connectionId: string,
  ownerClerkId: string,
): Promise<
  | { ok: true; connection: MetaConnection; token: string }
  | { ok: false; error: string }
> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, error: "Supabase is not configured." };

  const { data, error } = await sb
    .from("meta_connections")
    .select("*")
    .eq("id", connectionId)
    .eq("owner_clerk_id", ownerClerkId)
    .maybeSingle();

  if (error) return { ok: false, error: error.message };
  if (!data) return { ok: false, error: "Connection not found." };

  const row = data as MetaConnectionRow;
  if (!row.access_token) return { ok: false, error: "Connection has no stored token." };

  let token: string;
  try {
    token = decryptToken(row.access_token);
  } catch {
    return { ok: false, error: "Token could not be decrypted (key rotated?). Reconnect Meta." };
  }
  return { ok: true, connection: toMetaConnection(row), token };
}

export async function deleteConnection(
  connectionId: string,
  ownerClerkId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, error: "Supabase is not configured." };
  const { error } = await sb
    .from("meta_connections")
    .delete()
    .eq("id", connectionId)
    .eq("owner_clerk_id", ownerClerkId);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

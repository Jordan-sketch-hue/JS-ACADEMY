/**
 * Data access for connected TikTok accounts.
 *
 * TikTok rows live in the SHARED `meta_connections` table with kind="tiktok_account".
 * Both the access token AND the refresh token are AES-256-GCM encrypted at rest
 * (same key as Meta: META_TOKEN_ENC_KEY). Only the server publish path decrypts them;
 * the list/read model (`MetaConnection`) never carries either token.
 */
import { getServiceSupabase } from "@/lib/supabase/admin";
import { decryptToken, encryptToken } from "@/lib/marketing/meta/crypto";
import {
  toMetaConnection,
  type MetaConnection,
  type MetaConnectionRow,
} from "@/lib/marketing/meta/types";

const SAFE_COLS =
  "id, owner_clerk_id, kind, external_id, name, token_expires_at, scopes, meta, created_at, updated_at";

/** Connect (or re-connect) a TikTok account. Both tokens encrypted before they touch the DB. */
export async function upsertTikTokConnection(params: {
  ownerClerkId: string;
  /** TikTok open_id — stable per-user id, used as external_id. */
  openId: string;
  name?: string | null;
  accessToken: string;
  accessTokenExpiresAt?: string | null;
  refreshToken: string;
  refreshTokenExpiresAt?: string | null;
  scopes?: string[];
  meta?: Record<string, unknown>;
}): Promise<{ ok: true; connection: MetaConnection } | { ok: false; error: string }> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, error: "Supabase is not configured." };

  let accessCipher: string;
  let refreshCipher: string;
  try {
    accessCipher = encryptToken(params.accessToken);
    refreshCipher = encryptToken(params.refreshToken);
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Token encryption failed." };
  }

  const row = {
    owner_clerk_id: params.ownerClerkId,
    kind: "tiktok_account" as const,
    external_id: params.openId,
    name: params.name ?? null,
    access_token: accessCipher,
    token_expires_at: params.accessTokenExpiresAt ?? null,
    refresh_token: refreshCipher,
    refresh_token_expires_at: params.refreshTokenExpiresAt ?? null,
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

export type TikTokPublishContext = {
  connectionId: string;
  accessToken: string;
  tokenExpiresAt: string | null;
  refreshToken: string | null;
  refreshTokenExpiresAt: string | null;
};

/**
 * SERVER-ONLY: decrypted tokens for the publish path, scoped to owner + kind.
 * Returns both access and refresh tokens so the publisher can refresh on demand.
 */
export async function getTikTokPublishContext(
  connectionId: string,
  ownerClerkId: string,
): Promise<({ ok: true } & TikTokPublishContext) | { ok: false; error: string }> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, error: "Supabase is not configured." };

  const { data, error } = await sb
    .from("meta_connections")
    .select("*")
    .eq("id", connectionId)
    .eq("owner_clerk_id", ownerClerkId)
    .eq("kind", "tiktok_account")
    .maybeSingle();

  if (error) return { ok: false, error: error.message };
  if (!data) return { ok: false, error: "TikTok connection not found." };

  const row = data as MetaConnectionRow;
  if (!row.access_token) return { ok: false, error: "Connection has no stored access token." };

  let accessToken: string;
  try {
    accessToken = decryptToken(row.access_token);
  } catch {
    return { ok: false, error: "Access token could not be decrypted (key rotated?). Reconnect TikTok." };
  }

  let refreshToken: string | null = null;
  if (row.refresh_token) {
    try {
      refreshToken = decryptToken(row.refresh_token);
    } catch {
      refreshToken = null; // force a clean reconnect rather than a confusing refresh failure
    }
  }

  return {
    ok: true,
    connectionId,
    accessToken,
    tokenExpiresAt: row.token_expires_at,
    refreshToken,
    refreshTokenExpiresAt: row.refresh_token_expires_at ?? null,
  };
}

/** Persist a freshly-refreshed token pair (TikTok rotates the refresh token). */
export async function saveRefreshedTokens(
  connectionId: string,
  t: {
    accessToken: string;
    accessTokenExpiresAt: string;
    refreshToken: string;
    refreshTokenExpiresAt: string;
  },
): Promise<void> {
  const sb = getServiceSupabase();
  if (!sb) return;
  await sb
    .from("meta_connections")
    .update({
      access_token: encryptToken(t.accessToken),
      token_expires_at: t.accessTokenExpiresAt,
      refresh_token: encryptToken(t.refreshToken),
      refresh_token_expires_at: t.refreshTokenExpiresAt,
    })
    .eq("id", connectionId);
}

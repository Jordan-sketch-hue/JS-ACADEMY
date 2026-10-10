/**
 * Angel — Instagram Login token storage (jarvis_angel_ig_auth).
 *
 * Stores the long-lived IG user token per brand, encrypted with META_TOKEN_ENC_KEY
 * when available (else plaintext in the RLS-locked, service-role-only table).
 * Auto-refreshes the token when it's within a week of expiry.
 */
import "server-only";
import { getServiceSupabase } from "@/lib/supabase/admin";
import { encryptToken, decryptToken, hasTokenEncryptionKey } from "@/lib/marketing/meta/crypto";
import { refreshLongLived } from "./ig-login";

const T = "jarvis_angel_ig_auth";
const REFRESH_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

export type IgAuth = {
  brand: string;
  igUserId: string | null;
  igUsername: string | null;
  token: string;
  expiresAt: string | null;
  scopes: string | null;
};

function db() {
  const c = getServiceSupabase();
  if (!c) throw new Error("Supabase is not configured.");
  return c;
}

export async function saveIgAuth(
  brand: string,
  data: { token: string; igUserId: string | null; igUsername: string | null; expiresInSec: number; scopes?: string },
): Promise<void> {
  const encrypt = hasTokenEncryptionKey();
  const stored = encrypt ? encryptToken(data.token) : data.token;
  const now = new Date();
  const { error } = await db()
    .from(T)
    .upsert(
      {
        brand,
        ig_user_id: data.igUserId,
        ig_username: data.igUsername,
        access_token: stored,
        token_encrypted: encrypt,
        expires_at: new Date(now.getTime() + data.expiresInSec * 1000).toISOString(),
        scopes: data.scopes ?? null,
        connected_at: now.toISOString(),
        updated_at: now.toISOString(),
      },
      { onConflict: "brand" },
    );
  if (error) throw new Error(error.message);
}

export async function getIgAuth(brand: string): Promise<IgAuth | null> {
  const { data, error } = await db().from(T).select("*").eq("brand", brand).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  const row = data as {
    brand: string;
    ig_user_id: string | null;
    ig_username: string | null;
    access_token: string;
    token_encrypted: boolean;
    expires_at: string | null;
    scopes: string | null;
  };
  let token = row.access_token;
  if (row.token_encrypted) {
    try {
      token = decryptToken(token);
    } catch {
      return null; // key rotated / tampered — force a reconnect
    }
  }
  return {
    brand: row.brand,
    igUserId: row.ig_user_id,
    igUsername: row.ig_username,
    token,
    expiresAt: row.expires_at,
    scopes: row.scopes,
  };
}

export async function isIgConnected(brand: string): Promise<boolean> {
  try {
    return Boolean(await getIgAuth(brand));
  } catch {
    return false;
  }
}

/** Get a usable token, refreshing it first if it's close to expiry. */
export async function getValidIgToken(brand: string): Promise<IgAuth | null> {
  const auth = await getIgAuth(brand);
  if (!auth) return null;
  if (auth.expiresAt) {
    const remaining = Date.parse(auth.expiresAt) - Date.now();
    if (remaining > 0 && remaining < REFRESH_WINDOW_MS) {
      try {
        const r = await refreshLongLived(auth.token);
        await saveIgAuth(brand, {
          token: r.token,
          igUserId: auth.igUserId,
          igUsername: auth.igUsername,
          expiresInSec: r.expiresIn,
          scopes: auth.scopes ?? undefined,
        });
        return { ...auth, token: r.token, expiresAt: new Date(Date.now() + r.expiresIn * 1000).toISOString() };
      } catch {
        // keep using the current token
      }
    }
  }
  return auth;
}

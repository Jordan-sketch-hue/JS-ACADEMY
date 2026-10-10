/**
 * Angel — Instagram API with Instagram Login (the desktop-only path).
 *
 * Instead of a Facebook Page token + the phone "Connected Tools" toggle, the
 * account owner authorizes our app directly through an Instagram browser login.
 * That OAuth consent grants message access — no phone setting required. Tokens
 * and calls live on graph.instagram.com (separate from the Facebook Graph).
 *
 * Needs an Instagram app id/secret from the app's "Instagram → API setup with
 * Instagram login" product (distinct from the Facebook app id/secret).
 */
import "server-only";

const IG_AUTH_DIALOG = "https://www.instagram.com/oauth/authorize";
const IG_TOKEN_URL = "https://api.instagram.com/oauth/access_token";
const IG_GRAPH = "https://graph.instagram.com";
const IG_VERSION = "v21.0";

export const IG_SCOPES = [
  "instagram_business_basic",
  "instagram_business_manage_messages",
  "instagram_business_manage_comments",
];

export function igAppId(): string {
  const v = process.env.INSTAGRAM_APP_ID?.trim();
  if (!v) throw new Error("INSTAGRAM_APP_ID is not set.");
  return v;
}
export function igAppSecret(): string {
  const v = process.env.INSTAGRAM_APP_SECRET?.trim();
  if (!v) throw new Error("INSTAGRAM_APP_SECRET is not set.");
  return v;
}
export function igRedirectUri(): string {
  return (
    process.env.ANGEL_IG_REDIRECT_URI?.trim() ||
    "https://jsupremeconglomerate.online/api/v1/jarvis/angel/ig/callback"
  );
}
export function isIgLoginConfigured(): boolean {
  return Boolean(process.env.INSTAGRAM_APP_ID?.trim() && process.env.INSTAGRAM_APP_SECRET?.trim());
}

/** The Instagram OAuth consent URL. `state` carries the brand slug. */
export function buildAuthorizeUrl(state: string): string {
  const u = new URL(IG_AUTH_DIALOG);
  u.searchParams.set("client_id", igAppId());
  u.searchParams.set("redirect_uri", igRedirectUri());
  u.searchParams.set("response_type", "code");
  u.searchParams.set("scope", IG_SCOPES.join(","));
  u.searchParams.set("state", state);
  return u.toString();
}

type ShortTokenResp = {
  access_token?: string;
  user_id?: string | number;
  permissions?: string | string[];
  data?: { access_token?: string; user_id?: string | number }[];
  error_message?: string;
  error_type?: string;
};

/** Authorization code → short-lived IG user token. */
export async function exchangeCode(code: string): Promise<{ token: string; userId: string | null }> {
  const form = new URLSearchParams();
  form.set("client_id", igAppId());
  form.set("client_secret", igAppSecret());
  form.set("grant_type", "authorization_code");
  form.set("redirect_uri", igRedirectUri());
  form.set("code", code);
  const res = await fetch(IG_TOKEN_URL, { method: "POST", body: form });
  const json = (await res.json().catch(() => ({}))) as ShortTokenResp;
  const token = json.access_token ?? json.data?.[0]?.access_token;
  if (!res.ok || !token) {
    throw new Error(json.error_message || `IG code exchange failed (HTTP ${res.status})`);
  }
  const uid = json.user_id ?? json.data?.[0]?.user_id ?? null;
  return { token, userId: uid != null ? String(uid) : null };
}

/** Short-lived → long-lived (~60 day) IG user token. */
export async function toLongLived(shortToken: string): Promise<{ token: string; expiresIn: number }> {
  const u = new URL(`${IG_GRAPH}/access_token`);
  u.searchParams.set("grant_type", "ig_exchange_token");
  u.searchParams.set("client_secret", igAppSecret());
  u.searchParams.set("access_token", shortToken);
  const res = await fetch(u.toString());
  const json = (await res.json().catch(() => ({}))) as {
    access_token?: string;
    expires_in?: number;
    error?: { message?: string };
  };
  if (!res.ok || !json.access_token) {
    throw new Error(json.error?.message || `IG long-lived exchange failed (HTTP ${res.status})`);
  }
  return { token: json.access_token, expiresIn: json.expires_in ?? 5_184_000 };
}

/** Refresh a long-lived token (call before it expires; valid tokens ≥24h old). */
export async function refreshLongLived(longToken: string): Promise<{ token: string; expiresIn: number }> {
  const u = new URL(`${IG_GRAPH}/refresh_access_token`);
  u.searchParams.set("grant_type", "ig_refresh_token");
  u.searchParams.set("access_token", longToken);
  const res = await fetch(u.toString());
  const json = (await res.json().catch(() => ({}))) as {
    access_token?: string;
    expires_in?: number;
    error?: { message?: string };
  };
  if (!res.ok || !json.access_token) {
    throw new Error(json.error?.message || `IG token refresh failed (HTTP ${res.status})`);
  }
  return { token: json.access_token, expiresIn: json.expires_in ?? 5_184_000 };
}

type IgErr = { error?: { message?: string } };

export async function igGet<T = unknown>(
  path: string,
  token: string,
  params: Record<string, string | number> = {},
): Promise<T> {
  const clean = path.replace(/^\/+/, "");
  const u = /^https?:\/\//.test(clean) ? new URL(clean) : new URL(`${IG_GRAPH}/${IG_VERSION}/${clean}`);
  for (const [k, v] of Object.entries(params)) u.searchParams.set(k, String(v));
  u.searchParams.set("access_token", token);
  const res = await fetch(u.toString());
  const json = (await res.json().catch(() => ({}))) as T & IgErr;
  if (!res.ok || json?.error) {
    throw new Error(json?.error?.message || `IG GET ${clean} failed (HTTP ${res.status})`);
  }
  return json as T;
}

export async function igPost<T = unknown>(
  path: string,
  token: string,
  body: Record<string, string> = {},
): Promise<T> {
  const clean = path.replace(/^\/+/, "");
  const url = /^https?:\/\//.test(clean) ? clean : `${IG_GRAPH}/${IG_VERSION}/${clean}`;
  const form = new URLSearchParams();
  for (const [k, v] of Object.entries(body)) form.set(k, v);
  form.set("access_token", token);
  const res = await fetch(url, { method: "POST", body: form });
  const json = (await res.json().catch(() => ({}))) as T & IgErr;
  if (!res.ok || json?.error) {
    throw new Error(json?.error?.message || `IG POST ${clean} failed (HTTP ${res.status})`);
  }
  return json as T;
}

/** Who did we just connect? */
export async function getIgProfile(token: string): Promise<{ userId: string | null; username: string | null }> {
  try {
    const me = await igGet<{ user_id?: string; id?: string; username?: string }>("me", token, {
      fields: "user_id,username",
    });
    return { userId: me.user_id ?? me.id ?? null, username: me.username ?? null };
  } catch {
    return { userId: null, username: null };
  }
}

/**
 * TikTok Login Kit — OAuth + token refresh + account discovery.
 *
 * Flow: connect → TikTok consent → callback with `code` →
 *   exchangeCodeForToken(code)   // access (~24h) + refresh (~365d) + open_id
 *   fetchUserInfo(access)        // display name / username / avatar to label the account
 *
 * Unlike Meta Page tokens, the access token expires every ~24h — the publish path
 * refreshes it on demand with the stored refresh token (see ./publish.ts).
 */
import { clientKey, clientSecret, openApiGet, tokenEndpoint } from "./api";
import type { TikTokTokenResponse, TikTokUserInfo } from "./types";

const AUTHORIZE_URL = "https://www.tiktok.com/v2/auth/authorize/";

/**
 * Requested scopes:
 *  - user.info.basic  — read display name/username to label the connection
 *  - video.publish    — Direct Post (auto-publish to the profile; needs app audit to go public)
 *  - video.upload     — send to the creator's TikTok inbox/drafts (no audit; manual finish)
 */
export const TIKTOK_SCOPES = ["user.info.basic", "video.upload", "video.publish"] as const;

/** Redirect URI registered in the TikTok app — MUST match exactly. */
export function redirectUri(): string {
  const u = process.env.TIKTOK_REDIRECT_URI?.trim();
  if (!u) throw new Error("TIKTOK_REDIRECT_URI is not set.");
  return u;
}

/** Build the consent URL. `state` is our CSRF nonce (verified on callback). */
export function buildAuthUrl(state: string): string {
  const url = new URL(AUTHORIZE_URL);
  url.searchParams.set("client_key", clientKey());
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", TIKTOK_SCOPES.join(","));
  url.searchParams.set("redirect_uri", redirectUri());
  url.searchParams.set("state", state);
  return url.toString();
}

/** Authorization `code` → access + refresh tokens (+ open_id). */
export function exchangeCodeForToken(code: string): Promise<TikTokTokenResponse> {
  return tokenEndpoint({
    client_key: clientKey(),
    client_secret: clientSecret(),
    code,
    grant_type: "authorization_code",
    redirect_uri: redirectUri(),
  });
}

/**
 * Refresh an access token. NOTE: TikTok may return a NEW refresh token — callers must
 * persist whatever comes back, not the one they sent in.
 */
export function refreshAccessToken(refreshToken: string): Promise<TikTokTokenResponse> {
  return tokenEndpoint({
    client_key: clientKey(),
    client_secret: clientSecret(),
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });
}

/** Read the connected account's profile so we can show a friendly name in the UI. */
export async function fetchUserInfo(accessToken: string): Promise<TikTokUserInfo> {
  const data = await openApiGet<{ user?: TikTokUserInfo }>("/v2/user/info/", accessToken, {
    fields: "open_id,union_id,display_name,avatar_url,username",
  });
  return data.user ?? {};
}

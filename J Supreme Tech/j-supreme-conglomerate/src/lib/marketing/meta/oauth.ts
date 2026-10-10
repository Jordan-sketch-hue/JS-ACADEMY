/**
 * Facebook Login (for Business) — OAuth + token exchange + asset discovery.
 *
 * Flow: connect → Meta dialog → callback with `code` →
 *   exchangeCodeForToken(code)      // short-lived user token (~1h)
 *   toLongLivedToken(short)         // long-lived user token (~60d)
 *   discoverAssets(longLived)       // Pages (+ never-expiring Page tokens), IG, ad accounts
 *
 * Supports both the classic `scope` list and the newer Login-for-Business
 * `config_id` (set META_LOGIN_CONFIG_ID to use a configuration).
 */
import { appId, appSecret, graphGet, graphVersion } from "./graph";

const FB_DIALOG = "https://www.facebook.com";

/**
 * Permissions requested. In **development mode** Meta grants these for assets the
 * app's own admins (Jordan) control — no review needed. Going public later requires
 * App Review for the publish/ads ones (instagram_content_publish, pages_manage_posts,
 * ads_management).
 */
export const META_SCOPES = [
  "public_profile",
  "business_management",
  "pages_show_list",
  "pages_read_engagement",
  "pages_manage_posts",
  "instagram_basic",
  "instagram_content_publish",
  "instagram_manage_comments",
  "ads_read",
  "ads_management",
  "read_insights",
] as const;

/** The redirect URI registered in the Meta app. MUST match exactly. */
export function redirectUri(): string {
  const u = process.env.META_REDIRECT_URI?.trim();
  if (!u) throw new Error("META_REDIRECT_URI is not set.");
  return u;
}

/** Build the Login dialog URL. `state` is our CSRF nonce (verified on callback). */
export function buildLoginUrl(state: string): string {
  const url = new URL(`${FB_DIALOG}/${graphVersion()}/dialog/oauth`);
  url.searchParams.set("client_id", appId());
  url.searchParams.set("redirect_uri", redirectUri());
  url.searchParams.set("state", state);
  url.searchParams.set("response_type", "code");
  const configId = process.env.META_LOGIN_CONFIG_ID?.trim();
  if (configId) {
    url.searchParams.set("config_id", configId);
  } else {
    url.searchParams.set("scope", META_SCOPES.join(","));
  }
  return url.toString();
}

export type TokenResponse = {
  access_token: string;
  token_type?: string;
  expires_in?: number;
};

/** Low-level call to the token endpoint (uses client_secret, not a bearer token). */
async function tokenEndpoint(params: Record<string, string>): Promise<TokenResponse> {
  const url = new URL(`https://graph.facebook.com/${graphVersion()}/oauth/access_token`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url.toString(), { method: "GET" });
  const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  const err = json?.error as { message?: string } | undefined;
  if (!res.ok || err) {
    throw new Error(err?.message ?? `Token endpoint failed (HTTP ${res.status})`);
  }
  return json as unknown as TokenResponse;
}

/** Authorization `code` → short-lived user access token. */
export function exchangeCodeForToken(code: string): Promise<TokenResponse> {
  return tokenEndpoint({
    client_id: appId(),
    client_secret: appSecret(),
    redirect_uri: redirectUri(),
    code,
  });
}

/** Short-lived user token → long-lived (~60-day) user token. */
export function toLongLivedToken(shortToken: string): Promise<TokenResponse> {
  return tokenEndpoint({
    grant_type: "fb_exchange_token",
    client_id: appId(),
    client_secret: appSecret(),
    fb_exchange_token: shortToken,
  });
}

export type DiscoveredPage = {
  id: string;
  name: string;
  /** Page access token — for a Page the user admins this does NOT expire. */
  accessToken: string;
  category?: string;
  instagram?: { id: string; username?: string };
};

export type DiscoveredAdAccount = {
  /** `act_<id>` form — what Marketing API endpoints want. */
  id: string;
  accountId: string;
  name?: string;
};

/**
 * With a long-lived USER token, enumerate what we can automate:
 *  - Pages (each with its own long-lived Page token + linked IG business account)
 *  - Ad accounts (non-fatal if the ads scope wasn't granted)
 */
export async function discoverAssets(userToken: string): Promise<{
  pages: DiscoveredPage[];
  adAccounts: DiscoveredAdAccount[];
}> {
  const pagesResp = await graphGet<{ data?: RawPage[] }>("me/accounts", userToken, {
    fields: "id,name,access_token,category,instagram_business_account{id,username}",
    limit: 100,
  });
  const pages: DiscoveredPage[] = (pagesResp.data ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    accessToken: p.access_token,
    category: p.category,
    instagram: p.instagram_business_account
      ? {
          id: p.instagram_business_account.id,
          username: p.instagram_business_account.username,
        }
      : undefined,
  }));

  let adAccounts: DiscoveredAdAccount[] = [];
  try {
    const adResp = await graphGet<{ data?: RawAdAccount[] }>("me/adaccounts", userToken, {
      fields: "id,account_id,name",
      limit: 100,
    });
    adAccounts = (adResp.data ?? []).map((a) => ({
      id: a.id,
      accountId: a.account_id,
      name: a.name,
    }));
  } catch {
    // ads_read/ads_management may not be granted (or no ad account) — non-fatal.
  }

  return { pages, adAccounts };
}

type RawPage = {
  id: string;
  name: string;
  access_token: string;
  category?: string;
  instagram_business_account?: { id: string; username?: string };
};

type RawAdAccount = { id: string; account_id: string; name?: string };

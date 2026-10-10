/**
 * GET /api/v1/marketing/tiktok/callback
 * Finishes TikTok Login: verify CSRF state, exchange code → access + refresh tokens,
 * read the account's profile to label it, and store it as an encrypted connection.
 * Redirects back to /marketing with a status summary (?tiktok=connected|error).
 */
import { NextResponse, type NextRequest } from "next/server";
import { requireOwnerClerkId } from "@/lib/session";
import { exchangeCodeForToken, fetchUserInfo } from "@/lib/marketing/tiktok/oauth";
import { upsertTikTokConnection } from "@/lib/data/tiktok-connections";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function back(reqUrl: string, params: Record<string, string>): NextResponse {
  const u = new URL("/marketing", reqUrl);
  for (const [k, v] of Object.entries(params)) u.searchParams.set(k, v);
  return NextResponse.redirect(u);
}

export async function GET(req: NextRequest) {
  let owner: string;
  try {
    owner = await requireOwnerClerkId();
  } catch {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const oauthError =
    url.searchParams.get("error_description") || url.searchParams.get("error");
  if (oauthError) return back(req.url, { tiktok: "error", reason: oauthError.slice(0, 140) });

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieState = req.cookies.get("tiktok_oauth_state")?.value;
  if (!code) return back(req.url, { tiktok: "error", reason: "missing_code" });
  if (!state || !cookieState || state !== cookieState) {
    return back(req.url, { tiktok: "error", reason: "state_mismatch" });
  }

  try {
    const tok = await exchangeCodeForToken(code);

    // Best-effort profile lookup for a friendly label; never block the connect on it.
    let name: string | null = null;
    let username: string | undefined;
    let avatar: string | undefined;
    try {
      const u = await fetchUserInfo(tok.access_token);
      username = u.username;
      avatar = u.avatar_url;
      name = u.display_name || u.username || null;
    } catch {
      /* user.info.basic may lag right after consent — name stays null, fine */
    }

    const now = Date.now();
    const r = await upsertTikTokConnection({
      ownerClerkId: owner,
      openId: tok.open_id,
      name,
      accessToken: tok.access_token,
      accessTokenExpiresAt: new Date(now + tok.expires_in * 1000).toISOString(),
      refreshToken: tok.refresh_token,
      refreshTokenExpiresAt: new Date(now + tok.refresh_expires_in * 1000).toISOString(),
      scopes: tok.scope ? tok.scope.split(",").map((s) => s.trim()).filter(Boolean) : undefined,
      meta: { open_id: tok.open_id, username: username ?? null, avatar_url: avatar ?? null },
    });

    if (!r.ok) return back(req.url, { tiktok: "error", reason: r.error.slice(0, 140) });

    const res = back(req.url, { tiktok: "connected", name: r.connection.name ?? "TikTok" });
    res.cookies.delete("tiktok_oauth_state");
    return res;
  } catch (e) {
    return back(req.url, {
      tiktok: "error",
      reason: (e instanceof Error ? e.message : "exchange_failed").slice(0, 140),
    });
  }
}

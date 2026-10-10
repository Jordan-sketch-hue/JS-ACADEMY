/**
 * GET /api/v1/marketing/meta/callback
 * Finishes Facebook Login: verify CSRF state, exchange code → long-lived user token,
 * discover the operator's Pages / IG accounts / ad accounts, and store each as an
 * encrypted connection. Redirects back to /marketing with a status summary.
 */
import { NextResponse, type NextRequest } from "next/server";
import { requireOwnerClerkId } from "@/lib/session";
import {
  discoverAssets,
  exchangeCodeForToken,
  toLongLivedToken,
} from "@/lib/marketing/meta/oauth";
import { upsertConnection } from "@/lib/data/meta-connections";

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
  if (oauthError) return back(req.url, { meta: "error", reason: oauthError.slice(0, 140) });

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieState = req.cookies.get("meta_oauth_state")?.value;
  if (!code) return back(req.url, { meta: "error", reason: "missing_code" });
  if (!state || !cookieState || state !== cookieState) {
    return back(req.url, { meta: "error", reason: "state_mismatch" });
  }

  try {
    const short = await exchangeCodeForToken(code);
    const long = await toLongLivedToken(short.access_token);
    const userTokenExpiresAt = long.expires_in
      ? new Date(Date.now() + long.expires_in * 1000).toISOString()
      : null;

    const { pages, adAccounts } = await discoverAssets(long.access_token);

    let stored = 0;
    for (const p of pages) {
      // Page token for a Page you admin does not expire → tokenExpiresAt null.
      const r = await upsertConnection({
        ownerClerkId: owner,
        kind: "facebook_page",
        externalId: p.id,
        name: p.name,
        accessToken: p.accessToken,
        tokenExpiresAt: null,
        meta: { category: p.category ?? null },
      });
      if (r.ok) stored++;

      if (p.instagram) {
        // IG publishing uses the linked Page token.
        const ig = await upsertConnection({
          ownerClerkId: owner,
          kind: "instagram",
          externalId: p.instagram.id,
          name: p.instagram.username ?? p.name,
          accessToken: p.accessToken,
          tokenExpiresAt: null,
          meta: { page_id: p.id, ig_user_id: p.instagram.id, username: p.instagram.username ?? null },
        });
        if (ig.ok) stored++;
      }
    }

    for (const a of adAccounts) {
      const r = await upsertConnection({
        ownerClerkId: owner,
        kind: "ad_account",
        externalId: a.id,
        name: a.name ?? a.id,
        accessToken: long.access_token,
        tokenExpiresAt: userTokenExpiresAt,
        meta: { account_id: a.accountId },
      });
      if (r.ok) stored++;
    }

    const res = back(req.url, {
      meta: "connected",
      assets: String(stored),
      pages: String(pages.length),
      ig: String(pages.filter((p) => p.instagram).length),
      ads: String(adAccounts.length),
    });
    res.cookies.delete("meta_oauth_state");
    return res;
  } catch (e) {
    return back(req.url, {
      meta: "error",
      reason: (e instanceof Error ? e.message : "exchange_failed").slice(0, 140),
    });
  }
}

/**
 * GET /api/v1/jarvis/angel/ig/callback
 *
 * Instagram redirects here with `?code=...&state=<brand>` after the operator
 * approves. We exchange the code for a long-lived IG user token, store it, and
 * bounce back to the Angel dashboard. This redirect URI must be registered
 * EXACTLY in the app's Instagram business-login settings.
 */
import { NextResponse } from "next/server";
import { getOwnerClerkId } from "@/lib/session";
import { exchangeCode, toLongLived, getIgProfile, IG_SCOPES } from "@/lib/jarvis/angel/ig-login";
import { saveIgAuth } from "@/lib/jarvis/angel/ig-store";
import { logAction } from "@/lib/jarvis/angel/store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  if (!(await getOwnerClerkId())) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }
  const url = new URL(req.url);
  const dest = new URL("/jarvis/angel", req.url);
  const brand = url.searchParams.get("state") || "jsupreme-marketing";
  const oauthErr = url.searchParams.get("error_description") || url.searchParams.get("error");
  const code = url.searchParams.get("code");

  if (oauthErr) {
    dest.searchParams.set("ig", "error");
    dest.searchParams.set("igmsg", oauthErr.slice(0, 160));
    return NextResponse.redirect(dest);
  }
  if (!code) {
    dest.searchParams.set("ig", "error");
    dest.searchParams.set("igmsg", "No authorization code returned by Instagram.");
    return NextResponse.redirect(dest);
  }

  try {
    const short = await exchangeCode(code);
    const long = await toLongLived(short.token);
    const profile = await getIgProfile(long.token);
    await saveIgAuth(brand, {
      token: long.token,
      igUserId: profile.userId ?? short.userId,
      igUsername: profile.username,
      expiresInSec: long.expiresIn,
      scopes: IG_SCOPES.join(","),
    });
    await logAction({
      brand,
      action: "ig_connected",
      detail: profile.username ?? profile.userId ?? "connected",
    });
    dest.searchParams.set("ig", "connected");
    return NextResponse.redirect(dest);
  } catch (e) {
    dest.searchParams.set("ig", "error");
    dest.searchParams.set("igmsg", (e instanceof Error ? e.message : "Connect failed").slice(0, 160));
    return NextResponse.redirect(dest);
  }
}

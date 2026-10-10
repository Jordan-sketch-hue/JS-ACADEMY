/**
 * GET /api/v1/marketing/tiktok/connect
 * Kicks off TikTok Login: mint a CSRF `state`, stash it in an httpOnly cookie, and
 * redirect the operator into TikTok's consent screen. Run once per brand account —
 * each run connects whichever TikTok account the operator signs into.
 */
import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { requireOwnerClerkId } from "@/lib/session";
import { buildAuthUrl } from "@/lib/marketing/tiktok/oauth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireOwnerClerkId();
  } catch {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const state = randomBytes(16).toString("hex");

  let url: string;
  try {
    url = buildAuthUrl(state);
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "TikTok is not configured." },
      { status: 500 },
    );
  }

  const res = NextResponse.redirect(url);
  res.cookies.set("tiktok_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  return res;
}

/**
 * GET /api/v1/marketing/meta/connect
 * Kicks off Facebook Login: mint a CSRF `state`, stash it in an httpOnly cookie,
 * and redirect the operator into Meta's OAuth dialog.
 */
import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { requireOwnerClerkId } from "@/lib/session";
import { buildLoginUrl } from "@/lib/marketing/meta/oauth";

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
    url = buildLoginUrl(state);
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Meta is not configured." },
      { status: 500 },
    );
  }

  const res = NextResponse.redirect(url);
  res.cookies.set("meta_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  return res;
}

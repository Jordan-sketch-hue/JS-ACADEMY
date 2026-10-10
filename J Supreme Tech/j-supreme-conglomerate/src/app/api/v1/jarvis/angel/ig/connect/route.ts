/**
 * GET /api/v1/jarvis/angel/ig/connect?brand=<slug>
 *
 * Operator-gated. Kicks off the Instagram Login flow by redirecting to the
 * Instagram OAuth consent screen. The dashboard's "Connect Instagram" button
 * links here.
 */
import { NextResponse } from "next/server";
import { getOwnerClerkId } from "@/lib/session";
import { buildAuthorizeUrl, isIgLoginConfigured } from "@/lib/jarvis/angel/ig-login";
import { angelBrands } from "@/lib/jarvis/angel/config";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  if (!(await getOwnerClerkId())) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }
  if (!isIgLoginConfigured()) {
    return NextResponse.json(
      { error: "Instagram Login isn't configured — set INSTAGRAM_APP_ID + INSTAGRAM_APP_SECRET." },
      { status: 501 },
    );
  }
  const brand =
    new URL(req.url).searchParams.get("brand") || angelBrands()[0]?.slug || "jsupreme-marketing";
  return NextResponse.redirect(buildAuthorizeUrl(brand));
}

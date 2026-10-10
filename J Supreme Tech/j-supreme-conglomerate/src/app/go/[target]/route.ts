import { NextResponse } from "next/server";
import { getExternalAccess } from "@/lib/conglomerate-backoffice/external-access";

export const dynamic = "force-dynamic";

/**
 * Server-side launcher for capability-key back offices. Keeps the secret key
 * out of the client bundle: the browser hits /go/ship2door and we 302 to the
 * fully-authenticated magic link. Operator-only (this app is auth-gated).
 */
const TARGETS: Record<string, keyof ReturnType<typeof getExternalAccess>> = {
  ship2door: "ship2doorMagicLink",
  "ship2door-portal": "ship2doorPortalLink",
};

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ target: string }> },
) {
  const { target } = await ctx.params;
  const key = TARGETS[target];
  if (!key) {
    return NextResponse.json({ error: `Unknown launcher: ${target}` }, { status: 404 });
  }
  return NextResponse.redirect(getExternalAccess()[key]);
}

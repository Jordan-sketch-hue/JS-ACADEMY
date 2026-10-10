import { NextResponse } from "next/server";
import { requireOwnerClerkId } from "@/lib/session";
import { getProjectEnvKeys } from "@/lib/vercel-portfolio/deployments";
import { checksSatisfiedByEnv } from "@/lib/jarvis/env-detect";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * GET /api/v1/vercel/env?project=<name>
 * Returns the env-var KEY names configured on a Vercel project (never values),
 * plus the checklist steps those keys auto-satisfy. Owner-gated.
 */
export async function GET(req: Request) {
  try {
    await requireOwnerClerkId();
    const project = new URL(req.url).searchParams.get("project")?.trim();
    if (!project) {
      return NextResponse.json({ error: "Missing ?project=" }, { status: 400 });
    }

    const result = await getProjectEnvKeys(project);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 502 });
    }

    return NextResponse.json({
      project,
      keys: result.keys,
      satisfies: checksSatisfiedByEnv(result.keys),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unauthorized";
    return NextResponse.json({ error: msg }, { status: msg === "Unauthorized" ? 401 : 500 });
  }
}

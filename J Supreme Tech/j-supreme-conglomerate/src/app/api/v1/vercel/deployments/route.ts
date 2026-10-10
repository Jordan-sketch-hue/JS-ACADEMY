import { NextResponse } from "next/server";
import { requireOwnerClerkId } from "@/lib/session";
import {
  listProductionDeployments,
  resolveVercelProject,
} from "@/lib/vercel-portfolio/deployments";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    await requireOwnerClerkId();
    const project = new URL(req.url).searchParams.get("project")?.trim();
    if (!project) {
      return NextResponse.json({ error: "Missing ?project=" }, { status: 400 });
    }

    const resolved = await resolveVercelProject(project);
    if (!resolved.ok) {
      return NextResponse.json({ error: resolved.error }, { status: 502 });
    }

    const list = await listProductionDeployments(resolved.project);
    if (!list.ok) {
      return NextResponse.json({ error: list.error }, { status: 502 });
    }

    return NextResponse.json({
      project: { id: resolved.project.id, name: resolved.project.name },
      deployments: list.deployments,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unauthorized";
    return NextResponse.json({ error: msg }, { status: msg === "Unauthorized" ? 401 : 500 });
  }
}

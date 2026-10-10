import { NextResponse } from "next/server";
import { requireOwnerClerkId } from "@/lib/session";
import {
  listProductionDeployments,
  resolveVercelProject,
  rollbackToDeployment,
} from "@/lib/vercel-portfolio/deployments";

export const dynamic = "force-dynamic";

/**
 * Revert a project's production to a previous deployment.
 *
 * Guard rails (because this points a LIVE site — possibly a client's — at an
 * older build): the caller must echo the exact project name in `confirm`, the
 * target must be a real READY production deployment, and it can't already be
 * the live one. Nothing here ever fires without an explicit, matching request.
 */
export async function POST(req: Request) {
  try {
    await requireOwnerClerkId();

    const body = (await req.json().catch(() => ({}))) as {
      project?: string;
      deploymentId?: string;
      confirm?: string;
    };
    const project = body.project?.trim();
    const deploymentId = body.deploymentId?.trim();

    if (!project || !deploymentId) {
      return NextResponse.json(
        { error: "Both `project` and `deploymentId` are required." },
        { status: 400 },
      );
    }
    if (body.confirm?.trim() !== project) {
      return NextResponse.json(
        { error: "Confirmation text must exactly match the project name." },
        { status: 400 },
      );
    }

    const resolved = await resolveVercelProject(project);
    if (!resolved.ok) {
      return NextResponse.json({ error: resolved.error }, { status: 502 });
    }

    const list = await listProductionDeployments(resolved.project);
    if (!list.ok) {
      return NextResponse.json({ error: list.error }, { status: 502 });
    }

    const target = list.deployments.find((d) => d.uid === deploymentId);
    if (!target) {
      return NextResponse.json(
        { error: "That deployment is not in the project's recent production history." },
        { status: 404 },
      );
    }
    if (target.state !== "READY") {
      return NextResponse.json(
        { error: `Cannot revert to a ${target.state} deployment — pick a READY one.` },
        { status: 409 },
      );
    }
    if (target.isCurrent) {
      return NextResponse.json(
        { error: "That deployment is already live." },
        { status: 409 },
      );
    }

    const result = await rollbackToDeployment(
      resolved.project.id,
      deploymentId,
      `Jarvis Workflow revert by operator`,
    );
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 502 });
    }

    return NextResponse.json({
      ok: true,
      message: `Production for ${resolved.project.name} is rolling back to ${deploymentId}.`,
      revertedTo: deploymentId,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unauthorized";
    return NextResponse.json({ error: msg }, { status: msg === "Unauthorized" ? 401 : 500 });
  }
}

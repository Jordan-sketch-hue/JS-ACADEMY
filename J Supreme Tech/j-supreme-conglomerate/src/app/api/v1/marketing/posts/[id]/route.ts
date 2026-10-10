/**
 * PATCH  /api/v1/marketing/posts/:id   — edit / reschedule / cancel a post
 * DELETE /api/v1/marketing/posts/:id   — remove a post
 */
import { NextResponse, type NextRequest } from "next/server";
import { requireOwnerClerkId } from "@/lib/session";
import { deletePost, updatePost, type PostPatch } from "@/lib/data/social-posts";
import type { SocialPostStatus } from "@/lib/marketing/meta/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const str = (v: unknown): string | undefined => (typeof v === "string" ? v : undefined);
/** Only these status transitions are user-settable; the cron owns publishing/posted/failed. */
const USER_STATUSES: SocialPostStatus[] = ["draft", "scheduled", "canceled"];

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  let owner: string;
  try {
    owner = await requireOwnerClerkId();
  } catch {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;

  const b = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!b) return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });

  const patch: PostPatch = {};
  if ("caption" in b) patch.caption = str(b.caption) ?? null;
  if ("mediaUrl" in b) patch.mediaUrl = str(b.mediaUrl) ?? null;
  if ("link" in b) patch.link = str(b.link) ?? null;
  if ("connectionId" in b) patch.connectionId = str(b.connectionId) ?? null;
  const sched = str(b.scheduledAt);
  if (sched && !Number.isNaN(Date.parse(sched))) patch.scheduledAt = new Date(sched).toISOString();
  const status = str(b.status) as SocialPostStatus | undefined;
  if (status && USER_STATUSES.includes(status)) patch.status = status;

  const r = await updatePost(id, owner, patch);
  if (!r.ok) return NextResponse.json(r, { status: 400 });
  return NextResponse.json(r);
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  let owner: string;
  try {
    owner = await requireOwnerClerkId();
  } catch {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const r = await deletePost(id, owner);
  if (!r.ok) return NextResponse.json(r, { status: 400 });
  return NextResponse.json(r);
}

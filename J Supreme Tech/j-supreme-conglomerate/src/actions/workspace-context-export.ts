"use server";

import { requireOwnerClerkId } from "@/lib/session";
import { buildWorkspaceContextMarkdown } from "@/lib/workspace/build-context-pack";

export async function fetchWorkspaceContextMarkdown(): Promise<
  { ok: true; markdown: string } | { ok: false; error: string }
> {
  try {
    const owner = await requireOwnerClerkId();
    const markdown = await buildWorkspaceContextMarkdown(owner);
    return { ok: true, markdown };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Could not build workspace export." };
  }
}

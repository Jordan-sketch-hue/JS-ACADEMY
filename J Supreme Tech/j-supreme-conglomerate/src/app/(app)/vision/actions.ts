"use server";

import { revalidatePath } from "next/cache";
import { requireOwnerClerkId } from "@/lib/session";
import {
  createVisionItem,
  deleteVisionItem,
  updateVisionItem,
} from "@/lib/data/vision";
import type { VisionInput, VisionPatch } from "@/lib/vision/types";

export async function createVisionAction(input: VisionInput) {
  const owner = await requireOwnerClerkId();
  const result = await createVisionItem(owner, input);
  if (!result.ok) return { ok: false as const, error: result.error };
  revalidatePath("/vision");
  return { ok: true as const, item: result.item };
}

export async function updateVisionAction(id: string, patch: VisionPatch) {
  const owner = await requireOwnerClerkId();
  const result = await updateVisionItem(owner, id, patch);
  if (!result.ok) return { ok: false as const, error: result.error };
  revalidatePath("/vision");
  return { ok: true as const, item: result.item };
}

export async function deleteVisionAction(id: string) {
  const owner = await requireOwnerClerkId();
  const result = await deleteVisionItem(owner, id);
  if (!result.ok) return { ok: false as const, error: result.error };
  revalidatePath("/vision");
  return { ok: true as const };
}

"use server";

import { revalidatePath } from "next/cache";
import { getServiceSupabase } from "@/lib/supabase/admin";
import { requireOwnerClerkId } from "@/lib/session";
import type { LyraNoteStatus } from "@/lib/data/lyra-notes";

export async function setLyraNoteStatus(id: string, status: LyraNoteStatus) {
  await requireOwnerClerkId();
  const sb = getServiceSupabase();
  if (!sb) return { error: "Supabase not configured" };

  const patch: Record<string, unknown> = {
    status,
    resolved_at: status === "resolved" ? new Date().toISOString() : null,
  };
  const { error } = await sb.from("lyra_notes").update(patch).eq("id", id);
  revalidatePath("/client-feedback");
  return error ? { error: error.message } : { ok: true };
}

export async function deleteLyraNote(id: string) {
  await requireOwnerClerkId();
  const sb = getServiceSupabase();
  if (!sb) return { error: "Supabase not configured" };
  const { error } = await sb.from("lyra_notes").delete().eq("id", id);
  revalidatePath("/client-feedback");
  return error ? { error: error.message } : { ok: true };
}

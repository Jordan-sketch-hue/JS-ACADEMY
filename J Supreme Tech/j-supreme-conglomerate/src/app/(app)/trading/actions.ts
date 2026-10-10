"use server";

import { revalidatePath } from "next/cache";
import { requireOwnerClerkId } from "@/lib/session";
import { updateTradeJournal } from "@/lib/data/trades";

export async function updateTradeJournalAction(
  tradeId: string,
  patch: {
    strategy_tag?: string | null;
    emotional_state?: string | null;
    journal_note?: string | null;
    session_label?: string | null;
  },
) {
  const owner = await requireOwnerClerkId();
  const result = await updateTradeJournal(owner, tradeId, patch);
  if (!result.ok) {
    return { ok: false as const, error: result.error };
  }
  revalidatePath("/trading");
  revalidatePath("/dashboard");
  return { ok: true as const };
}

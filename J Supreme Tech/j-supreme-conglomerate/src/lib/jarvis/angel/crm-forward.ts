/**
 * Angel — forward a qualified inbound into the conglomerate CRM, so a lead from
 * a DM lands in the same roster/pipeline as everything else. Tagged with the
 * app's data-owner id (same as the rest of the CRM) and deduped one-per-thread.
 */
import "server-only";
import { createCrmDeal } from "@/lib/data/crm";
import { resolveDataOwnerIdSync } from "@/lib/session";
import { logAction } from "./store";
import type { AngelThreadInput, AngelTriage } from "./types";

export async function forwardLeadToCrm(
  threadId: string,
  input: AngelThreadInput,
  triage: AngelTriage,
): Promise<string | null> {
  const owner = resolveDataOwnerIdSync();
  const channel = input.platform === "instagram" ? "Instagram DM" : "Facebook Messenger";
  const name =
    input.participantName ||
    (input.participantUsername ? `@${input.participantUsername}` : `${channel} lead`);

  try {
    const res = await createCrmDeal(owner, {
      business_name: name,
      contact_name: input.participantName ?? undefined,
      social_instagram:
        input.platform === "instagram" && input.participantUsername
          ? input.participantUsername
          : undefined,
      notes: `Auto-added by Angel from ${channel}. ${triage.summary || input.lastMessageText || ""}`.trim(),
      pipeline_tags: ["angel", "inbound", input.platform],
      follow_up_notes: triage.summary ?? undefined,
    });
    if (res.ok) {
      await logAction({
        threadUuid: threadId,
        brand: input.brand,
        action: "crm_forwarded",
        detail: res.lead.id,
      });
      return res.lead.id;
    }
    await logAction({
      threadUuid: threadId,
      brand: input.brand,
      action: "crm_forward_failed",
      detail: res.error,
    });
    return null;
  } catch (e) {
    await logAction({
      threadUuid: threadId,
      brand: input.brand,
      action: "crm_forward_failed",
      detail: e instanceof Error ? e.message : "error",
    });
    return null;
  }
}

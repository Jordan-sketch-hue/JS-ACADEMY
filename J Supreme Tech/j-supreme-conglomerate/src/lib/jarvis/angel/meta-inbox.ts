/**
 * Angel — pull conversations from a brand's inbox.
 *
 * Facebook Messenger: Facebook Graph + the Page token (pages_messaging).
 * Instagram DMs: the Instagram-Login path (graph.instagram.com + the IG user
 * token from OAuth) — no Page token, no phone "Connected Tools" toggle. If the
 * brand hasn't connected Instagram yet, IG is skipped with a note.
 */
import { graphGet } from "@/lib/marketing/meta/graph";
import { igGet } from "./ig-login";
import { getValidIgToken } from "./ig-store";
import type { AngelBrand } from "./config";
import type { AngelMessage, AngelPlatform, AngelThreadInput } from "./types";

type RawParticipant = { name?: string; username?: string; id?: string };
type RawMessage = {
  id: string;
  message?: string;
  created_time?: string;
  from?: { id?: string; name?: string; username?: string };
};
type RawConversation = {
  id: string;
  updated_time?: string;
  message_count?: number;
  participants?: { data?: RawParticipant[] };
  messages?: { data?: RawMessage[] };
};

const MSG_FIELDS = "messages.limit(15){id,message,created_time,from{id,name,username}}";
const FB_CONV_FIELDS = `id,updated_time,message_count,participants,${MSG_FIELDS}`;
// IG: the conversations LIST endpoint can't expand nested fields (errors), and
// most client DMs sit in the "requests" folder. So we list ids from both folders
// then fetch each conversation node individually with these fields. Plain `from`
// (no subfields) is what graph.instagram.com reliably returns (id + username).
const IG_MSG_FIELDS = "messages.limit(15){id,message,created_time,from}";
const IG_DETAIL_FIELDS = `id,updated_time,participants,${IG_MSG_FIELDS}`;

export type FetchResult = {
  threads: AngelThreadInput[];
  igPermissionOk: boolean;
  notes: string[];
};

function pickClient(participants: RawParticipant[] | undefined, selfId: string): RawParticipant | null {
  if (!participants) return null;
  return participants.find((p) => p.id && p.id !== selfId) ?? null;
}

/** `selfId` is the page id (FB) or the IG user id (IG) — used to tell our own messages apart. */
function mapConversation(
  conv: RawConversation,
  brand: AngelBrand,
  platform: AngelPlatform,
  selfId: string,
): AngelThreadInput {
  const client = pickClient(conv.participants?.data, selfId);
  const chrono = [...(conv.messages?.data ?? [])].reverse();
  const messages: AngelMessage[] = chrono.map((m) => {
    const fromClient = !!m.from?.id && m.from.id !== selfId;
    return {
      messageId: m.id,
      fromId: m.from?.id ?? null,
      fromName: m.from?.name ?? m.from?.username ?? null,
      fromClient,
      body: m.message ?? "",
      createdTime: m.created_time ?? null,
    };
  });
  const last = chrono[chrono.length - 1];
  const lastFromClient = !!last?.from?.id && last.from.id !== selfId;
  return {
    brand: brand.slug,
    platform,
    threadId: conv.id,
    pageId: brand.pageId,
    participantId: client?.id ?? null,
    participantName: client?.name ?? client?.username ?? null,
    participantUsername: client?.username ?? null,
    lastMessageText: last?.message ?? "",
    lastMessageAt: conv.updated_time ?? last?.created_time ?? null,
    lastMessageFromClient: lastFromClient,
    messageCount: conv.message_count ?? messages.length,
    messages,
  };
}

export async function fetchBrandInbox(brand: AngelBrand, limit = 25): Promise<FetchResult> {
  const notes: string[] = [];
  const threads: AngelThreadInput[] = [];

  // Facebook Messenger — Page token, Facebook Graph.
  try {
    const fb = await graphGet<{ data?: RawConversation[] }>(`${brand.pageId}/conversations`, brand.pageToken, {
      fields: FB_CONV_FIELDS,
      limit,
    });
    for (const c of fb.data ?? []) threads.push(mapConversation(c, brand, "facebook", brand.pageId));
  } catch (e) {
    notes.push(`facebook: ${e instanceof Error ? e.message : "error"}`);
  }

  // Instagram DMs — Instagram-Login token, graph.instagram.com. Two-step:
  // (1) collect conversation ids from BOTH the primary and "requests" folders
  // (new-lead DMs almost always land in requests), (2) fetch each conversation
  // node individually for participants + messages.
  let igPermissionOk = false;
  try {
    const igAuth = await getValidIgToken(brand.slug);
    if (!igAuth) {
      notes.push("instagram: not connected — open Angel and click Connect Instagram");
    } else {
      const ids = new Set<string>();
      for (const folder of [undefined, "requests"] as const) {
        try {
          const params: Record<string, string | number> = {
            platform: "instagram",
            fields: "id,updated_time",
            limit,
          };
          if (folder) params.folder = folder;
          const list = await igGet<{ data?: { id: string }[] }>(
            "me/conversations",
            igAuth.token,
            params,
          );
          for (const c of list.data ?? []) if (c.id) ids.add(c.id);
        } catch {
          // a folder may be unsupported or empty — keep going
        }
      }
      const selfId = igAuth.igUserId ?? "";
      for (const id of [...ids].slice(0, limit)) {
        try {
          const conv = await igGet<RawConversation>(id, igAuth.token, { fields: IG_DETAIL_FIELDS });
          threads.push(mapConversation(conv, brand, "instagram", selfId));
        } catch {
          // skip a conversation we can't read
        }
      }
      igPermissionOk = true;
    }
  } catch (e) {
    notes.push(`instagram: ${e instanceof Error ? e.message : "error"}`);
  }

  return { threads, igPermissionOk, notes };
}

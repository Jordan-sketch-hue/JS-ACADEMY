import "server-only";
import { getServiceSupabase } from "@/lib/supabase/admin";
import type { SalesMessage } from "@/lib/sales/types";

export async function insertMessage(
  owner: string,
  m: Partial<SalesMessage> & { direction: "inbound" | "outbound" },
): Promise<string | null> {
  const sb = getServiceSupabase();
  if (!sb) return null;
  const { data } = await sb
    .from("sales_messages")
    .insert({
      owner_clerk_id: owner,
      prospect_id: m.prospect_id ?? null,
      email_id: m.email_id ?? null,
      thread_id: m.thread_id ?? (m.from_email ?? m.to_email ?? "").toLowerCase(),
      direction: m.direction,
      from_email: m.from_email ?? null,
      to_email: m.to_email ?? null,
      subject: m.subject ?? null,
      snippet: m.snippet ?? (m.text ?? "").slice(0, 240),
      html: m.html ?? null,
      text: m.text ?? null,
      resend_inbound_id: m.resend_inbound_id ?? null,
      read: m.direction === "outbound",
    })
    .select("id")
    .maybeSingle();
  return (data as { id: string } | null)?.id ?? null;
}

export type InboxThread = {
  thread_id: string;
  prospect_id: string | null;
  counterparty: string;
  subject: string;
  last_snippet: string;
  last_at: string;
  unread: number;
  messages: SalesMessage[];
};

/** Group messages into conversation threads, newest activity first. */
export async function listInboxThreads(
  owner: string,
  limit = 300,
): Promise<InboxThread[]> {
  const sb = getServiceSupabase();
  if (!sb) return [];
  const { data } = await sb
    .from("sales_messages")
    .select("*")
    .eq("owner_clerk_id", owner)
    .order("created_at", { ascending: true })
    .limit(limit);
  const msgs = (data ?? []) as SalesMessage[];

  const byThread = new Map<string, SalesMessage[]>();
  for (const m of msgs) {
    const key = m.thread_id || (m.from_email ?? m.to_email ?? m.id);
    if (!byThread.has(key)) byThread.set(key, []);
    byThread.get(key)!.push(m);
  }

  const threads: InboxThread[] = [];
  for (const [thread_id, list] of byThread) {
    const last = list[list.length - 1];
    const inbound = list.find((m) => m.direction === "inbound");
    threads.push({
      thread_id,
      prospect_id: list.find((m) => m.prospect_id)?.prospect_id ?? null,
      counterparty:
        inbound?.from_email || last.to_email || last.from_email || thread_id,
      subject: list.find((m) => m.subject)?.subject || "(no subject)",
      last_snippet: last.snippet || "",
      last_at: last.created_at,
      unread: list.filter((m) => m.direction === "inbound" && !m.read).length,
      messages: list,
    });
  }
  threads.sort((a, b) => (a.last_at < b.last_at ? 1 : -1));
  return threads;
}

export async function markThreadRead(owner: string, threadId: string): Promise<void> {
  const sb = getServiceSupabase();
  if (!sb) return;
  await sb
    .from("sales_messages")
    .update({ read: true })
    .eq("owner_clerk_id", owner)
    .eq("thread_id", threadId)
    .eq("direction", "inbound");
}

export async function unreadCount(owner: string): Promise<number> {
  const sb = getServiceSupabase();
  if (!sb) return 0;
  const { count } = await sb
    .from("sales_messages")
    .select("id", { count: "exact", head: true })
    .eq("owner_clerk_id", owner)
    .eq("direction", "inbound")
    .eq("read", false);
  return count ?? 0;
}

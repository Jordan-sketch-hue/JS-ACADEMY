import "server-only";
import { getServiceSupabase } from "@/lib/supabase/admin";
import type { EmailStatus, SalesEmail } from "@/lib/sales/types";

export type NewSalesEmail = {
  prospect_id: string | null;
  campaign_id?: string | null;
  template_id?: string | null;
  step?: number;
  thread_id?: string | null;
  to_email: string;
  from_email: string;
  reply_to?: string | null;
  subject: string;
  html: string;
  text: string;
  status?: EmailStatus;
  unsubscribe_token?: string | null;
  scheduled_for?: string | null;
};

export async function insertEmail(
  owner: string,
  e: NewSalesEmail,
): Promise<string | null> {
  const sb = getServiceSupabase();
  if (!sb) return null;
  const { data, error } = await sb
    .from("sales_emails")
    .insert({
      owner_clerk_id: owner,
      prospect_id: e.prospect_id,
      campaign_id: e.campaign_id ?? null,
      template_id: e.template_id ?? null,
      step: e.step ?? 1,
      direction: "outbound",
      thread_id: e.thread_id ?? e.to_email.toLowerCase(),
      to_email: e.to_email.toLowerCase(),
      from_email: e.from_email,
      reply_to: e.reply_to ?? null,
      subject: e.subject,
      html: e.html,
      text: e.text,
      status: e.status ?? "queued",
      unsubscribe_token: e.unsubscribe_token ?? null,
      scheduled_for: e.scheduled_for ?? null,
    })
    .select("id")
    .single();
  if (error) return null;
  return (data as { id: string }).id;
}

export async function markEmail(
  id: string,
  patch: Partial<SalesEmail>,
): Promise<void> {
  const sb = getServiceSupabase();
  if (!sb) return;
  await sb
    .from("sales_emails")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id);
}

/** Outbound emails actually sent since UTC midnight (the throttle denominator). */
export async function sentTodayCount(owner: string): Promise<number> {
  const sb = getServiceSupabase();
  if (!sb) return 0;
  const since = new Date();
  since.setUTCHours(0, 0, 0, 0);
  const { count } = await sb
    .from("sales_emails")
    .select("id", { count: "exact", head: true })
    .eq("owner_clerk_id", owner)
    .eq("direction", "outbound")
    .in("status", ["sent", "delivered", "opened", "clicked"])
    .gte("sent_at", since.toISOString());
  return count ?? 0;
}

export async function listEmails(
  owner: string,
  limit = 100,
): Promise<SalesEmail[]> {
  const sb = getServiceSupabase();
  if (!sb) return [];
  const { data } = await sb
    .from("sales_emails")
    .select("*")
    .eq("owner_clerk_id", owner)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as SalesEmail[];
}

export async function findEmailByResendId(
  resendId: string,
): Promise<SalesEmail | null> {
  const sb = getServiceSupabase();
  if (!sb) return null;
  const { data } = await sb
    .from("sales_emails")
    .select("*")
    .eq("resend_id", resendId)
    .maybeSingle();
  return (data as SalesEmail) ?? null;
}

/** Latest outbound email to an address — used to thread inbound replies. */
export async function findLatestEmailTo(
  toEmail: string,
): Promise<SalesEmail | null> {
  const sb = getServiceSupabase();
  if (!sb) return null;
  const { data } = await sb
    .from("sales_emails")
    .select("*")
    .eq("to_email", toEmail.toLowerCase())
    .eq("direction", "outbound")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data as SalesEmail) ?? null;
}

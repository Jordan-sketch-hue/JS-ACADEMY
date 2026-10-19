"use server";

import { requireOwnerClerkId } from "@/lib/session";

export interface SmsLogRow {
  id: number;
  to_number: string;
  body: string;
  telnyx_id: string | null;
  ok: boolean;
  error: string | null;
  sent_at: string;
}

export async function fetchSmsLogs(limit = 100): Promise<SmsLogRow[]> {
  await requireOwnerClerkId();

  const botUrl = process.env.SALES_BOT_URL ?? "https://ample-exploration-production-ef51.up.railway.app";
  const adminKey = process.env.SALES_BOT_ADMIN_KEY ?? "jst-sales-bot-2026";

  try {
    const res = await fetch(`${botUrl}/sms-logs?limit=${limit}`, {
      headers: { "x-admin-key": adminKey },
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("[sms] fetchSmsLogs bot error:", res.status);
      return [];
    }
    const data = await res.json() as { sms: SmsLogRow[] };
    return data.sms ?? [];
  } catch (e: any) {
    console.error("[sms] fetchSmsLogs error:", e.message);
    return [];
  }
}
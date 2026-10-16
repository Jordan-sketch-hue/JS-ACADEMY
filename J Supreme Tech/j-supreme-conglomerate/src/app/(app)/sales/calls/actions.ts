"use server";

import { requireOwnerClerkId } from "@/lib/session";
import { sendSalesEmail } from "@/lib/sales/send";

export interface CallLogRow {
  id: string;
  call_sid: string;
  to_number: string;
  lead_name: string | null;
  lead_business: string | null;
  duration_seconds: number;
  outcome: string;
  transcript: string | null;
  booked_followup: boolean;
  notes: string | null;
  created_at: string;
}

export interface CallSummary {
  wants: string;
  pain_points: string;
  sentiment: "positive" | "neutral" | "negative" | "no_answer";
  next_action: string;
  follow_up_draft: string;
}

export async function fetchCallLogs(limit = 100): Promise<CallLogRow[]> {
  await requireOwnerClerkId();

  const botUrl = process.env.SALES_BOT_URL ?? "https://ample-exploration-production-ef51.up.railway.app";
  const adminKey = process.env.SALES_BOT_ADMIN_KEY ?? "jst-sales-bot-2026";

  try {
    const res = await fetch(`${botUrl}/call-logs?limit=${limit}`, {
      headers: { "x-admin-key": adminKey },
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("[calls] fetchCallLogs bot error:", res.status);
      return [];
    }
    const data = await res.json() as CallLogRow[];
    return data;
  } catch (e: any) {
    console.error("[calls] fetchCallLogs error:", e.message);
    return [];
  }
}

export async function summarizeCall(log: CallLogRow): Promise<CallSummary> {
  await requireOwnerClerkId();

  if (!log.transcript || log.outcome !== "answered") {
    return {
      wants: "N/A â€” call not answered",
      pain_points: "N/A",
      sentiment: "no_answer",
      next_action: log.notes ?? "Schedule another call attempt",
      follow_up_draft: buildFollowUpDraft(log, null),
    };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      wants: "No ANTHROPIC_API_KEY set",
      pain_points: "N/A",
      sentiment: "neutral",
      next_action: log.notes ?? "Follow up",
      follow_up_draft: buildFollowUpDraft(log, null),
    };
  }

  const prompt = `You are a sales manager reviewing a call transcript made by Kai, an AI agent for J Supreme Tech.

Name: ${log.lead_name ?? "Unknown"}
Business: ${log.lead_business ?? "Unknown"}
Duration: ${log.duration_seconds}s
Outcome: ${log.outcome}
Booked follow-up: ${log.booked_followup}

TRANSCRIPT:
${log.transcript}

Respond with ONLY valid JSON (no markdown, no extra text):
{
  "wants": "one sentence on what the prospect wants or needs",
  "pain_points": "one sentence on their pain points or objections",
  "sentiment": "positive|neutral|negative",
  "next_action": "specific recommended next action for the sales agent",
  "follow_up_draft": "a short, professional WhatsApp/text follow-up message from Kai at J Supreme Tech. 2-3 sentences max. No emoji unless natural. Reference what was discussed."
}`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 512,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) throw new Error(`Anthropic ${res.status}`);
    const json = await res.json() as { content: Array<{ type: string; text: string }> };
    const text = json.content[0]?.type === "text" ? json.content[0].text : "";
    const parsed = JSON.parse(text) as CallSummary;
    return parsed;
  } catch (e: any) {
    console.error("[calls] summarizeCall error:", e.message);
    return {
      wants: "Summary unavailable â€” check server logs",
      pain_points: "Summary unavailable",
      sentiment: "neutral",
      next_action: log.notes ?? "Follow up manually",
      follow_up_draft: buildFollowUpDraft(log, null),
    };
  }
}

function buildFollowUpDraft(log: CallLogRow, _summary: CallSummary | null): string {
  const co = log.lead_business ?? log.lead_name ?? "your business";
  if (log.outcome !== "answered") {
    return `Hi, this is Kai from J Supreme Tech. I tried reaching ${co} earlier but missed you. We help Jamaican businesses get professional websites and digital marketing. Would love 5 minutes to chat â€” when is a good time?`;
  }
  return `Hi, it was great speaking with someone from ${co}. This is Kai from J Supreme Tech following up on our conversation. Looking forward to helping you move forward â€” just reply here or give us a call.`;
}

export async function sendFollowUpEmail(
  _callId: string,
  toEmail: string,
  subject: string,
  body: string
): Promise<{ ok: boolean; error?: string }> {
  await requireOwnerClerkId();

  const result = await sendSalesEmail({
    from: "hello@go.jsupremetech.online",
    fromName: "Kai Â· J Supreme Tech",
    to: toEmail,
    subject,
    html: `<p style="font-family:sans-serif;line-height:1.6">${body.replace(/\n/g, "<br/>")}</p>`,
    text: body,
    replyTo: "jordanmorrisr@gmail.com",
    bcc: "jordanmorrisr@gmail.com",
  });

  if (!result.ok) return { ok: false, error: result.error };
  return { ok: true };
}


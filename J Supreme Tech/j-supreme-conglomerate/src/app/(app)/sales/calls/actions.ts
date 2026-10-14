"use server";

import { requireOwnerClerkId } from "@/lib/session";
import { getServiceSupabase } from "@/lib/supabase/admin";
import { sendSalesEmail } from "@/lib/sales/send";

export interface CallLogRow {
  id: number;
  call_sid: string;
  to_number: string;
  company_name: string | null;
  industry: string | null;
  duration_seconds: number;
  outcome: "answered" | "no_answer" | "busy" | "failed" | "error";
  transcript: string | null;
  booked_followup: boolean;
  stage_reached: string | null;
  scores: Record<string, number> | null;
  mockup_requested: boolean;
  mockup_wa_number: string | null;
  next_action: string | null;
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
  const sb = getServiceSupabase();
  if (!sb) return [];

  const { data, error } = await sb
    .from("call_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[calls] fetchCallLogs error:", error.message);
    return [];
  }
  return (data ?? []) as CallLogRow[];
}

export async function summarizeCall(log: CallLogRow): Promise<CallSummary> {
  await requireOwnerClerkId();

  if (!log.transcript || log.outcome !== "answered") {
    return {
      wants: "N/A — call not answered",
      pain_points: "N/A",
      sentiment: "no_answer",
      next_action: log.next_action ?? "Schedule another call attempt",
      follow_up_draft: buildFollowUpDraft(log, null),
    };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      wants: "No ANTHROPIC_API_KEY set",
      pain_points: "N/A",
      sentiment: "neutral",
      next_action: log.next_action ?? "Follow up",
      follow_up_draft: buildFollowUpDraft(log, null),
    };
  }

  const prompt = `You are a sales manager reviewing a call transcript made by Alex, an AI agent for J Supreme Tech.

Company: ${log.company_name ?? "Unknown"}
Industry: ${log.industry ?? "Unknown"}
Duration: ${log.duration_seconds}s
Stage reached: ${log.stage_reached ?? "unknown"}
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
  "follow_up_draft": "a short, professional WhatsApp/text follow-up message from Alex at J Supreme Tech. 2-3 sentences max. No emoji unless natural. Reference what was discussed."
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
      wants: "Summary unavailable — check server logs",
      pain_points: "Summary unavailable",
      sentiment: "neutral",
      next_action: log.next_action ?? "Follow up manually",
      follow_up_draft: buildFollowUpDraft(log, null),
    };
  }
}

function buildFollowUpDraft(log: CallLogRow, _summary: CallSummary | null): string {
  const co = log.company_name ?? "your business";
  if (log.outcome !== "answered") {
    return `Hi, this is Alex from J Supreme Tech. I tried reaching ${co} earlier but missed you. We help Jamaican businesses get professional websites and digital marketing. Would love 5 minutes to chat — when is a good time?`;
  }
  return `Hi, it was great speaking with someone from ${co}. This is Alex from J Supreme Tech following up on our conversation. Looking forward to helping you move forward — just reply here or give us a call.`;
}

export async function sendFollowUpEmail(
  _callId: number,
  toEmail: string,
  subject: string,
  body: string
): Promise<{ ok: boolean; error?: string }> {
  await requireOwnerClerkId();

  const result = await sendSalesEmail({
    from: "hello@go.jsupremetech.online",
    fromName: "Alex · J Supreme Tech",
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

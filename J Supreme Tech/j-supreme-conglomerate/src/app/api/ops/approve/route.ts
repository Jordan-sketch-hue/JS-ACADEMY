/**
 * GET /api/ops/approve?t=<ticketId>.<action>.<sig>
 *
 * The one-click gate for the Client Ops Autopilot approval emails. Clicked from
 * Jordan's inbox (phone or desktop), so there is NO Clerk session — auth is the
 * HMAC-signed token, which only the worker (holding APPROVAL_SECRET) can mint.
 *
 *   approve → ticket state = approved   (worker's executor pass then ships it)
 *   reject  → ticket state = rejected
 *   edit    → left awaiting_approval, flagged so Jordan can revise the draft
 *
 * Mirrors src/approve.mjs signToken() in the autopilot repo. Keep APPROVAL_SECRET
 * identical on both sides.
 */
import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { getServiceSupabase } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ACTIONS = ["approve", "reject", "edit"] as const;
type Action = (typeof ACTIONS)[number];

function expectedSig(ticketId: string, action: string): string {
  const secret = process.env.APPROVAL_SECRET || "dev";
  return createHmac("sha256", secret).update(`${ticketId}:${action}`).digest("hex").slice(0, 16);
}

function validToken(t: string): { ticketId: string; action: Action } | null {
  const parts = t.split(".");
  if (parts.length !== 3) return null;
  const [ticketId, action, sig] = parts;
  if (!ACTIONS.includes(action as Action)) return null;
  const want = expectedSig(ticketId, action);
  try {
    if (sig.length !== want.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(want))) return null;
  } catch {
    return null;
  }
  return { ticketId, action: action as Action };
}

function page(title: string, body: string, color = "#1a7f37"): Response {
  const html = `<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:480px;margin:12vh auto;padding:0 24px;text-align:center;color:#222;">
    <div style="font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#888;">J Supreme · Client Ops</div>
    <h1 style="font-size:26px;color:${color};margin:10px 0 8px;">${title}</h1>
    <p style="font-size:15px;color:#555;line-height:1.6;">${body}</p>
  </div>`;
  return new NextResponse(html, { headers: { "content-type": "text/html; charset=utf-8" } });
}

async function handle(t: string | null): Promise<Response> {
  if (!t) return page("Missing token", "This link is incomplete.", "#c0392b");
  const parsed = validToken(t);
  if (!parsed) return page("Invalid or expired link", "That approval link couldn't be verified.", "#c0392b");

  const supabase = getServiceSupabase();
  if (!supabase) return page("Not configured", "Supabase service client unavailable.", "#c0392b");

  const { ticketId, action } = parsed;
  const { data: ticket } = await supabase
    .from("ops_tickets").select("id,client_name,summary,state,gate").eq("id", ticketId).maybeSingle();
  if (!ticket) return page("Ticket not found", "It may have already been resolved.", "#c0392b");

  // Safety core: scam / payment tickets are quarantined and must NEVER be
  // actioned from a link, even with a valid token. Alert only — handle personally.
  if (ticket.gate === "blocked" || ticket.state === "quarantined") {
    return page("Held for you", `This item for <b>${ticket.client_name || "this client"}</b> was quarantined (scam / payment) and can't be actioned from a link. Handle it personally.`, "#c0392b");
  }

  if (["approved", "rejected", "done"].includes(ticket.state)) {
    return page("Already decided", `This ticket is already <b>${ticket.state}</b>.`, "#888");
  }

  const newState = action === "approve" ? "approved" : action === "reject" ? "rejected" : "awaiting_approval";
  await supabase.from("ops_tickets")
    .update({ state: newState, last_note: action === "edit" ? "Edit requested by operator" : null, updated_at: new Date().toISOString() })
    .eq("id", ticketId);
  await supabase.from("ops_approvals").upsert(
    { token: t, ticket_id: ticketId, action, decided_at: new Date().toISOString(), decided_by: "email-link" },
    { onConflict: "token" },
  );
  await supabase.from("ops_actions").insert({ ticket_id: ticketId, kind: action === "approve" ? "approved" : action === "reject" ? "rejected" : "edit", detail: ticket.summary, actor: "operator" });

  const who = ticket.client_name || "client";
  if (action === "approve") return page("Approved ✓", `The autopilot will action <b>${who}</b> and follow up. You'll see it in the next digest.`);
  if (action === "reject") return page("Rejected", `Nothing will be sent to <b>${who}</b>. The ticket is closed.`, "#c0392b");
  return page("Marked for edit", `Reply to the digest with your changes for <b>${who}</b>, or edit it in the ops board.`, "#b9770e");
}

export async function GET(req: Request) {
  const t = new URL(req.url).searchParams.get("t");
  return handle(t);
}

export async function POST(req: Request) {
  let t: string | null = null;
  try { t = (await req.json())?.t ?? null; } catch { /* ignore */ }
  return handle(t);
}

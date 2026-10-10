import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getServiceSupabase } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { ticketId, action } = await req.json();
  if (!ticketId || !["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const sb = getServiceSupabase();
  if (!sb) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });

  const newState = action === "approve" ? "approved" : "rejected";

  const { error } = await sb
    .from("ops_tickets")
    .update({ state: newState, updated_at: new Date().toISOString() })
    .eq("id", ticketId)
    .in("state", ["triaged", "awaiting_approval"]);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await sb.from("ops_approvals").insert({
    ticket_id: ticketId,
    action,
    actor: userId,
    channel: "pwa",
    created_at: new Date().toISOString(),
  }).throwOnError().catch(() => null);

  return NextResponse.json({ ok: true, state: newState });
}

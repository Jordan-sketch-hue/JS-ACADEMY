import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getServiceSupabase } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sb = getServiceSupabase();
  if (!sb) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });

  const { data, error } = await sb
    .from("ops_tickets")
    .select("id,source,client_name,contact,channel,category,priority,summary,body_text,action_needed,draft_body,state,gate,is_scam,sla_hours,due_at,last_note,created_at,updated_at")
    .in("state", ["triaged", "awaiting_approval", "approved"])
    .order("due_at", { ascending: true })
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ tickets: data ?? [] });
}

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: NextRequest) {
  const { clientId, title, assignedTo, dueAt } = await req.json();
  if (!clientId || !title) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const { data, error } = await sb.from("ct_tasks").insert({ client_id: clientId, title, assigned_to: assignedTo ?? null, due_at: dueAt ?? null, status: "todo" }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, data });
}

export async function PATCH(req: NextRequest) {
  const { id, status, title, assignedTo, dueAt } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const updates: Record<string, unknown> = {};
  if (status !== undefined) updates.status = status;
  if (title !== undefined) updates.title = title;
  if (assignedTo !== undefined) updates.assigned_to = assignedTo;
  if (dueAt !== undefined) updates.due_at = dueAt;
  const { data, error } = await sb.from("ct_tasks").update(updates).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, data });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const { error } = await sb.from("ct_tasks").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getServiceSupabase } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const subscription = await req.json();
  if (!subscription?.endpoint)
    return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });

  const sb = getServiceSupabase();
  if (!sb)
    return NextResponse.json({ error: "DB unavailable" }, { status: 503 });

  const { error } = await sb.from("push_subscriptions").upsert(
    {
      user_id: userId,
      endpoint: subscription.endpoint,
      subscription,
      active: true,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "endpoint" }
  );

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { endpoint } = await req.json();
  const sb = getServiceSupabase();
  if (!sb) return NextResponse.json({ ok: true });
  await sb
    .from("push_subscriptions")
    .update({ active: false })
    .eq("endpoint", endpoint);
  return NextResponse.json({ ok: true });
}

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key || url.includes("placeholder")) {
    return NextResponse.json({ error: "auth_not_configured" }, { status: 503 });
  }

  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(url, key);
  const { error } = await supabase.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://big-island-traders.vercel.app"}/account` },
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

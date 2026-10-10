import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type Level = "nominal" | "degraded" | "offline";

/**
 * Lightweight health for UI — booleans only, no secrets.
 */
export async function GET() {
  const openai = !!process.env.OPENAI_API_KEY?.trim();
  const supabase =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
    !!(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || process.env.SUPABASE_SECRET_KEY?.trim());
  const publishable = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim() ?? "";
  const clerkSecret = process.env.CLERK_SECRET_KEY?.trim() ?? "";
  const clerk = !!publishable && !!clerkSecret;

  let level: Level = "offline";
  if (openai && supabase) level = "nominal";
  else if (openai || supabase) level = "degraded";

  return NextResponse.json(
    {
      level,
      checks: {
        openai_chat: openai,
        supabase: supabase,
        clerk: clerk,
      },
      generated_at: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}

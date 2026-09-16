import { NextResponse } from "next/server";

// Proxy Resend Broadcasts for the public newsletter archive on jsupremetech.online/blog
// The RESEND_API_KEY here has access to the broadcasts sent from this project.
export const revalidate = 3600;

export async function GET() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return NextResponse.json({ data: [] });

  try {
    const res = await fetch("https://api.resend.com/broadcasts", {
      headers: { Authorization: `Bearer ${key}` },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return NextResponse.json({ data: [] });
    const json = await res.json();
    return NextResponse.json(json, {
      headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate=600" },
    });
  } catch {
    return NextResponse.json({ data: [] });
  }
}
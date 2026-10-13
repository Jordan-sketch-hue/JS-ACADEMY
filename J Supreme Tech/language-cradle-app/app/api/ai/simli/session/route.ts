export const runtime = "edge";

import { NextResponse } from "next/server";

const SIMLI_API_KEY = process.env.SIMLI_API_KEY ?? "";
const HAS_SIMLI = !!SIMLI_API_KEY && !SIMLI_API_KEY.includes("placeholder");

export async function POST(req: Request) {
  // Require a Supabase session cookie (edge-compatible auth guard)
  const cookie = req.headers.get("cookie") ?? "";
  const hasSession = cookie.includes("sb-") && cookie.includes("-auth-token");
  if (!hasSession) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  if (!HAS_SIMLI) {
    return NextResponse.json({ error: "Simli not configured", fallback: true }, { status: 503 });
  }

  const body = (await req.json().catch(() => ({}))) as {
    face_id?: string;
    gender?: "male" | "female";
  };

  const faceId = body.face_id ?? (body.gender === "male"
    ? "804c347a-26c9-4dcf-bb49-13df4bed61e8"
    : "d2a5c7c6-fed9-4f55-bcb3-062f7cd20103");

  try {
    const res = await fetch("https://api.simli.ai/compose/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-simli-api-key": SIMLI_API_KEY,
      },
      body: JSON.stringify({
        faceId,
        apiVersion: "v2",
        handleSilence: true,
        audioInputFormat: "pcm16",
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return NextResponse.json(
        { error: `Simli ${res.status}`, detail: detail.slice(0, 200), fallback: true },
        { status: 502 },
      );
    }

    const data = (await res.json()) as { session_token?: string };
    if (!data.session_token) {
      return NextResponse.json({ error: "No session token", fallback: true }, { status: 502 });
    }

    return NextResponse.json({ session_token: data.session_token });
  } catch (err) {
    console.error("[simli/session]", err);
    return NextResponse.json({ error: "Upstream error", fallback: true }, { status: 502 });
  }
}

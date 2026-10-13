export const runtime = "edge";

import { NextResponse } from "next/server";

const SIMLI_API_KEY = process.env.SIMLI_API_KEY ?? "";
const HAS_SIMLI = !!SIMLI_API_KEY && !SIMLI_API_KEY.includes("placeholder");

export async function POST(req: Request) {
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
    // Fetch session token and ICE servers in parallel
    const [tokenRes, iceRes] = await Promise.all([
      fetch("https://api.simli.ai/compose/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-simli-api-key": SIMLI_API_KEY,
        },
        body: JSON.stringify({ faceId, handleSilence: true }),
      }),
      fetch("https://api.simli.ai/compose/ice", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-simli-api-key": SIMLI_API_KEY,
        },
      }),
    ]);

    if (!tokenRes.ok) {
      const detail = await tokenRes.text().catch(() => "");
      return NextResponse.json(
        { error: `Simli ${tokenRes.status}`, detail: detail.slice(0, 200), fallback: true },
        { status: 502 },
      );
    }

    const tokenData = (await tokenRes.json()) as { session_token?: string; error?: string };
    if (!tokenData.session_token) {
      return NextResponse.json(
        { error: tokenData.error ?? "No session token", fallback: true },
        { status: 502 },
      );
    }

    // ICE servers are best-effort — fall back to Google STUN if unavailable
    let iceServers: RTCIceServer[] = [{ urls: "stun:stun.l.google.com:19302" }];
    if (iceRes.ok) {
      const iceData = await iceRes.json().catch(() => null);
      if (Array.isArray(iceData) && iceData.length > 0) {
        iceServers = iceData;
      }
    }

    return NextResponse.json({
      session_token: tokenData.session_token,
      ice_servers: iceServers,
    });
  } catch (err) {
    console.error("[simli/session]", err);
    return NextResponse.json({ error: "Upstream error", fallback: true }, { status: 502 });
  }
}

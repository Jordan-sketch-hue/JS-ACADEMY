import { NextResponse } from "next/server";
import { getOwnerClerkId } from "@/lib/session";

const THINK_SYSTEM = `You are Think Bot — a structured reasoning partner for Jordan Morris, founder of J Supreme.

Your role: Help Jordan think through decisions, ideas, strategies, and problems with rigour.

For every session:
1. **Clarify** — restate the core question/problem in one crisp sentence.
2. **Break it down** — identify 3–5 key factors, trade-offs, or unknowns.
3. **Reason** — think through each factor honestly; surface hidden assumptions.
4. **Recommend** — give a clear directional answer with your confidence level.
5. **Red-team** — list 1–2 ways your recommendation could be wrong.

Tone: Sharp, direct, no fluff. You're a trusted advisor who doesn't sugarcoat.
Format: Use headers and bullets to keep reasoning scannable. Keep responses under 600 words unless Jordan asks for depth.`;

type IncomingMsg = { role?: string; content?: string };

export async function POST(req: Request) {
  const owner = await getOwnerClerkId();
  if (!owner) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) {
    return NextResponse.json({ error: "OPENAI_API_KEY not configured." }, { status: 501 });
  }

  let body: { messages?: IncomingMsg[] };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const raw = Array.isArray(body.messages) ? body.messages : [];
  const cleaned = raw
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .map((m) => ({ role: m.role as "user" | "assistant", content: m.content!.trim().slice(0, 12_000) }))
    .slice(-20);

  if (!cleaned.length) return NextResponse.json({ error: "No messages." }, { status: 400 });

  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";

  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        temperature: 0.6,
        max_tokens: 2048,
        messages: [{ role: "system", content: THINK_SYSTEM }, ...cleaned],
      }),
    });

    if (!r.ok) {
      const t = await r.text();
      return NextResponse.json({ error: `OpenAI ${r.status}: ${t.slice(0, 300)}` }, { status: 502 });
    }

    const data = (await r.json()) as { choices?: { message?: { content?: string } }[] };
    const reply = data.choices?.[0]?.message?.content?.trim();
    if (!reply) return NextResponse.json({ error: "Empty model response." }, { status: 502 });

    return NextResponse.json({ reply, model });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Request failed." }, { status: 502 });
  }
}

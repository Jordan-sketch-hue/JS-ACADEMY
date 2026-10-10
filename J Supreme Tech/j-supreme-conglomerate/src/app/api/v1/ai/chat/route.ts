import { NextResponse } from "next/server";
import { buildJarvisSystemPrompt } from "@/lib/ai/jarvis-system-prompt";
import { getOwnerClerkId } from "@/lib/session";

type IncomingMsg = { role?: string; content?: string };

export async function POST(req: Request) {
  const owner = await getOwnerClerkId();
  if (!owner) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) {
    return NextResponse.json(
      {
        error:
          "OpenAI is not configured. Add OPENAI_API_KEY to your deployment environment (e.g. Vercel) and redeploy.",
      },
      { status: 501 },
    );
  }

  let body: { messages?: IncomingMsg[]; researchMode?: boolean };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const raw = Array.isArray(body.messages) ? body.messages : [];
  const cleaned = raw
    .filter(
      (m) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim(),
    )
    .map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content!.trim().slice(0, 12_000),
    }))
    .slice(-24);

  if (!cleaned.length) {
    return NextResponse.json(
      { error: 'Send { "messages": [{ "role": "user"|"assistant", "content": "..." }] }' },
      { status: 400 },
    );
  }

  const model =
    process.env.OPENAI_MODEL?.trim() ||
    process.env.OPENAI_CHAT_MODEL?.trim() ||
    "gpt-4o-mini";

  const systemPrompt = buildJarvisSystemPrompt({
    researchMode: body.researchMode === true,
  });

  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: body.researchMode ? 0.65 : 0.72,
        max_tokens: body.researchMode ? 3072 : 2048,
        messages: [{ role: "system", content: systemPrompt }, ...cleaned],
      }),
    });

    if (!r.ok) {
      const errText = await r.text();
      return NextResponse.json(
        {
          error: `OpenAI error (${r.status}): ${errText.slice(0, 400)}`,
        },
        { status: 502 },
      );
    }

    const data = (await r.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const reply = data.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      return NextResponse.json({ error: "Empty model response." }, { status: 502 });
    }

    return NextResponse.json({ reply, model });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Chat request failed." },
      { status: 502 },
    );
  }
}

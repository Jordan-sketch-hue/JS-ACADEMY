import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM = `You are an intelligent B2B sales assistant for TechP2, a sole trader procurement business in Jamaica.
TechP2 sources and procures agriculture and hardware supplies for businesses in St. Ann, Portland, St. Mary, and St. Thomas.

You help the sales agent with:
- Drafting professional follow-up messages (WhatsApp, SMS, email)
- Analyzing lead quality and suggesting next steps
- Writing pricing proposals and supply agreements
- Identifying upsell opportunities (e.g. a hardware store that could use fertiliser)
- Suggesting the right products for a client's business type
- Summarizing call notes and extracting action items
- Giving script suggestions for cold calls

Keep responses concise, practical, and tailored to the Jamaican B2B market.
Common products: Fertiliser, Seeds, Pesticides, Cement, Blocks, Lumber, Roofing, Rebar, Plumbing supplies.
Key parishes: St. Ann (tourism/farming), Portland (farming/fishing), St. Mary (banana/citrus), St. Thomas (agriculture/quarrying).`;

export async function POST(req: NextRequest) {
  const { messages, leadContext } = await req.json();

  const systemWithContext = leadContext
    ? `${SYSTEM}\n\nCurrent lead context:\n${leadContext}`
    : SYSTEM;

  const stream = await client.messages.stream({
    model: "claude-haiku-5-5",
    max_tokens: 1024,
    system: systemWithContext,
    messages,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === "content_block_delta" &&
          chunk.delta.type === "text_delta"
        ) {
          controller.enqueue(encoder.encode(chunk.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

import { NextResponse } from "next/server";
import { getOwnerClerkId } from "@/lib/session";
import { isSupabasePersistenceEnabled } from "@/lib/env/storage-mode";
import { parseAiActionsRequest } from "@/lib/ai/parse-ai-actions-request";
import { executeDeterministicAiCommand } from "@/lib/ai/execute-deterministic-command";

export async function POST(req: Request) {
  try {
    const owner = await getOwnerClerkId();
    if (!owner) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let raw: Record<string, unknown> = {};
    try {
      raw = (await req.json()) as Record<string, unknown>;
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const parsed = parseAiActionsRequest(raw);
    if (!parsed) {
      return NextResponse.json({ matched: false as const, message: "No quick action matched." });
    }

    const result = await executeDeterministicAiCommand(owner, parsed);
    const persistLocally = !isSupabasePersistenceEnabled();
    const localTaskSync =
      persistLocally && result.ok && result.detail?.todo ? { todo: result.detail.todo } : undefined;
    const localCrmSync =
      persistLocally && result.ok && result.detail?.localCrm ? result.detail.localCrm : undefined;
    return NextResponse.json({
      matched: true as const,
      intent: parsed.kind,
      result,
      ...(localTaskSync ? { localTaskSync } : {}),
      ...(localCrmSync ? { localCrmSync } : {}),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("[ai/actions]", e);
    return NextResponse.json({ error: msg, matched: false as const }, { status: 500 });
  }
}

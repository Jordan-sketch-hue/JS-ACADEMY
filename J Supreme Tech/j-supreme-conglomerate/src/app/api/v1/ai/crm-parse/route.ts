import { NextResponse } from "next/server";
import type { LeadStage } from "@/lib/data/seed";
import type { ClientRosterFieldPatch } from "@/lib/data/crm";
import { heuristicRosterPatchFromText } from "@/lib/crm/heuristic-roster-patch";

const STAGES: LeadStage[] = ["cold", "warm", "negotiation", "closed", "lost"];

function coerceStage(raw: unknown): LeadStage | undefined {
  const s = String(raw ?? "")
    .toLowerCase()
    .trim();
  if (!s) return undefined;
  return STAGES.includes(s as LeadStage) ? (s as LeadStage) : undefined;
}

function normalizePatch(raw: Record<string, unknown>): ClientRosterFieldPatch {
  const patch: ClientRosterFieldPatch = {};
  const str = (k: string) => {
    const v = raw[k];
    if (v == null) return undefined;
    const s = String(v).trim();
    return s || null;
  };

  const sBiz = str("business_name");
  if (sBiz) patch.business_name = sBiz;
  const cName = str("contact_name");
  if (cName !== undefined) patch.contact_name = cName;
  const em = str("email");
  if (em !== undefined) patch.email = em;
  const ph = str("phone");
  if (ph !== undefined) patch.phone = ph;
  const ind = str("industry");
  if (ind !== undefined) patch.industry = ind;
  const svc = str("services_needed");
  if (svc !== undefined) patch.services_needed = svc;
  const notes = str("follow_up_notes");
  if (notes !== undefined) patch.follow_up_notes = notes;

  const deadline = str("project_deadline");
  if (deadline !== undefined) patch.project_deadline = deadline;

  const bud = raw["budget_amount"];
  if (bud != null && bud !== "") {
    const n = typeof bud === "number" ? bud : Number(String(bud).replace(/,/g, ""));
    if (Number.isFinite(n)) patch.budget_amount = n;
  }

  for (const key of ["last_follow_up_at", "next_follow_up_at"] as const) {
    const v = raw[key];
    if (v == null || v === "") continue;
    const iso = new Date(String(v));
    if (!Number.isNaN(iso.getTime())) patch[key] = iso.toISOString();
  }

  const st = coerceStage(raw["pipeline_stage"] ?? raw["stage"]);
  if (st) patch.pipeline_stage = st;

  return patch;
}

export async function POST(req: Request) {
  let body: { sentence?: string; context?: { business_name?: string } };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const sentence = String(body?.sentence ?? "").trim();
  if (!sentence) {
    return NextResponse.json(
      { ok: false, error: "Provide a non-empty sentence." },
      { status: 400 },
    );
  }

  const key = process.env.OPENAI_API_KEY?.trim();
  if (key) {
    try {
      const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
      const system = `You extract structured CRM fields from free-form text for a single client row.
Return compact JSON only (no markdown). Include ONLY keys you are reasonably confident about.
Allowed keys: business_name, contact_name, email, phone, industry, services_needed, project_deadline (YYYY-MM-DD), budget_amount (number, USD), last_follow_up_at (ISO 8601), next_follow_up_at (ISO 8601), follow_up_notes, pipeline_stage (one of: cold, warm, negotiation, closed, lost).
Context: current business_name may be provided — update it only if the user clearly renames the company.
If the user implies a follow-up time without a year, assume the current calendar year in the server.`;

      const userPayload = JSON.stringify({
        context: body.context ?? {},
        text: sentence,
      });

      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          temperature: 0.2,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: system },
            { role: "user", content: userPayload },
          ],
        }),
      });

      if (!r.ok) {
        const errText = await r.text();
        return NextResponse.json(
          { ok: false, error: `OpenAI error: ${r.status} ${errText.slice(0, 200)}` },
          { status: 502 },
        );
      }

      const data = (await r.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const rawJson = data.choices?.[0]?.message?.content ?? "{}";
      let parsed: Record<string, unknown>;
      try {
        parsed = JSON.parse(rawJson) as Record<string, unknown>;
      } catch {
        return NextResponse.json(
          { ok: false, error: "Model returned non-JSON." },
          { status: 502 },
        );
      }
      const patch = normalizePatch(parsed);
      return NextResponse.json({
        ok: true,
        source: "openai" as const,
        patch,
      });
    } catch (e) {
      return NextResponse.json(
        {
          ok: false,
          error: e instanceof Error ? e.message : "OpenAI request failed.",
        },
        { status: 502 },
      );
    }
  }

  const patch = heuristicRosterPatchFromText(sentence);
  const hasKeys = Object.keys(patch).length > 0;
  return NextResponse.json({
    ok: true,
    source: hasKeys ? ("heuristic" as const) : ("none" as const),
    patch,
    hint: hasKeys
      ? null
      : "Set OPENAI_API_KEY on the server for deeper parsing from natural language.",
  });
}

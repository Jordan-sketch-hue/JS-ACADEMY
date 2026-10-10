import { getServiceSupabase } from "@/lib/supabase/admin";
import {
  VISION_SEEDS,
  normHorizon,
  normPillar,
  normProgress,
  normVisionStatus,
  sortVisions,
  type VisionInput,
  type VisionItem,
  type VisionPatch,
  type VisionResult,
} from "@/lib/vision/types";

const SELECT =
  "id,owner_clerk_id,title,description,pillar,horizon,metric,status,progress,pinned,sort_order,created_at,updated_at";

function iso(d = new Date()) {
  return d.toISOString();
}

function formatSupabaseNetworkError(message: string): string {
  if (
    !/fetch failed|failed to fetch|networkerror|econnrefused|enotfound|eai_again|etimedout/i.test(
      message,
    )
  ) {
    return message;
  }
  return `${message} — Could not reach Supabase from this server. Confirm the HTTPS Project URL + SUPABASE_SERVICE_ROLE_KEY and that the project isn't paused.`;
}

function tableHint(message: string, code: string): string {
  return /relation|does not exist|schema cache/i.test(message) || code === "42P01"
    ? " Run supabase/migrations/20260616140000_vision_board.sql in your project’s SQL editor, then try again."
    : "";
}

function buildRow(owner: string, input: VisionInput, sort_order: number) {
  return {
    owner_clerk_id: owner,
    title: input.title?.trim() || "Untitled vision",
    description: input.description?.trim() || null,
    pillar: normPillar(input.pillar),
    horizon: normHorizon(input.horizon),
    metric: input.metric?.trim() || null,
    status: normVisionStatus(input.status),
    progress: normProgress(input.progress),
    pinned: Boolean(input.pinned),
    sort_order,
  };
}

function hydrate(row: VisionItem): VisionItem {
  return {
    ...row,
    horizon: normHorizon(row.horizon),
    status: normVisionStatus(row.status),
    progress: normProgress(row.progress),
    pinned: Boolean(row.pinned),
  };
}

// ── per-process fallback (no Supabase env) — seeded so SSR isn't empty ────────
const mem = new Map<string, VisionItem[]>();
function bucket(owner: string): VisionItem[] {
  let b = mem.get(owner);
  if (!b) {
    const now = iso();
    b = VISION_SEEDS.map((seed) => ({
      ...seed,
      id: crypto.randomUUID(),
      owner_clerk_id: owner,
      created_at: now,
      updated_at: now,
    }));
    mem.set(owner, b);
  }
  return b;
}

// ── seeding (Supabase): only when the owner has zero rows ─────────────────────
async function ensureSeeded(owner: string): Promise<void> {
  const sb = getServiceSupabase();
  if (!sb) return;
  try {
    const { count, error } = await sb
      .from("vision_items")
      .select("id", { count: "exact", head: true })
      .eq("owner_clerk_id", owner);
    if (error || (count ?? 0) > 0) return;
    await sb.from("vision_items").insert(
      VISION_SEEDS.map((seed) => ({ ...seed, owner_clerk_id: owner })),
    );
  } catch {
    /* ignore — first paint just shows empty, user can still add */
  }
}

export async function listVisionItems(owner: string): Promise<VisionItem[]> {
  const sb = getServiceSupabase();
  if (!sb) return sortVisions(bucket(owner));

  await ensureSeeded(owner);
  try {
    const { data, error } = await sb
      .from("vision_items")
      .select(SELECT)
      .eq("owner_clerk_id", owner);
    if (error) return [];
    return sortVisions((data ?? []).map((r) => hydrate(r as VisionItem)));
  } catch {
    return [];
  }
}

export async function createVisionItem(
  owner: string,
  input: VisionInput,
): Promise<VisionResult> {
  if (!input.title?.trim()) return { ok: false, error: "Give the vision a title." };

  const sb = getServiceSupabase();
  if (!sb) {
    const b = bucket(owner);
    const now = iso();
    const item: VisionItem = {
      id: crypto.randomUUID(),
      created_at: now,
      updated_at: now,
      ...buildRow(owner, input, b.length),
    };
    b.push(item);
    return { ok: true, item };
  }
  try {
    const { data, error } = await sb
      .from("vision_items")
      .insert(buildRow(owner, input, 100))
      .select(SELECT)
      .single();
    if (error) {
      const code = "code" in error ? String((error as { code?: string }).code ?? "") : "";
      const msg = (error as { message?: string }).message ?? "Could not save vision.";
      return { ok: false, error: `${msg}${tableHint(msg, code)}` };
    }
    return { ok: true, item: hydrate(data as VisionItem) };
  } catch (e) {
    return {
      ok: false,
      error: formatSupabaseNetworkError(e instanceof Error ? e.message : "Unknown error"),
    };
  }
}

export async function updateVisionItem(
  owner: string,
  id: string,
  patch: VisionPatch,
): Promise<VisionResult> {
  const updates: Record<string, unknown> = {};
  if (patch.title !== undefined) {
    const t = patch.title?.trim();
    if (!t) return { ok: false, error: "Give the vision a title." };
    updates.title = t;
  }
  if (patch.description !== undefined) updates.description = patch.description?.trim() || null;
  if (patch.pillar !== undefined) updates.pillar = normPillar(patch.pillar);
  if (patch.horizon !== undefined) updates.horizon = normHorizon(patch.horizon);
  if (patch.metric !== undefined) updates.metric = patch.metric?.trim() || null;
  if (patch.status !== undefined) updates.status = normVisionStatus(patch.status);
  if (patch.progress !== undefined) updates.progress = normProgress(patch.progress);
  if (patch.pinned !== undefined) updates.pinned = Boolean(patch.pinned);
  if (patch.sort_order !== undefined) updates.sort_order = patch.sort_order;

  const sb = getServiceSupabase();
  if (!sb) {
    const b = bucket(owner);
    const item = b.find((x) => x.id === id);
    if (!item) return { ok: false, error: "Vision not found." };
    Object.assign(item, updates, { updated_at: iso() });
    return { ok: true, item };
  }
  try {
    const { data, error } = await sb
      .from("vision_items")
      .update(updates)
      .eq("id", id)
      .eq("owner_clerk_id", owner)
      .select(SELECT)
      .single();
    if (error) return { ok: false, error: error.message };
    if (!data) return { ok: false, error: "Vision not found." };
    return { ok: true, item: hydrate(data as VisionItem) };
  } catch (e) {
    return {
      ok: false,
      error: formatSupabaseNetworkError(e instanceof Error ? e.message : "Unknown error"),
    };
  }
}

export async function deleteVisionItem(
  owner: string,
  id: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const sb = getServiceSupabase();
  if (!sb) {
    const b = bucket(owner);
    const i = b.findIndex((x) => x.id === id);
    if (i === -1) return { ok: false, error: "Vision not found." };
    b.splice(i, 1);
    return { ok: true };
  }
  try {
    const { error } = await sb
      .from("vision_items")
      .delete()
      .eq("id", id)
      .eq("owner_clerk_id", owner);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

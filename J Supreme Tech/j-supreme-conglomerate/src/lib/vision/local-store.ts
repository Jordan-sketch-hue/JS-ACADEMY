"use client";

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
} from "@/lib/vision/types";

/**
 * Browser-only mirror of the vision data lib, used when Supabase persistence is
 * off (no env). Seeds the curated starter visions on first use so the board is
 * never empty on a fresh device. The server actions take over automatically
 * once Supabase is configured.
 */

const KEY = (owner: string) => `jsc-vision:${owner}`;
const SEEDED_FLAG = (owner: string) => `jsc-vision-seeded:${owner}`;

function iso(d = new Date()) {
  return d.toISOString();
}

function readRaw(owner: string): VisionItem[] {
  try {
    const raw = window.localStorage.getItem(KEY(owner));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as VisionItem[]) : [];
  } catch {
    return [];
  }
}

function saveAll(owner: string, rows: VisionItem[]): void {
  try {
    window.localStorage.setItem(KEY(owner), JSON.stringify(rows));
  } catch {
    /* quota / private mode — ignore */
  }
}

export function loadLocalVisions(owner: string): VisionItem[] {
  if (typeof window === "undefined") return [];
  let rows = readRaw(owner);

  // Seed once. The flag stops re-seeding after the user intentionally clears
  // everything (count===0 alone would resurrect the starters).
  const seeded = window.localStorage.getItem(SEEDED_FLAG(owner));
  if (rows.length === 0 && !seeded) {
    const now = iso();
    rows = VISION_SEEDS.map((seed) => ({
      ...seed,
      id: crypto.randomUUID(),
      owner_clerk_id: owner,
      created_at: now,
      updated_at: now,
    }));
    saveAll(owner, rows);
    try {
      window.localStorage.setItem(SEEDED_FLAG(owner), "1");
    } catch {
      /* ignore */
    }
  }

  return sortVisions(
    rows.map((r) => ({
      ...r,
      horizon: normHorizon(r.horizon),
      status: normVisionStatus(r.status),
      progress: normProgress(r.progress),
      pinned: Boolean(r.pinned),
    })),
  );
}

export function createLocalVision(owner: string, input: VisionInput): VisionItem | null {
  if (!input.title?.trim()) return null;
  const now = iso();
  const rows = readRaw(owner);
  const item: VisionItem = {
    id: crypto.randomUUID(),
    owner_clerk_id: owner,
    title: input.title.trim(),
    description: input.description?.trim() || null,
    pillar: normPillar(input.pillar),
    horizon: normHorizon(input.horizon),
    metric: input.metric?.trim() || null,
    status: normVisionStatus(input.status),
    progress: normProgress(input.progress),
    pinned: Boolean(input.pinned),
    sort_order: rows.length,
    created_at: now,
    updated_at: now,
  };
  rows.push(item);
  saveAll(owner, rows);
  // Adding before the seed has run should still suppress later auto-seeding.
  try {
    window.localStorage.setItem(SEEDED_FLAG(owner), "1");
  } catch {
    /* ignore */
  }
  return item;
}

export function updateLocalVision(
  owner: string,
  id: string,
  patch: VisionPatch,
): VisionItem | null {
  const rows = readRaw(owner);
  const item = rows.find((x) => x.id === id);
  if (!item) return null;
  if (patch.title !== undefined && patch.title?.trim()) item.title = patch.title.trim();
  if (patch.description !== undefined) item.description = patch.description?.trim() || null;
  if (patch.pillar !== undefined) item.pillar = normPillar(patch.pillar);
  if (patch.horizon !== undefined) item.horizon = normHorizon(patch.horizon);
  if (patch.metric !== undefined) item.metric = patch.metric?.trim() || null;
  if (patch.status !== undefined) item.status = normVisionStatus(patch.status);
  if (patch.progress !== undefined) item.progress = normProgress(patch.progress);
  if (patch.pinned !== undefined) item.pinned = Boolean(patch.pinned);
  if (patch.sort_order !== undefined) item.sort_order = patch.sort_order;
  item.updated_at = iso();
  saveAll(owner, rows);
  return item;
}

export function removeLocalVision(owner: string, id: string): boolean {
  const rows = readRaw(owner);
  const next = rows.filter((x) => x.id !== id);
  if (next.length === rows.length) return false;
  saveAll(owner, next);
  return true;
}

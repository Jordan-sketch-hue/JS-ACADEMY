"use client";

import type { CheckState } from "@/lib/jarvis/types";

/**
 * Browser-local persistence for Jarvis Workflow.
 *
 * Manual check toggles, per-site notes, and the last test-run summary live in
 * localStorage (owner-scoped), mirroring the meetings/subscriptions stores.
 * When you wire a Supabase table later, swap these for server actions — the
 * call sites already treat this as the single source of truth.
 */

export type SiteWorkflowState = {
  /** stepId -> manual state ("pass" | "fail" | "na"); absent = "pending". */
  checks: Record<string, CheckState>;
  note: string;
  lastRun?: {
    at: string;
    autoPassed: number;
    autoTotal: number;
  };
  updatedAt: string;
};

const KEY = (owner: string) => `jsc-jarvis:${owner}`;

type AllState = Record<string, SiteWorkflowState>;

function readAll(owner: string): AllState {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY(owner));
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as AllState) : {};
  } catch {
    return {};
  }
}

function writeAll(owner: string, state: AllState): void {
  try {
    window.localStorage.setItem(KEY(owner), JSON.stringify(state));
  } catch {
    /* ignore quota / privacy errors */
  }
}

export function loadJarvisState(owner: string): AllState {
  return readAll(owner);
}

function blank(): SiteWorkflowState {
  return { checks: {}, note: "", updatedAt: new Date().toISOString() };
}

export function getSiteState(owner: string, siteId: string): SiteWorkflowState {
  return readAll(owner)[siteId] ?? blank();
}

/**
 * Cycle a manual step: pending → pass → na → fail → pending.
 * `seeded` is the audit-seeded state shown when nothing is stored yet, so the
 * cycle continues from what the operator actually sees. When a seed exists we
 * store "pending" explicitly (instead of deleting) so the override sticks.
 */
export function cycleCheck(
  owner: string,
  siteId: string,
  stepId: string,
  seeded?: CheckState,
): SiteWorkflowState {
  const all = readAll(owner);
  const site = all[siteId] ?? blank();
  const order: CheckState[] = ["pass", "na", "fail", "pending"];
  const current = site.checks[stepId] ?? seeded ?? "pending";
  const next = order[(order.indexOf(current) + 1) % order.length];
  if (next === "pending" && seeded === undefined) delete site.checks[stepId];
  else site.checks[stepId] = next;
  site.updatedAt = new Date().toISOString();
  all[siteId] = site;
  writeAll(owner, all);
  return site;
}

export function setCheck(
  owner: string,
  siteId: string,
  stepId: string,
  state: CheckState | null,
): SiteWorkflowState {
  const all = readAll(owner);
  const site = all[siteId] ?? blank();
  if (state === null) delete site.checks[stepId];
  else site.checks[stepId] = state;
  site.updatedAt = new Date().toISOString();
  all[siteId] = site;
  writeAll(owner, all);
  return site;
}

/** Merge a batch of auto-detected results (e.g. from the Vercel env API). */
export function applyChecks(
  owner: string,
  siteId: string,
  map: Record<string, CheckState>,
): SiteWorkflowState {
  const all = readAll(owner);
  const site = all[siteId] ?? blank();
  for (const [stepId, state] of Object.entries(map)) {
    site.checks[stepId] = state;
  }
  site.updatedAt = new Date().toISOString();
  all[siteId] = site;
  writeAll(owner, all);
  return site;
}

export function saveNote(owner: string, siteId: string, note: string): SiteWorkflowState {
  const all = readAll(owner);
  const site = all[siteId] ?? blank();
  site.note = note;
  site.updatedAt = new Date().toISOString();
  all[siteId] = site;
  writeAll(owner, all);
  return site;
}

export function recordRun(
  owner: string,
  siteId: string,
  autoPassed: number,
  autoTotal: number,
): SiteWorkflowState {
  const all = readAll(owner);
  const site = all[siteId] ?? blank();
  site.lastRun = { at: new Date().toISOString(), autoPassed, autoTotal };
  site.updatedAt = new Date().toISOString();
  all[siteId] = site;
  writeAll(owner, all);
  return site;
}

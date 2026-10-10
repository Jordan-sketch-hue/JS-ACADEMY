import type { JarvisDeployment } from "@/lib/jarvis/types";

/**
 * Server-only Vercel deployment helpers (list + instant rollback).
 * All calls use VERCEL_ACCESS_TOKEN; team scoping via VERCEL_TEAM_ID.
 *
 * Revert maps to the documented "rollback" endpoint:
 *   POST /v1/projects/{projectId}/rollback/{deploymentId}
 * → points all production domains for the project at that deployment.
 */

const API = "https://api.vercel.com";

function token(): string {
  return process.env.VERCEL_ACCESS_TOKEN?.trim() ?? "";
}
function teamParam(extra: Record<string, string> = {}): string {
  const params = new URLSearchParams(extra);
  const team = process.env.VERCEL_TEAM_ID?.trim();
  if (team) params.set("teamId", team);
  return params.toString();
}
function authHeaders(): HeadersInit {
  return { Authorization: `Bearer ${token()}` };
}
function apiError(json: Record<string, unknown>, res: Response): string {
  const err = json.error;
  if (err && typeof err === "object" && "message" in err) {
    return String((err as { message?: unknown }).message);
  }
  return typeof err === "string" ? err : res.statusText || "Vercel API error";
}

export type ResolvedProject = {
  id: string;
  name: string;
  currentProductionId: string | null;
};

/** Look up a project by name (or id) → real prj_ id + current prod deployment. */
export async function resolveVercelProject(
  nameOrId: string,
): Promise<{ ok: true; project: ResolvedProject } | { ok: false; error: string }> {
  if (!token()) return { ok: false, error: "VERCEL_ACCESS_TOKEN is not configured." };
  try {
    const res = await fetch(
      `${API}/v9/projects/${encodeURIComponent(nameOrId)}?${teamParam()}`,
      { headers: authHeaders(), cache: "no-store" },
    );
    const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    if (!res.ok) return { ok: false, error: apiError(json, res) };

    const targets = json.targets as Record<string, unknown> | undefined;
    const production = targets?.production as Record<string, unknown> | undefined;
    const currentProductionId =
      (typeof production?.id === "string" && production.id) ||
      (typeof production?.deploymentId === "string" && production.deploymentId) ||
      null;

    return {
      ok: true,
      project: {
        id: String(json.id ?? nameOrId),
        name: String(json.name ?? nameOrId),
        currentProductionId,
      },
    };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Vercel request failed." };
  }
}

/** Recent production deployments, newest first, with the current live one flagged. */
export async function listProductionDeployments(
  project: ResolvedProject,
): Promise<{ ok: true; deployments: JarvisDeployment[] } | { ok: false; error: string }> {
  if (!token()) return { ok: false, error: "VERCEL_ACCESS_TOKEN is not configured." };
  try {
    const res = await fetch(
      `${API}/v6/deployments?${teamParam({
        projectId: project.id,
        target: "production",
        limit: "20",
      })}`,
      { headers: authHeaders(), cache: "no-store" },
    );
    const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    if (!res.ok) return { ok: false, error: apiError(json, res) };

    const raw = Array.isArray(json.deployments) ? json.deployments : [];
    let currentMarked = false;
    const deployments: JarvisDeployment[] = raw
      .filter((d): d is Record<string, unknown> => !!d && typeof d === "object")
      .map((d) => {
        const meta = (d.meta as Record<string, unknown>) ?? {};
        const creator = (d.creator as Record<string, unknown>) ?? {};
        const uid = String(d.uid ?? d.id ?? "");
        const state = String(d.state ?? d.readyState ?? "UNKNOWN");
        const isCurrent =
          project.currentProductionId != null && uid === project.currentProductionId;
        if (isCurrent) currentMarked = true;
        return {
          uid,
          url: typeof d.url === "string" ? `https://${d.url}` : "",
          state,
          created: Number(d.created ?? d.createdAt ?? 0),
          target: typeof d.target === "string" ? d.target : null,
          commitMessage:
            (typeof meta.githubCommitMessage === "string" && meta.githubCommitMessage) ||
            (typeof meta.gitCommitMessage === "string" && meta.gitCommitMessage) ||
            null,
          commitRef:
            (typeof meta.githubCommitRef === "string" && meta.githubCommitRef) ||
            (typeof meta.gitCommitRef === "string" && meta.gitCommitRef) ||
            null,
          creator: typeof creator.username === "string" ? creator.username : null,
          isCurrent,
        };
      });

    // Fallback: if Vercel didn't report a current prod id, treat the newest
    // READY production deployment as live.
    if (!currentMarked) {
      const live = deployments.find((d) => d.state === "READY");
      if (live) live.isCurrent = true;
    }

    return { ok: true, deployments };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Vercel request failed." };
  }
}

/**
 * Read the env-var KEY NAMES configured on a project (never the values).
 * Vercel: GET /v9/projects/{idOrName}/env → { envs: [{ key, target, ... }] }.
 * Used by Jarvis to auto-confirm integration checks (Resend, Supabase, …).
 */
export async function getProjectEnvKeys(
  nameOrId: string,
): Promise<{ ok: true; keys: string[] } | { ok: false; error: string }> {
  if (!token()) return { ok: false, error: "VERCEL_ACCESS_TOKEN is not configured." };
  try {
    const res = await fetch(
      `${API}/v9/projects/${encodeURIComponent(nameOrId)}/env?${teamParam()}`,
      { headers: authHeaders(), cache: "no-store" },
    );
    const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    if (!res.ok) return { ok: false, error: apiError(json, res) };

    // Newer API nests under `envs`; older shapes may return a bare array.
    const rows = Array.isArray(json.envs)
      ? json.envs
      : Array.isArray(json)
        ? (json as unknown[])
        : [];
    const keys = Array.from(
      new Set(
        rows
          .filter((r): r is Record<string, unknown> => !!r && typeof r === "object")
          .map((r) => (typeof r.key === "string" ? r.key : ""))
          .filter(Boolean),
      ),
    ).sort();

    return { ok: true, keys };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Vercel request failed." };
  }
}

/** Upsert an encrypted PRODUCTION env var on a project (create-or-update). */
export async function setProjectEnv(
  projectId: string,
  key: string,
  value: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!token()) return { ok: false, error: "VERCEL_ACCESS_TOKEN is not configured." };
  try {
    const res = await fetch(
      `${API}/v10/projects/${encodeURIComponent(projectId)}/env?${teamParam({ upsert: "true" })}`,
      {
        method: "POST",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ key, value, type: "encrypted", target: ["production"] }),
      },
    );
    if (!res.ok) {
      const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
      return { ok: false, error: apiError(json, res) };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Vercel request failed." };
  }
}

/**
 * Redeploy the latest production deployment so newly-changed env vars take
 * effect (Vercel only applies env changes on a fresh deploy). Reuses the
 * existing deployment's source via `deploymentId` — works for git and CLI
 * deploys alike.
 */
export async function redeployLatestProduction(
  nameOrId: string,
): Promise<{ ok: true; url?: string } | { ok: false; error: string }> {
  if (!token()) return { ok: false, error: "VERCEL_ACCESS_TOKEN is not configured." };
  const resolved = await resolveVercelProject(nameOrId);
  if (!resolved.ok) return { ok: false, error: resolved.error };
  const project = resolved.project;
  try {
    const listRes = await fetch(
      `${API}/v6/deployments?${teamParam({ projectId: project.id, target: "production", limit: "1" })}`,
      { headers: authHeaders(), cache: "no-store" },
    );
    const listJson = (await listRes.json().catch(() => ({}))) as Record<string, unknown>;
    if (!listRes.ok) return { ok: false, error: apiError(listJson, listRes) };
    const raw = Array.isArray(listJson.deployments) ? listJson.deployments : [];
    const latest = raw[0] as Record<string, unknown> | undefined;
    const deploymentId = latest ? String(latest.uid ?? latest.id ?? "") : "";
    if (!deploymentId) return { ok: false, error: "No existing production deployment to redeploy." };

    const res = await fetch(`${API}/v13/deployments?${teamParam({ forceNew: "1" })}`, {
      method: "POST",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({ name: project.name, deploymentId, target: "production" }),
    });
    const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    if (!res.ok) return { ok: false, error: apiError(json, res) };
    return { ok: true, url: typeof json.url === "string" ? `https://${json.url}` : undefined };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Vercel request failed." };
  }
}

/** Instant rollback: point production at a previous deployment. */
export async function rollbackToDeployment(
  projectId: string,
  deploymentId: string,
  description?: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!token()) return { ok: false, error: "VERCEL_ACCESS_TOKEN is not configured." };
  try {
    const res = await fetch(
      `${API}/v1/projects/${encodeURIComponent(projectId)}/rollback/${encodeURIComponent(
        deploymentId,
      )}?${teamParam(description ? { description } : {})}`,
      { method: "POST", headers: authHeaders(), cache: "no-store" },
    );
    if (!res.ok) {
      const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
      return { ok: false, error: apiError(json, res) };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Vercel request failed." };
  }
}

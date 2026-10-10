export type VercelApiProject = {
  id: string;
  name: string;
  url: string;
  updatedAt: string | null;
  nodeVersion?: string | null;
};

function projectProductionUrl(project: Record<string, unknown>): string {
  const targets = project.targets as Record<string, unknown> | undefined;
  const production = targets?.production as Record<string, unknown> | undefined;

  // Prefer the production ALIASES over `production.url`: the latter is the
  // deployment-specific *.vercel.app URL, which 401s under Deployment
  // Protection even when the public domains are fine. Order of preference:
  // apex custom domain → any custom domain → clean *.vercel.app alias.
  const alias = production?.alias;
  if (Array.isArray(alias)) {
    const hosts = alias.filter(
      (h): h is string => typeof h === "string" && !!h.trim(),
    );
    const custom = hosts.filter((h) => !h.endsWith(".vercel.app"));
    const pick =
      custom.find((h) => !h.startsWith("www.")) ??
      custom[0] ??
      hosts.find((h) => h.endsWith(".vercel.app"));
    if (pick) return pick.startsWith("http") ? pick : `https://${pick}`;
  }

  const url = production?.url;
  if (typeof url === "string" && url.trim()) {
    return url.startsWith("http") ? url : `https://${url}`;
  }
  const name = typeof project.name === "string" ? project.name : "project";
  return `https://${name}.vercel.app`;
}

export async function fetchVercelAccountProjects(): Promise<
  | { ok: true; projects: VercelApiProject[] }
  | { ok: false; error: string }
> {
  const token = process.env.VERCEL_ACCESS_TOKEN?.trim();
  if (!token) {
    return { ok: false, error: "VERCEL_ACCESS_TOKEN is not configured." };
  }

  const teamId = process.env.VERCEL_TEAM_ID?.trim();
  const params = new URLSearchParams({ limit: "100" });
  if (teamId) params.set("teamId", teamId);

  try {
    const res = await fetch(
      `https://api.vercel.com/v9/projects?${params.toString()}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      },
    );
    const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    if (!res.ok) {
      const err = json.error;
      const msg =
        typeof err === "object" && err && "message" in err
          ? String((err as { message?: unknown }).message)
          : typeof err === "string"
            ? err
            : res.statusText || "Could not list Vercel projects.";
      return { ok: false, error: msg };
    }

    const raw = json.projects;
    if (!Array.isArray(raw)) {
      return { ok: false, error: "Unexpected Vercel API response." };
    }

    const projects: VercelApiProject[] = raw
      .filter((p): p is Record<string, unknown> => !!p && typeof p === "object")
      .map((p) => ({
        id: typeof p.id === "string" ? p.id : String(p.name ?? ""),
        name: typeof p.name === "string" ? p.name : "unknown",
        url: projectProductionUrl(p),
        updatedAt:
          typeof p.updatedAt === "number"
            ? new Date(p.updatedAt).toISOString()
            : typeof p.updatedAt === "string"
              ? p.updatedAt
              : null,
        nodeVersion:
          typeof p.nodeVersion === "string"
            ? p.nodeVersion
            : typeof p.nodeVersion === "number"
              ? String(p.nodeVersion)
              : null,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return { ok: true, projects };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Vercel request failed.",
    };
  }
}

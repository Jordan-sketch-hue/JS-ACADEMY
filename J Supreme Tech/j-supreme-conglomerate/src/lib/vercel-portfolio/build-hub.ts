import {
  VERCEL_SITE_CATALOG,
  VERCEL_SITE_CATEGORIES,
} from "@/lib/vercel-portfolio/catalog";
import { fetchVercelAccountProjects } from "@/lib/vercel-portfolio/fetch-vercel-projects";
import type {
  VercelSiteEntry,
  VercelSiteHealthStatus,
  VercelSitesHub,
} from "@/lib/vercel-portfolio/types";

function normalizeHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

async function checkSiteHealth(site: VercelSiteEntry): Promise<VercelSiteEntry> {
  if (!site.url || !site.url.startsWith("http")) {
    return {
      ...site,
      health: {
        status: "not-deployed",
        statusCode: null,
        responseMs: null,
        checkedAt: new Date().toISOString(),
      },
    };
  }

  const startedAt = Date.now();
  const controller = new AbortController();
  // 4s, not 8s: a dead site shouldn't hold the whole tower hostage — with ~40
  // parallel probes the slowest one defines the page's render time.
  const timeout = setTimeout(() => controller.abort(), 4000);

  try {
    const res = await fetch(site.url, {
      method: "HEAD",
      cache: "no-store",
      redirect: "follow",
      signal: controller.signal,
    });
    const status: VercelSiteHealthStatus = res.ok
      ? "healthy"
      : res.status >= 400 && res.status < 500
        ? "warning"
        : "offline";

    return {
      ...site,
      health: {
        status,
        statusCode: res.status,
        responseMs: Date.now() - startedAt,
        checkedAt: new Date().toISOString(),
      },
    };
  } catch {
    return {
      ...site,
      health: {
        status: "offline",
        statusCode: null,
        responseMs: Date.now() - startedAt,
        checkedAt: new Date().toISOString(),
      },
    };
  } finally {
    clearTimeout(timeout);
  }
}

export async function buildVercelSitesHub(): Promise<VercelSitesHub> {
  const api = await fetchVercelAccountProjects();
  const byProjectName = new Map(
    api.ok ? api.projects.map((p) => [p.name.toLowerCase(), p] as const) : [],
  );
  const claimedProjectNames = new Set<string>();

  const sites: VercelSiteEntry[] = VERCEL_SITE_CATALOG.map((row) => {
    const key = row.vercelProjectName?.toLowerCase();
    const live = key ? byProjectName.get(key) : undefined;
    if (key) claimedProjectNames.add(key);

    // URL preference: a hand-verified custom domain in the catalog is canonical.
    // If the catalog still points at *.vercel.app but the live API shows a
    // custom domain, auto-upgrade. Never replace a clean catalog URL with the
    // API's deployment-specific URL (it 401s under Deployment Protection).
    const rowHost = normalizeHost(row.url);
    const rowIsVercelHost = !row.url || rowHost.endsWith(".vercel.app");
    const liveHost = live?.url ? normalizeHost(live.url) : "";
    const liveIsCustom = !!liveHost && !liveHost.endsWith(".vercel.app");
    const url =
      !rowIsVercelHost ? row.url : liveIsCustom && live ? live.url : row.url || live?.url || "";

    return {
      ...row,
      source: "catalog" as const,
      url,
      updatedAt: live?.updatedAt ?? null,
      nodeVersion: live?.nodeVersion ?? row.nodeVersion ?? null,
    };
  });

  if (api.ok) {
    for (const p of api.projects) {
      const key = p.name.toLowerCase();
      if (claimedProjectNames.has(key)) continue;
      sites.push({
        id: `vercel-${p.id}`,
        name: p.name,
        url: p.url,
        description: "Listed from your Vercel account.",
        categoryId: "vercel-sync",
        tags: ["vercel"],
        source: "vercel-api",
        vercelProjectName: p.name,
        updatedAt: p.updatedAt,
        nodeVersion: p.nodeVersion ?? null,
      });
    }
  }

  const hostSeen = new Set<string>();
  const deduped = sites.filter((s) => {
    const h = normalizeHost(s.url);
    if (hostSeen.has(h)) return false;
    hostSeen.add(h);
    return true;
  });

  deduped.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  const checked = await Promise.all(deduped.map(checkSiteHealth));
  const totals = {
    total: checked.length,
    deployed: checked.filter((s) => s.health?.status !== "not-deployed").length,
    healthy: checked.filter((s) => s.health?.status === "healthy").length,
    warning: checked.filter((s) => s.health?.status === "warning").length,
    offline: checked.filter((s) => s.health?.status === "offline").length,
    notDeployed: checked.filter((s) => s.health?.status === "not-deployed").length,
  };

  return {
    categories: [...VERCEL_SITE_CATEGORIES].sort((a, b) => a.order - b.order),
    sites: checked,
    vercelApiConnected: api.ok,
    vercelApiError: api.ok ? null : api.error,
    checkedAt: new Date().toISOString(),
    totals,
  };
}

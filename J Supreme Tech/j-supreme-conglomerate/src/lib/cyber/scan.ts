/**
 * Live security scanner — grades a property by the security signals that
 * ride on every HTTP response. No agent on the target needed.
 *
 * What we check (and why an attacker cares):
 *   • HTTPS reachable + TLS ....... transport confidentiality / integrity
 *   • HSTS ........................ stops protocol-downgrade / SSL-strip
 *   • CSP ......................... mitigates XSS / data-exfil / injection
 *   • X-Frame-Options / frame-anc.. stops clickjacking (UI redress)
 *   • X-Content-Type-Options ...... stops MIME-sniffing attacks
 *   • Referrer-Policy ............. stops URL/secret leakage via Referer
 *   • Permissions-Policy .......... locks down camera/mic/geo APIs
 */

export type HeaderCheck = {
  id: string;
  label: string;
  present: boolean;
  weight: number;
  value?: string;
};

export type ScanResult = {
  id: string;
  name: string;
  url: string;
  tier: string;
  sensitivity: string;
  reachable: boolean;
  https: boolean;
  status: number | null;
  latencyMs: number | null;
  score: number; // 0–100
  grade: "A" | "B" | "C" | "D" | "F" | "—";
  checks: HeaderCheck[];
  error?: string;
};

const TRANSPORT_WEIGHT = 25;

const HEADER_CHECKS: { id: string; label: string; weight: number; match: (h: Headers) => string | null }[] = [
  { id: "hsts", label: "HSTS (Strict-Transport-Security)", weight: 15, match: (h) => h.get("strict-transport-security") },
  {
    id: "csp",
    label: "Content-Security-Policy",
    weight: 20,
    match: (h) => h.get("content-security-policy") ?? h.get("content-security-policy-report-only"),
  },
  {
    id: "frame",
    label: "Anti-clickjacking (X-Frame-Options / frame-ancestors)",
    weight: 12,
    match: (h) => {
      const xfo = h.get("x-frame-options");
      if (xfo) return xfo;
      const csp = h.get("content-security-policy") ?? "";
      return /frame-ancestors/i.test(csp) ? "frame-ancestors (CSP)" : null;
    },
  },
  { id: "nosniff", label: "X-Content-Type-Options: nosniff", weight: 10, match: (h) => h.get("x-content-type-options") },
  { id: "referrer", label: "Referrer-Policy", weight: 9, match: (h) => h.get("referrer-policy") },
  { id: "permissions", label: "Permissions-Policy", weight: 9, match: (h) => h.get("permissions-policy") },
];

function gradeFor(score: number, reachable: boolean): ScanResult["grade"] {
  if (!reachable) return "—";
  if (score >= 90) return "A";
  if (score >= 75) return "B";
  if (score >= 60) return "C";
  if (score >= 40) return "D";
  return "F";
}

/** Probe a single property. Always resolves — never throws. */
export async function scanProperty(p: {
  id: string;
  name: string;
  url: string;
  tier: string;
  sensitivity: string;
}): Promise<ScanResult> {
  const https = p.url.startsWith("https://");
  const started = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(p.url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": "JSupreme-CyberCommand/1.0 (+security-scan)" },
      cache: "no-store",
    });
    clearTimeout(timer);
    const latencyMs = Date.now() - started;

    const checks: HeaderCheck[] = HEADER_CHECKS.map((c) => {
      const value = c.match(res.headers);
      return { id: c.id, label: c.label, present: !!value, weight: c.weight, value: value ?? undefined };
    });

    // Transport points: full only if HTTPS and the server actually answered.
    const transportPoints = https && res.status < 500 ? TRANSPORT_WEIGHT : https ? TRANSPORT_WEIGHT * 0.6 : 0;
    const headerPoints = checks.reduce((s, c) => s + (c.present ? c.weight : 0), 0);
    const score = Math.round(transportPoints + headerPoints);

    return {
      id: p.id,
      name: p.name,
      url: p.url,
      tier: p.tier,
      sensitivity: p.sensitivity,
      reachable: true,
      https,
      status: res.status,
      latencyMs,
      score,
      grade: gradeFor(score, true),
      checks,
    };
  } catch (e) {
    clearTimeout(timer);
    return {
      id: p.id,
      name: p.name,
      url: p.url,
      tier: p.tier,
      sensitivity: p.sensitivity,
      reachable: false,
      https,
      status: null,
      latencyMs: null,
      score: 0,
      grade: "—",
      checks: HEADER_CHECKS.map((c) => ({ id: c.id, label: c.label, present: false, weight: c.weight })),
      error: e instanceof Error ? (e.name === "AbortError" ? "Timed out (8s)" : e.message) : "unreachable",
    };
  }
}

/**
 * Thin, versioned Meta Graph API client.
 *
 * Every call is pinned to `META_GRAPH_VERSION` and normalizes Meta's `{error:{...}}`
 * envelope into a typed `GraphApiError` so callers can branch on code/subcode
 * (e.g. token expiry = 190, rate limit = 4/17/32) instead of string-matching.
 */

const GRAPH_BASE = "https://graph.facebook.com";

export function graphVersion(): string {
  return process.env.META_GRAPH_VERSION?.trim() || "v21.0";
}

export function appId(): string {
  const id = process.env.META_APP_ID?.trim();
  if (!id) throw new Error("META_APP_ID is not set.");
  return id;
}

export function appSecret(): string {
  const s = process.env.META_APP_SECRET?.trim();
  if (!s) throw new Error("META_APP_SECRET is not set.");
  return s;
}

export type GraphErrorDetail = {
  message: string;
  type?: string;
  code?: number;
  subcode?: number;
  fbtraceId?: string;
};

export class GraphApiError extends Error {
  constructor(
    public readonly detail: GraphErrorDetail,
    public readonly status: number,
  ) {
    super(detail.message);
    this.name = "GraphApiError";
  }
  /** OAuth/token problems (expired, revoked, invalid) — code 190 / type OAuthException. */
  get isAuthError(): boolean {
    return this.detail.code === 190 || this.detail.type === "OAuthException";
  }
  /** Throttling — application/user/page rate limits. */
  get isRateLimited(): boolean {
    return [4, 17, 32, 613].includes(this.detail.code ?? -1);
  }
}

type Params = Record<string, string | number | boolean | undefined | null>;

function buildUrl(path: string, params: Params = {}): string {
  const clean = path.replace(/^\/+/, "");
  // Absolute graph paths (e.g. an id) get the version prefix; full URLs pass through.
  const url = /^https?:\/\//.test(clean)
    ? new URL(clean)
    : new URL(`${GRAPH_BASE}/${graphVersion()}/${clean}`);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
  }
  return url.toString();
}

async function parse<T>(res: Response): Promise<T> {
  const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  const err = json?.error as Record<string, unknown> | undefined;
  if (!res.ok || err) {
    throw new GraphApiError(
      {
        message: (err?.message as string) ?? `Graph request failed (HTTP ${res.status})`,
        type: err?.type as string | undefined,
        code: err?.code as number | undefined,
        subcode: err?.error_subcode as number | undefined,
        fbtraceId: err?.fbtrace_id as string | undefined,
      },
      res.status,
    );
  }
  return json as T;
}

/** GET a Graph edge. `accessToken` is sent as a query param (standard for reads). */
export async function graphGet<T = unknown>(
  path: string,
  accessToken: string,
  params: Params = {},
): Promise<T> {
  const res = await fetch(buildUrl(path, { ...params, access_token: accessToken }), {
    method: "GET",
  });
  return parse<T>(res);
}

/** POST to a Graph edge with form-encoded params (access token in the body). */
export async function graphPost<T = unknown>(
  path: string,
  accessToken: string,
  body: Params = {},
): Promise<T> {
  const form = new URLSearchParams();
  for (const [k, v] of Object.entries(body)) {
    if (v !== undefined && v !== null) form.set(k, String(v));
  }
  form.set("access_token", accessToken);
  const res = await fetch(buildUrl(path), { method: "POST", body: form });
  return parse<T>(res);
}

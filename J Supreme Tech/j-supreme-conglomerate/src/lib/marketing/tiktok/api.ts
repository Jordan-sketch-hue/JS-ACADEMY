/**
 * Thin TikTok Open API client (open.tiktokapis.com).
 *
 * TikTok wraps every response in `{ data, error: { code, message, log_id } }` — even
 * success (code === "ok"). We normalize failures into a typed `TikTokApiError` so the
 * publish path can branch on auth vs rate-limit vs server error (mirrors GraphApiError).
 *
 * The OAuth token endpoint is the exception: it's form-encoded and uses the OAuth-style
 * `{ error, error_description, log_id }` envelope — handled in `tokenEndpoint`.
 */
import type { TikTokTokenResponse } from "./types";

const OPEN_API_BASE = "https://open.tiktokapis.com";

export function clientKey(): string {
  const k = process.env.TIKTOK_CLIENT_KEY?.trim();
  if (!k) throw new Error("TIKTOK_CLIENT_KEY is not set.");
  return k;
}

export function clientSecret(): string {
  const s = process.env.TIKTOK_CLIENT_SECRET?.trim();
  if (!s) throw new Error("TIKTOK_CLIENT_SECRET is not set.");
  return s;
}

export class TikTokApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly httpStatus: number,
    public readonly logId?: string,
  ) {
    super(message);
    this.name = "TikTokApiError";
  }
  /** Token revoked / expired / scope missing → reconnect, don't retry. */
  get isAuthError(): boolean {
    return (
      this.httpStatus === 401 ||
      ["access_token_invalid", "scope_not_authorized", "scope_permission_missed", "refresh_token_invalid", "refresh_token_expired", "refresh_token_missing"].includes(
        this.code,
      )
    );
  }
  /** Throttled → back off and retry next tick. */
  get isRateLimited(): boolean {
    return this.httpStatus === 429 || this.code === "rate_limit_exceeded";
  }
}

type TikTokEnvelope<T> = { data?: T; error?: { code?: string; message?: string; log_id?: string } };

function throwIfError(json: TikTokEnvelope<unknown>, httpOk: boolean, httpStatus: number): void {
  const err = json?.error;
  if (!httpOk || (err?.code && err.code !== "ok")) {
    throw new TikTokApiError(
      err?.code ?? `http_${httpStatus}`,
      err?.message || `TikTok request failed (HTTP ${httpStatus})`,
      httpStatus,
      err?.log_id,
    );
  }
}

/** POST JSON to a v2 content-posting endpoint with a Bearer token; returns `data`. */
export async function openApiPost<T>(
  path: string,
  accessToken: string,
  body: Record<string, unknown>,
): Promise<T> {
  const res = await fetch(`${OPEN_API_BASE}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(body),
  });
  const json = (await res.json().catch(() => ({}))) as TikTokEnvelope<T>;
  throwIfError(json, res.ok, res.status);
  return (json.data ?? {}) as T;
}

/** GET a v2 read endpoint (e.g. user info) with a Bearer token; returns `data`. */
export async function openApiGet<T>(
  path: string,
  accessToken: string,
  params: Record<string, string> = {},
): Promise<T> {
  const url = new URL(`${OPEN_API_BASE}${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url.toString(), {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const json = (await res.json().catch(() => ({}))) as TikTokEnvelope<T>;
  throwIfError(json, res.ok, res.status);
  return (json.data ?? {}) as T;
}

/**
 * The OAuth token endpoint (authorization_code + refresh_token grants).
 * Form-encoded; OAuth-style error envelope (NOT the {data,error} wrapper).
 */
export async function tokenEndpoint(
  params: Record<string, string>,
): Promise<TikTokTokenResponse> {
  const res = await fetch(`${OPEN_API_BASE}/v2/oauth/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(params),
  });
  const json = (await res.json().catch(() => ({}))) as Record<string, unknown> & {
    error?: string | { code?: string; message?: string };
    error_description?: string;
    log_id?: string;
  };
  if (!res.ok || json.error) {
    const code =
      typeof json.error === "string" ? json.error : json.error?.code ?? `http_${res.status}`;
    const msg =
      json.error_description ??
      (typeof json.error === "object" ? json.error?.message : undefined) ??
      `Token endpoint failed (HTTP ${res.status})`;
    throw new TikTokApiError(code, msg, res.status, json.log_id as string | undefined);
  }
  return json as unknown as TikTokTokenResponse;
}

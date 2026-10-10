/**
 * Meta (Facebook / Instagram) integration — data-layer types.
 *
 * Mirrors `_build/sql/meta_marketing.sql`. The read models intentionally OMIT the
 * access token: ciphertext lives in the DB and is only ever decrypted inside the
 * server publish path — it must never reach a serializable client payload.
 */

// --- Connected accounts -------------------------------------------------------

export type MetaConnectionKind =
  | "facebook_page"
  | "instagram"
  | "ad_account"
  | "tiktok_account"; // TikTok shares this connections table (see _build/sql/tiktok_marketing.sql)

/** Safe read model — no token. */
export type MetaConnection = {
  id: string;
  ownerClerkId: string;
  kind: MetaConnectionKind;
  /** Page id, IG user id, or `act_<id>` for ad accounts. */
  externalId: string;
  name: string | null;
  /** null = never expires (Page tokens for a Page you admin). */
  tokenExpiresAt: string | null;
  scopes: string[];
  /** Extra linkage, e.g. { page_id, ig_user_id, category }. */
  meta: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

// --- Scheduled / published posts ---------------------------------------------

export type SocialPlatform = "facebook" | "instagram" | "tiktok";

export type SocialPostStatus =
  | "draft" // authored, not yet on the calendar
  | "scheduled" // on the calendar, waiting for its time
  | "publishing" // cron picked it up; Graph call in flight
  | "posted" // live on the platform
  | "failed" // Graph rejected it (see `error`)
  | "canceled"; // pulled before it went out

export type SocialMediaType =
  | "text"
  | "image"
  | "video"
  | "story"
  | "reel"
  | "carousel";

/** Safe read model for a calendar/storyboard entry. */
export type SocialPost = {
  id: string;
  ownerClerkId: string;
  /** CAMPAIGNS slug — ties a post back to the storyboard brand. */
  campaign: string | null;
  /** MarketingAsset id — ties a post to a specific staged creative. */
  assetId: string | null;
  /** Continuation thread (Series id) + position, for sequenced storytelling. */
  series: string | null;
  sequence: number | null;
  platform: SocialPlatform;
  /** Which connected account this publishes to. */
  connectionId: string | null;
  mediaType: SocialMediaType;
  caption: string | null;
  /** Public HTTPS url of the creative (Graph fetches it by URL). For carousels this is the cover (first image). */
  mediaUrl: string | null;
  /** TikTok photo carousel — full ordered image set (up to 35). null for video / single-image / Meta posts. */
  mediaUrls: string[] | null;
  /** Optional outbound link (Facebook feed link posts). */
  link: string | null;
  /** ISO timestamp the post is due to publish. */
  scheduledAt: string;
  status: SocialPostStatus;
  publishedAt: string | null;
  /** Post/media id returned by Graph once live. */
  externalPostId: string | null;
  error: string | null;
  attempts: number;
  createdAt: string;
  updatedAt: string;
};

// --- Raw Supabase row shapes (snake_case) ------------------------------------

export type MetaConnectionRow = {
  id: string;
  owner_clerk_id: string;
  kind: MetaConnectionKind;
  external_id: string;
  name: string | null;
  access_token: string | null; // ciphertext; server-only
  token_expires_at: string | null;
  /** TikTok only — ciphertext of the refresh token (access tokens expire ~24h). server-only. */
  refresh_token?: string | null;
  refresh_token_expires_at?: string | null;
  scopes: string[] | null;
  meta: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

export type SocialPostRow = {
  id: string;
  owner_clerk_id: string;
  campaign: string | null;
  asset_id: string | null;
  series: string | null;
  sequence: number | null;
  platform: SocialPlatform;
  connection_id: string | null;
  media_type: SocialMediaType;
  caption: string | null;
  media_url: string | null;
  media_urls: string[] | null;
  link: string | null;
  scheduled_at: string;
  status: SocialPostStatus;
  published_at: string | null;
  external_post_id: string | null;
  error: string | null;
  attempts: number;
  created_at: string;
  updated_at: string;
};

// --- Row -> read-model mappers (drop the token) ------------------------------

export function toMetaConnection(r: MetaConnectionRow): MetaConnection {
  return {
    id: r.id,
    ownerClerkId: r.owner_clerk_id,
    kind: r.kind,
    externalId: r.external_id,
    name: r.name,
    tokenExpiresAt: r.token_expires_at,
    scopes: r.scopes ?? [],
    meta: r.meta ?? {},
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export function toSocialPost(r: SocialPostRow): SocialPost {
  return {
    id: r.id,
    ownerClerkId: r.owner_clerk_id,
    campaign: r.campaign,
    assetId: r.asset_id,
    series: r.series,
    sequence: r.sequence,
    platform: r.platform,
    connectionId: r.connection_id,
    mediaType: r.media_type,
    caption: r.caption,
    mediaUrl: r.media_url,
    mediaUrls: r.media_urls ?? null,
    link: r.link,
    scheduledAt: r.scheduled_at,
    status: r.status,
    publishedAt: r.published_at,
    externalPostId: r.external_post_id,
    error: r.error,
    attempts: r.attempts ?? 0,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

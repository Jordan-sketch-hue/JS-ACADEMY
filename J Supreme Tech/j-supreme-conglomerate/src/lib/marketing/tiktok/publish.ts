/**
 * TikTok publishing engine — turns a `SocialPost` (platform="tiktok") into a live post.
 *
 * Two media families, branched on `post.mediaType`:
 *   • video / reel        → /publish/video/init/   (source_info.video_url)
 *   • image / carousel    → /publish/content/init/ (media_type=PHOTO, source_info.photo_images[])
 * Both use source PULL_FROM_URL (TikTok fetches our public asset URLs).
 *
 * Flow (Direct Post, the default):
 *   1. refresh the access token if it's expired/near-expiry (TikTok tokens die ~24h)
 *   2. query creator_info  ── REQUIRED by TikTok before any Direct Post
 *   3. resolve post_info   ── privacy + interaction toggles  ◄── the POLICY KNOB
 *   4. video|content init with source PULL_FROM_URL  → publish_id  (the COMMIT POINT)
 *   5. briefly poll /publish/status/fetch/ to surface a fast FAILED; else treat as posted
 *
 * `TIKTOK_PUBLISH_MODE=inbox` instead sends the media to the creator's TikTok drafts
 * (no app audit needed) for them to finish posting in-app. Video uses the dedicated
 * inbox/video endpoint; photos have no inbox endpoint, so they use content/init with
 * post_mode=MEDIA_UPLOAD (TikTok's draft mode for the same endpoint).
 *
 * IMPORTANT — double-post safety: once init returns a publish_id the post is committed
 * to TikTok. From that point we NEVER report a transient failure (which would make the
 * cron re-init and double-post). Only pre-init errors are retryable.
 */
import type { SocialPost } from "@/lib/marketing/meta/types";
import type { PublishResult } from "@/lib/marketing/meta/publish";
import { TikTokApiError, openApiPost } from "./api";
import { refreshAccessToken } from "./oauth";
import {
  getTikTokPublishContext,
  saveRefreshedTokens,
  type TikTokPublishContext,
} from "@/lib/data/tiktok-connections";
import type { TikTokCreatorInfo, TikTokPrivacyLevel, TikTokPublishStatus } from "./types";

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/** Refresh the access token if it dies within this window (don't wait for the cliff). */
const REFRESH_SKEW_MS = 5 * 60 * 1000;

/** Transient = worth another tick. Permanent = fail now (auth → reconnect). */
export function isTikTokTransient(err: unknown): boolean {
  if (err instanceof TikTokApiError) {
    if (err.isAuthError) return false;
    if (err.isRateLimited) return true;
    return err.httpStatus >= 500;
  }
  return true; // network/unknown → one more tick
}

/**
 * privacy_level resolution — honor `TIKTOK_DEFAULT_PRIVACY` (default PUBLIC_TO_EVERYONE)
 * ONLY if the account+app actually allow it. An UNAUDITED app reports just `SELF_ONLY`,
 * so posts publish privately until your TikTok app audit clears — then they go public
 * automatically with no code change. Shared by the video and photo post_info builders.
 */
function resolvePrivacyLevel(creator: TikTokCreatorInfo): string {
  const desired =
    (process.env.TIKTOK_DEFAULT_PRIVACY?.trim() as TikTokPrivacyLevel) || "PUBLIC_TO_EVERYONE";
  const options = (creator.privacy_level_options ?? []) as string[];
  return options.includes(desired)
    ? desired
    : options.includes("SELF_ONLY")
      ? "SELF_ONLY"
      : (options[0] ?? "SELF_ONLY");
}

/**
 * ─── POLICY KNOB (video) ─────────────────────────────────────────────────────────
 * How a scheduled VIDEO post becomes TikTok's `post_info`. Small and explicit on purpose.
 *
 *  • privacy_level — see `resolvePrivacyLevel`.
 *  • interaction toggles — default to leaving comments/duet/stitch ON, but we must honor
 *    account-level locks TikTok reports (you can't enable what the account disabled).
 *
 * Tune the defaults here (e.g. force SELF_ONLY for a soft launch, or disable duet/stitch
 * brand-wide) — everything downstream just uses what this returns.
 */
export function resolveTikTokPostInfo(
  post: SocialPost,
  creator: TikTokCreatorInfo,
): {
  title: string;
  privacy_level: string;
  disable_comment: boolean;
  disable_duet: boolean;
  disable_stitch: boolean;
  video_cover_timestamp_ms: number;
} {
  return {
    title: (post.caption ?? "").slice(0, 2200), // caption + #hashtags live in the title
    privacy_level: resolvePrivacyLevel(creator),
    disable_comment: creator.comment_disabled ?? false,
    disable_duet: creator.duet_disabled ?? false,
    disable_stitch: creator.stitch_disabled ?? false,
    video_cover_timestamp_ms: 1000,
  };
}

/**
 * ─── POLICY KNOB (photo / carousel) ──────────────────────────────────────────────
 * How a scheduled PHOTO post becomes TikTok's `post_info`. Photo mode differs from video:
 * it has a separate `title` (heading, ≤90 runes) and `description` (body, ≤4000 runes,
 * where #hashtags / @mentions render), and supports `auto_add_music` — but has NO
 * duet/stitch/cover-timestamp (those are video-only).
 *
 *  • title       — short heading; we use the caption truncated to 90.
 *  • description — the full caption (hashtags/mentions live here).
 *  • auto_add_music — TikTok photo mode can soundtrack the slideshow; ON by default
 *    (photo posts feel unfinished without it). Set TIKTOK_PHOTO_AUTO_ADD_MUSIC=false to opt out.
 */
export function resolveTikTokPhotoPostInfo(
  post: SocialPost,
  creator: TikTokCreatorInfo,
): {
  title: string;
  description: string;
  privacy_level: string;
  disable_comment: boolean;
  auto_add_music: boolean;
} {
  const caption = post.caption ?? "";
  return {
    title: caption.slice(0, 90),
    description: caption.slice(0, 4000),
    privacy_level: resolvePrivacyLevel(creator),
    disable_comment: creator.comment_disabled ?? false,
    auto_add_music:
      (process.env.TIKTOK_PHOTO_AUTO_ADD_MUSIC?.trim() || "true").toLowerCase() !== "false",
  };
}

/** Carousel image URLs for a photo post — the full array if present, else the single cover URL. */
function tiktokPhotoUrls(post: SocialPost): string[] {
  if (post.mediaUrls?.length) return post.mediaUrls;
  return post.mediaUrl ? [post.mediaUrl] : [];
}

/** Ensure we hold a non-expired access token, refreshing (and persisting) if needed. */
async function ensureFreshToken(ctx: TikTokPublishContext): Promise<string> {
  const expMs = ctx.tokenExpiresAt ? Date.parse(ctx.tokenExpiresAt) : 0;
  const now = Date.now();
  if (ctx.accessToken && expMs - now > REFRESH_SKEW_MS) return ctx.accessToken;

  if (!ctx.refreshToken) {
    throw new TikTokApiError("refresh_token_missing", "No refresh token stored — reconnect TikTok.", 401);
  }
  if (ctx.refreshTokenExpiresAt && Date.parse(ctx.refreshTokenExpiresAt) <= now) {
    throw new TikTokApiError("refresh_token_expired", "TikTok refresh token expired — reconnect the account.", 401);
  }

  const t = await refreshAccessToken(ctx.refreshToken);
  await saveRefreshedTokens(ctx.connectionId, {
    accessToken: t.access_token,
    accessTokenExpiresAt: new Date(now + t.expires_in * 1000).toISOString(),
    refreshToken: t.refresh_token, // TikTok may rotate it — persist what came back
    refreshTokenExpiresAt: new Date(now + t.refresh_expires_in * 1000).toISOString(),
  });
  return t.access_token;
}

/** Bounded poll for a terminal status (so a fast FAILED surfaces). null = still processing. */
async function pollStatus(
  token: string,
  publishId: string,
  tries = 8,
): Promise<TikTokPublishStatus | null> {
  for (let i = 0; i < tries; i++) {
    await sleep(2500);
    try {
      const s = await openApiPost<TikTokPublishStatus>(
        "/v2/post/publish/status/fetch/",
        token,
        { publish_id: publishId },
      );
      if (s.status === "PUBLISH_COMPLETE" || s.status === "FAILED" || s.status === "SEND_TO_USER_INBOX") {
        return s;
      }
    } catch {
      // transient status-read hiccup — keep polling within budget
    }
  }
  return null;
}

function failFrom(e: unknown): PublishResult {
  const error =
    e instanceof TikTokApiError
      ? `${e.message}${e.code && e.code !== "ok" ? ` (${e.code})` : ""}`
      : e instanceof Error
        ? e.message
        : "TikTok publish failed.";
  return { ok: false, error, transient: isTikTokTransient(e) };
}

export async function publishTikTokPost(post: SocialPost): Promise<PublishResult> {
  if (!post.connectionId) {
    return { ok: false, error: "No TikTok account set for this post.", transient: false };
  }

  // Photo/carousel vs. video — picks the endpoint, body shape, and required media.
  const isPhoto = post.mediaType === "image" || post.mediaType === "carousel";
  const photoUrls = isPhoto ? tiktokPhotoUrls(post) : [];
  if (isPhoto) {
    if (photoUrls.length === 0) {
      return { ok: false, error: "TikTok photo posts require at least one public image URL.", transient: false };
    }
  } else if (!post.mediaUrl) {
    return { ok: false, error: "TikTok posts require a public video URL.", transient: false };
  }

  const ctx = await getTikTokPublishContext(post.connectionId, post.ownerClerkId);
  if (!ctx.ok) return { ok: false, error: ctx.error, transient: false };

  // Pre-commit phase: anything that fails here is safe to retry.
  let accessToken: string;
  try {
    accessToken = await ensureFreshToken(ctx);
  } catch (e) {
    return failFrom(e);
  }

  const mode = (process.env.TIKTOK_PUBLISH_MODE?.trim() || "direct").toLowerCase();

  try {
    if (mode === "inbox") {
      // Send to the creator's TikTok inbox/drafts — no audit; user finishes in-app.
      // Video: dedicated inbox endpoint. Photo: content/init with post_mode=MEDIA_UPLOAD.
      const init = isPhoto
        ? await openApiPost<{ publish_id: string }>(
            "/v2/post/publish/content/init/",
            accessToken,
            {
              source_info: { source: "PULL_FROM_URL", photo_cover_index: 0, photo_images: photoUrls },
              post_mode: "MEDIA_UPLOAD",
              media_type: "PHOTO",
            },
          )
        : await openApiPost<{ publish_id: string }>(
            "/v2/post/publish/inbox/video/init/",
            accessToken,
            { source_info: { source: "PULL_FROM_URL", video_url: post.mediaUrl } },
          );
      if (!init.publish_id) return { ok: false, error: "TikTok inbox init returned no publish_id.", transient: true };
      return { ok: true, externalId: init.publish_id };
    }

    // Direct Post: creator_info first (TikTok requirement), then init.
    const creator = await openApiPost<TikTokCreatorInfo>(
      "/v2/post/publish/creator_info/query/",
      accessToken,
      {},
    );
    const init = isPhoto
      ? await openApiPost<{ publish_id: string }>(
          "/v2/post/publish/content/init/",
          accessToken,
          {
            post_info: resolveTikTokPhotoPostInfo(post, creator),
            source_info: { source: "PULL_FROM_URL", photo_cover_index: 0, photo_images: photoUrls },
            post_mode: "DIRECT_POST",
            media_type: "PHOTO",
          },
        )
      : await openApiPost<{ publish_id: string }>(
          "/v2/post/publish/video/init/",
          accessToken,
          {
            post_info: resolveTikTokPostInfo(post, creator),
            source_info: { source: "PULL_FROM_URL", video_url: post.mediaUrl },
          },
        );
    if (!init.publish_id) {
      return { ok: false, error: "TikTok init returned no publish_id.", transient: true };
    }

    // ── COMMIT POINT ── post is now TikTok's. Never report transient past here.
    const terminal = await pollStatus(accessToken, init.publish_id);
    if (terminal?.status === "FAILED") {
      return { ok: false, error: `TikTok rejected the post: ${terminal.fail_reason ?? "unknown"}`, transient: false };
    }
    // PUBLISH_COMPLETE, SEND_TO_USER_INBOX, or still-processing → committed.
    const externalId = terminal?.publicaly_available_post_id?.[0] ?? init.publish_id;
    return { ok: true, externalId };
  } catch (e) {
    return failFrom(e);
  }
}

/**
 * Publishing engine — turns a `SocialPost` into a live Facebook/Instagram post.
 *
 *  - Facebook Page: single Graph call to /feed (text/link), /photos (image), /videos.
 *  - Instagram: the mandatory two-step — create a media container, wait for it to
 *    finish processing (videos/reels), then media_publish. IG publishing uses the
 *    linked PAGE token (stored on the IG connection).
 *
 * `publishPost()` returns a clean result the cron acts on; it also tags failures as
 * `transient` (retry next tick) vs permanent (mark failed) — see `isTransient`.
 */
import { GraphApiError, graphGet, graphPost } from "./graph";
import { getConnectionToken } from "@/lib/data/meta-connections";
import type { SocialPost } from "./types";

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/**
 * Retry budget. ─── POLICY KNOB ───
 * On a failed attempt the cron retries transient errors (rate limit / 5xx / network)
 * up to this many times, then marks the post `failed`. Auth errors (dead token) never
 * retry — they need a reconnect. Tune this, or branch `isTransient`, to change how the
 * system behaves on a bad night (e.g. alert immediately vs. quietly retry).
 */
export const MAX_PUBLISH_ATTEMPTS = 3;

/** Transient = worth another tick. Permanent = fail now. */
export function isTransient(err: unknown): boolean {
  if (err instanceof GraphApiError) {
    if (err.isAuthError) return false; // token revoked/expired → reconnect, don't spin
    if (err.isRateLimited) return true; // throttled → back off and retry
    return err.status >= 500; // Meta server hiccup → retry
  }
  return true; // network/unknown → give it one more tick
}

// --- Facebook Page -----------------------------------------------------------

async function publishFacebook(
  pageToken: string,
  pageId: string,
  post: SocialPost,
): Promise<string> {
  const caption = post.caption ?? "";

  if (post.mediaType === "video" && post.mediaUrl) {
    const r = await graphPost<{ id?: string; post_id?: string }>(
      `${pageId}/videos`,
      pageToken,
      { file_url: post.mediaUrl, description: caption },
    );
    return r.post_id ?? r.id ?? "";
  }

  if (post.mediaUrl) {
    // image / story / carousel → single photo post (carousel multi-image is a later upgrade)
    const r = await graphPost<{ id?: string; post_id?: string }>(
      `${pageId}/photos`,
      pageToken,
      { url: post.mediaUrl, caption },
    );
    return r.post_id ?? r.id ?? "";
  }

  // text / link post
  const r = await graphPost<{ id?: string }>(`${pageId}/feed`, pageToken, {
    message: caption,
    link: post.link ?? undefined,
  });
  return r.id ?? "";
}

// --- Instagram ---------------------------------------------------------------

async function waitForContainer(token: string, creationId: string, tries = 10): Promise<void> {
  for (let i = 0; i < tries; i++) {
    const s = await graphGet<{ status_code?: string }>(creationId, token, {
      fields: "status_code",
    });
    if (s.status_code === "FINISHED") return;
    if (s.status_code === "ERROR" || s.status_code === "EXPIRED") {
      throw new Error(`Instagram container ${s.status_code}`);
    }
    await sleep(2000);
  }
  // Not FINISHED in time — let media_publish try; it will error clearly if not ready.
}

async function publishInstagram(
  pageToken: string,
  igUserId: string,
  post: SocialPost,
): Promise<string> {
  if (!post.mediaUrl) throw new Error("Instagram posts require a media URL.");
  const caption = post.caption ?? "";

  const params: Record<string, string> = { caption };
  const isVideo = post.mediaType === "video" || post.mediaType === "reel";
  if (isVideo) {
    params.media_type = "REELS";
    params.video_url = post.mediaUrl;
  } else if (post.mediaType === "story") {
    params.media_type = "STORIES";
    params.image_url = post.mediaUrl;
  } else {
    params.image_url = post.mediaUrl;
  }

  const container = await graphPost<{ id: string }>(`${igUserId}/media`, pageToken, params);
  if (isVideo) await waitForContainer(pageToken, container.id);

  const published = await graphPost<{ id: string }>(`${igUserId}/media_publish`, pageToken, {
    creation_id: container.id,
  });
  return published.id;
}

// --- Top-level ---------------------------------------------------------------

export type PublishResult =
  | { ok: true; externalId: string }
  | { ok: false; error: string; transient: boolean };

export async function publishPost(post: SocialPost): Promise<PublishResult> {
  if (!post.connectionId) {
    return { ok: false, error: "No connected account set for this post.", transient: false };
  }

  const conn = await getConnectionToken(post.connectionId, post.ownerClerkId);
  if (!conn.ok) return { ok: false, error: conn.error, transient: false };

  try {
    const externalId =
      post.platform === "instagram"
        ? await publishInstagram(conn.token, conn.connection.externalId, post)
        : await publishFacebook(conn.token, conn.connection.externalId, post);

    if (!externalId) return { ok: false, error: "Publish returned no post id.", transient: true };
    return { ok: true, externalId };
  } catch (e) {
    const error =
      e instanceof GraphApiError
        ? `${e.detail.message}${e.detail.code ? ` (code ${e.detail.code})` : ""}`
        : e instanceof Error
          ? e.message
          : "Publish failed.";
    return { ok: false, error, transient: isTransient(e) };
  }
}

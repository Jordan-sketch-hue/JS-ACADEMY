/**
 * Data access for scheduled / published social posts (the calendar + publish state).
 *
 * Owner-scoped CRUD for the UI, plus cron-facing helpers that run system-wide:
 *  - `dueForPublishing()` — what's ready to go out this tick
 *  - `claimForPublish()`  — compare-and-swap (scheduled → publishing) so two
 *                           overlapping cron runs can never double-post.
 */
import { getServiceSupabase } from "@/lib/supabase/admin";
import {
  toSocialPost,
  type SocialMediaType,
  type SocialPlatform,
  type SocialPost,
  type SocialPostRow,
  type SocialPostStatus,
} from "@/lib/marketing/meta/types";

const COLS =
  "id, owner_clerk_id, campaign, asset_id, series, sequence, platform, connection_id, media_type, caption, media_url, media_urls, link, scheduled_at, status, published_at, external_post_id, error, attempts, created_at, updated_at";

export type CreatePostInput = {
  ownerClerkId: string;
  platform: SocialPlatform;
  connectionId?: string | null;
  campaign?: string | null;
  assetId?: string | null;
  series?: string | null;
  sequence?: number | null;
  mediaType?: SocialMediaType;
  caption?: string | null;
  mediaUrl?: string | null;
  /** TikTok carousel image set (ordered). Cover = mediaUrl. */
  mediaUrls?: string[] | null;
  link?: string | null;
  /** ISO timestamp. */
  scheduledAt: string;
  status?: SocialPostStatus;
};

export async function createPost(
  input: CreatePostInput,
): Promise<{ ok: true; post: SocialPost } | { ok: false; error: string }> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, error: "Supabase is not configured." };

  const row = {
    owner_clerk_id: input.ownerClerkId,
    platform: input.platform,
    connection_id: input.connectionId ?? null,
    campaign: input.campaign ?? null,
    asset_id: input.assetId ?? null,
    series: input.series ?? null,
    sequence: input.sequence ?? null,
    media_type: input.mediaType ?? "image",
    caption: input.caption ?? null,
    media_url: input.mediaUrl ?? null,
    media_urls: input.mediaUrls ?? null,
    link: input.link ?? null,
    scheduled_at: input.scheduledAt,
    status: input.status ?? "scheduled",
  };

  const { data, error } = await sb.from("social_posts").insert(row).select(COLS).single();
  if (error || !data) return { ok: false, error: error?.message ?? "Insert failed." };
  return { ok: true, post: toSocialPost(data as SocialPostRow) };
}

export async function listPosts(
  ownerClerkId: string,
  opts?: { status?: SocialPostStatus; campaign?: string; limit?: number },
): Promise<SocialPost[]> {
  const sb = getServiceSupabase();
  if (!sb) return [];
  let q = sb.from("social_posts").select(COLS).eq("owner_clerk_id", ownerClerkId);
  if (opts?.status) q = q.eq("status", opts.status);
  if (opts?.campaign) q = q.eq("campaign", opts.campaign);
  const { data, error } = await q
    .order("scheduled_at", { ascending: true })
    .limit(opts?.limit ?? 200);
  if (error || !data) return [];
  return data.map((r) => toSocialPost(r as SocialPostRow));
}

export type PostPatch = Partial<{
  caption: string | null;
  mediaUrl: string | null;
  mediaUrls: string[] | null;
  link: string | null;
  scheduledAt: string;
  status: SocialPostStatus;
  platform: SocialPlatform;
  connectionId: string | null;
  mediaType: SocialMediaType;
}>;

export async function updatePost(
  id: string,
  ownerClerkId: string,
  patch: PostPatch,
): Promise<{ ok: true; post: SocialPost } | { ok: false; error: string }> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, error: "Supabase is not configured." };

  const row: Record<string, unknown> = {};
  if (patch.caption !== undefined) row.caption = patch.caption;
  if (patch.mediaUrl !== undefined) row.media_url = patch.mediaUrl;
  if (patch.mediaUrls !== undefined) row.media_urls = patch.mediaUrls;
  if (patch.link !== undefined) row.link = patch.link;
  if (patch.scheduledAt !== undefined) row.scheduled_at = patch.scheduledAt;
  if (patch.status !== undefined) row.status = patch.status;
  if (patch.platform !== undefined) row.platform = patch.platform;
  if (patch.connectionId !== undefined) row.connection_id = patch.connectionId;
  if (patch.mediaType !== undefined) row.media_type = patch.mediaType;
  if (Object.keys(row).length === 0) return { ok: false, error: "Nothing to update." };

  const { data, error } = await sb
    .from("social_posts")
    .update(row)
    .eq("id", id)
    .eq("owner_clerk_id", ownerClerkId)
    .select(COLS)
    .single();
  if (error || !data) return { ok: false, error: error?.message ?? "Update failed." };
  return { ok: true, post: toSocialPost(data as SocialPostRow) };
}

export async function deletePost(
  id: string,
  ownerClerkId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, error: "Supabase is not configured." };
  const { error } = await sb
    .from("social_posts")
    .delete()
    .eq("id", id)
    .eq("owner_clerk_id", ownerClerkId);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

// --- cron-facing (system-wide, no owner filter) ------------------------------

export async function dueForPublishing(limit = 10): Promise<SocialPost[]> {
  const sb = getServiceSupabase();
  if (!sb) return [];
  const { data, error } = await sb
    .from("social_posts")
    .select(COLS)
    .eq("status", "scheduled")
    .lte("scheduled_at", new Date().toISOString())
    .order("scheduled_at", { ascending: true })
    .limit(limit);
  if (error || !data) return [];
  return data.map((r) => toSocialPost(r as SocialPostRow));
}

/**
 * Atomically claim a post for publishing. The `.eq("status","scheduled")` guard
 * makes this a compare-and-swap: only the first cron tick to flip it wins, so a
 * post is never published twice even if two ticks overlap.
 */
export async function claimForPublish(id: string): Promise<boolean> {
  const sb = getServiceSupabase();
  if (!sb) return false;
  const { data, error } = await sb
    .from("social_posts")
    .update({ status: "publishing" })
    .eq("id", id)
    .eq("status", "scheduled")
    .select("id")
    .maybeSingle();
  return !error && !!data;
}

export async function markPosted(id: string, externalPostId: string): Promise<void> {
  const sb = getServiceSupabase();
  if (!sb) return;
  await sb
    .from("social_posts")
    .update({
      status: "posted",
      external_post_id: externalPostId,
      published_at: new Date().toISOString(),
      error: null,
    })
    .eq("id", id);
}

/** Record a non-success outcome (back to `scheduled` for retry, or `failed`). */
export async function markResult(
  id: string,
  patch: { status: SocialPostStatus; error?: string | null; attempts?: number },
): Promise<void> {
  const sb = getServiceSupabase();
  if (!sb) return;
  const row: Record<string, unknown> = { status: patch.status };
  if (patch.error !== undefined) row.error = patch.error;
  if (patch.attempts !== undefined) row.attempts = patch.attempts;
  await sb.from("social_posts").update(row).eq("id", id);
}

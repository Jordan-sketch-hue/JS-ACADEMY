/**
 * Social media statistics — aggregates live Meta Graph API data
 * for every connected IG / Facebook Page account.
 *
 * Run server-side only. Tokens are decrypted here and never returned.
 */
import "server-only";
import { getServiceSupabase } from "@/lib/supabase/admin";
import { decryptToken } from "@/lib/marketing/meta/crypto";
import { graphGet, GraphApiError, graphVersion } from "@/lib/marketing/meta/graph";
import type { MetaConnectionRow } from "@/lib/marketing/meta/types";

const SAFE_COLS = "id, owner_clerk_id, kind, external_id, name, access_token, token_expires_at, meta, scopes, created_at, updated_at";

// ---- public shapes -----------------------------------------------------------

export type IgAccountStats = {
  connectionId: string;
  kind: "instagram";
  igUserId: string;
  username: string;
  name: string | null;
  profilePictureUrl: string | null;
  followersCount: number;
  followsCount: number;
  mediaCount: number;
  recentPosts: IgPost[];
  error?: string;
};

export type FbPageStats = {
  connectionId: string;
  kind: "facebook_page";
  pageId: string;
  name: string;
  fanCount: number;
  followersCount: number;
  pictureUrl: string | null;
  recentPosts: FbPost[];
  error?: string;
};

export type IgPost = {
  id: string;
  mediaType: string;
  timestamp: string;
  likeCount: number;
  commentsCount: number;
  mediaUrl: string | null;
  thumbnailUrl: string | null;
  caption: string | null;
};

export type FbPost = {
  id: string;
  message: string | null;
  createdTime: string;
  reactions: number;
  comments: number;
};

export type SocialStatsResult = {
  instagram: IgAccountStats[];
  facebook: FbPageStats[];
  fetchedAt: string;
};

// ---- helpers -----------------------------------------------------------------

function tryDecrypt(cipher: string | null): string | null {
  if (!cipher) return null;
  try {
    return decryptToken(cipher);
  } catch {
    return null;
  }
}

async function fetchIgStats(row: MetaConnectionRow): Promise<IgAccountStats> {
  const base: IgAccountStats = {
    connectionId: row.id,
    kind: "instagram",
    igUserId: row.external_id,
    username: row.name ?? row.external_id,
    name: row.name,
    profilePictureUrl: null,
    followersCount: 0,
    followsCount: 0,
    mediaCount: 0,
    recentPosts: [],
  };

  const token = tryDecrypt(row.access_token ?? null);
  if (!token) return { ...base, error: "Token could not be decrypted. Reconnect Meta." };

  try {
    const v = graphVersion();
    const profile = await graphGet<{
      username?: string;
      followers_count?: number;
      follows_count?: number;
      media_count?: number;
      profile_picture_url?: string;
    }>(
      `${row.external_id}`,
      token,
      { fields: "username,followers_count,follows_count,media_count,profile_picture_url" },
    );

    base.username = profile.username ?? base.username;
    base.followersCount = profile.followers_count ?? 0;
    base.followsCount = profile.follows_count ?? 0;
    base.mediaCount = profile.media_count ?? 0;
    base.profilePictureUrl = profile.profile_picture_url ?? null;

    // Fetch recent posts
    type MediaData = {
      data?: Array<{
        id: string;
        media_type?: string;
        timestamp?: string;
        like_count?: number;
        comments_count?: number;
        media_url?: string;
        thumbnail_url?: string;
        caption?: string;
      }>;
    };
    const media = await graphGet<MediaData>(
      `${row.external_id}/media`,
      token,
      { fields: "id,media_type,timestamp,like_count,comments_count,media_url,thumbnail_url,caption", limit: 9 },
    );
    base.recentPosts = (media.data ?? []).map((p) => ({
      id: p.id,
      mediaType: p.media_type ?? "IMAGE",
      timestamp: p.timestamp ?? "",
      likeCount: p.like_count ?? 0,
      commentsCount: p.comments_count ?? 0,
      mediaUrl: p.media_url ?? null,
      thumbnailUrl: p.thumbnail_url ?? null,
      caption: p.caption ?? null,
    }));
  } catch (err) {
    base.error = err instanceof GraphApiError ? err.detail.message : String(err);
  }

  return base;
}

async function fetchFbPageStats(row: MetaConnectionRow): Promise<FbPageStats> {
  const base: FbPageStats = {
    connectionId: row.id,
    kind: "facebook_page",
    pageId: row.external_id,
    name: row.name ?? row.external_id,
    fanCount: 0,
    followersCount: 0,
    pictureUrl: null,
    recentPosts: [],
  };

  const token = tryDecrypt(row.access_token ?? null);
  if (!token) return { ...base, error: "Token could not be decrypted. Reconnect Meta." };

  try {
    const page = await graphGet<{
      name?: string;
      fan_count?: number;
      followers_count?: number;
      picture?: { data?: { url?: string } };
    }>(
      `${row.external_id}`,
      token,
      { fields: "name,fan_count,followers_count,picture" },
    );
    base.name = page.name ?? base.name;
    base.fanCount = page.fan_count ?? 0;
    base.followersCount = page.followers_count ?? 0;
    base.pictureUrl = page.picture?.data?.url ?? null;

    type PostData = {
      data?: Array<{
        id: string;
        message?: string;
        created_time?: string;
        reactions?: { summary?: { total_count?: number } };
        comments?: { summary?: { total_count?: number } };
      }>;
    };
    const posts = await graphGet<PostData>(
      `${row.external_id}/posts`,
      token,
      { fields: "message,created_time,reactions.summary(true),comments.summary(true)", limit: 6 },
    );
    base.recentPosts = (posts.data ?? []).map((p) => ({
      id: p.id,
      message: p.message ?? null,
      createdTime: p.created_time ?? "",
      reactions: p.reactions?.summary?.total_count ?? 0,
      comments: p.comments?.summary?.total_count ?? 0,
    }));
  } catch (err) {
    base.error = err instanceof GraphApiError ? err.detail.message : String(err);
  }

  return base;
}

// ---- main export -------------------------------------------------------------

export async function getSocialStats(ownerClerkId: string): Promise<SocialStatsResult> {
  const sb = getServiceSupabase();
  const result: SocialStatsResult = {
    instagram: [],
    facebook: [],
    fetchedAt: new Date().toISOString(),
  };

  if (!sb) return result;

  const { data, error } = await sb
    .from("meta_connections")
    .select(SAFE_COLS)
    .eq("owner_clerk_id", ownerClerkId)
    .in("kind", ["instagram", "facebook_page"])
    .order("created_at", { ascending: true });

  if (error || !data) return result;

  await Promise.all(
    (data as MetaConnectionRow[]).map(async (row) => {
      if (row.kind === "instagram") {
        result.instagram.push(await fetchIgStats(row));
      } else if (row.kind === "facebook_page") {
        result.facebook.push(await fetchFbPageStats(row));
      }
    }),
  );

  return result;
}

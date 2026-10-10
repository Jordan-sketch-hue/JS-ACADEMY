/**
 * GET  /api/v1/marketing/posts            — list the operator's scheduled/published posts
 * POST /api/v1/marketing/posts            — schedule a new post
 */
import { NextResponse, type NextRequest } from "next/server";
import { requireOwnerClerkId } from "@/lib/session";
import { createPost, listPosts } from "@/lib/data/social-posts";
import type {
  SocialMediaType,
  SocialPlatform,
  SocialPostStatus,
} from "@/lib/marketing/meta/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PLATFORMS: SocialPlatform[] = ["facebook", "instagram", "tiktok"];
const MEDIA: SocialMediaType[] = ["text", "image", "video", "story", "reel", "carousel"];
const str = (v: unknown): string | undefined => (typeof v === "string" && v.length ? v : undefined);

export async function GET(req: NextRequest) {
  let owner: string;
  try {
    owner = await requireOwnerClerkId();
  } catch {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const url = new URL(req.url);
  const status = (url.searchParams.get("status") as SocialPostStatus) || undefined;
  const campaign = url.searchParams.get("campaign") || undefined;
  const posts = await listPosts(owner, { status, campaign });
  return NextResponse.json({ ok: true, posts });
}

export async function POST(req: NextRequest) {
  let owner: string;
  try {
    owner = await requireOwnerClerkId();
  } catch {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const b = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!b) return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });

  const platform = str(b.platform) as SocialPlatform | undefined;
  if (!platform || !PLATFORMS.includes(platform)) {
    return NextResponse.json(
      { ok: false, error: "platform must be 'facebook', 'instagram', or 'tiktok'." },
      { status: 400 },
    );
  }
  const scheduledAt = str(b.scheduledAt);
  if (!scheduledAt || Number.isNaN(Date.parse(scheduledAt))) {
    return NextResponse.json({ ok: false, error: "scheduledAt (ISO 8601) is required." }, { status: 400 });
  }
  const mediaTypeRaw = str(b.mediaType) as SocialMediaType | undefined;
  let mediaType: SocialMediaType =
    mediaTypeRaw && MEDIA.includes(mediaTypeRaw) ? mediaTypeRaw : "image";
  let mediaUrl = str(b.mediaUrl) ?? null;
  // Carousel image set (TikTok photo posts): an array of public https URLs.
  let mediaUrls: string[] | null = Array.isArray(b.mediaUrls)
    ? b.mediaUrls.filter((u): u is string => typeof u === "string" && u.trim().length > 0)
    : null;
  if (mediaUrls && mediaUrls.length === 0) mediaUrls = null;

  if (platform === "instagram" && !mediaUrl) {
    return NextResponse.json(
      { ok: false, error: "Instagram posts require a mediaUrl (IG has no text-only posts)." },
      { status: 400 },
    );
  }
  if (platform === "tiktok") {
    // TikTok publishes either a video (Direct Post / inbox) or a PHOTO/carousel.
    if (mediaType === "image" || mediaType === "carousel") {
      const urls = mediaUrls ?? (mediaUrl ? [mediaUrl] : []);
      if (urls.length === 0) {
        return NextResponse.json(
          { ok: false, error: "TikTok photo posts require at least one public image URL." },
          { status: 400 },
        );
      }
      mediaType = urls.length > 1 ? "carousel" : "image";
      mediaUrl = urls[0]; // cover / thumbnail (keeps the timeline preview + single-URL paths working)
      mediaUrls = urls.length > 1 ? urls : null; // store the set only for true carousels
    } else {
      if (!mediaUrl) {
        return NextResponse.json(
          { ok: false, error: "TikTok posts require a public video URL (mediaUrl)." },
          { status: 400 },
        );
      }
      mediaType = "video";
      mediaUrls = null;
    }
  }

  const result = await createPost({
    ownerClerkId: owner,
    platform,
    connectionId: str(b.connectionId) ?? null,
    campaign: str(b.campaign) ?? null,
    assetId: str(b.assetId) ?? null,
    series: str(b.series) ?? null,
    sequence: typeof b.sequence === "number" ? b.sequence : null,
    mediaType,
    caption: str(b.caption) ?? null,
    mediaUrl,
    mediaUrls,
    link: str(b.link) ?? null,
    scheduledAt: new Date(scheduledAt).toISOString(),
    status: str(b.status) === "draft" ? "draft" : "scheduled",
  });
  if (!result.ok) return NextResponse.json(result, { status: 500 });
  return NextResponse.json(result, { status: 201 });
}

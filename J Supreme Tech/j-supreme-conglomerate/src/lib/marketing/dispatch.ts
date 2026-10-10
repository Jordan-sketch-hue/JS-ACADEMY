/**
 * Platform-agnostic publish dispatch.
 *
 * The cron doesn't care whether a post is Meta or TikTok — it just claims due posts and
 * asks this to publish them. Route by `post.platform` so each platform's engine (and its
 * own token/retry quirks) stays self-contained.
 */
import type { SocialPost } from "@/lib/marketing/meta/types";
import { MAX_PUBLISH_ATTEMPTS, publishPost, type PublishResult } from "@/lib/marketing/meta/publish";
import { publishTikTokPost } from "@/lib/marketing/tiktok/publish";

export { MAX_PUBLISH_ATTEMPTS };
export type { PublishResult };

export function publishSocialPost(post: SocialPost): Promise<PublishResult> {
  if (post.platform === "tiktok") return publishTikTokPost(post);
  return publishPost(post); // facebook | instagram
}

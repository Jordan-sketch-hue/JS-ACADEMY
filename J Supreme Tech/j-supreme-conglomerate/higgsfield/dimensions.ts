// Platform dimension presets — maps to Higgsfield supported resolutions + aspect ratios

export type Platform =
  | "instagram_feed_square"
  | "instagram_feed_portrait"
  | "instagram_reels"
  | "instagram_story"
  | "twitter_post"
  | "linkedin_post"
  | "youtube_thumbnail"
  | "tiktok_video"
  | "facebook_post";

export type Dimension = {
  label: string;
  resolution: "480p" | "720p" | "1080p";
  aspect_ratio: string;
};

// All aspect_ratios here are valid for both Soul 2 (image) and Wan 3.0 / Seedance 2.5 (video)
export const DIMENSIONS: Record<Platform, Dimension> = {
  instagram_feed_square:   { label: "IG Feed Square",   resolution: "720p", aspect_ratio: "1:1"  },
  instagram_feed_portrait: { label: "IG Feed Portrait", resolution: "720p", aspect_ratio: "3:4"  },
  instagram_reels:         { label: "IG Reels",         resolution: "720p", aspect_ratio: "9:16" },
  instagram_story:         { label: "IG Story",         resolution: "720p", aspect_ratio: "9:16" },
  twitter_post:            { label: "Twitter/X Post",   resolution: "720p", aspect_ratio: "16:9" },
  linkedin_post:           { label: "LinkedIn Post",    resolution: "720p", aspect_ratio: "4:3"  },
  youtube_thumbnail:       { label: "YouTube Thumb",    resolution: "720p", aspect_ratio: "16:9" },
  tiktok_video:            { label: "TikTok Video",     resolution: "720p", aspect_ratio: "9:16" },
  facebook_post:           { label: "Facebook Post",    resolution: "720p", aspect_ratio: "4:3"  },
};

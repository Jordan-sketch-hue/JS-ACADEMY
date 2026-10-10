/**
 * TikTok integration — API response types.
 *
 * Connected TikTok accounts and scheduled TikTok posts reuse the shared
 * `MetaConnection` / `SocialPost` models (kind="tiktok_account", platform="tiktok").
 * These types only describe what comes back from TikTok's own endpoints.
 */

/** Token endpoint response — same shape for authorization_code and refresh_token grants. */
export type TikTokTokenResponse = {
  access_token: string;
  /** Seconds until the access token dies (~86400 = 24h). */
  expires_in: number;
  refresh_token: string;
  /** Seconds until the REFRESH token dies (~31536000 = 365d). */
  refresh_expires_in: number;
  /** Stable per-user id for this app — used as the connection's external_id. */
  open_id: string;
  scope: string;
  token_type: string; // "Bearer"
};

/** /v2/user/info/ → data.user */
export type TikTokUserInfo = {
  open_id?: string;
  union_id?: string;
  display_name?: string;
  avatar_url?: string;
  username?: string;
};

export type TikTokPrivacyLevel =
  | "PUBLIC_TO_EVERYONE"
  | "MUTUAL_FOLLOW_FRIENDS"
  | "FOLLOWER_OF_CREATOR"
  | "SELF_ONLY";

/**
 * /v2/post/publish/creator_info/query/ → data
 * MUST be fetched immediately before a Direct Post — `privacy_level_options` tells you
 * which privacy levels the account+app actually allow (an unaudited app gets ONLY
 * `SELF_ONLY`). The interaction flags reflect account-level locks you must honor.
 */
export type TikTokCreatorInfo = {
  creator_avatar_url?: string;
  creator_username?: string;
  creator_nickname?: string;
  privacy_level_options: TikTokPrivacyLevel[] | string[];
  comment_disabled: boolean;
  duet_disabled: boolean;
  stitch_disabled: boolean;
  max_video_post_duration_sec: number;
};

export type TikTokPublishStatusValue =
  | "PROCESSING_UPLOAD"
  | "PROCESSING_DOWNLOAD"
  | "SEND_TO_USER_INBOX"
  | "PUBLISH_COMPLETE"
  | "FAILED";

/** /v2/post/publish/status/fetch/ → data */
export type TikTokPublishStatus = {
  status: TikTokPublishStatusValue;
  fail_reason?: string;
  publicaly_available_post_id?: string[]; // [sic] TikTok's spelling
  downloaded_bytes?: number;
  uploaded_bytes?: number;
};

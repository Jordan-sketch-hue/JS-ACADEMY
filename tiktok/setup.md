# TikTok Content Posting API — J Supreme Marketing

## One-time setup (5 steps)

### 1. Set your credentials
Copy `.env.example` to `.env`:
```
cp tiktok/.env.example tiktok/.env
```
Fill in `TIKTOK_CLIENT_KEY` and `TIKTOK_CLIENT_SECRET` from your TikTok Developer Portal.

### 2. Configure redirect URI
In your TikTok app settings → **Login Kit** → add:
```
http://localhost:3000/callback
```
Make sure `TIKTOK_REDIRECT_URI` in `.env` matches exactly.

### 3. Add required scopes
In Developer Portal → your app → **Products** → enable:
- `video.upload`
- `video.publish`
- `user.info.basic`

### 4. Run the OAuth flow
```bash
node tiktok/auth.mjs
```
Opens the TikTok authorization URL in your terminal. Open it in your browser, approve the app on **@jsuprememarketing**, and the tokens are saved to `.env` automatically.

### 5. Verify connection
```bash
node tiktok/post-video.mjs --url "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4" --title "Test post — delete me" --draft --dry-run
```

---

## Posting a video

**From a local file:**
```bash
node tiktok/post-video.mjs \
  --file ./videos/reel1-invisible-business.mp4 \
  --title "Your caption here"
```

**From a public URL (simpler — no file needed):**
```bash
node tiktok/post-video.mjs \
  --url "https://your-cdn.com/reel.mp4" \
  --title "Your caption here"
```

**Post as draft first (review before publishing):**
```bash
node tiktok/post-video.mjs --file ./video.mp4 --title "Caption" --draft
```

**Dry run (see payload, no post):**
```bash
node tiktok/post-video.mjs --file ./video.mp4 --title "Caption" --dry-run
```

---

## Batch posting all 3 JSM reels

Once your videos are in `./videos/`:
```bash
node tiktok/schedule-reels.mjs --dry-run   # preview first
node tiktok/schedule-reels.mjs             # then post
```
Posts run sequentially with 60-second gaps. Captions are pre-filled with correct hashtags per reel.

---

## Token notes
- **Access token:** 24-hour expiry — auto-refreshed by `token.mjs`
- **Refresh token:** 365-day expiry — re-run `auth.mjs` once a year
- Tokens are stored in `tiktok/.env` (gitignored — never commit this file)

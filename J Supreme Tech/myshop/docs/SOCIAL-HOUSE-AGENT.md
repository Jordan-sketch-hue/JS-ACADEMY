# Social House AI Agent — System Design

## Vision
An AI-powered social commerce feed ("The Feed") combining TikTok-scroll UX, shoppable posts,
user-generated inspiration, and an AI content engine that auto-generates editorial drops,
responds to DMs, and runs daily operations hands-free.

---

## Architecture

### Core Stack
- **Frontend**: Next.js 16 App Router (mineandyoursshop.online)
- **Database**: Supabase (ibtadbwtrxglujkzqofs) — `myshop_inspire_posts`, `myshop_products`, user follows/prefs
- **AI Image**: Higgsfield Soul V2 (no text, $0.0032/img) · Ideogram (text baked in)
- **AI Video**: Higgsfield Wan 3.0 ($0.020/s)
- **AI Agent Brain**: Claude claude-sonnet-4-6 (Anthropic API)
- **Background Jobs**: Railway (always-on agent)
- **Payments**: HandyPay (JMD/USD)

---

## 1. Feed Modes

### Mobile
- Default: TikTok full-screen vertical scroll (swipe up = next post)
- Each post fills viewport: image/video, product tags, like/save
- Snap scrolling via CSS `scroll-snap-type: y mandatory`

### Desktop
- Default: Pinterest masonry grid (2-4 col)
- Toggle: TikTok-style centered column scroll
- Preference saved to localStorage + user profile

---

## 2. Post Types

| Type | Source | Schema |
|------|--------|--------|
| Editorial | AI Agent | `type: "editorial"` |
| Community Share | User upload | `type: "community"` |
| Product Drop | Admin | `type: "product_drop"` |
| Story | 24hr ephemeral | `type: "story"` |

All post types: `shoppable_product_ids[]` → links to `myshop_products`

---

## 3. AI Content Agent (Daily Operations)

### Schedule (Railway cron)
- **6AM**: Generate 3 editorial posts (Higgsfield images + AI copy)
- **12PM**: Post product highlight with shoppable tags
- **6PM**: Story drop (trending theme of the day)

### Agent Workflow (per post)
1. Claude selects theme from `content_calendar` or generates one
2. Higgsfield Soul V2 generates image → uploads to Supabase Storage
3. Claude writes caption, tags, hashtags
4. Ideogram generates text overlay if needed
5. Insert into `myshop_inspire_posts` → auto-appears in feed

### Agent Inputs
- Product catalog (`myshop_products` via Supabase)
- Recent top posts (by likes/saves)
- User follow/preference signals
- Seasonal/trending context

---

## 4. Topic & Theme Following

### Supabase Tables (new)
```sql
CREATE TABLE myshop_feed_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  emoji text,
  cover_url text
);

CREATE TABLE myshop_user_follows (
  user_id uuid REFERENCES auth.users,
  topic_slug text,
  PRIMARY KEY (user_id, topic_slug)
);
```

### UI
- Topic chips on /inspire: Minimal · Luxe · Bold · Earthy · Dark · Coastal · etc.
- "Follow topic" button → saves to `myshop_user_follows`
- Feed filters to followed topics on return visit

---

## 5. Stories
- 24-hr ephemeral posts (auto-deleted or archived by agent)
- Appear in horizontal story row at top of feed
- Each story: product tag + "Shop Now" CTA
- AI agent generates 1 story/day per active theme

---

## 6. Keys & Credentials Needed

| Service | Env Var | Location |
|---------|---------|----------|
| Anthropic API | `ANTHROPIC_API_KEY` | Vercel + Railway |
| Higgsfield API | `HIGGSFIELD_API_KEY` | Railway agent only |
| Ideogram API | `IDEOGRAM_API_KEY` | Railway + Vercel |
| Supabase URL | `NEXT_PUBLIC_SUPABASE_URL` | Already set |
| Supabase Service Role | `SUPABASE_SERVICE_ROLE_KEY` | Already set |
| HandyPay API | `HANDYPAY_API_KEY` | Already set |

---

## 7. Railway Agent Service

```
Service: myshop-social-agent
Runtime: Node.js 20
Repo: same as myshop (monorepo agent/ folder)
Cron: 0 6,12,18 * * *  (6am, 12pm, 6pm daily)
Env: all keys above
```

---

## 8. Build Order

1. ✅ Feed UI: TikTok scroll (mobile) + grid/scroll toggle (desktop)
2. ✅ Topic follow system (DB tables + UI)
3. ✅ Stories row (horizontal scroll, 24hr)
4. Railway agent scaffold (content gen loop)
5. Higgsfield + Ideogram image pipeline
6. Claude copy generation (captions, tags)
7. Shoppable product tag overlay on posts
8. Daily ops cron + monitoring

---

## Status: OPEN — Begin after checkout deploy
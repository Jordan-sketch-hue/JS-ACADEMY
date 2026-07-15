# J Supreme — Creative Assets

Brand identity system, architecture diagrams, and design mockups for JST and JSM.

## Live Preview

**[View Brand Deck →](https://claude.ai/code/artifact/7f4cd687-2691-40c1-92ed-6e0f70d923f7)**

## Files

### `jst-jsm-brand-identity.html`

Full 7-slide brand deck — open in any browser.

| Slide | Content |
|---|---|
| Brand Overview | JST (black) vs JSM (gold) split identity |
| Identity System | Color palette, typography, logo lockups |
| Architecture | Full 10-card tech stack diagram |
| Instagram Carousel | 3-post strategy mockup + feed grid |
| Website + App | JST site mockup + JSM mobile dashboard |
| Plugin Stack | All 84 active plugins organized by function |
| Creative Pipeline | Pixabay → Groq/Claude → Adobe → Supabase → Postiz |

## Brand

- **JST** = J Supreme Technology (websites, apps, infrastructure)
- **JSM** = J Supreme Marketing (social, automation, ads, growth)
- **Colors**: Void Black `#0A0A0A` · Supreme Gold `#C9A84C` · Off White `#F5F5F0`
- **Type**: Bebas Neue (display) · Futura PT Bold (labels) · Sinter (body)

## API Stack (no plugins required)

| Tool | Endpoint | Free Tier |
|---|---|---|
| Pixabay | pixabay.com/api/ | 25k req/hr |
| Groq | api.groq.com/openai/v1 | 300k tokens/min (llama-3.3-70b, mixtral-8x7b) |
| Claude | api.anthropic.com/v1 | Pay-per-use (Haiku for speed, Sonnet for quality) |
| Supabase | db.ibtadbwtrxglujkzqofs.supabase.co | Active (us-west-2, Postgres 17) |

## Creative Pipeline Flow

```
Pixabay API → Groq/Claude (caption gen) → Adobe CC (design) → Supabase (store) → Postiz + Zapier (publish)
```

- **Pixabay**: 4M+ free images & videos. `GET /api/?key=KEY&q=luxury+brand&video_type=film`
- **Groq**: Sub-1s inference. OpenAI-compatible. `api.groq.com/openai/v1/chat/completions`
- **Claude**: Deep reasoning & brand voice. `api.anthropic.com/v1/messages`
- **Supabase tables**: `content_queue`, `asset_library`, `campaign_runs`, `analytics_events`
- **Postiz + Zapier**: Trigger on Supabase insert → auto-post to Instagram, TikTok, LinkedIn, X

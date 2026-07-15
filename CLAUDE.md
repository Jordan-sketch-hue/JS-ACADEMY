# JS-ACADEMY — Project Memory

## Identity
- **Jordan** (jordanroad631@gmail.com / global.jsuprememarketing@gmail.com)
- **JST** = J Supreme Technology (websites, apps, infrastructure)
- **JSM** = J Supreme Marketing (social, automation, ads, growth)

## Brand
- Colors: Void Black `#0A0A0A` · Supreme Gold `#C9A84C` · Off White `#F5F5F0`
- Fonts: Bebas Neue (display) · Space Grotesk (labels + body)
- Adobe Fonts kit: `xvb1nwt` → `<link rel="stylesheet" href="https://use.typekit.net/xvb1nwt.css">`

## Tool Stack

### Video / Encoding (no key required)
| Tool | Version | Use |
|---|---|---|
| ffmpeg | 8.1.1 (local) | All video encoding — reels, MP4 exports, captions, audio mux |
| Puppeteer + Chrome (headless) | installed | Build reels as HTML animations, screenshot frame-by-frame, ffmpeg stitches to MP4 |
| Remotion | `reels-studio/` | React-based data-driven reels |
| faster-whisper | local | Auto-captions |

### Voiceovers
| Tool | Use | Key |
|---|---|---|
| edge-tts (Microsoft neural) | Default VO — free | No key |
| ElevenLabs | Premium VO (Dr. Gooden on Language Cradle) | `ELEVENLABS_API_KEY` in `language-cradle-app/.env.local` |
| Azure Speech | Accent-authentic tutors (Language Cradle) | In `language-cradle-app/.env.local` |

### Images / Editing (no key required)
| Tool | Use | Key |
|---|---|---|
| ImageMagick + sharp | Resize, compress, ad-set crops, WebP/AVIF | No key |
| rembg | Background removal | No key |
| Inkscape | SVG → hi-res PNG / print PDF (logos) | No key |
| Adobe MCP (this session) | Adobe Stock photo licensing, image edits, Express templates | Adobe account (OAuth) |
| Runway (Gen-4) | AI image/video gen — `_creative-toolkit/ai-media/` | `RUNWAYML_API_SECRET` — not yet entered |

### Stock Media (A-Roll / B-Roll / Music)
| Source | Type | Endpoint | Auth | Limit | Key |
|---|---|---|---|---|---|
| Pixabay | Photos + Videos | `pixabay.com/api/` | `?key=` param | 25k req/hr | `PIXABAY_API_KEY` in `.env` |
| Pixabay Music | Royalty-free music | `pixabay.com/api/?type=music` | `?key=` param | 25k req/hr | Same key |
| Pexels | Photos + Videos | `api.pexels.com/v1/` | `Authorization:` header | 200 req/hr · 20k/month | `PEXELS_API_KEY` in `.env` |
| Unsplash | Editorial photos | `api.unsplash.com/` | `Authorization: Client-ID` header | 50 req/hr (demo) · 1k/hr (prod) | `UNSPLASH_ACCESS_KEY` in `.env` |
| Coverr | Cinematic b-roll video loops | `coverr.co` | None — direct download | Unlimited | No key |
| YouTube Audio Library | Copyright-safe music | Manual download | None | Unlimited | No key |

### AI / LLM APIs
| Tool | Endpoint | Free Tier |
|---|---|---|
| Groq | `api.groq.com/openai/v1` | 300k tokens/min — llama-3.3-70b, mixtral-8x7b |
| Claude | `api.anthropic.com/v1` | Pay-per-use — Haiku for speed, Sonnet for quality |
| Pixabay | `pixabay.com/api/` | 25k req/hr — 4M+ stock images/videos |

### Infrastructure
| Tool | Details |
|---|---|
| Supabase — JSupremeConglomerate | `ibtadbwtrxglujkzqofs.supabase.co` · us-west-2 · Postgres 17 · ACTIVE |
| Supabase — Jordan-sketch-hue's Project | `ciggiwpztuxkmbaccrlp` · us-east-2 |

### Creative Pipeline
Pixabay API → Groq / Claude API → Adobe CC / Canva → Supabase → Postiz + Zapier → Instagram / TikTok / LinkedIn / X

## Active Branch
`claude/creative-assets-design-arch-s7smv8` on `Jordan-sketch-hue/JS-ACADEMY`

## Key Files
- `creative-assets/jst-jsm-brand-identity.html` — 7-slide brand deck
- `creative-assets/README.md` — API stack reference

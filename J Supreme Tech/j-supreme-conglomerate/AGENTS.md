# J Supreme Conglomerate — Agent Handoff Document

## What this is

Jordan's primary operator workspace at jsupremeconglomerate.online.
Central command for all 13 client brands — CRM, invoices, contracts, JARVIS AI hub, marketing, sales, ops board, push notifications, Angel inbox bot, WhatsApp reader, Deriv trading, site-kit deployment.

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 (App Router) / TypeScript |
| Auth | Clerk (sign-in/sign-up) |
| Database | Supabase `ibtadbwtrxglujkzqofs` |
| AI | Groq / Claude (Anthropic) |
| Push | Web Push API (VAPID) |
| Email | Resend |
| Social | Meta Graph API + TikTok API |
| Payments | WiPay (suite provisioning) |
| Fonts | Inter via next/font |

---

## Required Env Vars

| Var | Purpose |
|-----|---------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk frontend auth |
| `CLERK_SECRET_KEY` | Clerk backend |
| `NEXT_PUBLIC_SUPABASE_URL` | ibtadbwtrxglujkzqofs |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role (server) |
| `ANTHROPIC_API_KEY` | Claude — AI workflows, think, CRM parse |
| `GROQ_API_KEY` | Fast LLM fallback |
| `RESEND_API_KEY` | Email delivery |
| `VERCEL_TOKEN` | Vercel API — site-kit deploy, projects, env |
| `VAPID_PUBLIC_KEY` | Push VAPID public |
| `VAPID_PRIVATE_KEY` | Push VAPID private |
| `VAPID_SUBJECT` | mailto: VAPID subject |
| `CRON_SECRET` | Bearer token for cron auth |
| `META_APP_ID` + `META_APP_SECRET` | Meta Graph API OAuth |
| `TIKTOK_CLIENT_KEY` + `TIKTOK_CLIENT_SECRET` | TikTok API OAuth |
| `NEXT_PUBLIC_SITE_URL` | `https://jsupremeconglomerate.online` |

---

## Page Routes (65+ total)

### Public
| Route | Purpose |
|-------|---------|
| `/` | Operator landing (J Supreme branding) |
| `/start` | Redirect → conglomerate (legacy entry) |
| `/book` | Client booking page |
| `/launch` | Launch showcase for client brands |
| `/launch/*.png` | OG image routes (j-supreme, bp-couriers, aboo-tours, solace) |
| `/sign/[token]` | Contract e-signature page |
| `/intake/[token]` | Client intake form (token-gated) |
| `/privacy` | Privacy policy |
| `/sign-in` | Clerk sign-in |
| `/sign-up` | Clerk sign-up |
| `/access-denied` | 403 page |

### App (Clerk-protected — all under `/(app)`)
| Route | Purpose |
|-------|---------|
| `/dashboard` | Main operator dashboard |
| `/jarvis` | JARVIS AI Hub — main entry |
| `/jarvis/angel` | Angel inbox bot (IG DMs + email triage) |
| `/jarvis/whatsapp` | WhatsApp message reader + AI draft |
| `/jarvis/ops` | Client Ops Autopilot board |
| `/sales` | Sales department overview |
| `/sales/prospects` | Prospect list |
| `/sales/inbox` | Sales inbox |
| `/sales/templates` | Email templates |
| `/sales/campaigns` | Campaign manager |
| `/sales/emails` | Sent emails log |
| `/sales/sop` | Sales SOP reference |
| `/sales/settings` | Sales settings |
| `/marketing` | Marketing command center |
| `/crm` | Client CRM |
| `/projects` | Active projects board |
| `/contracts` | Contract list |
| `/contracts/new` | New contract creation |
| `/contracts/[id]` | Contract detail + send |
| `/invoices` | Invoice list |
| `/invoices/new` | New invoice creation |
| `/invoices/[id]` | Invoice detail |
| `/earnings` | Revenue + earnings dashboard |
| `/client-showcase` | Client portfolio showcase |
| `/client-feedback` | Client feedback tracker |
| `/sites` | Managed sites overview |
| `/suite` | Supreme Suite operator panel |
| `/studio` | Creative studio |
| `/assets` | Brand assets library |
| `/meetings` | Zoom + calendar meetings |
| `/calendar` | Calendar view |
| `/reports` | Analytics reports |
| `/analytics` | Site + business analytics |
| `/pipeline-intake` | Intake pipeline view |
| `/backoffice` | Internal credentials + backoffice |
| `/need-to-know` | Critical operational notes |
| `/market-pricing` | Competitor / market pricing |
| `/subscriptions` | Client subscription tracker |
| `/budget` | Budget overview |
| `/todos` | Task todos |
| `/todos/learning` | Learning todos |
| `/ai-workflows` | AI workflow builder |
| `/automations` | Automation rules |
| `/scripts` | JARVIS scripts manager |
| `/sops` | SOPs viewer |
| `/cyber` | Cybersecurity dashboard |
| `/cyber/fleet` | Fleet security status |
| `/cyber/playbooks` | Security playbooks |
| `/cyber/compliance` | Compliance tracker |
| `/web-toolset` | Web toolset utilities |
| `/site-kit` | Site-kit deployment UI |
| `/social` | Social posting hub |
| `/think` | AI "think" scratchpad |
| `/vision` | Vision / strategy board |
| `/wire` | Wire/transfer tracker |
| `/trading` | Trading cockpit overview |
| `/trading/deriv` | Deriv integration view |
| `/mt5-markups` | MT5 chart markup dashboard (iframe) |
| `/daily-brief` | Daily brief digest |
| `/settings` | User/workspace settings |

### Print layouts
| Route | Purpose |
|-------|---------|
| `/(inv-print)/invoices/[id]/print` | Invoice print view |
| `/(ct-print)/contracts/[id]/print` | Contract print view |

---

## API Routes (65+ total)

### Health / System
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/health` | GET | Health check — returns `{ok: true}` |
| `/api/v1/version` | GET | App version info |
| `/api/v1/system-status` | GET | Full system status (Supabase, Vercel, push) |
| `/api/v1/workspace-context` | GET | Workspace context for AI agents |

### AI
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/v1/ai/chat` | POST | General AI chat (Claude/Groq) |
| `/api/v1/ai/actions` | POST | AI action executor |
| `/api/v1/ai/crm-parse` | POST | AI parse raw text → CRM entry |
| `/api/v1/think` | POST | AI "think" scratchpad — free-form reasoning |

### JARVIS Angel (IG DM + email inbox bot)
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/v1/jarvis/angel/sync` | POST | Sync IG DMs + emails into angel_messages |
| `/api/v1/jarvis/angel/inbox` | GET | Get angel inbox messages |
| `/api/v1/jarvis/angel/draft` | POST | AI-draft reply to message |
| `/api/v1/jarvis/angel/send` | POST | Send drafted reply |
| `/api/v1/jarvis/angel/status` | GET | Angel bot status |
| `/api/v1/jarvis/angel/settings` | GET/PATCH | Angel settings |
| `/api/v1/jarvis/angel/ig/connect` | GET | Start IG OAuth |
| `/api/v1/jarvis/angel/ig/callback` | GET | IG OAuth callback |
| `/api/cron/jarvis-angel` | POST | Cron: hourly angel sync |

### JARVIS WhatsApp
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/v1/jarvis/whatsapp/updates` | POST | WhatsApp webhook updates |
| `/api/v1/jarvis/whatsapp/mark` | POST | Mark messages read |
| `/api/v1/jarvis/whatsapp/draft` | POST | AI draft WhatsApp reply |
| `/api/v1/jarvis/whatsapp/send` | POST | Send WhatsApp message |

### JARVIS Hub
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/v1/jarvis/hub` | GET/POST | JARVIS hub status + commands |

### Ops Board
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/ops/tickets` | GET/POST | List/create ops tickets |
| `/api/ops/send` | POST | Send ops notification |
| `/api/ops/approve` | POST | Approve ops action |
| `/api/ops/action` | POST | Execute ops action |
| `/api/ops/inbound-email` | POST | Inbound email → ops ticket |

### Marketing
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/v1/marketing/posts` | GET/POST | List/create marketing posts |
| `/api/v1/marketing/posts/[id]` | GET/PATCH/DELETE | Single post CRUD |
| `/api/v1/marketing/connections` | GET/POST | Social platform connections |
| `/api/v1/marketing/meta/connect` | GET | Start Meta OAuth |
| `/api/v1/marketing/meta/callback` | GET | Meta OAuth callback |
| `/api/v1/marketing/tiktok/connect` | GET | Start TikTok OAuth |
| `/api/v1/marketing/tiktok/callback` | GET | TikTok OAuth callback |
| `/api/cron/marketing-publish` | POST | Cron: publish scheduled posts |

### Sales
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/sales/inbound` | POST | Inbound sales lead |
| `/api/sales/events` | POST | Sales event tracking |
| `/api/sales/seed` | POST | Seed prospect data |
| `/api/sales/unsubscribe` | GET | Unsubscribe from sales emails |
| `/api/cron/sales-engine` | POST | Cron: run sales automation |

### Vercel / Site-Kit
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/v1/vercel/projects` | GET | List Vercel projects |
| `/api/v1/vercel/deployments` | GET | List deployments |
| `/api/v1/vercel/revert` | POST | Revert deployment |
| `/api/v1/vercel/env` | GET/POST | Manage env vars |
| `/api/v1/site-kit` | GET | List site-kit configs |
| `/api/v1/site-kit/deploy` | POST | Trigger site-kit deploy |

### Notifications / Push
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/push/subscribe` | POST | Register push subscription |
| `/api/push/notify` | POST | Send push notification |
| `/api/push/test` | POST | Test push |
| `/api/notify/digest` | POST | Send daily digest notification |
| `/api/notify/eod` | POST | End-of-day notification |
| `/api/notify/error` | POST | Error alert notification |

### Other
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/book` | POST | Client booking submission |
| `/api/v1/intake/forms` | GET/POST | Intake forms |
| `/api/v1/intake/[token]` | GET/POST | Intake form by token |
| `/api/v1/crm/clients/[clientId]/files` | GET/POST | CRM client files |
| `/api/v1/integrations/mt5/ingest` | POST | MT5 data ingest |
| `/api/v1/webhooks/inbound` | POST | Inbound webhook handler |
| `/api/v1/webhooks/meta` | GET/POST | Meta webhook verify + events |
| `/api/v1/cyber/scan` | POST | Cyber scan trigger |
| `/api/v1/backoffice/credentials` | GET | Backoffice credential lookup |
| `/api/newsletter/daily` | POST | Daily newsletter send |
| `/api/games-analytics` | POST | Games analytics event |

---

## Supabase Tables (ibtadbwtrxglujkzqofs)

Tables prefixed by domain:
- `ops_tickets`, `ops_approvals`, `ops_actions` — Client Ops Autopilot
- `angel_messages`, `angel_threads`, `angel_settings` — Angel inbox bot
- `wh_messages` — WhatsApp messages (read-only)
- `crm_clients`, `crm_notes`, `crm_files` — CRM
- `invoices`, `invoice_items` — Invoicing
- `contracts`, `contract_signatures` — Contracts
- `marketing_posts`, `marketing_connections` — Marketing posts/connections
- `sales_prospects`, `sales_emails`, `sales_templates`, `sales_events` — Sales engine
- `push_subscriptions` — Web push subscriptions
- `todos`, `projects`, `meetings` — Workspace data
- `intake_tokens`, `intake_submissions` — Client intake

---

## Key Workflows

### 1. JARVIS Angel Sync
```
cron/jarvis-angel (hourly) → angel/sync
  → fetch IG DMs (Meta Graph API)
  → fetch inbound emails (Resend)
  → upsert angel_messages
  → AI triage priority
  → /jarvis/angel shows threaded inbox
  → admin clicks → AI draft → /angel/send
```

### 2. Ops Board Flow
```
Client WhatsApp/IG DM → ops/inbound-email webhook
  → insert ops_tickets
  → /jarvis/ops shows pending tickets
  → admin approves → ops/approve → ops/action
  → notification sent
```

### 3. Marketing Publish
```
Admin creates post → /api/v1/marketing/posts
  → scheduled → cron/marketing-publish
  → Meta Graph API post (IG/FB)
  → TikTok API post
  → mark published
```

### 4. Site-Kit Deploy
```
Admin → /site-kit → picks config
  → /api/v1/site-kit/deploy
  → Vercel API trigger deploy
  → monitor /api/v1/vercel/deployments
```

---

## Design System

- Font: Inter (next/font CSS var `--font-inter`)
- Colors: JST Spectrum — dark backgrounds, white text, gold accents
- Brand: `jsupremeconglomerate.online`
- Auth gate: All `/(app)/*` routes require Clerk session

---

## QA Checklist

- [ ] `GET /api/health` → 200 `{ok: true}`
- [ ] `/sign-in` → Clerk auth flow completes
- [ ] `/(app)/dashboard` loads (Clerk-protected)
- [ ] `/(app)/jarvis` loads JARVIS hub
- [ ] `/(app)/jarvis/ops` shows ops tickets from Supabase
- [ ] Push subscribe → `push_subscriptions` row inserted
- [ ] `/api/v1/marketing/connections` returns connected platforms
- [ ] Cron routes return 200 with CRON_SECRET Bearer header
- [ ] `/api/v1/system-status` returns all green
- [ ] `npx tsc --noEmit` → zero errors

---

## Custom Domain

- **Primary:** `https://jsupremeconglomerate.online`

---

## Known Gotchas

1. `/start` redirects to conglomerate — don't remove, JST website links to it
2. Ops board uses `ops_*` tables on `ibtadbwtrxglujkzqofs` — NOT a separate DB
3. Angel bot requires IG long-lived token stored in `angel_settings`
4. WhatsApp `/api/v1/jarvis/whatsapp/updates` must be registered as the Cloud API webhook
5. Marketing cron runs on Vercel cron schedule — requires `CRON_SECRET` in env
6. MT5 iframe at `/mt5-markups` embeds the Trading Cockpit — only works when Tailscale is connected

---

## SOP for This Project

1. `git pull origin main` in `C:\Users\jader\J Supreme Tech\j-supreme-conglomerate`
2. Basis pre-check: `POST https://reality-encoder.vercel.app/api/encode`
3. Make changes
4. `npx tsc --noEmit` → zero errors
5. `vercel deploy --prod`
6. Verify `https://jsupremeconglomerate.online` live
7. Basis post-encode

---

## ⚠️ CSS / STYLING BREAKS — DIAGNOSIS & FIX

**Symptom:** Site loads at `jsupremeconglomerate.online` but is completely unstyled — no layout, no colors, raw plain text.

**Root cause:** Tailwind v3 needs `tailwind.config.ts` to scan files and emit utility classes. Without it, `@tailwind utilities` outputs nothing. The following 4 files MUST be committed to git — if any are missing, Vercel's build produces a ~12KB CSS stub with zero utility classes:

| File | Purpose |
|------|---------|
| `tailwind.config.ts` | Content paths for Tailwind class scanning — CRITICAL |
| `postcss.config.mjs` | Hooks Tailwind into Next.js build via PostCSS |
| `next.config.ts` | Security headers + outputFileTracingRoot |
| `tsconfig.json` | TypeScript `@/*` path aliases |

**Secondary cause:** Even after committing the files, Vercel caches old CSS build artifacts. A new deploy will still serve the broken CSS until a source file changes and busts the cache.

**Quick diagnosis (browser console on live site):**
```js
// Healthy = true, broken = false
[...document.styleSheets].flatMap(s => { try { return [...s.cssRules] } catch(e) { return [] } }).some(r => r.selectorText?.includes('.flex'))
```
Also check: Network tab → CSS file → if under 15KB, it's broken. Healthy is ~100KB+.

**Fix in 3 steps:**
```powershell
# Step 1 — confirm/add missing files (from C:\Users\jader)
git status "J Supreme Tech/j-supreme-conglomerate/tailwind.config.ts"
# If "??" (untracked), stage and commit all 4:
git add "J Supreme Tech/j-supreme-conglomerate/tailwind.config.ts" `
        "J Supreme Tech/j-supreme-conglomerate/postcss.config.mjs" `
        "J Supreme Tech/j-supreme-conglomerate/next.config.ts" `
        "J Supreme Tech/j-supreme-conglomerate/tsconfig.json"
git commit -m "fix: commit missing build config files"
git push origin main

# Step 2 — bust Vercel's CSS cache (redeploy forces fresh build)
cd "C:\Users\jader\J Supreme Tech\j-supreme-conglomerate"
vercel deploy --prod --scope jordan-sketch-hues-projects

# Step 3 — verify (CSS file must be ~100KB with .flex present)
```

**Why `vercel build --prebuilt` fails on Windows:** Vercel creates symlinks in `.vercel/output/functions/` which require elevated privileges on Windows. Always use `vercel deploy --prod` instead.

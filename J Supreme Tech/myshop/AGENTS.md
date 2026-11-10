# MyShop — Agent SOP

## Project Overview

**MyShop** is a Next.js 16 e-commerce store for Mine & Yours Shop, targeting Jamaica.  
Stack: Next.js 16.4.2 (Turbopack) · Supabase · Clerk auth · Vercel deploy  
Live URL: https://myshop-three-tau.vercel.app  
Custom domain (propagating): https://mineandyoursshop.online

---

## Directory Structure

```
C:\Users\jader\J Supreme Tech\myshop\
├── src/
│   ├── app/
│   │   ├── page.tsx          # Homepage: hero, stories, arrivals, trust bar, categories
│   │   ├── shop/
│   │   │   └── page.tsx      # Shop page: sidebar nav + mobile dropdown
│   │   ├── shop/[slug]/      # Product detail page
│   │   └── api/              # API routes (Supabase, Clerk webhooks)
│   ├── components/
│   │   ├── CategoryDropdown.tsx  # "use client" mobile category select
│   │   ├── ProductCard.tsx       # Product card + skeleton
│   │   └── ...
│   └── lib/
│       ├── supabase.ts       # Supabase client
│       └── types.ts          # Product, Category types
├── public/
│   ├── hero/                 # Hero images
│   └── categories/           # Category cover images (static + kinetic)
└── AGENTS.md                 # This file
```

---

## CRITICAL WORKTREE RULE

**ALWAYS edit in the worktree first, then Copy-Item to base repo before committing.**

Worktree: `C:\Users\jader\.claude\worktrees\<worktree-name>\J Supreme Tech\myshop\`  
Base repo: `C:\Users\jader\J Supreme Tech\myshop\`

After editing in worktree:
```powershell
Copy-Item "<worktree>\src\app\page.tsx" "C:\Users\jader\J Supreme Tech\myshop\src\app\page.tsx" -Force
# repeat for each changed file
```

---

## Deploy Process

```powershell
Set-Location "C:\Users\jader\J Supreme Tech\myshop"
git pull origin main
git add <specific files>
git commit -m "message"
npx vercel deploy --prod
# Then alias to stable domain:
npx vercel alias <new-deploy-url> myshop-three-tau.vercel.app
```

**NEVER use Vercel v0/AI scaffold.** CLI only. See memory rule: "NEVER Vercel Agent".

---

## Image Rules

- All images under `public/` — NEVER use external CDN URLs directly
- Compress before commit: images < 200KB (see Media Compression SOP)
- Category images: `public/categories/{slug}-static.jpg` and `{slug}-kinetic.jpg`
- All `<Image>` components must have `quality={90}` for editorial/luxury feel
- Always include accurate `sizes` prop on Next.js Image for correct srcset

---

## Mobile UX

- **Below 900px**: sidebar hidden → `CategoryDropdown` component shows (native `<select>`)
- **Below 500px**: product grid goes 1-column
- `CategoryDropdown` is a `"use client"` component using `useRouter` for navigation
- Located at `src/components/CategoryDropdown.tsx`

---

## Domain Setup

- Vercel project name: `myshop`
- Domains added to Vercel: `mineandyoursshop.online`, `www.mineandyoursshop.online`
- Namecheap nameservers set to: `ns1.vercel-dns.com` / `ns2.vercel-dns.com`
- Propagation takes up to 48 hours
- Once propagated, Vercel will auto-provision SSL

---

## Supabase

- Project: `ibtadbwtrxglujkzqofs` (always verify .env before querying)
- Tables: `myshop_products` (active, name, slug, price_jmd, image_url, category, created_at)
- All pages use `export const dynamic = "force-dynamic"` to prevent static caching

---

## Key Design Tokens

```css
--font-serif: 'Playfair Display', serif  /* headlines */
--font-sans: 'Montserrat', sans-serif    /* body/labels */
--font-stamp: 'Bebas Neue', sans-caps   /* stamp/eyebrow labels */
--gold: #C8A84B
--dark: #0a0a0a
--ink: #1a1a1a
--ink-muted: #666
--surface: #fff
--border: #e5e5e5
```

---

## Completed Work (Nov 2026)

- [x] Homepage: hero, editorial story panels, new arrivals, trust bar, category grid
- [x] Shop page: sidebar nav (desktop) + dropdown (mobile), product grid, banner
- [x] Mobile responsive: 900px and 500px breakpoints
- [x] Image quality: quality=90 on all editorial <Image> components
- [x] Category images: 28 files (static + kinetic), all compressed
- [x] Domain: mineandyoursshop.online NS → Vercel (propagating)

## Open / Next Steps

- [ ] Product detail page (`/shop/[slug]`)
- [ ] Add products to Supabase (currently shows skeletons)
- [ ] HandyPay checkout integration
- [ ] Admin UI for managing products
- [ ] SSL verification on custom domain once NS propagates

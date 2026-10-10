export type ToolsetResource = {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
  type: "tool" | "article" | "reference" | "inspiration";
};

export type DesignTrend = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  examples: string[];
};

export type IntegrationNode = {
  id: string;
  label: string;
  group: "core" | "client" | "marketing" | "mobile" | "infra";
  description: string;
  connects: string[];
};

export const TOOLSET_RESOURCES: ToolsetResource[] = [
  // ── Design Inspiration ──────────────────────────────────────────────
  {
    id: "awwwards",
    title: "Awwwards",
    description: "Award-winning site designs — best source for current UI trends and typography pairings.",
    url: "https://www.awwwards.com/",
    category: "Inspiration",
    tags: ["design", "ui", "web", "trends"],
    type: "inspiration",
  },
  {
    id: "dribbble",
    title: "Dribbble",
    description: "Shot-format UI designs. Filter by app, web, branding. Best for component patterns.",
    url: "https://dribbble.com/",
    category: "Inspiration",
    tags: ["ui", "mobile", "branding", "components"],
    type: "inspiration",
  },
  {
    id: "mobbin",
    title: "Mobbin",
    description: "Real mobile and web app screenshots curated by flow (onboarding, checkout, etc.).",
    url: "https://mobbin.com/",
    category: "Inspiration",
    tags: ["mobile", "ux", "flows", "app"],
    type: "inspiration",
  },
  {
    id: "land-book",
    title: "Land-book",
    description: "Landing page design gallery — great for hero sections and marketing layout patterns.",
    url: "https://land-book.com/",
    category: "Inspiration",
    tags: ["landing", "marketing", "web"],
    type: "inspiration",
  },
  {
    id: "dark-design",
    title: "Dark Design",
    description: "Curated dark-mode web designs — essential for projects with dark premium themes.",
    url: "https://www.dark.design/",
    category: "Inspiration",
    tags: ["dark-mode", "premium", "ui"],
    type: "inspiration",
  },
  {
    id: "saas-landing-page",
    title: "SaaS Landing Page Examples",
    description: "Curated SaaS landing pages — good reference when pitching Supreme Suite tiers.",
    url: "https://saaslandingpage.com/",
    category: "Inspiration",
    tags: ["saas", "landing", "marketing"],
    type: "inspiration",
  },

  // ── Design Tools ────────────────────────────────────────────────────
  {
    id: "figma",
    title: "Figma",
    description: "Primary collaborative design tool. Use for mockups, prototypes, and component libraries.",
    url: "https://www.figma.com/",
    category: "Tools",
    tags: ["design", "prototype", "collaboration"],
    type: "tool",
  },
  {
    id: "coolors",
    title: "Coolors",
    description: "Fast palette generation. Lock a brand primary and explore complementary palettes.",
    url: "https://coolors.co/",
    category: "Tools",
    tags: ["colors", "palette", "brand"],
    type: "tool",
  },
  {
    id: "google-fonts",
    title: "Google Fonts",
    description: "Font library. Default JST stack: Space Grotesk (headers) + Inter (body) + JetBrains Mono (code).",
    url: "https://fonts.google.com/",
    category: "Tools",
    tags: ["fonts", "typography"],
    type: "tool",
  },
  {
    id: "haikei",
    title: "Haikei",
    description: "Generate wavy SVG backgrounds, blobs, and abstract shapes for hero sections.",
    url: "https://haikei.app/",
    category: "Tools",
    tags: ["svg", "backgrounds", "generative"],
    type: "tool",
  },
  {
    id: "fffuel",
    title: "fffuel",
    description: "Collection of SVG generators: mesh gradients, grain textures, noise patterns.",
    url: "https://fffuel.co/",
    category: "Tools",
    tags: ["svg", "texture", "gradients"],
    type: "tool",
  },
  {
    id: "shadcn",
    title: "shadcn/ui",
    description: "Copy-paste component library used in JST projects. Tailwind-based, fully customisable.",
    url: "https://ui.shadcn.com/",
    category: "Tools",
    tags: ["components", "tailwind", "react"],
    type: "tool",
  },
  {
    id: "lucide",
    title: "Lucide Icons",
    description: "Icon library used across all JST projects. 1,500+ consistent stroke icons.",
    url: "https://lucide.dev/icons/",
    category: "Tools",
    tags: ["icons", "react", "svg"],
    type: "tool",
  },
  {
    id: "recharts",
    title: "Recharts",
    description: "Chart library for all JST dashboards. Use (v: any) on formatter callbacks to avoid TS errors.",
    url: "https://recharts.org/",
    category: "Tools",
    tags: ["charts", "data", "react"],
    type: "tool",
  },

  // ── Social Media / PR ───────────────────────────────────────────────
  {
    id: "canva-templates",
    title: "Canva Brand Templates",
    description: "Pre-sized templates for IG posts (1080×1080), Stories (1080×1920), LinkedIn banners. Use as reference — generate programmatically via HTML+Chrome.",
    url: "https://www.canva.com/templates/",
    category: "Social & PR",
    tags: ["instagram", "social", "templates"],
    type: "reference",
  },
  {
    id: "meta-ad-specs",
    title: "Meta Ad Specs (Facebook/Instagram)",
    description: "Official image/video specs for every Meta ad format. Always verify before generating creatives.",
    url: "https://www.facebook.com/business/help/980593475366490",
    category: "Social & PR",
    tags: ["instagram", "ads", "specs", "meta"],
    type: "reference",
  },
  {
    id: "later-ig-guide",
    title: "Later – Instagram Algorithm Guide",
    description: "Up-to-date guide on the Instagram algorithm, best posting times, and Reels strategy.",
    url: "https://later.com/blog/how-instagram-algorithm-works/",
    category: "Social & PR",
    tags: ["instagram", "algorithm", "social", "strategy"],
    type: "article",
  },
  {
    id: "buffer-social-calendar",
    title: "Buffer Social Media Calendar",
    description: "Free social media content calendar template — adapt for client campaigns.",
    url: "https://buffer.com/resources/social-media-calendar/",
    category: "Social & PR",
    tags: ["social", "calendar", "planning"],
    type: "reference",
  },

  // ── Dev & Performance ───────────────────────────────────────────────
  {
    id: "pagespeed",
    title: "PageSpeed Insights",
    description: "Run Lighthouse audits on any URL. Check before handing off any client site.",
    url: "https://pagespeed.web.dev/",
    category: "Dev & Performance",
    tags: ["performance", "lighthouse", "seo"],
    type: "tool",
  },
  {
    id: "bundlephobia",
    title: "Bundlephobia",
    description: "Check npm package size before adding a dependency.",
    url: "https://bundlephobia.com/",
    category: "Dev & Performance",
    tags: ["performance", "npm", "bundle"],
    type: "tool",
  },
  {
    id: "vercel-analytics",
    title: "Vercel Web Analytics",
    description: "Privacy-friendly RUM analytics built into every Vercel project — no extra setup for Next.js.",
    url: "https://vercel.com/docs/analytics",
    category: "Dev & Performance",
    tags: ["analytics", "vercel", "performance"],
    type: "reference",
  },

  // ── Articles & Learning ─────────────────────────────────────────────
  {
    id: "refactoring-ui",
    title: "Refactoring UI — Design Principles",
    description: "Practical design rules for developers: spacing, typography, color, and hierarchy. The single best reference.",
    url: "https://www.refactoringui.com/",
    category: "Articles",
    tags: ["design", "ui", "book", "principles"],
    type: "article",
  },
  {
    id: "nextjs-blog",
    title: "Next.js Blog",
    description: "Official Next.js release notes and articles. Subscribe for upgrade notices.",
    url: "https://nextjs.org/blog",
    category: "Articles",
    tags: ["nextjs", "releases", "updates"],
    type: "article",
  },
  {
    id: "web-dev-blog",
    title: "web.dev (Google)",
    description: "Performance, accessibility, and modern web APIs from the Chrome team.",
    url: "https://web.dev/blog/",
    category: "Articles",
    tags: ["performance", "accessibility", "web"],
    type: "article",
  },
  {
    id: "smashing-magazine",
    title: "Smashing Magazine",
    description: "In-depth frontend, UX, and design articles. Good for deep-dives on CSS, React patterns, and accessibility.",
    url: "https://www.smashingmagazine.com/",
    category: "Articles",
    tags: ["frontend", "ux", "css", "deep-dive"],
    type: "article",
  },
  {
    id: "css-tricks",
    title: "CSS-Tricks",
    description: "The reference for CSS techniques, flexbox, grid, animations.",
    url: "https://css-tricks.com/",
    category: "Articles",
    tags: ["css", "animation", "layout"],
    type: "article",
  },
  {
    id: "nngroup",
    title: "Nielsen Norman Group",
    description: "UX research articles and guides. Use when justifying UX decisions to clients.",
    url: "https://www.nngroup.com/articles/",
    category: "Articles",
    tags: ["ux", "research", "usability"],
    type: "article",
  },

  // ── Client Communication ─────────────────────────────────────────────
  {
    id: "resend-docs",
    title: "Resend API Reference",
    description: "JST email send path. POST /emails with from: notifications@jsupremeconglomerate.online.",
    url: "https://resend.com/docs/api-reference/emails/send-email",
    category: "Infrastructure",
    tags: ["email", "resend", "api"],
    type: "reference",
  },
  {
    id: "wipay-docs",
    title: "WiPay Jamaica Docs",
    description: "Payment gateway used across JST projects. hash = md5(tx+origTotal+key), fee 4.83%.",
    url: "https://wipay.com.jm/developer",
    category: "Infrastructure",
    tags: ["payments", "wipay", "jamaica"],
    type: "reference",
  },
  {
    id: "supabase-docs",
    title: "Supabase Docs",
    description: "Database, auth, and storage. Two shared projects: mobile-auth + live-client-data.",
    url: "https://supabase.com/docs",
    category: "Infrastructure",
    tags: ["supabase", "database", "auth"],
    type: "reference",
  },
];

export const DESIGN_TRENDS: DesignTrend[] = [
  {
    id: "glassmorphism",
    title: "Glassmorphism + Blur Layers",
    description: "Frosted-glass cards with backdrop-blur, semi-transparent borders, and subtle shadows. Already used in JST header/sidebar.",
    tags: ["ui", "css", "cards"],
    examples: ["backdrop-blur-xl", "bg-card/40", "border-border/60"],
  },
  {
    id: "bento-grid",
    title: "Bento Grid Layouts",
    description: "Asymmetric feature grids where cards span varying columns — common in SaaS landing pages and dashboards.",
    tags: ["layout", "grid", "landing"],
    examples: ["col-span-2 row-span-2", "grid-cols-3 auto-rows-fr"],
  },
  {
    id: "micro-animations",
    title: "Micro-animations & Transitions",
    description: "Subtle hover scale, opacity fade-in, and number counters. Keeps interfaces feeling responsive without clutter.",
    tags: ["animation", "ux", "css"],
    examples: ["hover:scale-[1.02]", "transition-all duration-200", "animate-in fade-in"],
  },
  {
    id: "dark-premium",
    title: "Dark Premium (Lumina Pattern)",
    description: "Dark background with gold/violet accent gradients — already used in lumina-entertainment. High-contrast hero with gradient text.",
    tags: ["dark-mode", "premium", "brand"],
    examples: ["bg-gradient-to-r from-primary to-accent bg-clip-text", "text-transparent"],
  },
  {
    id: "mono-editorial",
    title: "Mono Editorial (JST Pattern)",
    description: "Pure black/white with tight tracking, uppercase labels, and ink-scale greys. Used on jsupremetech.online.",
    tags: ["typography", "mono", "brand", "jst"],
    examples: ["tracking-[0.2em] uppercase", "text-xs font-bold", "Space Grotesk + Inter"],
  },
  {
    id: "ai-generated-bg",
    title: "AI / Generative Backgrounds",
    description: "Mesh gradients, noise textures, and flowing organic shapes as full-bleed section backgrounds.",
    tags: ["generative", "svg", "background"],
    examples: ["haikei.app", "fffuel.co", "mesh-gradient"],
  },
  {
    id: "social-proof-strips",
    title: "Social Proof Strips",
    description: "Horizontal logo marquees, review cards, and stat counters near CTAs. Standard in client marketing sites.",
    tags: ["marketing", "conversion", "landing"],
    examples: ["Marquee component", "CountUp animation", "star ratings"],
  },
];

export const INTEGRATION_MAP_NODES: IntegrationNode[] = [
  {
    id: "website",
    label: "Website",
    group: "core",
    description: "Next.js 16 + Tailwind v4, deployed on Vercel",
    connects: ["client-portal", "seo", "analytics", "social-share"],
  },
  {
    id: "client-portal",
    label: "Client Portal",
    group: "client",
    description: "Auth-gated portal (Clerk/Supabase) — orders, accounts, dashboards",
    connects: ["supabase", "email-notify", "admin-backoffice"],
  },
  {
    id: "admin-backoffice",
    label: "Admin Backoffice",
    group: "client",
    description: "Operator CRM/orders/settings (conglomerate backoffice hub)",
    connects: ["supabase", "crm", "invoices"],
  },
  {
    id: "mobile-app",
    label: "Mobile App",
    group: "mobile",
    description: "Expo SDK 54 + NativeWind (iOS + Android)",
    connects: ["supabase", "push-notify", "client-portal"],
  },
  {
    id: "social-media",
    label: "Social Media",
    group: "marketing",
    description: "IG posts, Stories, Reels — programmatic PNG generation",
    connects: ["marketing-campaign", "website"],
  },
  {
    id: "marketing-campaign",
    label: "Marketing Campaign",
    group: "marketing",
    description: "90-day strategy, ad sets, content calendar — /marketing board",
    connects: ["social-media", "email-campaign", "website"],
  },
  {
    id: "email-campaign",
    label: "Email / Newsletter",
    group: "marketing",
    description: "Resend transactional + bulk from @jsupremeconglomerate.online",
    connects: ["crm", "client-portal"],
  },
  {
    id: "email-notify",
    label: "Transactional Email",
    group: "infra",
    description: "Resend REST API — invoices, credentials, order confirmations",
    connects: ["email-campaign", "supabase"],
  },
  {
    id: "supabase",
    label: "Supabase",
    group: "infra",
    description: "Postgres DB + Auth + Storage (2 shared projects)",
    connects: ["admin-backoffice", "mobile-app", "client-portal"],
  },
  {
    id: "crm",
    label: "CRM",
    group: "client",
    description: "Leads, pipeline stages, follow-ups — /crm in conglomerate",
    connects: ["invoices", "email-notify", "admin-backoffice"],
  },
  {
    id: "invoices",
    label: "Invoices + Payments",
    group: "client",
    description: "WiPay card payments (4.83% fee) + bank + cash",
    connects: ["crm", "supabase"],
  },
  {
    id: "seo",
    label: "SEO + OG",
    group: "infra",
    description: "sitemap.xml, robots.txt, opengraph-image, meta tags",
    connects: ["social-share"],
  },
  {
    id: "analytics",
    label: "Analytics",
    group: "infra",
    description: "Vercel Web Analytics + PageSpeed Insights monitoring",
    connects: ["website"],
  },
  {
    id: "social-share",
    label: "Social Share",
    group: "marketing",
    description: "OG image previews when links are shared on IG/WhatsApp",
    connects: ["social-media"],
  },
  {
    id: "push-notify",
    label: "Push Notifications",
    group: "mobile",
    description: "Expo Notifications (FCM/APNs) for mobile app alerts",
    connects: ["mobile-app"],
  },
];

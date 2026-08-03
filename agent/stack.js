/* ============================================================
   AXIOM · STACK REGISTRY — the operator's real toolchain.
   The agent consults this to route every build to the right
   platforms. Loaded before app.js; exposes window.AXIOM_STACK.
   ============================================================ */

"use strict";

window.AXIOM_STACK = (() => {

  // status: "live" = in use · "pending" = being set up · "blocked" = unavailable · "legacy" = maintain only
  const STACK = [
    // PLATFORMS & HOSTING
    { cat: "hosting", name: "Vercel",            role: "all web deploys",                              status: "live", tags: ["web", "deploy", "landing", "dashboard", "app"] },
    { cat: "hosting", name: "Railway",           role: "always-on bots, WhatsApp API, Discord bots",   status: "live", tags: ["bot", "worker", "whatsapp", "discord", "server"] },
    { cat: "hosting", name: "Supabase",          role: "Postgres DB + auth + RLS (multiple projects)", status: "live", tags: ["db", "auth", "database", "storage", "app", "dashboard"] },
    { cat: "hosting", name: "Namecheap",         role: "DNS for all domains",                          status: "live", tags: ["dns", "domain"] },
    // AI / LLM
    { cat: "ai", name: "Anthropic (Claude API)", role: "J Supreme Command, JARVIS, Slack agents, Xalvz, ops bots", status: "live", tags: ["ai", "agent", "llm", "bot"] },
    { cat: "ai", name: "Gemini",                 role: "J Supreme Brain (free tier)",                  status: "live", tags: ["ai", "llm", "free"] },
    { cat: "ai", name: "Groq",                   role: "J Supreme Brain (free tier)",                  status: "live", tags: ["ai", "llm", "free", "fast"] },
    { cat: "ai", name: "Vercel AI Gateway",      role: "unified AI routing",                           status: "live", tags: ["ai", "routing", "llm"] },
    // PAYMENTS
    { cat: "payments", name: "WiPay Jamaica",    role: "JA payments (JST site, MoverGuy store)",       status: "live",    tags: ["payment", "commerce", "shop", "store", "jamaica"] },
    { cat: "payments", name: "Stripe",           role: "HomeReady Jamaica",                            status: "pending", tags: ["payment", "commerce", "subscription"] },
    // SOCIAL / META
    { cat: "social", name: "Meta Graph API",     role: "Instagram + Facebook posting (Morris Pizza, all brands)", status: "live", tags: ["social", "instagram", "facebook", "posting", "marketing"] },
    { cat: "social", name: "TikTok API",         role: "conglomerate posting",                         status: "live", tags: ["social", "tiktok", "video", "posting", "marketing"] },
    { cat: "social", name: "WhatsApp Cloud API", role: "client bot, Jarvis auto-reply, notify system", status: "live", tags: ["whatsapp", "bot", "notify", "messaging"] },
    // COMMUNICATIONS & EMAIL
    { cat: "comms", name: "Resend",              role: "transactional email",                          status: "live", tags: ["email", "notify", "transactional"] },
    { cat: "comms", name: "Gmail API (MCP)",     role: "JARVIS alert digest, daily brief",             status: "live", tags: ["email", "digest", "alerts"] },
    { cat: "comms", name: "WhatsApp Business API", role: "client ops messages",                        status: "live", tags: ["whatsapp", "messaging", "client"] },
    // CONTENT & CMS
    { cat: "cms", name: "Payload CMS",           role: "language-cradle /admin, BP Couriers",          status: "live", tags: ["cms", "content", "admin"] },
    { cat: "cms", name: "Clerk",                 role: "auth on courier-app",                          status: "live", tags: ["auth", "login", "users"] },
    // VIDEO / CREATIVE
    { cat: "creative", name: "FFmpeg",           role: "video rendering, reels pipeline",              status: "live", tags: ["video", "render", "reels", "media-tool", "edit"] },
    { cat: "creative", name: "Puppeteer / Chrome Headless", role: "screenshot → still frames",         status: "live", tags: ["screenshot", "automation", "video"] },
    { cat: "creative", name: "Adobe Stock",      role: "licensed assets",                              status: "live", tags: ["assets", "images", "creative"] },
    { cat: "creative", name: "GSAP + Lenis",     role: "motion kit (16 animations across 7 projects)", status: "live", tags: ["animation", "motion", "landing", "creative", "web"] },
    { cat: "creative", name: "Adobe Express / Firefly", role: "design + image generation (MCP connected)", status: "live", tags: ["design", "images", "generation", "creative"] },
    { cat: "creative", name: "Figma MCP",        role: "design-to-code sync",                          status: "live", tags: ["design", "figma", "ui"] },
    // APP / MOBILE
    { cat: "mobile", name: "Codemagic",          role: "iOS + Android CI/CD pipeline",                 status: "live",   tags: ["mobile", "ci", "ios", "android"] },
    { cat: "mobile", name: "Apple App Store Connect", role: "TestFlight, submissions",                 status: "live",   tags: ["mobile", "ios", "release"] },
    { cat: "mobile", name: "Google Play Console", role: "Android submissions",                         status: "live",   tags: ["mobile", "android", "release"] },
    { cat: "mobile", name: "Expo",               role: "mobile ports (BP, SolidTrust, NEXLINK, Aboo) — NO new Expo/EAS", status: "legacy", tags: ["mobile", "legacy"] },
    // NOTIFICATIONS / BOTS
    { cat: "bots", name: "Discord.js v14",       role: "TestLoop community bot, JST Dispatch bot",     status: "live", tags: ["discord", "bot", "community"] },
    { cat: "bots", name: "Slack API",            role: "15 Claude agents hub",                         status: "live", tags: ["slack", "bot", "agent"] },
    // DEV TOOLS / INFRA
    { cat: "dev", name: "Next.js (App Router)",  role: "primary web framework",                        status: "live", tags: ["web", "framework", "react", "app", "dashboard", "landing", "commerce"] },
    { cat: "dev", name: "Tailwind CSS",          role: "styling",                                      status: "live", tags: ["css", "styling", "web"] },
    { cat: "dev", name: "Bun",                   role: "package manager / runtime",                    status: "live", tags: ["runtime", "tooling"] },
    { cat: "dev", name: "Google Search Console API", role: "sitemap submissions",                      status: "live", tags: ["seo", "sitemap", "web"] },
    // MCP MESH
    { cat: "mcp", name: "MCP mesh",              role: "Supabase · Figma · Adobe · Railway · Resend · Gmail · Vercel · Clerk connected", status: "live", tags: ["mcp", "agent", "integration"] },
    { cat: "mcp", name: "Postiz (MCP)",          role: "social scheduling",                            status: "blocked", tags: ["social", "scheduling"] },
  ];

  const CAT_LABELS = {
    hosting: "PLATFORMS & HOSTING", ai: "AI / LLM", payments: "PAYMENTS", social: "SOCIAL / META",
    comms: "COMMS & EMAIL", cms: "CONTENT & CMS", creative: "VIDEO / CREATIVE", mobile: "APP / MOBILE",
    bots: "NOTIFICATIONS / BOTS", dev: "DEV TOOLS / INFRA", mcp: "MCP SERVERS",
  };

  /* map a classified directive to the stack services it should use */
  function recommend(cls) {
    const wanted = new Set();
    // every web build ships on the house lane
    ["Vercel", "Next.js (App Router)", "Tailwind CSS", "Supabase", "Bun"].forEach((n) => wanted.add(n));
    const tagHits = {
      dashboard: ["Clerk"], commerce: ["WiPay Jamaica", "Resend"],
      "media-tool": ["FFmpeg", "Puppeteer / Chrome Headless", "Adobe Express / Firefly"],
      landing: ["GSAP + Lenis", "Google Search Console API"],
    };
    (tagHits[cls.type] || []).forEach((n) => wanted.add(n));
    const t = (cls.raw || "").toLowerCase();
    if (/bot|whatsapp|discord|slack/.test(t)) ["Railway", "Anthropic (Claude API)"].forEach((n) => wanted.add(n));
    if (/whatsapp/.test(t)) wanted.add("WhatsApp Cloud API");
    if (/discord/.test(t)) wanted.add("Discord.js v14");
    if (/slack/.test(t)) wanted.add("Slack API");
    if (/ai|agent|smart|intelligent/.test(t)) ["Anthropic (Claude API)", "Vercel AI Gateway"].forEach((n) => wanted.add(n));
    if (/video|reel|edit/.test(t)) wanted.add("FFmpeg");
    if (/social|post|instagram|facebook|tiktok/.test(t)) ["Meta Graph API", "TikTok API"].forEach((n) => wanted.add(n));
    if (/email|notify/.test(t)) wanted.add("Resend");
    if (/mobile|ios|android|app store/.test(t)) ["Codemagic", "Apple App Store Connect", "Google Play Console"].forEach((n) => wanted.add(n));
    if (/pay|checkout|store|shop/.test(t)) wanted.add("WiPay Jamaica");

    return STACK.filter((s) => wanted.has(s.name));
  }

  function render(rootSel, q = "") {
    const root = document.querySelector(rootSel);
    if (!root) return;
    const query = q.toLowerCase();
    const items = STACK.filter((s) => !query || (s.name + s.role + s.cat + s.tags.join(" ")).toLowerCase().includes(query));
    const byCat = {};
    items.forEach((s) => (byCat[s.cat] = byCat[s.cat] || []).push(s));
    root.innerHTML = Object.entries(byCat).map(([cat, list]) => `
      <div class="stack-cat">
        <h3>${CAT_LABELS[cat] || cat.toUpperCase()}</h3>
        ${list.map((s) => `
          <div class="stack-item">
            <span class="s-status s-${s.status}" title="${s.status}"></span>
            <span class="s-name">${s.name}</span>
            <span class="s-role">${s.role}</span>
          </div>`).join("")}
      </div>`).join("") || `<p class="dim">no stack service matches.</p>`;
  }

  return { STACK, recommend, render };
})();

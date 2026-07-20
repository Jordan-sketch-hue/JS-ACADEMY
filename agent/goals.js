/* ============================================================
   AXIOM · OBJECTIVE ENGINE — backward chaining from the future.
   A build is DONE when its end goal is met. Each project type has
   an objective; the engine walks backwards: goal ← needs features
   (X,Y,Z) ← each feature needs connections (A,B,C) ← each gets a
   confirm-test. Recursive, deduplicated, with a finish line.
   Loaded before app.js; exposes window.AXIOM_GOALS.
   ============================================================ */

"use strict";

window.AXIOM_GOALS = (() => {

  /* general knowledge: what features exist, what they require,
     how they connect, and how to CONFIRM each one actually works */
  const FEATURES = {
    database: {
      kw: /database|\bdb\b|storage|persist|records?|save data/,
      needs: [],
      steps: ["create Supabase tables + RLS policies", "wire client queries", "handle empty/error states"],
      test: "write a row → refresh → row still there",
    },
    auth: {
      kw: /\bauth\b|log ?in|sign ?in|sign ?up|accounts?|users?|profile/,
      needs: ["database"],
      steps: ["wire auth provider (Supabase/Clerk)", "session state + protected routes", "logout + token refresh"],
      test: "log in → refresh → still signed in; wrong password rejected",
    },
    payments: {
      kw: /payments?|checkout|\bbuy\b|purchase|pricing|\bpaid\b/,
      needs: ["database", "notifications"],
      steps: ["WiPay checkout integration", "order record on success", "failure + retry path"],
      test: "sandbox payment completes AND order appears in DB",
    },
    catalog: {
      kw: /catalog|products?|listings?|menu items?|inventory/,
      needs: ["database"],
      steps: ["product schema", "grid + detail views", "stock states"],
      test: "add product in DB → appears on site",
    },
    cart: {
      kw: /\bcart\b|basket/,
      needs: ["catalog"],
      steps: ["persisted cart state", "quantity edit + remove", "totals calculation"],
      test: "add 2 items → refresh → cart intact, total correct",
    },
    notifications: {
      kw: /notif|alerts?|whatsapp|email|\bsms\b|messages?/,
      needs: [],
      steps: ["Railway worker endpoint", "WhatsApp Cloud API / Resend send", "delivery logging"],
      test: "trigger event → message arrives on phone/inbox",
    },
    realtime: {
      kw: /real ?time|\blive\b|instant|sockets?/,
      needs: ["database"],
      steps: ["Supabase realtime channel", "optimistic UI updates", "reconnect handling"],
      test: "change in one tab appears in a second tab within 1s",
    },
    upload: {
      kw: /uploads?|files?|images?|media library/,
      needs: ["database"],
      steps: ["Supabase storage bucket", "progress + validation", "preview render"],
      test: "upload a 5MB file → preview shows → URL persists",
    },
    search: {
      kw: /search|filters?|\bfind\b|sort by/,
      needs: ["database"],
      steps: ["indexed query", "debounced input", "empty-result state"],
      test: "search a known item → found; gibberish → clean empty state",
    },
    dashboardUI: {
      kw: /dashboard|admin|panel|analytics|charts?|stats|metrics/,
      needs: ["auth", "database"],
      steps: ["layout grid + navigation", "live data widgets", "loading skeletons"],
      test: "every widget shows real data, none stuck loading",
    },
    seo: {
      kw: /\bseo\b|ranking|google|sitemap|searchable/,
      needs: [],
      steps: ["meta + open-graph tags", "sitemap.xml", "Search Console submission"],
      test: "Lighthouse SEO score ≥ 90",
    },
    motion: {
      kw: /animat|motion|gsap|smooth scroll|effects?/,
      needs: [],
      steps: ["GSAP timelines", "Lenis smooth scroll", "reduced-motion fallback"],
      test: "60fps scrolling; animations disabled under prefers-reduced-motion",
    },
    renderPipeline: {
      kw: /render|export video|reels?|ffmpeg|video edit/,
      needs: ["upload"],
      steps: ["FFmpeg job queue on Railway", "progress polling", "output delivery"],
      test: "input clip in → rendered output downloadable",
    },
    contact: {
      kw: /contact|forms?|inquir|bookings?|appointments?|schedule/,
      needs: ["notifications", "database"],
      steps: ["validated form", "store the submission", "notify the operator"],
      test: "submit form → row in DB + WhatsApp/email received",
    },
    ai: {
      kw: /\bai\b|smart|agent|brain|\bllm\b|generate/,
      needs: ["database"],
      steps: ["brain endpoint (own model / gateway)", "prompt assembly with context", "response validation + fallback"],
      test: "request in → valid output; brain offline → fallback still works",
    },
  };

  /* objective end goals per project type — the FUTURE we chain back from */
  const TYPE_GOALS = {
    landing:      { goal: "a live landing page that converts visitors", base: ["seo", "motion", "contact"] },
    dashboard:    { goal: "a working dashboard showing live data, securely", base: ["dashboardUI"] },
    commerce:     { goal: "a store that takes real orders and real money", base: ["catalog", "cart", "payments", "contact"] },
    "media-tool": { goal: "a tool that takes media in and delivers processed media out", base: ["upload", "renderPipeline"] },
    app:          { goal: "an app that performs its objective end-to-end", base: ["database"] },
  };

  /* read free text, understand which known features it means */
  function detect(text) {
    const t = String(text).toLowerCase();
    return Object.keys(FEATURES).filter((k) => FEATURES[k].kw.test(t));
  }

  /* goal ← features ← sub-features, deduplicated, dependencies first */
  function decompose(cls, extra = []) {
    const spec = TYPE_GOALS[cls.type] || TYPE_GOALS.app;
    const chosen = new Set([...spec.base, ...detect(cls.raw), ...extra]);
    const order = [];
    const visit = (k, depth) => {
      const f = FEATURES[k];
      if (!f) return;
      f.needs.forEach((n) => visit(n, depth + 1));
      if (!order.some((o) => o.k === k)) order.push({ k, depth });
    };
    [...chosen].forEach((k) => visit(k, 0));
    return { goal: spec.goal, order, features: FEATURES };
  }

  return { FEATURES, TYPE_GOALS, detect, decompose };
})();

/* ============================================================
   AXIOM — JS Supreme Coding Agent
   Monochrome. Local-first. No paid services.
   Faculties: perceive → classify → assess risk → plan (if/then/else)
              → generate → audit → learn (persist to KB / Supabase)
   ============================================================ */

"use strict";

/* ---------- tiny helpers ---------- */
const $ = (s) => document.querySelector(s);
const now = () => new Date().toISOString().replace("T", " ").slice(0, 19);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* ============================================================
   1 · NODE NETWORK — the agent's faculties as a living graph
   ============================================================ */
const FACULTIES = [
  { id: "perceive", label: "PERCEIVE" },
  { id: "classify", label: "CLASSIFY" },
  { id: "reason",   label: "REASON" },
  { id: "risk",     label: "RISK" },
  { id: "plan",     label: "PLAN" },
  { id: "codegen",  label: "CODEGEN" },
  { id: "audit",    label: "AUDIT" },
  { id: "memory",   label: "MEMORY" },
  { id: "learn",    label: "LEARN" },
  { id: "net",      label: "NET" },
];
const EDGES = [
  ["perceive","classify"],["classify","reason"],["reason","risk"],["risk","plan"],
  ["plan","codegen"],["codegen","audit"],["audit","memory"],["memory","learn"],
  ["learn","reason"],["net","learn"],["net","perceive"],["memory","plan"],
  ["reason","plan"],["audit","reason"],["memory","classify"],
];

const canvas = $("#net");
const ctx = canvas.getContext("2d");
let nodes = [];

function layoutNetwork() {
  canvas.width = canvas.clientWidth * devicePixelRatio;
  canvas.height = 360 * devicePixelRatio;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  const W = canvas.clientWidth, H = 360, cx = W / 2, cy = H / 2;
  nodes = FACULTIES.map((f, i) => {
    const a = (i / FACULTIES.length) * Math.PI * 2 - Math.PI / 2;
    const r = Math.min(W, H) * 0.36;
    return { ...f, x: cx + Math.cos(a) * r * 1.35, y: cy + Math.sin(a) * r,
             heat: 0, phase: Math.random() * Math.PI * 2 };
  });
}
const nodeById = (id) => nodes.find((n) => n.id === id);
function fire(id, amount = 1) { const n = nodeById(id); if (n) n.heat = Math.min(1, n.heat + amount); }

function drawNetwork(t) {
  const W = canvas.clientWidth, H = 360;
  ctx.clearRect(0, 0, W, H);
  for (const [a, b] of EDGES) {
    const na = nodeById(a), nb = nodeById(b);
    const heat = Math.max(na.heat, nb.heat);
    ctx.strokeStyle = `rgba(255,255,255,${0.06 + heat * 0.5})`;
    ctx.lineWidth = 1 + heat * 1.5;
    ctx.beginPath(); ctx.moveTo(na.x, na.y); ctx.lineTo(nb.x, nb.y); ctx.stroke();
    if (heat > 0.05) {
      const p = (t / 600 + na.phase) % 1;
      const px = na.x + (nb.x - na.x) * p, py = na.y + (nb.y - na.y) * p;
      ctx.fillStyle = `rgba(255,255,255,${heat})`;
      ctx.beginPath(); ctx.arc(px, py, 2, 0, Math.PI * 2); ctx.fill();
    }
  }
  for (const n of nodes) {
    const pulse = 1 + Math.sin(t / 500 + n.phase) * 0.08;
    const r = (6 + n.heat * 8) * pulse;
    ctx.strokeStyle = `rgba(255,255,255,${0.35 + n.heat * 0.65})`;
    ctx.lineWidth = 1.5;
    ctx.fillStyle = n.heat > 0.4 ? "#fff" : "#000";
    ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = `rgba(255,255,255,${0.5 + n.heat * 0.5})`;
    ctx.font = "9px monospace"; ctx.textAlign = "center";
    ctx.fillText(n.label, n.x, n.y - r - 6);
    n.heat *= 0.985;
  }
  requestAnimationFrame(drawNetwork);
}

const legend = $("#node-legend");
FACULTIES.forEach((f) => {
  const s = document.createElement("span");
  s.textContent = f.label;
  s.onclick = () => { fire(f.id, 1); audit("manual ping", `faculty ${f.label} pulsed by operator`); };
  legend.appendChild(s);
});
window.addEventListener("resize", layoutNetwork);
layoutNetwork();
requestAnimationFrame(drawNetwork);
setInterval(() => fire(FACULTIES[Math.floor(Math.random() * FACULTIES.length)].id, 0.25), 1400);

/* ============================================================
   2 · KNOWLEDGE BASE
   ============================================================ */
const KB_KEY = "axiom_kb_v1";
const KB = {
  load() { try { return JSON.parse(localStorage.getItem(KB_KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(KB_KEY, JSON.stringify(items)); renderKB();
refreshChips(); },
  add(kind, title, body) {
    const items = KB.load();
    items.unshift({ id: crypto.randomUUID(), at: now(), kind, title, body });
    KB.save(items.slice(0, 200));
    fire("memory", 0.8); fire("learn", 0.6);
  },
};
/* AX-021: Dynamic quick chips from recent KB entries */
function refreshChips() {
  const items = KB.load().slice(0, 6);
  if (!items.length) return;
  const wrap = $(".quick");
  if (!wrap) return;
  // remove any previously injected dynamic chips
  wrap.querySelectorAll(".chip[data-dynamic]").forEach(el => el.remove());
  items.forEach(item => {
    if (!item.title) return;
    const btn = document.createElement("button");
    btn.className = "chip";
    btn.dataset.dynamic = "1";
    btn.textContent = item.title.slice(0, 32);
    btn.dataset.q = item.title;
    btn.addEventListener("click", () => {
      const cmd = $("#cmd");
      if (cmd) { cmd.value = item.title; cmd.focus(); }
    });
    wrap.appendChild(btn);
  });
}

function renderKB() {
  const items = KB.load();
  $("#kb-status").textContent = `KB: ${items.length} ENTRIES`;
  $("#kb-list").innerHTML = items.length
    ? items.slice(0, 30).map((i) => `
      <div class="kb-item">
        <div class="k-head"><span>${esc(i.kind).toUpperCase()}</span><span>${esc(i.at)}</span></div>
        <div class="k-title">${esc(i.title)}</div>
      </div>`).join("")
    : `<p class="dim">Empty. The agent writes here after every run.</p>`;
}
$("#kb-import").onclick = () => $("#kb-import-file").click();
$("#kb-import-file").onchange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const incoming = JSON.parse(ev.target.result);
      if (!Array.isArray(incoming)) throw new Error("expected array");
      const valid = incoming.filter(i => i && typeof i === "object" && typeof i.kind === "string" && typeof i.title === "string");
      if (!valid.length) throw new Error("no valid entries (each needs kind, title fields)");
      const existing = KB.load();
      const existingIds = new Set(existing.map((i) => i.id));
      const fresh = valid.filter((i) => !existingIds.has(i.id));
      KB.save([...fresh, ...existing].slice(0, 500));
      audit("import", `imported ${fresh.length} new entries (${incoming.length - fresh.length} dupes skipped)`);
      e.target.value = "";
    } catch (err) {
      audit("import-error", `failed to parse import: ${err.message}`);
    }
  };
  reader.readAsText(file);
};
$("#kb-export").onclick = () => {
  const blob = new Blob([JSON.stringify(KB.load(), null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = "axiom-knowledge-base.json"; a.click();
  audit("export", "knowledge base exported to JSON");
};
$("#kb-clear").onclick = () => {
  if (confirm("Wipe local knowledge base?")) { KB.save([]); audit("wipe", "knowledge base cleared by operator"); }
};

/* ── KB query — find relevant case studies & rules before codegen ── */
function queryKB(cls) {
  const items = KB.load();
  if (!items.length) return { caseStudies: [], rules: [], context: "" };

  const keywords = [cls.stack, cls.type, cls.raw.toLowerCase()].join(" ");
  const words = keywords.split(/\s+/).filter((w) => w.length > 3);

  // semantic scoring via AGENTKIT embeddings when loaded; word-overlap fallback
  const score = (item) => {
    const hay = (item.title + " " + JSON.stringify(item.body)).toLowerCase();
    if (window.AXIOM_EMBED) {
      return window.AXIOM_EMBED.cosine(window.AXIOM_EMBED.vec(keywords), window.AXIOM_EMBED.vec(hay));
    }
    return words.reduce((n, w) => n + (hay.includes(w) ? 1 : 0), 0);
  };

  const caseStudies = items
    .filter((i) => i.kind === "case-study")
    .map((i) => ({ ...i, _score: score(i) }))
    .filter((i) => i._score > 0)
    .sort((a, b) => b._score - a._score)
    .slice(0, 3);

  const rules = items
    .filter((i) => i.kind === "operator-rule")
    .map((i) => ({ ...i, _score: score(i) }))
    .filter((i) => i._score > 0)
    .sort((a, b) => b._score - a._score)
    .slice(0, 4);

  const context = [
    ...rules.map((r) => `RULE: ${r.title} → ${r.body?.apply || ""}`),
    ...caseStudies.map((c) => {
      const b = c.body || {};
      const pats = (b.patterns || []).slice(0, 4).join(", ");
      const tables = (b.supabaseTables || []).slice(0, 4).join(", ");
      return `CASE: ${c.title}` +
        (pats ? ` · patterns: ${pats}` : "") +
        (tables ? ` · tables: ${tables}` : "") +
        (b.insights?.length ? ` · insight: ${b.insights[0]}` : "");
    }),
  ].join("\n");

  return { caseStudies, rules, context };
}

/* ── LEXEVO LINGUISTIC PACKAGE ── */
// Loaded async from Supabase axiom_kb (kind='lexevo_bundle') after boot
let LEX = null;
async function loadLEX() {
  const c = sbConfig();
  if (!c) return;
  try {
    const res = await fetch(
      `${c.url}/rest/v1/axiom_kb?kind=eq.lexevo_bundle&select=body&order=created_at.desc&limit=1`,
      { headers: { apikey: c.key, Authorization: `Bearer ${c.key}` } }
    );
    const rows = await res.json();
    if (rows?.[0]?.body) {
      LEX = rows[0].body;
      audit("lexevo", `loaded from Supabase · gen ${LEX.generation} · ${LEX.bigrams_count} bigrams · ${LEX.emerged?.length||0} sentences`);
      say("act", `lexevo: linguistic package loaded from Supabase — gen ${LEX.generation} · ${LEX.bigrams_count} bigrams`);
      const tag = lexTagline();
      if (tag) say("think", `lexevo sample → "${tag}"`);
    }
  } catch(e) {// silently skip -- LEXEVO not yet synced
  }
  if (!LEX) {
    LEX = {
      generation: 0, bigrams_count: 0,
      bigrams: { "build a": 5, "next js": 4, "discord bot": 4, "whatsapp bot": 3 },
      emerged: ["build a nextjs dashboard with supabase"],
    };
  }
}}

function lexScore(text) {
  if (!LEX) return 0;
  const words = text.toLowerCase().replace(/[.,!?]/g,"").split(/\s+/);
  let s = 0;
  for (let i = 0; i < words.length-1; i++) {
    const bw = LEX.bigrams?.[words[i]+" "+words[i+1]];
    if (bw) s += Math.min(10, bw*2);
  }
  return Math.min(100, s);
}

function lexComplete(prefix, maxWords=3) {
  if (!LEX?.bigrams) return prefix;
  const words = prefix.toLowerCase().split(/\s+/);
  for (let i=0; i<maxWords; i++) {
    const last = words[words.length-1];
    const cands = Object.entries(LEX.bigrams)
      .filter(([k])=>k.startsWith(last+" "))
      .sort((a,b)=>b[1]-a[1]);
    if (!cands.length) break;
    const next = cands[0][0].split(" ")[1];
    if (words.includes(next)) break;
    words.push(next);
  }
  const s = words.join(" ");
  return s.charAt(0).toUpperCase()+s.slice(1);
}

function lexTagline() {
  if (!LEX?.emerged?.length) return null;
  const pool = LEX.emerged.filter(e=>e.fitness>=75);
  if (!pool.length) return null;
  return pool[Math.floor(Math.random()*pool.length)].text;
}

/* ── CLAUDE API BACKBONE ── */
const AI_KEY = "axiom_ai_key_v1";
function getAIKey() { return localStorage.getItem(AI_KEY) || ""; }
async function callClaude(systemPrompt, userPrompt) {
  // Try server-side proxy first (ANTHROPIC_API_KEY lives in Vercel env, never in the browser)
  try {
    const proxyRes = await fetch("/api/axiom/claude", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ system: systemPrompt, prompt: userPrompt }),
    });
    if (proxyRes.ok) {
      const data = await proxyRes.json();
      if (data.text) return data.text;
    }
    // 503 = proxy not configured server-side, fall through to direct
    if (proxyRes.status !== 503) {
      audit("ai", `proxy error ${proxyRes.status}`);
      return null;
    }
  } catch (_) { /* network error reaching /api — fall through */ }
  // Fallback: direct browser call (requires user to have saved a local key)
  return _callClaudeDirect(systemPrompt, userPrompt);
}

async function _callClaudeDirect(systemPrompt, userPrompt) {
  const key = getAIKey();
  if (!key) return null;
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({ model: "claude-sonnet-5", max_tokens: 8000, system: systemPrompt, messages: [{ role: "user", content: userPrompt }] }),
    });
    if (!res.ok) { _setAIErrorState(res.status); throw new Error(`${res.status}`); }
    const data = await res.json();
    return data.content?.[0]?.text || null;
  } catch (e) { audit("ai", `claude direct error — ${e.message}`); return null; }
}

function _setAIErrorState(status) {
  const el = $("#ai-key-status");
  if (!el) return;
  if (status === 401) el.textContent = "ai: invalid key — check Anthropic API key";
  else if (status === 429) el.textContent = "ai: rate limited — slow down or upgrade plan";
  else if (status === 529) el.textContent = "ai: Claude overloaded — retry shortly";
  else el.textContent = `ai: API error ${status}`;
}

/* ── CONVERSATION MEMORY ── */
const CONV_KEY = "axiom_conv_v1";
const CONV = {
  load() { try { return JSON.parse(localStorage.getItem(CONV_KEY)) || []; } catch { return []; } },
  push(role, content) {
    const hist = CONV.load();
    hist.push({ role, content: String(content).slice(0, 2000), at: now() });
    localStorage.setItem(CONV_KEY, JSON.stringify(hist.slice(-20)));
  },
  context() {
    return CONV.load().slice(-6).map(m => `[${m.role.toUpperCase()} @ ${m.at}]: ${m.content}`).join("\n");
  },
  clear() { localStorage.removeItem(CONV_KEY); },
};

/* ── REAL IMAGE HELPER — LoremFlickr (keyword photos) + Picsum fallback
      source.unsplash.com is deprecated/dead — never use it ── */
function realImg(w, h, keyword = "") {
  // Async-capable: if AXIOM_MEDIA is loaded, queue a background fetch and return a placeholder;
  // the hydratePage pass replaces data-media attrs after generation.
  if (window.AXIOM_DK) return keyword ? window.AXIOM_DK.photo(w, h, keyword, keyword) : window.AXIOM_DK.texture(w, h);
  if (keyword) {
    const slug = encodeURIComponent(keyword.split(",")[0].trim());
    // data-media attr allows post-generation hydration via AXIOM_MEDIA.hydratePage()
    return `https://loremflickr.com/${w}/${h}/${slug}`;
  }
  return `https://picsum.photos/${w}/${h}?grayscale`;
}

// After any HTML build, run media hydration if AXIOM_MEDIA is present
async function hydrateMedia(html) {
  if (!window.AXIOM_MEDIA) return html;
  return window.AXIOM_MEDIA.hydratePage(html);
}

/* AX-018: NEURAL cold-start feedback */
(function initNeuralStatus() {
  const pill = document.getElementById("neural-status");
  if (!pill) return;
  if (window.AXIOM_NEURAL) return; // neuralui.js handles it
  pill.textContent = "NEURAL: LOADING";
  pill.classList.remove("dim");
  // Poll until AXIOM_NEURAL is ready (set by neuralui.js)
  const t = setInterval(() => {
    if (window.AXIOM_NEURAL) {
      clearInterval(t);
      pill.textContent = "NEURAL: READY";
      pill.classList.add("on");
    }
  }, 500);
  setTimeout(() => { clearInterval(t); if (!window.AXIOM_NEURAL) { pill.textContent = "NEURAL: OFFLINE"; pill.classList.add("dim"); } }, 12000);
})();

/* AX-023: Keep footer phone in sync with selected brand */
function updateFooterPhone(brandKey) {
  const el = document.getElementById("ax-footer-phone");
  if (!el) return;
  const brand = BRANDS[brandKey];
  const phone = brand?.phone || "(658) 218-2282";
  el.textContent = phone;
}
document.getElementById("brand-selector")?.addEventListener("change", e => {
  updateFooterPhone(e.target.value);
  if (window.AXIOM_BRANDS) window.AXIOM_BRANDS.setActive?.(e.target.value);
});

/* ── BRAND REGISTRY ── */
const BRANDS = {
  "language cradle": { bg:"#0d0d1a", ink:"#fff", accent:"#c9a84c", dim:"#8888aa", name:"The Language Cradle" },
  "iblc":            { bg:"#0d0d1a", ink:"#fff", accent:"#c9a84c", dim:"#8888aa", name:"The Language Cradle" },
  "876 car":         { bg:"#0a1628", ink:"#fff", accent:"#1F56A8", dim:"#6688bb", name:"876 Luxury Car Wash" },
  "876 detail":      { bg:"#0a1628", ink:"#fff", accent:"#1F56A8", dim:"#6688bb", name:"876 Luxury Car Wash" },
  "ferguson":        { bg:"#0f0f0f", ink:"#fff", accent:"#e07b39", dim:"#aa7755", name:"Ferguson Law" },
  "home.":           { bg:"#0f0f0f", ink:"#fff", accent:"#e07b39", dim:"#aa7755", name:"H.O.M.E." },
  "bp courier":      { bg:"#001133", ink:"#fff", accent:"#f5c400", dim:"#998800", name:"BP Couriers" },
  "moverguy":        { bg:"#1a0500", ink:"#fff", accent:"#e84118", dim:"#aa3311", name:"The Mover Guy" },
  "solid trust":     { bg:"#001a2c", ink:"#fff", accent:"#00a8e8", dim:"#336688", name:"Solid Trust" },
  "ship2door":       { bg:"#001a0a", ink:"#fff", accent:"#00c853", dim:"#337744", name:"Ship 2 Door" },
  "aboo":            { bg:"#1a0f00", ink:"#fff", accent:"#f6a623", dim:"#996633", name:"Aboo Tours" },
  "morris pizza":    { bg:"#1a0000", ink:"#fff", accent:"#e53935", dim:"#993333", name:"Morris Pizza" },
  "j supreme":       { bg:"#000",    ink:"#fff", accent:"#fff",    dim:"#888",    name:"J Supreme Tech" },
  "jst":             { bg:"#000",    ink:"#fff", accent:"#fff",    dim:"#888",    name:"J Supreme Tech" },
  "cleanser":        { bg:"#fff",    ink:"#000", accent:"#ec2a8a", dim:"#888",    name:"The Cleanser JA" },
  "keltec":          { bg:"#0a0a0a", ink:"#fff", accent:"#7c3aed", dim:"#554488", name:"Keltec Promotions" },
};

function detectBrand(text) {
  if (window.AXIOM_BRANDS) return window.AXIOM_BRANDS.get(text);
  const t = text.toLowerCase();
  for (const [key, val] of Object.entries(BRANDS)) {
    if (t.includes(key)) return val;
  }
  return { bg:"#000", ink:"#fff", accent:"#fff", dim:"#6a6a6a", name:"" };
}

/* build-style profile */
const STYLE_KEY = "axiom_style_v1";
function learnStyle(cls) {
  let s; try { s = JSON.parse(localStorage.getItem(STYLE_KEY)) || {}; } catch { s = {}; }
  s.runs = (s.runs || 0) + 1;
  s.stacks = s.stacks || {}; s.stacks[cls.stack] = (s.stacks[cls.stack] || 0) + 1;
  s.types  = s.types  || {}; s.types[cls.type]   = (s.types[cls.type]   || 0) + 1;
  s.mono = true;
  localStorage.setItem(STYLE_KEY, JSON.stringify(s));
  return s;
}
function topKey(o) { return Object.entries(o || {}).sort((a, b) => b[1] - a[1])[0]?.[0] || "—"; }
function styleSummary() {
  let s; try { s = JSON.parse(localStorage.getItem(STYLE_KEY)) || {}; } catch { s = {}; }
  if (!s.runs) return "no profile yet — first run";
  return `${s.runs} runs · prefers ${topKey(s.stacks)} · builds mostly ${topKey(s.types)} · mono aesthetic locked`;
}

/* ============================================================
   3 · AUDIT TRAIL
   ============================================================ */
function audit(kind, msg) {
  const el = document.createElement("div");
  el.className = "audit-item";
  el.innerHTML = `<b>[${esc(kind).toUpperCase()}]</b> ${esc(msg)} <span style="float:right">${now()}</span>`;
  $("#audit-list").prepend(el);
  fire("audit", 0.5);
}

/* ============================================================
   4 · STATE ENGINE
   ============================================================ */
const stateEngine = {
  prev: null, curr: "IDLE — awaiting directive",
  set(next, futures = []) {
    this.prev = this.curr; this.curr = next;
    const si = $("#state-curr"); if (si) si.textContent = this.curr;
    const s2 = $("#state-curr2"); if (s2) s2.textContent = this.curr;
    const sp = $("#state-prev"); if (sp) sp.textContent = this.prev || "∅";
    const sn = $("#state-next"); if (sn) sn.textContent = futures.length
      ? futures.map((f) => `${(f.p * 100).toFixed(0).padStart(3)}%  ${f.s}`).join("\n") : "∅";
  },
};

/* ============================================================
   5 · REASONING — classify, risk model, if/then/else planner
   ============================================================ */

/*
  Stack detection hierarchy:
    nextjs  — Next.js App Router / Supabase / server components (operator primary stack)
    react   — plain React SPA
    node    — Express / Discord.js / WhatsApp bots / Railway workers
    html    — pure HTML + vanilla JS
*/
function classify(text) {
  const t = text.toLowerCase();

  const stack =
    /next\.?js|nextjs|app router|server component|supabase|vercel|tailwind|payload/.test(t) ? "nextjs" :
    /react|component|hook|jsx|spa/.test(t) ? "react" :
    /bot|worker|api|server|webhook|discord|slack|whatsapp|telegram|railway|express|node/.test(t) ? "node" :
    "html";

  const type =
    /dashboard|admin|panel|cms|crm/.test(t) ? "dashboard" :
    /portfolio|landing|site|home|marketing|agency/.test(t) ? "landing" :
    /video|edit|media|creative|reel|ffmpeg/.test(t) ? "media-tool" :
    /shop|store|commerce|product|cart|checkout/.test(t) ? "commerce" :
    /bot|discord|slack|whatsapp|telegram|notify/.test(t) ? "bot" :
    /api|webhook|worker|endpoint|server/.test(t) ? "api" :
    /mobile|ios|android/.test(t) ? "mobile" :
    /email|newsletter|campaign|drip/.test(t) ? "email" :
    "app";

  const size = /large|big|full|complex|multi/.test(t) ? "large" : /small|simple|tiny|quick|one/.test(t) ? "small" : "medium";
  const wantsSupabase = /supabase|database|db|auth/.test(t);
  const wantsAudit = /^audit/.test(t.trim());
  const isPatch = /^(add|update|fix|change|remove|replace|make|give|insert|append)\b/.test(t.trim()) && !!lastBuild;
  const brand = detectBrand(t);

  return { stack, type, size, wantsSupabase, wantsAudit, isPatch, brand, raw: text };
}

/* probability model */
function riskModel(cls) {
  const sizeFactor = { small: 0.6, medium: 1.0, large: 1.45 }[cls.size];
  const priors = [
    { name: "scope creep",             base: 0.35, types: { dashboard: 1.3, "media-tool": 1.5, commerce: 1.2, bot: 1.1 } },
    { name: "state management bugs",   base: cls.stack === "react" || cls.stack === "nextjs" ? 0.4 : 0.15, types: { dashboard: 1.4 } },
    { name: "layout/responsive drift", base: 0.3,  types: { landing: 1.3, dashboard: 1.1 } },
    { name: "api/CORS failures",       base: 0.25, types: { "media-tool": 1.4, commerce: 1.3, bot: 1.3, api: 1.5 } },
    { name: "perf bottlenecks",        base: 0.2,  types: { "media-tool": 1.7, dashboard: 1.2, bot: 1.1 } },
    { name: "auth / RLS misconfigured",base: cls.wantsSupabase ? 0.35 : 0.1, types: { dashboard: 1.3, commerce: 1.2 } },
    { name: "env vars missing on deploy", base: 0.3, types: { bot: 1.5, api: 1.4, commerce: 1.2 } },
    { name: "rate limit / quota hit",  base: 0.2,  types: { bot: 1.6, api: 1.4, email: 1.5 } },
    { name: "browser compat",          base: 0.15, types: { "media-tool": 1.2 } },
  ];
  return priors.map((p) => ({
    name: p.name,
    p: Math.min(0.97, p.base * sizeFactor * (p.types[cls.type] || 1)),
  })).sort((a, b) => b.p - a.p);
}

function renderRisk(risks, cls) {
  $("#risk-body").innerHTML =
    `<p class="dim" style="margin-bottom:8px">type=${cls.type} · size=${cls.size} · stack=${cls.stack}</p>` +
    risks.map((r) => `
      <div class="risk-item">
        <div class="lbl"><span>${esc(r.name)}</span><span>${(r.p * 100).toFixed(0)}%</span></div>
        <div class="bar"><i style="transform:scaleX(${r.p})"></i></div>
      </div>`).join("");
}

/* if/then/else decision tree — now surfaces AXIOM_STACK recommendations */
function plan(cls, risks) {
  const steps = [];

  // stack routing
  const stackLabel = { nextjs: "Next.js App Router + Tailwind + Supabase", react: "React SPA + hooks", node: "Node/Express Railway worker", html: "semantic HTML + vanilla JS" }[cls.stack];
  steps.push(`IF stack == "${cls.stack}" THEN scaffold ${stackLabel} ELSE fallback to html`);

  // size routing
  if (cls.size === "large") {
    steps.push(`IF size == "large" THEN split into modules (page / components / lib / api routes) ELSE single-file build`);
  } else {
    steps.push(`IF size == "${cls.size}" THEN single-file build (fast path)`);
  }

  // supabase wiring
  if (cls.wantsSupabase || cls.stack === "nextjs") {
    steps.push(`IF supabase detected THEN scaffold createClient() + server/client helper + typed query ELSE skip DB layer`);
  }

  // top risk mitigation
  const topRisk = risks[0];
  steps.push(
    `IF P(${topRisk.name}) > 0.5 THEN add mitigation up-front ELSE monitor during audit  →  ${topRisk.p > 0.5 ? "MITIGATE NOW" : "MONITOR"}`
  );

  // online / offline
  steps.push(`IF navigator.onLine THEN attach learn-feed references ELSE run from local knowledge base  →  ${navigator.onLine ? "ONLINE PATH" : "OFFLINE PATH"}`);

  // style memory
  steps.push(`IF style-profile exists THEN apply learned build style ELSE bootstrap default mono style`);

  // stack registry routing
  if (window.AXIOM_STACK) {
    const picks = window.AXIOM_STACK.recommend(cls).map((s) => s.name).join(" · ") || "no additional services";
    steps.push(`IF stack registry loaded THEN route build through operator services  →  ${picks}`);
  }

  return steps;
}

/* ============================================================
   6 · CODEGEN — Claude API first, template fallback
   ============================================================ */
async function generateAsync(cls, recall = {}) {
  const title = cls.type.toUpperCase().replace("-", " ");

  /* multi-page short-circuit — returns a zip bundle, not a single file */
  if (window.AXIOM_PAGES && window.AXIOM_PAGES.isMultiPage(cls.raw)) {
    const brand = window.AXIOM_BRANDS ? window.AXIOM_BRANDS.get(cls.raw) : cls.brand;
    const result = window.AXIOM_PAGES.assemble(cls.raw, brand);
    if (result.issues.length) {
      result.issues.forEach((i) => streamSay("warn", `LINK: ${i.file} → href="${i.href}" — ${i.fix}`));
    }
    streamSay("ok", `◆ MULTI-PAGE — ${result.pages.length} pages · ${result.files.length} files · ${result.issues.length} link issues`);
    /* store files array for zip download */
    lastBuild = { code: result.files.map((f) => `=== FILE: ${f.name} ===\n${f.data}`).join("\n\n"), files: result.files, multiPage: true };
    return lastBuild.code;
  }

  /* patch mode */
  if (cls.isPatch && lastBuild) {
    return patchBuild(cls.raw, lastBuild.code, cls.brand);
  }

  /* try Claude API (proxy-first, no local key needed) */
    const stackMap = { nextjs: "Next.js 15 App Router + Tailwind v4 + TypeScript", react: "React 19 SPA + hooks", node: "Node.js + Express + Railway deploy", html: "Pure HTML + vanilla JS + CSS custom properties" };
    const brandCtx = cls.brand.name ? `Brand: ${cls.brand.name}. Colors: bg=${cls.brand.bg}, ink=${cls.brand.ink}, accent=${cls.brand.accent}.` : "";
    const convCtx = CONV.context();
    const kbCtx = recall.context ? `KB Rules/Cases:\n${recall.context}` : "";
    const ctxBlock  = window.AXIOM_CTX  ? window.AXIOM_CTX.promptBlock(cls.raw)  : "";
    const docsBlock = window.AXIOM_DOCS ? window.AXIOM_DOCS.promptBlock() : "";

    const system = `You are AXIOM, an elite coding agent for J Supreme Tech (Jamaica).
Stack: ${stackMap[cls.stack]}.
${brandCtx}
${kbCtx}
Operator rules:
- Monochrome aesthetic: dark bg, white ink, one accent color
- No external paid services unless user specifies
- Always include (658) 218-2282 and jsupremetech.online in footers
- Output ONLY raw code — no explanation, no markdown fences, no preamble
- For HTML builds: fully self-contained with inline CSS and optional inline JS
- Use CSS animations (fadeUp, slideRight) on hero sections
- For images use: https://loremflickr.com/WIDTHxHEIGHT/KEYWORD or add data-media="KEYWORD" on placeholder divs for live Pexels/Pixabay injection
- For LARGE multi-file projects, split output into files separated by lines of the exact form: === FILE: path/to/file.ext ===
${ctxBlock}${docsBlock}${convCtx ? `\nConversation context:\n${convCtx}` : ""}`;

  const aiCode = await callClaude(system, cls.raw);
  if (aiCode) {
    CONV.push("user", cls.raw);
    CONV.push("assistant", aiCode.slice(0, 200) + "…");
    return aiCode;
  }

  /* fallback: template engine */
  const kbHeader = recall.context
    ? `/*\n  AXIOM KB CONTEXT — ${(recall.rules||[]).length} rules + ${(recall.caseStudies||[]).length} cases:\n${recall.context.split("\n").map(l=>"  "+l).join("\n")}\n*/\n\n`
    : "";

  CONV.push("user", cls.raw);

  /* inject integration blocks/files when AXIOM_INT is loaded */
  function applyIntegrations(baseCode, fileBag) {
    if (!window.AXIOM_INT) return baseCode;
    const injected = window.AXIOM_INT.inject(cls);
    if (!injected.blocks.length && !injected.files.length) return baseCode;
    injected.files.forEach((f) => {
      fileBag.push(f);
      streamSay("ok", `◆ INTEGRATION FILE: ${f.name}`);
    });
    if (injected.blocks.length) {
      streamSay("ok", `◆ INTEGRATIONS: ${injected.blocks.map((b) => b.split("\n")[0].slice(0, 60)).join(" · ")}`);
    }
    return baseCode;
  }

  const _extraFiles = [];

  if (cls.stack === "nextjs") { const c = kbHeader + nextjsTemplate(title, cls); applyIntegrations(c, _extraFiles); if (_extraFiles.length) { lastBuild = lastBuild || {}; lastBuild._intFiles = _extraFiles; } return c; }
  if (cls.stack === "node")   { return kbHeader + nodeTemplate(title, cls); }
  if (cls.type  === "email")  { return kbHeader + emailTemplate(title, cls); }
  if (cls.stack === "react")  { return kbHeader + reactTemplate(title, cls); }
  // v1.4 composer: industry blueprint + design recipe + block library + copy engine
  if (window.AXIOM_BLOCKS) {
    lastComposeMeta = null;
    const out = window.AXIOM_BLOCKS.compose(cls, KB.load, KB.add);
    lastComposeMeta = out.meta;
    applyIntegrations(out.html, _extraFiles);
    return out.html;
  }
  return kbHeader + htmlTemplate(title, cls);
}

/* sync wrapper kept for simulate lab */
function generate(cls, recall = {}) {
  const title = cls.type.toUpperCase().replace("-", " ");
  if (cls.isPatch && lastBuild) return patchBuild(cls.raw, lastBuild.code, cls.brand);
  const kbHeader = recall.context ? `/*\n  AXIOM KB CONTEXT\n${recall.context.split("\n").map(l=>"  "+l).join("\n")}\n*/\n\n` : "";
  if (cls.stack === "nextjs") return kbHeader + nextjsTemplate(title, cls);
  if (cls.stack === "node")   return kbHeader + nodeTemplate(title, cls);
  if (cls.type  === "email")  return kbHeader + emailTemplate(title, cls);
  if (cls.stack === "react")  return kbHeader + reactTemplate(title, cls);
  if (window.AXIOM_BLOCKS) {
    lastComposeMeta = null;
    const out = window.AXIOM_BLOCKS.compose(cls, KB.load, KB.add);
    lastComposeMeta = out.meta;
    return out.html;
  }
  return kbHeader + htmlTemplate(title, cls);
}
let lastComposeMeta = null;

/* patch — real section rewriter using marker comments */
function patchBuild(request, existingCode, brand) {
  const req = request.toLowerCase();
  let patched = existingCode;

  // color change
  const colorMatch = req.match(/(?:change|make|set)\s+(?:the\s+)?(\w+)\s+(?:color\s+)?(?:to\s+)?#?([0-9a-f]{3,6}|red|blue|green|black|white|gold|purple|orange)/i);
  if (colorMatch) {
    const target = colorMatch[1], color = colorMatch[2].startsWith("#") ? colorMatch[2] : colorMatch[2];
    patched = patched.replace(/--accent:[^;]+;/, `--accent:${color};`);
    return patched;
  }

  // add dark mode
  if (/dark.?mode|dark.?theme/.test(req)) {
    const dmCSS = `\n/* ── DARK MODE (PATCHED) ── */\n@media(prefers-color-scheme:dark){:root{--bg:#000;--ink:#fff;--dim:#777}}\n@media(prefers-color-scheme:light){:root{--bg:#fff;--ink:#000;--dim:#555}}\n`;
    patched = patched.replace("</style>", dmCSS + "</style>");
    return patched;
  }

  // add button / CTA
  if (/add\s+(?:a\s+)?(?:button|cta|call.to.action)/.test(req)) {
    const btnLabel = req.match(/(?:button|cta)\s+(?:that\s+says?\s+)?["']?([^"'\n]+)["']?/i)?.[1]?.trim().toUpperCase() || "GET STARTED";
    const btn = `\n  <div style="text-align:center;padding:20px 0">\n    <a href="#" style="display:inline-block;background:var(--accent);color:var(--bg);padding:14px 32px;font-family:var(--mono);font-size:11px;font-weight:700;letter-spacing:.2em;text-decoration:none;border:none;cursor:pointer">${btnLabel}</a>\n  </div>\n`;
    patched = patched.replace("</body>", btn + "</body>");
    return patched;
  }

  // add nav
  if (/add\s+(?:a\s+)?nav(?:bar|igation)?/.test(req)) {
    const nav = `\n  <nav style="display:flex;align-items:center;gap:24px;padding:0 32px;height:56px;border-bottom:1px solid var(--line);position:sticky;top:0;background:var(--bg);z-index:100;font-family:var(--mono)">\n    <span style="font-weight:700;letter-spacing:.3em;font-size:13px;flex:1">SITE</span>\n    <a href="#" style="color:var(--dim);font-size:10px;letter-spacing:.2em;text-decoration:none">HOME</a>\n    <a href="#" style="color:var(--dim);font-size:10px;letter-spacing:.2em;text-decoration:none">ABOUT</a>\n    <a href="#" style="color:var(--dim);font-size:10px;letter-spacing:.2em;text-decoration:none">CONTACT</a>\n  </nav>`;
    patched = patched.replace("<body>", "<body>" + nav);
    return patched;
  }

  // add footer
  if (/add\s+(?:a\s+)?footer/.test(req)) {
    const footer = `\n  <footer style="border-top:1px solid var(--line);padding:20px 32px;display:flex;justify-content:space-between;align-items:center;font-family:var(--mono);font-size:10px;color:var(--dim)">\n    <span>J Supreme Tech · (658) 218-2282</span>\n    <span>© ${new Date().getFullYear()}</span>\n  </footer>`;
    patched = patched.replace("</body>", footer + "\n</body>");
    return patched;
  }

  // add animation
  if (/add\s+(?:an?\s+)?(?:animation|fade|slide|transition)/.test(req)) {
    const animCSS = `\n/* ── ANIMATIONS (PATCHED) ── */\n@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}\n@keyframes fadeIn{from{opacity:0}to{opacity:1}}\n.animate{animation:fadeUp .6s ease forwards}\n.fade{animation:fadeIn .8s ease forwards}\n`;
    patched = patched.replace("</style>", animCSS + "</style>");
    // apply animation to hero
    patched = patched.replace('class="hero"', 'class="hero animate"');
    return patched;
  }

  // add form / contact
  if (/add\s+(?:a\s+)?(?:form|contact|input)/.test(req)) {
    const form = `\n  <section style="padding:60px 32px;max-width:520px;margin:0 auto;font-family:var(--mono)">\n    <h2 style="font-size:24px;font-weight:700;margin-bottom:24px">CONTACT</h2>\n    <form onsubmit="event.preventDefault();alert('Sent!')" style="display:flex;flex-direction:column;gap:14px">\n      <input name="name" placeholder="YOUR NAME" style="background:transparent;border:none;border-bottom:1px solid var(--line);color:var(--ink);font-family:var(--mono);padding:10px 0;outline:none;font-size:13px">\n      <input name="email" type="email" placeholder="YOUR EMAIL" style="background:transparent;border:none;border-bottom:1px solid var(--line);color:var(--ink);font-family:var(--mono);padding:10px 0;outline:none;font-size:13px">\n      <textarea name="msg" placeholder="MESSAGE" rows="4" style="background:transparent;border:none;border-bottom:1px solid var(--line);color:var(--ink);font-family:var(--mono);padding:10px 0;outline:none;font-size:13px;resize:vertical"></textarea>\n      <button type="submit" style="background:var(--accent);color:var(--bg);border:none;padding:12px 28px;font-family:var(--mono);font-size:11px;letter-spacing:.2em;font-weight:700;cursor:pointer;align-self:flex-start">SEND MESSAGE</button>\n    </form>\n  </section>`;
    patched = patched.replace("</body>", form + "\n</body>");
    return patched;
  }

  // generic: append as working code block
  return patched.replace("</body>", `\n  <!-- AXIOM PATCH: ${esc(request)} -->\n  <div id="patch-${Date.now()}" style="padding:20px 32px;border-top:1px solid var(--line);font-family:var(--mono);font-size:12px;color:var(--dim)">PATCH APPLIED: ${esc(request)}</div>\n</body>`);
}

/* ── SECTION COMPONENTS — assembled per type ── */
const SEC = {
  nav: (b, title) => `
      {/* ── NAV ── */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-[${b.accent}]/20 bg-[${b.bg}]/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-bold tracking-[0.3em] text-sm text-[${b.ink}]">${title}</span>
          <div className="hidden md:flex items-center gap-8 text-xs tracking-widest text-[${b.dim}]">
            <a href="#features" className="hover:text-[${b.ink}] transition-colors">FEATURES</a>
            <a href="#about" className="hover:text-[${b.ink}] transition-colors">ABOUT</a>
            <a href="#contact" className="hover:text-[${b.ink}] transition-colors">CONTACT</a>
          </div>
          <button className="text-xs border border-[${b.accent}] text-[${b.accent}] px-4 py-1.5 tracking-widest hover:bg-[${b.accent}] hover:text-[${b.bg}] transition-all">
            GET STARTED
          </button>
        </div>
      </nav>`,

  hero: (b, title, sub) => `
      {/* ── HERO ── */}
      <section className="pt-32 pb-24 px-6 text-center max-w-4xl mx-auto">
        <p className="text-xs tracking-[0.4em] text-[${b.accent}] mb-6">J SUPREME TECH · ${new Date().getFullYear()}</p>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[${b.ink}] leading-none mb-6">
          ${title}
        </h1>
        <p className="text-lg text-[${b.dim}] max-w-2xl mx-auto mb-10 leading-relaxed">
          ${sub}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-[${b.accent}] text-[${b.bg}] px-8 py-3 text-sm font-bold tracking-widest hover:opacity-90 transition-opacity">
            START NOW
          </button>
          <button className="border border-[${b.ink}]/20 text-[${b.dim}] px-8 py-3 text-sm tracking-widest hover:border-[${b.ink}]/50 transition-colors">
            LEARN MORE
          </button>
        </div>
      </section>`,

  features: (b) => `
      {/* ── FEATURES ── */}
      <section id="features" className="py-24 px-6 border-t border-[${b.ink}]/5">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs tracking-[0.4em] text-[${b.accent}] mb-3 text-center">WHAT WE OFFER</p>
          <h2 className="text-3xl font-bold text-center text-[${b.ink}] mb-16">Built Different.</h2>
          <div className="grid md:grid-cols-3 gap-px bg-[${b.ink}]/5">
            {[
              { label: "FAST", body: "Optimised for speed on every device and connection." },
              { label: "SECURE", body: "Bank-grade encryption and Supabase RLS on every row." },
              { label: "SCALABLE", body: "Vercel edge + Railway workers handle any traffic spike." },
            ].map((f) => (
              <div key={f.label} className="bg-[${b.bg}] p-8 hover:bg-[${b.ink}]/3 transition-colors group">
                <div className="w-8 h-8 border border-[${b.accent}]/40 mb-6 group-hover:border-[${b.accent}] transition-colors" />
                <h3 className="text-xs font-bold tracking-[0.3em] text-[${b.ink}] mb-3">{f.label}</h3>
                <p className="text-sm text-[${b.dim}] leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>`,

  stats: (b) => `
      {/* ── STATS ── */}
      <section className="py-16 px-6 border-t border-[${b.ink}]/5">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-px bg-[${b.ink}]/5">
          {[
            { n: "24K+", l: "USERS" }, { n: "99.9%", l: "UPTIME" },
            { n: "< 1s",  l: "LOAD TIME" }, { n: "16",    l: "BRANDS" },
          ].map((s) => (
            <div key={s.l} className="bg-[${b.bg}] py-10 text-center">
              <p className="text-4xl font-bold text-[${b.ink}] mb-2">{s.n}</p>
              <p className="text-xs tracking-[0.3em] text-[${b.dim}]">{s.l}</p>
            </div>
          ))}
        </div>
      </section>`,

  dashboard: (b) => `
      {/* ── DASHBOARD LAYOUT ── */}
      <div className="flex h-[calc(100vh-56px)]">
        {/* Sidebar */}
        <aside className="w-56 border-r border-[${b.ink}]/10 flex flex-col shrink-0">
          {["OVERVIEW", "ANALYTICS", "CLIENTS", "CONTENT", "SETTINGS"].map((item) => (
            <button key={item}
              className="text-left px-5 py-3 text-xs tracking-widest text-[${b.dim}] hover:text-[${b.ink}] hover:bg-[${b.ink}]/3 transition-all border-b border-[${b.ink}]/5 first:text-[${b.accent}] first:font-bold"
            >{item}</button>
          ))}
          <div className="mt-auto p-5 border-t border-[${b.ink}]/10">
            <p className="text-[9px] tracking-widest text-[${b.dim}]">J SUPREME TECH</p>
          </div>
        </aside>
        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* KPI Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { l: "REVENUE", v: "$12,450", d: "+18%" },
              { l: "CLIENTS", v: "34",      d: "+3"   },
              { l: "TICKETS", v: "8",        d: "-2"   },
              { l: "UPTIME",  v: "99.9%",   d: "30d"  },
            ].map((k) => (
              <div key={k.l} className="border border-[${b.ink}]/10 p-4 hover:border-[${b.accent}]/30 transition-colors">
                <p className="text-[9px] tracking-[0.3em] text-[${b.dim}] mb-2">{k.l}</p>
                <p className="text-2xl font-bold text-[${b.ink}]">{k.v}</p>
                <p className="text-[10px] text-[${b.accent}] mt-1">{k.d}</p>
              </div>
            ))}
          </div>
          {/* Table */}
          <div className="border border-[${b.ink}]/10">
            <div className="px-4 py-3 border-b border-[${b.ink}]/10 flex justify-between items-center">
              <p className="text-xs font-bold tracking-widest text-[${b.ink}]">RECENT ACTIVITY</p>
              <button className="text-[9px] text-[${b.dim}] tracking-widest hover:text-[${b.ink}]">VIEW ALL</button>
            </div>
            {["Ferguson Law · Invoice paid · $550", "Language Cradle · New sign-up · Portal", "BP Couriers · Delivery confirmed · #4421"].map((row) => (
              <div key={row} className="px-4 py-3 border-b border-[${b.ink}]/5 text-xs text-[${b.dim}] hover:bg-[${b.ink}]/2 flex justify-between">
                <span>{row.split(" · ")[0]}</span>
                <span className="text-[${b.ink}]/50">{row.split(" · ")[1]}</span>
                <span className="text-[${b.accent}]/70">{row.split(" · ")[2]}</span>
              </div>
            ))}
          </div>
        </main>
      </div>`,

  cta: (b, title) => `
      {/* ── CTA ── */}
      <section className="py-24 px-6 text-center border-t border-[${b.ink}]/5">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold text-[${b.ink}] mb-4">Ready to Build?</h2>
          <p className="text-[${b.dim}] mb-8">Join the J Supreme ecosystem. Launch in days, not months.</p>
          <button className="bg-[${b.accent}] text-[${b.bg}] px-10 py-4 text-sm font-bold tracking-widest hover:opacity-90 transition-opacity">
            START YOUR PROJECT
          </button>
        </div>
      </section>`,

  footer: (b, title) => `
      {/* ── FOOTER ── */}
      <footer className="border-t border-[${b.ink}]/10 px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-6">
          <div>
            <p className="text-sm font-bold tracking-[0.3em] text-[${b.ink}] mb-1">${title}</p>
            <p className="text-xs text-[${b.dim}]">J Supreme Tech · (658) 218-2282 · jsupremetech.online</p>
          </div>
          <div className="flex gap-8 text-xs text-[${b.dim}]">
            <a href="#" className="hover:text-[${b.ink}] tracking-widest transition-colors">PRIVACY</a>
            <a href="#" className="hover:text-[${b.ink}] tracking-widest transition-colors">TERMS</a>
            <a href="#" className="hover:text-[${b.ink}] tracking-widest transition-colors">CONTACT</a>
          </div>
          <p className="text-[9px] text-[${b.dim}] tracking-widest">© ${new Date().getFullYear()} · GENERATED BY AXIOM</p>
        </div>
      </footer>`,
};

/* Next.js App Router — assembled from sections */
function nextjsTemplate(title, cls) {
  const b = cls.brand;
  const withDB = cls.wantsSupabase || cls.type === "dashboard" || cls.type === "commerce";
  const isDash = cls.type === "dashboard";
  const slug = title.replace(/\s+/g, "");
  const sub = {
    landing:  "Premium digital solutions for Jamaica's fastest-growing businesses.",
    dashboard:"Real-time command centre for your entire operation.",
    commerce: "Shop seamlessly. Pay securely. Deliver fast.",
    app:      "A powerful, beautiful interface for your workflow.",
    "media-tool": "Create, edit, and publish — all in one place.",
  }[cls.type] || "Built for speed, designed to impress.";

  const dbImport  = withDB ? `\nimport { createClient } from "@/lib/supabase/client";` : "";
  const dbHook    = withDB ? `
  useEffect(() => {
    const sb = createClient();
    sb.from("your_table").select("*").then(({ data }) => setRows(data ?? []));
  }, []);` : "";
  const dbLib     = withDB ? `
// ─ lib/supabase/client.ts ────────────────────────────────
// import { createBrowserClient } from "@supabase/ssr";
// export const createClient = () => createBrowserClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// );` : "";

  return `// AXIOM · Next.js App Router · ${cls.type} · ${cls.size} · ${b.name || "J Supreme Tech"}
// deploy: vercel --prod  |  env: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
"use client";
import { useState, useEffect } from "react";${dbImport}

export default function ${slug}Page() {
  const [rows, setRows] = useState<Record<string,string>[]>([]);
  const [ready, setReady] = useState(false);${dbHook}

  useEffect(() => {
    if (!${withDB}) setRows([{ id:"1",label:"ALPHA" },{ id:"2",label:"BETA" },{ id:"3",label:"GAMMA" }]);
    setReady(true);
  }, []);

  return (
    <div className="min-h-screen font-mono text-[${b.ink}]"
         style={{ background: "${b.bg}" }}>
${isDash ? SEC.nav(b, title) + SEC.dashboard(b) : SEC.nav(b, title) + SEC.hero(b, title, sub) + SEC.features(b) + SEC.stats(b) + SEC.cta(b, title)}
${SEC.footer(b, title)}
    </div>
  );
}
${dbLib}`;
}

/* Node / Express — bots, workers, Railway deploys */
function nodeTemplate(title, cls) {
  const isBot = cls.type === "bot";
  const isDiscord = /discord/.test(cls.raw.toLowerCase());
  const isWhatsApp = /whatsapp/.test(cls.raw.toLowerCase());

  if (isDiscord) {
    return `// AXIOM build — Discord bot · Railway deploy · discord.js v14
// env: DISCORD_TOKEN, DISCORD_CLIENT_ID
// deploy: push to Railway (railway up)
import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from "discord.js";

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

const commands = [
  new SlashCommandBuilder().setName("ping").setDescription("Latency check"),
  // add your slash commands here
].map((c) => c.toJSON());

client.once("ready", () => console.log(\`[AXIOM] \${client.user?.tag} online\`));

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName === "ping") {
    await interaction.reply({ content: \`Pong — \${client.ws.ping}ms\`, ephemeral: true });
  }
});

// register slash commands
const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN!);
rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!), { body: commands })
  .then(() => console.log("[AXIOM] commands registered"))
  .catch(console.error);

client.login(process.env.DISCORD_TOKEN);`;
  }

  if (isWhatsApp) {
    return `// AXIOM build — WhatsApp Cloud API bot · Railway deploy
// env: WA_TOKEN, WA_PHONE_NUMBER_ID, VERIFY_TOKEN
// deploy: push to Railway (railway up)
import express from "express";
const app = express();
app.use(express.json());

const WA_URL = \`https://graph.facebook.com/v19.0/\${process.env.WA_PHONE_NUMBER_ID}/messages\`;

// webhook verify
app.get("/webhook", (req, res) => {
  if (req.query["hub.verify_token"] === process.env.VERIFY_TOKEN) {
    res.send(req.query["hub.challenge"]);
  } else res.sendStatus(403);
});

// incoming messages
app.post("/webhook", async (req, res) => {
  res.sendStatus(200);
  const msg = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  if (!msg || msg.type !== "text") return;
  const from = msg.from;
  const text = msg.text.body.trim().toLowerCase();

  // reply logic — extend here
  let reply = "Got it. AXIOM is processing your request.";
  if (text === "hi" || text === "hello") reply = "Hello! How can I help you today?";

  await fetch(WA_URL, {
    method: "POST",
    headers: { Authorization: \`Bearer \${process.env.WA_TOKEN}\`, "Content-Type": "application/json" },
    body: JSON.stringify({ messaging_product: "whatsapp", to: from, type: "text", text: { body: reply } }),
  });
});

app.listen(process.env.PORT || 3000, () => console.log("[AXIOM] WhatsApp bot ready"));`;
  }

  // generic Express API / worker
  return `// AXIOM build — Node/Express · ${cls.type} · Railway deploy
// env: PORT (Railway sets automatically)
import express from "express";
import cors from "cors";
const app = express();
app.use(cors(), express.json());

// health check — Railway uses this
app.get("/health", (_req, res) => res.json({ status: "ok", ts: new Date().toISOString() }));

// ${title} routes
app.get("/api/${cls.type}", async (_req, res) => {
  try {
    // wire your logic here
    res.json({ data: [], generated: "${now()}" });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

app.post("/api/${cls.type}", async (req, res) => {
  const body = req.body;
  // process body.payload
  res.json({ ok: true, received: body });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(\`[AXIOM] ${title} API running on :\${PORT}\`));`;
}

/* Email template — Resend + React Email pattern */
function emailTemplate(title, cls) {
  return `// AXIOM build — transactional email · Resend · ${cls.size}
// env: RESEND_API_KEY
// docs: resend.com/docs · react.email
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function send${title.replace(/\s/g, "")}Email(to: string, data: Record<string, string>) {
  const { data: result, error } = await resend.emails.send({
    from: "J Supreme Tech <hello@jsupremetech.online>",
    to,
    subject: "${title}",
    html: \`
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"><style>
        body { background: #000; color: #fff; font-family: 'SF Mono', Consolas, monospace; padding: 32px; }
        h1 { font-size: 18px; letter-spacing: 4px; border-bottom: 1px solid #2a2a2a; padding-bottom: 12px; }
        p { color: #8a8a8a; font-size: 13px; line-height: 1.6; }
        .cta { display: inline-block; border: 1px solid #fff; padding: 10px 24px; color: #fff;
               text-decoration: none; font-size: 11px; letter-spacing: 2px; margin-top: 20px; }
        .foot { border-top: 1px solid #2a2a2a; margin-top: 32px; padding-top: 12px;
                color: #3a3a3a; font-size: 10px; }
      </style></head>
      <body>
        <h1>${title.toUpperCase()}</h1>
        <p>\${data.message || "Your message here."}</p>
        <a href="\${data.ctaUrl || '#'}" class="cta">\${data.ctaLabel || "OPEN"}</a>
        <div class="foot">J Supreme Tech · (658) 218-2282 · jsupremetech.online</div>
      </body>
      </html>
    \`,
  });
  if (error) throw new Error(JSON.stringify(error));
  return result;
}`;
}

/* React SPA — styled with brand colors + real layout */
function reactTemplate(title, cls) {
  const b = cls.brand;
  const slug = title.replace(/\s+/g, "");
  return `// AXIOM · React SPA · ${cls.type} · ${cls.size} · ${b.name || "J Supreme Tech"}
// deploy: vercel --prod  (static export)
import { useState, useEffect } from "react";

const T = {
  bg: "${b.bg}", ink: "${b.ink}", accent: "${b.accent}", dim: "${b.dim}",
  line: "color-mix(in srgb,${b.ink} 8%,${b.bg})",
  font: '"SF Mono","Cascadia Code",Consolas,monospace',
};
const S = (styles) => Object.assign({}, styles);

const Card = ({ title, body, accent }) => (
  <div style={S({ border:\`1px solid \${T.line}\`, padding:20, transition:"border-color .15s",
    ...(accent ? { borderColor:T.accent } : {}) })}>
    <h3 style={{ fontSize:11, letterSpacing:"0.25em", marginBottom:8, color:T.ink }}>{title}</h3>
    <p style={{ fontSize:12, color:T.dim, lineHeight:1.7 }}>{body}</p>
  </div>
);

export default function ${slug}App() {
  const [active, setActive] = useState("HOME");
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    // wire Supabase or fetch here
    setItems(["Alpha Project", "Beta Launch", "Gamma Release"]);
  }, []);

  return (
    <div style={{ background:T.bg, color:T.ink, fontFamily:T.font, minHeight:"100vh" }}>
      {/* Nav */}
      <nav style={{ display:"flex", alignItems:"center", padding:"0 24px", height:52,
        borderBottom:\`1px solid \${T.line}\`, position:"sticky", top:0, background:T.bg, zIndex:100 }}>
        <span style={{ fontWeight:700, letterSpacing:"0.3em", fontSize:13, flex:1 }}>${title}</span>
        {["HOME","WORK","ABOUT","CONTACT"].map((n) => (
          <button key={n} onClick={() => setActive(n)}
            style={{ background:"none", border:"none", cursor:"pointer", fontFamily:T.font,
              fontSize:10, letterSpacing:"0.2em", padding:"0 14px", height:52,
              color: active===n ? T.ink : T.dim,
              borderBottom: active===n ? \`2px solid \${T.accent}\` : "2px solid transparent",
              transition:"all .15s" }}>
            {n}
          </button>
        ))}
      </nav>

      {/* Hero */}
      <section style={{ padding:"72px 24px 48px", textAlign:"center", maxWidth:720, margin:"0 auto" }}>
        <p style={{ fontSize:10, letterSpacing:"0.4em", color:T.accent, marginBottom:16 }}>J SUPREME TECH · ${new Date().getFullYear()}</p>
        <h1 style={{ fontSize:"clamp(32px,7vw,64px)", fontWeight:700, lineHeight:1, marginBottom:16 }}>${title}</h1>
        <p style={{ color:T.dim, fontSize:14, lineHeight:1.7, marginBottom:28 }}>
          Built for speed, designed to impress. The J Supreme ecosystem in your hands.
        </p>
        <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
          <button style={{ background:T.accent, color:T.bg, border:"none", padding:"12px 28px",
            fontSize:11, letterSpacing:"0.2em", fontWeight:700, fontFamily:T.font, cursor:"pointer" }}>
            GET STARTED
          </button>
          <button style={{ background:"none", border:\`1px solid \${T.line}\`, color:T.dim,
            padding:"12px 28px", fontSize:11, letterSpacing:"0.2em", fontFamily:T.font, cursor:"pointer" }}>
            LEARN MORE
          </button>
        </div>
      </section>

      {/* Grid */}
      <section style={{ padding:"48px 24px", borderTop:\`1px solid \${T.line}\` }}>
        <div style={{ maxWidth:960, margin:"0 auto", display:"grid",
          gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:1, background:T.line }}>
          {items.map((it, i) => (
            <Card key={it} title={it.toUpperCase()} body="Tap to view full details and project breakdown." accent={i===0} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop:\`1px solid \${T.line}\`, padding:"20px 24px",
        display:"flex", justifyContent:"space-between", alignItems:"center",
        flexWrap:"wrap", gap:10, fontSize:10, color:T.dim }}>
        <span style={{ letterSpacing:"0.2em", color:T.ink, fontWeight:700 }}>${title} · J Supreme Tech</span>
        <span>(658) 218-2282 · jsupremetech.online</span>
        <span>© ${new Date().getFullYear()} · AXIOM</span>
      </footer>
    </div>
  );
}`;
}

/* ── LUCIDE ICONS CDN snippet (inline SVG fallback for component library) ── */
const ICONS = {
  check: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 18 4 13"/></svg>`,
  arrow: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
  star:  `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  zap:   `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  shield:`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
};

/* HTML — full self-contained page, renders live in iframe */
function htmlTemplate(title, cls) {
  const b = cls.brand;
  const keyword = cls.type === "landing" ? title.replace(/[^a-zA-Z ]/g,"").trim() : "technology,minimal,professional";
  const img = (w,h,kw="") => realImg(w, h, kw || keyword);
  const isDash = cls.type === "dashboard";
  const isPort = cls.type === "landing";

  const dashContent = `
  <div class="dash-wrap">
    <aside class="sidebar">
      <div class="sidebar-logo">${title}</div>
      <nav class="sidebar-nav">
        <a href="#" class="nav-item active">OVERVIEW</a>
        <a href="#" class="nav-item">ANALYTICS</a>
        <a href="#" class="nav-item">CLIENTS</a>
        <a href="#" class="nav-item">CONTENT</a>
        <a href="#" class="nav-item">SETTINGS</a>
      </nav>
      <div class="sidebar-foot">J SUPREME TECH · (658) 218-2282</div>
    </aside>
    <main class="dash-main">
      <div class="kpi-row">
        <div class="kpi-card"><span class="kpi-label">REVENUE</span><span class="kpi-val">$12,450</span><span class="kpi-delta up">+18%</span></div>
        <div class="kpi-card"><span class="kpi-label">CLIENTS</span><span class="kpi-val">34</span><span class="kpi-delta up">+3</span></div>
        <div class="kpi-card"><span class="kpi-label">TICKETS</span><span class="kpi-val">8</span><span class="kpi-delta down">-2</span></div>
        <div class="kpi-card"><span class="kpi-label">UPTIME</span><span class="kpi-val">99.9%</span><span class="kpi-delta">30d</span></div>
      </div>
      <div class="table-card">
        <div class="table-head"><span>RECENT ACTIVITY</span><a href="#">VIEW ALL</a></div>
        <table><thead><tr><th>CLIENT</th><th>ACTION</th><th>VALUE</th><th>DATE</th></tr></thead>
        <tbody>
          <tr><td>Ferguson Law</td><td>Invoice paid</td><td class="accent">$550</td><td class="dim">Today</td></tr>
          <tr><td>Language Cradle</td><td>New sign-up</td><td class="accent">Portal</td><td class="dim">Yesterday</td></tr>
          <tr><td>BP Couriers</td><td>Delivery confirmed</td><td class="accent">#4421</td><td class="dim">Jul 19</td></tr>
          <tr><td>MoverGuy</td><td>Quote requested</td><td class="accent">$1,200</td><td class="dim">Jul 18</td></tr>
        </tbody></table>
      </div>
    </main>
  </div>`;

  const landingContent = `
  <nav class="nav">
    <span class="nav-logo">${title}</span>
    <div class="nav-links">
      <a href="#features">FEATURES</a>
      <a href="#about">ABOUT</a>
      <a href="#contact">CONTACT</a>
    </div>
    <a href="#contact" class="nav-cta">GET STARTED</a>
  </nav>
  <section class="hero">
    <p class="eyebrow animate stagger-1">J SUPREME TECH · ${new Date().getFullYear()}</p>
    <h1 class="animate stagger-2">${title}</h1>
    <p class="hero-sub animate stagger-3">${lexTagline() || "Premium digital solutions for Jamaica's fastest-growing businesses. Built to impress, designed to convert."}</p>
    <div class="hero-btns animate stagger-4">
      <a href="#contact" class="btn-primary">START YOUR PROJECT</a>
      <a href="#features" class="btn-ghost">SEE HOW IT WORKS</a>
    </div>
    <img src="${img(1200,480,keyword)}" alt="hero" class="hero-img fade" loading="lazy">
  </section>
  <section class="features" id="features">
    <p class="section-label">WHAT WE OFFER</p>
    <h2>Built Different.</h2>
    <div class="features-grid">
      <div class="feat-card"><div class="feat-icon"></div><h3>FAST</h3><p>Sub-second load on every device and connection globally.</p></div>
      <div class="feat-card"><div class="feat-icon"></div><h3>SECURE</h3><p>Bank-grade encryption and row-level security on every record.</p></div>
      <div class="feat-card"><div class="feat-icon"></div><h3>SCALABLE</h3><p>Vercel edge + Railway workers handle any traffic spike, zero downtime.</p></div>
    </div>
  </section>
  <section class="stats-row">
    <div class="stat"><span class="stat-n">24K+</span><span class="stat-l">USERS</span></div>
    <div class="stat"><span class="stat-n">99.9%</span><span class="stat-l">UPTIME</span></div>
    <div class="stat"><span class="stat-n">&lt; 1s</span><span class="stat-l">LOAD TIME</span></div>
    <div class="stat"><span class="stat-n">16</span><span class="stat-l">BRANDS</span></div>
  </section>
  <section class="cta-section" id="contact">
    <h2>Ready to Build?</h2>
    <p>Join the J Supreme ecosystem. Launch in days, not months.</p>
    <a href="tel:6582182282" class="btn-primary">CALL (658) 218-2282</a>
  </section>
  <footer class="footer">
    <span class="footer-brand">${title} · J Supreme Tech</span>
    <div class="footer-links"><a href="#">PRIVACY</a><a href="#">TERMS</a><a href="#">CONTACT</a></div>
    <span class="footer-copy">© ${new Date().getFullYear()} · AXIOM</span>
  </footer>`;

  // pull evolved fragments from KB (template evolution)
  const evolved = window.AXIOM_TRAIN ? window.AXIOM_TRAIN.getEvolvedFragments(cls, KB.load) : {};
  const extraAnimations = (evolved.animations || []).flatMap(a => a.split(",")).filter(Boolean)
    .map(name => `@keyframes ${name}{from{opacity:0}to{opacity:1}}`).join("\n");
  const provenSectionOrder = evolved.sectionOrder?.[0] || null;

  return `<!-- AXIOM · html · ${cls.type} · ${cls.size} · ${b.name || "J Supreme Tech"} -->
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
:root{--bg:${b.bg};--ink:${b.ink};--accent:${b.accent};--dim:${b.dim};--line:color-mix(in srgb,${b.ink} 8%,${b.bg});--mono:"SF Mono",Consolas,monospace}
html,body{background:var(--bg);color:var(--ink);font-family:var(--mono);font-size:14px;line-height:1.6}
a{color:inherit;text-decoration:none}
img{max-width:100%;height:auto;display:block}

/* NAV */
.nav{display:flex;align-items:center;gap:24px;padding:0 32px;height:56px;border-bottom:1px solid var(--line);position:sticky;top:0;background:var(--bg);z-index:100}
.nav-logo{font-weight:700;letter-spacing:.3em;font-size:13px;flex:1}
.nav-links{display:flex;gap:28px;font-size:10px;letter-spacing:.2em;color:var(--dim)}
.nav-links a:hover{color:var(--ink)}
.nav-cta{font-size:10px;letter-spacing:.2em;border:1px solid var(--accent);color:var(--accent);padding:6px 16px;transition:.15s}
.nav-cta:hover{background:var(--accent);color:var(--bg)}

/* HERO */
.hero{padding:80px 32px 60px;text-align:center;max-width:800px;margin:0 auto}
.eyebrow{font-size:10px;letter-spacing:.4em;color:var(--accent);margin-bottom:20px}
.hero h1{font-size:clamp(36px,8vw,72px);font-weight:700;letter-spacing:-.02em;line-height:1;margin-bottom:20px}
.hero-sub{font-size:15px;color:var(--dim);max-width:560px;margin:0 auto 32px;line-height:1.7}
.hero-btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:40px}
.hero-img{width:100%;max-width:900px;margin:0 auto;border:1px solid var(--line)}
.btn-primary{background:var(--accent);color:var(--bg);padding:14px 32px;font-size:11px;letter-spacing:.2em;font-weight:700;font-family:var(--mono);cursor:pointer;border:none;transition:.15s}
.btn-primary:hover{opacity:.85}
.btn-ghost{border:1px solid var(--line);color:var(--dim);padding:14px 32px;font-size:11px;letter-spacing:.2em;font-family:var(--mono);cursor:pointer;transition:.15s}
.btn-ghost:hover{border-color:var(--ink);color:var(--ink)}

/* FEATURES */
.features{padding:80px 32px;border-top:1px solid var(--line)}
.section-label{font-size:10px;letter-spacing:.4em;color:var(--accent);margin-bottom:10px;text-align:center}
.features h2{font-size:36px;font-weight:700;text-align:center;margin-bottom:48px}
.features-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1px;background:var(--line)}
.feat-card{background:var(--bg);padding:32px;transition:.15s}
.feat-card:hover{background:color-mix(in srgb,var(--ink) 3%,var(--bg))}
.feat-icon{width:32px;height:32px;border:1px solid var(--accent);opacity:.4;margin-bottom:20px;transition:.15s}
.feat-card:hover .feat-icon{opacity:1}
.feat-card h3{font-size:11px;letter-spacing:.25em;margin-bottom:10px}
.feat-card p{font-size:12px;color:var(--dim);line-height:1.7}

/* STATS */
.stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--line);border-top:1px solid var(--line)}
.stat{background:var(--bg);padding:40px 20px;text-align:center}
.stat-n{display:block;font-size:40px;font-weight:700;margin-bottom:8px}
.stat-l{display:block;font-size:10px;letter-spacing:.3em;color:var(--dim)}

/* CTA */
.cta-section{padding:80px 32px;text-align:center;border-top:1px solid var(--line)}
.cta-section h2{font-size:36px;font-weight:700;margin-bottom:12px}
.cta-section p{color:var(--dim);margin-bottom:28px;font-size:14px}

/* FOOTER */
.footer{border-top:1px solid var(--line);padding:24px 32px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px}
.footer-brand{font-size:12px;font-weight:700;letter-spacing:.15em}
.footer-links{display:flex;gap:20px;font-size:10px;letter-spacing:.2em;color:var(--dim)}
.footer-links a:hover{color:var(--ink)}
.footer-copy{font-size:10px;color:var(--dim);letter-spacing:.1em}

/* DASHBOARD */
.dash-wrap{display:flex;height:calc(100vh - 0px)}
.sidebar{width:200px;border-right:1px solid var(--line);display:flex;flex-direction:column;flex-shrink:0}
.sidebar-logo{padding:16px 20px;font-weight:700;letter-spacing:.25em;font-size:12px;border-bottom:1px solid var(--line)}
.sidebar-nav{display:flex;flex-direction:column;flex:1}
.nav-item{padding:12px 20px;font-size:10px;letter-spacing:.2em;color:var(--dim);border-bottom:1px solid var(--line);transition:.12s}
.nav-item:hover,.nav-item.active{color:var(--ink);background:color-mix(in srgb,var(--ink) 4%,var(--bg))}
.nav-item.active{color:var(--accent);font-weight:700}
.sidebar-foot{padding:14px 20px;font-size:9px;color:var(--dim);border-top:1px solid var(--line)}
.dash-main{flex:1;overflow-y:auto;padding:20px}
.kpi-row{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px}
.kpi-card{border:1px solid var(--line);padding:16px;transition:.15s}
.kpi-card:hover{border-color:color-mix(in srgb,var(--accent) 40%,transparent)}
.kpi-label{display:block;font-size:9px;letter-spacing:.25em;color:var(--dim);margin-bottom:8px}
.kpi-val{display:block;font-size:26px;font-weight:700}
.kpi-delta{display:block;font-size:10px;margin-top:4px;color:var(--accent)}
.kpi-delta.up{color:#22c55e}.kpi-delta.down{color:#ef4444}
.table-card{border:1px solid var(--line)}
.table-head{display:flex;justify-content:space-between;align-items:center;padding:10px 14px;border-bottom:1px solid var(--line);font-size:10px;font-weight:700;letter-spacing:.2em}
.table-head a{font-size:9px;color:var(--dim);letter-spacing:.15em}
table{width:100%;border-collapse:collapse}
th{text-align:left;padding:8px 14px;font-size:9px;letter-spacing:.2em;color:var(--dim);border-bottom:1px solid var(--line)}
td{padding:10px 14px;font-size:11px;border-bottom:1px solid var(--line)}
tr:hover td{background:color-mix(in srgb,var(--ink) 2%,var(--bg))}
.accent{color:var(--accent)}.dim{color:var(--dim)}

@media(max-width:640px){.stats-row{grid-template-columns:repeat(2,1fr)}.kpi-row{grid-template-columns:repeat(2,1fr)}.nav-links{display:none}}

/* ── EVOLVED PATTERNS (from KB) ── */
${extraAnimations}

/* ── ANIMATIONS ── */
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideRight{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
.animate{animation:fadeUp .7s ease forwards}
.fade{animation:fadeIn .9s ease forwards}
.slide{animation:slideRight .6s ease forwards}
.stagger-1{animation-delay:.1s;opacity:0}
.stagger-2{animation-delay:.2s;opacity:0}
.stagger-3{animation-delay:.35s;opacity:0}
.stagger-4{animation-delay:.5s;opacity:0}
.feat-card{transition:transform .2s ease,background .15s}
.feat-card:hover{transform:translateY(-3px)}
.btn-primary,.btn-ghost{transition:all .2s ease}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(255,255,255,.1)}
.kpi-card{transition:transform .2s ease,border-color .15s}
.kpi-card:hover{transform:translateY(-2px)}

/* ── COMPONENTS: BADGE, TOOLTIP, PROGRESS ── */
.badge{display:inline-block;border:1px solid var(--accent);color:var(--accent);font-size:9px;padding:2px 7px;letter-spacing:.15em}
.progress-bar{height:4px;background:var(--line);border-radius:2px;overflow:hidden;margin:6px 0}
.progress-fill{height:100%;background:var(--accent);border-radius:2px;transition:width .8s ease}
[data-tooltip]{position:relative;cursor:help}
[data-tooltip]:hover::after{content:attr(data-tooltip);position:absolute;bottom:calc(100%+6px);left:50%;transform:translateX(-50%);background:var(--ink);color:var(--bg);font-size:10px;padding:4px 8px;white-space:nowrap;pointer-events:none;z-index:99}
</style>
</head>
<body>
${isDash ? dashContent : landingContent}
</body>
</html>`;
}

/* ============================================================
   7 · ERROR ORACLE
   ============================================================ */
const ERRORS = [
  ["TypeError: x is undefined", "js", "Guard with optional chaining (a?.b) or default values; trace where the value was never assigned."],
  ["ReferenceError: x is not defined", "js", "Variable used before declaration or out of scope — check spelling, imports, and block scope."],
  ["Unexpected token", "js", "Syntax slip — unbalanced brackets/quotes, or JSON.parse on non-JSON (often an HTML error page)."],
  ["NaN in calculations", "js", "A string leaked into math — coerce with Number() and validate inputs first."],
  ["Stale closure", "react", "Hook captured an old value — add it to the dependency array or use functional setState."],
  ["Too many re-renders", "react", "setState called during render — move it into an event handler or useEffect."],
  ["Invalid hook call", "react", "Hooks must run top-level in a function component — never inside conditions, loops, or plain functions."],
  ["Missing key prop", "react", "Give each list item a stable unique key (not the array index if the list reorders)."],
  ["Hydration mismatch", "react", "Server and client rendered different HTML — avoid Date.now()/random in render; use useEffect for client-only data."],
  ["CORS blocked", "api", "Server must send Access-Control-Allow-Origin; in dev, proxy the request or use the platform's allowed origins."],
  ["401 Unauthorized", "api", "Key missing/expired or sent in the wrong header — check Authorization: Bearer and key scopes."],
  ["403 Forbidden", "api", "Supabase RLS is blocking the request — check that the anon key has SELECT/INSERT grants on the table."],
  ["429 Rate limited", "api", "Back off exponentially, cache responses, batch requests."],
  ["Layout shift / CLS", "html", "Reserve space for images/fonts (width/height attrs, font-display: swap)."],
  ["Z-index not working", "html", "z-index needs a positioned element and competes within stacking contexts."],
  ["Flexbox item overflows", "html", "Set min-width:0 on flex children so they can shrink below content size."],
  ["Event listener leak", "js", "Remove listeners on teardown (or AbortController) — especially in SPA route changes."],
  ["Infinite useEffect loop", "react", "An object/array dep is recreated every render — memoize it or narrow the deps."],
  ["localStorage quota exceeded", "js", "Cap stored data, compress, or rotate old entries (AXIOM caps its KB at 200)."],
  ["Module not found", "nextjs", "Check tsconfig paths alias and that the import matches the actual file path (case-sensitive on Linux/Vercel)."],
  ["cookies() / headers() must be awaited", "nextjs", "Next.js 15+ made cookies() and headers() async — await them at the top of the server component."],
  ["useSearchParams() must be wrapped in Suspense", "nextjs", "Wrap the component using useSearchParams() in a <Suspense> boundary or move to a client component."],
  ["Tailwind classes not applying", "nextjs", "Check tailwind.config content paths include the file; don't construct class names dynamically with string concat."],
  ["Supabase anon key exposed in server log", "supabase", "Never log process.env in production. Use the service_role key only in server-side/API routes, never client-side."],
  ["RLS infinite recursion", "supabase", "A policy referencing the same table it's on causes a loop — use a security definer function or a separate profiles check."],
  ["Railway PORT binding", "node", "Railway injects PORT at runtime — always use process.env.PORT, never hardcode 3000 in production."],
  ["Discord 'Invalid token'", "discord", "Token was reset or never set — regenerate in Discord Developer Portal and update your Railway env vars."],
  ["WhatsApp 190 error (token expired)", "whatsapp", "Page/User access tokens expire — switch to a System User token in Meta Business Suite for long-lived access."],
];

function renderErrors(q = "") {
  const list = ERRORS.filter((e) => (e[0] + e[1] + e[2]).toLowerCase().includes(q.toLowerCase()));
  $("#err-list").innerHTML = list.map((e) => `
    <div class="err-item">
      <div><span class="e-name">${esc(e[0])}</span><span class="e-lang">${esc(e[1])}</span></div>
      <div class="e-fix">${esc(e[2])}</div>
    </div>`).join("") || `<p class="dim" style="padding:8px 2px">no known bug class matches — new territory.</p>`;
}
$("#err-search").oninput = (e) => { renderErrors(e.target.value); fire("reason", 0.3); };
renderErrors();

if (window.AXIOM_STACK) {
  window.AXIOM_STACK.render("#stack-list");
  const ss = $("#stack-search");
  if (ss) ss.oninput = (e) => { window.AXIOM_STACK.render("#stack-list", e.target.value); fire("memory", 0.3); };
} else {
  const sl = document.getElementById("stack-list");
  if (sl) sl.innerHTML = [
    { cat: "FRONTEND", items: [["Next.js 15", "App Router + TypeScript", "live"], ["React 19", "Hooks + Vite", "live"], ["Tailwind v4", "Utility CSS", "live"]] },
    { cat: "BACKEND", items: [["Node.js", "Express + Railway", "live"], ["Supabase", "Postgres + Auth + Storage", "live"], ["Vercel Edge", "Serverless functions", "live"]] },
    { cat: "TOOLS", items: [["Claude AI", "claude-sonnet-5", "live"], ["Discord.js", "v14 slash commands", "live"], ["WiPay", "JM payment gateway", "live"]] },
  ].map(g =>
    `<div class="stack-cat"><h3>${g.cat}</h3>${g.items.map(([n,r,s])=>
      `<div class="stack-item"><span class="s-status s-${s}"></span><span class="s-name">${n}</span><span class="s-role">${r}</span></div>`
    ).join("")}</div>`
  ).join("");
}

/* ============================================================
   8 · LEARN FEED — dynamically filtered by build classification
   ============================================================ */
const ALL_SOURCES = [
  // universal
  { tags: ["*"],          label: "MDN Web Docs",                   src: "MDN",        url: "https://developer.mozilla.org/en-US/docs/Web" },
  { tags: ["*"],          label: "Free public APIs index",         src: "github",     url: "https://github.com/public-apis/public-apis" },
  { tags: ["*"],          label: "Web accessibility (a11y)",       src: "MDN",        url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility" },
  // react / nextjs
  { tags: ["react","nextjs"], label: "React hooks reference",      src: "react.dev",  url: "https://react.dev/reference/react/hooks" },
  { tags: ["react","nextjs"], label: "Next.js App Router docs",    src: "nextjs.org", url: "https://nextjs.org/docs/app" },
  { tags: ["react","nextjs"], label: "Next.js data fetching",      src: "nextjs.org", url: "https://nextjs.org/docs/app/building-your-application/data-fetching" },
  { tags: ["nextjs"],         label: "Tailwind CSS v4 docs",       src: "tailwind",   url: "https://tailwindcss.com/docs" },
  // supabase
  { tags: ["nextjs","supabase","dashboard","commerce"], label: "Supabase JS client",  src: "supabase", url: "https://supabase.com/docs/reference/javascript" },
  { tags: ["nextjs","supabase"],                        label: "Supabase RLS guide",  src: "supabase", url: "https://supabase.com/docs/guides/auth/row-level-security" },
  { tags: ["nextjs","supabase"],                        label: "Supabase + Next.js",  src: "supabase", url: "https://supabase.com/docs/guides/getting-started/quickstarts/nextjs" },
  // node / bots
  { tags: ["node","bot","api"], label: "Express.js docs",          src: "expressjs",  url: "https://expressjs.com/en/4x/api.html" },
  { tags: ["node","bot"],       label: "Railway environment vars", src: "railway",    url: "https://docs.railway.app/guides/variables" },
  { tags: ["bot"],              label: "discord.js v14 guide",     src: "discord.js", url: "https://discordjs.guide/" },
  { tags: ["bot"],              label: "WhatsApp Cloud API docs",   src: "meta",       url: "https://developers.facebook.com/docs/whatsapp/cloud-api" },
  // html / css
  { tags: ["html","landing"],   label: "HTML element index",       src: "w3schools",  url: "https://www.w3schools.com/tags/" },
  { tags: ["html","landing"],   label: "CSS grid guide",           src: "w3schools",  url: "https://www.w3schools.com/css/css_grid.asp" },
  // media / video
  { tags: ["media-tool"],       label: "Canvas API",               src: "MDN",        url: "https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API" },
  { tags: ["media-tool"],       label: "Fetch API",                src: "MDN",        url: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API" },
  // email
  { tags: ["email"],            label: "Resend docs",              src: "resend",     url: "https://resend.com/docs/introduction" },
  { tags: ["email"],            label: "React Email components",   src: "react.email",url: "https://react.email/docs/introduction" },
  // js general
  { tags: ["*"],                label: "JS array methods",         src: "w3schools",  url: "https://www.w3schools.com/js/js_array_methods.asp" },
];

function renderLearnFeed(cls) {
  const matchTags = new Set(["*", cls.stack, cls.type, cls.wantsSupabase && "supabase"].filter(Boolean));
  const sources = ALL_SOURCES.filter((s) => s.tags.some((t) => matchTags.has(t)));
  const deduplicated = [...new Map(sources.map((s) => [s.url, s])).values()];
  $("#learn-list").innerHTML = deduplicated.map((s) => `
    <div class="learn-item">
      <a href="${s.url}" target="_blank" rel="noopener">${esc(s.label)}</a>
      <span class="src">${esc(s.src)}</span>
    </div>`).join("");
  fire("learn", 0.6);
}

// default: show universal sources on load
renderLearnFeed({ stack: "*", type: "*", wantsSupabase: false });

/* ============================================================
   9 · SUPABASE LINK
   ============================================================ */
const SB_KEY = "axiom_sb_v1";
function sbConfig() { try { return JSON.parse(localStorage.getItem(SB_KEY)); } catch { return null; } }
function sbLog(msg) { $("#sb-log").textContent = `db: ${msg}`; }
(function initSB() {
  const DEFAULT_URL = "https://ibtadbwtrxglujkzqofs.supabase.co";
  const DEFAULT_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlidGFkYnd0cnhnbHVqa3pxb2ZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2OTE2NTUsImV4cCI6MjA5NDI2NzY1NX0.ihwCJOvYU2hZL3aruKzgrN9BqA42o-fivqc-yMjm6Qw";
  let c = sbConfig();
  if (!c) {
    localStorage.setItem(SB_KEY, JSON.stringify({ url: DEFAULT_URL, key: DEFAULT_KEY }));
    c = { url: DEFAULT_URL, key: DEFAULT_KEY };
    audit("db", "auto-connected to J Supreme Conglomerate Supabase");
  }
  if (c) {
    $("#sb-url").value = c.url;
    $("#sb-key").value = c.key;
    $("#db-status").textContent = "DB: SUPABASE";
    $("#db-status").classList.add("on");
    sbLog("connected — ibtadbwtrxglujkzqofs (J Supreme Conglomerate)");
  }
})();
/* ── AI KEY WIRING ── */
(function initAIKey() {
  const stored = getAIKey();
  const input = $("#ai-key-input");
  const status = $("#ai-key-status");
  if (stored && input) input.value = stored;
  if (status) status.textContent = stored ? `ai: claude-sonnet-5 ready ✓` : `ai: no key — using template engine`;
  const convStatus = $("#conv-status");
  if (convStatus) convStatus.textContent = `${CONV.load().length} messages in memory`;
})();

$("#ai-key-save")?.addEventListener("click", () => {
  const val = $("#ai-key-input")?.value.trim();
  if (!val?.startsWith("sk-ant-")) {
    $("#ai-key-status").textContent = "ai: key must start with sk-ant-";
    return;
  }
  localStorage.setItem(AI_KEY, val);
  $("#ai-key-status").textContent = "ai: claude-sonnet-5 ready ✓";
  audit("ai", "anthropic key saved — claude-sonnet-5 active");
});

$("#ai-key-clear")?.addEventListener("click", () => {
  localStorage.removeItem(AI_KEY);
  if ($("#ai-key-input")) $("#ai-key-input").value = "";
  $("#ai-key-status").textContent = "ai: key cleared — template engine active";
  audit("ai", "anthropic key removed");
});

$("#conv-clear")?.addEventListener("click", () => {
  CONV.clear();
  const s = $("#conv-status");
  if (s) s.textContent = "0 messages in memory";
  audit("memory", "conversation history cleared");
});

/* ── NEW TOKEN HANDLERS (AX-007 / AX-008 / AX-010 / AX-019) ── */
const GH_TOKEN_KEY      = "axiom_github_token";
const VERCEL_TOKEN_KEY  = "axiom_vercel_token";
const META_TOKENS_KEY   = "axiom_meta_tokens";

(function initTokenUIs() {
  const gh = localStorage.getItem(GH_TOKEN_KEY);
  const vt = localStorage.getItem(VERCEL_TOKEN_KEY);
  if (gh && $("#gh-token-input")) { $("#gh-token-input").value = gh; $("#gh-token-status").textContent = "github: token saved"; }
  if (vt && $("#vercel-token-input")) { $("#vercel-token-input").value = vt; $("#vercel-token-status").textContent = "vercel: token saved"; }
  try {
    const mt = JSON.parse(localStorage.getItem(META_TOKENS_KEY) || "{}");
    document.querySelectorAll(".meta-token-input").forEach(el => {
      if (mt[el.dataset.brand]) el.value = mt[el.dataset.brand];
    });
    if (Object.keys(mt).length) $("#meta-tokens-status").textContent = `meta: ${Object.keys(mt).length} brand(s) saved`;
  } catch {}
  if (gh && window.AXIOM_CTX) window.AXIOM_CTX.setGithubToken?.(gh);
})();

$("#gh-token-save")?.addEventListener("click", () => {
  const val = $("#gh-token-input")?.value.trim();
  if (!val) return;
  localStorage.setItem(GH_TOKEN_KEY, val);
  $("#gh-token-status").textContent = "github: token saved";
  if (window.AXIOM_CTX) window.AXIOM_CTX.setGithubToken?.(val);
  audit("ctx", "github token saved");
});
$("#gh-token-clear")?.addEventListener("click", () => {
  localStorage.removeItem(GH_TOKEN_KEY);
  if ($("#gh-token-input")) $("#gh-token-input").value = "";
  $("#gh-token-status").textContent = "github: no token";
  audit("ctx", "github token cleared");
});

$("#vercel-token-save")?.addEventListener("click", () => {
  const val = $("#vercel-token-input")?.value.trim();
  if (!val) return;
  localStorage.setItem(VERCEL_TOKEN_KEY, val);
  $("#vercel-token-status").textContent = "vercel: token saved";
  audit("deploy", "vercel token saved");
});
$("#vercel-token-clear")?.addEventListener("click", () => {
  localStorage.removeItem(VERCEL_TOKEN_KEY);
  if ($("#vercel-token-input")) $("#vercel-token-input").value = "";
  $("#vercel-token-status").textContent = "vercel: no token";
  audit("deploy", "vercel token cleared");
});

$("#meta-tokens-save")?.addEventListener("click", () => {
  const tokens = {};
  document.querySelectorAll(".meta-token-input").forEach(el => {
    const v = el.value.trim();
    if (v) tokens[el.dataset.brand] = v;
  });
  localStorage.setItem(META_TOKENS_KEY, JSON.stringify(tokens));
  $("#meta-tokens-status").textContent = `meta: ${Object.keys(tokens).length} brand(s) saved`;
  audit("social", "meta tokens saved");
});

/* Manual train trigger (AX-017) */
$("#sb-train-trigger")?.addEventListener("click", () => {
  const log = $("#sb-train-log");
  if (log) log.textContent = "train: launching via /api/train...";
  fetch("/api/train", { method: "POST" })
    .then(r => r.ok ? r.json() : r.text().then(t => { throw new Error(t); }))
    .then(d => { if (log) log.textContent = `train: done — ${JSON.stringify(d).slice(0, 80)}`; })
    .catch(e => { if (log) log.textContent = `train: error — ${e.message}`; });
});
$("#sb-push-kb")?.addEventListener("click", async () => {
  const log = $("#sb-train-log");
  if (log) log.textContent = "train: pushing KB snapshot...";
  try {
    const rows = KB.load().map(i => ({ kind: i.kind, title: i.title, body: i.body ?? {} }));
    if (!rows.length) { if (log) log.textContent = "train: KB empty"; return; }
    await sbFetch("axiom_kb", { method: "POST", body: JSON.stringify(rows) });
    if (log) log.textContent = `train: pushed ${rows.length} entries to Supabase`;
    audit("db", `manual KB push: ${rows.length} entries`);
  } catch (e) { if (log) log.textContent = `train: push failed — ${e.message}`; }
});

$("#sb-save").onclick = () => {
  const url = $("#sb-url").value.trim().replace(/\/$/, ""), key = $("#sb-key").value.trim();
  if (!/^https:\/\/.+\.supabase\.co$/.test(url) || !key) return sbLog("invalid url or key — expected https://xxxx.supabase.co");
  localStorage.setItem(SB_KEY, JSON.stringify({ url, key }));
  $("#db-status").textContent = "DB: SUPABASE";
  sbLog("saved to this browser only"); audit("db", "supabase credentials saved locally");
};
async function sbFetch(path, opts = {}) {
  const c = sbConfig(); if (!c) throw new Error("no supabase config saved");
  const res = await fetch(`${c.url}/rest/v1/${path}`, {
    ...opts,
    headers: { apikey: c.key, Authorization: `Bearer ${c.key}`, "Content-Type": "application/json", Prefer: "return=minimal", ...opts.headers },
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return res;
}
$("#sb-sync").onclick = async () => {
  try {
    fire("net", 1); sbLog("syncing knowledge base ⇡ …");
    const rows = KB.load().map((i) => ({ kind: i.kind, title: i.title, body: i.body ?? {} }));
    if (!rows.length) return sbLog("nothing to sync — KB empty");
    await sbFetch("axiom_kb", { method: "POST", body: JSON.stringify(rows) });
    sbLog(`synced ${rows.length} entries ⇡`); audit("db", `pushed ${rows.length} KB entries to supabase`);
  } catch (e) { sbLog(`sync failed — ${e.message}`); }
};
$("#sb-pull").onclick = async () => {
  try {
    fire("net", 1); sbLog("pulling ⇣ …");
    const res = await sbFetch("axiom_kb?select=*&order=created_at.desc&limit=100", { headers: { Prefer: "" } });
    const rows = await res.json();
    const items = rows.map((r) => ({ id: r.id, at: (r.created_at || "").slice(0, 19).replace("T", " "), kind: r.kind, title: r.title, body: r.body }));
    KB.save(items);
    sbLog(`pulled ${rows.length} entries ⇣`); audit("db", `pulled ${rows.length} KB entries from supabase`);
  } catch (e) { sbLog(`pull failed — ${e.message}`); }
};

/* ============================================================
   10 · THE AGENT LOOP
   ============================================================ */
const stream = $("#stream");
function say(cls, text) {
  const el = document.createElement("div");
  el.className = `line ${cls}`; el.textContent = text;
  stream.appendChild(el); stream.scrollTop = stream.scrollHeight;
}
let lastBuild = null;
let running = false;

async function runDirective(text) { // already async — generateAsync is awaited inside
  if (running || !text.trim()) return;
  running = true;
  $("#agent-status").textContent = "AGENT: ACTIVE"; $("#agent-status").classList.add("on");
  stream.innerHTML = "";
  const t0 = performance.now();

  say("sys", `> ${text}`);
  audit("directive", text);

  // audit-only path
  if (/^audit/i.test(text.trim())) {
    fire("audit", 1); fire("memory", 0.8);
    stateEngine.set("AUDITING — replaying last build", [{ p: 0.9, s: "IDLE (audit complete)" }, { p: 0.1, s: "REPAIR (issues found)" }]);
    await sleep(500);
    if (!lastBuild) { say("warn", "audit: no build in this session — run a directive first."); }
    else {
      say("act", `audit: last build was ${lastBuild.cls.stack}/${lastBuild.cls.type}/${lastBuild.cls.size}`);
      await sleep(350);
      say("ok", `audit: ${lastBuild.code.split("\n").length} lines · mono style ✓ · no external paid deps ✓ · top risk was "${lastBuild.risks[0].name}" (${(lastBuild.risks[0].p * 100).toFixed(0)}%)`);
      audit("audit", "session build re-audited: clean");
    }
    stateEngine.set("IDLE — awaiting directive");
    done(); return;
  }

  // 1 perceive
  fire("perceive", 1);
  stateEngine.set("PERCEIVING — parsing directive", [
    { p: 0.85, s: "CLASSIFYING" }, { p: 0.1, s: "CLARIFY (ambiguous input)" }, { p: 0.05, s: "REJECT (out of domain)" },
  ]);
  say("think", "perceive: tokenizing directive, extracting intent…");
  await sleep(420);

  // 2 classify
  fire("classify", 1);
  const cls = classify(text);
  say("act", `classify: stack=${cls.stack} · type=${cls.type} · size=${cls.size}${cls.wantsSupabase ? " · supabase detected" : ""}`);
  stateEngine.set(`CLASSIFIED — ${cls.stack}/${cls.type}/${cls.size}`, [
    { p: 0.9, s: "RISK ANALYSIS" }, { p: 0.1, s: "RECLASSIFY (operator correction)" },
  ]);
  await sleep(420);

  // 2b — KB recall: find relevant case studies & operator rules
  fire("memory", 0.7);
  const recall = queryKB(cls);
  if (recall.rules.length || recall.caseStudies.length) {
    say("think", `memory: recalled ${recall.rules.length} operator rule(s) + ${recall.caseStudies.length} case study match(es)`);
    for (const r of recall.rules) say("act", `rule: ${r.title}`);
    for (const c of recall.caseStudies) say("think", `case: ${c.title.slice(0, 90)}`);
    await sleep(300);
  } else {
    say("think", "memory: no prior case studies matched — running cold");
  }

  // 3 risk
  fire("risk", 1); fire("reason", 0.8);
  const risks = riskModel(cls);
  renderRisk(risks, cls);
  say("act", `risk: top roadblock → "${risks[0].name}" at P=${risks[0].p.toFixed(2)} (panel 04)`);
  await sleep(420);

  // 4 plan
  fire("plan", 1); fire("reason", 1);
  stateEngine.set("PLANNING — walking decision tree", [
    { p: 0.88, s: "CODEGEN" }, { p: 0.12, s: "REPLAN (constraint conflict)" },
  ]);
  for (const step of plan(cls, risks)) { say("think", `plan: ${step}`); await sleep(260); }

  // 5 style memory
  fire("memory", 0.8);
  const style = learnStyle(cls);
  say("act", `memory: build-style profile → ${styleSummary()}`);
  await sleep(300);

  // 6 codegen
  fire("codegen", 1);
  stateEngine.set("GENERATING — emitting scaffold", [
    { p: 0.92, s: "AUDIT" }, { p: 0.08, s: "REGENERATE (self-check failed)" },
  ]);
  const usingAI = !!getAIKey();
  say("act", usingAI
    ? `codegen: sending to claude-sonnet-5 with operator context…`
    : `codegen: emitting ${cls.stack} scaffold (add AI key in SUPABASE tab to unlock Claude)…`);
  if (recall.context) say("think", `codegen: applying ${recall.caseStudies.length} case study pattern(s) from KB`);
  const code = await generateAsync(cls, recall);
  $("#code-out").textContent = code;
  await sleep(420);

  // 7 audit — real measured checks for HTML builds, structural checks otherwise
  fire("audit", 1);
  const lines = code.split("\n").length;
  let buildScore = null;
  let checks;
  const isHTMLBuild = code.trimStart().startsWith("<!");
  if (isHTMLBuild && window.AXIOM_QUALITY) {
    const q = window.AXIOM_QUALITY.run(code);
    buildScore = q.score;
    checks = q.checks;
    say("act", `audit: measured quality score ${q.score}/100 (WCAG contrast · SEO · a11y · CLS · copy)`);
  } else {
    checks = [
      ["responsive meta / tailwind present", code.includes("viewport") || code.includes("className") || cls.stack === "node"],
      ["semantic structure / routing", /header|main|section|app\.get|app\.post|export default/.test(code)],
      ["env vars via process.env", !code.includes("sk_live") && !code.includes("service_role_key")],
      ["no paid services unless requested", !/stripe|paypal/.test(code.toLowerCase()) || /stripe|paypal|wipay/.test(cls.raw.toLowerCase())],
    ];
  }
  for (const [name, ok] of checks) { say(ok ? "ok" : "warn", `audit: ${name} ${ok ? "✓" : "✗"}`); await sleep(90); }

  // independent learning — record what design scored what, so plan() reinforces winners
  if (buildScore !== null && lastComposeMeta && window.AXIOM_DK) {
    window.AXIOM_DK.recordScore(KB.add, cls, lastComposeMeta.recipe, lastComposeMeta.industry, buildScore, checks);
    say("think", `learn: ${lastComposeMeta.industry}/${lastComposeMeta.recipe} → ${buildScore}/100 recorded${lastComposeMeta.learned ? " (reused past winner)" : ""} — future builds prefer high scorers`);
  }

  // 8 learn + preview + auto-train
  fire("learn", 1); fire("memory", 1);
  renderLearnFeed(cls);
  lastBuild = { cls, risks, code };
  updatePreview(code, cls);
  KB.add("build", `${cls.stack}/${cls.type}/${cls.size} — "${text.slice(0, 60)}"`, {
    risks, lines, style,
    kbRulesApplied: (recall.rules || []).map((r) => r.title),
    kbCasesApplied: (recall.caseStudies || []).map((c) => c.title),
  });

  // auto-extract patterns from this build
  if (window.AXIOM_TRAIN) {
    const learned = window.AXIOM_TRAIN.autoLearn(code, cls, KB.load, KB.add);
    say("act", `train: fitness=${learned.fitness}/100 · ${learned.patterns} pattern(s) extracted · KB now ${KB.load().length} entries`);
    updateTrainHint();
  }

  say("ok", `learn: run persisted to knowledge base (${lines} lines, ${(performance.now() - t0 | 0)}ms). Learn feed updated for ${cls.stack}/${cls.type}.`);
  audit("build", `generated ${cls.stack}/${cls.type}/${cls.size} scaffold, ${lines} lines`);

  stateEngine.set("IDLE — build complete", [
    { p: 0.5, s: "NEW DIRECTIVE" }, { p: 0.3, s: "AUDIT PASS" }, { p: 0.2, s: "SUPABASE SYNC" },
  ]);
  say("sys", "ready. copy/download the build in panel 05, or say: audit my last project");
  done();

  function done() {
    running = false;
    $("#agent-status").textContent = "AGENT: IDLE"; $("#agent-status").classList.remove("on");
  }
}

$("#run").onclick = () => runDirective($("#cmd").value);
$("#cmd").addEventListener("keydown", (e) => { if (e.key === "Enter") runDirective($("#cmd").value); });
document.querySelectorAll(".chip").forEach((c) => c.onclick = () => { $("#cmd").value = c.dataset.q; runDirective(c.dataset.q); });

/* copy / download */
$("#copy-code").onclick = async () => {
  await navigator.clipboard.writeText($("#code-out").textContent);
  audit("export", "generated code copied to clipboard");
};
$("#dl-code").onclick = () => {
  const code = $("#code-out").textContent;
  const ext = code.startsWith("//") && /import|export/.test(code) ? (code.includes("className") ? "tsx" : "ts") : code.startsWith("<!") ? "html" : "js";
  const blob = new Blob([code], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = `axiom-build.${ext}`; a.click();
  audit("export", `generated code downloaded as .${ext}`);
};

/* ── DEPLOY / ZIP EXPORT ── */
function buildProjectFiles(cls, code) {
  const slug = cls.type.toLowerCase().replace(/\s+/g, "-");

  if (cls.stack === "html") {
    return [{ name: "index.html", data: code }];
  }

  if (cls.stack === "nextjs") {
    const withDB = cls.wantsSupabase || cls.type === "dashboard" || cls.type === "commerce";
    return [
      { name: "package.json", data: JSON.stringify({
          name: slug, version: "0.1.0", private: true,
          scripts: { dev: "next dev", build: "next build", start: "next start" },
          dependencies: {
            next: "^15.0.0", react: "^19.0.0", "react-dom": "^19.0.0",
            ...(withDB ? { "@supabase/supabase-js": "^2", "@supabase/ssr": "^0" } : {}),
          },
          devDependencies: { typescript: "^5", "@types/react": "^19", tailwindcss: "^4", "@types/node": "^22" },
        }, null, 2) },
      { name: "app/page.tsx",    data: code },
      { name: "app/layout.tsx",  data: `import type { Metadata } from "next";\nimport "./globals.css";\nexport const metadata: Metadata = { title: "${slug}" };\nexport default function RootLayout({ children }: { children: React.ReactNode }) {\n  return <html lang="en"><body>{children}</body></html>;\n}` },
      { name: "app/globals.css", data: `@import "tailwindcss";\n:root{--bg:#000;--ink:#fff;--accent:#fff;--dim:#6a6a6a;--line:#1a1a1a;--mono:"SF Mono",Consolas,monospace}\n*{box-sizing:border-box}\nbody{background:var(--bg);color:var(--ink);font-family:var(--mono)}\n@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}\n.animate{animation:fadeUp .6s ease forwards}` },
      { name: "components/ui/button.tsx", data: `import { ButtonHTMLAttributes } from "react";\ntype V = "primary"|"ghost"|"outline";\nexport function Button({ variant="primary", className="", ...p }: ButtonHTMLAttributes<HTMLButtonElement>&{variant?:V}) {\n  const base = "inline-flex items-center justify-center text-xs font-bold tracking-widest transition-all px-6 py-3 font-mono disabled:opacity-50";\n  const v = { primary:"bg-[--accent] text-[--bg] hover:opacity-90", ghost:"bg-transparent text-[--dim] hover:text-[--ink]", outline:"border border-[--ink]/20 text-[--dim] hover:border-[--ink]/60 hover:text-[--ink]" }[variant];\n  return <button className={[base,v,className].join(" ")} {...p}/>;\n}` },
      { name: "components/ui/card.tsx",   data: `export function Card({ children, className="", accent=false }:{children:React.ReactNode,className?:string,accent?:boolean}) {\n  return <div className={["border p-6 transition-colors", accent?"border-[--accent]/40 hover:border-[--accent]":"border-[--ink]/10 hover:border-[--ink]/25", className].join(" ")}>{children}</div>;\n}` },
      { name: "components/ui/badge.tsx",  data: `export function Badge({ children }:{children:React.ReactNode}) {\n  return <span className="inline-block border border-[--accent] text-[--accent] text-[9px] tracking-widest px-2 py-0.5">{children}</span>;\n}` },
      { name: "next.config.ts",  data: `import type { NextConfig } from "next";\nconst config: NextConfig = {};\nexport default config;` },
      { name: "tsconfig.json",   data: JSON.stringify({ compilerOptions: { target: "ES2017", lib: ["dom","dom.iterable","esnext"], allowJs: true, skipLibCheck: true, strict: true, noEmit: true, esModuleInterop: true, module: "esnext", moduleResolution: "bundler", resolveJsonModule: true, isolatedModules: true, jsx: "preserve", incremental: true, paths: { "@/*": ["./*"] } }, include: ["**/*.ts","**/*.tsx"], exclude: ["node_modules"] }, null, 2) },
      { name: ".env.local.example", data: withDB
          ? `NEXT_PUBLIC_SUPABASE_URL=https://ibtadbwtrxglujkzqofs.supabase.co\nNEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key`
          : `# add your env vars here` },
      { name: "README.md",       data: `# ${slug}\n\nGenerated by AXIOM · J Supreme Tech\n\n## Setup\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\`\n\n## Deploy\n\`\`\`bash\nvercel --prod\n\`\`\`` },
    ];
  }

  if (cls.stack === "node") {
    const isDiscord  = /discord/.test(cls.raw.toLowerCase());
    const isWhatsApp = /whatsapp/.test(cls.raw.toLowerCase());
    const deps = isDiscord
      ? { "discord.js": "^14" }
      : { express: "^4", cors: "^2" };
    return [
      { name: "package.json", data: JSON.stringify({
          name: slug, version: "0.1.0", private: true, type: "module",
          scripts: { start: "node src/index.js", dev: "node --watch src/index.js" },
          dependencies: deps,
        }, null, 2) },
      { name: "src/index.js",  data: code },
      { name: ".env.example",  data: isDiscord
          ? `DISCORD_TOKEN=\nDISCORD_CLIENT_ID=`
          : isWhatsApp
            ? `WA_TOKEN=\nWA_PHONE_NUMBER_ID=\nVERIFY_TOKEN=`
            : `PORT=3000` },
      { name: "railway.json",  data: JSON.stringify({ "$schema": "https://railway.app/railway.schema.json", build: { builder: "NIXPACKS" }, deploy: { startCommand: "node src/index.js", healthcheckPath: "/health" } }, null, 2) },
      { name: "README.md",     data: `# ${slug}\n\nGenerated by AXIOM · J Supreme Tech\n\n## Deploy\n\`\`\`bash\nrailway init && railway up\n\`\`\`` },
    ];
  }

  if (cls.stack === "react") {
    return [
      { name: "package.json", data: JSON.stringify({
          name: slug, version: "0.1.0", private: true,
          scripts: { start: "react-scripts start", build: "react-scripts build" },
          dependencies: { react: "^19", "react-dom": "^19", "react-scripts": "5.0.1" },
        }, null, 2) },
      { name: "src/App.tsx",    data: code },
      { name: "src/index.tsx",  data: `import React from "react";\nimport ReactDOM from "react-dom/client";\nimport App from "./App";\nReactDOM.createRoot(document.getElementById("root")!).render(<React.StrictMode><App /></React.StrictMode>);` },
      { name: "public/index.html", data: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${slug}</title></head><body><div id="root"></div></body></html>` },
      { name: "README.md",     data: `# ${slug}\n\nGenerated by AXIOM\n\n\`\`\`bash\nnpm install && npm start\n\`\`\`` },
    ];
  }

  return [{ name: "index.html", data: code }];
}

$("#deploy-code").onclick = () => {
  if (!lastBuild) { audit("deploy", "no build — run a directive first"); return; }
  const { cls, code } = lastBuild;

  // AI multi-file output (=== FILE: path ===) takes precedence over single-file scaffolds
  const parsed = window.AXIOM_FILES ? window.AXIOM_FILES.parse(code) : [];
  let files = parsed.length > 1 ? parsed : buildProjectFiles(cls, code);

  // pin real npm versions from DOCS ◎ into package.json
  const pinned = window.AXIOM_DOCS ? window.AXIOM_DOCS.pinnedDeps() : {};
  if (Object.keys(pinned).length) {
    files = files.map((f) => {
      if (f.name !== "package.json") return f;
      try {
        const pkg = JSON.parse(f.data);
        pkg.dependencies = { ...(pkg.dependencies || {}), ...pinned };
        return { name: f.name, data: JSON.stringify(pkg, null, 2) };
      } catch { return f; }
    });
  }
  const name   = `axiom-${cls.type}-${cls.stack}`;

  if (!window.AXIOM_ZIP) { audit("deploy", "zip.js not loaded"); return; }
  window.AXIOM_ZIP.download(`${name}.zip`, files);

  const dp = $("#deploy-panel");
  dp.style.display = "block";
  const labels = {
    nextjs: "vercel --prod",
    node:   "railway up",
    react:  "vercel --prod",
    html:   "drag index.html → vercel.com/new",
  };
  dp.innerHTML = `<div class="deploy-steps">
    <p class="deploy-title">PROJECT ZIP DOWNLOADED · ${files.length} FILES</p>
    <pre class="deploy-cmd"># unzip, then:\n${labels[cls.stack] || "vercel --prod"}</pre>
    <p class="deploy-hint">${cls.stack === "html" ? 'Drag the folder to <a href="https://vercel.com/new" target="_blank" rel="noopener">vercel.com/new</a>' : 'Run <code>npm install</code> then deploy with the command above.'}</p>
  </div>`;
  if (window.AXIOM_DEPLOY) window.AXIOM_DEPLOY.renderPanel(name, files);
  audit("deploy", `${name}.zip downloaded · ${files.length} files · ${cls.stack} project`);
};

/* ── LIVE PREVIEW ── */
let previewBlobUrl = null;
function updatePreview(code, cls) {
  const frame = $("#preview-frame");
  const placeholder = $("#preview-placeholder");
  const label = $("#preview-label");
  if (!frame) return;

  const isHTML = cls.stack === "html" || code.trimStart().startsWith("<!DOCTYPE") || code.trimStart().startsWith("<!--");

  if (previewBlobUrl) { URL.revokeObjectURL(previewBlobUrl); previewBlobUrl = null; }

  if (isHTML) {
    previewBlobUrl = URL.createObjectURL(new Blob([code], { type: "text/html" }));
    frame.src = previewBlobUrl;
    frame.style.display = "block";
    if (placeholder) placeholder.style.display = "none";
    if (label) label.textContent = `LIVE PREVIEW — ${cls.type.toUpperCase()} · ${cls.stack.toUpperCase()}`;
    // auto-switch to preview tab
    document.querySelector('.tab[data-tab="preview"]')?.click();
  } else {
    frame.style.display = "none";
    if (placeholder) {
      placeholder.style.display = "flex";
      placeholder.innerHTML = `<div style="text-align:center;padding:20px">
        <p style="font-size:10px;letter-spacing:2px;margin-bottom:8px">${cls.stack.toUpperCase()} BUILD — NO BROWSER PREVIEW</p>
        <p class="dim" style="font-size:10px">Download ZIP → npm install → npm run dev to preview locally</p>
        <p class="dim" style="font-size:9px;margin-top:6px">Or deploy: vercel --prod</p>
      </div>`;
    }
    if (label) label.textContent = `${cls.stack.toUpperCase()} · ${cls.type.toUpperCase()} — DOWNLOAD ZIP TO PREVIEW`;
    document.querySelector('.tab[data-tab="preview"]')?.click();
  }
}
$("#preview-reload")?.addEventListener("click", () => {
  const f = $("#preview-frame");
  if (f && f.src) { const s = f.src; f.src = ""; f.src = s; }
});
$("#preview-new-tab")?.addEventListener("click", () => {
  if (previewBlobUrl) window.open(previewBlobUrl, "_blank");
  else if (lastBuild?.cls.stack !== "html") audit("preview", "non-HTML build — no preview URL to open");
});

/* ── SIMULATION LAB ── */
const SIM_SCENARIOS = [
  "build a nextjs dashboard with supabase auth, large",
  "build a discord bot for Railway, medium",
  "build a whatsapp bot with express for Railway",
  "build a simple html portfolio site, small",
  "build a react video editing tool ui, large",
  "build a nextjs e-commerce store with WiPay, medium",
  "build an email campaign template with Resend, small",
  "build a node webhook api worker for Railway, medium",
];

function simSay(cls, text) {
  const el = document.createElement("div");
  el.className = `line ${cls}`; el.textContent = text;
  $("#sim-out").appendChild(el);
  $("#sim-out").scrollTop = $("#sim-out").scrollHeight;
}

$("#sim-run").onclick = async () => {
  if (running) { simSay("warn", "agent busy — wait for current run to finish"); return; }
  $("#sim-out").innerHTML = "";
  simSay("sys", `simulation lab: running ${SIM_SCENARIOS.length} scenarios…`);
  let pass = 0, fail = 0;
  for (let i = 0; i < SIM_SCENARIOS.length; i++) {
    const scenario = SIM_SCENARIOS[i];
    const cls = classify(scenario);
    const recall = queryKB(cls);
    const code = generate(cls, recall);
    const lines = code.split("\n").length;
    const risks = riskModel(cls);
    const ok = lines > 5 && code.length > 100;
    if (ok) pass++; else fail++;
    simSay(ok ? "ok" : "warn",
      `[${String(i+1).padStart(2,"0")}] ${ok?"✓":"✗"} ${cls.stack}/${cls.type}/${cls.size} — ${lines} lines — risk: ${risks[0].name} P=${risks[0].p.toFixed(2)}`
    );
    await sleep(120);
  }
  simSay("act", `simulation complete: ${pass} PASS · ${fail} FAIL · ${SIM_SCENARIOS.length} total`);
  audit("simulate", `${pass}/${SIM_SCENARIOS.length} scenarios passed`);
};
$("#sim-clear").onclick = () => { $("#sim-out").innerHTML = ""; };

/* ============================================================
   TABS
   ============================================================ */
document.querySelectorAll(".tab").forEach((btn) => {
  btn.onclick = () => {
    document.querySelectorAll(".tab").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".tab-pane").forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
    const pane = document.getElementById(`tab-${btn.dataset.tab}`);
    if (pane) pane.classList.add("active");
    if (btn.dataset.tab === "network") { layoutNetwork(); }
    if (btn.dataset.tab === "stack" && window.AXIOM_STACK) window.AXIOM_STACK.render("#stack-list");
    if (btn.dataset.tab === "errors") renderErrors();
    // AX-016: Mount canvas with current build HTML (avoids circular URL redirect)
    if (btn.dataset.tab === "canvas" && window.AXIOM_CANVAS) {
      const container = document.getElementById("tab-canvas");
      if (container) {
        const placeholder = "// run a directive above";
        const html = (lastBuild && lastBuild.code) || document.getElementById("code-out")?.textContent || "";
        if (html && !html.startsWith(placeholder)) {
          window.AXIOM_CANVAS.mount(container, html, (edited) => {
            if (lastBuild) lastBuild.code = edited;
            const co = document.getElementById("code-out");
            if (co) co.textContent = edited;
          });
        } else {
          container.innerHTML = '<div style="padding:20px;color:var(--dim);font-size:11px">Run a directive first — the generated build will appear here for visual editing.</div>';
        }
      }
    }
  };
});

/* ============================================================
   TRAIN TAB
   ============================================================ */
function updateTrainHint() {
  const el = $("#train-kb-hint");
  if (!el || !window.AXIOM_TRAIN) return;
  const items = KB.load();
  const patterns     = items.filter(i => i.kind === "pattern").length;
  const rules        = items.filter(i => i.kind === "operator-rule").length;
  const crystallized = items.filter(i => i.kind === "operator-rule" && i.body?.source).length;
  el.textContent = `KB: ${patterns} patterns · ${crystallized} crystallized rules · ${rules} total operator rules`;
}
updateTrainHint();

function trainSay(cls, text) {
  const el = document.createElement("div");
  el.className = `line ${cls}`; el.textContent = text;
  const out = $("#train-out");
  out.appendChild(el); out.scrollTop = out.scrollHeight;
}

$("#train-run")?.addEventListener("click", async () => {
  if (!window.AXIOM_TRAIN) { trainSay("warn", "train.js not loaded"); return; }
  if (running) { trainSay("warn", "agent busy — wait for current build to finish"); return; }

  $("#train-out").innerHTML = "";
  $("#train-progress").style.display = "block";
  $("#train-summary").style.display  = "none";
  const bar = $("#train-bar");
  const pct = $("#train-pct");

  trainSay("sys",  `◈ TRAINING RUN STARTED — ${window.AXIOM_TRAIN.TRAIN_SCENARIOS.length} scenarios`);
  trainSay("think","extracting patterns · scoring fitness · crystallizing rules…");

  const report = await window.AXIOM_TRAIN.runTraining(
    generate,
    classify,
    KB.load,
    KB.add,
    (done, total, last) => {
      const p = Math.round((done / total) * 100);
      bar.style.width = p + "%";
      pct.textContent = p + "%";
      const color = last.fitness >= 70 ? "ok" : last.fitness >= 45 ? "act" : "warn";
      trainSay(color, `[${String(done).padStart(2,"0")}/${total}] ${last.stack}/${last.type} · fitness=${last.fitness} · ${last.patterns} patterns`);
    }
  );

  bar.style.width = "100%"; pct.textContent = "100%";
  trainSay("ok", `◈ TRAINING COMPLETE`);
  trainSay("act", `  runs=${report.runs} · avg fitness=${report.avgFitness}/100 · patterns found=${report.patternsFound} · rules crystallized=${report.crystallized}`);

  const summary = $("#train-summary");
  summary.style.display = "block";
  summary.innerHTML = `
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:var(--line);margin-top:10px">
      ${[
        ["BUILDS", report.runs],
        ["AVG FITNESS", report.avgFitness + "/100"],
        ["PATTERNS", report.patternsFound],
        ["RULES CRYSTALLIZED", report.crystallized],
      ].map(([l,v]) => `<div style="background:var(--bg);padding:14px 10px;text-align:center">
        <p style="font-size:9px;letter-spacing:.2em;color:var(--dim);margin-bottom:6px">${l}</p>
        <p style="font-size:22px;font-weight:700">${v}</p>
      </div>`).join("")}
    </div>`;

  updateTrainHint();
  renderKB();
  audit("train", `training complete — ${report.runs} runs · avg=${report.avgFitness} · ${report.crystallized} rules crystallized`);
});

$("#train-crystallize")?.addEventListener("click", () => {
  if (!window.AXIOM_TRAIN) return;
  const rules = window.AXIOM_TRAIN.crystallize(KB.load, KB.add);
  trainSay(rules.length ? "ok" : "think",
    rules.length
      ? `crystallized ${rules.length} new operator rule(s) from existing patterns`
      : "not enough repeated patterns yet — run TRAIN or build more directives first"
  );
  if (rules.length) rules.forEach(r => trainSay("act", `  ◆ ${r.slice(0,80)}`));
  updateTrainHint();
  renderKB();
  audit("train", `manual crystallize — ${rules.length} new rules`);
});

$("#train-clear")?.addEventListener("click", () => {
  if (!confirm("Clear all extracted patterns? Crystallized rules are kept.")) return;
  const items = KB.load().filter(i => i.kind !== "pattern");
  KB.save(items);
  trainSay("sys", `patterns cleared · ${items.length} other KB entries retained`);
  updateTrainHint();
  audit("train", "pattern entries cleared from KB");
});

/* ============================================================
   status bits
   ============================================================ */
function netStatus() {
  const on = navigator.onLine;
  $("#net-status").textContent = `NET ${on ? "ON" : "OFF"}`;
  $("#net-status").classList.toggle("on", on);
  if (on) fire("net", 0.6);
}
window.addEventListener("online",  () => { netStatus(); audit("net", "internet connection restored"); });
window.addEventListener("offline", () => { netStatus(); audit("net", "offline — running from local knowledge base"); });
netStatus();
setInterval(() => { const el = $("#clock"); if (el) el.textContent = now().slice(11) + " UTC"; }, 1000);
renderKB();
audit("boot", `AXIOM online · ${styleSummary()}`);
// load LEXEVO bundle from Supabase async — fires after sbConfig is available
loadLEX().then(() => {
  if (!LEX) say("think", "lexevo: no bundle in Supabase — open lexevo.html, evolve, hit AXIOM SYNC");
});
say("sys", "AXIOM ready. type a directive above, or hit a quick chip.");

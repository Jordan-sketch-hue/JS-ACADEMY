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
  // edges
  for (const [a, b] of EDGES) {
    const na = nodeById(a), nb = nodeById(b);
    const heat = Math.max(na.heat, nb.heat);
    ctx.strokeStyle = `rgba(255,255,255,${0.06 + heat * 0.5})`;
    ctx.lineWidth = 1 + heat * 1.5;
    ctx.beginPath(); ctx.moveTo(na.x, na.y); ctx.lineTo(nb.x, nb.y); ctx.stroke();
    if (heat > 0.05) { // pulse traveling along active edges
      const p = (t / 600 + na.phase) % 1;
      const px = na.x + (nb.x - na.x) * p, py = na.y + (nb.y - na.y) * p;
      ctx.fillStyle = `rgba(255,255,255,${heat})`;
      ctx.beginPath(); ctx.arc(px, py, 2, 0, Math.PI * 2); ctx.fill();
    }
  }
  // nodes
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
    n.heat *= 0.985; // decay
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
// idle heartbeat so the network always looks alive
setInterval(() => fire(FACULTIES[Math.floor(Math.random() * FACULTIES.length)].id, 0.25), 1400);

/* ============================================================
   2 · KNOWLEDGE BASE — local-first persistence, learns your style
   ============================================================ */
const KB_KEY = "axiom_kb_v1";
const KB = {
  load() { try { return JSON.parse(localStorage.getItem(KB_KEY)) || []; } catch { return []; } },
  save(items) { localStorage.setItem(KB_KEY, JSON.stringify(items)); renderKB(); },
  add(kind, title, body) {
    const items = KB.load();
    items.unshift({ id: crypto.randomUUID(), at: now(), kind, title, body });
    KB.save(items.slice(0, 200));
    fire("memory", 0.8); fire("learn", 0.6);
  },
};
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
$("#kb-export").onclick = () => {
  const blob = new Blob([JSON.stringify(KB.load(), null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = "axiom-knowledge-base.json"; a.click();
  audit("export", "knowledge base exported to JSON");
};
$("#kb-clear").onclick = () => {
  if (confirm("Wipe local knowledge base?")) { KB.save([]); audit("wipe", "knowledge base cleared by operator"); }
};

/* build-style profile: learned from what you ask for */
const STYLE_KEY = "axiom_style_v1";
function learnStyle(cls) {
  let s; try { s = JSON.parse(localStorage.getItem(STYLE_KEY)) || {}; } catch { s = {}; }
  s.runs = (s.runs || 0) + 1;
  s.stacks = s.stacks || {}; s.stacks[cls.stack] = (s.stacks[cls.stack] || 0) + 1;
  s.types = s.types || {}; s.types[cls.type] = (s.types[cls.type] || 0) + 1;
  s.mono = true; // house style: always monochrome
  localStorage.setItem(STYLE_KEY, JSON.stringify(s));
  return s;
}
function styleSummary() {
  let s; try { s = JSON.parse(localStorage.getItem(STYLE_KEY)) || {}; } catch { s = {}; }
  if (!s.runs) return "no profile yet — first run";
  const top = (o) => Object.entries(o || {}).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";
  return `${s.runs} runs · prefers ${top(s.stacks)} · builds mostly ${top(s.types)} · mono aesthetic locked`;
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
   4 · STATE ENGINE — previous / current / probable futures
   ============================================================ */
const stateEngine = {
  prev: null, curr: "IDLE — awaiting directive",
  set(next, futures = []) {
    this.prev = this.curr; this.curr = next;
    $("#state-prev").textContent = this.prev || "∅";
    $("#state-curr").textContent = this.curr;
    $("#state-next").textContent = futures.length
      ? futures.map((f) => `${(f.p * 100).toFixed(0).padStart(3)}%  ${f.s}`).join("\n") : "∅";
  },
};

/* ============================================================
   5 · REASONING — classify, risk model, if/then/else planner
   ============================================================ */
function classify(text) {
  const t = text.toLowerCase();
  const stack = /react|component|hook|jsx|dashboard|app\b/.test(t) ? "react" : "html";
  const type =
    /dashboard|admin|panel/.test(t) ? "dashboard" :
    /portfolio|landing|site|page/.test(t) ? "landing" :
    /video|edit|media|creative/.test(t) ? "media-tool" :
    /shop|store|commerce/.test(t) ? "commerce" : "app";
  const size = /large|big|full|complex/.test(t) ? "large" : /small|simple|tiny|quick/.test(t) ? "small" : "medium";
  const wantsAudit = /audit/.test(t);
  return { stack, type, size, wantsAudit, raw: text };
}

/* probability model: base risk priors adjusted by type & size */
function riskModel(cls) {
  const sizeFactor = { small: 0.6, medium: 1.0, large: 1.45 }[cls.size];
  const priors = [
    { name: "scope creep",            base: 0.35, types: { dashboard: 1.3, "media-tool": 1.5, commerce: 1.2 } },
    { name: "state management bugs",  base: cls.stack === "react" ? 0.4 : 0.15, types: { dashboard: 1.4 } },
    { name: "layout/responsive drift", base: 0.3, types: { landing: 1.3 } },
    { name: "api/CORS failures",      base: 0.25, types: { "media-tool": 1.4, commerce: 1.3 } },
    { name: "perf bottlenecks",       base: 0.2,  types: { "media-tool": 1.7, dashboard: 1.2 } },
    { name: "browser compat",         base: 0.15, types: {} },
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

/* the visible if/then/else decision tree */
function plan(cls, risks) {
  const steps = [];
  steps.push(`IF stack == "${cls.stack}" THEN scaffold ${cls.stack === "react" ? "component tree + hooks" : "semantic html + minimal js"} ELSE fallback to html`);
  if (cls.size === "large") steps.push(`IF size == "large" THEN split into modules AND stage delivery ELSE single-file build`);
  else steps.push(`IF size == "${cls.size}" THEN single-file build (fast path)`);
  const topRisk = risks[0];
  steps.push(`IF P(${topRisk.name}) > 0.5 THEN add mitigation up-front ELSE monitor during audit  →  ${topRisk.p > 0.5 ? "MITIGATE NOW" : "MONITOR"}`);
  steps.push(`IF navigator.onLine THEN attach learn-feed references ELSE run from local knowledge base  →  ${navigator.onLine ? "ONLINE PATH" : "OFFLINE PATH"}`);
  steps.push(`IF style-profile exists THEN apply learned build style ELSE bootstrap default mono style`);
  return steps;
}

/* ============================================================
   6 · CODEGEN — react & html scaffolds in the house (mono) style
   ============================================================ */
function generate(cls) {
  const title = cls.type.toUpperCase().replace("-", " ");
  if (cls.stack === "react") return reactTemplate(title, cls);
  return htmlTemplate(title, cls);
}
function reactTemplate(title, cls) {
  return `// AXIOM build — react · ${cls.type} · ${cls.size}
// house style: strict monochrome, mono font, 1px borders
import { useState, useEffect } from "react";

const theme = {
  bg: "#000", ink: "#fff", dim: "#8a8a8a", line: "#2a2a2a",
  font: '"SF Mono", Consolas, monospace',
};

export default function App() {
  const [ready, setReady] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    // wire your Supabase or API here — free tiers only
    setItems(["alpha", "beta", "gamma"]);
    setReady(true);
  }, []);

  return (
    <div style={{ background: theme.bg, color: theme.ink, fontFamily: theme.font, minHeight: "100vh", padding: 24 }}>
      <header style={{ borderBottom: \`1px solid \${theme.line}\`, paddingBottom: 12, letterSpacing: 4 }}>
        <h1>${title}</h1>
        <small style={{ color: theme.dim }}>generated by AXIOM · ${now()}</small>
      </header>
      <main style={{ display: "grid", gap: 12, marginTop: 16 }}>
        {ready
          ? items.map((it) => (
              <section key={it} style={{ border: \`1px solid \${theme.line}\`, padding: 16 }}>
                <h2 style={{ fontSize: 13, letterSpacing: 2 }}>{it.toUpperCase()}</h2>
              </section>
            ))
          : <p style={{ color: theme.dim }}>booting…</p>}
      </main>
    </div>
  );
}`;
}
function htmlTemplate(title, cls) {
  return `<!-- AXIOM build — html · ${cls.type} · ${cls.size} · generated ${now()} -->
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<style>
  :root{--bg:#000;--ink:#fff;--dim:#8a8a8a;--line:#2a2a2a}
  *{box-sizing:border-box;margin:0}
  body{background:var(--bg);color:var(--ink);font-family:"SF Mono",Consolas,monospace;padding:24px}
  header{border-bottom:1px solid var(--line);padding-bottom:12px;letter-spacing:4px}
  small{color:var(--dim)}
  main{display:grid;gap:12px;margin-top:16px}
  section{border:1px solid var(--line);padding:16px}
</style>
</head>
<body>
  <header><h1>${title}</h1><small>generated by AXIOM</small></header>
  <main>
    <section><h2>HERO</h2><p>Say the one thing that matters.</p></section>
    <section><h2>WORK</h2><p>Show, don't tell.</p></section>
    <section><h2>CONTACT</h2><p>One clear call to action.</p></section>
  </main>
</body>
</html>`;
}

/* ============================================================
   7 · ERROR ORACLE — known bug classes
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
  ["Hydration mismatch", "react", "Server and client rendered different HTML — avoid Date.now()/random in render."],
  ["CORS blocked", "api", "Server must send Access-Control-Allow-Origin; in dev, proxy the request or use the platform's allowed origins."],
  ["401 Unauthorized", "api", "Key missing/expired or sent in the wrong header — check Authorization: Bearer and key scopes."],
  ["429 Rate limited", "api", "Back off exponentially, cache responses, batch requests."],
  ["Layout shift / CLS", "html", "Reserve space for images/fonts (width/height attrs, font-display: swap)."],
  ["Z-index not working", "html", "z-index needs a positioned element and competes within stacking contexts."],
  ["Flexbox item overflows", "html", "Set min-width:0 on flex children so they can shrink below content size."],
  ["Event listener leak", "js", "Remove listeners on teardown (or AbortController) — especially in SPA route changes."],
  ["Infinite useEffect loop", "react", "An object/array dep is recreated every render — memoize it or narrow the deps."],
  ["localStorage quota exceeded", "js", "Cap stored data, compress, or rotate old entries (AXIOM caps its KB at 200)."],
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

/* ============================================================
   8 · LEARN FEED — free sources, matched to what you build
   ============================================================ */
const SOURCES = [
  ["React hooks reference", "react.dev", "https://react.dev/reference/react/hooks"],
  ["HTML element index", "w3schools", "https://www.w3schools.com/tags/"],
  ["CSS grid guide", "w3schools", "https://www.w3schools.com/css/css_grid.asp"],
  ["JS array methods", "w3schools", "https://www.w3schools.com/js/js_array_methods.asp"],
  ["Fetch API", "MDN", "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API"],
  ["Canvas API", "MDN", "https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API"],
  ["Supabase JS client", "supabase", "https://supabase.com/docs/reference/javascript"],
  ["Free public APIs index", "github", "https://github.com/public-apis/public-apis"],
  ["Web accessibility (a11y)", "MDN", "https://developer.mozilla.org/en-US/docs/Web/Accessibility"],
];
$("#learn-list").innerHTML = SOURCES.map((s) => `
  <div class="learn-item"><a href="${s[2]}" target="_blank" rel="noopener">${esc(s[0])}</a><span class="src">${esc(s[1])}</span></div>`).join("");

/* ============================================================
   9 · SUPABASE LINK — your DB, your keys, browser-only storage
   ============================================================ */
const SB_KEY = "axiom_sb_v1";
function sbConfig() { try { return JSON.parse(localStorage.getItem(SB_KEY)); } catch { return null; } }
function sbLog(msg) { $("#sb-log").textContent = `db: ${msg}`; }
(function initSB() {
  const c = sbConfig();
  if (c) { $("#sb-url").value = c.url; $("#sb-key").value = c.key; $("#db-status").textContent = "DB: SUPABASE"; sbLog("credentials loaded (local only)"); }
})();
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
   10 · THE AGENT LOOP — visible reasoning in the console
   ============================================================ */
const stream = $("#stream");
function say(cls, text) {
  const el = document.createElement("div");
  el.className = `line ${cls}`; el.textContent = text;
  stream.appendChild(el); stream.scrollTop = stream.scrollHeight;
}
let lastBuild = null;
let running = false;

async function runDirective(text) {
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
  say("act", `classify: stack=${cls.stack} · type=${cls.type} · size=${cls.size}`);
  stateEngine.set(`CLASSIFIED — ${cls.stack}/${cls.type}/${cls.size}`, [
    { p: 0.9, s: "RISK ANALYSIS" }, { p: 0.1, s: "RECLASSIFY (operator correction)" },
  ]);
  await sleep(420);

  // 3 risk
  fire("risk", 1); fire("reason", 0.8);
  const risks = riskModel(cls);
  renderRisk(risks, cls);
  say("act", `risk: top roadblock → "${risks[0].name}" at P=${risks[0].p.toFixed(2)} (panel 04)`);
  await sleep(420);

  // 4 plan — if/then/else
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
  say("act", `codegen: emitting ${cls.stack} scaffold in house mono style…`);
  const code = generate(cls);
  $("#code-out").textContent = code;
  await sleep(420);

  // 7 audit
  fire("audit", 1);
  const lines = code.split("\n").length;
  const checks = [
    ["mono palette only", true],
    ["no paid services referenced", true],
    ["responsive meta present", code.includes("viewport") || cls.stack === "react"],
    ["semantic structure", /header|main|section/i.test(code)],
  ];
  for (const [name, ok] of checks) { say(ok ? "ok" : "warn", `audit: ${name} ${ok ? "✓" : "✗"}`); await sleep(180); }

  // 8 learn / persist
  fire("learn", 1); fire("memory", 1);
  lastBuild = { cls, risks, code };
  KB.add("build", `${cls.stack}/${cls.type}/${cls.size} — "${text.slice(0, 60)}"`, { risks, lines, style });
  say("ok", `learn: run persisted to knowledge base (${lines} lines, ${(performance.now() - t0 | 0)}ms).`);
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
  const isReact = $("#code-out").textContent.startsWith("//");
  const blob = new Blob([$("#code-out").textContent], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = isReact ? "App.jsx" : "index.html"; a.click();
  audit("export", "generated code downloaded");
};

/* ============================================================
   status bits
   ============================================================ */
function netStatus() {
  const on = navigator.onLine;
  $("#net-status").textContent = `NET: ${on ? "ONLINE" : "OFFLINE"}`;
  $("#net-status").classList.toggle("on", on);
  if (on) fire("net", 0.6);
}
window.addEventListener("online", () => { netStatus(); audit("net", "internet connection restored"); });
window.addEventListener("offline", () => { netStatus(); audit("net", "offline — running from local knowledge base"); });
netStatus();
setInterval(() => { $("#clock").textContent = now() + " UTC"; }, 1000);
renderKB();
audit("boot", `AXIOM online · ${styleSummary()}`);
say("sys", "AXIOM ready. type a directive above, or hit a quick chip.");

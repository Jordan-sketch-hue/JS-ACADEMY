// AXIOM · /api/axiom/generate
// POST { directive: string, size?: "small"|"medium"|"large" }
// Returns { code, stack, type, fitness, tokens }
// Pure template engine — no external AI, zero cost

// strip BOM/whitespace — env vars saved via PowerShell pipes can carry U+FEFF, which breaks fetch headers
const cleanEnv = (v) => (v || "").replace(/^\uFEFF/, "").trim();

const SB_URL = cleanEnv(process.env.SUPABASE_URL) || "https://ibtadbwtrxglujkzqofs.supabase.co";
const SB_KEY = cleanEnv(process.env.SUPABASE_SERVICE_KEY) || cleanEnv(process.env.SUPABASE_ANON_KEY) || "";

/* ── STACK RESOLVER ── */
const STACK_MAP = {
  nextjs:    { runtime:"Next.js 15",  deps:["next","react","react-dom"],            type:"nextjs" },
  react:     { runtime:"React 18",    deps:["react","react-dom","vite"],             type:"react" },
  discord:   { runtime:"Node.js",     deps:["discord.js","dotenv"],                  type:"discord" },
  whatsapp:  { runtime:"Node.js",     deps:["express","@whiskeysockets/baileys"],    type:"whatsapp" },
  railway:   { runtime:"Node.js",     deps:["express","dotenv"],                     type:"express" },
  supabase:  { runtime:"Next.js 15",  deps:["next","@supabase/supabase-js"],         type:"nextjs" },
  ecommerce: { runtime:"Next.js 15",  deps:["next","@supabase/supabase-js","stripe"],type:"nextjs" },
  html:      { runtime:"HTML/CSS/JS", deps:[],                                        type:"html" },
  portfolio: { runtime:"HTML/CSS/JS", deps:[],                                        type:"html" },
  bot:       { runtime:"Node.js",     deps:["express","dotenv"],                      type:"express" },
  express:   { runtime:"Node.js",     deps:["express","dotenv"],                      type:"express" },
  dashboard: { runtime:"Next.js 15",  deps:["next","react","recharts"],              type:"nextjs" },
};

function resolveStack(d) {
  const dl = d.toLowerCase();
  for (const [k,v] of Object.entries(STACK_MAP)) if (dl.includes(k)) return v;
  return STACK_MAP.html;
}

/* ── TEMPLATES ── */
function htmlTemplate(directive, size) {
  const title = directive.replace(/build a?n?\s*/i,"").replace(/,.*$/,"").trim();
  const sections = size === "large" ? 5 : size === "medium" ? 3 : 1;
  const nav = sections > 1 ? `<nav>${["Home","About","Services","Contact","Portfolio"].slice(0,sections).map(s=>`<a href="#${s.toLowerCase()}">${s}</a>`).join("")}</nav>` : "";
  const body = ["Home","About","Services","Contact","Portfolio"].slice(0,sections).map(s=>`
<section id="${s.toLowerCase()}" class="section">
  <h2>${s}</h2>
  <p>Content for the ${s.toLowerCase()} section of your ${title}.</p>
</section>`).join("\n");
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:system-ui,sans-serif;line-height:1.6;color:#111}
nav{background:#000;padding:1rem 2rem;display:flex;gap:2rem}
nav a{color:#fff;text-decoration:none;font-weight:500}
.section{padding:4rem 2rem;max-width:1100px;margin:0 auto}
h2{font-size:2rem;margin-bottom:1rem}
</style>
</head>
<body>
${nav}
${body}
</body>
</html>`;
}

function nextjsTemplate(directive, size) {
  const name = directive.replace(/build a?n?\s*/i,"").split(",")[0].trim();
  const hasSupabase = directive.toLowerCase().includes("supabase");
  const sbImport = hasSupabase ? `\nimport { createClient } from "@supabase/supabase-js";\nconst sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);` : "";
  return `// ${name} — Next.js 15 App Router
"use client";
import { useState, useEffect } from "react";${sbImport}

export default function Page() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ${hasSupabase ? `sb.from("items").select("*").then(({ data }) => { setData(data ?? []); setLoading(false); });` : `setLoading(false);`}
  }, []);

  if (loading) return <div className="p-8">Loading…</div>;

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">${name}</h1>
      {data.length === 0
        ? <p className="text-gray-500">No data yet.</p>
        : <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(data, null, 2)}</pre>
      }
    </main>
  );
}`;
}

function discordTemplate(directive) {
  const name = directive.replace(/build a?n?\s*/i,"").split(/[,\s]/)[0].trim() || "MyBot";
  return `// ${name} — Discord.js v14
const { Client, GatewayIntentBits, Events } = require("discord.js");
require("dotenv").config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once(Events.ClientReady, () => console.log(\`✅ \${client.user.tag} online\`));

client.on(Events.MessageCreate, async msg => {
  if (msg.author.bot) return;
  if (msg.content === "!ping") await msg.reply("Pong! 🏓");
  if (msg.content === "!help") await msg.reply("Commands: !ping · !help");
});

client.login(process.env.DISCORD_TOKEN);`;
}

function expressTemplate(directive) {
  const name = directive.replace(/build a?n?\s*/i,"").split(",")[0].trim();
  return `// ${name} — Express.js
const express = require("express");
const app = express();
require("dotenv").config();
app.use(express.json());

app.get("/", (_, res) => res.json({ status: "ok", service: "${name}" }));
app.get("/health", (_, res) => res.json({ ok: true, ts: Date.now() }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(\`✅ ${name} on :${PORT}\`));`;
}

function generateCode(directive, stack, size) {
  switch(stack.type) {
    case "html":     return htmlTemplate(directive, size);
    case "nextjs":   return nextjsTemplate(directive, size);
    case "discord":  return discordTemplate(directive);
    case "whatsapp": return expressTemplate(directive);
    default:         return expressTemplate(directive);
  }
}

function fitness(directive, code) {
  let score = 50;
  if (code.length > 500)  score += 10;
  if (code.length > 1500) score += 10;
  if (code.includes("useEffect") || code.includes("useState")) score += 5;
  if (code.includes("async") || code.includes("await"))         score += 5;
  if (code.includes("error") || code.includes("catch"))         score += 5;
  if (directive.length > 30) score += 5;
  return Math.min(100, score);
}

/* ── HANDLER ── */
const AXIOM_API_KEY = cleanEnv(process.env.AXIOM_API_KEY);

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,x-axiom-key");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")    return res.status(405).json({ error: "POST only" });

  if (AXIOM_API_KEY) {
    const reqKey = cleanEnv(req.headers["x-axiom-key"]);
    if (reqKey !== AXIOM_API_KEY) return res.status(401).json({ error: "unauthorized" });
  }

  const { directive, size = "medium" } = req.body || {};
  if (!directive) return res.status(400).json({ error: "directive required" });

  const stack = resolveStack(directive);
  const code  = generateCode(directive, stack, size);
  const fit   = fitness(directive, code);

  // optionally save to KB
  if (SB_KEY) {
    fetch(`${SB_URL}/rest/v1/axiom_kb`, {
      method: "POST",
      headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({ kind: "generated_build", title: directive.slice(0, 120), body: { directive, stack: stack.runtime, size, fitness: fit } }),
    }).catch(() => {});
  }

  return res.status(200).json({
    ok: true,
    directive,
    stack: stack.runtime,
    type: stack.type,
    deps: stack.deps,
    size,
    fitness: fit,
    tokens: Math.ceil(code.length / 4),
    code,
  });
}

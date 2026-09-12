// AXIOM · /api/axiom/share
// POST { title, html }  → { id, url }   (stores build in axiom_kb kind=shared_build)
// GET  ?id=uuid         → renders the shared build as a live HTML page

// strip BOM/whitespace — env vars saved via PowerShell pipes can carry U+FEFF, which breaks fetch headers
const cleanEnv = (v) => (v || "").replace(/^\uFEFF/, "").trim();

const SB_URL = cleanEnv(process.env.SUPABASE_URL) || "https://ibtadbwtrxglujkzqofs.supabase.co";
const SB_KEY = cleanEnv(process.env.SUPABASE_SERVICE_KEY) || cleanEnv(process.env.SUPABASE_ANON_KEY);

async function sb(path, method = "GET", body = null, prefer = "return=representation") {
  return fetch(`${SB_URL}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: SB_KEY,
      Authorization: `Bearer ${SB_KEY}`,
      "Content-Type": "application/json",
      Prefer: prefer,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

export default async function handler(req, res) {
  if (!SB_KEY) return res.status(503).json({ error: "storage not configured" });
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "GET") {
    const id = req.query.id;
    if (!id || !/^[0-9a-f-]{36}$/i.test(id)) return res.status(400).send("invalid id");
    const r = await sb(`axiom_kb?id=eq.${id}&kind=eq.shared_build&select=title,body`);
    const rows = await r.json();
    const row = rows?.[0];
    if (!row?.body?.html) return res.status(404).send("shared build not found");
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=300, s-maxage=3600");
    return res.status(200).send(row.body.html);
  }

  if (req.method === "POST") {
    const { title, html } = req.body || {};
    if (!html) return res.status(400).json({ error: "html required" });
    const r = await sb("axiom_kb", "POST", {
      kind: "shared_build",
      title: String(title || "shared build").slice(0, 120),
      body: { html: String(html).slice(0, 500_000) },
    });
    const rows = await r.json();
    const id = rows?.[0]?.id;
    if (!id) return res.status(500).json({ error: "insert failed" });
    return res.status(201).json({ id, url: `/api/axiom/share?id=${id}` });
  }

  return res.status(405).json({ error: "method not allowed" });
}

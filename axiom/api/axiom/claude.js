// AXIOM · /api/axiom/claude
// Server-side Claude proxy — keeps ANTHROPIC_API_KEY out of the browser
// POST { system, prompt, model?, max_tokens? } → { text } | { error }

const cleanEnv = (v) => (v || "").replace(/^\uFEFF/, "").trim();

const ANTHROPIC_KEY = cleanEnv(process.env.ANTHROPIC_API_KEY);
const AXIOM_KEY     = cleanEnv(process.env.AXIOM_API_KEY);

const ALLOWED_MODELS = new Set([
  "claude-sonnet-5",
  "claude-haiku-4-5-20251001",
  "claude-opus-5",
]);

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,x-axiom-key");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")    return res.status(405).json({ error: "POST only" });

  // optional per-route key gate
  if (AXIOM_KEY) {
    const reqKey = cleanEnv(req.headers["x-axiom-key"]);
    if (reqKey !== AXIOM_KEY) return res.status(401).json({ error: "unauthorized" });
  }

  if (!ANTHROPIC_KEY) return res.status(503).json({ error: "AI not configured" });

  const { system = "", prompt, model = "claude-sonnet-5", max_tokens = 8000 } = req.body || {};
  if (!prompt) return res.status(400).json({ error: "prompt required" });

  const safeModel     = ALLOWED_MODELS.has(model) ? model : "claude-sonnet-5";
  const safeMaxTokens = Math.min(Math.max(Number(max_tokens) || 8000, 1), 16000);

  try {
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key":          ANTHROPIC_KEY,
        "anthropic-version":  "2023-06-01",
        "content-type":       "application/json",
      },
      body: JSON.stringify({
        model:      safeModel,
        max_tokens: safeMaxTokens,
        system,
        messages:   [{ role: "user", content: prompt }],
      }),
    });

    if (!upstream.ok) {
      const err = await upstream.text();
      return res.status(upstream.status).json({ error: `upstream ${upstream.status}`, detail: err });
    }

    const data = await upstream.json();
    const text = data.content?.[0]?.text || "";
    return res.status(200).json({ ok: true, text, model: safeModel });
  } catch (e) {
    return res.status(500).json({ error: "proxy error", detail: e.message });
  }
}

# AXIOM — JS Supreme Coding Agent · Project Outline

A monochrome (pure black & white) web app that acts as your own intelligent coding agent console. Local-first, no paid services — only your Supabase and free public sources.

## Vision
An agent that reasons, audits, remembers, and builds — it knows your build style, tracks previous/current/future state, models roadblock probability by project type & size, and persists everything it learns.

## Architecture (all client-side, zero dependencies)

| # | Module | What it does |
|---|--------|--------------|
| 01 | **Node Network** | Canvas graph of 10 agent faculties (PERCEIVE → CLASSIFY → REASON → RISK → PLAN → CODEGEN → AUDIT → MEMORY → LEARN → NET). Edges pulse with real activity as the agent works. |
| 02 | **Agent Console** | Type a directive ("build a react dashboard, large") — the agent streams its visible reasoning step by step. |
| 03 | **State Engine** | Previous state, current state, and probability-ranked possible future states. |
| 04 | **Risk & Roadblocks** | Probability model: base priors × size factor × project-type multipliers → ranked likely roadblocks. |
| 05 | **Codegen** | Emits React or HTML scaffolds in the house monochrome style. Copy or download instantly. |
| 06 | **Knowledge Base** | Every run persisted to localStorage (capped at 200). Learns your build-style profile (preferred stack, project types) across sessions. Export to JSON. |
| 07 | **Error Oracle** | Searchable catalog of known bug classes across JS / React / HTML / APIs with fixes. |
| 08 | **Learn Feed** | Free sources only: W3Schools, MDN, react.dev, Supabase docs, public-APIs index. |
| 09 | **Supabase Link** | Bring your own project URL + anon key (stored in your browser only). Sync/pull the knowledge base to your `axiom_kb` table via REST. |
| 10 | **Audit Trail** | Every decision timestamped and inspectable. |

## Reasoning pipeline
```
directive → PERCEIVE (parse intent)
          → CLASSIFY (stack / type / size)
          → RISK (probability dynamics)
          → PLAN (explicit if/then/else decision tree)
          → CODEGEN (mono-style scaffold)
          → AUDIT (self-checks)
          → LEARN (persist + update style profile)
```

## Supabase setup (optional)
```sql
create table axiom_kb (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  kind text, title text, body jsonb
);
```

## Roadmap
- v1.0 (this build): full console, network, reasoning, KB, Supabase sync
- v1.1: hook a free LLM endpoint of your choice into CODEGEN for real generation
- v1.2: project templates for video/creative tooling; multi-file build export
- v1.3: PC interaction via a small local companion (File System Access API)

## Run
Static site — open `index.html` or deploy the `agent/` folder anywhere (Vercel, Netlify, GitHub Pages).

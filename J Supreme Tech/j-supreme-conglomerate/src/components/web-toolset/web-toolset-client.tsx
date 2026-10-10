"use client";

import { useState } from "react";
import {
  TOOLSET_RESOURCES,
  DESIGN_TRENDS,
  INTEGRATION_MAP_NODES,
  type ToolsetResource,
  type DesignTrend,
  type IntegrationNode,
} from "@/lib/data/toolset-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Box,
  ExternalLink,
  Globe2,
  Layers,
  LayoutTemplate,
  Map,
  Palette,
  Share2,
  Sparkles,
  Smartphone,
  Wrench,
  Zap,
} from "lucide-react";

// ── Resource Card ──────────────────────────────────────────────────────────
function ResourceCard({ r }: { r: ToolsetResource }) {
  const typeColor: Record<ToolsetResource["type"], string> = {
    tool: "border-sky-500/30 bg-sky-500/[0.06]",
    article: "border-violet-500/30 bg-violet-500/[0.06]",
    reference: "border-amber-500/30 bg-amber-500/[0.06]",
    inspiration: "border-emerald-500/30 bg-emerald-500/[0.06]",
  };
  const typeLabel: Record<ToolsetResource["type"], string> = {
    tool: "Tool",
    article: "Article",
    reference: "Reference",
    inspiration: "Inspiration",
  };

  return (
    <a
      href={r.url}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "group flex flex-col gap-2 rounded-xl border p-4 text-sm transition-all hover:shadow-md",
        typeColor[r.type],
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
          {r.title}
        </span>
        <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-40 transition-opacity group-hover:opacity-100" />
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">{r.description}</p>
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge variant="outline" className="h-4 px-1.5 text-[10px]">
          {typeLabel[r.type]}
        </Badge>
        {r.tags.slice(0, 3).map((t) => (
          <Badge key={t} variant="secondary" className="h-4 px-1.5 text-[10px]">
            {t}
          </Badge>
        ))}
      </div>
    </a>
  );
}

// ── Trend live-demo previews ────────────────────────────────────────────────
const TREND_PREVIEWS: Record<string, React.ReactNode> = {
  glassmorphism: (
    <div className="relative overflow-hidden rounded-xl p-6" style={{background:"linear-gradient(135deg,#7c3aed44 0%,#2563eb33 50%,#db277744 100%)"}}>
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl" style={{background:"rgba(139,92,246,0.45)"}} />
      <div className="absolute -bottom-4 -left-4 h-20 w-20 rounded-full blur-2xl" style={{background:"rgba(236,72,153,0.35)"}} />
      <div className="relative rounded-xl border p-4 shadow-xl" style={{background:"rgba(255,255,255,0.08)",backdropFilter:"blur(20px)",borderColor:"rgba(255,255,255,0.18)"}}>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{color:"rgba(255,255,255,0.5)"}}>Glass card</p>
        <p className="mt-1 text-lg font-bold" style={{color:"#fff"}}>Frosted surface</p>
        <p className="mt-0.5 text-[11px]" style={{color:"rgba(255,255,255,0.55)"}}>backdrop-blur-xl · bg-white/8 · border-white/18</p>
      </div>
    </div>
  ),

  "bento-grid": (
    <div className="grid grid-cols-3 gap-2 p-1">
      <div className="col-span-2 row-span-2 rounded-xl border border-primary/30 bg-primary/[0.07] p-3 flex flex-col justify-between min-h-[90px]">
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/50">Hero tile</span>
        <span className="text-base font-bold leading-tight">col-span-2<br/>row-span-2</span>
      </div>
      <div className="rounded-xl border border-sky-500/25 bg-sky-500/[0.07] p-2 flex items-center justify-center">
        <span className="text-[10px] font-semibold text-sky-400">1 × 1</span>
      </div>
      <div className="rounded-xl border border-amber-500/25 bg-amber-500/[0.07] p-2 flex items-center justify-center">
        <span className="text-[10px] font-semibold text-amber-400">1 × 1</span>
      </div>
      <div className="col-span-3 rounded-xl border border-violet-500/25 bg-violet-500/[0.07] p-2 flex items-center justify-center">
        <span className="text-[10px] font-semibold text-violet-400">col-span-3 — footer strip</span>
      </div>
    </div>
  ),

  "micro-animations": (
    <div className="flex flex-wrap justify-center gap-3 p-4">
      {["Scale on hover","Glow ring","Colour shift"].map((label) => (
        <div
          key={label}
          className="group cursor-pointer rounded-xl border border-border/60 bg-card px-4 py-3 text-center transition-all duration-200 hover:scale-[1.06] hover:border-primary/50 hover:shadow-lg hover:shadow-primary/15 hover:bg-primary/[0.04]"
        >
          <span className="text-xs font-semibold transition-colors duration-200 group-hover:text-primary">{label}</span>
        </div>
      ))}
      <div className="w-full flex justify-center pt-1">
        <span className="text-[10px] text-muted-foreground/50">← hover any card</span>
      </div>
    </div>
  ),

  "dark-premium": (
    <div className="relative overflow-hidden rounded-xl p-6" style={{background:"#07070f"}}>
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full blur-3xl" style={{background:"rgba(124,58,237,0.35)"}} />
      <div className="pointer-events-none absolute -bottom-6 -left-6 h-28 w-28 rounded-full blur-3xl" style={{background:"rgba(245,158,11,0.25)"}} />
      <p className="relative text-[9px] font-black uppercase tracking-[0.3em]" style={{color:"rgba(255,255,255,0.25)"}}>Premium tier · Lumina pattern</p>
      <p className="relative mt-1 text-2xl font-black leading-none" style={{background:"linear-gradient(90deg,#f59e0b,#a78bfa)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
        DARK GOLD GRADE
      </p>
      <div className="relative mt-3 flex items-center gap-2">
        <span className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold" style={{background:"rgba(245,158,11,0.15)",color:"#f59e0b",border:"1px solid rgba(245,158,11,0.3)"}}>Gold accent</span>
        <span className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold" style={{background:"rgba(139,92,246,0.15)",color:"#a78bfa",border:"1px solid rgba(139,92,246,0.3)"}}>Violet glow</span>
      </div>
    </div>
  ),

  "mono-editorial": (
    <div className="rounded-xl bg-white p-6 dark:bg-zinc-950">
      <p className="text-[9px] font-black uppercase tracking-[0.35em] text-black/35 dark:text-white/35">Dispatch · Vol. 01 · Issue 12</p>
      <p className="mt-2 text-3xl font-black leading-none tracking-tighter text-black dark:text-white">
        THE MOVE<br/>IS FORWARD
      </p>
      <div className="mt-3 h-px bg-black/15 dark:bg-white/15" />
      <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.18em] text-black/40 dark:text-white/40">
        Space Grotesk · Black/White · Tight tracking
      </p>
    </div>
  ),

  "ai-generated-bg": (
    <div className="relative overflow-hidden rounded-xl" style={{height:"110px"}}>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(at 20% 30%, hsl(270,90%,65%) 0px, transparent 55%), " +
            "radial-gradient(at 80% 10%, hsl(200,95%,60%) 0px, transparent 55%), " +
            "radial-gradient(at 50% 80%, hsl(340,90%,65%) 0px, transparent 55%), " +
            "radial-gradient(at 90% 75%, hsl(50,95%,65%) 0px, transparent 45%)",
          animation: "trendPulse 4s ease-in-out infinite alternate",
        }}
      />
      <div className="absolute inset-0" style={{backdropFilter:"blur(0px)",background:"rgba(0,0,0,0.08)"}} />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
        <span className="rounded-full px-3 py-1 text-[11px] font-semibold text-white/90" style={{background:"rgba(0,0,0,0.35)",backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,0.2)"}}>
          Mesh gradient · live
        </span>
        <span className="text-[10px]" style={{color:"rgba(255,255,255,0.6)"}}>haikei.app · fffuel.co</span>
      </div>
      <style>{`@keyframes trendPulse{0%{opacity:0.85;transform:scale(1)}100%{opacity:1;transform:scale(1.04)}}`}</style>
    </div>
  ),

  "social-proof-strips": (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-muted/20 py-3">
      <div style={{display:"flex",gap:"12px",animation:"trendMarquee 12s linear infinite",whiteSpace:"nowrap"}}>
        {["★★★★★  \"World class\"","200+ clients","⭐ 5.0 · 128 reviews","★★★★★  \"Fast delivery\"","Trusted by 14 brands","★★★★★  \"Superb work\""].concat(
          ["★★★★★  \"World class\"","200+ clients","⭐ 5.0 · 128 reviews","★★★★★  \"Fast delivery\"","Trusted by 14 brands","★★★★★  \"Superb work\""]
        ).map((item, i) => (
          <span key={i} className="inline-flex shrink-0 items-center rounded-full border border-border/50 bg-background px-3 py-1 text-xs text-muted-foreground">
            {item}
          </span>
        ))}
      </div>
      <style>{`@keyframes trendMarquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
    </div>
  ),
};

// ── Trend Showcase Card ─────────────────────────────────────────────────────
function TrendCard({ trend }: { trend: DesignTrend }) {
  const preview = TREND_PREVIEWS[trend.id];
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border/60">
      {preview && (
        <div className="border-b border-border/60 bg-muted/10 p-3">
          {preview}
        </div>
      )}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <Sparkles className="h-4 w-4 shrink-0 text-primary" />
          {trend.title}
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">{trend.description}</p>
        {trend.examples.length > 0 && (
          <div className="space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/60">Code</p>
            {trend.examples.map((ex) => (
              <code key={ex} className="block rounded border border-border/60 bg-muted/40 px-2 py-1 font-mono text-[11px] text-primary">
                {ex}
              </code>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-1 mt-auto pt-1">
          {trend.tags.map((t) => (
            <Badge key={t} variant="secondary" className="h-4 px-1.5 text-[10px]">{t}</Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Integration Map ─────────────────────────────────────────────────────────
const GROUP_COLOR: Record<IntegrationNode["group"], string> = {
  core: "bg-primary text-primary-foreground",
  client: "bg-sky-600 text-white",
  marketing: "bg-violet-600 text-white",
  mobile: "bg-emerald-600 text-white",
  infra: "bg-amber-600 text-white",
};

const GROUP_LABEL: Record<IntegrationNode["group"], string> = {
  core: "Core",
  client: "Client",
  marketing: "Marketing",
  mobile: "Mobile",
  infra: "Infrastructure",
};

function IntegrationMap() {
  const [selected, setSelected] = useState<IntegrationNode | null>(null);

  const groups: IntegrationNode["group"][] = ["core", "client", "marketing", "mobile", "infra"];

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border/60 bg-card/40 p-6">
        <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground/60">
          Click any node to see its connections
        </p>

        {/* Legend */}
        <div className="mb-6 flex flex-wrap gap-2">
          {groups.map((g) => (
            <span
              key={g}
              className={cn("flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium", GROUP_COLOR[g])}
            >
              {GROUP_LABEL[g]}
            </span>
          ))}
        </div>

        {/* Nodes grid */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {INTEGRATION_MAP_NODES.map((node) => {
            const isSelected = selected?.id === node.id;
            const isConnected =
              selected &&
              (selected.connects.includes(node.id) ||
                INTEGRATION_MAP_NODES.find((n) => n.id === node.id)?.connects.includes(selected.id));

            return (
              <button
                key={node.id}
                type="button"
                onClick={() => setSelected(isSelected ? null : node)}
                className={cn(
                  "group rounded-xl border p-3 text-left transition-all",
                  isSelected
                    ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                    : isConnected
                    ? "border-primary/30 bg-primary/[0.04]"
                    : "border-border/60 hover:border-border hover:bg-muted/30",
                  selected && !isSelected && !isConnected && "opacity-40",
                )}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "h-2 w-2 rounded-full shrink-0",
                      GROUP_COLOR[node.group].split(" ")[0],
                    )}
                  />
                  <span className="text-sm font-semibold">{node.label}</span>
                  <Badge variant="outline" className="ml-auto h-4 px-1 text-[9px]">
                    {GROUP_LABEL[node.group]}
                  </Badge>
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  {node.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected node detail */}
      {selected && (
        <Card className="border-primary/25 bg-primary/[0.04]">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Share2 className="h-4 w-4 text-primary" />
              {selected.label} — connections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">{selected.description}</p>
              <div className="flex flex-wrap gap-2">
                {selected.connects.map((cid) => {
                  const target = INTEGRATION_MAP_NODES.find((n) => n.id === cid);
                  if (!target) return null;
                  return (
                    <span
                      key={cid}
                      className={cn(
                        "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                        GROUP_COLOR[target.group],
                      )}
                    >
                      → {target.label}
                    </span>
                  );
                })}
              </div>
              {/* Reverse connections */}
              {(() => {
                const rev = INTEGRATION_MAP_NODES.filter((n) => n.connects.includes(selected.id));
                if (!rev.length) return null;
                return (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {rev.map((n) => (
                      <span
                        key={n.id}
                        className="flex items-center gap-1.5 rounded-full border border-border/50 px-2.5 py-1 text-xs text-muted-foreground"
                      >
                        ← {n.label}
                      </span>
                    ))}
                  </div>
                );
              })()}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Flow summary */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Full flow overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-medium text-foreground">Client journey:</span>
            {["social-media", "website", "client-portal", "mobile-app"].map((id, i, arr) => {
              const n = INTEGRATION_MAP_NODES.find((x) => x.id === id)!;
              return (
                <span key={id} className="flex items-center gap-1.5">
                  <span className={cn("rounded px-2 py-0.5 text-xs", GROUP_COLOR[n.group])}>
                    {n.label}
                  </span>
                  {i < arr.length - 1 && <span className="text-muted-foreground/50">→</span>}
                </span>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-medium text-foreground">Revenue flow:</span>
            {["crm", "invoices", "supabase", "email-notify"].map((id, i, arr) => {
              const n = INTEGRATION_MAP_NODES.find((x) => x.id === id)!;
              return (
                <span key={id} className="flex items-center gap-1.5">
                  <span className={cn("rounded px-2 py-0.5 text-xs", GROUP_COLOR[n.group])}>
                    {n.label}
                  </span>
                  {i < arr.length - 1 && <span className="text-muted-foreground/50">→</span>}
                </span>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-medium text-foreground">Marketing flow:</span>
            {["marketing-campaign", "social-media", "email-campaign", "website"].map((id, i, arr) => {
              const n = INTEGRATION_MAP_NODES.find((x) => x.id === id)!;
              return (
                <span key={id} className="flex items-center gap-1.5">
                  <span className={cn("rounded px-2 py-0.5 text-xs", GROUP_COLOR[n.group])}>
                    {n.label}
                  </span>
                  {i < arr.length - 1 && <span className="text-muted-foreground/50">→</span>}
                </span>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Component Library Preview ───────────────────────────────────────────────
const COMPONENTS = [
  {
    name: "Primary Button",
    preview: (
      <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-opacity hover:opacity-90">
        Get Started
      </button>
    ),
    code: `<Button>Get Started</Button>`,
  },
  {
    name: "Outline Button",
    preview: (
      <button className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/40">
        Learn more
      </button>
    ),
    code: `<Button variant="outline">Learn more</Button>`,
  },
  {
    name: "Badge",
    preview: (
      <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
        Live
      </span>
    ),
    code: `<Badge>Live</Badge>`,
  },
  {
    name: "Card",
    preview: (
      <div className="rounded-xl border border-border/60 bg-card p-4 shadow-sm">
        <p className="text-sm font-semibold">Card Title</p>
        <p className="mt-1 text-xs text-muted-foreground">Card body text here.</p>
      </div>
    ),
    code: `<Card><CardHeader><CardTitle>…</CardTitle></CardHeader><CardContent>…</CardContent></Card>`,
  },
  {
    name: "Stat Tile",
    preview: (
      <div className="rounded-xl border border-border/60 bg-card p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Revenue
        </p>
        <p className="mt-1 text-2xl font-semibold">$24,500</p>
        <p className="mt-0.5 text-xs text-emerald-400">+12% this month</p>
      </div>
    ),
    code: `// Stat tile — used in dashboard-client.tsx`,
  },
  {
    name: "Input",
    preview: (
      <input
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        placeholder="Enter value…"
        readOnly
      />
    ),
    code: `<Input placeholder="Enter value…" />`,
  },
  {
    name: "Alert (Amber)",
    preview: (
      <div className="flex items-start gap-2 rounded-lg border border-amber-500/25 bg-amber-500/[0.07] px-3 py-2.5 text-xs text-amber-300">
        <span className="mt-0.5">⚠️</span>
        <span>Heads up — check this before continuing.</span>
      </div>
    ),
    code: `// Amber alert — used in SOPs for notes`,
  },
  {
    name: "Code Block",
    preview: (
      <code className="block rounded-lg border border-border/60 bg-muted/40 px-3 py-2 font-mono text-[11px] text-primary">
        vercel --prod
      </code>
    ),
    code: `<code className="…font-mono text-primary">{cmd}</code>`,
  },
  {
    name: "Glassmorphism Header",
    preview: (
      <div className="rounded-xl border border-border/60 bg-background/70 px-4 py-3 backdrop-blur-xl">
        <p className="text-xs font-medium text-muted-foreground">Operating picture</p>
        <p className="text-sm font-semibold">Dashboard</p>
      </div>
    ),
    code: `// AppHeader — bg-background/70 + backdrop-blur-xl`,
  },
  {
    name: "Active Nav Item",
    preview: (
      <div className="flex items-center gap-2.5 rounded-lg bg-gradient-to-r from-primary/25 via-primary/10 to-transparent px-2.5 py-2 text-sm font-medium text-primary ring-1 ring-inset ring-primary/25">
        <span className="h-4 w-4 rounded bg-primary/20" />
        Dashboard
      </div>
    ),
    code: `// Active sidebar link — from-primary/25 via-primary/10 ring-primary/25`,
  },
  {
    name: "Section Label",
    preview: (
      <p className="px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground/60">
        Clients &amp; Money
      </p>
    ),
    code: `<p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground/60">…</p>`,
  },
  {
    name: "Gradient Text",
    preview: (
      <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-lg font-semibold text-transparent">
        J Supreme Conglomerate
      </span>
    ),
    code: `<span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">…</span>`,
  },
];

function ComponentLibrary() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (code: string, name: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(name);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {COMPONENTS.map((c) => (
        <div key={c.name} className="space-y-2 rounded-xl border border-border/60 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/60">
            {c.name}
          </p>
          <div className="flex items-center justify-center rounded-lg border border-border/40 bg-muted/20 px-4 py-6">
            {c.preview}
          </div>
          <button
            type="button"
            onClick={() => copy(c.code, c.name)}
            className="flex w-full items-center gap-1.5 rounded-md border border-border/60 bg-muted/30 px-2.5 py-1.5 font-mono text-[11px] text-muted-foreground transition-colors hover:text-primary"
          >
            <span className="flex-1 truncate text-left">{c.code}</span>
            <span className="shrink-0 text-[10px]">{copied === c.name ? "✓" : "copy"}</span>
          </button>
        </div>
      ))}
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────
export function WebToolsetClient() {
  const categories = [...new Set(TOOLSET_RESOURCES.map((r) => r.category))];
  const [activeResourceCat, setActiveResourceCat] = useState<string | null>(null);

  const filteredResources = activeResourceCat
    ? TOOLSET_RESOURCES.filter((r) => r.category === activeResourceCat)
    : TOOLSET_RESOURCES;

  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList className="h-10 gap-1">
        <TabsTrigger value="overview" className="gap-1.5 text-xs">
          <Layers className="h-3.5 w-3.5" />
          Overview
        </TabsTrigger>
        <TabsTrigger value="components" className="gap-1.5 text-xs">
          <Box className="h-3.5 w-3.5" />
          Components
        </TabsTrigger>
        <TabsTrigger value="integration" className="gap-1.5 text-xs">
          <Share2 className="h-3.5 w-3.5" />
          Integration Map
        </TabsTrigger>
        <TabsTrigger value="resources" className="gap-1.5 text-xs">
          <Wrench className="h-3.5 w-3.5" />
          Resources
        </TabsTrigger>
        <TabsTrigger value="trends" className="gap-1.5 text-xs">
          <Sparkles className="h-3.5 w-3.5" />
          Trends
        </TabsTrigger>
      </TabsList>

      {/* ── Overview ── */}
      <TabsContent value="overview" className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Globe2, label: "Active Sites", value: "17+", sub: "Vercel production", color: "text-sky-400" },
            { icon: Smartphone, label: "Mobile Apps", value: "6", sub: "iOS + Android live", color: "text-emerald-400" },
            { icon: Zap, label: "Integrations", value: "15", sub: "Nodes in ecosystem", color: "text-violet-400" },
            { icon: Palette, label: "Design Trends", value: `${DESIGN_TRENDS.length}`, sub: "Active patterns", color: "text-amber-400" },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="p-5">
                <s.icon className={cn("h-5 w-5", s.color)} />
                <p className="mt-2 text-2xl font-semibold">{s.value}</p>
                <p className="text-xs font-medium">{s.label}</p>
                <p className="text-[11px] text-muted-foreground">{s.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Quick access resources */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Wrench className="h-4 w-4 text-primary" />
                Quick access — tools
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5">
              {TOOLSET_RESOURCES.filter((r) => r.type === "tool").slice(0, 6).map((r) => (
                <a
                  key={r.id}
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted/30 hover:text-foreground"
                >
                  <span>{r.title}</span>
                  <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-60" />
                </a>
              ))}
            </CardContent>
          </Card>

          {/* Quick access articles */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <BookOpen className="h-4 w-4 text-primary" />
                Quick access — reads
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5">
              {TOOLSET_RESOURCES.filter((r) => r.type === "article").slice(0, 6).map((r) => (
                <a
                  key={r.id}
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted/30 hover:text-foreground"
                >
                  <span>{r.title}</span>
                  <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-60" />
                </a>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Stack snapshot */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <LayoutTemplate className="h-4 w-4 text-primary" />
              JST standard stack
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                "Next.js 16", "Tailwind v4", "TypeScript", "shadcn/ui", "Lucide Icons",
                "Recharts", "Supabase", "Clerk", "Resend", "WiPay", "Vercel",
                "Expo SDK 54", "NativeWind", "EAS Build",
              ].map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-border/60 bg-muted/30 px-2.5 py-0.5 text-muted-foreground"
                >
                  {tech}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* ── Components ── */}
      <TabsContent value="components">
        <ComponentLibrary />
      </TabsContent>

      {/* ── Integration Map ── */}
      <TabsContent value="integration">
        <IntegrationMap />
      </TabsContent>

      {/* ── Resources ── */}
      <TabsContent value="resources" className="space-y-4">
        {/* Category filter */}
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setActiveResourceCat(null)}
            className={cn(
              "rounded-full border px-3 py-0.5 text-xs transition-colors",
              !activeResourceCat
                ? "border-primary bg-primary/15 text-primary"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            All ({TOOLSET_RESOURCES.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveResourceCat(cat === activeResourceCat ? null : cat)}
              className={cn(
                "rounded-full border px-3 py-0.5 text-xs transition-colors",
                activeResourceCat === cat
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {cat} ({TOOLSET_RESOURCES.filter((r) => r.category === cat).length})
            </button>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredResources.map((r) => (
            <ResourceCard key={r.id} r={r} />
          ))}
        </div>
      </TabsContent>

      {/* ── Trends ── */}
      <TabsContent value="trends">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DESIGN_TRENDS.map((t) => (
            <TrendCard key={t.id} trend={t} />
          ))}
        </div>

        <Card className="mt-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Trend watchlist — stay current</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            {[
              { label: "Awwwards SOTD", url: "https://www.awwwards.com/", desc: "Daily site of the day — check what wins." },
              { label: "Dribbble trending", url: "https://dribbble.com/shots/popular/ui-ux", desc: "Popular shots this week." },
              { label: "Mobbin new screens", url: "https://mobbin.com/screens?platform=ios&sort=new", desc: "Latest iOS app screens added." },
              { label: "CSS-Tricks latest", url: "https://css-tricks.com/", desc: "New techniques and demos." },
              { label: "web.dev blog", url: "https://web.dev/blog/", desc: "Chrome team updates on performance and APIs." },
            ].map((item) => (
              <a
                key={item.label}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="group flex items-start justify-between gap-2 rounded-lg px-2.5 py-2 transition-colors hover:bg-muted/30"
              >
                <div>
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {item.label}
                  </p>
                  <p className="text-xs">{item.desc}</p>
                </div>
                <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-40 group-hover:opacity-100" />
              </a>
            ))}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

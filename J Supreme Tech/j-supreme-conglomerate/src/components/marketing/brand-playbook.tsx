"use client";

import { type ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CampaignWithAssets } from "@/lib/data/marketing-campaigns";
import type { BrandPlan, ChannelPriority } from "@/lib/data/marketing-plans";
import { BrandLogo } from "@/components/brand/brand-logo";
import {
  ArrowRight,
  CalendarRange,
  CheckCircle2,
  Crosshair,
  ExternalLink,
  Gauge,
  Globe,
  Image as ImageIcon,
  Layers,
  MapPin,
  Megaphone,
  Route,
  Star,
  Target,
  TrendingUp,
  Users,
  Wallet,
  Workflow,
  Zap,
} from "lucide-react";

/* ───────────────────────── Entry point ───────────────────────── */
export function BrandPlaybook({
  campaign,
  campaigns,
  onSelectCampaign,
  onViewAssets,
}: {
  campaign: string;
  campaigns: CampaignWithAssets[];
  onSelectCampaign: (slug: string) => void;
  onViewAssets: (slug: string) => void;
}) {
  if (campaign === "all") {
    return <PortfolioOverview campaigns={campaigns} onOpen={onSelectCampaign} />;
  }
  const c = campaigns.find((x) => x.slug === campaign);
  if (!c) return null;
  if (!c.plan) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          No playbook authored for <strong className="text-foreground">{c.name}</strong> yet. Add a{" "}
          <code className="rounded bg-muted px-1.5 py-0.5">BrandPlan</code> with{" "}
          <code className="rounded bg-muted px-1.5 py-0.5">campaign: &quot;{c.slug}&quot;</code> in{" "}
          <code className="rounded bg-muted px-1.5 py-0.5">marketing-plans.ts</code>.
        </CardContent>
      </Card>
    );
  }
  return <BrandPlanView c={c} plan={c.plan} onViewAssets={() => onViewAssets(c.slug)} />;
}

/* ───────────────────── Portfolio overview (All) ───────────────────── */
function PortfolioOverview({
  campaigns,
  onOpen,
}: {
  campaigns: CampaignWithAssets[];
  onOpen: (slug: string) => void;
}) {
  const withPlans = campaigns.filter((c) => c.plan);
  return (
    <div className="space-y-4">
      <div className="flex items-baseline gap-3 border-b border-border/60 pb-2">
        <h2 className="text-lg font-semibold">Brand Playbooks</h2>
        <Badge variant="secondary" className="rounded-full">{withPlans.length}</Badge>
        <p className="hidden text-xs text-muted-foreground sm:block">
          Pick a brand to open its full marketing plan — market, audiences, best channels, budget &amp; a 30/60/90 roadmap.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {withPlans.map((c) => {
          const plan = c.plan!;
          const top = plan.channels[0];
          return (
            <button
              key={c.slug}
              type="button"
              onClick={() => onOpen(c.slug)}
              className="group relative overflow-hidden rounded-xl border border-border/60 p-4 text-left transition-all hover:border-border hover:shadow-sm"
            >
              <span className="absolute inset-x-0 top-0 h-1" style={{ background: c.accent }} />
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3">
                  {c.logo ? <BrandLogo src={c.logo} name={c.name} className="mt-0.5 h-9 w-9" /> : null}
                  <div>
                    <h3 className="text-base font-semibold leading-tight">{c.name}</h3>
                    <p className="text-xs text-muted-foreground">{c.tagline}</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </div>
              <p className="mt-2 line-clamp-2 text-[13px] leading-snug text-foreground/80">{plan.positioning}</p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                <MiniStat icon={Target} label="North star" value={plan.northStar} />
                <MiniStat icon={Megaphone} label="Best channel" value={top.channel} />
                <MiniStat icon={Wallet} label="Monthly" value={plan.budget.monthly} />
                <MiniStat icon={ImageIcon} label="Assets ready" value={`${c.total}`} />
              </div>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-foreground/70 group-hover:text-foreground">
                Open playbook <ArrowRight className="h-3 w-3" />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MiniStat({ icon: Icon, label, value }: { icon: typeof Target; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/50 bg-muted/20 p-2">
      <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wide text-muted-foreground/70">
        <Icon className="h-3 w-3" /> {label}
      </span>
      <p className="mt-0.5 line-clamp-2 font-medium leading-tight">{value}</p>
    </div>
  );
}

/* ───────────────────────── Single brand plan ───────────────────────── */
function BrandPlanView({
  c,
  plan,
  onViewAssets,
}: {
  c: CampaignWithAssets;
  plan: BrandPlan;
  onViewAssets: () => void;
}) {
  return (
    <div className="space-y-6">
      {/* Hero */}
      <Card className="relative overflow-hidden">
        <span className="absolute inset-x-0 top-0 h-1.5" style={{ background: c.accent }} />
        <CardContent className="space-y-4 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              {c.logo ? <BrandLogo src={c.logo} name={c.name} className="h-12 w-12" /> : null}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.accent }} />
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Brand Playbook</span>
                </div>
                <h1 className="text-2xl font-semibold leading-tight">{c.name}</h1>
                <p className="text-sm italic text-muted-foreground">&ldquo;{c.tagline}&rdquo;</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5 text-xs">
              {c.handle && <span className="font-medium text-foreground/70">{c.handle}</span>}
              {c.site && (
                <a href={`https://${c.site}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">
                  <Globe className="h-3 w-3" /> {c.site}
                </a>
              )}
              <Button size="sm" variant="secondary" className="mt-1 h-7 gap-1 text-[11px]" onClick={onViewAssets}>
                <ImageIcon className="h-3 w-3" /> View {c.total} assets
              </Button>
            </div>
          </div>

          <p className="max-w-3xl text-[15px] leading-relaxed">{plan.positioning}</p>

          <div className="grid gap-3 sm:grid-cols-2">
            <HeroTile icon={Target} accent={c.accent} label="North star metric" value={plan.northStar} />
            <HeroTile icon={Star} accent={c.accent} label="Headline offer" value={plan.offer} />
          </div>
        </CardContent>
      </Card>

      {/* Market breakdown */}
      <Section icon={TrendingUp} title="Market breakdown" subtitle="The opportunity, where it lives, and what drives demand.">
        <div className="grid gap-3 md:grid-cols-2">
          <InfoCard label="Market size & opportunity" icon={TrendingUp}>{plan.market.size}</InfoCard>
          <InfoCard label="Geography" icon={MapPin}>{plan.market.geography}</InfoCard>
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-border/60 p-4">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Demand drivers</p>
            <ul className="space-y-1.5">
              {plan.market.demandDrivers.map((d, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: c.accent }} />
                  {d}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border p-4" style={{ borderColor: `${c.accent}55`, background: `${c.accent}0d` }}>
            <p className="mb-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
              <CalendarRange className="h-3 w-3" /> Seasonality
            </p>
            <p className="text-sm leading-relaxed">{plan.market.seasonality}</p>
          </div>
        </div>
      </Section>

      {/* Audiences */}
      <Section icon={Users} title="Audiences" subtitle="Who you're talking to — and the one message that lands for each.">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {plan.audiences.map((a) => (
            <Card key={a.name} className="border-border/70">
              <CardContent className="space-y-2 p-4">
                <h3 className="text-sm font-semibold">{a.name}</h3>
                <p className="text-xs text-muted-foreground">{a.who}</p>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground/70">Pains</p>
                  <ul className="mt-1 space-y-1">
                    {a.pains.map((p, i) => (
                      <li key={i} className="text-[12px] leading-snug text-foreground/80">• {p}</li>
                    ))}
                  </ul>
                </div>
                <p className="text-[11px] text-muted-foreground"><span className="font-semibold text-foreground/70">Find them:</span> {a.where}</p>
                <div className="rounded-lg bg-muted/40 p-2 text-[12px] leading-snug">
                  <span className="font-semibold">Message: </span>{a.message}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* Competitive landscape */}
      <Section icon={Crosshair} title="Competitive landscape" subtitle="Respect each threat — then attack where you win.">
        <div className="grid gap-3 md:grid-cols-3">
          {plan.competitors.map((comp) => (
            <Card key={comp.name} className="border-border/70">
              <CardContent className="space-y-2 p-4">
                <div>
                  <h3 className="text-sm font-semibold leading-tight">{comp.name}</h3>
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{comp.type}</p>
                </div>
                <p className="text-[12px] text-muted-foreground"><span className="font-semibold text-foreground/70">Their strength:</span> {comp.strength}</p>
                <div className="rounded-lg border p-2 text-[12px] leading-snug" style={{ borderColor: `${c.accent}55`, background: `${c.accent}0d` }}>
                  <span className="font-bold" style={{ color: c.accent }}>Our wedge → </span>{comp.ourWedge}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* Channel strategy — best place to market */}
      <Section icon={Megaphone} title="Best places to market" subtitle="Channels ranked. Start at #1 — it's where this brand wins fastest.">
        <div className="space-y-3">
          {plan.channels.map((ch, i) => (
            <Card key={ch.channel} className={cn("border-border/70", i === 0 && "ring-1 ring-inset")} style={i === 0 ? { borderColor: `${c.accent}66`, boxShadow: `inset 0 0 0 1px ${c.accent}44` } : undefined}>
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: c.accent }}>{i + 1}</span>
                  <h3 className="text-sm font-semibold">{ch.channel}</h3>
                  <PriorityBadge priority={ch.priority} />
                  {i === 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white" style={{ background: c.accent }}>
                      <Star className="h-2.5 w-2.5" /> Start here
                    </span>
                  )}
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-foreground/85">{ch.why}</p>
                <p className="mt-1.5 flex items-start gap-1 text-[11px] text-muted-foreground">
                  <CalendarRange className="mt-0.5 h-3 w-3 shrink-0" /> <span><span className="font-semibold text-foreground/70">Cadence:</span> {ch.cadence}</span>
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {ch.tactics.map((t, j) => (
                    <span key={j} className="rounded-full border border-border/60 bg-muted/30 px-2 py-0.5 text-[11px] text-foreground/75">{t}</span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* Content pillars */}
      <Section icon={Layers} title="Content pillars" subtitle="What to actually post — and how much of each.">
        <div className="space-y-2.5">
          {plan.pillars.map((p) => (
            <div key={p.name} className="rounded-xl border border-border/60 p-3.5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold">{p.name}</h3>
                <span className="text-xs font-bold tabular-nums" style={{ color: c.accent }}>{p.share}</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full" style={{ width: p.share, background: c.accent }} />
              </div>
              <p className="mt-2 text-[12px] text-muted-foreground">{p.why}</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {p.examples.map((e, i) => (
                  <span key={i} className="rounded-full bg-muted/40 px-2 py-0.5 text-[11px] text-foreground/70">{e}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Funnel */}
      <Section icon={Workflow} title="The funnel" subtitle="From first impression to loyal repeat — the play at each stage.">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {plan.funnel.map((f, i) => (
            <div key={f.stage} className="relative rounded-xl border border-border/60 p-3.5">
              <span className="absolute left-0 top-0 h-full w-1 rounded-l-xl" style={{ background: c.accent, opacity: 0.3 + i * 0.22 }} />
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tabular-nums text-muted-foreground">{i + 1}</span>
                <h3 className="text-sm font-semibold">{f.stage}</h3>
              </div>
              <p className="mt-1 text-[12px] text-foreground/80">{f.goal}</p>
              <ul className="mt-2 space-y-0.5">
                {f.plays.map((p, j) => (
                  <li key={j} className="text-[11px] text-muted-foreground">• {p}</li>
                ))}
              </ul>
              <p className="mt-2 border-t border-border/50 pt-1.5 text-[10px] uppercase tracking-wide text-muted-foreground/80">
                Metric: <span className="font-semibold text-foreground/70">{f.metric}</span>
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Budget */}
      <Section icon={Wallet} title="Budget & allocation" subtitle="A starting monthly spend and where it goes. Tune to your real numbers.">
        <Card className="border-border/70">
          <CardContent className="space-y-4 p-5">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-2xl font-semibold tabular-nums">{plan.budget.monthly}</span>
              <Badge variant="outline" className="text-[10px]">{plan.budget.currency} / month</Badge>
            </div>
            {/* stacked bar */}
            <div className="flex h-3 w-full overflow-hidden rounded-full">
              {plan.budget.split.map((s, i) => (
                <div key={i} title={`${s.label} — ${s.pct}%`} style={{ width: `${s.pct}%`, background: c.accent, opacity: 1 - i * 0.16 }} />
              ))}
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {plan.budget.split.map((s, i) => (
                <div key={i} className="flex items-start gap-2 text-[13px]">
                  <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: c.accent, opacity: 1 - i * 0.16 }} />
                  <span className="flex-1">
                    <span className="font-medium">{s.label}</span>
                    {s.note && <span className="block text-[11px] text-muted-foreground">{s.note}</span>}
                  </span>
                  <span className="font-bold tabular-nums text-muted-foreground">{s.pct}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </Section>

      {/* KPIs */}
      <Section icon={Gauge} title="KPIs & targets" subtitle="What success looks like — measure these.">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {plan.kpis.map((k) => (
            <div key={k.label} className="rounded-xl border border-border/60 p-3.5">
              <p className="text-[11px] font-medium text-muted-foreground">{k.label}</p>
              <p className="mt-1 text-lg font-semibold tabular-nums" style={{ color: c.accent }}>{k.target}</p>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground/70">by {k.horizon}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Roadmap */}
      <Section icon={Route} title="30 / 60 / 90-day roadmap" subtitle="The order of operations you can actually execute.">
        <div className="grid gap-3 md:grid-cols-3">
          {plan.roadmap.map((r, i) => (
            <Card key={r.window} className="border-border/70">
              <CardContent className="space-y-2 p-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: c.accent }}>{i + 1}</span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{r.window}</p>
                    <h3 className="text-sm font-semibold leading-tight">{r.theme}</h3>
                  </div>
                </div>
                <ul className="space-y-1">
                  {r.actions.map((a, j) => (
                    <li key={j} className="flex gap-1.5 text-[12px] leading-snug">
                      <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0" style={{ color: c.accent }} /> {a}
                    </li>
                  ))}
                </ul>
                <p className="rounded-lg bg-muted/40 p-2 text-[11px] leading-snug">
                  <span className="font-semibold">Outcome: </span>{r.outcome}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* Quick wins */}
      <Section icon={Zap} title="Quick wins — do this week" subtitle="No-budget moves you can act on right now.">
        <div className="grid gap-2 sm:grid-cols-2">
          {plan.quickWins.map((w, i) => (
            <div key={i} className="flex items-start gap-2 rounded-xl border p-3 text-[13px] leading-snug" style={{ borderColor: `${c.accent}40` }}>
              <Zap className="mt-0.5 h-4 w-4 shrink-0" style={{ color: c.accent }} /> {w}
            </div>
          ))}
        </div>
      </Section>

      <div className="flex justify-center pt-2">
        <Button variant="secondary" className="gap-1.5" onClick={onViewAssets}>
          <ImageIcon className="h-4 w-4" /> View all {c.total} {c.name} assets <ExternalLink className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

/* ───────────────────────── small bits ───────────────────────── */
function Section({ icon: Icon, title, subtitle, children }: { icon: typeof Target; title: string; subtitle?: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2 border-b border-border/60 pb-2">
        <Icon className="h-4 w-4 text-foreground/70" />
        <h2 className="text-base font-semibold">{title}</h2>
        {subtitle && <p className="hidden text-xs text-muted-foreground sm:block">— {subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

function HeroTile({ icon: Icon, label, value, accent }: { icon: typeof Target; label: string; value: string; accent: string }) {
  return (
    <div className="rounded-xl border border-border/60 p-3">
      <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3 w-3" style={{ color: accent }} /> {label}
      </span>
      <p className="mt-1 text-sm font-medium leading-snug">{value}</p>
    </div>
  );
}

function InfoCard({ label, icon: Icon, children }: { label: string; icon: typeof Target; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-border/60 p-4">
      <p className="mb-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3 w-3" /> {label}
      </p>
      <p className="text-sm leading-relaxed">{children}</p>
    </div>
  );
}

const PRIORITY_META: Record<ChannelPriority, { label: string; variant: "default" | "secondary" | "outline" }> = {
  primary: { label: "Primary", variant: "default" },
  secondary: { label: "Secondary", variant: "secondary" },
  test: { label: "Test", variant: "outline" },
};

function PriorityBadge({ priority }: { priority: ChannelPriority }) {
  const m = PRIORITY_META[priority];
  return <Badge variant={m.variant} className="px-1.5 py-0 text-[9px] uppercase tracking-wide">{m.label}</Badge>;
}

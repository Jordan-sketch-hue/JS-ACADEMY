"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { CHANNELS, type ChannelId, type FormatId, type MarketingAsset, type Series } from "@/lib/data/marketing-types";
import type { CampaignWithAssets } from "@/lib/data/marketing-campaigns";
import {
  ArrowRight,
  CalendarRange,
  Clapperboard,
  Download,
  ExternalLink,
  FileText,
  Filter,
  ImageIcon,
  LayoutGrid,
  ListTree,
  Map,
  Play,
  Search,
  Send,
  Sparkles,
} from "lucide-react";
import { PublishingPanel, assetToPrefill, type SchedulePrefill } from "./publishing-panel";
import { BrandPlaybook } from "./brand-playbook";
import { BrandLogo } from "@/components/brand/brand-logo";

type ViewId = "board" | "sequence" | "playbook" | "publishing";

type Data = { campaigns: CampaignWithAssets[]; assets: MarketingAsset[]; series: Series[] };

const FORMAT_META: Record<FormatId, { label: string; icon: typeof ImageIcon }> = {
  static: { label: "Static", icon: ImageIcon },
  video: { label: "Video", icon: Clapperboard },
  pdf: { label: "Deck / PDF", icon: FileText },
};

const ROLE_META: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "success" | "warning" }> = {
  teaser: { label: "Teaser", variant: "warning" },
  episode: { label: "Episode", variant: "secondary" },
  payoff: { label: "Payoff", variant: "success" },
  evergreen: { label: "Evergreen", variant: "outline" },
};

const aspectClass = (a: MarketingAsset) =>
  a.ratio === "portrait" ? "aspect-[9/16]" : a.ratio === "landscape" ? "aspect-[16/10]" : "aspect-square";

const ratioLabel = (a: MarketingAsset) =>
  a.ratio === "portrait" ? "9:16" : a.ratio === "landscape" ? "16:9" : "1:1";

export function MarketingCommandCenter({ data }: { data: Data }) {
  const [campaign, setCampaign] = useState<string>("all");
  const [view, setView] = useState<ViewId>("playbook");
  const [channel, setChannel] = useState<ChannelId | "all">("all");
  const [format, setFormat] = useState<FormatId | "all">("all");
  const [q, setQ] = useState("");
  const [active, setActive] = useState<MarketingAsset | null>(null);
  const [schedulePrefill, setSchedulePrefill] = useState<SchedulePrefill | null>(null);

  const handleSchedule = (asset: MarketingAsset) => {
    setSchedulePrefill(assetToPrefill(asset));
    setActive(null);
    setView("publishing");
  };

  // From a brand playbook, jump straight to its assets on the board.
  const handleViewAssets = (slug: string) => {
    setCampaign(slug);
    setChannel("all");
    setFormat("all");
    setQ("");
    setView("board");
  };

  const showStoryFilters = view === "board" || view === "sequence";

  const accentBySlug = useMemo(
    () => Object.fromEntries(data.campaigns.map((c) => [c.slug, c])) as Record<string, CampaignWithAssets>,
    [data.campaigns],
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return data.assets.filter((a) => {
      if (campaign !== "all" && a.campaign !== campaign) return false;
      if (channel !== "all" && a.resolvedChannel !== channel) return false;
      if (format !== "all" && a.format !== format) return false;
      if (needle) {
        const hay = `${a.resolvedTitle} ${a.narrative?.hook ?? ""} ${a.narrative?.series ?? ""} ${a.campaign}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [data.assets, campaign, channel, format, q]);

  const totals = useMemo(() => {
    const byCh = filtered.reduce((m, a) => ((m[a.resolvedChannel] = (m[a.resolvedChannel] || 0) + 1), m), {} as Record<string, number>);
    const vids = filtered.filter((a) => a.format === "video").length;
    const eggs = filtered.filter((a) => a.narrative?.easterEgg).length;
    return { byCh, vids, eggs };
  }, [filtered]);

  const empty = data.assets.length === 0;

  return (
    <div className="mx-auto max-w-[1400px] space-y-5 pb-20">
      <p className="text-sm text-muted-foreground">
        Each brand&apos;s full marketing plan in the{" "}
        <strong className="text-foreground">Playbook</strong> — market, audiences, best channels, budget &amp; a 30/60/90 roadmap —
        plus every creative on the <strong className="text-foreground">Board</strong>, a{" "}
        <strong className="text-foreground">Story Sequence</strong> view, and{" "}
        <strong className="text-foreground">Publishing</strong> to schedule straight to Meta.
      </p>

      {/* Control bar — the view toggle is always available; storyboard filters hide on Publishing */}
      <div className="sticky top-2 z-20 space-y-3 rounded-xl border border-border/60 bg-card/80 p-3 backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-2">
          <SegToggle
            options={[
              { id: "playbook", label: "Playbook", icon: Map },
              { id: "board", label: "Board", icon: LayoutGrid },
              { id: "sequence", label: "Story Sequence", icon: ListTree },
              { id: "publishing", label: "Publishing", icon: Send },
            ]}
            value={view}
            onChange={(v) => setView(v as ViewId)}
          />
          {showStoryFilters && !empty && (
            <div className="relative ml-auto w-full max-w-[240px]">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search hooks, titles…" className="h-8 pl-8 text-sm" />
            </div>
          )}
        </div>
        {showStoryFilters && !empty && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <FilterRow label="Channel" icon={Filter}>
              <Pill active={channel === "all"} onClick={() => setChannel("all")}>All</Pill>
              {CHANNELS.map((c) => (
                <Pill key={c.id} active={channel === c.id} onClick={() => setChannel(c.id)}>
                  {c.label}
                  <span className="ml-1 opacity-60">{totals.byCh[c.id] ?? 0}</span>
                </Pill>
              ))}
            </FilterRow>
            <FilterRow label="Format">
              <Pill active={format === "all"} onClick={() => setFormat("all")}>All</Pill>
              {(["static", "video", "pdf"] as FormatId[]).map((f) => (
                <Pill key={f} active={format === f} onClick={() => setFormat(f)}>{FORMAT_META[f].label}</Pill>
              ))}
            </FilterRow>
          </div>
        )}
      </div>

      {view === "publishing" ? (
        <PublishingPanel prefill={schedulePrefill} onConsumePrefill={() => setSchedulePrefill(null)} />
      ) : empty ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            No staged assets yet. Run <code className="rounded bg-muted px-1.5 py-0.5">node _build/stage-marketing.mjs</code> to
            optimize each campaign&apos;s creative into <code className="rounded bg-muted px-1.5 py-0.5">/public/marketing</code>.
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Campaign selector */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <CampaignChip active={campaign === "all"} onClick={() => setCampaign("all")} label="All campaigns" count={data.assets.length} gradient="from-foreground/70 to-foreground/40" />
            {data.campaigns.map((c) => (
              <CampaignChip key={c.slug} active={campaign === c.slug} onClick={() => setCampaign(c.slug)} label={c.name} count={c.total} gradient={c.brand} sub={c.tagline} logo={c.logo} />
            ))}
          </div>

          {/* Body */}
          {view === "playbook" ? (
            <BrandPlaybook
              campaign={campaign}
              campaigns={data.campaigns}
              onSelectCampaign={setCampaign}
              onViewAssets={handleViewAssets}
            />
          ) : filtered.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">No assets match these filters.</p>
          ) : view === "board" ? (
            <BoardView assets={filtered} accentBySlug={accentBySlug} onOpen={setActive} />
          ) : (
            <SequenceView data={data} assets={filtered} accentBySlug={accentBySlug} onOpen={setActive} campaign={campaign} />
          )}
        </>
      )}

      <Lightbox asset={active} campaign={active ? accentBySlug[active.campaign] : undefined} onClose={() => setActive(null)} onSchedule={handleSchedule} />
    </div>
  );
}

/* ───────────────────────── Board view ───────────────────────── */
function BoardView({
  assets,
  accentBySlug,
  onOpen,
}: {
  assets: MarketingAsset[];
  accentBySlug: Record<string, CampaignWithAssets>;
  onOpen: (a: MarketingAsset) => void;
}) {
  return (
    <div className="space-y-10">
      {CHANNELS.map((ch) => {
        const group = assets.filter((a) => a.resolvedChannel === ch.id);
        if (!group.length) return null;
        return (
          <section key={ch.id} className="space-y-3">
            <div className="flex items-baseline gap-3 border-b border-border/60 pb-2">
              <h2 className="text-lg font-semibold">{ch.label}</h2>
              <Badge variant="secondary" className="rounded-full">{group.length}</Badge>
              <p className="hidden text-xs text-muted-foreground sm:block">{ch.blurb}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {group.map((a) => (
                <AssetCard key={a.id} asset={a} campaign={accentBySlug[a.campaign]} onOpen={onOpen} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

/* ─────────────────────── Story Sequence view ─────────────────────── */
function SequenceView({
  data,
  assets,
  accentBySlug,
  onOpen,
  campaign,
}: {
  data: Data;
  assets: MarketingAsset[];
  accentBySlug: Record<string, CampaignWithAssets>;
  onOpen: (a: MarketingAsset) => void;
  campaign: string;
}) {
  const inScope = new Set(assets.map((a) => a.id));
  const series = data.series.filter((s) => campaign === "all" || s.campaign === campaign);
  const singles = assets.filter((a) => !a.narrative?.series);

  return (
    <div className="space-y-8">
      {series.map((s) => {
        const items = data.assets
          .filter((a) => a.narrative?.series === s.id && inScope.has(a.id))
          .sort((a, b) => (a.narrative?.sequence ?? 99) - (b.narrative?.sequence ?? 99));
        if (!items.length) return null;
        const c = accentBySlug[s.campaign];
        return (
          <section key={s.id} className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className={cn("h-2.5 w-2.5 rounded-full bg-gradient-to-br", c?.brand)} />
              <h2 className="text-base font-semibold">{s.name}</h2>
              <Badge variant="outline" className="rounded-full text-[10px] uppercase tracking-wide">{c?.name}</Badge>
            </div>
            <p className="max-w-3xl text-sm text-muted-foreground">{s.premise}</p>
            {s.cadence && (
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CalendarRange className="h-3.5 w-3.5 text-primary" /> <span className="font-medium text-foreground/80">Cadence:</span> {s.cadence}
              </p>
            )}
            <div className="flex gap-3 overflow-x-auto pb-3">
              {items.map((a, i) => (
                <div key={a.id} className="flex shrink-0 items-center gap-3">
                  <div className="w-[200px]">
                    <AssetCard asset={a} campaign={c} onOpen={onOpen} showSeq />
                  </div>
                  {i < items.length - 1 && <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground/50" />}
                </div>
              ))}
            </div>
          </section>
        );
      })}

      {singles.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-baseline gap-3 border-b border-border/60 pb-2">
            <h2 className="text-base font-semibold">Standalone &amp; evergreen</h2>
            <Badge variant="secondary" className="rounded-full">{singles.length}</Badge>
            <p className="hidden text-xs text-muted-foreground sm:block">Not part of a thread — post any time.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {singles.map((a) => (
              <AssetCard key={a.id} asset={a} campaign={accentBySlug[a.campaign]} onOpen={onOpen} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

/* ───────────────────────── Asset card ───────────────────────── */
function AssetCard({
  asset,
  campaign,
  onOpen,
  showSeq,
}: {
  asset: MarketingAsset;
  campaign?: CampaignWithAssets;
  onOpen: (a: MarketingAsset) => void;
  showSeq?: boolean;
}) {
  const Fmt = FORMAT_META[asset.format].icon;
  const preview = asset.format === "static" ? asset.file : asset.poster;
  const role = asset.narrative?.role ? ROLE_META[asset.narrative.role] : undefined;

  return (
    <Card className="group overflow-hidden border-border/70 bg-card/40 transition-colors hover:border-primary/40">
      <button type="button" onClick={() => onOpen(asset)} className="block w-full text-left">
        <div className={cn("relative w-full overflow-hidden bg-muted/30", aspectClass(asset))}>
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element -- local optimized previews
            <img src={preview} alt={asset.resolvedTitle} loading="lazy" className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]" />
          ) : (
            <div className="flex h-full items-center justify-center"><Fmt className="h-8 w-8 text-muted-foreground/40" /></div>
          )}
          {/* top-left: campaign keyline */}
          <span className={cn("absolute left-0 top-0 h-1 w-full bg-gradient-to-r", campaign?.brand)} />
          {/* top badges */}
          <div className="absolute left-1.5 top-2.5 flex flex-wrap gap-1">
            {showSeq && asset.narrative?.sequence && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-black/75 px-1 text-[11px] font-bold text-white">{asset.narrative.sequence}</span>
            )}
          </div>
          <div className="absolute right-1.5 top-2 flex flex-col items-end gap-1">
            <Badge variant="secondary" className="gap-1 bg-black/65 px-1.5 py-0 text-[10px] text-white backdrop-blur-sm">
              <Fmt className="h-3 w-3" /> {ratioLabel(asset)}
            </Badge>
            {asset.narrative?.easterEgg && (
              <span title={asset.narrative.easterEgg} className="flex items-center gap-0.5 rounded-full bg-amber-400/90 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-black">
                <Sparkles className="h-2.5 w-2.5" /> Egg
              </span>
            )}
          </div>
          {/* play / pdf affordance */}
          {asset.format !== "static" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-transform group-hover:scale-110">
                {asset.format === "video" ? <Play className="h-5 w-5 translate-x-0.5" /> : <FileText className="h-5 w-5" />}
              </span>
            </div>
          )}
        </div>
      </button>
      <CardContent className="space-y-1.5 p-2.5">
        <div className="flex items-start justify-between gap-1">
          <p className="line-clamp-1 text-xs font-semibold leading-tight">{asset.resolvedTitle}</p>
          {role && <Badge variant={role.variant} className="shrink-0 px-1.5 py-0 text-[9px] uppercase">{role.label}</Badge>}
        </div>
        {asset.narrative?.hook && <p className="line-clamp-2 text-[11px] leading-snug text-muted-foreground">{asset.narrative.hook}</p>}
        <div className="flex items-center gap-1 pt-0.5">
          <Button size="sm" variant="secondary" className="h-7 flex-1 gap-1 px-2 text-[11px]" onClick={() => onOpen(asset)}>
            {asset.format === "video" ? <Play className="h-3 w-3" /> : asset.format === "pdf" ? <FileText className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
            {asset.format === "video" ? "Play" : asset.format === "pdf" ? "Open" : "View"}
          </Button>
          <Button size="sm" variant="ghost" className="h-7 gap-1 px-2 text-[11px]" asChild>
            <a href={asset.file} download><Download className="h-3 w-3" /></a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/* ───────────────────────── Lightbox ───────────────────────── */
function Lightbox({ asset, campaign, onClose, onSchedule }: { asset: MarketingAsset | null; campaign?: CampaignWithAssets; onClose: () => void; onSchedule: (a: MarketingAsset) => void }) {
  return (
    <Dialog open={!!asset} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[92vh] max-w-4xl overflow-y-auto p-0">
        {asset && (
          <div className="grid gap-0 md:grid-cols-[1fr_300px]">
            <div className="flex items-center justify-center bg-black/40 p-3">
              {asset.format === "video" ? (
                <video src={asset.file} poster={asset.poster} controls playsInline className={cn("max-h-[80vh] w-auto rounded-lg", aspectClass(asset))} />
              ) : asset.format === "pdf" ? (
                <iframe src={asset.file} title={asset.resolvedTitle} className="h-[80vh] w-full rounded-lg bg-white" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element -- local optimized preview
                <img src={asset.file} alt={asset.resolvedTitle} className="max-h-[80vh] w-auto rounded-lg object-contain" />
              )}
            </div>
            <div className="space-y-3 p-5">
              <div className="flex items-center gap-2">
                <span className={cn("h-2.5 w-2.5 rounded-full bg-gradient-to-br", campaign?.brand)} />
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{campaign?.name}</span>
              </div>
              <DialogTitle className="text-base leading-tight">{asset.resolvedTitle}</DialogTitle>
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="outline" className="capitalize">{asset.resolvedChannel}</Badge>
                <Badge variant="outline">{FORMAT_META[asset.format].label}</Badge>
                <Badge variant="outline">{ratioLabel(asset)}</Badge>
                {asset.pages ? <Badge variant="outline">{asset.pages} pages</Badge> : null}
              </div>
              {asset.narrative?.hook && (
                <div className="rounded-lg border border-border/60 bg-muted/30 p-3 text-sm">
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Hook</p>
                  {asset.narrative.hook}
                </div>
              )}
              {asset.narrative?.easterEgg && (
                <div className="rounded-lg border border-amber-400/40 bg-amber-400/10 p-3 text-sm">
                  <p className="mb-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-amber-600 dark:text-amber-400">
                    <Sparkles className="h-3 w-3" /> Easter egg / eye for it
                  </p>
                  {asset.narrative.easterEgg}
                </div>
              )}
              <div className="flex flex-col gap-2 pt-1">
                <Button onClick={() => onSchedule(asset)} className="gap-1.5">
                  <Send className="h-4 w-4" /> Schedule to Meta
                </Button>
                <Button asChild variant="secondary" className="gap-1.5">
                  <a href={asset.file} download><Download className="h-4 w-4" /> Download original</a>
                </Button>
                <Button asChild variant="outline" className="gap-1.5">
                  <a href={asset.file} target="_blank" rel="noreferrer"><ExternalLink className="h-4 w-4" /> Open in new tab</a>
                </Button>
              </div>
              <p className="truncate pt-1 text-[10px] text-muted-foreground" title={asset.src}>src: {asset.src}</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ───────────────────────── Small UI bits ───────────────────────── */
function CampaignChip({ active, onClick, label, count, gradient, sub, logo }: { active: boolean; onClick: () => void; label: string; count: number; gradient: string; sub?: string; logo?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-xl border p-3 text-left transition-all",
        active ? "border-primary/50 ring-1 ring-inset ring-primary/40" : "border-border/60 hover:border-border",
      )}
    >
      <span className={cn("absolute inset-x-0 top-0 h-1 bg-gradient-to-r", gradient)} />
      <div className="flex items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-2">
          {logo ? <BrandLogo src={logo} name={label} className="h-5 w-5" fallbackClassName={gradient} /> : null}
          <span className="line-clamp-1 text-sm font-semibold">{label}</span>
        </span>
        <Badge variant="secondary" className="shrink-0 rounded-full">{count}</Badge>
      </div>
      {sub && <span className="mt-0.5 line-clamp-1 block text-[11px] text-muted-foreground">{sub}</span>}
    </button>
  );
}

function SegToggle<T extends string>({ options, value, onChange }: { options: { id: T; label: string; icon: typeof LayoutGrid }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="inline-flex rounded-lg border border-border/60 bg-muted/30 p-0.5">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            value === o.id ? "bg-card text-foreground shadow-sm ring-1 ring-inset ring-border/60" : "text-muted-foreground hover:text-foreground",
          )}
        >
          <o.icon className="h-3.5 w-3.5" /> {o.label}
        </button>
      ))}
    </div>
  );
}

function FilterRow({ label, icon: Icon, children }: { label: string; icon?: typeof Filter; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/70">
        {Icon && <Icon className="h-3 w-3" />} {label}
      </span>
      {children}
    </div>
  );
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
        active ? "border-primary/40 bg-primary/15 text-primary" : "border-border/60 text-muted-foreground hover:bg-muted/40 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

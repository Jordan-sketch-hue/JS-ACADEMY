"use client";

import { useMemo, useState, useTransition } from "react";
import {
  MessageSquare,
  Check,
  X,
  ExternalLink,
  Globe,
  Filter,
  Trash2,
  RotateCcw,
  Smartphone,
  Monitor,
  Tablet as TabletIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { setLyraNoteStatus, deleteLyraNote } from "@/actions/lyra-notes";
import type { LyraNote, LyraNoteStatus, LyraNoteSummary } from "@/lib/data/lyra-notes";

const STATUS_VARIANT: Record<LyraNoteStatus, "secondary" | "success" | "outline"> = {
  open: "secondary",
  resolved: "success",
  dismissed: "outline",
};

function detectDevice(ua: string | null): { label: string; icon: typeof Monitor } {
  if (!ua) return { label: "—", icon: Monitor };
  if (/iPad|Tablet/i.test(ua)) return { label: "Tablet", icon: TabletIcon };
  if (/iPhone|Android|Mobile/i.test(ua)) return { label: "Phone",  icon: Smartphone };
  return { label: "Desktop", icon: Monitor };
}

function siteUrl(site: string): string {
  if (site.includes("mockup")) return "https://language-cradle-mockup.vercel.app";
  if (site === "language-cradle") return "https://language-cradle.vercel.app";
  if (site.startsWith("http")) return site;
  return `https://${site}`;
}

function relTime(iso: string): string {
  const ts = new Date(iso).getTime();
  const diff = Date.now() - ts;
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  if (diff < 7 * 86_400_000) return `${Math.floor(diff / 86_400_000)}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function LyraFeedbackClient({ summary }: { summary: LyraNoteSummary }) {
  const { notes, totals, sites, sessionsCount } = summary;
  const [pending, startTransition] = useTransition();

  const [filterSite, setFilterSite]     = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<LyraNoteStatus | "all">("open");
  const [searchQ, setSearchQ]           = useState<string>("");

  const filtered = useMemo(() => {
    return notes.filter((n: LyraNote) => {
      if (filterSite   !== "all" && n.source_site !== filterSite) return false;
      if (filterStatus !== "all" && n.status !== filterStatus)    return false;
      if (searchQ) {
        const q = searchQ.toLowerCase();
        if (!n.prompt.toLowerCase().includes(q) && !(n.page_path ?? "").toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [notes, filterSite, filterStatus, searchQ]);

  const onStatus = (id: string, status: LyraNoteStatus) => {
    startTransition(async () => { await setLyraNoteStatus(id, status); });
  };
  const onDelete = (id: string) => {
    if (!window.confirm("Delete this annotation?")) return;
    startTransition(async () => { await deleteLyraNote(id); });
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Client feedback</p>
          <h1 className="font-jarvis text-3xl font-semibold tracking-tight">
            Lyra annotations from your client mockups.
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Every time a visitor circles an area on a deployed mockup site and tells Lyra what to change,
            it lands here. Mark as resolved when you ship the fix.
          </p>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Open notes"      value={totals.open}     accent="text-amber-400"   icon={MessageSquare} highlight={totals.open > 0} sub={totals.open === 1 ? "needs attention" : "need attention"} />
        <Kpi label="Resolved"        value={totals.resolved} accent="text-emerald-400" icon={Check}         sub="all-time" />
        <Kpi label="Dismissed"       value={totals.dismissed} accent="text-rose-400"   icon={X}             sub="not actionable" />
        <Kpi label="Unique sessions" value={sessionsCount}    accent="text-sky-400"    icon={Globe}         sub={`${sites.length} site${sites.length === 1 ? "" : "s"}`} />
      </div>

      {/* Site breakdown */}
      {sites.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">By site</CardTitle>
            <CardDescription>Click a site to filter the list below.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterSite("all")}
                className={cn(
                  "rounded-md border px-3 py-1.5 text-xs transition",
                  filterSite === "all" ? "border-foreground bg-foreground text-background" : "border-border/60 hover:border-foreground"
                )}
              >
                All sites · {totals.all}
              </button>
              {sites.map((s) => (
                <button
                  key={s.site}
                  onClick={() => setFilterSite(s.site)}
                  className={cn(
                    "rounded-md border px-3 py-1.5 text-xs transition flex items-center gap-2",
                    filterSite === s.site ? "border-foreground bg-foreground text-background" : "border-border/60 hover:border-foreground"
                  )}
                >
                  <span>{s.site}</span>
                  <span className="text-muted-foreground">·</span>
                  <span>{s.count}</span>
                  {s.open > 0 && filterSite !== s.site && (
                    <Badge variant="secondary" className="ml-1 h-4 px-1 text-[10px]">{s.open} open</Badge>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes table */}
      <Card>
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base">Annotations</CardTitle>
              <CardDescription>{filtered.length} of {totals.all} · filtered live</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              <Input placeholder="Search prompt or path…" value={searchQ} onChange={(e) => setSearchQ(e.target.value)} className="h-9 w-56" />
              <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as LyraNoteStatus | "all")}>
                <SelectTrigger className="h-9 w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="dismissed">Dismissed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="rounded-md border border-dashed border-border/60 p-6 text-center">
              <MessageSquare className="mx-auto h-6 w-6 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                {totals.all === 0
                  ? "No annotations have arrived yet. Draw a circle on the mockup with Lyra to test the pipeline."
                  : "Nothing matches the current filters."}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>When</TableHead>
                  <TableHead>Site / page</TableHead>
                  <TableHead>Prompt</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((n) => {
                  const device = detectDevice(n.user_agent);
                  const DeviceIcon = device.icon;
                  const fullUrl = `${siteUrl(n.source_site)}${n.page_path ?? ""}`;
                  return (
                    <TableRow key={n.id}>
                      <TableCell>
                        <div className="text-sm">{relTime(n.created_at)}</div>
                        <div className="text-[10px] text-muted-foreground font-mono">{new Date(n.created_at).toLocaleString()}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs font-medium">{n.source_site}</div>
                        {n.page_path ? (
                          <Link href={fullUrl} target="_blank" className="text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mt-0.5">
                            {n.page_path}
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        ) : null}
                        {n.session_id ? (
                          <div className="text-[10px] text-muted-foreground mt-0.5">session · {n.session_id.slice(0, 10)}…</div>
                        ) : null}
                      </TableCell>
                      <TableCell className="max-w-md">
                        <p className="text-sm leading-snug">&ldquo;{n.prompt}&rdquo;</p>
                        {n.client_note_id ? <p className="mt-1 text-[10px] text-muted-foreground">visitor note #{n.client_note_id}</p> : null}
                      </TableCell>
                      <TableCell>
                        <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                          <DeviceIcon className="h-3.5 w-3.5" />
                          {device.label}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={STATUS_VARIANT[n.status]}>{n.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {n.status === "open" ? (
                            <>
                              <Button size="sm" variant="ghost" onClick={() => onStatus(n.id, "resolved")} disabled={pending} className="h-8 text-xs">
                                <Check className="mr-1 h-3.5 w-3.5" />Resolve
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => onStatus(n.id, "dismissed")} disabled={pending} className="h-8 text-xs text-muted-foreground">
                                <X className="mr-1 h-3.5 w-3.5" />Dismiss
                              </Button>
                            </>
                          ) : (
                            <Button size="sm" variant="ghost" onClick={() => onStatus(n.id, "open")} disabled={pending} className="h-8 text-xs">
                              <RotateCcw className="mr-1 h-3.5 w-3.5" />Reopen
                            </Button>
                          )}
                          <Button size="icon" variant="ghost" onClick={() => onDelete(n.id)} disabled={pending} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Kpi({
  label, value, sub, icon: Icon, accent, highlight,
}: { label: string; value: number; sub?: string; icon: typeof MessageSquare; accent?: string; highlight?: boolean }) {
  return (
    <Card className={cn(highlight && "border-amber-500/40 bg-amber-500/[0.04]")}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{label}</p>
          <Icon className={cn("h-4 w-4", accent)} />
        </div>
        <p className="mt-2 text-2xl font-semibold tabular-nums">{value}</p>
        {sub ? <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p> : null}
      </CardContent>
    </Card>
  );
}

"use client";

import { useState, useMemo } from "react";
import { SOPS, SOP_CATEGORIES, type Sop } from "@/lib/data/sops-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  ClipboardCheck,
  Code2,
  ExternalLink,
  Filter,
  Lightbulb,
  Search,
  Terminal,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

function SopCard({ sop, done, onToggle }: { sop: Sop; done: boolean; onToggle: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <Card className={cn("transition-all", done && "opacity-60")}>
      <CardHeader
        className="cursor-pointer select-none pb-2"
        onClick={() => setOpen((p) => !p)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              className="mt-0.5 shrink-0 text-muted-foreground transition-colors hover:text-primary"
              aria-label="Mark done"
            >
              {done ? (
                <CheckCircle2 className="h-4 w-4 text-primary" />
              ) : (
                <Circle className="h-4 w-4" />
              )}
            </button>
            <div className="min-w-0">
              <CardTitle className="text-sm font-semibold">{sop.title}</CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">{sop.summary}</p>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {sop.tags.map((t) => (
                  <Badge key={t} variant="outline" className="h-4 px-1 text-[10px]">
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          {open ? (
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          )}
        </div>
      </CardHeader>

      {open && (
        <CardContent className="pt-0">
          <div className="ml-7 space-y-2 border-t border-border/50 pt-3">
            {sop.steps.map((step, i) => (
              <div key={i} className="flex gap-2.5 text-sm">
                <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-primary/10 text-center text-[10px] font-bold leading-5 text-primary">
                  {i + 1}
                </span>
                <div className="min-w-0 space-y-1">
                  <p className="text-foreground/90">{step.text}</p>
                  {step.cmd && (
                    <code className="flex items-center gap-1.5 rounded-md border border-border/60 bg-muted/40 px-2.5 py-1.5 font-mono text-[11px] text-primary">
                      <Terminal className="h-3 w-3 shrink-0 opacity-60" />
                      {step.cmd}
                    </code>
                  )}
                  {step.note && (
                    <p className="flex items-start gap-1.5 rounded-md border border-amber-500/25 bg-amber-500/[0.07] px-2.5 py-1.5 text-xs text-amber-300">
                      <Lightbulb className="mt-0.5 h-3 w-3 shrink-0" />
                      {step.note}
                    </p>
                  )}
                  {step.link && (
                    <a
                      href={step.link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary underline"
                    >
                      {step.link.label}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}

            {sop.links && sop.links.length > 0 && (
              <div className="border-t border-border/50 pt-3">
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  References
                </p>
                <div className="flex flex-wrap gap-2">
                  {sop.links.map((l) => (
                    <a
                      key={l.url}
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                    >
                      {l.label}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            <p className="text-right text-[10px] text-muted-foreground/40">
              Updated {sop.updated}
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export function SopsClient() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [done, setDone] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return SOPS.filter((s) => {
      if (activeCategory && s.category !== activeCategory) return false;
      if (!q) return true;
      return (
        s.title.toLowerCase().includes(q) ||
        s.summary.toLowerCase().includes(q) ||
        s.tags.some((t) => t.includes(q)) ||
        s.category.toLowerCase().includes(q)
      );
    });
  }, [search, activeCategory]);

  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = {};
    SOPS.forEach((s) => {
      map[s.category] = (map[s.category] ?? 0) + 1;
    });
    return map;
  }, []);

  const toggleDone = (id: string) =>
    setDone((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <div className="flex gap-6 pb-12">
      {/* Sidebar */}
      <aside className="hidden w-52 shrink-0 lg:block">
        <div className="sticky top-20 space-y-1">
          <p className="px-2 pb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground/60">
            Categories
          </p>
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            className={cn(
              "flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-sm transition-colors",
              activeCategory === null
                ? "bg-primary/15 font-medium text-primary"
                : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
            )}
          >
            <span>All</span>
            <Badge variant="secondary" className="text-[10px]">
              {SOPS.length}
            </Badge>
          </button>
          {SOP_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
              className={cn(
                "flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-sm transition-colors",
                activeCategory === cat
                  ? "bg-primary/15 font-medium text-primary"
                  : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
              )}
            >
              <span className="text-left">{cat}</span>
              <Badge variant="secondary" className="shrink-0 text-[10px]">
                {categoryCounts[cat] ?? 0}
              </Badge>
            </button>
          ))}

          {done.size > 0 && (
            <div className="mt-4 rounded-lg border border-primary/25 bg-primary/[0.06] px-2.5 py-2">
              <p className="text-xs font-medium text-primary">
                {done.size} marked done
              </p>
              <button
                type="button"
                onClick={() => setDone(new Set())}
                className="mt-1 text-[10px] text-muted-foreground underline hover:text-foreground"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="min-w-0 flex-1 space-y-4">
        {/* Search + filter bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search SOPs…"
              className="pl-9"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {activeCategory && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveCategory(null)}
              className="gap-1.5"
            >
              <Filter className="h-3.5 w-3.5" />
              {activeCategory}
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Mobile category chips */}
        <div className="flex flex-wrap gap-1.5 lg:hidden">
          {SOP_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
              className={cn(
                "rounded-full border px-2.5 py-0.5 text-xs transition-colors",
                activeCategory === cat
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border text-muted-foreground",
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-xs text-muted-foreground">
          {filtered.length} procedure{filtered.length !== 1 ? "s" : ""}
          {activeCategory ? ` in ${activeCategory}` : ""}
          {search ? ` matching "${search}"` : ""}
        </p>

        {/* SOP list */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
            <ClipboardCheck className="h-10 w-10 opacity-30" />
            <p className="text-sm">No SOPs match your search.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((sop) => (
              <SopCard
                key={sop.id}
                sop={sop}
                done={done.has(sop.id)}
                onToggle={() => toggleDone(sop.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

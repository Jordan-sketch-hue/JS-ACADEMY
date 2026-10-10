"use client";

import { useState, useMemo, useCallback } from "react";
import {
  SCRIPTS,
  SCRIPT_CATEGORIES,
  SCRIPTS_UPDATED,
  type Script,
} from "@/lib/data/scripts-data";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Check,
  Copy,
  Filter,
  Lightbulb,
  MessageSquare,
  Search,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

/** A copyable block: the script text + a one-tap Copy button. */
function CopyBlock({
  text,
  copyKey,
  copiedKey,
  onCopy,
  label,
}: {
  text: string;
  copyKey: string;
  copiedKey: string | null;
  onCopy: (key: string, text: string) => void;
  label?: string;
}) {
  const copied = copiedKey === copyKey;
  return (
    <div className="rounded-lg border border-border/60 bg-muted/30">
      <div className="flex items-center justify-between gap-2 border-b border-border/50 px-3 py-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
          {label ?? "Script"}
        </span>
        <Button
          variant={copied ? "secondary" : "ghost"}
          size="sm"
          className="h-6 gap-1.5 px-2 text-xs"
          onClick={() => onCopy(copyKey, text)}
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-primary" /> Copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" /> Copy
            </>
          )}
        </Button>
      </div>
      <p className="whitespace-pre-line px-3 py-2.5 text-sm leading-relaxed text-foreground/90">
        {text}
      </p>
    </div>
  );
}

function ScriptCard({
  script,
  copiedKey,
  onCopy,
}: {
  script: Script;
  copiedKey: string | null;
  onCopy: (key: string, text: string) => void;
}) {
  return (
    <Card className="transition-all">
      <CardHeader className="space-y-1.5 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="h-5 gap-1 px-2 text-[10px]">
            <MessageSquare className="h-3 w-3" />
            {script.channel}
          </Badge>
          <span className="text-sm font-semibold text-foreground">{script.title}</span>
        </div>
        <p className="text-xs text-muted-foreground">{script.when}</p>
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        <CopyBlock
          text={script.body}
          copyKey={script.id}
          copiedKey={copiedKey}
          onCopy={onCopy}
        />

        {script.variants && script.variants.length > 0 && (
          <div className="space-y-2">
            {script.variants.map((v) => (
              <CopyBlock
                key={v.label}
                label={v.label}
                text={v.text}
                copyKey={`${script.id}:${v.label}`}
                copiedKey={copiedKey}
                onCopy={onCopy}
              />
            ))}
          </div>
        )}

        {script.tip && (
          <p className="flex items-start gap-1.5 rounded-md border border-amber-500/25 bg-amber-500/[0.07] px-2.5 py-1.5 text-xs text-amber-300">
            <Lightbulb className="mt-0.5 h-3 w-3 shrink-0" />
            {script.tip}
          </p>
        )}

        <div className="flex flex-wrap gap-1">
          {script.tags.map((t) => (
            <Badge key={t} variant="outline" className="h-4 px-1 text-[10px]">
              {t}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function ScriptsClient() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = useCallback(async (key: string, text: string) => {
    let ok = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        ok = true;
      } else {
        // Fallback for insecure origins (IP/preview URLs) and older browsers,
        // where navigator.clipboard is undefined.
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        ok = document.execCommand("copy");
        document.body.removeChild(ta);
      }
    } catch {
      ok = false;
    }
    if (!ok) return; // never show a false "Copied" state
    setCopiedKey(key);
    window.setTimeout(() => {
      setCopiedKey((cur) => (cur === key ? null : cur));
    }, 1600);
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return SCRIPTS.filter((s) => {
      if (activeCategory && s.category !== activeCategory) return false;
      if (!q) return true;
      return (
        s.title.toLowerCase().includes(q) ||
        s.when.toLowerCase().includes(q) ||
        s.body.toLowerCase().includes(q) ||
        s.channel.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q)) ||
        (s.tip?.toLowerCase().includes(q) ?? false) ||
        (s.variants?.some(
          (v) => v.text.toLowerCase().includes(q) || v.label.toLowerCase().includes(q),
        ) ?? false)
      );
    });
  }, [search, activeCategory]);

  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = {};
    SCRIPTS.forEach((s) => {
      map[s.category] = (map[s.category] ?? 0) + 1;
    });
    return map;
  }, []);

  return (
    <div className="flex gap-6 pb-12">
      {/* Category sidebar */}
      <aside className="hidden w-56 shrink-0 lg:block">
        <div className="sticky top-20 space-y-1">
          <p className="px-2 pb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground/60">
            Funnel stage
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
            <span>All scripts</span>
            <Badge variant="secondary" className="text-[10px]">
              {SCRIPTS.length}
            </Badge>
          </button>
          {SCRIPT_CATEGORIES.map((cat) => (
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
          <p className="px-2 pt-3 text-[10px] text-muted-foreground/40">
            Updated {SCRIPTS_UPDATED}
          </p>
        </div>
      </aside>

      {/* Main */}
      <div className="min-w-0 flex-1 space-y-4">
        {/* Search + filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search scripts… (try 'mockup', 'price', 'objection')"
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
          {SCRIPT_CATEGORIES.map((cat) => (
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

        {/* Count */}
        <p className="text-xs text-muted-foreground">
          {filtered.length} script{filtered.length !== 1 ? "s" : ""}
          {activeCategory ? ` in ${activeCategory}` : ""}
          {search ? ` matching "${search}"` : ""}
        </p>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
            <MessageSquare className="h-10 w-10 opacity-30" />
            <p className="text-sm">No scripts match your search.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((script) => (
              <ScriptCard
                key={script.id}
                script={script}
                copiedKey={copiedKey}
                onCopy={handleCopy}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

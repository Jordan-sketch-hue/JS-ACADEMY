"use client";

import { useMemo, useState, useTransition } from "react";
import { Ban, Plus, Search, Trash2, Users, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { REGION_LABEL, type Region, type SalesProspect, type SalesSuppression } from "@/lib/sales/types";
import {
  addProspectsAction,
  deleteProspectAction,
  disqualifyProspectAction,
  removeSuppressionAction,
  suppressProspectAction,
} from "@/app/(app)/sales/actions";

const STATUS_TONE: Record<string, string> = {
  new: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  contacted: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  replied: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  converted: "bg-emerald-600/20 text-emerald-700 dark:text-emerald-300",
  bounced: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  unsubscribed: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  suppressed: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  disqualified: "bg-muted text-muted-foreground",
};

export function ProspectsClient({
  prospects,
  suppressions,
}: {
  prospects: SalesProspect[];
  suppressions: SalesSuppression[];
}) {
  const [pending, start] = useTransition();
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState<Region | "all">("all");
  const [showAdd, setShowAdd] = useState(false);
  const [raw, setRaw] = useState("");
  const [note, setNote] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return prospects.filter(
      (p) =>
        (region === "all" || p.region === region) &&
        (!q || p.company.toLowerCase().includes(q) || p.email.toLowerCase().includes(q)),
    );
  }, [prospects, search, region]);

  function add() {
    start(async () => {
      const r = await addProspectsAction(raw);
      setNote(r.ok ? `Added ${r.added}, skipped ${r.skipped} (dupes/suppressed).` : r.error);
      if (r.ok) {
        setRaw("");
        setShowAdd(false);
      }
    });
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <Users className="h-6 w-6" /> Prospects
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            The targeted cold-email sheet — auto-sourced + imported. {prospects.length} total.
          </p>
        </div>
        <Button onClick={() => setShowAdd((v) => !v)} variant={showAdd ? "secondary" : "default"}>
          <Plus className="mr-1.5 h-4 w-4" /> Add prospects
        </Button>
      </div>

      {showAdd && (
        <Card className="space-y-2 p-4">
          <p className="text-sm text-muted-foreground">
            One per line: <code>email, company, contact name, region, country, industry, focus</code>.
            Region ∈ local·caribbean·europe·americas. Focus ∈ tech·marketing·both. Duplicates &
            suppressed addresses are skipped automatically.
          </p>
          <Textarea
            rows={6}
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            placeholder={"jane@acme.com, Acme Ltd, Jane Doe, americas, USA, retail, both\ninfo@shop.co.uk, Shop UK, , europe, UK, ecommerce, marketing"}
            className="font-mono text-xs"
          />
          <div className="flex gap-2">
            <Button onClick={add} disabled={pending || !raw.trim()}>
              {pending ? "Adding…" : "Import"}
            </Button>
            {note && <span className="self-center text-sm text-muted-foreground">{note}</span>}
          </div>
        </Card>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company or email"
            className="w-64 pl-8"
          />
        </div>
        <div className="flex gap-1">
          {(["all", "local", "caribbean", "europe", "americas"] as const).map((r) => (
            <Button
              key={r}
              size="sm"
              variant={region === r ? "default" : "outline"}
              onClick={() => setRegion(r)}
            >
              {r === "all" ? "All" : REGION_LABEL[r as Region].split(" ")[0]}
            </Button>
          ))}
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-3 py-2">Company</th>
                <th className="px-3 py-2">Contact</th>
                <th className="px-3 py-2">Region</th>
                <th className="px-3 py-2">Score</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-10 text-center text-muted-foreground">
                    No prospects yet. They appear automatically once Hunter sourcing runs, or add
                    your own above.
                  </td>
                </tr>
              )}
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-border/60 last:border-0">
                  <td className="px-3 py-2">
                    <div className="font-medium">{p.company}</div>
                    <div className="text-xs text-muted-foreground">{p.email}</div>
                  </td>
                  <td className="px-3 py-2">
                    <div>{p.contact_name || "—"}</div>
                    <div className="text-xs text-muted-foreground">{p.title || ""}</div>
                  </td>
                  <td className="px-3 py-2">{REGION_LABEL[p.region]?.split(" ")[0] ?? p.region}</td>
                  <td className="px-3 py-2">{p.score}</td>
                  <td className="px-3 py-2">
                    <span className={`rounded px-2 py-0.5 text-xs ${STATUS_TONE[p.status] ?? "bg-muted"}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        title="Disqualify"
                        onClick={() => start(() => disqualifyProspectAction(p.id).then(() => {}))}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        title="Suppress (never email)"
                        onClick={() => start(() => suppressProspectAction(p.email).then(() => {}))}
                      >
                        <Ban className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        title="Delete"
                        onClick={() => start(() => deleteProspectAction(p.id).then(() => {}))}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {suppressions.length > 0 && (
        <Card className="p-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground/70">
            Suppression list ({suppressions.length}) — never contacted
          </h2>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {suppressions.map((s) => (
              <Badge key={s.id} variant="outline" className="gap-1">
                {s.email}
                <span className="text-muted-foreground/60">· {s.reason}</span>
                <button
                  className="ml-1 text-muted-foreground hover:text-rose-500"
                  title="Remove from suppression"
                  onClick={() => start(() => removeSuppressionAction(s.email).then(() => {}))}
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

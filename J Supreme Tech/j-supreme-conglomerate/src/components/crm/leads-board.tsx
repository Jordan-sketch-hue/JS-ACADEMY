"use client";

import { useMemo, useState } from "react";
import type { LeadStage } from "@/lib/data/seed";
import type { CrmClientRecord, CrmLeadRecord } from "@/lib/data/crm-records";
import { leadToCard } from "@/lib/data/crm-records";
import { ClientLinkChips } from "@/components/crm/client-link-chips";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { CountSummary } from "@/components/shared/count-summary";
import { summarizeLeadsByStage } from "@/lib/data/workspace-counts";
import { cn } from "@/lib/utils";

const stages: LeadStage[] = [
  "cold",
  "warm",
  "negotiation",
  "closed",
  "lost",
];

type Props = {
  leads: CrmLeadRecord[];
  clientsById: Map<string, CrmClientRecord>;
  onStageChange: (leadId: string, stage: LeadStage) => void | Promise<void>;
};

export function LeadsBoard({ leads, clientsById, onStageChange }: Props) {
  const [query, setQuery] = useState("");
  const [dragId, setDragId] = useState<string | null>(null);

  const cards = useMemo(() => leads.map(leadToCard), [leads]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return cards.filter(
      (l) =>
        !q ||
        l.company.toLowerCase().includes(q) ||
        l.contact.toLowerCase().includes(q) ||
        l.tags.some((t) => t.toLowerCase().includes(q)) ||
        (l.lastFollowUpLabel?.toLowerCase().includes(q) ?? false) ||
        (l.nextFollowUpLabel?.toLowerCase().includes(q) ?? false),
    );
  }, [cards, query]);

  const grouped = useMemo(() => {
    const g: Record<LeadStage, typeof cards> = {
      cold: [],
      warm: [],
      negotiation: [],
      closed: [],
      lost: [],
    };
    for (const l of filtered) g[l.stage].push(l);
    return g;
  }, [filtered]);

  const leadCounts = useMemo(() => summarizeLeadsByStage(leads), [leads]);
  const filteredCounts = useMemo(() => summarizeLeadsByStage(filtered), [filtered]);

  const move = (id: string, stage: LeadStage) => {
    void onStageChange(id, stage);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <Input
            placeholder="Search leads, tags, contacts…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="max-w-md"
          />
          <CountSummary
            items={[
              { label: "in pipeline", value: leadCounts.inPipeline, emphasis: true },
              { label: "total leads", value: leadCounts.total },
              ...(query.trim()
                ? [{ label: "shown", value: filteredCounts.total }]
                : []),
            ]}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Drag cards between stages or use quick actions. Changes save to your database or this browser.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-5">
        {stages.map((stage) => (
          <Card
            key={stage}
            className="flex flex-col bg-card/40"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (dragId) move(dragId, stage);
              setDragId(null);
            }}
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {stage}
                <Badge variant="outline" className="font-mono text-[10px]">
                  {grouped[stage].length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-2 pt-0">
              {grouped[stage].map((lead) => (
                <div
                  key={lead.id}
                  draggable
                  onDragStart={() => setDragId(lead.id)}
                  onDragEnd={() => setDragId(null)}
                  className={cn(
                    "cursor-grab rounded-lg border border-border/70 bg-background/40 p-3 text-sm shadow-sm active:cursor-grabbing",
                    dragId === lead.id && "ring-2 ring-primary/40",
                  )}
                >
                  <p className="font-medium leading-tight">{lead.company}</p>
                  <p className="text-xs text-muted-foreground">{lead.contact}</p>
                  {(() => {
                    const cid = lead.clientId;
                    if (!cid) return null;
                    const clientRow = clientsById.get(cid);
                    const need = clientRow?.services_needed?.trim();
                    if (!need) return null;
                    return (
                      <p
                        className="mt-1.5 line-clamp-4 text-[11px] leading-snug text-foreground/85"
                        title={need}
                      >
                        {need}
                      </p>
                    );
                  })()}
                  <p className="mt-2 text-xs font-semibold text-primary">
                    {formatCurrency(lead.value)}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {lead.tags.map((t) => (
                      <Badge key={t} variant="secondary" className="text-[10px]">
                        {t}
                      </Badge>
                    ))}
                  </div>
                  {(() => {
                    const cid = lead.clientId;
                    if (!cid) return null;
                    const clientRow = clientsById.get(cid);
                    if (!clientRow) return null;
                    return (
                      <div
                        className="mt-2 border-t border-border/40 pt-2"
                        onPointerDown={(e) => e.stopPropagation()}
                      >
                        <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                          Links
                        </p>
                        <ClientLinkChips client={clientRow} compact />
                      </div>
                    );
                  })()}
                  {(lead.lastFollowUpLabel || lead.nextFollowUpLabel) && (
                    <div className="mt-2 space-y-0.5 border-t border-border/40 pt-2 text-[10px] leading-tight text-muted-foreground">
                      {lead.lastFollowUpLabel ? (
                        <p>
                          <span className="font-medium text-foreground/80">Last: </span>
                          {lead.lastFollowUpLabel}
                        </p>
                      ) : null}
                      {lead.nextFollowUpLabel ? (
                        <p className="text-amber-600/95 dark:text-amber-200/90">
                          <span className="font-medium">Next: </span>
                          {lead.nextFollowUpLabel}
                        </p>
                      ) : null}
                    </div>
                  )}
                  <div className="mt-2 flex gap-1">
                    {stages
                      .filter((s) => s !== lead.stage)
                      .slice(0, 2)
                      .map((s) => (
                        <Button
                          key={s}
                          size="sm"
                          variant="ghost"
                          className="h-7 flex-1 text-[10px]"
                          type="button"
                          onClick={() => move(lead.id, s)}
                        >
                          → {s}
                        </Button>
                      ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type TicketState = "triaged" | "awaiting_approval" | "approved" | "rejected" | "done";

interface Ticket {
  id: string;
  source: string;
  client_name: string | null;
  contact: string | null;
  channel: string | null;
  category: string;
  priority: string;
  summary: string | null;
  body_text: string | null;
  action_needed: string | null;
  draft_body: string | null;
  state: TicketState;
  gate: string;
  is_scam: boolean;
  due_at: string | null;
  last_note: string | null;
  created_at: string;
}

const PRIORITY_COLOR: Record<string, string> = {
  high: "bg-red-500/15 text-red-600 border-red-500/30",
  normal: "bg-zinc-500/15 text-zinc-500 border-zinc-500/30",
};

const STATE_COLOR: Record<string, string> = {
  triaged: "bg-yellow-500/15 text-yellow-600 border-yellow-500/30",
  awaiting_approval: "bg-blue-500/15 text-blue-600 border-blue-500/30",
  approved: "bg-green-500/15 text-green-600 border-green-500/30",
};

const CHANNEL_ICON: Record<string, string> = {
  instagram: "IG",
  whatsapp: "WA",
  email: "EM",
  facebook: "FB",
};

function timeLeft(due: string | null): { label: string; urgent: boolean } {
  if (!due) return { label: "—", urgent: false };
  const diff = Date.parse(due) - Date.now();
  if (diff <= 0) return { label: "Overdue", urgent: true };
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return { label: `${Math.ceil(diff / 60_000)}m`, urgent: true };
  if (h < 24) return { label: `${h}h`, urgent: h < 2 };
  return { label: `${Math.floor(h / 24)}d`, urgent: false };
}

export function OpsBoard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [actioning, setActioning] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/ops/tickets");
      const json = await res.json();
      setTickets(json.tickets ?? []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function act(ticketId: string, action: "approve" | "reject") {
    setActioning(ticketId + action);
    try {
      await fetch(`/api/ops/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId, action }),
      });
      await load();
    } finally {
      setActioning(null);
    }
  }

  const open = tickets.filter((t) => t.state === "triaged" || t.state === "awaiting_approval");
  const done = tickets.filter((t) => t.state === "approved");

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Ops Board</h2>
          <p className="text-sm text-muted-foreground">
            {open.length} open · {done.length} approved
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={load}>Refresh</Button>
      </div>

      {loading && (
        <p className="text-sm text-muted-foreground">Loading tickets…</p>
      )}

      {!loading && open.length === 0 && (
        <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          No open tickets.
        </div>
      )}

      <div className="space-y-3">
        {open.map((t) => {
          const { label: tl, urgent } = timeLeft(t.due_at);
          const isExpanded = expanded === t.id;
          const busy = actioning?.startsWith(t.id);

          return (
            <Card
              key={t.id}
              className={`cursor-pointer transition-shadow hover:shadow-md ${t.priority === "high" ? "border-red-500/40" : ""}`}
              onClick={() => setExpanded(isExpanded ? null : t.id)}
            >
              <CardHeader className="pb-2 pt-4 px-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm truncate">
                        {t.client_name ?? t.contact ?? "Unknown"}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono bg-muted px-1.5 rounded">
                        {CHANNEL_ICON[t.channel ?? ""] ?? t.channel?.toUpperCase() ?? "?"}
                      </span>
                      <Badge variant="outline" className={`text-[11px] ${PRIORITY_COLOR[t.priority] ?? ""}`}>
                        {t.priority}
                      </Badge>
                      <Badge variant="outline" className={`text-[11px] ${STATE_COLOR[t.state] ?? ""}`}>
                        {t.state}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {t.summary ?? t.body_text?.slice(0, 120)}
                    </p>
                  </div>
                  <span className={`text-xs font-mono shrink-0 mt-0.5 ${urgent ? "text-red-500 font-semibold" : "text-muted-foreground"}`}>
                    {tl}
                  </span>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="px-4 pb-4 space-y-3" onClick={(e) => e.stopPropagation()}>
                  {t.body_text && (
                    <div className="rounded-lg bg-muted p-3 text-xs font-mono whitespace-pre-wrap max-h-40 overflow-y-auto">
                      {t.body_text}
                    </div>
                  )}
                  {t.draft_body && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Draft response</p>
                      <div className="rounded-lg border bg-background p-3 text-sm whitespace-pre-wrap">
                        {t.draft_body}
                      </div>
                    </div>
                  )}
                  {t.action_needed && (
                    <p className="text-xs text-yellow-600">
                      <span className="font-semibold">Action: </span>{t.action_needed}
                    </p>
                  )}
                  {t.last_note && (
                    <p className="text-xs text-muted-foreground italic">{t.last_note}</p>
                  )}

                  {t.gate !== "blocked" && (
                    <div className="flex gap-2 pt-1">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        disabled={!!busy}
                        onClick={() => act(t.id, "approve")}
                      >
                        {actioning === t.id + "approve" ? "…" : "Approve"}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={!!busy}
                        onClick={() => act(t.id, "reject")}
                      >
                        {actioning === t.id + "reject" ? "…" : "Reject"}
                      </Button>
                    </div>
                  )}
                  {t.gate === "blocked" && (
                    <p className="text-xs text-red-500 font-medium">
                      Quarantined — handle personally.
                    </p>
                  )}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {done.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Recently approved</p>
          {done.map((t) => (
            <div key={t.id} className="flex items-center justify-between px-3 py-2 rounded-lg border text-sm">
              <span className="text-muted-foreground truncate">
                {t.client_name ?? t.contact ?? "Unknown"} — {t.summary?.slice(0, 60)}
              </span>
              <Badge variant="outline" className="text-[11px] bg-green-500/10 text-green-600 border-green-500/20 shrink-0 ml-2">
                approved
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

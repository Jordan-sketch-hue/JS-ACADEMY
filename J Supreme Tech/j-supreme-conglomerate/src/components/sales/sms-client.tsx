"use client";

import { useState } from "react";
import { MessageSquare, CheckCircle, XCircle, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { SmsLogRow } from "@/app/(app)/sales/sms/actions";

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  } catch { return iso; }
}

function SentLog({ row }: { row: SmsLogRow }) {
  return (
    <Card className="p-4 space-y-2">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <ArrowUpRight className="h-4 w-4 text-emerald-500 shrink-0" />
        <span className="font-mono font-medium">{row.to_number}</span>
        {row.ok ? (
          <Badge className="bg-emerald-600 flex items-center gap-1 text-[10px]">
            <CheckCircle className="h-3 w-3" /> Delivered
          </Badge>
        ) : (
          <Badge variant="destructive" className="flex items-center gap-1 text-[10px]">
            <XCircle className="h-3 w-3" /> Failed
          </Badge>
        )}
        <span className="ml-auto text-xs text-muted-foreground">{fmtDate(row.sent_at)}</span>
      </div>
      <p className="text-sm leading-relaxed pl-7">{row.body}</p>
      {row.error && <p className="text-xs text-red-400 pl-7">Error: {row.error}</p>}
      {row.telnyx_id && <p className="text-[10px] text-muted-foreground pl-7 font-mono">ID: {row.telnyx_id}</p>}
    </Card>
  );
}

function ReceivedLog({ row }: { row: SmsLogRow }) {
  const sentiment = row.body.includes("POSITIVE") ? "positive" : row.body.includes("NEGATIVE") ? "negative" : "neutral";
  return (
    <Card className="p-4 space-y-2">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <ArrowDownLeft className="h-4 w-4 text-blue-400 shrink-0" />
        <span className="font-mono font-medium">{row.to_number}</span>
        {sentiment === "positive" && (
          <Badge className="bg-emerald-600 text-[10px]">INTERESTED</Badge>
        )}
        {sentiment === "negative" && (
          <Badge variant="destructive" className="text-[10px]">NOT INTERESTED</Badge>
        )}
        {sentiment === "neutral" && (
          <Badge className="bg-amber-500 text-[10px]">UNCLEAR</Badge>
        )}
        <span className="ml-auto text-xs text-muted-foreground">{fmtDate(row.sent_at)}</span>
      </div>
      <p className="text-sm leading-relaxed pl-7">{row.body.replace(/^\[Blast reply\] /, "").replace(/ — (POSITIVE|NEGATIVE|NEUTRAL)$/, "")}</p>
    </Card>
  );
}

export function SmsClient({ logs }: { logs: SmsLogRow[] }) {
  const [tab, setTab] = useState<"sent" | "received">("received");

  const sent = logs.filter(r => r.source === "kai");
  const received = logs.filter(r => r.source === "blast_reply");
  const shown = tab === "sent" ? sent : received;

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-1 border-b">
        {(["received", "sent"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
              tab === t
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "received" ? "Received" : "Sent (Kai)"}
            <span className="ml-2 text-xs rounded-full bg-muted px-1.5 py-0.5">
              {t === "received" ? received.length : sent.length}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      {shown.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground text-sm">
          {tab === "sent"
            ? "No outbound Kai logs yet. Redeploy the Railway bot to enable."
            : "No replies yet. Fire the blast to start seeing responses."}
        </Card>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">{shown.length} message{shown.length !== 1 ? "s" : ""}</p>
          <div className="space-y-2">
            {shown.map((row) =>
              tab === "sent"
                ? <SentLog key={row.id} row={row} />
                : <ReceivedLog key={row.id} row={row} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
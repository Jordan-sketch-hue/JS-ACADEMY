"use client";

import { useState } from "react";
import { CheckCircle, XCircle, ChevronDown, ChevronUp, Send, Inbox } from "lucide-react";
import type { SmsLogRow } from "@/app/(app)/sales/sms/actions";

type Timeframe = "this_week" | "last_week" | "this_month" | "last_month" | "all_time";

const TIMEFRAME_OPTIONS: { key: Timeframe; label: string }[] = [
  { key: "this_week", label: "This Week" },
  { key: "last_week", label: "Last Week" },
  { key: "this_month", label: "This Month" },
  { key: "last_month", label: "Last Month" },
  { key: "all_time", label: "All Time" },
];

function filterByTimeframe(logs: SmsLogRow[], tf: Timeframe): SmsLogRow[] {
  if (tf === "all_time") return logs;
  const now = new Date();
  let start: Date, end: Date | null = null;

  if (tf === "this_week") {
    start = new Date(now);
    start.setDate(start.getDate() - start.getDay());
    start.setHours(0, 0, 0, 0);
  } else if (tf === "last_week") {
    const thisWeekStart = new Date(now);
    thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());
    thisWeekStart.setHours(0, 0, 0, 0);
    start = new Date(thisWeekStart);
    start.setDate(start.getDate() - 7);
    end = thisWeekStart;
  } else if (tf === "this_month") {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
  } else {
    start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    end = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  return logs.filter(r => {
    const d = new Date(r.sent_at);
    if (d < start) return false;
    if (end && d >= end) return false;
    return true;
  });
}

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  } catch { return iso; }
}

function fmtDateShort(iso: string) {
  try {
    const d = new Date(iso);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    if (isToday) return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  } catch { return iso; }
}

function SentRow({ row }: { row: SmsLogRow }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className={`border-b last:border-0 transition-colors ${row.ok ? "hover:bg-muted/40" : "hover:bg-red-500/5"}`}>
      <div
        className="grid items-center gap-3 px-4 py-3 cursor-pointer select-none"
        style={{ gridTemplateColumns: "1.5rem 9rem auto 1fr 7rem" }}
        onClick={() => setExpanded(v => !v)}
      >
        {/* Status dot */}
        {row.ok
          ? <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
          : <XCircle className="h-4 w-4 text-red-400 shrink-0" />
        }
        {/* Phone */}
        <span className="font-mono text-xs text-foreground/80 truncate">{row.to_number}</span>
        {/* Source chip */}
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full w-fit ${
          row.source === "kai"
            ? "bg-purple-500/15 text-purple-400"
            : "bg-blue-500/15 text-blue-400"
        }`}>
          {row.source === "kai" ? "KAI" : "BLAST"}
        </span>
        {/* Message preview */}
        <p className="text-sm text-foreground/70 truncate">{row.body}</p>
        {/* Time + expand */}
        <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
          <span>{fmtDateShort(row.sent_at)}</span>
          {expanded
            ? <ChevronUp className="h-3.5 w-3.5 opacity-50" />
            : <ChevronDown className="h-3.5 w-3.5 opacity-50" />
          }
        </div>
      </div>
      {expanded && (
        <div className="px-4 pb-3 pl-11 space-y-1.5">
          <p className="text-sm leading-relaxed text-foreground/90">{row.body}</p>
          {row.error && (
            <p className="text-xs text-red-400">Error: {row.error}</p>
          )}
          <p className="text-[10px] text-muted-foreground font-mono">{fmtDate(row.sent_at)}{row.telnyx_id ? ` · ${row.telnyx_id}` : ""}</p>
        </div>
      )}
    </div>
  );
}

function ReceivedRow({ row }: { row: SmsLogRow }) {
  const [expanded, setExpanded] = useState(false);
  const rawBody = row.body.replace(/^\[Blast reply\] /, "").replace(/ — (POSITIVE|NEGATIVE|NEUTRAL)$/, "");
  const sentiment = row.body.includes("POSITIVE") ? "positive" : row.body.includes("NEGATIVE") ? "negative" : "neutral";
  const sentimentStyle = {
    positive: "bg-emerald-500/15 text-emerald-400",
    negative: "bg-red-500/15 text-red-400",
    neutral: "bg-amber-500/15 text-amber-400",
  }[sentiment];
  const sentimentLabel = { positive: "INTERESTED", negative: "NOT INTERESTED", neutral: "UNCLEAR" }[sentiment];

  return (
    <div className="border-b last:border-0 hover:bg-muted/40 transition-colors">
      <div
        className="grid items-center gap-3 px-4 py-3 cursor-pointer select-none"
        style={{ gridTemplateColumns: "1.5rem 9rem auto 1fr 7rem" }}
        onClick={() => setExpanded(v => !v)}
      >
        {/* Inbox dot */}
        <span className="h-2 w-2 rounded-full bg-sky-400 shrink-0 mt-0.5" />
        {/* Phone */}
        <span className="font-mono text-xs text-foreground/80 truncate">{row.to_number}</span>
        {/* Sentiment chip */}
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full w-fit ${sentimentStyle}`}>
          {sentimentLabel}
        </span>
        {/* Message preview */}
        <p className="text-sm text-foreground/70 truncate">{rawBody}</p>
        {/* Time + expand */}
        <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
          <span>{fmtDateShort(row.sent_at)}</span>
          {expanded
            ? <ChevronUp className="h-3.5 w-3.5 opacity-50" />
            : <ChevronDown className="h-3.5 w-3.5 opacity-50" />
          }
        </div>
      </div>
      {expanded && (
        <div className="px-4 pb-3 pl-11">
          <p className="text-sm leading-relaxed text-foreground/90">{rawBody}</p>
          <p className="text-[10px] text-muted-foreground mt-1">{fmtDate(row.sent_at)}</p>
        </div>
      )}
    </div>
  );
}

export function SmsClient({ logs }: { logs: SmsLogRow[] }) {
  const [tab, setTab] = useState<"sent" | "received">("received");
  const [timeframe, setTimeframe] = useState<Timeframe>("this_month");

  const sent = logs.filter(r => r.source === "kai" || r.source === "blast");
  const received = logs.filter(r => r.source === "blast_reply");

  const filteredSent = tab === "sent" ? filterByTimeframe(sent, timeframe) : sent;

  const deliveredCount = filteredSent.filter(r => r.ok).length;
  const interestedCount = received.filter(r => r.body.includes("POSITIVE")).length;

  const shown = tab === "sent" ? filteredSent : received;

  return (
    <div className="space-y-4">
      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: tab === "sent" ? `Sent (${TIMEFRAME_OPTIONS.find(o => o.key === timeframe)?.label})` : "Sent Total", value: tab === "sent" ? filteredSent.length : sent.length, color: "text-foreground" },
          { label: "Delivered", value: deliveredCount, color: "text-emerald-400" },
          { label: "Interested", value: interestedCount, color: "text-sky-400" },
        ].map(s => (
          <div key={s.label} className="rounded-lg border bg-muted/30 px-4 py-3 flex flex-col gap-0.5">
            <span className={`text-xl font-bold ${s.color}`}>{s.value}</span>
            <span className="text-xs text-muted-foreground">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b">
        {([
          { key: "received", label: "Received", icon: Inbox, count: received.length },
          { key: "sent", label: "Sent", icon: Send, count: sent.length },
        ] as const).map(({ key, label, icon: Icon, count }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === key
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
            <span className="text-xs rounded-full bg-muted px-1.5 py-0.5 tabular-nums">{count}</span>
          </button>
        ))}
      </div>

      {/* Timeframe filter — only on Sent tab */}
      {tab === "sent" && (
        <div className="flex flex-wrap gap-1.5">
          {TIMEFRAME_OPTIONS.map(opt => (
            <button
              key={opt.key}
              onClick={() => setTimeframe(opt.key)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                timeframe === opt.key
                  ? "border-primary bg-primary/10 text-primary font-medium"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {/* List */}
      {shown.length === 0 ? (
        <div className="rounded-lg border py-12 text-center text-sm text-muted-foreground">
          {tab === "sent"
            ? `No messages sent ${TIMEFRAME_OPTIONS.find(o => o.key === timeframe)?.label.toLowerCase() ?? ""}.`
            : "No replies yet. Messages will appear here after the blast."}
        </div>
      ) : (
        <div className="rounded-lg border overflow-hidden divide-y-0">
          {/* Header */}
          <div
            className="grid gap-3 px-4 py-2 bg-muted/50 border-b text-[11px] font-medium uppercase tracking-wider text-muted-foreground"
            style={{ gridTemplateColumns: "1.5rem 9rem auto 1fr 7rem" }}
          >
            <span />
            <span>Number</span>
            <span>Status</span>
            <span>Message</span>
            <span className="text-right">Time</span>
          </div>
          {shown.map((row, i) =>
            tab === "sent"
              ? <SentRow key={`${row.source}-${row.id}-${i}`} row={row} />
              : <ReceivedRow key={`${row.id}-${i}`} row={row} />
          )}
        </div>
      )}
    </div>
  );
}
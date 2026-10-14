"use client";

import { useState, useTransition } from "react";
import { Phone, MessageCircle, Mail, MessageSquare, Clock, ChevronRight, Loader2, Copy, Check, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import type { CallLogRow, CallSummary } from "@/app/(app)/sales/calls/actions";
import { summarizeCall, sendFollowUpEmail } from "@/app/(app)/sales/calls/actions";

function fmtDuration(s: number) {
  if (!s) return "—";
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
}

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  } catch { return iso; }
}

const OUTCOME_COLORS: Record<string, string> = {
  answered: "bg-emerald-600",
  no_answer: "bg-amber-500",
  busy: "bg-orange-500",
  failed: "bg-red-600",
  error: "bg-red-600",
};

const SENTIMENT_COLORS: Record<string, string> = {
  positive: "text-emerald-500",
  neutral: "text-muted-foreground",
  negative: "text-red-400",
  no_answer: "text-muted-foreground",
};

function outcomeLabel(o: string) {
  return o.replace("_", " ").toUpperCase();
}

export function CallsClient({ logs }: { logs: CallLogRow[] }) {
  const [selected, setSelected] = useState<CallLogRow | null>(logs[0] ?? null);
  const [summary, setSummary] = useState<CallSummary | null>(null);
  const [loadingSummary, startSummary] = useTransition();
  const [showTranscript, setShowTranscript] = useState(false);

  // Email compose state
  const [emailMode, setEmailMode] = useState(false);
  const [toEmail, setToEmail] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [sendingEmail, startEmail] = useTransition();
  const [emailNote, setEmailNote] = useState<string | null>(null);

  // Copy state
  const [copied, setCopied] = useState(false);

  function selectCall(log: CallLogRow) {
    setSelected(log);
    setSummary(null);
    setShowTranscript(false);
    setEmailMode(false);
    setEmailNote(null);
  }

  function loadSummary() {
    if (!selected) return;
    startSummary(async () => {
      const s = await summarizeCall(selected);
      setSummary(s);
      // Pre-fill email body with follow-up draft
      const co = selected.company_name ?? "your business";
      setEmailSubject(`Following up — ${co}`);
      setEmailBody(s.follow_up_draft);
    });
  }

  function waLink() {
    if (!selected) return "#";
    const num = (selected.mockup_wa_number ?? selected.to_number ?? "").replace(/\D/g, "");
    const msg = summary?.follow_up_draft ?? `Hi, this is Alex from J Supreme Tech following up on our earlier conversation.`;
    return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
  }

  function smsLink() {
    if (!selected) return "#";
    const num = (selected.to_number ?? "").replace(/\D/g, "");
    const msg = summary?.follow_up_draft ?? `Hi, this is Alex from J Supreme Tech — following up on our call.`;
    return `sms:${num}?body=${encodeURIComponent(msg)}`;
  }

  function copyMsg() {
    const msg = summary?.follow_up_draft ?? "";
    navigator.clipboard.writeText(msg).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function sendEmail() {
    if (!selected || !toEmail) return;
    startEmail(async () => {
      const res = await sendFollowUpEmail(selected.id, toEmail, emailSubject, emailBody);
      if (res.ok) {
        setEmailNote("Email sent.");
        setEmailMode(false);
      } else {
        setEmailNote(res.error ?? "Send failed.");
      }
      setTimeout(() => setEmailNote(null), 4000);
    });
  }

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-center text-muted-foreground">
        <Phone className="h-10 w-10 opacity-30" />
        <p className="text-sm">No call logs yet. Alex will populate this once calls start.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[320px_1fr]">
      {/* Left — call list */}
      <div className="space-y-2 overflow-y-auto lg:max-h-[calc(100vh-220px)]">
        {logs.map((log) => (
          <button
            key={log.call_sid}
            onClick={() => selectCall(log)}
            className={`w-full rounded-lg border p-3 text-left transition-colors hover:bg-accent ${selected?.call_sid === log.call_sid ? "border-primary bg-accent" : "bg-card"}`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="truncate font-medium text-sm">
                {log.company_name ?? log.to_number ?? "Unknown"}
              </span>
              <Badge className={`shrink-0 text-[10px] text-white ${OUTCOME_COLORS[log.outcome] ?? "bg-muted"}`}>
                {outcomeLabel(log.outcome)}
              </Badge>
            </div>
            <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{fmtDuration(log.duration_seconds)}</span>
              {log.stage_reached && <span className="truncate">{log.stage_reached}</span>}
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">{fmtDate(log.created_at)}</p>
          </button>
        ))}
      </div>

      {/* Right — detail panel */}
      {selected && (
        <div className="space-y-4 rounded-lg border bg-card p-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">{selected.company_name ?? "Unknown Company"}</h2>
              <p className="text-sm text-muted-foreground">{selected.to_number} · {selected.industry ?? "—"}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{fmtDate(selected.created_at)}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge className={`text-white ${OUTCOME_COLORS[selected.outcome]}`}>{outcomeLabel(selected.outcome)}</Badge>
              <span className="text-xs text-muted-foreground">{fmtDuration(selected.duration_seconds)}</span>
              {selected.booked_followup && <Badge variant="outline" className="text-[10px] text-emerald-500 border-emerald-500">Follow-up booked</Badge>}
            </div>
          </div>

          {/* Stage info */}
          {selected.stage_reached && (
            <p className="text-xs text-muted-foreground">
              Stage reached: <span className="font-medium text-foreground">{selected.stage_reached}</span>
              {selected.mockup_requested && " · Mockup requested"}
            </p>
          )}

          {/* AI Summary */}
          <div className="rounded-md border bg-muted/30 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">AI Call Summary</h3>
              {!summary && (
                <Button size="sm" variant="outline" onClick={loadSummary} disabled={loadingSummary}>
                  {loadingSummary ? <Loader2 className="h-3 w-3 animate-spin" /> : "Generate"}
                </Button>
              )}
            </div>

            {loadingSummary && (
              <p className="text-xs text-muted-foreground animate-pulse">Analyzing transcript...</p>
            )}

            {summary && (
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">What they want</span>
                  <p className="mt-0.5">{summary.wants}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Pain points / objections</span>
                  <p className="mt-0.5">{summary.pain_points}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Sentiment</span>
                  <p className={`mt-0.5 font-medium capitalize ${SENTIMENT_COLORS[summary.sentiment]}`}>{summary.sentiment}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Recommended next action</span>
                  <p className="mt-0.5 font-medium">{summary.next_action}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Follow-up draft</span>
                  <p className="mt-0.5 rounded bg-muted px-3 py-2 text-xs leading-relaxed">{summary.follow_up_draft}</p>
                </div>
              </div>
            )}
          </div>

          {/* Quick follow-up actions */}
          {summary && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Quick Follow-up</h3>
              <div className="flex flex-wrap gap-2">
                <a href={waLink()} target="_blank" rel="noreferrer">
                  <Button size="sm" className="gap-2 bg-[#25d366] hover:bg-[#1da851] text-white">
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                  </Button>
                </a>
                <a href={smsLink()}>
                  <Button size="sm" variant="outline" className="gap-2">
                    <MessageSquare className="h-4 w-4" /> SMS
                  </Button>
                </a>
                <Button size="sm" variant="outline" className="gap-2" onClick={() => setEmailMode(!emailMode)}>
                  <Mail className="h-4 w-4" /> Email
                </Button>
                <Button size="sm" variant="ghost" className="gap-2" onClick={copyMsg}>
                  {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy msg"}
                </Button>
              </div>

              {/* Email compose */}
              {emailMode && (
                <div className="space-y-2 rounded-md border p-4">
                  <Input
                    placeholder="To email address"
                    value={toEmail}
                    onChange={(e) => setToEmail(e.target.value)}
                    type="email"
                  />
                  <Input
                    placeholder="Subject"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                  />
                  <Textarea
                    rows={5}
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                  />
                  <div className="flex items-center gap-3">
                    <Button size="sm" onClick={sendEmail} disabled={sendingEmail || !toEmail}>
                      {sendingEmail ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
                      Send Email
                    </Button>
                    {emailNote && <span className="text-xs text-muted-foreground">{emailNote}</span>}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Transcript toggle */}
          {selected.transcript && (
            <div>
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <FileText className="h-3.5 w-3.5" />
                {showTranscript ? "Hide transcript" : "Show full transcript"}
                <ChevronRight className={`h-3.5 w-3.5 transition-transform ${showTranscript ? "rotate-90" : ""}`} />
              </button>
              {showTranscript && (
                <pre className="mt-2 max-h-64 overflow-y-auto rounded-md bg-muted p-3 text-xs leading-relaxed whitespace-pre-wrap font-mono">
                  {selected.transcript}
                </pre>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

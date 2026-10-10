"use client";

import { useEffect, useState, useTransition } from "react";
import { Inbox, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { InboxThread } from "@/lib/sales/messages";
import { markThreadReadAction, sendReplyAction } from "@/app/(app)/sales/actions";

function fmt(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return iso;
  }
}

export function InboxClient({ threads }: { threads: InboxThread[] }) {
  const [active, setActive] = useState<InboxThread | null>(threads[0] ?? null);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [pending, start] = useTransition();
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    if (active) {
      setSubject(active.subject?.startsWith("Re:") ? active.subject : `Re: ${active.subject}`);
      if (active.unread > 0) markThreadReadAction(active.thread_id);
    }
  }, [active]);

  function send() {
    if (!active) return;
    start(async () => {
      const r = await sendReplyAction(active.counterparty, subject, body, active.prospect_id);
      if (r.ok) {
        setBody("");
        setNote("Reply sent.");
        setTimeout(() => setNote(null), 2500);
      } else {
        setNote(r.error || "Send failed.");
      }
    });
  }

  return (
    <div className="mx-auto max-w-6xl space-y-4 p-4 sm:p-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
          <Inbox className="h-6 w-6" /> Inbox
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Replies land here (and in your Gmail via BCC). Reply in-app — it sends from your outreach
          address.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-[320px_1fr]">
        {/* Thread list */}
        <Card className="max-h-[70vh] overflow-y-auto p-0">
          {threads.length === 0 && (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No conversations yet. When a prospect replies, the thread appears here.
            </div>
          )}
          {threads.map((t) => (
            <button
              key={t.thread_id}
              onClick={() => setActive(t)}
              className={`block w-full border-b border-border/60 px-3 py-2.5 text-left last:border-0 hover:bg-muted/50 ${
                active?.thread_id === t.thread_id ? "bg-muted/60" : ""
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-medium">{t.counterparty}</span>
                {t.unread > 0 && <Badge className="shrink-0">{t.unread}</Badge>}
              </div>
              <div className="truncate text-xs text-muted-foreground">{t.subject}</div>
              <div className="truncate text-xs text-muted-foreground/70">{t.last_snippet}</div>
            </button>
          ))}
        </Card>

        {/* Conversation */}
        <Card className="flex max-h-[70vh] flex-col p-0">
          {!active ? (
            <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
              Select a conversation
            </div>
          ) : (
            <>
              <div className="border-b border-border px-4 py-3">
                <div className="font-medium">{active.counterparty}</div>
                <div className="text-xs text-muted-foreground">{active.subject}</div>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {active.messages.map((m) => (
                  <div
                    key={m.id}
                    className={`max-w-[85%] rounded-lg border p-3 text-sm ${
                      m.direction === "outbound"
                        ? "ml-auto border-primary/30 bg-primary/5"
                        : "border-border bg-muted/40"
                    }`}
                  >
                    <div className="mb-1 text-xs text-muted-foreground">
                      {m.direction === "outbound" ? "You" : m.from_email} · {fmt(m.created_at)}
                    </div>
                    <div className="whitespace-pre-wrap">{m.text || m.snippet}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-2 border-t border-border p-3">
                <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" />
                <Textarea
                  rows={4}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Write your reply…"
                />
                <div className="flex items-center gap-2">
                  <Button onClick={send} disabled={pending || !body.trim()}>
                    <Send className="mr-1.5 h-4 w-4" /> {pending ? "Sending…" : "Send reply"}
                  </Button>
                  {note && <span className="text-sm text-muted-foreground">{note}</span>}
                </div>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

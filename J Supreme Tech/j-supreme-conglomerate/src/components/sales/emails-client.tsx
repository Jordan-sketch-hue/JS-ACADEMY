"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import type { SalesEmail } from "@/lib/sales/types";

const STATUS_STYLE: Record<string, string> = {
  queued: "bg-muted text-muted-foreground hover:bg-muted",
  sending: "bg-muted text-muted-foreground hover:bg-muted",
  approved: "bg-muted text-muted-foreground hover:bg-muted",
  sent: "bg-blue-600 hover:bg-blue-600",
  delivered: "bg-indigo-600 hover:bg-indigo-600",
  opened: "bg-emerald-600 hover:bg-emerald-600",
  clicked: "bg-emerald-600 hover:bg-emerald-600",
  bounced: "bg-red-600 hover:bg-red-600",
  complained: "bg-red-600 hover:bg-red-600",
  failed: "bg-red-600 hover:bg-red-600",
  skipped: "bg-amber-500 hover:bg-amber-500",
};

function fmt(d?: string | null): string {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return d;
  }
}

type Filter = "all" | "outbound" | "replies" | "opened" | "failed";

export function EmailsClient({ emails }: { emails: SalesEmail[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  const out = emails.filter((e) => e.direction === "outbound");
  const counts = {
    all: emails.length,
    outbound: out.length,
    replies: emails.filter((e) => e.direction === "inbound").length,
    opened: out.filter((e) => e.opened_at || e.status === "opened" || e.status === "clicked").length,
    failed: out.filter((e) => ["bounced", "complained", "failed"].includes(e.status)).length,
  };

  const filtered = emails.filter((e) => {
    switch (filter) {
      case "outbound": return e.direction === "outbound";
      case "replies": return e.direction === "inbound";
      case "opened": return !!e.opened_at || e.status === "opened" || e.status === "clicked";
      case "failed": return ["bounced", "complained", "failed"].includes(e.status);
      default: return true;
    }
  });

  const TABS: { key: Filter; label: string }[] = [
    { key: "all", label: `All ${counts.all}` },
    { key: "outbound", label: `Sent ${counts.outbound}` },
    { key: "opened", label: `Opened ${counts.opened}` },
    { key: "replies", label: `Replies ${counts.replies}` },
    { key: "failed", label: `Failed ${counts.failed}` },
  ];

  return (
    <div className="space-y-3">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Emails</h1>
        <p className="text-sm text-muted-foreground">
          Every email this brand has sent or received, with delivery status. Outbound
          sends are BCC&apos;d to you and replies thread into the Inbox.
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={
              "rounded-md border px-3 py-1.5 text-xs font-medium transition " +
              (filter === t.key ? "bg-foreground text-background" : "hover:bg-accent")
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      <Card className="overflow-hidden p-0">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No emails yet. Once this brand goes live, sends will appear here in real time.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
                  <th className="px-3 py-2 font-medium">Dir</th>
                  <th className="px-3 py-2 font-medium">To / From</th>
                  <th className="px-3 py-2 font-medium">Subject</th>
                  <th className="px-3 py-2 font-medium">Step</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">When</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((e) => {
                  const inbound = e.direction === "inbound";
                  const who = inbound ? e.from_email : e.to_email;
                  return (
                    <tr key={e.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-3 py-2">
                        {inbound ? (
                          <ArrowDownLeft className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </td>
                      <td className="px-3 py-2 font-medium">{who}</td>
                      <td className="max-w-[280px] truncate px-3 py-2 text-muted-foreground">
                        {e.subject}
                      </td>
                      <td className="px-3 py-2 text-muted-foreground">{inbound ? "—" : e.step}</td>
                      <td className="px-3 py-2">
                        <Badge className={"text-[10px] " + (STATUS_STYLE[e.status] ?? "")}>
                          {inbound ? "reply" : e.status}
                        </Badge>
                        {e.opened_at && !inbound && (
                          <span className="ml-1 text-[10px] text-emerald-600">opened</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-muted-foreground">
                        {fmt(e.sent_at || e.created_at)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

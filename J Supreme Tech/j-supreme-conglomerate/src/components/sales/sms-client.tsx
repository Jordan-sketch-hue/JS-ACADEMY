"use client";

import { MessageSquare, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { SmsLogRow } from "@/app/(app)/sales/sms/actions";

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  } catch { return iso; }
}

export function SmsClient({ logs }: { logs: SmsLogRow[] }) {
  if (logs.length === 0) {
    return (
      <Card className="p-8 text-center text-muted-foreground text-sm">
        No SMS messages sent yet. They appear here after Kai completes a call.
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">{logs.length} message{logs.length !== 1 ? "s" : ""}</p>
      <div className="space-y-2">
        {logs.map((row) => (
          <Card key={row.id} className="p-4 space-y-2">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <MessageSquare className="h-4 w-4 text-muted-foreground shrink-0" />
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
            {row.error && (
              <p className="text-xs text-red-400 pl-7">Error: {row.error}</p>
            )}
            {row.telnyx_id && (
              <p className="text-[10px] text-muted-foreground pl-7 font-mono">ID: {row.telnyx_id}</p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
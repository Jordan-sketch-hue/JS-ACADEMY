"use client";

import { useState } from "react";
import { Check, Copy, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { OperatorIdentity } from "@/lib/conglomerate-backoffice/architect";

export function OperatorsRoster({
  operators,
  note,
}: {
  operators: OperatorIdentity[];
  note?: string;
}) {
  return (
    <Card className="border-primary/25 bg-gradient-to-br from-primary/10 via-card/40 to-card/40">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Operator credentials
            </CardTitle>
            <CardDescription className="text-xs">
              {operators.length} verified accounts — each works on every external back office.
            </CardDescription>
          </div>
          <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
            Verified
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-1">
        {operators.map((op) => (
          <OperatorRow key={op.email} op={op} />
        ))}
        {note ? (
          <p className="rounded-md border border-border/50 bg-muted/30 p-2 text-[11px] leading-relaxed text-muted-foreground">
            {note}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}

function OperatorRow({ op }: { op: OperatorIdentity }) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState<"email" | "password" | "both" | null>(null);

  async function copy(value: string, what: "email" | "password" | "both") {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(what);
      setTimeout(() => setCopied((c) => (c === what ? null : c)), 1400);
    } catch {
      /* clipboard may be blocked */
    }
  }

  return (
    <div className="rounded-xl border border-border/60 bg-background/40 p-3">
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-xs font-black text-white shadow-sm",
            op.accent,
          )}
        >
          {op.name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{op.name}</p>
          <p className="truncate text-[11px] text-muted-foreground">{op.role}</p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="h-7 text-[10px] font-semibold uppercase tracking-wider"
          onClick={() => copy(`${op.email}\n${op.password}`, "both")}
        >
          {copied === "both" ? "Copied" : "Copy both"}
        </Button>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <Field
          label="Email"
          value={op.email}
          onCopy={() => copy(op.email, "email")}
          copied={copied === "email"}
        />
        <Field
          label="Password"
          value={op.password}
          masked={!revealed}
          onCopy={() => copy(op.password, "password")}
          copied={copied === "password"}
          extra={
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setRevealed((v) => !v)}
              aria-label={revealed ? "Hide password" : "Reveal password"}
            >
              {revealed ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </Button>
          }
        />
      </div>

      {op.note ? (
        <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">{op.note}</p>
      ) : null}
    </div>
  );
}

function Field({
  label,
  value,
  masked,
  onCopy,
  copied,
  extra,
}: {
  label: string;
  value: string;
  masked?: boolean;
  onCopy: () => void;
  copied: boolean;
  extra?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-1.5 rounded-md border border-border/60 bg-muted/30 px-2 py-1.5">
      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </p>
        <p
          className={cn(
            "mt-0.5 truncate font-mono text-xs text-foreground",
            masked && "tracking-widest",
          )}
        >
          {masked ? "•".repeat(Math.min(value.length, 18)) : value}
        </p>
      </div>
      {extra}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={onCopy}
        aria-label={`Copy ${label.toLowerCase()}`}
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-emerald-500" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </Button>
    </div>
  );
}

// Backwards-compat — keep a single-identity card for legacy imports.
export type ArchitectIdentity = OperatorIdentity;
export function ArchitectCredentialsCard({ architect }: { architect: ArchitectIdentity }) {
  return <OperatorsRoster operators={[architect]} />;
}

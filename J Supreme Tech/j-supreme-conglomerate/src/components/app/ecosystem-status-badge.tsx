"use client";

import { useCallback, useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Activity, Loader2 } from "lucide-react";

type StatusPayload = {
  level: "nominal" | "degraded" | "offline";
  checks: { openai_chat: boolean; supabase: boolean; clerk: boolean };
  generated_at?: string;
};

function dotClass(level: StatusPayload["level"] | "loading" | "error") {
  if (level === "nominal") return "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.65)]";
  if (level === "degraded") return "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.55)]";
  if (level === "loading") return "bg-sky-400 animate-pulse";
  if (level === "error") return "bg-rose-400";
  return "bg-slate-500";
}

function label(level: StatusPayload["level"] | "loading" | "error") {
  if (level === "nominal") return "Ecosystem nominal";
  if (level === "degraded") return "Ecosystem degraded";
  if (level === "loading") return "Checking status…";
  if (level === "error") return "Status unreachable";
  return "Ecosystem offline";
}

export function EcosystemStatusBadge() {
  const [state, setState] = useState<StatusPayload | null>(null);
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(true);

  const pull = useCallback(async () => {
    try {
      const r = await fetch("/api/v1/system-status", { credentials: "same-origin", cache: "no-store" });
      if (!r.ok) throw new Error(String(r.status));
      const j = (await r.json()) as StatusPayload;
      setState(j);
      setErr(false);
    } catch {
      setErr(true);
      setState(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void pull();
    const id = setInterval(() => void pull(), 45_000);
    return () => clearInterval(id);
  }, [pull]);

  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === "visible") void pull();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [pull]);

  const level: StatusPayload["level"] | "loading" | "error" = loading
    ? "loading"
    : err
      ? "error"
      : state?.level ?? "offline";

  const checks = state?.checks;
  const detail = checks
    ? [
        `${checks.openai_chat ? "✓" : "✗"} OpenAI chat (Jarvis AI fallback)`,
        `${checks.supabase ? "✓" : "✗"} Supabase (server keys + URL)`,
        `${checks.clerk ? "✓" : "○"} Clerk (optional for prod sign-in)`,
      ].join("\n")
    : err
      ? "Could not reach /api/v1/system-status. Check network or redeploy."
      : "Fetching…";

  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={() => void pull()}
          className={cn(
            "flex h-9 items-center gap-2 rounded-full border border-border/70 bg-card/50 px-3 text-xs font-medium text-foreground/90 backdrop-blur-sm transition-colors",
            "hover:bg-card/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
          aria-label={label(level)}
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-muted-foreground" />
          ) : (
            <Activity className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          )}
          <span className={cn("relative flex h-2 w-2 shrink-0 rounded-full", dotClass(level))} />
          <span className="hidden sm:inline">{label(level)}</span>
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" align="end" className="max-w-xs whitespace-pre-line text-xs">
        <p className="font-semibold">{label(level)}</p>
        <p className="mt-1 text-muted-foreground">{detail}</p>
        {state?.generated_at ? (
          <p className="mt-2 text-[10px] text-muted-foreground">Updated {new Date(state.generated_at).toLocaleString()}</p>
        ) : null}
        <p className="mt-2 text-[10px] text-muted-foreground">Click to refresh · auto every 45s</p>
      </TooltipContent>
    </Tooltip>
  );
}

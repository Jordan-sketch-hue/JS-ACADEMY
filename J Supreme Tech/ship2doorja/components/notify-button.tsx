"use client";

import { useState } from "react";
import { Check, Send, Loader2, AlertTriangle } from "lucide-react";

type State = "idle" | "sending" | "done" | "err";

export function NotifyButton({
  to,
  name,
  packageId,
  store,
  status = "At U.S. warehouse",
}: {
  to: string;
  name: string;
  packageId: string;
  store: string;
  status?: string;
}) {
  const [state, setState] = useState<State>("idle");

  async function go() {
    setState("sending");
    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, name, packageId, store, status }),
      });
      const data = await res.json();
      setState(data.ok ? "done" : "err");
    } catch {
      setState("err");
    }
  }

  const base =
    "mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold ring-1 transition-colors";

  if (state === "done")
    return (
      <div className={`${base} bg-emerald-500/15 text-emerald-400 ring-emerald-500/30`}>
        <Check className="h-4 w-4" /> Customer notified
      </div>
    );

  if (state === "err")
    return (
      <button onClick={go} className={`${base} bg-amber-500/15 text-amber-400 ring-amber-500/30`}>
        <AlertTriangle className="h-4 w-4" /> Email not configured — retry
      </button>
    );

  return (
    <button
      onClick={go}
      disabled={state === "sending"}
      className={`${base} bg-sky/15 text-sky-light ring-sky/30 hover:bg-sky/25 disabled:opacity-60`}
    >
      {state === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
      {state === "sending" ? "Sending…" : "Mark received & notify"}
    </button>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Bot,
  CheckCheck,
  Clock,
  Facebook,
  Instagram,
  RefreshCw,
  Send,
  Sparkles,
  TriangleAlert,
  X,
  Inbox as InboxIcon,
} from "lucide-react";
import {
  INTENT_META,
  INTENT_ORDER,
  type AngelIntent,
  type AngelThreadRow,
} from "@/lib/jarvis/angel/types";

type InboxResponse = {
  configured: boolean;
  brands: { slug: string; name: string; ig: boolean }[];
  igPermissionOk: boolean;
  igConnected?: boolean;
  igLoginConfigured?: boolean;
  settings: {
    brand: string;
    last_sync_at: string | null;
    last_sync_note: string | null;
    ig_permission_ok: boolean;
    autonomy?: string;
  }[];
  threads: AngelThreadRow[];
  snoozedCount?: number;
};

const PRIORITY_RANK: Record<string, number> = { high: 0, medium: 1, low: 2 };

function timeAgo(iso: string | null): string {
  if (!iso) return "";
  const ms = Date.now() - Date.parse(iso);
  if (Number.isNaN(ms)) return "";
  const m = Math.floor(ms / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function priorityClass(p: string | null): string {
  if (p === "high") return "bg-red-500";
  if (p === "medium") return "bg-amber-500";
  return "bg-muted-foreground/40";
}

export function AngelDashboard() {
  const [data, setData] = useState<InboxResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [filter, setFilter] = useState<AngelIntent | "all">("all");

  const load = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch("/api/v1/jarvis/angel/inbox", { cache: "no-store" });
      const body = (await res.json()) as InboxResponse & { error?: string };
      if (!res.ok) throw new Error(body.error ?? `HTTP ${res.status}`);
      setData(body);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  // Surface the Instagram-connect result (?ig=connected|error) then clean the URL.
  const [igResult, setIgResult] = useState<{ ok: boolean; msg: string } | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const p = new URLSearchParams(window.location.search);
    const ig = p.get("ig");
    if (ig === "connected") {
      setIgResult({ ok: true, msg: "Instagram connected 🎉 Hit Sync now to pull your DMs." });
    } else if (ig === "error") {
      setIgResult({ ok: false, msg: `Instagram connect failed: ${p.get("igmsg") || "unknown error"}` });
    }
    if (ig) window.history.replaceState(null, "", "/jarvis/angel");
  }, []);

  const sync = useCallback(async () => {
    setSyncing(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/jarvis/angel/sync", { method: "POST" });
      const body = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(body.error ?? `HTTP ${res.status}`);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sync failed");
    } finally {
      setSyncing(false);
    }
  }, [load]);

  const autonomy = (data?.settings?.[0]?.autonomy as string) || "full_auto";
  const [savingAuto, setSavingAuto] = useState(false);
  const setAutonomy = useCallback(async (next: string) => {
    setSavingAuto(true);
    setError(null);
    try {
      const res = await fetch("/api/v1/jarvis/angel/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ autonomy: next }),
      });
      if (!res.ok) {
        const b = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(b.error ?? `HTTP ${res.status}`);
      }
      setData((d) => {
        if (!d) return d;
        const settings = d.settings?.length
          ? d.settings.map((s, i) => (i === 0 ? { ...s, autonomy: next } : s))
          : [{ brand: "", last_sync_at: null, last_sync_note: null, ig_permission_ok: false, autonomy: next }];
        return { ...d, settings };
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't update autonomy");
    } finally {
      setSavingAuto(false);
    }
  }, []);

  const threads = data?.threads ?? [];
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const t of threads) {
      const k = t.intent ?? "general";
      c[k] = (c[k] ?? 0) + 1;
    }
    return c;
  }, [threads]);

  const visible = useMemo(() => {
    const list = filter === "all" ? threads : threads.filter((t) => (t.intent ?? "general") === filter);
    return [...list].sort((a, b) => {
      const pr = (PRIORITY_RANK[a.priority ?? "low"] ?? 2) - (PRIORITY_RANK[b.priority ?? "low"] ?? 2);
      if (pr !== 0) return pr;
      return Date.parse(b.last_message_at ?? "0") - Date.parse(a.last_message_at ?? "0");
    });
  }, [threads, filter]);

  const removeThread = useCallback((id: string) => {
    setData((d) => (d ? { ...d, threads: d.threads.filter((t) => t.id !== id) } : d));
  }, []);

  const patchThread = useCallback((id: string, patch: Partial<AngelThreadRow>) => {
    setData((d) =>
      d ? { ...d, threads: d.threads.map((t) => (t.id === id ? { ...t, ...patch } : t)) } : d,
    );
  }, []);

  const highCount = threads.filter((t) => t.priority === "high").length;
  const igBrand = data?.brands.some((b) => b.ig);
  const showIgBanner = !!(data?.configured && igBrand && !data.igConnected);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-sm">
              <Sparkles className="h-5 w-5" />
            </span>
            <h1 className="text-2xl font-semibold tracking-tight">Angel</h1>
            <Badge variant="outline" className="ml-1 gap-1 text-[10px] uppercase tracking-wide">
              <Bot className="h-3 w-3" /> Inbox triage
            </Badge>
          </div>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Angel reads your J Supreme Marketing inbox, sorts every conversation, and writes a reply
            for each — you review and tap <span className="font-medium text-foreground">Approve &amp; Send</span>.
            Nothing goes out on its own.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="success" className="gap-1">
            <InboxIcon className="h-3 w-3" /> {threads.length} to review
          </Badge>
          {highCount > 0 && (
            <Badge variant="warning" className="gap-1">
              <TriangleAlert className="h-3 w-3" /> {highCount} high priority
            </Badge>
          )}
          <Button variant="outline" size="sm" onClick={() => void sync()} disabled={syncing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Syncing…" : "Sync now"}
          </Button>
        </div>
      </header>

      {data?.configured && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border/50 bg-muted/20 px-3 py-2">
          <span className="text-xs font-medium text-muted-foreground">Autonomy</span>
          {(
            [
              ["full_auto", "Full auto"],
              ["faq_auto", "FAQ auto"],
              ["approve", "Approve all"],
            ] as const
          ).map(([val, label]) => (
            <button
              key={val}
              type="button"
              disabled={savingAuto}
              onClick={() => void setAutonomy(val)}
              className={`rounded-full px-2.5 py-1 text-xs transition-colors disabled:opacity-50 ${
                autonomy === val
                  ? "bg-primary font-medium text-primary-foreground"
                  : "border border-border/60 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
          <span className="ml-auto text-[11px] text-muted-foreground">
            {autonomy === "full_auto" &&
              "⚡ Angel replies + follows up on its own — money, complaints & urgent escalate to you."}
            {autonomy === "faq_auto" && "Angel auto-answers simple questions; everything else waits for you."}
            {autonomy === "approve" && "Angel only drafts — nothing sends until you tap."}
          </span>
        </div>
      )}

      {igResult && (
        <Card className={igResult.ok ? "border-emerald-400/40 bg-emerald-500/[0.06]" : "border-red-400/40 bg-red-500/[0.06]"}>
          <CardContent className="flex items-center justify-between gap-3 py-3 text-sm">
            <span className="flex items-center gap-2">
              {igResult.ok ? (
                <CheckCheck className="h-4 w-4 text-emerald-600" />
              ) : (
                <TriangleAlert className="h-4 w-4 text-red-500" />
              )}
              {igResult.msg}
            </span>
            {igResult.ok && (
              <Button size="sm" onClick={() => void sync()} disabled={syncing}>
                <RefreshCw className={`mr-2 h-4 w-4 ${syncing ? "animate-spin" : ""}`} /> Sync now
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {showIgBanner && (
        <Card className="border-amber-400/40 bg-amber-500/[0.06]">
          <CardContent className="flex flex-col gap-3 py-4 text-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-2">
              <Instagram className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <div>
                <p className="font-medium">Connect Instagram to turn on IG DMs</p>
                <p className="mt-0.5 text-muted-foreground">
                  Facebook Messenger is already live. One desktop login connects @jsuprememarketing — no phone needed.
                  {data?.igLoginConfigured === false &&
                    " (Setup pending — ask me to finish the Instagram app config first.)"}
                </p>
              </div>
            </div>
            {data?.igLoginConfigured !== false && (
              <a
                href="/api/v1/jarvis/angel/ig/connect"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-foreground px-3 py-2 text-xs font-semibold text-background transition-opacity hover:opacity-90"
              >
                <Instagram className="h-3.5 w-3.5" /> Connect Instagram
              </a>
            )}
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-red-400/40 bg-red-500/[0.06]">
          <CardContent className="flex items-center justify-between gap-3 py-3 text-sm">
            <span className="flex items-center gap-2">
              <TriangleAlert className="h-4 w-4 text-red-500" /> {error}
            </span>
            <Button variant="outline" size="sm" onClick={() => void load()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Filter chips */}
      {threads.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          <FilterChip active={filter === "all"} onClick={() => setFilter("all")} label={`All · ${threads.length}`} />
          {INTENT_ORDER.filter((i) => counts[i]).map((i) => (
            <FilterChip
              key={i}
              active={filter === i}
              onClick={() => setFilter(i)}
              label={`${INTENT_META[i].emoji} ${INTENT_META[i].label} · ${counts[i]}`}
            />
          ))}
        </div>
      )}

      {/* Body */}
      {loading ? (
        <div className="grid gap-3 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-xl" />
          ))}
        </div>
      ) : !data?.configured ? (
        <NotConfigured />
      ) : threads.length === 0 ? (
        <EmptyState onSync={() => void sync()} syncing={syncing} note={data.settings?.[0]?.last_sync_note} />
      ) : (
        <div className="grid items-start gap-3 lg:grid-cols-2">
          {visible.map((t) => (
            <ThreadCard
              key={t.id}
              thread={t}
              onRemove={() => removeThread(t.id)}
              onPatch={(p) => patchThread(t.id, p)}
              onError={setError}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
        active
          ? "border-primary/40 bg-primary/10 font-medium text-primary"
          : "border-border/60 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}

function ThreadCard({
  thread,
  onRemove,
  onPatch,
  onError,
}: {
  thread: AngelThreadRow;
  onRemove: () => void;
  onPatch: (patch: Partial<AngelThreadRow>) => void;
  onError: (msg: string | null) => void;
}) {
  const [draft, setDraft] = useState(thread.draft_reply ?? "");
  const [busy, setBusy] = useState<null | "send" | "regen" | "snooze" | "done" | "dismiss">(null);

  useEffect(() => {
    setDraft(thread.draft_reply ?? "");
  }, [thread.draft_reply]);

  const intent = (thread.intent ?? "general") as AngelIntent;
  const meta = INTENT_META[intent];
  const PlatformIcon = thread.platform === "instagram" ? Instagram : Facebook;
  const who = thread.participant_name || (thread.participant_username ? `@${thread.participant_username}` : "Unknown");
  // Existing client vs. new lead — engine marks it on meta.relationship; "needs an
  // update" is a live tell even before any nudge has run.
  const isExistingClient =
    (thread.meta as { relationship?: string } | null)?.relationship === "existing_client" ||
    intent === "needs_update" ||
    intent === "support_request";

  async function call(path: string, payload: Record<string, unknown>): Promise<unknown> {
    const res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) throw new Error(body.error ?? `HTTP ${res.status}`);
    return body;
  }

  async function send() {
    if (!draft.trim()) return;
    setBusy("send");
    onError(null);
    try {
      await call("/api/v1/jarvis/angel/send", { threadId: thread.id, text: draft });
      onRemove();
    } catch (e) {
      onError(e instanceof Error ? e.message : "Send failed");
      setBusy(null);
    }
  }

  async function regenerate() {
    setBusy("regen");
    onError(null);
    try {
      const body = (await call("/api/v1/jarvis/angel/draft", {
        threadId: thread.id,
        regenerate: true,
      })) as { thread?: AngelThreadRow };
      if (body.thread) {
        setDraft(body.thread.draft_reply ?? "");
        onPatch({
          draft_reply: body.thread.draft_reply,
          intent: body.thread.intent,
          priority: body.thread.priority,
          summary: body.thread.summary,
        });
      }
    } catch (e) {
      onError(e instanceof Error ? e.message : "Regenerate failed");
    } finally {
      setBusy(null);
    }
  }

  async function setStatus(status: "done" | "dismissed" | "snoozed", snoozeHours?: number) {
    setBusy(status === "snoozed" ? "snooze" : status === "done" ? "done" : "dismiss");
    onError(null);
    try {
      await call("/api/v1/jarvis/angel/status", { threadId: thread.id, status, snoozeHours });
      onRemove();
    } catch (e) {
      onError(e instanceof Error ? e.message : "Action failed");
      setBusy(null);
    }
  }

  const edited = draft !== (thread.draft_reply ?? "");

  return (
    <Card className="flex flex-col">
      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <span className={`h-2 w-2 shrink-0 rounded-full ${priorityClass(thread.priority)}`} title={`${thread.priority} priority`} />
            <PlatformIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate text-sm font-medium">{who}</span>
            {isExistingClient ? (
              <Badge variant="secondary" className="shrink-0 text-[10px]" title="Existing client — no new-customer discount">
                Client
              </Badge>
            ) : (
              <Badge variant="outline" className="shrink-0 text-[10px] text-muted-foreground" title="New lead / prospect">
                New
              </Badge>
            )}
            <span className="shrink-0 text-[11px] text-muted-foreground">· {timeAgo(thread.last_message_at)}</span>
          </div>
          <Badge variant="outline" className="shrink-0 gap-1 text-[10px]">
            <span aria-hidden>{meta.emoji}</span> {meta.label}
          </Badge>
        </div>

        {/* What they said */}
        <div className="rounded-lg border border-border/50 bg-muted/20 px-3 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/70">They said</p>
          <p className="mt-0.5 line-clamp-3 text-xs text-foreground/90">
            {thread.summary || thread.last_message_text || "(no text — attachment or empty)"}
          </p>
        </div>

        {/* Angel's draft */}
        <div className="flex flex-1 flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/70">
              <Sparkles className="h-3 w-3 text-accent" /> Angel&apos;s draft
              {thread.triage_engine && (
                <span className="font-normal normal-case text-muted-foreground/50">· {thread.triage_engine}</span>
              )}
              {edited && <span className="font-normal normal-case text-amber-600">· edited</span>}
            </p>
          </div>
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={4}
            className="resize-y text-xs leading-relaxed"
            placeholder="Write a reply…"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          <Button size="sm" onClick={() => void send()} disabled={busy !== null || !draft.trim()}>
            <Send className="mr-1.5 h-3.5 w-3.5" />
            {busy === "send" ? "Sending…" : "Approve & Send"}
          </Button>
          <Button size="sm" variant="outline" onClick={() => void regenerate()} disabled={busy !== null}>
            <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${busy === "regen" ? "animate-spin" : ""}`} />
            Regenerate
          </Button>
          <div className="ml-auto flex items-center gap-1">
            <Button size="sm" variant="ghost" onClick={() => void setStatus("snoozed", 24)} disabled={busy !== null} title="Snooze 1 day">
              <Clock className="h-3.5 w-3.5" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => void setStatus("done")} disabled={busy !== null} title="Mark done (no reply)">
              <CheckCheck className="h-3.5 w-3.5" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => void setStatus("dismissed")} disabled={busy !== null} title="Dismiss">
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ onSync, syncing, note }: { onSync: () => void; syncing: boolean; note?: string | null }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/50 text-muted-foreground">
          <InboxIcon className="h-6 w-6" />
        </span>
        <div>
          <p className="text-sm font-medium">Inbox clear</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Nothing waiting for a reply. Run a sync to pull the latest messages.
          </p>
          {note && <p className="mt-1 text-[11px] text-muted-foreground/70">Last sync: {note}</p>}
        </div>
        <Button variant="outline" size="sm" onClick={onSync} disabled={syncing}>
          <RefreshCw className={`mr-2 h-4 w-4 ${syncing ? "animate-spin" : ""}`} /> Sync now
        </Button>
      </CardContent>
    </Card>
  );
}

function NotConfigured() {
  return (
    <Card className="border-amber-400/40 bg-amber-500/[0.06]">
      <CardContent className="space-y-2 py-5 text-sm">
        <p className="flex items-center gap-2 font-medium">
          <TriangleAlert className="h-4 w-4 text-amber-600" /> Angel isn&apos;t connected yet
        </p>
        <p className="text-muted-foreground">
          Add these environment variables to the deployment and redeploy:
        </p>
        <pre className="overflow-x-auto rounded-lg bg-muted/50 p-3 text-[11px] leading-relaxed">{`META_JSM_PAGE_ID=867858733085511
META_JSM_IG_USER_ID=17841479677309372
META_JSM_PAGE_TOKEN=<J Supreme Marketing page token>`}</pre>
        <p className="text-[11px] text-muted-foreground/70">
          The page token already exists in the meta-poster (accounts.resolved.json → jsupreme-marketing).
        </p>
      </CardContent>
    </Card>
  );
}

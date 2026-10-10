"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCheck,
  MessageCircle,
  Pause,
  Play,
  Phone,
  RefreshCw,
  Send,
  ShieldAlert,
  Sparkles,
  TriangleAlert,
  X,
  Bot,
  Inbox as InboxIcon,
} from "lucide-react";
import {
  CATEGORY_META,
  CATEGORY_ORDER,
  type WaCategory,
  type WaSettingsRow,
  type WaThreadRow,
} from "@/lib/jarvis/whatsapp/types";

type UpdatesResponse = {
  configured: boolean;
  threads: WaThreadRow[];
  settings: WaSettingsRow | null;
};

const PRIORITY_RANK: Record<string, number> = { high: 0, medium: 1, low: 2 };
const CAPTURE_LABELS: Record<string, string> = {
  all_business: "All business",
  action_money_shipping: "Action · money · shipping",
  urgent_only: "Urgent only",
};

function timeAgo(iso: string | null): string {
  if (!iso) return "";
  const ms = Date.now() - Date.parse(iso);
  if (Number.isNaN(ms)) return "";
  const m = Math.floor(ms / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function priorityClass(p: string | null): string {
  if (p === "high") return "bg-red-500";
  if (p === "medium") return "bg-amber-500";
  return "bg-muted-foreground/40";
}

export function WhatsappDashboard() {
  const [data, setData] = useState<UpdatesResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<WaCategory | "all">("all");
  const [busySettings, setBusySettings] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch("/api/v1/jarvis/whatsapp/updates", { cache: "no-store" });
      const body = (await res.json()) as UpdatesResponse & { error?: string };
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
    // Light auto-refresh so new cards appear without a manual reload.
    const t = setInterval(() => void load(), 30_000);
    return () => clearInterval(t);
  }, [load]);

  const post = useCallback(
    async (payload: Record<string, unknown>) => {
      const res = await fetch("/api/v1/jarvis/whatsapp/mark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(body.error ?? `HTTP ${res.status}`);
    },
    [],
  );

  const updateSettings = useCallback(
    async (patch: Record<string, unknown>, optimistic: Partial<WaSettingsRow>) => {
      setBusySettings(true);
      setError(null);
      setData((d) => (d && d.settings ? { ...d, settings: { ...d.settings, ...optimistic } } : d));
      try {
        await post(patch);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Couldn't update settings");
        void load();
      } finally {
        setBusySettings(false);
      }
    },
    [post, load],
  );

  const removeThread = useCallback((id: string) => {
    setData((d) => (d ? { ...d, threads: d.threads.filter((t) => t.id !== id) } : d));
  }, []);

  const patchThread = useCallback((id: string, patch: Partial<WaThreadRow>) => {
    setData((d) =>
      d ? { ...d, threads: d.threads.map((t) => (t.id === id ? { ...t, ...patch } : t)) } : d,
    );
  }, []);

  const clearCard = useCallback(
    async (id: string, status: "done" | "dismissed") => {
      removeThread(id);
      try {
        await post({ threadId: id, status });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Action failed");
        void load();
      }
    },
    [post, removeThread, load],
  );

  // This inbox shows ONLY personal / individual numbers. We drop:
  //   • spam / scam threads (Jordan's call — still flagged in the Ops Autopilot digest)
  //   • group chats (is_group) — that's where the spam rides in, and the "number" on a
  //     group isn't a real personal contact anyway.
  // Rows still exist in the data; they just don't clutter the WhatsApp catalog here.
  // This drops the cards, the matching filter chips (zero count), and the tallies.
  const threads = (data?.threads ?? []).filter(
    (t) => (t.category ?? "general") !== "spam" && !t.is_group,
  );
  const settings = data?.settings ?? null;

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const t of threads) {
      const k = (t.category ?? "general") as string;
      c[k] = (c[k] ?? 0) + 1;
    }
    return c;
  }, [threads]);

  const visible = useMemo(() => {
    const list = filter === "all" ? threads : threads.filter((t) => (t.category ?? "general") === filter);
    return [...list].sort((a, b) => {
      const pr = (PRIORITY_RANK[a.priority ?? "low"] ?? 2) - (PRIORITY_RANK[b.priority ?? "low"] ?? 2);
      if (pr !== 0) return pr;
      return Date.parse(b.last_message_at ?? "0") - Date.parse(a.last_message_at ?? "0");
    });
  }, [threads, filter]);

  const highCount = threads.filter((t) => t.priority === "high").length;
  const linked = !!settings?.linked;
  const paused = !!settings?.paused;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-sm">
              <MessageCircle className="h-5 w-5" />
            </span>
            <h1 className="text-2xl font-semibold tracking-tight">WhatsApp</h1>
            <Badge variant="outline" className="ml-1 gap-1 text-[10px] uppercase tracking-wide">
              <Bot className="h-3 w-3" /> Inbox triage
            </Badge>
          </div>
          <p className="max-w-2xl text-sm text-muted-foreground">
            A linked-device reader sorts every WhatsApp conversation and writes a reply for each —
            you review and tap <span className="font-medium text-foreground">Approve &amp; Send</span>.
            Nothing goes out on its own; money, scam &amp; personal chats never get a draft.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={linked ? "success" : "outline"} className="gap-1">
            <span className={`h-1.5 w-1.5 rounded-full ${linked ? "bg-emerald-400" : "bg-muted-foreground/50"}`} />
            {linked ? "Linked & listening" : "Not linked"}
          </Badge>
          {highCount > 0 && (
            <Badge variant="warning" className="gap-1">
              <TriangleAlert className="h-3 w-3" /> {highCount} high priority
            </Badge>
          )}
          <Button variant="outline" size="sm" onClick={() => void load()}>
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh
          </Button>
        </div>
      </header>

      {/* Controls */}
      {data?.configured && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border/50 bg-muted/20 px-3 py-2">
          <span className="text-xs font-medium text-muted-foreground">Capture</span>
          {(["all_business", "action_money_shipping", "urgent_only"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              disabled={busySettings}
              onClick={() => void updateSettings({ captureMode: mode }, { capture_mode: mode })}
              className={`rounded-full px-2.5 py-1 text-xs transition-colors disabled:opacity-50 ${
                (settings?.capture_mode ?? "all_business") === mode
                  ? "bg-primary font-medium text-primary-foreground"
                  : "border border-border/60 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
              }`}
            >
              {CAPTURE_LABELS[mode]}
            </button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto"
            disabled={busySettings}
            onClick={() => void updateSettings({ paused: !paused }, { paused: !paused })}
          >
            {paused ? <Play className="mr-1.5 h-3.5 w-3.5" /> : <Pause className="mr-1.5 h-3.5 w-3.5" />}
            {paused ? "Resume" : "Pause"}
          </Button>
        </div>
      )}

      {/* Auto-reply (clients only) */}
      {data?.configured && (
        <AutoReplyPanel settings={settings} busy={busySettings} onUpdate={updateSettings} />
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
          {CATEGORY_ORDER.filter((c) => counts[c]).map((c) => (
            <FilterChip
              key={c}
              active={filter === c}
              onClick={() => setFilter(c)}
              label={`${CATEGORY_META[c].emoji} ${CATEGORY_META[c].label} · ${counts[c]}`}
            />
          ))}
        </div>
      )}

      {/* Body */}
      {loading ? (
        <div className="grid gap-3 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      ) : !data?.configured ? (
        <NotConfigured />
      ) : threads.length === 0 ? (
        <EmptyState linked={linked} note={settings?.last_note} />
      ) : (
        <div className="grid items-start gap-3 lg:grid-cols-2">
          {visible.map((t) => (
            <UpdateCard
              key={t.id}
              thread={t}
              onClear={(s) => void clearCard(t.id, s)}
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

function AutoReplyPanel({
  settings,
  busy,
  onUpdate,
}: {
  settings: WaSettingsRow | null;
  busy: boolean;
  onUpdate: (patch: Record<string, unknown>, optimistic: Partial<WaSettingsRow>) => void;
}) {
  const enabled = settings?.autoreply_enabled !== false;
  const allow = settings?.client_allowlist ?? {};
  const entries = Object.entries(allow);
  const [num, setNum] = useState("");
  const [name, setName] = useState("");

  const save = (next: Record<string, string>) => onUpdate({ clientAllowlist: next }, { client_allowlist: next });

  const add = () => {
    const digits = num.replace(/[^0-9]/g, "");
    const label = name.trim();
    if (digits.length < 7 || !label) return;
    save({ ...allow, [digits]: label });
    setNum("");
    setName("");
  };
  const remove = (k: string) => {
    const next = { ...allow };
    delete next[k];
    save(next);
  };

  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-0.5">
            <p className="flex items-center gap-2 text-sm font-medium">
              <Bot className="h-4 w-4 text-emerald-500" /> Auto-reply
              <Badge variant="outline" className="text-[10px] uppercase tracking-wide">clients only</Badge>
            </p>
            <p className="max-w-xl text-xs text-muted-foreground">
              Sends a safe acknowledgement (got it · hours · will follow up) to the clients below — only when
              you haven&apos;t replied recently. Personal contacts are never messaged; anything substantive still
              comes to you as a card.
            </p>
          </div>
          <Button
            variant={enabled ? "default" : "outline"}
            size="sm"
            disabled={busy}
            onClick={() => onUpdate({ autoreplyEnabled: !enabled }, { autoreply_enabled: !enabled })}
          >
            {enabled ? "On" : "Off"}
          </Button>
        </div>

        <div className="space-y-1.5">
          {entries.length === 0 ? (
            <p className="text-xs text-muted-foreground">No clients on the list yet — add one below.</p>
          ) : (
            entries.map(([k, label]) => (
              <div
                key={k}
                className="flex items-center justify-between gap-2 rounded-md border border-border/50 bg-muted/20 px-2.5 py-1.5"
              >
                <span className="truncate text-xs">
                  <span className="font-medium">{label}</span>{" "}
                  <span className="text-muted-foreground">· +{k}</span>
                </span>
                <Button variant="ghost" size="sm" disabled={busy} onClick={() => remove(k)} title="Remove">
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            value={num}
            onChange={(e) => setNum(e.target.value)}
            placeholder="Number e.g. 18768405862"
            className="min-w-[150px] flex-1 rounded-md border border-border/60 bg-background px-2.5 py-1.5 text-xs"
          />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Client name"
            className="min-w-[120px] flex-1 rounded-md border border-border/60 bg-background px-2.5 py-1.5 text-xs"
          />
          <Button size="sm" variant="outline" disabled={busy || !num.trim() || !name.trim()} onClick={add}>
            Add client
          </Button>
        </div>
      </CardContent>
    </Card>
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

const NO_DRAFT = new Set<string>(["spam", "payment", "personal"]);

function UpdateCard({
  thread,
  onClear,
  onRemove,
  onPatch,
  onError,
}: {
  thread: WaThreadRow;
  onClear: (s: "done" | "dismissed") => void;
  onRemove: () => void;
  onPatch: (patch: Partial<WaThreadRow>) => void;
  onError: (msg: string | null) => void;
}) {
  const cat = (thread.category ?? "general") as WaCategory;
  const catMeta = CATEGORY_META[cat];
  const who = thread.chat_name || (thread.phone ? `+${thread.phone}` : "Unknown");
  const isScam = cat === "spam";
  const eligible = !NO_DRAFT.has(cat);

  const savedDraft = ((thread.meta as { draft?: string | null } | null)?.draft ?? "") || "";
  const draftEngine = (thread.meta as { draft_engine?: string } | null)?.draft_engine ?? thread.triage_engine ?? null;
  const [draft, setDraft] = useState(savedDraft);
  const [busy, setBusy] = useState<null | "send" | "regen">(null);
  const autoTried = useRef(false);

  useEffect(() => {
    setDraft(savedDraft);
  }, [savedDraft]);

  async function call(path: string, payload: Record<string, unknown>): Promise<{ thread?: WaThreadRow }> {
    const res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = (await res.json().catch(() => ({}))) as { error?: string; thread?: WaThreadRow };
    if (!res.ok) throw new Error(body.error ?? `HTTP ${res.status}`);
    return body;
  }

  async function generate(silent = false) {
    setBusy("regen");
    if (!silent) onError(null);
    try {
      const body = await call("/api/v1/jarvis/whatsapp/draft", { threadId: thread.id });
      const next = (body.thread?.meta as { draft?: string } | null)?.draft ?? "";
      setDraft(next);
      if (body.thread) onPatch({ meta: body.thread.meta });
    } catch (e) {
      if (!silent) onError(e instanceof Error ? e.message : "Draft failed");
    } finally {
      setBusy(null);
    }
  }

  // Lazy auto-draft: fill an eligible card that has no draft yet, once, on mount.
  useEffect(() => {
    if (!eligible || savedDraft || autoTried.current) return;
    autoTried.current = true;
    void generate(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eligible, savedDraft]);

  async function send() {
    if (!draft.trim()) return;
    setBusy("send");
    onError(null);
    try {
      await call("/api/v1/jarvis/whatsapp/send", { threadId: thread.id, text: draft });
      onRemove();
    } catch (e) {
      onError(e instanceof Error ? e.message : "Send failed");
      setBusy(null);
    }
  }

  const edited = draft !== savedDraft;

  return (
    <Card className={`flex flex-col ${isScam ? "border-red-400/50 bg-red-500/[0.05]" : ""}`}>
      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <span
              className={`h-2 w-2 shrink-0 rounded-full ${priorityClass(thread.priority)}`}
              title={`${thread.priority} priority`}
            />
            <Phone className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate text-sm font-medium">{who}</span>
            <span className="shrink-0 text-[11px] text-muted-foreground">· {timeAgo(thread.last_message_at)}</span>
          </div>
          <Badge variant="outline" className="shrink-0 gap-1 text-[10px]">
            <span aria-hidden>{catMeta.emoji}</span> {catMeta.label}
          </Badge>
        </div>

        {isScam && (
          <div className="flex items-start gap-2 rounded-lg border border-red-400/40 bg-red-500/[0.08] px-3 py-2 text-xs text-red-700 dark:text-red-300">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <span>Possible scam — do not call numbers, pay fees, or share bank details from this chat.</span>
          </div>
        )}

        {/* What they said */}
        <div className="rounded-lg border border-border/50 bg-muted/20 px-3 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/70">They said</p>
          <p className="mt-0.5 text-xs text-foreground/90">
            {thread.summary || thread.last_message_text || "(no text — attachment or empty)"}
          </p>
        </div>

        {thread.action_needed && (
          <div className="flex items-start gap-2 text-xs">
            <span className="mt-0.5 shrink-0 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
              Do
            </span>
            <span className="text-foreground/90">{thread.action_needed}</span>
          </div>
        )}

        {/* Draft reply — Angel-parity */}
        {eligible ? (
          <>
            <div className="flex flex-1 flex-col gap-1.5">
              <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/70">
                <Sparkles className="h-3 w-3 text-accent" /> Draft reply
                {draftEngine && <span className="font-normal normal-case text-muted-foreground/50">· {draftEngine}</span>}
                {edited && <span className="font-normal normal-case text-amber-600">· edited</span>}
              </p>
              <Textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={4}
                className="resize-y text-xs leading-relaxed"
                placeholder={busy === "regen" ? "Drafting…" : "Write a reply…"}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <Button size="sm" onClick={() => void send()} disabled={busy !== null || !draft.trim()}>
                <Send className="mr-1.5 h-3.5 w-3.5" />
                {busy === "send" ? "Sending…" : "Approve & Send"}
              </Button>
              <Button size="sm" variant="outline" onClick={() => void generate(false)} disabled={busy !== null}>
                <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${busy === "regen" ? "animate-spin" : ""}`} />
                Regenerate
              </Button>
              <div className="ml-auto flex items-center gap-1">
                <Button size="sm" variant="ghost" onClick={() => onClear("done")} disabled={busy !== null} title="Mark handled (no reply)">
                  <CheckCheck className="h-3.5 w-3.5" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => onClear("dismissed")} disabled={busy !== null} title="Dismiss">
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="mt-auto flex flex-wrap items-center gap-2 pt-0.5">
            <span className="text-[10px] text-muted-foreground/60">
              {cat === "payment" ? "💵 Money — handle personally; no auto-draft." : cat === "spam" ? "🚩 Flagged — no reply drafted." : "💬 Personal — no draft."}
            </span>
            <div className="ml-auto flex items-center gap-1">
              <Button size="sm" variant="ghost" onClick={() => onClear("done")} title="Mark handled">
                <CheckCheck className="mr-1.5 h-3.5 w-3.5" /> Done
              </Button>
              <Button size="sm" variant="ghost" onClick={() => onClear("dismissed")} title="Dismiss">
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function EmptyState({ linked, note }: { linked: boolean; note?: string | null }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/50 text-muted-foreground">
          <InboxIcon className="h-6 w-6" />
        </span>
        <div>
          <p className="text-sm font-medium">{linked ? "All caught up" : "Waiting for the first link"}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {linked
              ? "No open client updates right now. New messages will appear here automatically."
              : "Link your WhatsApp Business number on the Railway reader (open its /qr page) and cards will start arriving."}
          </p>
          {note && <p className="mt-1 text-[11px] text-muted-foreground/70">Reader: {note}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

function NotConfigured() {
  return (
    <Card className="border-amber-400/40 bg-amber-500/[0.06]">
      <CardContent className="space-y-2 py-5 text-sm">
        <p className="flex items-center gap-2 font-medium">
          <TriangleAlert className="h-4 w-4 text-amber-600" /> WhatsApp reader isn&apos;t set up yet
        </p>
        <p className="text-muted-foreground">Two steps, both one-time:</p>
        <ol className="ml-4 list-decimal space-y-1 text-muted-foreground">
          <li>
            Apply the migration <code className="text-foreground/80">20260620120000_jarvis_whatsapp.sql</code> to Supabase.
          </li>
          <li>
            Deploy the <code className="text-foreground/80">whatsapp-jarvis-bot</code> service to Railway, set its env
            vars, and scan the QR at its <code className="text-foreground/80">/qr</code> page to link your number.
          </li>
        </ol>
        <p className="text-[11px] text-muted-foreground/70">
          Full steps are in the bot&apos;s README. Once the reader is linked, this page fills in within a minute.
        </p>
      </CardContent>
    </Card>
  );
}

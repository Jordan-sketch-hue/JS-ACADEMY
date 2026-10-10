"use client";

/**
 * Publishing panel — the "make it live" half of the Marketing Command Center.
 *  - Connections bar: connect Meta + list connected Pages / IG / ad accounts
 *  - Schedule timeline: upcoming + past posts grouped by day, with status
 *  - Schedule dialog: create a post (optionally prefilled from a storyboard asset)
 *
 * Talks to /api/v1/marketing/{connections,posts}. Self-fetching client island.
 */
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type {
  MetaConnection,
  SocialMediaType,
  SocialPlatform,
  SocialPost,
  SocialPostStatus,
} from "@/lib/marketing/meta/types";
import type { MarketingAsset } from "@/lib/data/marketing-types";
import {
  AlertCircle,
  CalendarClock,
  CheckCircle2,
  Clock,
  Facebook,
  Instagram,
  Loader2,
  Megaphone,
  Music2,
  Plus,
  RefreshCw,
  Send,
  Trash2,
} from "lucide-react";

/** Absolute origin assets resolve to in production (Meta fetches media by URL). */
const PUBLIC_ORIGIN = "https://jsupremeconglomerate.online";

export type SchedulePrefill = {
  campaign?: string | null;
  assetId?: string | null;
  series?: string | null;
  sequence?: number | null;
  caption?: string | null;
  mediaUrl?: string | null;
  mediaType?: SocialMediaType;
};

/** Build a schedule prefill from a storyboard asset (absolute media URL + narrative). */
export function assetToPrefill(asset: MarketingAsset): SchedulePrefill {
  const file = asset.file.startsWith("http") ? asset.file : `${PUBLIC_ORIGIN}${asset.file}`;
  const mediaType: SocialMediaType =
    asset.format === "video"
      ? asset.ratio === "portrait"
        ? "reel"
        : "video"
      : asset.resolvedChannel === "story"
        ? "story"
        : "image";
  return {
    campaign: asset.campaign,
    assetId: asset.id,
    series: asset.narrative?.series ?? null,
    sequence: asset.narrative?.sequence ?? null,
    caption: asset.narrative?.hook ?? asset.resolvedTitle,
    mediaUrl: asset.format === "pdf" ? null : file,
    mediaType,
  };
}

const STATUS_META: Record<
  SocialPostStatus,
  { label: string; cls: string; icon: typeof Clock }
> = {
  draft: { label: "Draft", cls: "bg-muted text-muted-foreground", icon: Clock },
  scheduled: { label: "Scheduled", cls: "bg-sky-500/15 text-sky-600 dark:text-sky-400", icon: CalendarClock },
  publishing: { label: "Publishing", cls: "bg-amber-500/15 text-amber-600 dark:text-amber-400", icon: Loader2 },
  posted: { label: "Posted", cls: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400", icon: CheckCircle2 },
  failed: { label: "Failed", cls: "bg-red-500/15 text-red-600 dark:text-red-400", icon: AlertCircle },
  canceled: { label: "Canceled", cls: "bg-muted text-muted-foreground line-through", icon: Trash2 },
};

const PLATFORM_META: Record<SocialPlatform, { label: string; icon: typeof Facebook; cls: string }> = {
  facebook: { label: "Facebook", icon: Facebook, cls: "text-[#1877F2]" },
  instagram: { label: "Instagram", icon: Instagram, cls: "text-[#E1306C]" },
  tiktok: { label: "TikTok", icon: Music2, cls: "text-foreground" },
};

async function getJSON<T>(url: string): Promise<T | null> {
  try {
    const r = await fetch(url, { cache: "no-store" });
    if (!r.ok) return null;
    return (await r.json()) as T;
  } catch {
    return null;
  }
}

const dayKey = (iso: string) => new Date(iso).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" });
const timeLabel = (iso: string) => new Date(iso).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

export function PublishingPanel({
  prefill,
  onConsumePrefill,
}: {
  prefill?: SchedulePrefill | null;
  onConsumePrefill?: () => void;
}) {
  const [connections, setConnections] = useState<MetaConnection[]>([]);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [seed, setSeed] = useState<SchedulePrefill | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [c, p] = await Promise.all([
      getJSON<{ ok: boolean; connections: MetaConnection[] }>("/api/v1/marketing/connections"),
      getJSON<{ ok: boolean; posts: SocialPost[] }>("/api/v1/marketing/posts"),
    ]);
    setConnections(c?.connections ?? []);
    setPosts(p?.posts ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // Open the dialog when a storyboard asset is sent in for scheduling.
  useEffect(() => {
    if (prefill) {
      setSeed(prefill);
      setDialogOpen(true);
      onConsumePrefill?.();
    }
  }, [prefill, onConsumePrefill]);

  // One-time banner from the OAuth callback redirect (?meta=connected|error).
  const banner = useConnectBanner();

  const openNew = () => {
    setSeed(null);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {banner}

      <ConnectionsBar connections={connections} loading={loading} onRefresh={refresh} />

      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <CalendarClock className="h-5 w-5 text-primary" /> Schedule
        </h2>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" className="h-8 gap-1.5" onClick={refresh}>
            <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} /> Refresh
          </Button>
          <Button size="sm" className="h-8 gap-1.5" onClick={openNew}>
            <Plus className="h-4 w-4" /> Schedule a post
          </Button>
        </div>
      </div>

      <ScheduleTimeline posts={posts} loading={loading} connections={connections} onChanged={refresh} />

      <ScheduleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        connections={connections}
        seed={seed}
        onSaved={() => {
          setDialogOpen(false);
          void refresh();
        }}
      />
    </div>
  );
}

/* ───────────────────────── Connections bar ───────────────────────── */
function ConnectionsBar({
  connections,
  loading,
  onRefresh,
}: {
  connections: MetaConnection[];
  loading: boolean;
  onRefresh: () => void;
}) {
  const pages = connections.filter((c) => c.kind === "facebook_page");
  const igs = connections.filter((c) => c.kind === "instagram");
  const ads = connections.filter((c) => c.kind === "ad_account");
  const tiktoks = connections.filter((c) => c.kind === "tiktok_account");

  if (!loading && connections.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
          <Megaphone className="h-8 w-8 text-muted-foreground/50" />
          <div>
            <p className="font-semibold">Connect your social accounts</p>
            <p className="mx-auto max-w-md text-sm text-muted-foreground">
              Link your Facebook Pages, Instagram business accounts, and TikTok accounts so
              scheduled posts publish automatically. Connect TikTok once per brand.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button asChild className="gap-1.5">
              <a href="/api/v1/marketing/meta/connect">
                <Facebook className="h-4 w-4" /> Connect Meta
              </a>
            </Button>
            <Button asChild variant="outline" className="gap-1.5">
              <a href="/api/v1/marketing/tiktok/connect">
                <Music2 className="h-4 w-4" /> Connect TikTok
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="flex flex-wrap items-center gap-2 p-3">
        <span className="mr-1 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/70">
          Connected
        </span>
        {pages.map((c) => (
          <ConnChip key={c.id} icon={Facebook} cls="text-[#1877F2]" label={c.name ?? "Page"} />
        ))}
        {igs.map((c) => (
          <ConnChip key={c.id} icon={Instagram} cls="text-[#E1306C]" label={c.name ?? "Instagram"} />
        ))}
        {ads.map((c) => (
          <ConnChip key={c.id} icon={Megaphone} cls="text-emerald-600" label={c.name ?? "Ad account"} />
        ))}
        {tiktoks.map((c) => (
          <ConnChip key={c.id} icon={Music2} cls="text-foreground" label={c.name ?? "TikTok"} />
        ))}
        {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        <Button asChild size="sm" variant="outline" className="ml-auto h-7 gap-1.5 text-xs">
          <a href="/api/v1/marketing/meta/connect">
            <RefreshCw className="h-3 w-3" /> Reconnect Meta
          </a>
        </Button>
        <Button asChild size="sm" variant="outline" className="h-7 gap-1.5 text-xs">
          <a href="/api/v1/marketing/tiktok/connect">
            <Music2 className="h-3 w-3" /> Add TikTok
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}

function ConnChip({ icon: Icon, cls, label }: { icon: typeof Facebook; cls: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card px-2.5 py-1 text-xs font-medium">
      <Icon className={cn("h-3.5 w-3.5", cls)} /> {label}
    </span>
  );
}

/* ───────────────────────── Schedule timeline ───────────────────────── */
function ScheduleTimeline({
  posts,
  loading,
  connections,
  onChanged,
}: {
  posts: SocialPost[];
  loading: boolean;
  connections: MetaConnection[];
  onChanged: () => void;
}) {
  const groups = useMemo(() => {
    const byDay = new Map<string, SocialPost[]>();
    for (const p of posts) {
      const k = dayKey(p.scheduledAt);
      const arr = byDay.get(k) ?? [];
      arr.push(p);
      byDay.set(k, arr);
    }
    return Array.from(byDay.entries());
  }, [posts]);

  const connName = (id: string | null) => connections.find((c) => c.id === id)?.name ?? null;

  if (loading && posts.length === 0) {
    return <p className="py-10 text-center text-sm text-muted-foreground">Loading schedule…</p>;
  }
  if (posts.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          Nothing scheduled yet. Hit <strong className="text-foreground">Schedule a post</strong>, or open a
          storyboard asset and choose <strong className="text-foreground">Schedule to Meta</strong>.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      {groups.map(([day, items]) => (
        <section key={day} className="space-y-2">
          <div className="flex items-center gap-2 border-b border-border/60 pb-1.5">
            <h3 className="text-sm font-semibold">{day}</h3>
            <Badge variant="secondary" className="rounded-full">{items.length}</Badge>
          </div>
          <div className="space-y-2">
            {items.map((p) => (
              <PostRow key={p.id} post={p} connName={connName(p.connectionId)} onChanged={onChanged} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function PostRow({
  post,
  connName,
  onChanged,
}: {
  post: SocialPost;
  connName: string | null;
  onChanged: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const Plat = PLATFORM_META[post.platform];
  const S = STATUS_META[post.status];

  const remove = async () => {
    if (busy) return;
    setBusy(true);
    await fetch(`/api/v1/marketing/posts/${post.id}`, { method: "DELETE" });
    onChanged();
  };

  const canDelete = post.status !== "publishing";

  return (
    <Card className="border-border/70">
      <CardContent className="flex items-center gap-3 p-2.5">
        {post.mediaUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- remote preview thumb
          <img src={post.mediaUrl} alt="" className="h-12 w-12 shrink-0 rounded-md object-cover" />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-muted">
            <Send className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <Plat.icon className={cn("h-3.5 w-3.5 shrink-0", Plat.cls)} />
            <span className="truncate text-xs font-medium">{connName ?? Plat.label}</span>
            <span className="text-[11px] text-muted-foreground">· {timeLabel(post.scheduledAt)}</span>
          </div>
          <p className="line-clamp-1 text-[11px] text-muted-foreground">{post.caption || "(no caption)"}</p>
          {post.status === "failed" && post.error && (
            <p className="line-clamp-1 text-[11px] text-red-600 dark:text-red-400" title={post.error}>{post.error}</p>
          )}
        </div>
        <Badge className={cn("shrink-0 gap-1 border-0 text-[10px]", S.cls)}>
          <S.icon className={cn("h-3 w-3", post.status === "publishing" && "animate-spin")} /> {S.label}
        </Badge>
        {canDelete && (
          <Button size="sm" variant="ghost" className="h-7 w-7 shrink-0 p-0 text-muted-foreground hover:text-red-600" onClick={remove} disabled={busy} aria-label="Delete">
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

/* ───────────────────────── Schedule dialog ───────────────────────── */
const MEDIA_TYPES: SocialMediaType[] = ["image", "video", "story", "reel", "text", "carousel"];
/** TikTok accepts a single video, a single image, or a multi-image carousel. */
const TIKTOK_TYPES: SocialMediaType[] = ["video", "image", "carousel"];

function ScheduleDialog({
  open,
  onOpenChange,
  connections,
  seed,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  connections: MetaConnection[];
  seed: SchedulePrefill | null;
  onSaved: () => void;
}) {
  const [platform, setPlatform] = useState<SocialPlatform>("facebook");
  const [connectionId, setConnectionId] = useState<string>("");
  const [caption, setCaption] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [carouselText, setCarouselText] = useState(""); // TikTok carousel: one image URL per line
  const [mediaType, setMediaType] = useState<SocialMediaType>("image");
  const [when, setWhen] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const eligible = connections.filter((c) =>
    platform === "facebook"
      ? c.kind === "facebook_page"
      : platform === "instagram"
        ? c.kind === "instagram"
        : c.kind === "tiktok_account",
  );

  // Keep the media type valid for the platform (TikTok = video | image | carousel).
  useEffect(() => {
    if (platform === "tiktok" && !TIKTOK_TYPES.includes(mediaType)) setMediaType("video");
  }, [platform, mediaType]);

  // Hydrate from a storyboard seed whenever the dialog opens with one.
  useEffect(() => {
    if (!open) return;
    setError(null);
    setCarouselText("");
    if (seed) {
      setCaption(seed.caption ?? "");
      setMediaUrl(seed.mediaUrl ?? "");
      if (seed.mediaType) setMediaType(seed.mediaType);
      if (seed.mediaType === "story" || seed.mediaType === "reel") setPlatform("instagram");
    }
  }, [open, seed]);

  // Keep the connection select valid for the chosen platform.
  useEffect(() => {
    if (eligible.length && !eligible.some((c) => c.id === connectionId)) {
      setConnectionId(eligible[0].id);
    }
    if (!eligible.length) setConnectionId("");
  }, [platform, connections, connectionId, eligible]);

  const submit = async () => {
    setError(null);
    if (!when || Number.isNaN(Date.parse(when))) {
      setError("Pick a date & time.");
      return;
    }
    if (platform === "instagram" && !mediaUrl) {
      setError("Instagram requires a public media URL.");
      return;
    }
    const carouselUrls =
      platform === "tiktok" && mediaType === "carousel"
        ? carouselText.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean)
        : null;
    if (platform === "tiktok") {
      if (carouselUrls) {
        if (carouselUrls.length < 2) {
          setError("A carousel needs at least 2 image URLs (one per line).");
          return;
        }
      } else if (!mediaUrl) {
        setError(
          mediaType === "image" ? "TikTok requires a public image URL." : "TikTok requires a public video URL.",
        );
        return;
      }
    }
    setSaving(true);
    const res = await fetch("/api/v1/marketing/posts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        platform,
        connectionId: connectionId || null,
        caption,
        mediaUrl: carouselUrls ? carouselUrls[0] : mediaUrl || null,
        mediaUrls: carouselUrls,
        mediaType,
        scheduledAt: new Date(when).toISOString(),
        campaign: seed?.campaign ?? null,
        assetId: seed?.assetId ?? null,
        series: seed?.series ?? null,
        sequence: seed?.sequence ?? null,
      }),
    });
    setSaving(false);
    const json = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
    if (!res.ok || !json?.ok) {
      setError(json?.error ?? "Could not schedule.");
      return;
    }
    onSaved();
  };

  const isTikTokCarousel = platform === "tiktok" && mediaType === "carousel";
  const urlLabel =
    platform === "tiktok"
      ? mediaType === "image"
        ? "Image URL (public https)"
        : "Video URL (public https)"
      : "Media URL (public https)";
  const urlPlaceholder =
    platform === "tiktok" && mediaType !== "image" ? "https://…/video.mp4" : "https://…/image.jpg";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogTitle className="flex items-center gap-2">
          <CalendarClock className="h-5 w-5 text-primary" /> Schedule a post
        </DialogTitle>

        <div className="space-y-4 pt-2">
          {/* platform */}
          <Field label="Platform">
            <div className="inline-flex rounded-lg border border-border/60 bg-muted/30 p-0.5">
              {(["facebook", "instagram", "tiktok"] as SocialPlatform[]).map((p) => {
                const M = PLATFORM_META[p];
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPlatform(p)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                      platform === p ? "bg-card text-foreground shadow-sm ring-1 ring-inset ring-border/60" : "text-muted-foreground",
                    )}
                  >
                    <M.icon className={cn("h-3.5 w-3.5", M.cls)} /> {M.label}
                  </button>
                );
              })}
            </div>
          </Field>

          {/* connection */}
          <Field label="Account">
            {eligible.length ? (
              <select
                value={connectionId}
                onChange={(e) => setConnectionId(e.target.value)}
                className="h-9 w-full rounded-md border border-border/60 bg-card px-2 text-sm"
              >
                {eligible.map((c) => (
                  <option key={c.id} value={c.id}>{c.name ?? c.externalId}</option>
                ))}
              </select>
            ) : platform === "tiktok" ? (
              <p className="text-xs text-muted-foreground">
                No connected TikTok account.{" "}
                <a className="text-primary underline" href="/api/v1/marketing/tiktok/connect">Connect TikTok</a>.
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                No connected {platform === "facebook" ? "Page" : "Instagram account"}.{" "}
                <a className="text-primary underline" href="/api/v1/marketing/meta/connect">Connect Meta</a>.
              </p>
            )}
          </Field>

          {/* caption */}
          <Field label="Caption">
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
              placeholder="Write the caption…"
              className="w-full rounded-md border border-border/60 bg-card px-2.5 py-2 text-sm"
            />
          </Field>

          {/* media + type */}
          <div className="grid grid-cols-[1fr_auto] gap-2">
            {isTikTokCarousel ? (
              <Field label="Image URLs — one per line (2–35)">
                <textarea
                  value={carouselText}
                  onChange={(e) => setCarouselText(e.target.value)}
                  rows={4}
                  placeholder={"https://…/slide-1.jpg\nhttps://…/slide-2.jpg"}
                  className="w-full rounded-md border border-border/60 bg-card px-2.5 py-2 font-mono text-xs"
                />
              </Field>
            ) : (
              <Field label={urlLabel}>
                <Input
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder={urlPlaceholder}
                  className="h-9 text-sm"
                />
              </Field>
            )}
            <Field label="Type">
              <select
                value={mediaType}
                onChange={(e) => setMediaType(e.target.value as SocialMediaType)}
                className="h-9 rounded-md border border-border/60 bg-card px-2 text-sm capitalize"
              >
                {(platform === "tiktok" ? TIKTOK_TYPES : MEDIA_TYPES).map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </Field>
          </div>

          {/* when */}
          <Field label="Publish at">
            <Input type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} className="h-9 text-sm" />
          </Field>

          {error && (
            <p className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
              <AlertCircle className="h-3.5 w-3.5" /> {error}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
            <Button onClick={submit} disabled={saving} className="gap-1.5">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarClock className="h-4 w-4" />}
              Schedule
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/70">{label}</span>
      {children}
    </label>
  );
}

/* ───────────────────────── connect banner ───────────────────────── */
function useConnectBanner(): ReactNode {
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const meta = sp.get("meta");
    const tiktok = sp.get("tiktok");
    if (meta === "connected") {
      setMsg({ kind: "ok", text: `Connected Meta — ${sp.get("assets") ?? "0"} assets (${sp.get("pages") ?? 0} pages, ${sp.get("ig") ?? 0} IG, ${sp.get("ads") ?? 0} ad accounts).` });
    } else if (meta === "error") {
      setMsg({ kind: "err", text: `Couldn't connect Meta: ${sp.get("reason") ?? "unknown error"}.` });
    } else if (tiktok === "connected") {
      setMsg({ kind: "ok", text: `Connected TikTok — ${sp.get("name") ?? "account"}.` });
    } else if (tiktok === "error") {
      setMsg({ kind: "err", text: `Couldn't connect TikTok: ${sp.get("reason") ?? "unknown error"}.` });
    }
    if (meta || tiktok) {
      const url = new URL(window.location.href);
      ["meta", "tiktok", "assets", "pages", "ig", "ads", "name", "reason"].forEach((k) => url.searchParams.delete(k));
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  if (!msg) return null;
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border p-3 text-sm",
        msg.kind === "ok"
          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
          : "border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-300",
      )}
    >
      {msg.kind === "ok" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
      {msg.text}
    </div>
  );
}

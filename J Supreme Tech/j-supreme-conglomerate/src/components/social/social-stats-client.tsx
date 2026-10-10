"use client";

import { useMemo } from "react";
import { Heart, MessageCircle, Users, Image, Film, Grid3x3, TrendingUp, AlertCircle, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SocialStatsResult, IgAccountStats, FbPageStats, IgPost } from "@/lib/data/social-stats";

// ---- helpers -----------------------------------------------------------------

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function timeAgo(iso: string): string {
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60_000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days}d ago`;
    return `${Math.floor(days / 30)}mo ago`;
  } catch {
    return iso;
  }
}

function mediaIcon(type: string) {
  if (type === "VIDEO") return <Film className="h-3 w-3" />;
  if (type === "CAROUSEL_ALBUM") return <Grid3x3 className="h-3 w-3" />;
  return <Image className="h-3 w-3" />;
}

// ---- stat card ---------------------------------------------------------------

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 rounded-lg bg-muted/40 px-4 py-2.5 text-center">
      <span className="text-lg font-bold tabular-nums text-foreground">{value}</span>
      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
    </div>
  );
}

// ---- IG post row -------------------------------------------------------------

function IgPostRow({ post }: { post: IgPost }) {
  const engagement = post.likeCount + post.commentsCount;
  return (
    <div className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted/30 transition-colors">
      {post.thumbnailUrl || post.mediaUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.thumbnailUrl ?? post.mediaUrl ?? ""}
          alt=""
          className="h-10 w-10 shrink-0 rounded-md object-cover bg-muted"
          loading="lazy"
        />
      ) : (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
          {mediaIcon(post.mediaType)}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs text-muted-foreground">
          {post.caption?.slice(0, 72) ?? <span className="italic opacity-50">no caption</span>}
        </p>
        <p className="mt-0.5 text-[10px] text-muted-foreground/60">{timeAgo(post.timestamp)}</p>
      </div>
      <div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><Heart className="h-3 w-3 text-rose-400" />{fmt(post.likeCount)}</span>
        <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3 text-sky-400" />{fmt(post.commentsCount)}</span>
      </div>
    </div>
  );
}

// ---- IG account card --------------------------------------------------------

function IgCard({ account }: { account: IgAccountStats }) {
  const topPost = useMemo(
    () =>
      [...account.recentPosts].sort(
        (a, b) => b.likeCount + b.commentsCount - (a.likeCount + a.commentsCount),
      )[0] ?? null,
    [account.recentPosts],
  );

  return (
    <div className="rounded-xl border border-border/60 bg-card p-5 flex flex-col gap-4">
      {/* header */}
      <div className="flex items-center gap-3">
        {account.profilePictureUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={account.profilePictureUrl}
            alt={account.username}
            className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-border"
          />
        ) : (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-pink-600 text-white font-bold text-lg">
            {account.username[0]?.toUpperCase() ?? "I"}
          </div>
        )}
        <div className="min-w-0">
          <p className="font-semibold text-sm text-foreground">@{account.username}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">Instagram</p>
        </div>
        {account.error && (
          <span className="ml-auto flex items-center gap-1 text-[10px] text-destructive">
            <AlertCircle className="h-3 w-3" />
            {account.error.slice(0, 40)}
          </span>
        )}
      </div>

      {/* stats */}
      <div className="grid grid-cols-3 gap-2">
        <StatChip label="Followers" value={fmt(account.followersCount)} />
        <StatChip label="Following" value={fmt(account.followsCount)} />
        <StatChip label="Posts" value={fmt(account.mediaCount)} />
      </div>

      {/* top post highlight */}
      {topPost && (
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground/60">
            Top Post (last 9)
          </p>
          <IgPostRow post={topPost} />
        </div>
      )}

      {/* recent posts */}
      {account.recentPosts.length > 0 && (
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground/60">
            Recent Posts
          </p>
          <div className="divide-y divide-border/40">
            {account.recentPosts.slice(0, 6).map((p) => (
              <IgPostRow key={p.id} post={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---- FB page card -----------------------------------------------------------

function FbCard({ page }: { page: FbPageStats }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-5 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        {page.pictureUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={page.pictureUrl}
            alt={page.name}
            className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-border"
          />
        ) : (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-lg">
            {page.name[0]?.toUpperCase() ?? "F"}
          </div>
        )}
        <div className="min-w-0">
          <p className="font-semibold text-sm text-foreground">{page.name}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">Facebook Page</p>
        </div>
        {page.error && (
          <span className="ml-auto flex items-center gap-1 text-[10px] text-destructive">
            <AlertCircle className="h-3 w-3" />
            {page.error.slice(0, 40)}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <StatChip label="Page Likes" value={fmt(page.fanCount)} />
        <StatChip label="Followers" value={fmt(page.followersCount)} />
      </div>

      {page.recentPosts.length > 0 && (
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground/60">Recent Posts</p>
          <div className="divide-y divide-border/40 text-xs">
            {page.recentPosts.map((p) => (
              <div key={p.id} className="flex items-start gap-3 px-2 py-2 hover:bg-muted/30 rounded-lg transition-colors">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs text-muted-foreground">
                    {p.message?.slice(0, 80) ?? <span className="italic opacity-50">no text</span>}
                  </p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground/60">{timeAgo(p.createdTime)}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3 text-muted-foreground">
                  <span className="flex items-center gap-1"><Heart className="h-3 w-3 text-rose-400" />{fmt(p.reactions)}</span>
                  <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3 text-sky-400" />{fmt(p.comments)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---- summary bar ------------------------------------------------------------

function SummaryBar({ data }: { data: SocialStatsResult }) {
  const totalFollowers = [
    ...data.instagram.map((a) => a.followersCount),
    ...data.facebook.map((p) => p.fanCount),
  ].reduce((s, n) => s + n, 0);

  const totalAccounts = data.instagram.length + data.facebook.length;

  const totalEngagement = data.instagram.flatMap((a) =>
    a.recentPosts.map((p) => p.likeCount + p.commentsCount),
  ).reduce((s, n) => s + n, 0);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-6">
      {[
        { icon: Users, label: "Total Accounts", value: String(totalAccounts), color: "text-primary" },
        { icon: TrendingUp, label: "Total Reach", value: fmt(totalFollowers), color: "text-emerald-500" },
        { icon: Heart, label: "Recent Engagement", value: fmt(totalEngagement), color: "text-rose-400" },
        { icon: BarChart2, label: "IG Accounts", value: String(data.instagram.length), color: "text-fuchsia-500" },
      ].map(({ icon: Icon, label, value, color }) => (
        <div key={label} className="flex items-center gap-3 rounded-xl border border-border/60 bg-card px-4 py-3">
          <Icon className={cn("h-5 w-5 shrink-0", color)} />
          <div>
            <p className="text-base font-bold tabular-nums">{value}</p>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---- main export ------------------------------------------------------------

export function SocialStatsClient({ data }: { data: SocialStatsResult }) {
  const hasAny = data.instagram.length > 0 || data.facebook.length > 0;

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground">Social Media Stats</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Live data from {data.instagram.length + data.facebook.length} connected accounts ·{" "}
          fetched {timeAgo(data.fetchedAt)}
        </p>
      </div>

      {!hasAny ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 py-16 text-center">
          <BarChart2 className="h-10 w-10 text-muted-foreground/40 mb-3" />
          <p className="text-sm font-medium text-muted-foreground">No accounts connected</p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Connect Instagram or Facebook pages in{" "}
            <a href="/marketing" className="underline underline-offset-2">Marketing</a>.
          </p>
        </div>
      ) : (
        <>
          <SummaryBar data={data} />
          <div className="grid gap-5 lg:grid-cols-2">
            {data.instagram.map((account) => (
              <IgCard key={account.connectionId} account={account} />
            ))}
            {data.facebook.map((page) => (
              <FbCard key={page.connectionId} page={page} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

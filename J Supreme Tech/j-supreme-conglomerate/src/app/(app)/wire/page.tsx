import { Radio, ArrowUpRight, RefreshCw } from "lucide-react";

// The Wire — mirrors the daily curated feed published on jsupremetech.online.
// Single source of truth: the JST site's /blog/wire.json (refreshed every
// morning by the `daily-jst-wire` scheduled task). We just read it live here.

export const revalidate = 600;

const FEED = "https://jsupremetech.online/blog/wire.json";

type WireItem = {
  title: string;
  source: string;
  url: string;
  summary: string;
  category: string;
  date: string;
  label: string;
  cover: string | null;
};

type WireFeed = { updated: string | null; count: number; items: WireItem[] };

async function getWire(): Promise<WireFeed | null> {
  try {
    const res = await fetch(FEED, { next: { revalidate: 600 } });
    if (!res.ok) return null;
    return (await res.json()) as WireFeed;
  } catch {
    return null;
  }
}

function formatDate(iso: string | null): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[m - 1]} ${d}, ${y}`;
}

export default async function WirePage() {
  const feed = await getWire();
  const items = feed?.items ?? [];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-muted-foreground">
            <Radio className="h-5 w-5" />
            <span className="text-xs font-medium uppercase tracking-[0.2em]">The Signal · The Wire</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">The Wire</h1>
          <p className="max-w-2xl text-muted-foreground">
            Today&apos;s curated read across AI, science, technology, markets, education and big ideas —
            measured commentary, linked to source. Refreshed automatically each morning.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {feed?.updated && (
            <span className="inline-flex items-center gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" />
              Updated {formatDate(feed.updated)}
            </span>
          )}
          <a
            href="https://jsupremetech.online/blog/wire"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 transition-colors hover:bg-muted/50 hover:text-foreground"
          >
            View on site <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>
      </div>

      {items.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((w, i) => (
            <a
              key={i}
              href={w.url}
              target="_blank"
              rel="noreferrer noopener"
              className="group flex flex-col overflow-hidden rounded-xl border border-border/70 bg-card/60 transition-all hover:border-primary/40 hover:bg-card hover:shadow-lg"
            >
              {w.cover && (
                <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={w.cover}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className="h-full w-full object-cover grayscale transition duration-500 group-hover:scale-[1.04]"
                  />
                  <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/55 px-2.5 py-0.5 font-mono text-[0.56rem] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
                    {w.label}
                  </span>
                </div>
              )}
              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-center gap-2">
                  {!w.cover && (
                    <span className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[0.56rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      {w.label}
                    </span>
                  )}
                  <span className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-muted-foreground/70">
                    {w.source}
                  </span>
                  <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground/50 transition group-hover:text-primary" />
                </div>
                <h2 className="mt-2 font-semibold leading-snug tracking-tight text-foreground group-hover:text-primary">
                  {w.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{w.summary}</p>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
          <p>The Wire feed is unavailable right now.</p>
          <p className="mt-1 text-sm">
            It refreshes each morning —{" "}
            <a
              href="https://jsupremetech.online/blog/wire"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-foreground"
            >
              view it on the site
            </a>
            .
          </p>
        </div>
      )}

      <p className="text-xs leading-relaxed text-muted-foreground/60">
        The Wire links to third-party sources for reference and commentary. Headlines and summaries are
        written by J Supreme Tech; source content is not republished. Trademarks and copyrights belong to
        their respective owners.
      </p>
    </div>
  );
}

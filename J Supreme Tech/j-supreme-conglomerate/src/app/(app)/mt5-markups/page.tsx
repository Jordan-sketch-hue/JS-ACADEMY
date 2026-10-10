import { CandlestickChart, ExternalLink, ShieldAlert, Wifi } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Mt5DashboardIframe } from "./dashboard-iframe";

export const dynamic = "force-dynamic";

// The bot runs locally on the trading PC (it needs the MetaTrader5 terminal), so the
// URL is configurable. Default is the LAN address; set NEXT_PUBLIC_MT5_DASHBOARD_URL
// to a tunnelled HTTPS URL and it embeds inline automatically.
const DASH_URL =
  process.env.NEXT_PUBLIC_MT5_DASHBOARD_URL?.trim() || "http://192.168.1.83:8800";

export default function Mt5MarkupsPage() {
  const isHttps = DASH_URL.startsWith("https://");
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <CandlestickChart className="h-6 w-6 text-emerald-400" /> MT5 Markups
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Multi-timeframe previous-candle levels, market structure (BOS / CHoCH /
            trend), RSI &amp; volume, and live order routing for your Deriv Volatility
            75 / 90 (1s) charts.
          </p>
        </div>
        <Button asChild>
          <a
            href={DASH_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="gap-2"
          >
            Open dashboard <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </div>

      {isHttps ? (
        <Mt5DashboardIframe url={DASH_URL} />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Wifi className="h-4 w-4 text-sky-400" /> Local dashboard
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              The bot runs on your PC (it needs the MT5 terminal), so it can&apos;t be
              embedded over HTTPS here. Open it directly:
            </p>
            <p className="break-all font-mono text-foreground">{DASH_URL}</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                On the same Wi-Fi as the PC, the link above opens on any device.
              </li>
              <li>
                For access anywhere, expose it via a tunnel and set{" "}
                <code className="font-mono">NEXT_PUBLIC_MT5_DASHBOARD_URL</code> to the
                HTTPS URL — it will then embed inline on this page.
              </li>
            </ul>
            <div className="flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 p-3 text-amber-200">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                Live order routing is armed on this dashboard. Don&apos;t put it on a
                public URL without auth — keep it on your private network (Tailscale) or
                behind Cloudflare Access.
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

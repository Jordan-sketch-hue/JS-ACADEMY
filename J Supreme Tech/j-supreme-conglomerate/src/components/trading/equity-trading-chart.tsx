"use client";

import { useId } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { EquityCurvePoint } from "@/lib/data/trading-metrics";

export function TradingEquityChart({ data }: { data: EquityCurvePoint[] }) {
  const gid = useId().replace(/:/g, "");

  if (!data.length) {
    return (
      <div className="flex h-[220px] items-center justify-center rounded-lg border border-dashed border-border/60 text-sm text-muted-foreground">
        No closed market deals yet — sync MT5 deals with realized P/L to plot the equity curve.
      </div>
    );
  }

  return (
    <div className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
          <defs>
            <linearGradient id={`eq-${gid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(142 70% 45%)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="hsl(142 70% 45%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${Number(v).toLocaleString()}`}
            width={64}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            formatter={(v: number) => [`$${Number(v).toLocaleString()}`, "Cumulative P/L"]}
            labelFormatter={(_, pts) =>
              pts?.[0]?.payload?.dealTime
                ? new Date(String(pts[0].payload.dealTime)).toLocaleString()
                : ""
            }
          />
          <Area
            type="stepAfter"
            dataKey="cumulative"
            stroke="hsl(142 70% 40%)"
            fill={`url(#eq-${gid})`}
            strokeWidth={2}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CashFlowPoint } from "@/lib/budget/compute";
import { formatCurrency } from "@/lib/utils";

function symbolOf(currency: string): string {
  try {
    const parts = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).formatToParts(0);
    return parts.find((p) => p.type === "currency")?.value ?? "$";
  } catch {
    return "$";
  }
}

function compact(n: number, currency: string): string {
  const sym = symbolOf(currency);
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (abs >= 1000) {
    const k = abs / 1000;
    const txt = k >= 10 ? String(Math.round(k)) : String(Math.round(k * 10) / 10);
    return `${sign}${sym}${txt}k`;
  }
  return `${sign}${sym}${Math.round(abs)}`;
}

export function CashFlowChart({
  data,
  currency,
}: {
  data: CashFlowPoint[];
  currency: string;
}) {
  const hasData = data.some((d) => d.income !== 0 || d.expense !== 0);
  if (!hasData) {
    return (
      <div className="flex h-[260px] items-center justify-center rounded-lg border border-dashed border-border/60 text-center text-sm text-muted-foreground">
        No cash flow yet — add transactions or import paid invoices.
      </div>
    );
  }
  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            width={52}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => compact(Number(v), currency)}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            labelStyle={{ color: "hsl(var(--foreground))" }}
            formatter={(v: any, name: any) => [
              formatCurrency(Number(v), currency),
              name,
            ]}
          />
          <Legend wrapperStyle={{ fontSize: 11, paddingTop: 4 }} />
          <Bar dataKey="income" name="Income" fill="#10b981" radius={[3, 3, 0, 0]} maxBarSize={26} />
          <Bar dataKey="expense" name="Expense" fill="#f43f5e" radius={[3, 3, 0, 0]} maxBarSize={26} />
          <Line
            type="monotone"
            dataKey="net"
            name="Net"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

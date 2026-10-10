"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { CategorySlice } from "@/lib/budget/compute";
import { formatCurrency } from "@/lib/utils";

export function SpendingDonut({
  data,
  currency,
}: {
  data: CategorySlice[];
  currency: string;
}) {
  if (!data.length) {
    return (
      <div className="flex h-[260px] items-center justify-center rounded-lg border border-dashed border-border/60 text-center text-sm text-muted-foreground">
        No spending recorded this month.
      </div>
    );
  }
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div className="relative h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={70}
            outerRadius={104}
            paddingAngle={2}
            stroke="hsl(var(--card))"
            strokeWidth={2}
          >
            {data.map((d) => (
              <Cell key={d.name} fill={d.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            formatter={(v: any, name: any) => [
              formatCurrency(Number(v), currency),
              name,
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Spent
        </span>
        <span className="text-lg font-semibold tabular-nums">
          {formatCurrency(total, currency)}
        </span>
      </div>
    </div>
  );
}

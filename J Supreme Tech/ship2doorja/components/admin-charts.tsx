"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { monthlyVolume, statusBreakdown } from "@/lib/demo-data";

const tooltipStyle = {
  background: "#0d1526",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 12,
  color: "#fff",
  fontSize: 12,
};

export function VolumeChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={monthlyVolume} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="vol" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#27B9FF" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#27B9FF" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
        <XAxis dataKey="m" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "#27B9FF", strokeWidth: 1 }} />
        <Area type="monotone" dataKey="shipments" stroke="#27B9FF" strokeWidth={2.5} fill="url(#vol)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function StatusDonut() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={statusBreakdown}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={58}
          outerRadius={90}
          paddingAngle={3}
          stroke="none"
        >
          {statusBreakdown.map((s) => (
            <Cell key={s.name} fill={s.color} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
      </PieChart>
    </ResponsiveContainer>
  );
}

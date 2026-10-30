import React from "react";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  style?: React.CSSProperties;
}

export function Skeleton({ width = "100%", height = 16, borderRadius = 8, style }: SkeletonProps) {
  return (
    <div style={{
      width,
      height,
      borderRadius,
      background: "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
      backgroundSize: "200% 100%",
      animation: "skeleton-shimmer 1.4s ease infinite",
      ...style,
    }} />
  );
}

export function SkeletonCard({ rows = 3 }: { rows?: number }) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
      <Skeleton height={20} width="60%" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} height={14} width={i === rows - 1 ? "40%" : "100%"} />
      ))}
    </div>
  );
}

export function SkeletonGrid({ count = 6, columns = 3 }: { count?: number; columns?: number }) {
  return (
    <>
      <style>{`@keyframes skeleton-shimmer{0%{background-position:200% 0}to{background-position:-200% 0}}`}</style>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 16 }}>
        {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    </>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <>
      <style>{`@keyframes skeleton-shimmer{0%{background-position:200% 0}to{background-position:-200% 0}}`}</style>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Skeleton height={40} borderRadius={8} style={{ background: "#f9fafb" }} />
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 12, padding: "12px 0", borderBottom: "1px solid #f3f4f6" }}>
            <Skeleton height={14} />
            <Skeleton height={14} width="80%" />
            <Skeleton height={14} width="60%" />
            <Skeleton height={14} width="50%" />
          </div>
        ))}
      </div>
    </>
  );
}

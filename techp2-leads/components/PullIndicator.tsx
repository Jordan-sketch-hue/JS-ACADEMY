"use client";
import { RefreshCw } from "lucide-react";

export function PullIndicator({ delta, threshold, refreshing }: { delta: number; threshold: number; refreshing: boolean }) {
  const progress = Math.min(delta / threshold, 1);
  if (delta < 10 && !refreshing) return null;
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
      style={{ transform: `translateY(${Math.min(delta * 0.6, 48)}px)`, opacity: progress }}>
      <div className="bg-[#C9930C] text-black rounded-full w-9 h-9 flex items-center justify-center shadow-lg">
        <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
          style={{ transform: `rotate(${progress * 360}deg)` }} />
      </div>
    </div>
  );
}

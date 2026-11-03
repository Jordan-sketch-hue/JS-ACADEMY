"use client";
import { useEffect, useRef, useState } from "react";

export function usePullToRefresh(onRefresh: () => Promise<void> | void) {
  const startY = useRef(0);
  const [refreshing, setRefreshing] = useState(false);
  const [pullDelta, setPullDelta] = useState(0);
  const threshold = 80;

  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) startY.current = e.touches[0].clientY;
      else startY.current = 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!startY.current) return;
      const delta = e.touches[0].clientY - startY.current;
      if (delta > 0 && delta < 150) setPullDelta(delta);
    };
    const onTouchEnd = async () => {
      if (pullDelta >= threshold && !refreshing) {
        setRefreshing(true);
        await onRefresh();
        setRefreshing(false);
      }
      setPullDelta(0);
      startY.current = 0;
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [onRefresh, pullDelta, refreshing]);

  return { refreshing, pullDelta, threshold };
}

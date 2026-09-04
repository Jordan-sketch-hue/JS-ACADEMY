"use client";
import { useEffect, useRef, useState } from "react";

interface Props {
  name: string;
  value: number;
  color: string;
}

export function ProcedureBar({ name, value, color }: Props) {
  const [animate, setAnimate] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimate(true); },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate">{name}</span>
        <span className="font-semibold text-ink">{value}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-surface">
        <div
          className={`h-full rounded-full origin-left ${animate ? "bar-spring" : ""}`}
          style={{
            width: `${value}%`,
            background: color,
            transform: animate ? undefined : "scaleX(0)",
          }}
        />
      </div>
    </div>
  );
}

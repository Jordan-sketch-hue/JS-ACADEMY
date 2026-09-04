"use client";
import { useEffect, useRef, useState } from "react";
import { Spark } from "@/components/Spark";

interface KPIItem {
  label: string;
  value: string;
  delta: string;
  up: boolean;
  spark: number[];
}

export function AnimatedKPICard({ item }: { item: KPIItem }) {
  const [pop, setPop] = useState(false);
  const [displayVal, setDisplayVal] = useState(item.value);
  const cycle = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      cycle.current += 1;
      if (cycle.current % 3 === 0) {
        setDisplayVal(item.value);
      }
      setPop(true);
      setTimeout(() => setPop(false), 400);
    }, 6000 + Math.random() * 3000);
    return () => clearInterval(id);
  }, [item.value]);

  return (
    <div className="card rounded-2xl bg-white p-5 shadow-card hover:shadow-card-hover transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate">{item.label}</span>
        <span className={`text-xs font-semibold ${item.up ? "text-teal" : "text-alert"}`}>{item.delta}</span>
      </div>
      <div className={`mt-2 text-3xl font-semibold text-ink transition-all ${pop ? "value-pop" : ""}`}>
        {displayVal}
      </div>
      <div className="mt-3">
        <Spark data={item.spark} color={item.up ? "#0D9488" : "#EF4444"} />
      </div>
    </div>
  );
}

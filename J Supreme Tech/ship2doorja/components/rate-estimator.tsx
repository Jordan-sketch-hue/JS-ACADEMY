"use client";

import { useState } from "react";
import { Package, Send } from "lucide-react";
import { site } from "@/lib/site";

const categories = ["Clothing", "Shoes", "Electronics", "Documents", "Mixed"];

export function RateEstimator() {
  const [weight, setWeight] = useState(6);
  const [cat, setCat] = useState("Clothing");

  // Parcel grows with weight: 64px (1lb) → 132px (50lb).
  const size = 64 + (Math.min(weight, 50) / 50) * 68;

  function getQuote() {
    const text = encodeURIComponent(
      `Hi Ship 2 Door JA! 👋 I'd like a quote for a ~${weight} lb ${cat} package from the U.S. to Jamaica. What's my rate?`
    );
    window.open(`${site.contact.whatsappHref}?text=${text}`, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-slate-200/80">
      <div className="grid md:grid-cols-2">
        {/* Visual */}
        <div className="grain relative flex flex-col items-center justify-center gap-4 bg-navy-gradient p-10 text-white">
          <div
            className="flex items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 transition-all duration-300"
            style={{ width: size + 40, height: size + 40 }}
          >
            <Package style={{ width: size, height: size }} className="text-sky-light transition-all duration-300" strokeWidth={1.4} />
          </div>
          <div className="text-center">
            <div className="text-5xl font-black" style={{ fontFamily: "var(--font-display)" }}>
              {weight}
              <span className="text-2xl text-sky-light"> lb</span>
            </div>
            <p className="text-sm text-mist/70">{cat} · USA → Jamaica</p>
          </div>
        </div>

        {/* Controls */}
        <div className="p-8 sm:p-10">
          <h2 className="text-2xl font-extrabold text-navy">Build your shipment</h2>
          <p className="mt-2 text-sm text-slate-600">
            Slide to your package weight, pick what's inside, and we'll send you an
            exact, all-in quote — no fake numbers, just your real cost.
          </p>

          <label htmlFor="wt" className="mt-7 block text-sm font-bold text-navy">
            Approx. weight: <span className="text-blue">{weight} lb</span>
          </label>
          <input
            id="wt"
            type="range"
            min={1}
            max={50}
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            className="mt-3 w-full cursor-pointer accent-sky"
          />
          <div className="mt-1 flex justify-between text-xs text-slate-400">
            <span>1 lb</span>
            <span>50 lb</span>
          </div>

          <p className="mt-6 text-sm font-bold text-navy">What are you shipping?</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                className={
                  "rounded-full px-4 py-2 text-sm font-semibold transition-colors " +
                  (cat === c
                    ? "bg-sky text-navy-deep shadow"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200")
                }
              >
                {c}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={getQuote}
            className="group mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky px-6 py-3.5 text-base font-bold text-navy-deep shadow-lg shadow-sky/30 transition-all hover:bg-sky-light active:scale-[0.98]"
          >
            <Send className="h-5 w-5" />
            Get my exact quote
          </button>
          <p className="mt-3 text-center text-xs text-slate-400">
            Free U.S. address · no sign-up fee · pay only when you ship
          </p>
        </div>
      </div>
    </div>
  );
}

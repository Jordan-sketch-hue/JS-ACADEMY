"use client";

import { useEffect, useRef, useState } from "react";

// Embeddable economic calendar (high-impact forex/macro events with
// actual/forecast/previous). We use TradingView's events widget because
// Forex Factory and Myfxbook both send X-Frame-Options: SAMEORIGIN and
// cannot be iframed. This widget is built for embedding and themes to match
// the app (it re-injects when the app theme flips light/dark).

function useIsDark(): boolean {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const el = document.documentElement;
    const read = () =>
      setDark(el.classList.contains("dark") || el.getAttribute("data-theme") === "dark");
    read();
    const obs = new MutationObserver(read);
    obs.observe(el, { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => obs.disconnect();
  }, []);
  return dark;
}

export function EconomicCalendar({ height = 720 }: { height?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const dark = useIsDark();

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    container.innerHTML = '<div class="tradingview-widget-container__widget"></div>';

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-events.js";
    script.async = true;
    script.type = "text/javascript";
    script.innerHTML = JSON.stringify({
      colorTheme: dark ? "dark" : "light",
      isTransparent: true,
      width: "100%",
      height,
      locale: "en",
      // 0 = holidays/low, 1 = medium/high. Keeps the feed to events that move markets.
      importanceFilter: "0,1",
      // Major economies most relevant to FX + the Caribbean/Americas trade context.
      countryFilter: "us,eu,gb,jp,cn,ca,au,nz,ch,de,fr",
    });

    container.appendChild(script);

    return () => {
      container.innerHTML = "";
    };
  }, [dark, height]);

  return <div className="tradingview-widget-container h-full w-full" ref={ref} />;
}

"use client";

import { useEffect, useState } from "react";
import { Sun, Moon, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark" | "color";

const OPTIONS: { value: Theme; icon: typeof Sun; label: string }[] = [
  { value: "light", icon: Sun, label: "Light" },
  { value: "dark", icon: Moon, label: "Dark" },
  { value: "color", icon: Palette, label: "Color" },
];

function applyTheme(t: Theme) {
  const el = document.documentElement;
  el.setAttribute("data-theme", t);
  el.classList.toggle("dark", t !== "light");
  try {
    localStorage.setItem("jsc-theme", t);
  } catch {
    /* ignore */
  }
}

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const cur = document.documentElement.getAttribute("data-theme") as Theme | null;
    setTheme(cur === "dark" || cur === "color" ? cur : "light");
    setMounted(true);
  }, []);

  const choose = (t: Theme) => {
    setTheme(t);
    applyTheme(t);
  };

  return (
    <div
      className="inline-flex items-center rounded-full border border-border bg-card/60 p-0.5"
      role="group"
      aria-label="Theme"
    >
      {OPTIONS.map((o) => {
        const active = mounted && theme === o.value;
        const Icon = o.icon;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => choose(o.value)}
            title={`${o.label} theme`}
            aria-label={`${o.label} theme`}
            aria-pressed={active}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full transition-colors",
              active
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="h-3.5 w-3.5" />
          </button>
        );
      })}
    </div>
  );
}

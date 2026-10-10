"use client";

import { useEffect } from "react";
import { useUiStore } from "@/stores/ui-store";

export function KeyboardShortcuts() {
  const toggleCommand = useUiStore((s) => s.toggleCommand);
  const toggleAiPanel = useUiStore((s) => s.toggleAiPanel);
  const toggleFocus = useUiStore((s) => s.toggleFocusMode);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key.toLowerCase() === "k") {
        e.preventDefault();
        toggleCommand();
      }
      if (meta && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        toggleAiPanel();
      }
      if (meta && e.shiftKey && e.key.toLowerCase() === "f") {
        e.preventDefault();
        toggleFocus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleCommand, toggleAiPanel, toggleFocus]);

  return null;
}

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Share } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function InstallApp() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    const nav = window.navigator as Navigator & { standalone?: boolean };
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      nav.standalone === true;
    if (standalone) setInstalled(true);

    setIsIOS(/iphone|ipad|ipod/i.test(nav.userAgent));

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  // Hide once installed; only show when we can prompt (Chrome/Edge/Android) or on iOS.
  if (installed || (!deferred && !isIOS)) return null;

  const onClick = async () => {
    if (deferred) {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice.outcome === "accepted") setInstalled(true);
      setDeferred(null);
      return;
    }
    setShowHelp((v) => !v);
  };

  return (
    <div className="relative">
      <Button variant="outline" size="sm" className="gap-1.5" onClick={onClick}>
        <Download className="h-4 w-4" />
        <span className="hidden sm:inline">Install app</span>
        <span className="sm:hidden">Install</span>
      </Button>
      {showHelp ? (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-lg border border-border bg-popover p-3 text-xs leading-relaxed text-popover-foreground shadow-lg">
          <p className="flex items-center gap-1.5 font-medium">
            <Share className="h-3.5 w-3.5" /> Install on iPhone / iPad
          </p>
          <p className="mt-1 text-muted-foreground">
            Tap the <strong>Share</strong> button in Safari, then{" "}
            <strong>Add to Home Screen</strong>.
          </p>
        </div>
      ) : null}
    </div>
  );
}

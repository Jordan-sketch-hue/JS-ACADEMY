"use client";
import { useEffect, useState } from "react";
import { Download, X, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstallBanner() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Already installed?
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setInstalled(true);
      return;
    }

    // iOS detection
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(ios);

    // Check if dismissed before
    const isDismissed = localStorage.getItem("pwa-install-dismissed");
    if (isDismissed) setDismissed(true);

    // Android / Chrome install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);

    window.addEventListener("appinstalled", () => {
      setInstalled(true);
      setPrompt(null);
    });

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") setInstalled(true);
    setPrompt(null);
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem("pwa-install-dismissed", "1");
  };

  if (installed || dismissed) return null;

  // Android Chrome — native install prompt available
  if (prompt) {
    return (
      <div className="fixed bottom-20 left-3 right-3 z-50 animate-in slide-in-from-bottom-4">
        <div className="bg-[#1a1a1a] border border-[#C9930C] rounded-2xl p-4 shadow-2xl">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-[#C9930C] rounded-xl flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-5 h-5 text-black" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm">Install Agri-H Leads</p>
              <p className="text-[#888] text-xs mt-0.5">Add to your home screen for offline access & push notifications</p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleInstall}
                  className="flex items-center gap-1.5 bg-[#C9930C] text-black text-xs font-bold px-4 py-2 rounded-lg"
                >
                  <Download className="w-3.5 h-3.5" /> Install App
                </button>
                <button
                  onClick={handleDismiss}
                  className="text-[#888] text-xs px-3 py-2 rounded-lg hover:text-white"
                >
                  Not now
                </button>
              </div>
            </div>
            <button onClick={handleDismiss} className="text-[#555] hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // iOS — show manual guide
  if (isIOS && !dismissed) {
    return (
      <div className="fixed bottom-20 left-3 right-3 z-50">
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4 shadow-2xl">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-[#1e3a1e] rounded-xl flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-5 h-5 text-green-400" />
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold text-sm">Install on iPhone</p>
              <p className="text-[#888] text-xs mt-0.5">
                Tap <span className="text-white">Share ↑</span> → <span className="text-white">"Add to Home Screen"</span>
              </p>
            </div>
            <button onClick={handleDismiss} className="text-[#555] hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

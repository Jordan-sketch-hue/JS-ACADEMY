"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginWithPasskey, redeemRecoveryCode } from "@/lib/auth-client";

export default function LockedPage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRecovery, setShowRecovery] = useState(false);
  const [code, setCode] = useState("");

  async function handleUnlock() {
    setBusy(true);
    setError(null);
    try {
      await loginWithPasskey();
      router.replace("/home");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not verify.");
    } finally {
      setBusy(false);
    }
  }

  async function handleRecovery() {
    setBusy(true);
    setError(null);
    try {
      const { granted } = await redeemRecoveryCode(code.trim());
      if (granted) router.replace("/setup?recovery=1");
    } catch (e) {
      setError(e instanceof Error ? e.message : "That code did not work.");
    } finally {
      setBusy(false);
    }
  }

  async function handleClearCache() {
    if ("serviceWorker" in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister()));
    }
    if ("caches" in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    }
    window.location.reload();
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 px-6 text-center">
      <div className="flex flex-col items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/mark.svg" alt="" width={72} height={72} className="opacity-90" />
        <h1 className="text-sm font-semibold tracking-[0.35em] text-ivory-dim">AVOD</h1>
      </div>

      {!showRecovery ? (
        <div className="flex flex-col items-center gap-4">
          <p className="max-w-xs font-serif-avod text-lg italic text-ivory-dim">
            One Absolute. Everything else, recognized.
          </p>
          <button
            onClick={handleUnlock}
            disabled={busy}
            className="rounded-full border border-gold-dim px-8 py-3 text-sm font-medium tracking-wide text-ivory transition hover:border-gold hover:text-gold disabled:opacity-50"
          >
            {busy ? "Verifying…" : "Unlock with Face ID"}
          </button>
          {error && <p className="max-w-xs text-xs text-stone">{error}</p>}
          <button
            onClick={() => setShowRecovery(true)}
            className="text-xs text-stone underline decoration-line underline-offset-4"
          >
            Lost this device
          </button>
          <button
            onClick={handleClearCache}
            className="text-xs text-stone/50 underline decoration-line underline-offset-4"
          >
            Clear cache &amp; reload
          </button>
        </div>
      ) : (
        <div className="flex w-full max-w-xs flex-col items-center gap-4">
          <p className="text-xs text-ivory-dim">Enter your one-time recovery code.</p>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full rounded-md border border-line bg-obsidian-2 px-4 py-2 text-center text-sm tracking-wider text-ivory outline-none focus-visible:border-gold"
            placeholder="recovery code"
            autoComplete="off"
          />
          <button
            onClick={handleRecovery}
            disabled={busy || !code}
            className="rounded-full border border-gold-dim px-8 py-3 text-sm font-medium tracking-wide text-ivory transition hover:border-gold hover:text-gold disabled:opacity-50"
          >
            {busy ? "Checking…" : "Continue"}
          </button>
          {error && <p className="max-w-xs text-xs text-stone">{error}</p>}
          <button
            onClick={() => setShowRecovery(false)}
            className="text-xs text-stone underline decoration-line underline-offset-4"
          >
            Back
          </button>
        </div>
      )}
    </main>
  );
}

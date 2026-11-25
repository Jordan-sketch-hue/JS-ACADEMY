"use client";

import { useEffect } from "react";

interface Props { error: Error & { digest?: string }; reset: () => void; }

export default function ErrorBoundary({ error, reset }: Props) {
  useEffect(() => {
    console.error("[jst-templates]", error);
  }, [error]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 bg-[var(--bg)]">
      <p className="text-8xl font-black text-[var(--text-primary)] leading-none">500</p>
      <h2 className="text-xl font-semibold text-[var(--text-primary)]">Something went wrong</h2>
      <p className="text-sm text-[var(--text-muted)] max-w-sm text-center">
        An unexpected error occurred. Please try again or contact support.
      </p>
      <button
        onClick={reset}
        className="rounded-[var(--radius)] bg-[var(--accent)] px-6 py-2.5 text-sm font-bold uppercase tracking-widest text-white hover:opacity-90 transition-opacity"
      >
        Try Again
      </button>
    </main>
  );
}

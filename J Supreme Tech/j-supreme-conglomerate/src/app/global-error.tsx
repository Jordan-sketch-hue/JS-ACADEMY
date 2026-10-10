"use client";

import { useEffect } from "react";

/** Top-level error boundary. Reports the crash to the alert endpoint, then shows
 * a minimal recovery screen. Must render its own <html>/<body>. */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    try {
      fetch("/api/notify/error", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          digest: error.digest,
          url: typeof window !== "undefined" ? window.location.href : "",
        }),
        keepalive: true,
      }).catch(() => {});
    } catch {
      /* ignore */
    }
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, -apple-system, Segoe UI, Arial, sans-serif",
          background: "#0f1115",
          color: "#fff",
        }}
      >
        <div style={{ maxWidth: 420, padding: 24, textAlign: "center" }}>
          <div style={{ fontSize: 40 }}>⚠️</div>
          <h1 style={{ fontSize: 20, margin: "12px 0 6px" }}>Something went wrong</h1>
          <p style={{ color: "#9ca3af", fontSize: 14, margin: "0 0 20px" }}>
            The team has been notified by email. You can try again.
          </p>
          <button
            onClick={() => reset()}
            style={{
              background: "#fff",
              color: "#0f1115",
              border: "none",
              borderRadius: 8,
              padding: "10px 20px",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}

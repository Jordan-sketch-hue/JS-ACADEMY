"use client";

import { useState, FormEvent } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function DebriefForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [err, setErr] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const fd = new FormData(e.currentTarget);
    const email = fd.get("email") as string;
    const firstName = (fd.get("firstName") as string) || "";
    const lastName = "";

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName, lastName }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed");
      setStatus("success");
    } catch (e: unknown) {
      setStatus("error");
      setErr(e instanceof Error ? e.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <div style={{ width: "40px", height: "40px", background: "var(--ink)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "#fff", fontSize: "18px" }}>✓</div>
        <div style={{ fontFamily: "var(--font-space)", fontWeight: 700, fontSize: "18px", letterSpacing: "-0.02em", marginBottom: "8px" }}>You&apos;re in.</div>
        <p style={{ color: "var(--ink-60)", fontSize: "13px", lineHeight: 1.6 }}>First issue arrives tomorrow morning. Welcome to In Today&apos;s World:</p>
      </div>
    );
  }

  return (
    <form className="debrief-form" onSubmit={handleSubmit}>
      <div className="debrief-form__row">
        <div className="debrief-form__label">Your name</div>
        <input name="firstName" type="text" className="debrief-form__input" placeholder="First name" />
      </div>
      <div className="debrief-form__row">
        <div className="debrief-form__label">Email address</div>
        <input name="email" type="email" required className="debrief-form__input" placeholder="your@email.com" />
      </div>
      <div className="debrief-form__row">
        <div className="debrief-form__label">WhatsApp (optional)</div>
        <input type="tel" className="debrief-form__input" placeholder="+1 876 000 0000" />
      </div>
      <div className="debrief-form__row">
        <div className="debrief-form__label">Your industry</div>
        <select className="debrief-form__select">
          <option>Technology</option>
          <option>Marketing</option>
          <option>Finance</option>
          <option>Logistics</option>
          <option>Legal</option>
          <option>Real Estate</option>
          <option>Other</option>
        </select>
      </div>
      <div className="debrief-form__row">
        <div className="debrief-form__label">Primary interest</div>
        <select className="debrief-form__select">
          <option>AI & Technology</option>
          <option>Marketing & Growth</option>
          <option>Caribbean Business</option>
          <option>Finance & Investment</option>
          <option>All of the above</option>
        </select>
      </div>
      {status === "error" && (
        <p style={{ color: "#c0392b", fontSize: "12px", margin: "0 0 12px", padding: "8px 10px", background: "rgba(192,57,43,.07)", borderRadius: "2px" }}>{err}</p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="debrief-form__btn"
        style={{ opacity: status === "loading" ? 0.6 : 1, cursor: status === "loading" ? "not-allowed" : "pointer" }}
      >
        {status === "loading" ? "Subscribing..." : "Subscribe Free →"}
      </button>
      <div className="debrief-form__note">No spam. Unsubscribe anytime. Weekdays.</div>
    </form>
  );
}

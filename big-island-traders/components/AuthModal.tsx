"use client";
import { useState } from "react";

type Step = "idle" | "enter-email" | "enter-pw" | "sent" | "signed-in";

type Props = {
  open: boolean;
  onClose: () => void;
  onSignIn: (name: string, email: string) => void;
};

export default function AuthModal({ open, onClose, onSignIn }: Props) {
  const [step, setStep] = useState<Step>("enter-email");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleEmail = async () => {
    if (!email.includes("@")) { setError("Enter a valid email."); return; }
    setError("");
    setLoading(true);
    // Try Supabase magic link if available, otherwise soft sign-in
    try {
      const res = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) { setStep("sent"); }
      else { setStep("enter-pw"); } // fallback
    } catch {
      setStep("enter-pw"); // no server, use local session
    }
    setLoading(false);
  };

  const handlePw = () => {
    if (!name.trim()) { setError("Enter your name."); return; }
    // Soft local sign-in — persists to localStorage until Supabase is connected
    const session = { name: name.trim(), email, ts: Date.now() };
    localStorage.setItem("bit_session", JSON.stringify(session));
    onSignIn(name.trim(), email);
    onClose();
    setStep("enter-email");
    setName(""); setEmail(""); setPw(""); setError("");
  };

  const overlay: React.CSSProperties = {
    position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.72)", zIndex: 9999,
    display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
  };

  const card: React.CSSProperties = {
    backgroundColor: "#0D1933", borderRadius: 8, padding: 40, width: "100%", maxWidth: 420,
    border: "1px solid rgba(200,168,74,0.2)", position: "relative",
  };

  const input: React.CSSProperties = {
    width: "100%", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 4, padding: "13px 16px", color: "#fff", fontSize: 14, outline: "none",
    marginBottom: 12, fontFamily: "inherit",
  };

  const btn: React.CSSProperties = {
    width: "100%", backgroundColor: "#C8A84A", color: "#0A0906", border: "none", borderRadius: 4,
    padding: 14, fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 13,
    letterSpacing: "0.06em", cursor: "pointer",
  };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={card} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 20, lineHeight: 1 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="12" y1="4" x2="4" y2="12"/><line x1="4" y1="4" x2="12" y2="12"/></svg>
        </button>

        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <img src="/images/logobigisland.jpg" alt="Big Island Traders" style={{ height: 40, objectFit: "contain", marginBottom: 12 }} />
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "Montserrat, sans-serif" }}>
            {step === "enter-email" ? "Sign in to your account" : step === "sent" ? "Check your email" : "Create / sign in"}
          </p>
        </div>

        {step === "enter-email" && (
          <>
            <input style={input} type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleEmail()} />
            {error && <p style={{ color: "#E8561A", fontSize: 12, marginBottom: 10 }}>{error}</p>}
            <button style={btn} onClick={handleEmail} disabled={loading}>{loading ? "Sending…" : "CONTINUE"}</button>
            <p style={{ textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 16, lineHeight: 1.6 }}>
              Sign in to save your cart, track orders, and access exclusive offers.
            </p>
          </>
        )}

        {step === "sent" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: "0 auto" }}>
                <rect x="4" y="10" width="40" height="28" rx="3" stroke="#C8A84A" strokeWidth="2"/>
                <path d="M4 14L24 26L44 14" stroke="#C8A84A" strokeWidth="2"/>
              </svg>
            </div>
            <p style={{ color: "#fff", fontSize: 15, marginBottom: 8 }}>Magic link sent to</p>
            <p style={{ color: "#C8A84A", fontSize: 14, fontWeight: 700, marginBottom: 20 }}>{email}</p>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, lineHeight: 1.7 }}>Click the link in your email to sign in. Check your spam folder if it doesn&apos;t arrive within 2 minutes.</p>
          </div>
        )}

        {step === "enter-pw" && (
          <>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginBottom: 16 }}>Sign in as <strong style={{ color: "#C8A84A" }}>{email}</strong></p>
            <input style={input} type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handlePw()} />
            {error && <p style={{ color: "#E8561A", fontSize: 12, marginBottom: 10 }}>{error}</p>}
            <button style={btn} onClick={handlePw}>SIGN IN</button>
            <button onClick={() => setStep("enter-email")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: 12, cursor: "pointer", width: "100%", marginTop: 12, textAlign: "center" }}>
              Use a different email
            </button>
          </>
        )}
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";

const inputStyle: React.CSSProperties = {
  width: "100%", backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(91,200,232,0.25)",
  borderRadius: 8, padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none",
  fontFamily: "Inter, sans-serif", transition: "border-color 0.2s",
};

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 12, fontWeight: 600, color: "#5BC8E8", marginBottom: 6, letterSpacing: 0.5,
};

export default function BookingForm() {
  const [form, setForm] = useState({
    name: "", company: "", email: "", phone: "", occasion: "",
    budget_range: "", preferred_date: "", message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/submit-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "booking_page" }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div style={{ textAlign: "center", padding: "48px 24px", backgroundColor: "#132240", borderRadius: 16, border: "1px solid rgba(91,200,232,0.3)" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🍷</div>
        <h3 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 22, color: "#5BC8E8", marginBottom: 12 }}>Booking Confirmed!</h3>
        <p style={{ color: "#ffffff80", lineHeight: 1.7 }}>We received your request and will contact you within 24 hours to confirm your consultation. Check your email for details.</p>
        <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 12, maxWidth: 320, margin: "32px auto 0" }}>
          {["We review your request (within 4 hours)", "A consultant calls to confirm the date", "You receive a personalised gifting proposal"].map((step, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", textAlign: "left" }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", backgroundColor: "#5BC8E8", color: "#0D1933", fontWeight: 800, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
              <p style={{ color: "#ffffff80", fontSize: 14, margin: 0, paddingTop: 2 }}>{step}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <label style={labelStyle}>FULL NAME *</label>
          <input required style={inputStyle} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Corey Scott"
            onFocus={(e) => (e.target.style.borderColor = "#5BC8E8")} onBlur={(e) => (e.target.style.borderColor = "rgba(91,200,232,0.25)")} />
        </div>
        <div>
          <label style={labelStyle}>COMPANY</label>
          <input style={inputStyle} value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="Acme Ltd"
            onFocus={(e) => (e.target.style.borderColor = "#5BC8E8")} onBlur={(e) => (e.target.style.borderColor = "rgba(91,200,232,0.25)")} />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <label style={labelStyle}>EMAIL *</label>
          <input required type="email" style={inputStyle} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@company.com"
            onFocus={(e) => (e.target.style.borderColor = "#5BC8E8")} onBlur={(e) => (e.target.style.borderColor = "rgba(91,200,232,0.25)")} />
        </div>
        <div>
          <label style={labelStyle}>PHONE</label>
          <input style={inputStyle} value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="876-000-0000"
            onFocus={(e) => (e.target.style.borderColor = "#5BC8E8")} onBlur={(e) => (e.target.style.borderColor = "rgba(91,200,232,0.25)")} />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <label style={labelStyle}>OCCASION</label>
          <input style={inputStyle} value={form.occasion} onChange={(e) => set("occasion", e.target.value)} placeholder="Year-end staff party"
            onFocus={(e) => (e.target.style.borderColor = "#5BC8E8")} onBlur={(e) => (e.target.style.borderColor = "rgba(91,200,232,0.25)")} />
        </div>
        <div>
          <label style={labelStyle}>PREFERRED DATE</label>
          <input type="date" style={inputStyle} value={form.preferred_date} onChange={(e) => set("preferred_date", e.target.value)}
            onFocus={(e) => (e.target.style.borderColor = "#5BC8E8")} onBlur={(e) => (e.target.style.borderColor = "rgba(91,200,232,0.25)")} />
        </div>
      </div>
      <div>
        <label style={labelStyle}>BUDGET RANGE</label>
        <select style={{ ...inputStyle, cursor: "pointer" }} value={form.budget_range} onChange={(e) => set("budget_range", e.target.value)}>
          <option value="">Select a range</option>
          <option value="under-25k">Under J$25,000</option>
          <option value="25k-50k">J$25,000 – J$50,000</option>
          <option value="50k-100k">J$50,000 – J$100,000</option>
          <option value="100k-250k">J$100,000 – J$250,000</option>
          <option value="250k+">J$250,000+</option>
        </select>
      </div>
      <div>
        <label style={labelStyle}>MESSAGE</label>
        <textarea style={{ ...inputStyle, resize: "vertical", minHeight: 100 }} value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="Tell us about your event, team size, or any special requirements..."
          onFocus={(e) => (e.target.style.borderColor = "#5BC8E8")} onBlur={(e) => (e.target.style.borderColor = "rgba(91,200,232,0.25)")} />
      </div>
      {status === "error" && <p style={{ color: "#E8561A", fontSize: 13 }}>Something went wrong. Please try again or call us at 876-885-3250.</p>}
      <button type="submit" disabled={status === "loading"}
        style={{ backgroundColor: "#5BC8E8", color: "#0D1933", border: "none", borderRadius: 8, padding: "16px", fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 15, cursor: "pointer", letterSpacing: 0.5, opacity: status === "loading" ? 0.7 : 1 }}>
        {status === "loading" ? "SUBMITTING..." : "BOOK FREE CONSULTATION"}
      </button>
    </form>
  );
}

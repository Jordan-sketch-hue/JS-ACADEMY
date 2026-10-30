"use client";
import { useState } from "react";
import { Button } from "@shared/components/ui/Button";

interface Props {
  services: string[];
  slug: string;
  whatsapp?: string | null;
}

const TIME_SLOTS = [
  { label: "Morning", slots: ["9:00 AM", "10:00 AM", "11:00 AM"] },
  { label: "Afternoon", slots: ["1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"] },
  { label: "Evening", slots: ["5:00 PM", "6:00 PM"] },
];

export function BookingWidget({ services, slug, whatsapp }: Props) {
  const [service, setService] = useState(services[0] ?? "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) { setErr("Please select a date"); return; }
    if (!time) { setErr("Please select a time slot"); return; }
    if (!name.trim()) { setErr("Name is required"); return; }
    if (!phone.trim()) { setErr("Phone is required"); return; }
    setErr("");
    setLoading(true);

    try {
      await fetch("/api/submit-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientSlug: slug, customerName: name, customerPhone: phone, customerEmail: email || undefined, service, bookingDate: date, bookingTime: time }),
      });
    } catch { /* non-blocking */ }

    setLoading(false);
    setDone(true);

    if (whatsapp) {
      const msg =
        `Hi, I would like to book an appointment.\n\n` +
        `Name: ${name}\nPhone: ${phone}\nService: ${service}\nDate: ${date}\nTime: ${time}\n\nPlease confirm my booking.`;
      window.open(`https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`, "_blank");
    }
  };

  const inputStyle: React.CSSProperties = { width: "100%", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg-card)", padding: "12px 14px", fontSize: 14, color: "var(--text-primary)", outline: "none", boxSizing: "border-box" };

  if (done) return (
    <div style={{ border: "1px solid var(--border)", borderRadius: 12, background: "var(--bg-card)", padding: 32, textAlign: "center" }}>
      <p style={{ fontSize: 40, marginBottom: 8 }}>✅</p>
      <p style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>Booking request received!</p>
      <p style={{ marginTop: 8, fontSize: 14, color: "var(--text-secondary)" }}>
        {whatsapp ? "A WhatsApp message has been opened — tap Send to notify the business." : "We will confirm your appointment shortly."}
      </p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} style={{ border: "1px solid var(--border)", borderRadius: 12, background: "var(--bg-card)", padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>Book an Appointment</h3>

      <select value={service} onChange={(e) => setService(e.target.value)} style={inputStyle}>
        {services.map((s) => <option key={s}>{s}</option>)}
      </select>

      <input type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} />

      {/* Time slot picker */}
      <div>
        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 10 }}>Select a time</p>
        {TIME_SLOTS.map((group) => (
          <div key={group.label} style={{ marginBottom: 12 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{group.label}</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {group.slots.map((slot) => (
                <button key={slot} type="button" onClick={() => setTime(slot)}
                  style={{
                    padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
                    border: time === slot ? "none" : "1px solid var(--border)",
                    background: time === slot ? "var(--accent)" : "var(--bg-surface)",
                    color: time === slot ? "var(--accent-fg)" : "var(--text-primary)",
                  }}>
                  {slot}
                </button>
              ))}
            </div>
          </div>
        ))}
        {time && <p style={{ fontSize: 13, color: "var(--accent)", fontWeight: 600 }}>Selected: {time}</p>}
      </div>

      <input type="text" placeholder="Your name *" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
      <input type="tel" placeholder="Phone *" value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} />
      <input type="email" placeholder="Email (optional)" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />

      {err && <p style={{ fontSize: 13, color: "#ef4444" }}>{err}</p>}

      <Button type="submit" variant="primary" size="md" style={{ width: "100%" }} disabled={loading}>
        {loading ? "Sending…" : "Request Booking"}
      </Button>

      {whatsapp && (
        <p style={{ fontSize: 12, textAlign: "center", color: "var(--text-secondary)" }}>
          You will be redirected to WhatsApp to send your request directly to the business.
        </p>
      )}
    </form>
  );
}

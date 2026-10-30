"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { SkeletonTable } from "@shared/components/ui/Skeleton";
import Link from "next/link";

type Booking = {
  id: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  message: string | null;
  created_at: string;
  status: string | null;
};

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  new: { bg: "#dbeafe", color: "#1e40af" },
  pending: { bg: "#fef3c7", color: "#92400e" },
  confirmed: { bg: "#d1fae5", color: "#065f46" },
  completed: { bg: "#f3e8ff", color: "#6b21a8" },
  cancelled: { bg: "#fee2e2", color: "#991b1b" },
};

export default function AdminBookingsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params?.slug as string;
  const secret = searchParams?.get("secret") ?? "";
  const authHeader = secret ? { "x-admin-secret": secret } : {};

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [clientName, setClientName] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/admin/leads?slug=${slug}&type=booking`, { headers: authHeader })
      .then((r) => r.json())
      .then((d) => {
        setBookings(d.leads ?? []);
        setClientName(d.clientName ?? slug);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch("/api/admin/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...authHeader },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status } : b));
    }
  };

  const filtered = filter === "all" ? bookings : bookings.filter((b) => (b.status ?? "new") === filter);

  const getDateFromMessage = (msg: string | null) => {
    if (!msg) return null;
    const match = msg.match(/on (\d{4}-\d{2}-\d{2})/);
    return match ? match[1] : null;
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
        <div>
          <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>Admin → Bookings</p>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>{clientName} — Bookings</h1>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href={`/t/${slug}/admin`} style={{ padding: "10px 18px", borderRadius: 8, border: "1px solid #d1d5db", background: "#fff", fontWeight: 600, fontSize: 13, textDecoration: "none", color: "#374151" }}>← Products</Link>
          <Link href={`/t/${slug}/admin/orders`} style={{ padding: "10px 18px", borderRadius: 8, border: "1px solid #d1d5db", background: "#fff", fontWeight: 600, fontSize: 13, textDecoration: "none", color: "#374151" }}>Orders</Link>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Total", count: bookings.length, bg: "#f9fafb" },
          { label: "New", count: bookings.filter(b => !b.status || b.status === "new").length, bg: "#dbeafe" },
          { label: "Confirmed", count: bookings.filter(b => b.status === "confirmed").length, bg: "#d1fae5" },
          { label: "Completed", count: bookings.filter(b => b.status === "completed").length, bg: "#f3e8ff" },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg, borderRadius: 10, padding: "16px", textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: 28, fontWeight: 800 }}>{s.count}</p>
            <p style={{ margin: 0, fontSize: 12, color: "#6b7280", marginTop: 4 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {["all", "new", "pending", "confirmed", "completed", "cancelled"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: "7px 16px", borderRadius: 100, border: filter === f ? "none" : "1px solid #d1d5db", background: filter === f ? "#111" : "#fff", color: filter === f ? "#fff" : "#374151", fontWeight: 600, fontSize: 13, cursor: "pointer", textTransform: "capitalize" }}>
            {f}
          </button>
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 24 }}><SkeletonTable rows={5} /></div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#9ca3af" }}>No bookings {filter !== "all" ? `with status "${filter}"` : "yet"}.</div>
        ) : (
          filtered.map((booking) => {
            const date = getDateFromMessage(booking.message);
            return (
              <div key={booking.id} style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6", display: "grid", gridTemplateColumns: "1fr auto", gap: 16, alignItems: "start" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>{booking.name || "Unknown Client"}</span>
                    <span style={{
                      padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700,
                      ...(STATUS_COLORS[booking.status ?? "new"] ?? STATUS_COLORS.new)
                    }}>{booking.status ?? "new"}</span>
                    {date && <span style={{ fontSize: 12, background: "#f3f4f6", padding: "3px 10px", borderRadius: 100, fontWeight: 600 }}>Date: {date}</span>}
                    <span style={{ fontSize: 12, color: "#9ca3af" }}>{new Date(booking.created_at).toLocaleDateString("en-JM", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </div>
                  {booking.phone && <p style={{ margin: "0 0 2px", fontSize: 13, color: "#374151" }}>Phone: <a href={`tel:${booking.phone}`} style={{ color: "#2563eb" }}>{booking.phone}</a></p>}
                  {booking.email && <p style={{ margin: "0 0 4px", fontSize: 13, color: "#374151" }}>Email: <a href={`mailto:${booking.email}`} style={{ color: "#2563eb" }}>{booking.email}</a></p>}
                  {booking.message && <p style={{ margin: 0, fontSize: 13, color: "#6b7280", lineHeight: 1.5, maxWidth: 600 }}>{booking.message}</p>}
                </div>
                <select value={booking.status ?? "new"} onChange={(e) => updateStatus(booking.id, e.target.value)}
                  style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 13, fontWeight: 600, cursor: "pointer", background: "#fff" }}>
                  <option value="new">New</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

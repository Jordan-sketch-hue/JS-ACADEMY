import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ChatBot from "@/components/ChatBot";
import BookingForm from "@/components/BookingForm";

export default function BookPage() {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <ChatBot />

      {/* Hero */}
      <section style={{ paddingTop: 140, paddingBottom: 60, backgroundColor: "#0A1428", padding: "140px 24px 60px", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <p style={{ color: "#5BC8E8", fontSize: 12, fontWeight: 700, letterSpacing: 2, marginBottom: 16 }}>FREE CONSULTATION</p>
          <h1 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: "clamp(32px, 5vw, 56px)", color: "#fff", margin: "0 0 16px", lineHeight: 1.1 }}>
            Book a Free<br />
            <span style={{ color: "#5BC8E8" }}>Consultation</span>
          </h1>
          <p style={{ color: "#ffffff80", fontSize: 16, lineHeight: 1.7 }}>
            Let&apos;s create the perfect gifting experience for your team, event, or clients. No obligation — just great ideas.
          </p>
        </div>
      </section>

      <section style={{ padding: "60px 24px 80px", backgroundColor: "#0D1933" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 2fr", gap: 60, alignItems: "start" }} className="book-grid">
          <style>{`@media (max-width: 800px) { .book-grid { grid-template-columns: 1fr !important; } }`}</style>

          {/* Left info */}
          <div>
            <div style={{ backgroundColor: "#132240", borderRadius: 16, padding: 32, border: "1px solid rgba(91,200,232,0.2)", marginBottom: 24 }}>
              <h3 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 18, color: "#fff", marginBottom: 20 }}>What Happens Next</h3>
              {[
                { n: "1", t: "We review your request", d: "Within 4 business hours, your request is reviewed by our team." },
                { n: "2", t: "A consultant contacts you", d: "We call or email to confirm your preferred date and discuss your needs." },
                { n: "3", t: "You receive a proposal", d: "A personalised gifting proposal with pricing is sent within 24 hours." },
              ].map((s) => (
                <div key={s.n} style={{ display: "flex", gap: 16, marginBottom: 20 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", backgroundColor: "#5BC8E8", color: "#0D1933", fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{s.n}</div>
                  <div>
                    <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 14, color: "#fff", marginBottom: 4 }}>{s.t}</div>
                    <div style={{ color: "#ffffff60", fontSize: 13, lineHeight: 1.6 }}>{s.d}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ backgroundColor: "#132240", borderRadius: 12, padding: 24, border: "1px solid rgba(91,200,232,0.15)" }}>
              <h4 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 14, color: "#5BC8E8", marginBottom: 12 }}>PREFER TO CALL?</h4>
              <p style={{ color: "#fff", fontSize: 18, fontWeight: 600, marginBottom: 4 }}>876-885-3250</p>
              <p style={{ color: "#ffffff60", fontSize: 13 }}>Mon – Sat, 8AM – 6PM</p>
              <p style={{ color: "#ffffff60", fontSize: 13, marginTop: 8 }}>bigislandtraderz@gmail.com</p>
            </div>
          </div>

          {/* Form */}
          <div>
            <BookingForm />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

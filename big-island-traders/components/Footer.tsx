"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#080F1F", borderTop: "1px solid rgba(91,200,232,0.15)", paddingTop: 56, paddingBottom: 32 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40, marginBottom: 48 }}>
          {/* Brand */}
          <div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: 20, color: "#5BC8E8" }}>BIG ISLAND</div>
              <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 11, color: "#F5C800", letterSpacing: 3 }}>TRADERS</div>
            </div>
            <p style={{ color: "#ffffff80", fontSize: 13, lineHeight: 1.7, maxWidth: 220 }}>
              The ultimate in social experience.<br />
              <strong style={{ color: "#5BC8E8" }}>TRUSTED.</strong>
            </p>
            <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
              {["IG", "FB", "TT"].map((s) => (
                <span key={s} style={{ width: 32, height: 32, borderRadius: "50%", backgroundColor: "rgba(91,200,232,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#5BC8E8", fontWeight: 700, cursor: "pointer" }}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 13, color: "#F5C800", letterSpacing: 1, marginBottom: 16 }}>PRODUCTS</h4>
            {["WIAG Red 187ml", "WIAG White 187ml", "WIAG Sparkling 187ml", "Corporate Gift Boxes", "Bundle Builder"].map((item) => (
              <Link key={item} href="/shop" style={{ display: "block", color: "#ffffff60", textDecoration: "none", fontSize: 13, marginBottom: 8, transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#5BC8E8")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#ffffff60")}>
                {item}
              </Link>
            ))}
          </div>

          {/* Company */}
          <div>
            <h4 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 13, color: "#F5C800", letterSpacing: 1, marginBottom: 16 }}>COMPANY</h4>
            {[["About", "/about"], ["Corporate Solutions", "/corporate"], ["Book a Consultation", "/book"], ["Admin", "/admin"]].map(([label, href]) => (
              <Link key={href} href={href} style={{ display: "block", color: "#ffffff60", textDecoration: "none", fontSize: 13, marginBottom: 8 }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#5BC8E8")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#ffffff60")}>
                {label}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 13, color: "#F5C800", letterSpacing: 1, marginBottom: 16 }}>CONTACT</h4>
            <p style={{ color: "#ffffff60", fontSize: 13, marginBottom: 8 }}>876-885-3250</p>
            <p style={{ color: "#ffffff60", fontSize: 13, marginBottom: 8 }}>bigislandtraderz@gmail.com</p>
            <p style={{ color: "#ffffff60", fontSize: 13, marginBottom: 8 }}>@bigislandtraderz</p>
            <div style={{ marginTop: 20, padding: "12px 16px", backgroundColor: "rgba(91,200,232,0.08)", borderRadius: 8, border: "1px solid rgba(91,200,232,0.2)" }}>
              <p style={{ color: "#5BC8E8", fontSize: 11, fontWeight: 600, marginBottom: 4 }}>BANK TRANSFER</p>
              <p style={{ color: "#ffffff80", fontSize: 12 }}>NCB Jamaica</p>
              <p style={{ color: "#ffffff80", fontSize: 12 }}>Big Island Traders</p>
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <p style={{ color: "#ffffff40", fontSize: 12 }}>
            &copy; {new Date().getFullYear()} Big Island Traders. All rights reserved.
          </p>
          <p style={{ color: "#ffffff30", fontSize: 11 }}>
            Built by{" "}
            <a href="https://jsupremetech.online" target="_blank" rel="noopener noreferrer" style={{ color: "#5BC8E8", textDecoration: "none" }}>
              J Supreme Tech
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

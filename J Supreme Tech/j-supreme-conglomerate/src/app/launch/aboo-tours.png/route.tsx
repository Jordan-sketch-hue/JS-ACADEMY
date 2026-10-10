import { ImageResponse } from "next/og";

export const runtime = "edge";

const size = { width: 1080, height: 1920 };

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: 80,
          background:
            "radial-gradient(ellipse at 10% 0%, #1a1604 0%, #050505 55%), radial-gradient(ellipse at 100% 100%, #2a2208 0%, transparent 55%), #050505",
          color: "#FFFFFF",
          fontFamily: "Inter, -apple-system, sans-serif",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#F2D85C",
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: 6,
            textTransform: "uppercase",
          }}
        >
          <div style={{ display: "flex" }}>AbooTours · 🇯🇲</div>
          <div style={{ display: "flex", color: "#FAE583" }}>NOW LIVE</div>
        </div>

        {/* Spacer */}
        <div style={{ display: "flex", flex: 1 }} />

        {/* Centerpiece */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 32,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 200,
              height: 200,
              borderRadius: 56,
              background:
                "linear-gradient(135deg, #F2D85C 0%, #C9A832 100%)",
              boxShadow:
                "0 40px 100px -30px rgba(242,216,92,0.55), inset 0 4px 0 rgba(255,255,255,0.25)",
              color: "#050505",
              fontSize: 110,
              fontWeight: 900,
              letterSpacing: -6,
            }}
          >
            AT
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            marginTop: 60,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 18,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#F2D85C",
            }}
          >
            Concierge Travel · Jamaica
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 130,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: -4,
              color: "#FFFFFF",
              textAlign: "center",
            }}
          >
            Jamaica,
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 130,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: -4,
              background:
                "linear-gradient(135deg, #F2D85C 0%, #FAE583 100%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            without limits.
          </div>
        </div>

        {/* Spacer */}
        <div style={{ display: "flex", flex: 1 }} />

        {/* Bottom URL bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "26px 32px",
            borderRadius: 28,
            background: "rgba(242,216,92,0.10)",
            border: "2px solid rgba(242,216,92,0.32)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div
              style={{
                display: "flex",
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: "#FAE583",
              }}
            >
              Tap → install the concierge app
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 30,
                fontWeight: 700,
                color: "#FFFFFF",
              }}
            >
              abootours.com
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 80,
              height: 80,
              borderRadius: 22,
              background:
                "linear-gradient(135deg, #F2D85C 0%, #C9A832 100%)",
              fontSize: 44,
              fontWeight: 900,
              color: "#050505",
            }}
          >
            →
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}

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
            "radial-gradient(ellipse at 10% 0%, #2a0a4f 0%, #050505 55%), radial-gradient(ellipse at 100% 100%, #4a0f7a 0%, transparent 55%), #050505",
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
            color: "#A855F7",
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: 6,
            textTransform: "uppercase",
          }}
        >
          <div style={{ display: "flex" }}>J Supreme · Operating System</div>
          <div style={{ display: "flex", color: "#C084FC" }}>NOW LIVE</div>
        </div>

        {/* Massive mark */}
        <div
          style={{
            marginTop: 140,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 460,
              height: 460,
              borderRadius: 140,
              background:
                "linear-gradient(135deg, #7B2FFF 0%, #A855F7 100%)",
              boxShadow:
                "0 60px 140px -40px rgba(123,47,255,0.65), inset 0 4px 0 rgba(255,255,255,0.20)",
              color: "#FFFFFF",
              fontSize: 240,
              fontWeight: 900,
              letterSpacing: -10,
            }}
          >
            JS
          </div>
        </div>

        {/* Spacer */}
        <div style={{ display: "flex", flex: 1 }} />

        {/* Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#A855F7",
            }}
          >
            One OS for the whole portfolio
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 110,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: -3,
              color: "#FFFFFF",
            }}
          >
            CRM. Pipeline.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 110,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: -3,
              color: "#FFFFFF",
            }}
          >
            Back office.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 110,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: -3,
              background:
                "linear-gradient(135deg, #A855F7 0%, #C084FC 100%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            All in one tap.
          </div>
        </div>

        {/* Bottom URL bar */}
        <div
          style={{
            marginTop: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "26px 32px",
            borderRadius: 28,
            background: "rgba(168,85,247,0.12)",
            border: "2px solid rgba(168,85,247,0.35)",
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
                color: "#C084FC",
              }}
            >
              Operator invite · install the OS
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 26,
                fontWeight: 700,
                color: "#FFFFFF",
              }}
            >
              jsupremeconglomerate.online
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
                "linear-gradient(135deg, #7B2FFF 0%, #A855F7 100%)",
              fontSize: 44,
              fontWeight: 900,
              color: "#FFFFFF",
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

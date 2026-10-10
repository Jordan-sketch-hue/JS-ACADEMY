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
            "radial-gradient(ellipse at 10% 0%, #14253E 0%, #0F1B2C 55%), radial-gradient(ellipse at 100% 100%, #25160A 0%, transparent 55%), #0F1B2C",
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
            color: "#ED7B2D",
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: 6,
            textTransform: "uppercase",
          }}
        >
          <div style={{ display: "flex" }}>Solace Auto Imports</div>
          <div style={{ display: "flex", color: "#F2B340" }}>NOW LIVE</div>
        </div>

        {/* Spacer */}
        <div style={{ display: "flex", flex: 1 }} />

        {/* Centerpiece - circular mark */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 40,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 240,
              height: 240,
              borderRadius: 120,
              background:
                "linear-gradient(135deg, #ED7B2D 0%, #F2B340 100%)",
              boxShadow:
                "0 50px 120px -30px rgba(237,123,45,0.55), inset 0 4px 0 rgba(255,255,255,0.2)",
              color: "#0F1B2C",
              fontSize: 110,
              fontWeight: 900,
              letterSpacing: -6,
            }}
          >
            SA
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            marginTop: 70,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 22,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#F2B340",
            }}
          >
            Certified used car dealer · Jamaica
          </div>
          <div
            style={{
              display: "flex",
              gap: 30,
              alignItems: "center",
              fontSize: 80,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: -2,
              color: "#FFFFFF",
            }}
          >
            <div style={{ display: "flex" }}>We Import</div>
            <div
              style={{
                display: "flex",
                color: "#ED7B2D",
              }}
            >
              ·
            </div>
            <div style={{ display: "flex" }}>Sell</div>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 140,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: -4,
              background:
                "linear-gradient(135deg, #ED7B2D 0%, #F2B340 100%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Source.
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
            background: "rgba(237,123,45,0.12)",
            border: "2px solid rgba(237,123,45,0.35)",
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
                color: "#F2B340",
              }}
            >
              Tap → browse the inventory
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 28,
                fontWeight: 700,
                color: "#FFFFFF",
              }}
            >
              solaceautoimportsltd.com
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
                "linear-gradient(135deg, #ED7B2D 0%, #F2B340 100%)",
              fontSize: 44,
              fontWeight: 900,
              color: "#0F1B2C",
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

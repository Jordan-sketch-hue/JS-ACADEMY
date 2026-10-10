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
            "radial-gradient(ellipse at 15% 0%, #2a0a00 0%, #050505 55%), radial-gradient(ellipse at 100% 100%, #501a00 0%, transparent 55%), #050505",
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
            color: "#FF6A3D",
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: 6,
            textTransform: "uppercase",
          }}
        >
          <div style={{ display: "flex" }}>BP Couriers · Jamaica</div>
          <div style={{ display: "flex", color: "#FF8C5C" }}>NOW LIVE</div>
        </div>

        {/* Massive logo mark */}
        <div
          style={{
            marginTop: 160,
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
                "linear-gradient(135deg, #FF6A3D 0%, #E0451B 50%, #B0330D 100%)",
              boxShadow:
                "0 60px 140px -40px rgba(224,69,27,0.65), inset 0 4px 0 rgba(255,255,255,0.18)",
              color: "#FFFFFF",
              fontSize: 240,
              fontWeight: 900,
              letterSpacing: -10,
            }}
          >
            BP
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
              color: "#FF6A3D",
            }}
          >
            Install the Operator App
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
            Same-day.
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
            Tracked.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 110,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: -3,
              background:
                "linear-gradient(135deg, #FF6A3D 0%, #F2B340 100%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Delivered.
          </div>
        </div>

        {/* Bottom URL bar */}
        <div
          style={{
            marginTop: 70,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "26px 32px",
            borderRadius: 28,
            background: "rgba(255,106,61,0.10)",
            border: "2px solid rgba(255,106,61,0.32)",
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
                color: "#FF8C5C",
              }}
            >
              Tap → install on home screen
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 30,
                fontWeight: 700,
                color: "#FFFFFF",
              }}
            >
              courier-app-gamma.vercel.app
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
                "linear-gradient(135deg, #FF6A3D 0%, #E0451B 100%)",
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

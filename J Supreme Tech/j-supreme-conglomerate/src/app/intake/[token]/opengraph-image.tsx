import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "J Supreme Tech secure project intake";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

type Props = {
  params: Promise<{ token: string }>;
};

export default async function OpenGraphImage(_props: Props) {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "stretch",
          background: "#050505",
          color: "white",
          display: "flex",
          height: "100%",
          overflow: "hidden",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            background:
              "radial-gradient(circle at 78% 18%, rgba(168, 85, 247, 0.48), transparent 30%), radial-gradient(circle at 20% 90%, rgba(109, 91, 255, 0.38), transparent 28%)",
            inset: 0,
            position: "absolute",
          }}
        />
        <div
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.055) 1px, transparent 1px)",
            backgroundSize: "54px 54px",
            inset: 0,
            opacity: 0.7,
            position: "absolute",
          }}
        />
        <div
          style={{
            border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: 34,
            display: "flex",
            flexDirection: "column",
            height: 520,
            justifyContent: "space-between",
            margin: 55,
            padding: 52,
            position: "relative",
            width: 1090,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div
                style={{
                  color: "#A855F7",
                  fontSize: 24,
                  fontWeight: 800,
                  letterSpacing: 5,
                  textTransform: "uppercase",
                }}
              >
                J Supreme Tech
              </div>
              <div style={{ color: "#B3B3B3", fontSize: 28 }}>
                Secure project intake
              </div>
            </div>
            <div
              style={{
                alignItems: "center",
                background: "rgba(123,47,255,0.16)",
                border: "1px solid rgba(168,85,247,0.42)",
                borderRadius: 18,
                color: "#FFFFFF",
                display: "flex",
                fontSize: 26,
                fontWeight: 800,
                height: 72,
                justifyContent: "center",
                width: 72,
              }}
            >
              JS
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div
              style={{
                fontSize: 72,
                fontWeight: 900,
                letterSpacing: -2,
                lineHeight: 0.95,
                maxWidth: 850,
              }}
            >
              Project Intake
            </div>
            <div style={{ color: "#D4D4D8", fontSize: 30, lineHeight: 1.35, maxWidth: 920 }}>
              Websites, apps, booking systems, CRMs, automations, dashboards, and digital ecosystems.
            </div>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            {["Private link", "Project details", "Faster quote"].map((item) => (
              <div
                key={item}
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 999,
                  color: "#F8FAFC",
                  fontSize: 24,
                  fontWeight: 700,
                  padding: "14px 22px",
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size,
  );
}

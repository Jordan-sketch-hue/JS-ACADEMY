import type { CSSProperties } from "react";
import type { StudioMock } from "@/lib/studio/types";

/**
 * Self-contained product mockups drawn purely in CSS/inline-styles — no
 * external images, so they export cleanly and carry no copyright risk. Each
 * fills its container and is tinted by the template accent.
 */

type MockProps = { accent: string; accent2: string };

const card: CSSProperties = {
  position: "absolute",
  inset: 0,
  background: "#FFFFFF",
  borderRadius: 18,
  boxShadow: "0 30px 60px rgba(0,0,0,0.18)",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  color: "#0B0B0C",
};

const bar = (c: string, w: number | string, h = 8, r = 999): CSSProperties => ({
  width: w,
  height: h,
  borderRadius: r,
  background: c,
  flexShrink: 0,
});

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>{children}</div>
  );
}

export function MockBrowser({ accent, accent2 }: MockProps) {
  return (
    <Shell>
      <div style={card}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "14px 16px",
            background: "#F1F1EF",
            borderBottom: "1px solid #E4E4E1",
          }}
        >
          <span style={{ width: 11, height: 11, borderRadius: 999, background: "#FF5F57" }} />
          <span style={{ width: 11, height: 11, borderRadius: 999, background: "#FEBC2E" }} />
          <span style={{ width: 11, height: 11, borderRadius: 999, background: "#28C840" }} />
          <div
            style={{
              marginLeft: 10,
              flex: 1,
              height: 22,
              borderRadius: 999,
              background: "#FFFFFF",
              border: "1px solid #E4E4E1",
            }}
          />
        </div>
        <div style={{ flex: 1, padding: 22, display: "flex", flexDirection: "column", gap: 14 }}>
          <div
            style={{
              height: "42%",
              borderRadius: 14,
              background: `linear-gradient(135deg, ${accent}, ${accent2})`,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 10,
              padding: 22,
            }}
          >
            <div style={bar("rgba(255,255,255,0.95)", "70%", 14)} />
            <div style={bar("rgba(255,255,255,0.6)", "52%", 10)} />
            <div style={{ ...bar("#FFFFFF", 120, 30, 8), marginTop: 6 }} />
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ height: 54, borderRadius: 10, background: "#EEF0F5" }} />
                <div style={bar("#D7D9E0", "80%", 7)} />
                <div style={bar("#E6E7EC", "60%", 7)} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}

export function MockDashboard({ accent, accent2 }: MockProps) {
  const bars = [52, 78, 41, 90, 64, 73, 48];
  return (
    <Shell>
      <div style={card}>
        <div style={{ display: "flex", height: "100%" }}>
          <div
            style={{
              width: "20%",
              background: "#0F1115",
              padding: 16,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div style={{ ...bar(accent, 26, 26, 8) }} />
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} style={bar(i === 1 ? accent : "#2A2D34", "85%", 9)} />
            ))}
          </div>
          <div style={{ flex: 1, padding: 18, display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={bar("#1F2227", 150, 13)} />
              <div style={bar(accent, 72, 26, 8)} />
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              {["#EEF0F5", "#EAF1FF", "#EFEAFF"].map((bgc, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    background: bgc,
                    borderRadius: 12,
                    padding: 14,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <div style={bar("#C7CBD4", "55%", 7)} />
                  <div style={bar(i === 0 ? "#0B0B0C" : i === 1 ? accent : accent2, "75%", 16)} />
                </div>
              ))}
            </div>
            <div
              style={{
                flex: 1,
                borderRadius: 12,
                border: "1px solid #ECECEC",
                padding: 16,
                display: "flex",
                alignItems: "flex-end",
                gap: 10,
              }}
            >
              {bars.map((h, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: `${h}%`,
                    borderRadius: 6,
                    background: i % 2 ? accent2 : accent,
                    opacity: 0.35 + (h / 100) * 0.65,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}

export function MockPhoneChat({ accent }: MockProps) {
  const Bubble = ({ me, w }: { me?: boolean; w: string }) => (
    <div style={{ display: "flex", justifyContent: me ? "flex-end" : "flex-start" }}>
      <div
        style={{
          maxWidth: "78%",
          width: w,
          height: 30,
          borderRadius: 14,
          background: me ? accent : "#EDEFF3",
        }}
      />
    </div>
  );
  return (
    <Shell>
      <div
        style={{
          position: "absolute",
          inset: "4% 22%",
          background: "#FFFFFF",
          borderRadius: 34,
          border: "10px solid #16181D",
          boxShadow: "0 30px 60px rgba(0,0,0,0.28)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            background: `linear-gradient(135deg, ${accent}, #16181D)`,
            color: "#fff",
            padding: "16px 16px 14px",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div style={{ width: 30, height: 30, borderRadius: 999, background: "rgba(255,255,255,0.25)" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <div style={bar("rgba(255,255,255,0.95)", 90, 8)} />
            <div style={bar("rgba(255,255,255,0.55)", 56, 6)} />
          </div>
        </div>
        <div style={{ flex: 1, padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
          <Bubble w="70%" />
          <Bubble me w="55%" />
          <Bubble w="62%" />
          <Bubble me w="40%" />
          <Bubble w="48%" />
        </div>
        <div style={{ padding: 12, borderTop: "1px solid #ECECEC", display: "flex", gap: 8 }}>
          <div style={{ flex: 1, height: 24, borderRadius: 999, background: "#F0F1F4" }} />
          <div style={{ width: 24, height: 24, borderRadius: 999, background: accent }} />
        </div>
      </div>
    </Shell>
  );
}

export function MockStore({ accent }: MockProps) {
  return (
    <Shell>
      <div style={card}>
        <div
          style={{
            padding: "14px 16px",
            borderBottom: "1px solid #EEE",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div style={bar("#15171C", 70, 11)} />
          <div style={{ flex: 1, height: 22, borderRadius: 999, background: "#F0F1F4" }} />
          <div style={{ width: 22, height: 22, borderRadius: 7, background: accent }} />
        </div>
        <div
          style={{
            flex: 1,
            padding: 16,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                background: "#F7F7F6",
                borderRadius: 12,
                padding: 10,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div
                style={{
                  height: 60,
                  borderRadius: 8,
                  background: `linear-gradient(135deg, #E9ECF3, ${i % 2 ? accent : "#DCE3F5"})`,
                }}
              />
              <div style={bar("#CDD0D8", "70%", 7)} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={bar("#0B0B0C", 36, 10)} />
                <div style={bar(accent, 34, 16, 6)} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}

export function MockCourier({ accent, accent2 }: MockProps) {
  return (
    <Shell>
      <div style={card}>
        <div style={{ position: "relative", height: "56%", background: "#EAF0F7", overflow: "hidden" }}>
          <svg viewBox="0 0 400 220" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
            <path d="M20 180 C 120 120, 180 200, 250 110 S 360 40, 388 60" fill="none" stroke={accent} strokeWidth="6" strokeLinecap="round" strokeDasharray="2 14" />
            <circle cx="20" cy="180" r="9" fill={accent2} />
            <circle cx="388" cy="60" r="11" fill={accent} />
            <g opacity="0.25" stroke="#9DB2CC" strokeWidth="2">
              <line x1="0" y1="60" x2="400" y2="60" />
              <line x1="0" y1="140" x2="400" y2="140" />
              <line x1="130" y1="0" x2="130" y2="220" />
              <line x1="270" y1="0" x2="270" y2="220" />
            </g>
          </svg>
        </div>
        <div style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={bar("#15171C", 120, 11)} />
            <div style={bar(accent, 70, 22, 999)} />
          </div>
          {[
            ["Picked up", true],
            ["In transit", true],
            ["Out for delivery", false],
          ].map(([, done], i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 999,
                  background: done ? accent : "#FFF",
                  border: `3px solid ${done ? accent : "#CBD2DC"}`,
                }}
              />
              <div style={bar(done ? "#1F2227" : "#C7CBD4", `${70 - i * 8}%`, 9)} />
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}

export function StudioMockView({ kind, accent, accent2 }: { kind: StudioMock } & MockProps) {
  switch (kind) {
    case "browser":
      return <MockBrowser accent={accent} accent2={accent2} />;
    case "dashboard":
      return <MockDashboard accent={accent} accent2={accent2} />;
    case "phoneChat":
      return <MockPhoneChat accent={accent} accent2={accent2} />;
    case "store":
      return <MockStore accent={accent} accent2={accent2} />;
    case "courier":
      return <MockCourier accent={accent} accent2={accent2} />;
    default:
      return null;
  }
}

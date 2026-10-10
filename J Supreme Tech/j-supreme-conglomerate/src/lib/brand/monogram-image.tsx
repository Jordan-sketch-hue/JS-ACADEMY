import { ImageResponse } from "next/og";

/** Full-bleed monogram PNG for PWA / app icons (OS applies its own masking). */
export function monogramIcon(size: number): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0E0F12",
          color: "#FAFAFA",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: Math.round(size * 0.44),
            fontWeight: 800,
            letterSpacing: Math.round(size * 0.012),
          }}
        >
          JS
        </div>
      </div>
    ),
    { width: size, height: size },
  );
}

import { ImageResponse } from "next/og";

export const alt = "PipAngel | Forex Signals & Automated Trading";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #09090b 0%, #18181b 50%, #064e3b 100%)",
          color: "#fafafa",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          PipAngel
        </div>
        <div
          style={{
            marginTop: 16,
            fontSize: 28,
            color: "#a1a1aa",
            textAlign: "center",
            maxWidth: 800,
          }}
        >
          Forex Signals & Automated Trading Platform
        </div>
        <div
          style={{
            marginTop: 32,
            padding: "12px 24px",
            background: "#10b981",
            borderRadius: 8,
            fontSize: 20,
            fontWeight: 600,
          }}
        >
          Trade Smarter
        </div>
      </div>
    ),
    { ...size }
  );
}

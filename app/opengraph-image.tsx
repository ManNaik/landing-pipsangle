import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "PipsAngel: copy trading for IC Markets MT5 accounts";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logo = await readFile(join(process.cwd(), "public/brand/pipsangel-logo-lg.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#0a0a0a",
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        <img src={logoSrc} width={432} height={90} alt="" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.02em", maxWidth: 980 }}>
            Copy our forex trades into your IC Markets MT5 account
          </div>
          <div style={{ marginTop: 28, fontSize: 30, color: "#a1a1aa", maxWidth: 980 }}>
            Every trade opened with a stop loss. Your money stays with IC Markets.
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#34d399" }}>pipsangel.com</div>
      </div>
    ),
    { ...size }
  );
}

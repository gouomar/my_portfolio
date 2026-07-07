import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} - ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Catppuccin Mocha - same palette as the site, so cards match the page.
const c = {
  base: "#1e1e2e",
  surface: "#313244",
  overlay: "#6c7086",
  subtext: "#a6adc8",
  text: "#cdd6f4",
  accent: "#89b4fa",
};

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: c.base,
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{ width: "28px", height: "28px", background: c.accent, borderRadius: "6px" }}
          />
          <div style={{ display: "flex", fontSize: "28px", color: c.overlay }}>
            gouomar
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: "84px",
              fontWeight: 700,
              color: c.text,
              letterSpacing: "-0.02em",
            }}
          >
            {site.name}
          </div>
          <div style={{ display: "flex", fontSize: "38px", color: c.subtext, marginTop: "12px" }}>
            {site.role}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "28px",
              color: c.overlay,
              marginTop: "28px",
              maxWidth: "820px",
              lineHeight: 1.4,
            }}
          >
            {site.tagline}
          </div>
        </div>

        <div style={{ display: "flex", height: "8px", width: "160px", background: c.accent, borderRadius: "4px" }} />
      </div>
    ),
    { ...size },
  );
}

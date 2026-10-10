import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { getCaseStudy } from "@/lib/case-studies";
import { site } from "@/lib/site";

/**
 * Link-preview cards, rendered once at build time in the site's own type.
 * The fonts are committed TTFs (the renderer can't read woff2), so the build
 * needs no network for these.
 */

export const ogSize = { width: 1200, height: 630 };

const c = {
  bg: "#F6F3EC",
  ink: "#1B1A17",
  body: "#4A463D",
  faint: "#5F5B51",
  accent: "#35506B",
  rule: "#DAD5C8",
};

const font = (file: string) => fs.readFileSync(path.join(process.cwd(), "assets", "fonts", file));

const fonts = () => [
  { name: "Fraunces", data: font("fraunces-600.ttf"), weight: 600 as const },
  { name: "Plex Mono", data: font("plex-mono-400.ttf"), weight: 400 as const },
  { name: "Work Sans", data: font("work-sans-400.ttf"), weight: 400 as const },
];

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        background: c.bg,
        color: c.ink,
        fontFamily: "Work Sans",
      }}
    >
      <div
        style={{
          display: "flex",
          fontFamily: "Plex Mono",
          fontSize: 22,
          letterSpacing: "0.08em",
          color: c.faint,
          textTransform: "uppercase",
        }}
      >
        {`${site.name} — ${site.role}`}
      </div>
      {children}
    </div>
  );
}

export function homeOgImage() {
  return new ImageResponse(
    (
      <Card>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ display: "flex", fontFamily: "Fraunces", fontSize: 88, letterSpacing: "-0.01em" }}>
            {site.name}
          </div>
          <div style={{ display: "flex", fontSize: 34, lineHeight: 1.4, color: c.body, maxWidth: 900 }}>
            {`“${site.tagline}”`}
          </div>
        </div>
        <div style={{ display: "flex", height: 2, width: 120, background: c.accent }} />
      </Card>
    ),
    { ...ogSize, fonts: fonts() },
  );
}

export function caseStudyOgImage(slug: string) {
  const study = getCaseStudy(slug);
  const [stat] = study.stats;

  return new ImageResponse(
    (
      <Card>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", fontFamily: "Fraunces", fontSize: 96, letterSpacing: "-0.01em" }}>
            {study.title}
          </div>
          <div style={{ display: "flex", fontSize: 32, lineHeight: 1.4, color: c.body, maxWidth: 1040 }}>
            {study.summary}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 28,
            paddingTop: 32,
            borderTop: `2px solid ${c.rule}`,
          }}
        >
          <div style={{ display: "flex", fontFamily: "Plex Mono", fontSize: 64, color: c.accent }}>
            {stat.value}
          </div>
          <div style={{ display: "flex", fontSize: 28, color: c.body }}>{stat.label}</div>
        </div>
      </Card>
    ),
    { ...ogSize, fonts: fonts() },
  );
}

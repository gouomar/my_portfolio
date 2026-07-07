/**
 * Renders every Mermaid source in content/diagrams/*.mmd to a static SVG in
 * public/diagrams/*.svg, via Kroki. This is an AUTHORING step, run by hand
 * (`npm run diagrams`) whenever a diagram changes — the committed SVGs are
 * what ship. The deployed site and its build need no browser and no network:
 * they just serve static SVG. No client-side mermaid.js anywhere.
 */
import fs from "node:fs";
import path from "node:path";

const SRC_DIR = path.join(process.cwd(), "content", "diagrams");
const OUT_DIR = path.join(process.cwd(), "public", "diagrams");
const KROKI = "https://kroki.io/mermaid/svg";

async function render(name: string, source: string): Promise<void> {
  const res = await fetch(KROKI, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: source,
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Kroki failed for ${name} (HTTP ${res.status}): ${detail}`);
  }
  const svg = await res.text();
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, `${name}.svg`), svg, "utf8");
  console.log(`✓ ${name}.svg (${(svg.length / 1024).toFixed(1)} kB)`);
}

async function main() {
  if (!fs.existsSync(SRC_DIR)) {
    console.log("No content/diagrams — nothing to render.");
    return;
  }
  const files = fs.readdirSync(SRC_DIR).filter((f) => f.endsWith(".mmd"));
  if (files.length === 0) {
    console.log("No .mmd files — nothing to render.");
    return;
  }
  for (const file of files) {
    const name = file.replace(/\.mmd$/, "");
    const source = fs.readFileSync(path.join(SRC_DIR, file), "utf8");
    await render(name, source);
  }
  console.log(`\nRendered ${files.length} diagram(s) → public/diagrams/`);
}

main().catch((err) => {
  console.error("\n✗ diagram render failed:\n");
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});

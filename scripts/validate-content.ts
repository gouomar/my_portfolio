/**
 * Build-time content gate. Runs as `prebuild`, so any case study with a
 * missing field, an off-taxonomy tag, or a slug that doesn't match its
 * filename fails `next build` before a single page is generated.
 *
 * Run manually with: npm run validate
 */
import { getAllProjects } from "../lib/content";

try {
  const projects = getAllProjects();
  console.log(
    `✓ content contract: ${projects.length} case ${
      projects.length === 1 ? "study" : "studies"
    } valid` +
      (projects.length
        ? ` — ${projects.map((p) => p.frontmatter.slug).join(", ")}`
        : ""),
  );
} catch (err) {
  console.error("\n✗ content contract failed:\n");
  console.error(err instanceof Error ? err.message : err);
  console.error("");
  process.exit(1);
}

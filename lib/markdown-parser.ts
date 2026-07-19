import fs from "fs";
import path from "path";
import matter from "gray-matter";

/* ─────────────────────────────────────────────────────────────────────
   Markdown parsing utilities for case studies
   Extracts: frontmatter, content, TOC, asides, breakouts
   ───────────────────────────────────────────────────────────────────── */

export type TocItem = {
  id: string;
  label: string;
  level: 2 | 3;
};

export type AsideBlock = {
  anchor: string;
  title: string;
  content: string;
};

export type BreakoutBlock = {
  anchor: string;
  content: string;
};

export type ParsedMarkdown = {
  content: string;
  toc: TocItem[];
  asides: AsideBlock[];
  breakouts: BreakoutBlock[];
};

/**
 * Extract TOC from markdown headings with {#id} anchors
 */
export function extractTOC(markdown: string): TocItem[] {
  const toc: TocItem[] = [];

  // Match ## Heading {#id} or ### Heading {#id}
  const headingRegex = /^(#{2,3})\s+(.+?)\s+\{#([^}]+)\}/gm;
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length as 2 | 3;
    const label = match[2].trim();
    const id = match[3];

    toc.push({ id, label, level });
  }

  return toc;
}

/**
 * Extract <Aside> blocks
 */
export function extractAsides(markdown: string): AsideBlock[] {
  const asides: AsideBlock[] = [];

  // Match <Aside anchor="..." title="...">content</Aside>
  const asideRegex = /<Aside\s+anchor="([^"]+)"\s+title="([^"]+)">([\s\S]*?)<\/Aside>/g;
  let match;

  while ((match = asideRegex.exec(markdown)) !== null) {
    asides.push({
      anchor: match[1],
      title: match[2],
      content: match[3].trim(),
    });
  }

  return asides;
}

/**
 * Extract <Breakout> blocks
 */
export function extractBreakouts(markdown: string): BreakoutBlock[] {
  const breakouts: BreakoutBlock[] = [];

  // Match <Breakout anchor="...">content</Breakout>
  const breakoutRegex = /<Breakout\s+anchor="([^"]+)">([\s\S]*?)<\/Breakout>/g;
  let match;

  while ((match = breakoutRegex.exec(markdown)) !== null) {
    breakouts.push({
      anchor: match[1],
      content: match[2].trim(),
    });
  }

  return breakouts;
}

/**
 * Remove <Aside>, <Breakout> tags and HTML comments from markdown.
 * Asides render in the rail; breakouts are replaced with a marker comment
 * that the page can use to inject them.
 */
export function stripCustomTags(markdown: string): string {
  // Remove HTML comments (MDX chokes on <!-- -->)
  let cleaned = markdown.replace(/<!--[\s\S]*?-->/g, "");

  // Remove <Aside> blocks completely (rendered in rail)
  cleaned = cleaned.replace(/<Aside\s+anchor="[^"]+"\s+title="[^"]+">([\s\S]*?)<\/Aside>/g, "");

  // Remove <Breakout> blocks — they'll be rendered inline via the page component
  // Leave a divider marker so we know where they were
  cleaned = cleaned.replace(
    /<Breakout\s+anchor="([^"]+)">([\s\S]*?)<\/Breakout>/g,
    (_, anchor) => `\n<div data-breakout="${anchor}" />\n`
  );

  // Convert {#id} into an anchor div above the heading
  cleaned = cleaned.replace(
    /^(#{2,3})\s+(.+?)\s+\{#([^}]+)\}/gm,
    (_, hashes, text, id) => `<div id="${id}" />\n\n${hashes} ${text}`
  );

  return cleaned;
}

/**
 * Read and parse a markdown file
 */
export function parseMarkdownFile(filePath: string): ParsedMarkdown {
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { content: markdown } = matter(fileContents);

  // Extract components
  const toc = extractTOC(markdown);
  const asides = extractAsides(markdown);
  const breakouts = extractBreakouts(markdown);

  // Clean content for MDX rendering
  const content = stripCustomTags(markdown);

  return { content, toc, asides, breakouts };
}

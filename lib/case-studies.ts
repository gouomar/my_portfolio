import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

/**
 * Case studies live in content/projects/<slug>.mdx. Everything here runs at
 * build time only: a file that breaks the contract below stops `next build`
 * with a message naming the file, so an off-spec case study can't ship.
 */

const DIR = path.join(process.cwd(), "content", "projects");

/** Every case study tells the same story, in this order. */
export const SECTIONS = [
  { id: "problem", heading: "The problem" },
  { id: "built", heading: "What I built" },
  { id: "thinking", heading: "The thinking" },
  { id: "learned", heading: "What I learned" },
  { id: "differently", heading: "What I’d do differently" },
] as const;

const text = z.string().trim().min(1);

const Frontmatter = z.object({
  title: text,
  /** Position in the homepage list. */
  order: z.number().int(),
  /** One-line hook on the homepage. */
  summary: text,
  /** Sentence under the title on the case-study page. */
  lede: text,
  role: text,
  stack: z.array(text).min(1),
  /** Omit when the code isn't public — never link to a 404. */
  repo: z.url().optional(),
  status: z.enum(["Shipped", "MVP", "Prototype", "Complete", "Archived"]),
  /** Month the write-up was written, YYYY-MM. */
  written: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "use YYYY-MM"),
  figure: z.object({
    caption: text,
    steps: z
      .array(
        z.object({
          node: text,
          note: text.optional(),
          accent: z.boolean().optional(),
        }),
      )
      .min(2),
  }),
  /** Every number carries the method behind it. */
  stats: z
    .array(z.object({ value: text, label: text, method: text }))
    .min(1)
    .max(3),
});

export type CaseStudy = z.infer<typeof Frontmatter> & {
  slug: string;
  /** Markdown body of each section, keyed by section id. */
  sections: Record<(typeof SECTIONS)[number]["id"], string>;
};

const normalize = (s: string) => s.trim().toLowerCase().replace(/'/g, "’");

function splitSections(file: string, body: string): CaseStudy["sections"] {
  const chunks = body.split(/^## +/m).slice(1);
  const found = chunks.map((chunk) => {
    const newline = chunk.indexOf("\n");
    return {
      heading: normalize(newline === -1 ? chunk : chunk.slice(0, newline)),
      body: newline === -1 ? "" : chunk.slice(newline + 1).trim(),
    };
  });

  const expected = SECTIONS.map((s) => normalize(s.heading));
  const actual = found.map((f) => f.heading);
  if (expected.join("|") !== actual.join("|")) {
    throw new Error(
      `${file}: sections must be exactly, in order:\n  ${SECTIONS.map((s) => `## ${s.heading}`).join("\n  ")}\nfound:\n  ${actual.map((h) => `## ${h}`).join("\n  ") || "(none)"}`,
    );
  }

  const sections = {} as CaseStudy["sections"];
  SECTIONS.forEach((s, i) => {
    if (!found[i].body) throw new Error(`${file}: "## ${s.heading}" is empty`);
    sections[s.id] = found[i].body;
  });
  return sections;
}

const cache = new Map<string, CaseStudy>();

export function getCaseStudy(slug: string): CaseStudy {
  const cached = cache.get(slug);
  if (cached) return cached;

  const file = path.join("content", "projects", `${slug}.mdx`);
  const { data, content } = matter(fs.readFileSync(path.join(DIR, `${slug}.mdx`), "utf8"));

  const parsed = Frontmatter.safeParse(data);
  if (!parsed.success) {
    throw new Error(`${file}: invalid frontmatter\n${z.prettifyError(parsed.error)}`);
  }

  const study = { ...parsed.data, slug, sections: splitSections(file, content) };
  cache.set(slug, study);
  return study;
}

export function getAllCaseStudies(): CaseStudy[] {
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => getCaseStudy(f.replace(/\.mdx$/, "")))
    .sort((a, b) => a.order - b.order);
}

/** "2026-07" → "Jul 2026" */
export function formatMonth(yyyyMm: string): string {
  const [year, month] = yyyyMm.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1)).toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

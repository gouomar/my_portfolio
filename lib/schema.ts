import { z } from "zod";
import { TAGS } from "./tags";

/**
 * The content contract. Every case study's frontmatter is validated against
 * this schema at build time. A file missing a required field, or using a tag
 * outside the taxonomy, fails the build - an off-spec case study is
 * impossible to ship, not merely discouraged.
 */
export const CaseStudySchema = z.object({
  /** Display title, e.g. "Agency Brain". */
  title: z.string().min(1),
  /** URL slug - must match the filename (enforced in the loader). */
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be kebab-case"),
  /** One-line descriptor shown under the title and in the project row. */
  oneLiner: z.string().min(1),
  /** Year or year range, e.g. "2024" or "2023 - 2024". */
  year: z.string().min(1),
  /** Your role, stated honestly, e.g. "Solo · 42 coursework". */
  role: z.string().min(1),
  /** Skill pills - chosen from the taxonomy only. No freeform tags. */
  tags: z.array(z.enum(TAGS)).min(1),
  /** Whether the project appears in the featured list on the homepage. */
  featured: z.boolean(),
  /** Sort order within the featured list (ascending). */
  order: z.number().int(),
  /** How complete the detail page is. "light" = honestly partial. */
  depth: z.enum(["deep", "light"]),
  /** External links. Both optional; a project may have neither. */
  links: z.object({
    github: z.url().optional(),
    demo: z.url().optional(),
  }),
  /** Optional thumbnail path, relative to /public. */
  thumbnail: z.string().optional(),
});

export type CaseStudyFrontmatter = z.infer<typeof CaseStudySchema>;

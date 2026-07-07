import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { CaseStudySchema, type CaseStudyFrontmatter } from "./schema";

const CONTENT_DIR = path.join(process.cwd(), "content", "projects");

export type Project = {
  frontmatter: CaseStudyFrontmatter;
  /** Raw MDX body (frontmatter stripped). */
  body: string;
};

function readAndValidate(fileName: string): Project {
  const filePath = path.join(CONTENT_DIR, fileName);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  const parsed = CaseStudySchema.safeParse(data);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  • ${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("\n");
    throw new Error(
      `Invalid frontmatter in content/projects/${fileName}:\n${issues}`,
    );
  }

  const slugFromFile = fileName.replace(/\.mdx$/, "");
  if (parsed.data.slug !== slugFromFile) {
    throw new Error(
      `Slug mismatch in content/projects/${fileName}: frontmatter slug ` +
        `"${parsed.data.slug}" must equal the filename "${slugFromFile}".`,
    );
  }

  return { frontmatter: parsed.data, body: content };
}

/** All projects, validated, sorted by `order` ascending. */
export function getAllProjects(): Project[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx"));

  const projects = files.map(readAndValidate);
  return projects.sort((a, b) => a.frontmatter.order - b.frontmatter.order);
}

/** Featured projects only (for the homepage Projects section). */
export function getFeaturedProjects(): Project[] {
  return getAllProjects().filter((p) => p.frontmatter.featured);
}

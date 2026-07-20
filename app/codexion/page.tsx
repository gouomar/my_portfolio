import { MDXRemote } from "next-mdx-remote/rsc";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import Link from "next/link";
import type { Metadata } from "next";
import { StickyTOC } from "@/components/StickyTOC";

export const metadata: Metadata = {
  title: "Codexion — Case Study",
  description:
    "A multithreaded C simulation where N independent threads compete for shared resources without ever deadlocking or starving. Engineered with POSIX threads, a hand-rolled min-heap scheduler, and a dedicated monitor.",
};

/* ─── Helpers ──────────────────────────────────────────────────────── */

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function extractToc(markdown: string) {
  const toc: { id: string; label: string; level: 2 | 3 }[] = [];
  for (const line of markdown.split("\n")) {
    const m = line.match(/^(#{2,3})\s+(.+)$/);
    if (m) {
      const level = m[1].length as 2 | 3;
      const label = m[2].trim();
      toc.push({ id: slugify(label), label, level });
    }
  }
  return toc;
}

/* ─── Page ──────────────────────────────────────────────────────────── */

export default function CodexionPage() {
  const mdPath = path.join(process.cwd(), "content", "projects", "codexion.mdx");
  const raw = fs.readFileSync(mdPath, "utf-8");
  const { content } = matter(raw);
  const toc = extractToc(content);

  return (
    <div className="cs-page">
      {/* Back */}
      <div className="cs-back">
        <Link href="/#projects" className="cs-back-link">
          ← Back to portfolio
        </Link>
      </div>

      {/* Two-column body */}
      <div className="cs-grid">
        {/* ── LEFT: Main content ──────────────────────────────── */}
        <main className="cs-main">
          {/* Hero */}
          <header className="cs-hero">
            <span className="cs-badge">Case Study</span>
            <h1 className="cs-title">Codexion</h1>
            <p className="cs-subtitle">
              A multithreaded C simulation where N independent threads compete
              for shared resources without ever deadlocking or starving.
            </p>
            <div className="cs-stats">
              <div className="cs-stat-item">
                <span className="cs-stat-val">0</span>
                <span className="cs-stat-lbl">Data Races</span>
              </div>
              <div className="cs-stat-item">
                <span className="cs-stat-val">0 bytes</span>
                <span className="cs-stat-lbl">Memory Leaked</span>
              </div>
              <div className="cs-stat-item">
                <span className="cs-stat-val">~2ms</span>
                <span className="cs-stat-lbl">Burnout Detection</span>
              </div>
            </div>
            <div className="cs-tags">
              {["C", "pthreads", "min-heap", "Valgrind"].map((t) => (
                <span key={t} className="tag-pill inline-block rounded-full border border-surface-0 px-3 py-1 font-mono text-xs text-subtext">{t}</span>
              ))}
            </div>
          </header>

          {/* Markdown content */}
          <article className="prose-case">
            <MDXRemote
              source={content}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [
                    rehypeSlug,
                    [rehypePrettyCode, { theme: "catppuccin-mocha", keepBackground: false }],
                  ],
                },
              }}
            />
          </article>

          {/* Footer */}
          <footer className="cs-footer">
            <Link href="/#projects">← Back to all projects</Link>
            <a href="https://github.com/gouomar/codexion" target="_blank" rel="noopener noreferrer">
              View on GitHub ↗
            </a>
          </footer>
        </main>

        {/* ── RIGHT: TOC ───────────────────────────────────────── */}
        <aside className="cs-sidebar">
          <StickyTOC toc={toc} />
        </aside>
      </div>
    </div>
  );
}

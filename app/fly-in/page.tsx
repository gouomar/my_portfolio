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
  title: "Fly-In — Case Study",
  description:
    "A collision-free drone traffic controller that routes 25 drones through a 54-hub, 70-edge map to a single landing zone. Space-time A* solves the hardest map in ~55 ms — zero collisions by construction.",
};

/* ─── Helpers ──────────────────────────────────────────────────────── */

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function extractTOC(markdown: string) {
  const toc: { id: string; label: string; level: 2 | 3 }[] = [];
  for (const line of markdown.split("\n")) {
    const match = line.match(/^(#{2,3})\s+(.+)/);
    if (match) {
      const level = match[1].length as 2 | 3;
      const label = match[2].trim();
      toc.push({ id: slugify(label), label, level });
    }
  }
  return toc;
}

/* ─── Page ──────────────────────────────────────────────────────────── */

export default function FlyInPage() {
  const mdPath = path.join(process.cwd(), "content", "projects", "fly-in.mdx");
  const raw = fs.readFileSync(mdPath, "utf-8");
  const { content } = matter(raw);
  const toc = extractTOC(content);

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
            <h1 className="cs-title">Fly-In</h1>
            <p className="cs-subtitle">
              A collision-free drone traffic controller that routes 25 drones
              through a 54-hub, 70-edge map to a single landing zone. Built a
              custom space-time A* that solves the hardest map in ~55 ms across
              10 difficulty levels — zero collisions by construction.
            </p>
            <div className="cs-stats">
              <div className="cs-stat-item">
                <span className="cs-stat-val">54 hubs</span>
                <span className="cs-stat-lbl">70-edge map</span>
              </div>
              <div className="cs-stat-item">
                <span className="cs-stat-val">25</span>
                <span className="cs-stat-lbl">Drones Routed</span>
              </div>
              <div className="cs-stat-item">
                <span className="cs-stat-val">~55 ms</span>
                <span className="cs-stat-lbl">Solve Time</span>
              </div>
              <div className="cs-stat-item">
                <span className="cs-stat-val">0</span>
                <span className="cs-stat-lbl">Collisions</span>
              </div>
            </div>
            <div className="cs-tags">
              {["Space-time A*", "Dijkstra", "Python", "Pydantic v2"].map((t) => (
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
            <a href="https://github.com/gouomar/fly-in" target="_blank" rel="noopener noreferrer">
              View on GitHub ↗
            </a>
          </footer>
        </main>

        {/* ── RIGHT: TOC ─────────────────────────────────────── */}
        <aside className="cs-sidebar">
          <StickyTOC toc={toc} />
        </aside>
      </div>
    </div>
  );
}

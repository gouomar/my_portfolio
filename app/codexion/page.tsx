import { parseMarkdownFile } from "@/lib/markdown-parser";
import { MDXRemote } from "next-mdx-remote/rsc";
import path from "path";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import Link from "next/link";
import type { Metadata } from "next";
import { StickyTOC } from "@/components/StickyTOC";

export const metadata: Metadata = {
  title: "Codexion — Case Study",
  description:
    "A multithreaded C simulation where N independent threads compete for shared resources without ever deadlocking or starving. Engineered with POSIX threads, a hand-rolled min-heap scheduler, and a dedicated monitor.",
};

/* ─── Side notes: personal commentary per section ──────────────────── */

const sideNotes: Record<string, { label: string; text: string }> = {
  "the-problem": {
    label: "the real challenge",
    text: "Metaphor aside, this is exactly what makes concurrency hard. One mistake and everything silently halts. You can't just 'try again'.",
  },
  "how-it-works": {
    label: "the blueprint",
    text: "You can't just code this. The state loop had to be drawn on paper first. If the state machine is wrong, the code will never be right.",
  },
  "architecture": {
    label: "paranoia as architecture",
    text: "Keep locks scoped strictly to what they actually protect. Global locks kill performance. Strict isolation is the whole point.",
  },
  "the-hard-parts": {
    label: "where the time went",
    text: "A naive while(1) loop crashes immediately. Fixing the deadlock dance was a genuine puzzle that took days to get right.",
  },
  "does-it-work": {
    label: "validation",
    text: "Not just 'it ran once' — Valgrind and ThreadSanitizer pounded this code over thousands of runs and it held up.",
  },
};

/* ─── Page ──────────────────────────────────────────────────────────── */

export default function CodexionPage() {
  const mdPath = path.join(process.cwd(), "content", "projects", "codexion.mdx");
  const { content, toc, asides } = parseMarkdownFile(mdPath);

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

        {/* ── RIGHT: TOC + Side Notes + Asides ────────────────── */}
        <aside className="cs-sidebar">
          {/* TOC — handles sticky scroll behavior */}
          <StickyTOC toc={toc} />

          {/* Side notes + asides interleaved by section */}
          {toc
            .filter((item) => sideNotes[item.id] || asides.find((a) => a.anchor === item.id))
            .map((item) => (
              <div key={item.id} className="cs-side-block" data-section={item.id}>
                {/* Personal side note */}
                {sideNotes[item.id] && (
                  <div className="cs-note">
                    <span className="cs-note-label">{sideNotes[item.id].label}</span>
                    <p>{sideNotes[item.id].text}</p>
                  </div>
                )}

                {/* Aside data (tables etc) */}
                {asides.find((a) => a.anchor === item.id) && (
                  <div className="cs-aside-card">
                    <span className="cs-aside-title">
                      {asides.find((a) => a.anchor === item.id)!.title}
                    </span>
                    <div className="cs-aside-body prose-case">
                      <MDXRemote
                        source={asides.find((a) => a.anchor === item.id)!.content}
                        options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
        </aside>
      </div>
    </div>
  );
}

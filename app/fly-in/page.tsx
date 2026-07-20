import { parseMarkdownFile } from "@/lib/markdown-parser";
import { MDXRemote } from "next-mdx-remote/rsc";
import path from "path";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import Link from "next/link";
import type { Metadata } from "next";
import { StickyTOC } from "@/components/StickyTOC";

export const metadata: Metadata = {
  title: "Fly-In — Case Study",
  description:
    "A collision-free drone traffic controller that routes 25 drones through a 54-hub, 70-edge map to a single landing zone. Space-time A* solves the hardest map in ~55 ms — zero collisions by construction.",
};

/* ─── Side notes: personal commentary per section ──────────────────── */

const sideNotes: Record<string, { label: string; text: string }> = {
  "the-problem": {
    label: "gridlock",
    text: "Everyone gets pathfinding. The real problem is scheduling: deciding who has to wait so someone else can move.",
  },
  "architecture": {
    label: "boundaries",
    text: "Pydantic validation at the edge means the A* engine never has to write a single 'if type != int' defense. It just trusts the input.",
  },
  "planning-one-drone": {
    label: "emergent behavior",
    text: "The coolest part of the project: I didn't write a convoy algorithm. They just naturally pipeline because of the reservation table.",
  },
  "move-takes-two-turns": {
    label: "the visual lie",
    text: "If the solver says a drone takes 2 turns, but the UI snaps it there in 1 turn, the visual is lying. Synchronizing the 3D renderer to the solver's dilated time was surprisingly tricky.",
  },
  "compass": {
    label: "the heuristic",
    text: "Standard A* distance heuristics fail here because time != distance. A backwards Dijkstra search solves the exact 'turns-to-goal' cost perfectly.",
  },
  "does-it-work": {
    label: "guarantees",
    text: "Zero collisions isn't a hope, it's a structural guarantee of the reservation system. Every conflict is a reservation miss.",
  },
};

/* ─── Page ──────────────────────────────────────────────────────────── */

export default function FlyInPage() {
  const mdPath = path.join(process.cwd(), "content", "projects", "fly-in.mdx");
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

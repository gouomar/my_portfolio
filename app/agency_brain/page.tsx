import { parseMarkdownFile } from "@/lib/markdown-parser";
import { MDXRemote } from "next-mdx-remote/rsc";
import path from "path";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import Link from "next/link";
import type { Metadata } from "next";
import { MermaidDiagram } from "@/components/MermaidDiagram";
import { StickyTOC } from "@/components/StickyTOC";

export const metadata: Metadata = {
  title: "Agency Brain — Case Study",
  description:
    "A multilingual WhatsApp assistant for a study-abroad agency. Constrained-decoding classifiers push routing accuracy from 82% to 89%.",
};

/* ─── Side notes: personal commentary per section ──────────────────── */

const sideNotes: Record<string, { label: string; text: string }> = {
  "the-problem": {
    label: "the spark",
    text: "Agency owner showed me a WhatsApp thread — 3 students ghosted at 11pm because no one was awake. That's not a 'fun AI project', that's a business bleeding clients in real time.",
  },
  "in-plain-terms": {
    label: "note to self",
    text: "I wrote these definitions for myself first. Half the v1 bugs came from confusing 'out of scope' with 'the model doesn't know.' They need completely different handlers.",
  },
  "how-it-works": {
    label: "the paper napkin moment",
    text: "Drew this on paper at a café. Once you see the two forks, you realize neither needs a big model — just a small one that literally cannot lie about its answer.",
  },
  "architecture": {
    label: "paranoia as architecture",
    text: "5 layers isn't clever, it's paranoid. If any layer touches what it shouldn't, the whole thing becomes untestable. Strict boundaries = debugging at 2am without crying.",
  },
  "the-hard-parts": {
    label: "where the weekends went",
    text: "Everything below took 80% of the time. The happy path works in a weekend. Making it survive Darija slang at midnight? That's the real job.",
  },
  "darija-wall": {
    label: "47 regex patterns later...",
    text: "Spent two days writing regex for Darija greetings. 47 patterns. Then I let a model decide and it just... worked. Sometimes the right abstraction is admitting you can't enumerate the problem.",
  },
  "one-number": {
    label: "the 0.66 incident",
    text: "Threshold passed all French test cases. Shipped it. Arabic user showed up → instant failure. Your test set's language distribution IS your coverage. Learned that the hard way.",
  },
  "results": {
    label: "small n, big signal",
    text: "28 messages. I know it's small. But they're hand-picked adversarial cases — the exact edges where routing breaks. A bigger random sample scores higher and teaches less.",
  },
  "constrained-decoding-value": {
    label: "counter-intuitive finding",
    text: "Constrained decoding doesn't help on yes/no — it only matters when you need structure. Most blog posts get this backwards. Proud I caught it.",
  },
  "latency-cost": {
    label: "7 seconds is fine, actually",
    text: "Sounds awful but WhatsApp isn't Slack. People send and check back later. The real constraint is cost per message, not latency. $0.00 routing > fast routing.",
  },
  "roadmap": {
    label: "if I started over",
    text: "I'd begin with the schema system. The two gates were the MVP — the real product is 'add any decision without touching generation code.'",
  },
  "stack": {
    label: "boring on purpose",
    text: "Nothing exotic. This runs on a single VPS in Morocco, not a Kubernetes cluster. Boring tech is maintainable tech. That's the whole philosophy.",
  },
};

/* ─── Breakout renderer ────────────────────────────────────────────── */

function BreakoutBlock({ content }: { content: string }) {
  const isMermaid = content.includes("```mermaid");
  const codeMatch = content.match(/```(?:\w*)\n([\s\S]*?)```/);
  const code = codeMatch ? codeMatch[1] : content;

  if (isMermaid) {
    return (
      <div className="cs-breakout">
        <MermaidDiagram chart={code} />
      </div>
    );
  }

  return (
    <div className="cs-breakout">
      <pre><code>{code}</code></pre>
    </div>
  );
}

/* ─── MDX component overrides ──────────────────────────────────────── */

function createComponents(breakouts: { anchor: string; content: string }[]) {
  return {
    BreakoutMarker: (props: { anchor: string }) => {
      const b = breakouts.find((x) => x.anchor === props.anchor);
      if (b) return <BreakoutBlock content={b.content} />;
      return null;
    },
  };
}

/* ─── Page ──────────────────────────────────────────────────────────── */

export default function AgencyBrainPage() {
  const mdPath = path.join(process.cwd(), "agency_brain_refactored.md");
  const { content, toc, asides, breakouts } = parseMarkdownFile(mdPath);

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
            <h1 className="cs-title">Agency Brain</h1>
            <p className="cs-subtitle">
              A multilingual WhatsApp assistant for a study-abroad agency handling
              student questions in French, Arabic, and Darija.
            </p>
            <div className="cs-stats">
              <div className="cs-stat-item">
                <span className="cs-stat-val">82% → 89%</span>
                <span className="cs-stat-lbl">Routing Accuracy</span>
              </div>
              <div className="cs-stat-item">
                <span className="cs-stat-val">50%</span>
                <span className="cs-stat-lbl">Traffic Deflected</span>
              </div>
              <div className="cs-stat-item">
                <span className="cs-stat-val">$0.00</span>
                <span className="cs-stat-lbl">Routing Cost / 1k msgs</span>
              </div>
            </div>
            <div className="cs-tags">
              {["RAG", "Constrained Decoding", "FastAPI", "ChromaDB", "Python"].map((t) => (
                <span key={t} className="tag-pill inline-block rounded-full border border-surface-0 px-3 py-1 font-mono text-xs text-subtext">{t}</span>
              ))}
            </div>
          </header>

          {/* Markdown content */}
          <article className="prose-case">
            <MDXRemote
              source={content}
              components={createComponents(breakouts)}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [[rehypePrettyCode, { theme: "catppuccin-mocha", keepBackground: false }]],
                },
              }}
            />
          </article>

          {/* Footer */}
          <footer className="cs-footer">
            <Link href="/#projects">← Back to all projects</Link>
            <a href="https://github.com/gouomar/rag_agency" target="_blank" rel="noopener noreferrer">
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

import { parseMarkdownFile } from "@/lib/markdown-parser";
import { MDXRemote } from "next-mdx-remote/rsc";
import path from "path";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agency Brain — Case Study",
  description:
    "A multilingual WhatsApp assistant for a study-abroad agency. Constrained-decoding classifiers push routing accuracy from 82% to 89%.",
};

/* ─── Side notes: personal commentary per section ──────────────────── */

const sideNotes: Record<string, string> = {
  "the-problem":
    "This was day one frustration — the agency owner showed me a WhatsApp thread where 3 students got ghosted at 11pm because no one was awake to reply. That's when I knew this wasn't a 'fun AI project', it was a real business bleeding clients.",
  "in-plain-terms":
    "I wrote these definitions for myself first. Half the mistakes in v1 came from me confusing 'out of scope' with 'the model doesn't know' — they're different failure modes and need different handlers.",
  "how-it-works":
    "Drawing this diagram on paper was the moment I stopped being stuck. Once you see the two forks, you realize neither one needs a big model — just a small one that can't lie about its answer.",
  "architecture":
    "The 5-layer split isn't clever — it's me being paranoid. If any layer touches something it shouldn't, the whole system becomes untestable. Strict boundaries = easy debugging at 2am.",
  "the-hard-parts":
    "Everything below this line is what took 80% of the time. The happy path works in a weekend. Making it not break on Darija slang at midnight? That's the actual engineering.",
  "darija-wall":
    "I spent two days on a regex for Darija greetings before I gave up and let a model decide. The regex had 47 patterns. The model just… gets it. Sometimes the right abstraction is admitting you can't enumerate the problem.",
  "one-number":
    "This one hurt. The 0.66 threshold passed all my French test cases and I shipped it. Then an Arabic user showed up and it broke instantly. Lesson: your test set's language distribution IS your coverage.",
  "results":
    "28 messages isn't a lot. I know. But they're hand-picked adversarial cases — the exact edge cases where routing breaks. A bigger random sample would score higher and teach me less.",
  "constrained-decoding-value":
    "This is the finding I'm most proud of because it's counter-intuitive: constrained decoding doesn't help on yes/no. It only matters when you need structure. Most blog posts get this backwards.",
  "latency-cost":
    "7 seconds sounds awful but WhatsApp isn't Slack — people don't stare at typing indicators. They send and check back. The real constraint is cost, not latency, for this use case.",
  "roadmap":
    "If I rebuild this tomorrow I'd start with the schema system. The two gates were the MVP; the real product is 'add any decision without touching generation code.'",
  "stack":
    "Nothing exotic. The boring stack choice was deliberate — this needs to run on a single VPS in Morocco, not a Kubernetes cluster. Boring is maintainable.",
};

/* ─── Breakout renderer ────────────────────────────────────────────── */

function BreakoutBlock({ content }: { content: string }) {
  const codeMatch = content.match(/```(?:\w*)\n([\s\S]*?)```/);
  const code = codeMatch ? codeMatch[1] : content;
  return (
    <div className="cs-breakout">
      <pre><code>{code}</code></pre>
    </div>
  );
}

/* ─── MDX component overrides ──────────────────────────────────────── */

function createComponents(breakouts: { anchor: string; content: string }[]) {
  return {
    div: (props: React.ComponentProps<"div"> & { "data-breakout"?: string }) => {
      const anchor = props["data-breakout"];
      if (anchor) {
        const b = breakouts.find((x) => x.anchor === anchor);
        if (b) return <BreakoutBlock content={b.content} />;
      }
      return <div {...props} />;
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
          {/* TOC */}
          <nav className="cs-toc">
            <span className="cs-toc-label">On this page</span>
            <ul className="cs-toc-list">
              {toc.map((item) => (
                <li key={item.id} className={item.level === 3 ? "cs-toc-sub" : ""}>
                  <a href={`#${item.id}`}>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Side notes + asides interleaved by section */}
          {toc
            .filter((item) => sideNotes[item.id] || asides.find((a) => a.anchor === item.id))
            .map((item) => (
              <div key={item.id} className="cs-side-block" data-section={item.id}>
                {/* Personal side note */}
                {sideNotes[item.id] && (
                  <div className="cs-note">
                    <span className="cs-note-label">📝 Side note — {item.label}</span>
                    <p>{sideNotes[item.id]}</p>
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

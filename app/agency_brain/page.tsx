import type { Metadata } from "next";
import { CaseStudySidebar } from "@/components/case-study/CaseStudySidebar";
import type { SidebarItem } from "@/components/case-study/CaseStudySidebar";
import Link from "next/link";

/* ─── Sidebar navigation ────────────────────────────────────────────── */

const sidebarItems: SidebarItem[] = [
  {
    id: "overview",
    label: "Overview",
    children: [
      { id: "introduction", label: "Introduction" },
      { id: "the-problem", label: "The Problem" },
      { id: "design-philosophy", label: "The Design Philosophy" },
    ],
  },
  {
    id: "architecture",
    label: "System Architecture",
    children: [
      { id: "five-layer-blueprint", label: "The 5-Layer Blueprint" },
      { id: "layer-specifications", label: "Layer Specifications" },
      { id: "core-shifts", label: "Core Architectural Shifts" },
    ],
  },
  {
    id: "guardrails",
    label: "The Guardrails",
    children: [
      { id: "intent-gate", label: "The Intent Gate" },
      { id: "scope-gate", label: "The Scope Gate" },
    ],
  },
  {
    id: "engineering-challenges",
    label: "Engineering Challenges",
    children: [
      { id: "darija-wall", label: "The Darija Wall" },
      { id: "cross-lingual", label: "Cross-Lingual Retrieval" },
      { id: "follow-up-paradox", label: "The Follow-Up Paradox" },
      { id: "fault-tolerance", label: "Graceful Failures" },
    ],
  },
  {
    id: "benchmarks",
    label: "Empirical Results",
    children: [
      { id: "routing-accuracy", label: "Routing Accuracy" },
      { id: "constrained-decoding", label: "Constrained Decoding Delta" },
      { id: "latency-cost", label: "Latency & Cost" },
    ],
  },
  {
    id: "future",
    label: "Future Roadmap",
    children: [{ id: "what-id-do-differently", label: "What I'd Do Differently" }],
  },
  {
    id: "deployment",
    label: "Deployment & Stack",
    children: [
      { id: "tech-stack", label: "The Technology Stack" },
    ],
  },
];

/* ─── Metadata ──────────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: "Agency Brain — Case Study",
  description:
    "A multilingual WhatsApp assistant for a study-abroad agency. Constrained-decoding classifiers push routing accuracy from 82% to 89%, cutting generation costs in half.",
};

/* ─── Page ──────────────────────────────────────────────────────────── */

export default function AgencyBrainPage() {
  return (
    <div className="cs-layout">
      <CaseStudySidebar
        items={sidebarItems}
        projectTitle="Agency Brain"
        githubUrl="https://github.com/gouomar/rag_agency"
      />

      <main className="cs-content">
        {/* ━━━ Hero Banner ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="cs-hero">
          <div className="cs-hero-badge">Case Study</div>
          <h1 className="cs-hero-title">Agency Brain</h1>
          <p className="cs-hero-subtitle">
            A multilingual WhatsApp assistant for a study-abroad agency handling
            student questions in French, Arabic, and Darija.
          </p>
          <div className="cs-hero-stats">
            <div className="cs-hero-stat">
              <span className="cs-hero-stat-value">82% → 89%</span>
              <span className="cs-hero-stat-label">Routing Accuracy</span>
            </div>
            <div className="cs-hero-stat">
              <span className="cs-hero-stat-value">50%</span>
              <span className="cs-hero-stat-label">Traffic Deflected from LLM</span>
            </div>
            <div className="cs-hero-stat">
              <span className="cs-hero-stat-value">$0.00</span>
              <span className="cs-hero-stat-label">Local Routing Cost / 1k msgs</span>
            </div>
          </div>
          <div className="cs-hero-tags">
            <span className="cs-tag">RAG</span>
            <span className="cs-tag">Constrained Decoding</span>
            <span className="cs-tag">FastAPI</span>
            <span className="cs-tag">ChromaDB</span>
            <span className="cs-tag">Python</span>
          </div>
        </div>

        {/* ━━━ Overview ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section id="overview" className="cs-section">
          <div className="cs-section-header">
            <span className="cs-section-number">01</span>
            <h2 className="cs-section-title">Overview</h2>
          </div>

          <div id="introduction" className="cs-subsection">
            <h3 className="cs-subsection-title">Introduction</h3>
            <p className="cs-paragraph cs-lead">
              <em>Students text in French, Arabic, and Darija, at all hours, and expect a human-quality answer.</em>
            </p>
            <p className="cs-paragraph">
              The interesting work here isn&apos;t the model. It&apos;s the <strong>orchestration</strong>: knowing which of many moving pieces — a WhatsApp bridge, two small local classifiers, a vector store, a hosted LLM, a memory buffer — should make each decision, and wiring them so the whole thing behaves predictably even when one piece misbehaves.
            </p>
          </div>

          <div id="the-problem" className="cs-subsection">
            <h3 className="cs-subsection-title">The Problem</h3>
            <div className="cs-callout">
              <span className="cs-callout-icon">🇲🇦</span>
              <span className="cs-callout-label">The Moroccan WhatsApp Context</span>
            </div>
            <p className="cs-paragraph">
              A study-abroad agency in Morocco lives inside its WhatsApp inbox. Students fire off questions all day — <code>&quot;chhal khasni nkhles bach n9ra f canada?&quot;</code>, <code>&quot;ما هي شروط الفيزا؟&quot;</code>, <code>&quot;bonjour, les universités disponibles au UK svp&quot;</code> — three languages and one romanized street dialect (Darija) braided together in a single thread. Every unanswered message at 11pm is a lost client.
            </p>
            <p className="cs-paragraph">
              The naive build is one dumb pipe: forward every message to an LLM, return whatever comes back. It works in a demo and falls apart in production — you pay for a model call on <code>&quot;salam&quot;</code>, and you pay again when someone asks about the weather.
            </p>
            <p className="cs-paragraph">
              So the real problem here was never generation. It was <strong>orchestration</strong>: deciding — cheaply and <em>reliably</em> — which messages deserve an expensive answer and which can be handled for free, before a single dirham is spent.
            </p>
          </div>

          <div id="design-philosophy" className="cs-subsection">
            <h3 className="cs-subsection-title">The Design Philosophy</h3>
            <div className="cs-callout">
              <span className="cs-callout-icon">💡</span>
              <span className="cs-callout-label">In Plain Terms</span>
            </div>
            <div className="cs-definition-grid">
              <div className="cs-definition">
                <dt>Knowledge base (KB)</dt>
                <dd>The agency&apos;s own documents — visa rules, tuition, university lists, deadlines. The assistant may answer <em>only</em> from these. It never invents facts.</dd>
              </div>
              <div className="cs-definition">
                <dt>In scope vs. out of scope</dt>
                <dd>A question is <em>in scope</em> if the KB actually contains the answer. It&apos;s <em>out of scope</em> if it doesn&apos;t. Out-of-scope messages are politely handed to a human agent.</dd>
              </div>
              <div className="cs-definition">
                <dt>The three lanes</dt>
                <dd>Every message ends up in exactly one of three paths — a <strong>greeting</strong> (free canned welcome), an <strong>out-of-scope</strong> question (free, handed to a human), or an <strong>answerable</strong> question (the <em>only</em> path that pays for a Gemini call).</dd>
              </div>
              <div className="cs-definition">
                <dt>Routing</dt>
                <dd>Deciding which lane a message belongs in. Most of this case study is the story of making that one decision reliable.</dd>
              </div>
              <div className="cs-definition">
                <dt>Constrained decoding</dt>
                <dd>Forcing a language model&apos;s output to fit a fixed shape — one of a set of labels, or a specific JSON schema — <em>at generation time</em>, so it is literally incapable of returning anything you can&apos;t act on.</dd>
              </div>
            </div>
          </div>
        </section>

        {/* ━━━ System Architecture ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section id="architecture" className="cs-section">
          <div className="cs-section-header">
            <span className="cs-section-number">02</span>
            <h2 className="cs-section-title">System Architecture</h2>
          </div>

          <div id="five-layer-blueprint" className="cs-subsection">
            <h3 className="cs-subsection-title">The 5-Layer Boundary Blueprint</h3>
            <p className="cs-paragraph">
              The system is split into five boundaries, drawn on paper before any code. The point of the split is that <strong>each layer makes exactly one kind of decision and hands a clean result to the next</strong> — the bridge never reasons, the classifiers never generate, the generator never routes.
            </p>
          </div>

          <div id="layer-specifications" className="cs-subsection">
            <h3 className="cs-subsection-title">Layer Specifications</h3>
            <div className="cs-table-wrapper">
              <table className="cs-table">
                <thead>
                  <tr>
                    <th>Layer</th>
                    <th>Role</th>
                    <th>Mechanism</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Bridge</strong></td>
                    <td>WhatsApp I/O, nothing else</td>
                    <td><code>whatsapp-web.js</code> + HTTP, zero AI logic</td>
                  </tr>
                  <tr>
                    <td><strong>Routing</strong></td>
                    <td>The two decisions that used to be guesswork</td>
                    <td><code>Qwen2.5-1.5B-Instruct</code> (local, CPU), output constrained via <code>outlines</code></td>
                  </tr>
                  <tr>
                    <td><strong>Retrieval</strong></td>
                    <td>Find evidence across languages</td>
                    <td><code>multilingual-e5-large</code> → ChromaDB, top-K + scores</td>
                  </tr>
                  <tr>
                    <td><strong>Generation</strong></td>
                    <td>Write the human-quality answer</td>
                    <td>Gemini 2.5 Flash, answerable lane only</td>
                  </tr>
                  <tr>
                    <td><strong>Memory</strong></td>
                    <td>Contextual follow-ups</td>
                    <td>per-phone <code>ChatMemoryBuffer</code></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div id="core-shifts" className="cs-subsection">
            <h3 className="cs-subsection-title">Core Architectural Shifts</h3>
            <p className="cs-paragraph">
              Three decisions shaped this system, each chosen over the obvious alternative:
            </p>
            <div className="cs-shift-cards">
              <div className="cs-shift-card">
                <div className="cs-shift-card-header">
                  <span className="cs-shift-card-number">1</span>
                  <h4 className="cs-shift-card-title">Two constrained classifiers over two heuristics</h4>
                </div>
                <p className="cs-shift-card-body">
                  The old routing was a keyword regex and a single cosine-similarity float — both cheap, both brittle. I replaced each with a small local model whose output is <strong>mechanically constrained</strong> — to a fixed label for the yes/no gates — so the router receives a structured verdict it can <em>always</em> act on, never a hope.
                </p>
              </div>
              <div className="cs-shift-card">
                <div className="cs-shift-card-header">
                  <span className="cs-shift-card-number">2</span>
                  <h4 className="cs-shift-card-title">Retrieve-first over query-in-one-shot</h4>
                </div>
                <p className="cs-shift-card-body">
                  The original engine retrieved and generated in a single call — which meant the in-scope decision happened <em>after</em> the spend. I split the pipeline into <code>retrieve()</code> and <code>generate()</code> so the answerability check can read the actual evidence <em>before</em> anyone pays for generation.
                </p>
              </div>
              <div className="cs-shift-card">
                <div className="cs-shift-card-header">
                  <span className="cs-shift-card-number">3</span>
                  <h4 className="cs-shift-card-title">A dumb bridge over a smart one</h4>
                </div>
                <p className="cs-shift-card-body">
                  The Node.js edge could have held routing logic. Keeping it deliberately brainless means the entire intelligence lives in one runtime: one place to reason about, one place to upgrade. The bridge&apos;s only job is honesty when the brain is down.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ━━━ The Guardrails ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section id="guardrails" className="cs-section">
          <div className="cs-section-header">
            <span className="cs-section-number">03</span>
            <h2 className="cs-section-title">The Guardrails</h2>
          </div>

          <p className="cs-paragraph">
            The routing isn&apos;t one decision — it&apos;s <strong>two small constrained classifiers</strong> placed at the two forks that used to be guesswork, with a cheap embedding-score shortcut in front of the second one.
          </p>

          <div id="intent-gate" className="cs-subsection">
            <h3 className="cs-subsection-title">The Intent Gate</h3>
            <div className="cs-callout cs-callout--info">
              <span className="cs-callout-icon">🎯</span>
              <span className="cs-callout-label">Handling Greetings</span>
            </div>
            <p className="cs-paragraph">
              Runs first on the raw message. It doesn&apos;t pattern-match for greetings — it <em>decides</em>, in one constrained yes/no: <em>ignoring any greeting or thanks, does the message also ask for something?</em>
            </p>
            <p className="cs-paragraph">
              A pure <code>&quot;salam&quot;</code> or <code>&quot;chokran bzaf&quot;</code> answers <strong>no</strong> and gets a free welcome. A greeting glued to a real question — <code>&quot;salam, les universités au Canada?&quot;</code> — answers <strong>yes</strong>, so the question underneath is never swallowed as smalltalk.
            </p>
          </div>

          <div id="scope-gate" className="cs-subsection">
            <h3 className="cs-subsection-title">The Scope Gate</h3>
            <div className="cs-callout cs-callout--info">
              <span className="cs-callout-icon">🔬</span>
              <span className="cs-callout-label">The 3-Tier Funnel</span>
            </div>
            <p className="cs-paragraph">
              Running a 1.5B model on every message is slow (~7s on CPU), and most messages don&apos;t need it. So it&apos;s a three-tier funnel:
            </p>
            <ol className="cs-ordered-list">
              <li><strong>Active session?</strong> → trust context outright (bare follow-ups aren&apos;t rejected)</li>
              <li><strong>Confidently high or low top-chunk score?</strong> → decide instantly</li>
              <li><strong>Ambiguous middle band <code>[0.60, 0.68)</code>?</strong> → pay for the Answerability classifier</li>
            </ol>
            <p className="cs-paragraph">
              That &quot;spend the expensive check only where the cheap signal is uncertain&quot; instinct is the whole design philosophy in one gate.
            </p>
          </div>
        </section>

        {/* ━━━ Engineering Challenges ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section id="engineering-challenges" className="cs-section">
          <div className="cs-section-header">
            <span className="cs-section-number">04</span>
            <h2 className="cs-section-title">Engineering Challenges</h2>
          </div>

          <p className="cs-paragraph">
            You can&apos;t pipe a trilingual WhatsApp inbox into an LLM and hope. Four problems had to be solved on purpose.
          </p>

          <div id="darija-wall" className="cs-subsection">
            <h3 className="cs-subsection-title">The Darija Wall</h3>
            <p className="cs-paragraph">
              Off-the-shelf greeting detection assumes clean text in one language. Real messages are <code>&quot;slm wach 3ndkom des bourses?&quot;</code> — romanized Arabic with French loanwords and no diacritics.
            </p>
            <p className="cs-paragraph">
              A keyword regex catches <code>salam</code> and misses <code>slm</code>; it can&apos;t tell a greeting glued to a real question from a plain hello, so the question silently dies in the wrong lane.
            </p>
            <p className="cs-paragraph">
              The fix was to stop pattern-matching and start <em>deciding</em>. The intent classifier reads the whole message — dialect and all — and emits a constrained yes/no on the real question underneath.
            </p>
          </div>

          <div id="cross-lingual" className="cs-subsection">
            <h3 className="cs-subsection-title">Cross-Lingual Retrieval Failure Modes</h3>
            <p className="cs-paragraph">
              The old in-scope check was a single threshold: if the top chunk&apos;s cosine score cleared <code>0.66</code>, answer; otherwise hand off. One number deciding everything breaks in exactly the cases that matter:
            </p>
            <div className="cs-example-grid">
              <div className="cs-example cs-example--fail">
                <div className="cs-example-label">❌ Wrongly rejected</div>
                <div className="cs-example-text">
                  <code>&quot;ما هي الجامعات المتاحة في كندا؟&quot;</code>
                  <span className="cs-example-score">Score: 0.618</span>
                </div>
                <div className="cs-example-note">A real, answerable question — score depressed by cross-lingual retrieval</div>
              </div>
              <div className="cs-example cs-example--fail">
                <div className="cs-example-label">❌ Wrongly rejected</div>
                <div className="cs-example-text">
                  <code>&quot;ما هي الوثائق المطلوبة للتقديم؟&quot;</code>
                  <span className="cs-example-score">Score: 0.634</span>
                </div>
                <div className="cs-example-note">Both Arabic questions in the eval set fail this way</div>
              </div>
            </div>
            <p className="cs-paragraph">
              The fix is a classifier that reads what the float can&apos;t: the question <strong>and</strong> the retrieved chunk together, then answers a constrained yes/no on whether the evidence actually supports the question.
            </p>
          </div>

          <div id="follow-up-paradox" className="cs-subsection">
            <h3 className="cs-subsection-title">The Follow-Up Paradox</h3>
            <p className="cs-paragraph">
              A student asks about Canada, gets an answer, then sends <code>&quot;chhal taman?&quot;</code> — &quot;how much?&quot;. On its own that fragment is near-meaningless to a retriever; it scores low and a strict scope gate would reject a perfectly valid follow-up.
            </p>
            <p className="cs-paragraph">
              The fix is session-aware routing. A memory buffer keyed to the student&apos;s phone number trusts active conversation context outright — letting Gemini resolve &quot;how much?&quot; against the Canada thread it already remembers.
            </p>
          </div>

          <div id="fault-tolerance" className="cs-subsection">
            <h3 className="cs-subsection-title">Graceful Failures &amp; Fault Tolerance</h3>
            <p className="cs-paragraph">
              Two runtimes, one machine: WhatsApp lives in Node, the intelligence lives in Python, and they talk over localhost HTTP. If the Python brain is restarting or down, a naive bridge hangs the chat or swallows the message.
            </p>
            <p className="cs-paragraph">
              So the bridge degrades <strong>loudly, not silently</strong>. Every call to the brain has a timeout, and a refused connection triggers a graceful, human-toned fallback in French instead of a frozen chat. The dumb pipe&apos;s one real responsibility is honesty.
            </p>
          </div>
        </section>

        {/* ━━━ Empirical Results ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section id="benchmarks" className="cs-section">
          <div className="cs-section-header">
            <span className="cs-section-number">05</span>
            <h2 className="cs-section-title">Empirical Results</h2>
          </div>

          <p className="cs-paragraph">
            A reproducible benchmark over <strong>28 hand-labeled messages</strong> — 12 answerable, 10 smalltalk, 6 out-of-scope, spread across Darija (12), English (8), French (6), and Arabic (2).
          </p>

          <div id="routing-accuracy" className="cs-subsection">
            <h3 className="cs-subsection-title">Routing Accuracy Breakdown</h3>
            <div className="cs-table-wrapper">
              <table className="cs-table">
                <thead>
                  <tr>
                    <th>Router</th>
                    <th>Overall Accuracy</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Naive (greeting regex + fixed 0.66 threshold)</td>
                    <td><strong>82%</strong></td>
                  </tr>
                  <tr className="cs-table-row--highlight">
                    <td>Constrained-decoding classifiers</td>
                    <td><strong>89%</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="cs-table-wrapper">
              <table className="cs-table">
                <thead>
                  <tr>
                    <th>By Language</th>
                    <th>Naive</th>
                    <th>Constrained</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Arabic</td>
                    <td className="cs-cell--bad">0/2</td>
                    <td className="cs-cell--good">2/2</td>
                  </tr>
                  <tr>
                    <td>Darija</td>
                    <td>9/12</td>
                    <td>9/12</td>
                  </tr>
                  <tr>
                    <td>French</td>
                    <td>6/6</td>
                    <td>6/6</td>
                  </tr>
                  <tr>
                    <td>English</td>
                    <td>8/8</td>
                    <td>8/8</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="cs-table-wrapper">
              <table className="cs-table">
                <thead>
                  <tr>
                    <th>By Lane</th>
                    <th>Naive</th>
                    <th>Constrained</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Answer</td>
                    <td>9/12</td>
                    <td className="cs-cell--good">12/12</td>
                  </tr>
                  <tr>
                    <td>Smalltalk</td>
                    <td>8/10</td>
                    <td>8/10</td>
                  </tr>
                  <tr>
                    <td>Fallback</td>
                    <td>6/6</td>
                    <td>5/6</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div id="constrained-decoding" className="cs-subsection">
            <h3 className="cs-subsection-title">Free vs. Constrained Decoding Delta</h3>

            <div className="cs-insight-box">
              <div className="cs-insight-box-header">Key Finding</div>
              <p className="cs-insight-box-body">
                On <strong>binary yes/no gates, constrained decoding shows no measurable advantage</strong> — a 1.5B instruct model already answers cleanly. The value is a <em>guarantee</em>, not a delta.
              </p>
              <p className="cs-insight-box-body">
                <strong>The delta appears the instant the decision has structure.</strong> For typed <code>{`{country, topic}`}</code> JSON:
              </p>
            </div>

            <div className="cs-table-wrapper">
              <table className="cs-table">
                <thead>
                  <tr>
                    <th>Decoding (structured JSON)</th>
                    <th>Parseable as-is</th>
                    <th>Schema-valid after lenient parser</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Free (unconstrained)</td>
                    <td className="cs-cell--bad">39%</td>
                    <td>93%</td>
                  </tr>
                  <tr className="cs-table-row--highlight">
                    <td>Constrained</td>
                    <td className="cs-cell--good">100%</td>
                    <td className="cs-cell--good">100%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="cs-blockquote">
              <p>
                <strong>The honest thesis:</strong> constrained decoding&apos;s payoff isn&apos;t accuracy on trivial gates — it&apos;s that the moment your output has <em>structure</em>, it deletes an entire class of parse-and-validate bugs by construction. On a binary flag that&apos;s a nice guarantee; on a schema it&apos;s the difference between 39% and 100% usable.
              </p>
            </div>
          </div>

          <div id="latency-cost" className="cs-subsection">
            <h3 className="cs-subsection-title">Latency &amp; Cost Trade-offs</h3>
            <div className="cs-table-wrapper">
              <table className="cs-table">
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Routing decision latency (CPU)</td>
                    <td>~7.3s per decision</td>
                  </tr>
                  <tr>
                    <td>Routing cost / 1,000 messages — local classifier</td>
                    <td className="cs-cell--good"><strong>$0.00</strong> (self-hosted)</td>
                  </tr>
                  <tr>
                    <td>Routing cost / 1,000 messages — if delegated to Gemini</td>
                    <td>~$0.189</td>
                  </tr>
                  <tr>
                    <td>Inbound traffic that never reaches Gemini</td>
                    <td className="cs-cell--good"><strong>50%</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="cs-caption">
              Cost assumptions: Gemini 2.5 Flash at $0.30/M input, $2.50/M output; ~280 / ~480 input tokens per intent / scope decision; measured traffic mix.
            </p>
          </div>
        </section>

        {/* ━━━ Future Roadmap ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section id="future" className="cs-section">
          <div className="cs-section-header">
            <span className="cs-section-number">06</span>
            <h2 className="cs-section-title">Future Roadmap</h2>
          </div>

          <div id="what-id-do-differently" className="cs-subsection">
            <h3 className="cs-subsection-title">What I&apos;d Do Differently</h3>
            <ul className="cs-unordered-list">
              <li>
                <strong>Make the decision schemas pluggable.</strong> Today the two gates emit fixed shapes; I&apos;d declare all decisions as named schemas and add new ones (urgency, target country, lead temperature) without touching the generation path.
              </li>
              <li>
                <strong>Fold the follow-up rule into the classifier.</strong> The &quot;active session → trust context&quot; bypass is still a hand-written Python branch. Feed conversation-state straight into the answerability classifier.
              </li>
              <li>
                <strong>Get the scope-gate latency down.</strong> ~7s per gray-band decision on CPU is fine for WhatsApp cadence but not great. A quantized model, batching, or a smaller distilled judge would cut it.
              </li>
              <li>
                <strong>Promote logging from a JSONL file to a real store.</strong> The async interaction log is fine for one machine; an agency running this for months wants it in SQLite for actual lead analytics.
              </li>
            </ul>
          </div>
        </section>

        {/* ━━━ Deployment & Stack ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section id="deployment" className="cs-section">
          <div className="cs-section-header">
            <span className="cs-section-number">07</span>
            <h2 className="cs-section-title">Deployment &amp; Stack</h2>
          </div>

          <div id="tech-stack" className="cs-subsection">
            <h3 className="cs-subsection-title">The Technology Stack</h3>
            <div className="cs-table-wrapper">
              <table className="cs-table">
                <thead>
                  <tr>
                    <th>Component</th>
                    <th>Technology</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Bridge</td>
                    <td>Node.js, <code>whatsapp-web.js</code>, axios</td>
                  </tr>
                  <tr>
                    <td>API / Orchestration</td>
                    <td>Python, FastAPI, uvicorn</td>
                  </tr>
                  <tr>
                    <td>Decision layer</td>
                    <td>Constrained decoding via <code>outlines</code> on <code>Qwen/Qwen2.5-1.5B-Instruct</code> (local, CPU)</td>
                  </tr>
                  <tr>
                    <td>Retrieval</td>
                    <td>LlamaIndex, ChromaDB (persistent)</td>
                  </tr>
                  <tr>
                    <td>Embeddings</td>
                    <td><code>intfloat/multilingual-e5-large</code> (local, 1024-d)</td>
                  </tr>
                  <tr>
                    <td>Generation</td>
                    <td>Google Gemini 2.5 Flash (answer lane only)</td>
                  </tr>
                  <tr>
                    <td>Source</td>
                    <td>
                      <a
                        href="https://github.com/gouomar/rag_agency"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cs-link"
                      >
                        github.com/gouomar/rag_agency
                        <span aria-hidden="true"> ↗</span>
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ━━━ Footer ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <footer className="cs-footer">
          <div className="cs-footer-nav">
            <Link href="/#projects" className="cs-footer-back">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back to all projects
            </Link>
            <a
              href="https://github.com/gouomar/rag_agency"
              target="_blank"
              rel="noopener noreferrer"
              className="cs-footer-github"
            >
              View on GitHub
              <span aria-hidden="true"> ↗</span>
            </a>
          </div>
          <div className="cs-footer-credit">
            Solo · built for a real Moroccan study-abroad agency workflow · 2024
          </div>
        </footer>
      </main>
    </div>
  );
}

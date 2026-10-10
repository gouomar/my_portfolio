import type { CaseStudy } from "@/lib/case-studies";

/**
 * The one diagram per case study: the system's main path as plain text boxes.
 * It's HTML rather than an image, so it stays sharp, uses the site's fonts,
 * and reflows to a vertical list on small screens.
 */
export function Flow({ figure }: { figure: CaseStudy["figure"] }) {
  return (
    <figure className="flow">
      <ol className="flow__steps">
        {figure.steps.map((step) => (
          <li
            key={step.node}
            className={step.accent ? "flow__step flow__step--accent" : "flow__step"}
          >
            <span className="flow__node">{step.node}</span>
            {step.note && <span className="flow__note">{step.note}</span>}
          </li>
        ))}
      </ol>
      <figcaption className="flow__caption">{figure.caption}</figcaption>
    </figure>
  );
}

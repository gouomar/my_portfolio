import type { Metadata } from "next";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Flow } from "@/components/Flow";
import { SiteFooter } from "@/components/SiteFooter";
import { formatMonth, getCaseStudy, SECTIONS } from "@/lib/case-studies";

export function caseStudyMetadata(slug: string): Metadata {
  const study = getCaseStudy(slug);
  return {
    title: study.title,
    description: study.lede,
    alternates: { canonical: `/work/${slug}` },
    openGraph: {
      type: "article",
      url: `/work/${slug}`,
      title: study.title,
      description: study.lede,
    },
    twitter: { card: "summary_large_image", title: study.title, description: study.lede },
  };
}

function Section({ id, heading, body }: { id: string; heading: string; body: string }) {
  return (
    <section className="case__section" aria-labelledby={id}>
      <h2 id={id}>{heading}</h2>
      <MDXRemote source={body} />
    </section>
  );
}

/** One template for every case study; each /work/<slug>/page.tsx renders it. */
export function CaseStudy({ slug }: { slug: string }) {
  const study = getCaseStudy(slug);
  const [problem, built, ...rest] = SECTIONS;

  return (
    <>
      <a href="#content" className="skip-link">
        Skip to content
      </a>

      <main id="content" className="case">
        <article>
          <p className="case__back mono">
            <Link href="/#work">← Back to work</Link>
          </p>

          <header>
            <h1 className="case__title">{study.title}</h1>
            <p className="case__lede">{study.lede}</p>

            <dl className="case__meta">
              <div>
                <dt>Role</dt>
                <dd>{study.role}</dd>
              </div>
              <div>
                <dt>Stack</dt>
                <dd>{study.stack.join(" · ")}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>
                  {study.status} · Written{" "}
                  <time dateTime={study.written}>{formatMonth(study.written)}</time>
                </dd>
              </div>
              {study.repo && (
                <div>
                  <dt>Code</dt>
                  <dd>
                    <a href={study.repo}>GitHub repo →</a>
                  </dd>
                </div>
              )}
            </dl>
          </header>

          <Section {...problem} body={study.sections[problem.id]} />
          <Section {...built} body={study.sections[built.id]} />

          <Flow figure={study.figure} />

          {rest.map((s) => (
            <Section key={s.id} {...s} body={study.sections[s.id]} />
          ))}

          <section className="case__numbers" aria-labelledby="numbers">
            <h2 id="numbers" className="visually-hidden">
              Numbers
            </h2>
            <ul className="stats">
              {study.stats.map((stat) => (
                <li key={stat.label} className="stat">
                  <p className="stat__value mono">{stat.value}</p>
                  <p className="stat__label">{stat.label}</p>
                  <p className="stat__method">{stat.method}</p>
                </li>
              ))}
            </ul>
          </section>
        </article>

        <SiteFooter />
      </main>
    </>
  );
}

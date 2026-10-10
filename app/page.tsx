import Link from "next/link";
import { Flock } from "@/components/Flock";
import { SiteFooter } from "@/components/SiteFooter";
import { Thumb } from "@/components/Thumb";
import { formatMonth, getAllCaseStudies } from "@/lib/case-studies";
import { education, otherProjects, site } from "@/lib/site";

export const metadata = { alternates: { canonical: "/" } };

const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  url: site.url,
  email: `mailto:${site.email}`,
  sameAs: [site.socials.github, site.socials.linkedin],
};

export default function Home() {
  const work = getAllCaseStudies();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
      />

      <a href="#content" className="skip-link">
        Skip to content
      </a>

      <Flock />

      <div className="home">
        <header className="sidebar">
          <div>
            <h1 className="sidebar__name">{site.name}</h1>
            <p className="sidebar__role mono">{site.role}</p>
            <p className="sidebar__tagline">“{site.tagline}”</p>
            <nav aria-label="Sections">
              <ul className="sidebar__nav">
                {site.nav.map((item) => (
                  <li key={item.id}>
                    <a href={`#${item.id}`}>{item.label}</a>
                  </li>
                ))}
              </ul>
            </nav>

            <details className="flock-note">
              <summary>Curious about the cursor?</summary>
              <p>
                Twelve dots follow your mouse, form a ring, then all cross
                through the same centre at once, the classic case where moving
                agents jam. Each dot books a departure time whose path stays
                clear of the others, the same space-time planning behind{" "}
                <Link href="/work/fly-in">Fly-In</Link>. Rest the mouse and they
                keep reshaping, never touching.
              </p>
            </details>
          </div>

          <ul className="sidebar__socials">
            <li>
              <a href={site.socials.github} rel="me">
                GitHub
              </a>
            </li>
            <li>
              <a href={site.socials.linkedin} rel="me">
                LinkedIn
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`}>Email</a>
            </li>
          </ul>
        </header>

        <main id="content" className="content">
          <section id="about" className="section about" aria-labelledby="about-label">
            <h2 id="about-label" className="label">
              01 — About
            </h2>
            <p>
              I build backend systems where correctness under concurrency
              matters more than how the demo looks. Two years of math and
              physics, then two years of low-level systems work — most of what
              I do now is making async, distributed pieces behave like one
              thing.
            </p>
            <p>
              Currently VP of <strong>Praxis</strong>, building{" "}
              <strong>MedicAtlas</strong> with a small team. Looking for
              backend roles centered on scalable coordination.
            </p>
          </section>

          <section id="work" className="section work" aria-labelledby="work-label">
            <h2 id="work-label" className="label">
              02 — Selected work
            </h2>
            <ul className="work-list">
              {work.map((project) => (
                <li key={project.slug}>
                  <Link href={`/work/${project.slug}`} className="work-row">
                    <Thumb slug={project.slug} />
                    <div>
                      <h3 className="work-row__title">{project.title}</h3>
                      <p className="work-row__summary">{project.summary}</p>
                      <p className="work-row__meta mono">
                        {project.status} ·{" "}
                        <time dateTime={project.written}>
                          {formatMonth(project.written)}
                        </time>
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section id="other" className="section" aria-labelledby="other-label">
            <h2 id="other-label" className="label">
              03 — Other projects
            </h2>
            <ul className="other-list">
              {otherProjects.map((project) => (
                <li key={project.name}>
                  <strong>{project.name}</strong> — {project.blurb}
                </li>
              ))}
            </ul>
            <p className="other__more">
              <a href={`${site.socials.github}?tab=repositories`}>
                Smaller builds (libft, push_swap, pygrep, and others) on GitHub →
              </a>
            </p>
          </section>

          <section
            id="education"
            className="section education"
            aria-labelledby="education-label"
          >
            <h2 id="education-label" className="label">
              04 — Education
            </h2>
            {education.map((entry) => (
              <div key={entry.school} className="edu-row">
                <span className="edu-row__school">{entry.school}</span>
                <span className="edu-row__period mono">{entry.period}</span>
              </div>
            ))}
          </section>

          <SiteFooter />
        </main>
      </div>
    </>
  );
}

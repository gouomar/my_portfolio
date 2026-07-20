import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/sections/Section";
import { TagPills } from "@/components/Tags";
import { getFeaturedProjects } from "@/lib/content";
import { smallerBuilds } from "@/lib/smaller-builds";
import { site } from "@/lib/site";
import type { Tag } from "@/lib/tags";

const projectImages: Record<string, string> = {
  codexion: "/images/codexion.png",
};

const clubProjects = [
  {
    slug: "medicatlas",
    title: "MedicAtlas",
    links: { github: "https://github.com/Praxis-13/medicAtlas" },
    oneLiner: "A full-stack patient platform (currently at MVP) where patients upload medical reports and get a structured, unified health history - from database architecture and dockerized services to a complete frontend-backend integration. AI extracts and normalizes data from scanned documents into trackable health timelines.",
    tags: ["FastAPI", "Next.js", "PostgreSQL", "Docker", "OCR"] as Tag[],
    image: "/images/mediAtlas.png",
  },
  {
    slug: "arabic-ocr",
    title: "Arabic_Ocr",
    links: { github: "https://github.com/gouomar/Arabic_OCR" },
    oneLiner: "A CNN built from scratch in PyTorch to recognize all 28 handwritten Arabic letters. Two conv blocks, an 80/20 train/val split, and an Adam optimizer - the confusion matrix shows the model mostly trips on letters that look similar even to humans.",
    tags: ["PyTorch", "CNN", "torchvision", "scikit-learn"] as Tag[],
    image: "/images/ocr_arabic.jpeg",
  }
];

/**
 * A vertical stack of 3 featured project rows. Each row links directly to
 * the GitHub repo; no detail pages.
 */
/* Map content slugs (kebab-case) to page routes */
const slugToRoute: Record<string, string> = {
  "agency-brain": "/agency_brain",
  codexion: "/codexion",
  "fly-in": "/fly-in",
};

export function Projects() {
  const projects = getFeaturedProjects();

  return (
    <Section id="projects" title="Projects">
      <ul className="space-y-4">
        {projects.map(({ frontmatter: p }) => (
          <li
            key={p.slug}
            id={p.slug}
            className="group relative rounded-lg p-4 transition-colors hover:bg-surface-0/40 motion-reduce:transition-none"
          >
            <div className="flex gap-5">
              {projectImages[p.slug] && (
                <div className="relative hidden h-24 w-36 flex-shrink-0 overflow-hidden rounded-md border border-surface-0/60 sm:block">
                  <Image
                    src={projectImages[p.slug]}
                    alt={p.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="flex items-baseline gap-1 font-medium text-text">
                  <Link
                    href={slugToRoute[p.slug] ?? `/${p.slug}`}
                    className="transition-colors group-hover:text-accent motion-reduce:transition-none after:absolute after:inset-0"
                    aria-label={`${p.title} - view case study`}
                  >
                    {p.title}
                  </Link>
                  <span
                    aria-hidden="true"
                    className="text-[0.85em] text-accent"
                  >
                    →
                  </span>
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-subtext">{p.oneLiner}</p>

                <div className="relative z-10 mt-4 w-fit">
                  <TagPills tags={p.tags} />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Projects related to the club */}
      <div className="mt-12 border-t border-surface-0 pt-8">
        <h3 className="mb-4 font-mono text-xs uppercase tracking-widest text-overlay">
          Projects related to the club
        </h3>
        <ul className="space-y-4">
          {clubProjects.map((p) => (
            <li
              key={p.slug}
              className="group relative rounded-lg p-4 transition-colors hover:bg-surface-0/40 motion-reduce:transition-none"
            >
              <div className="flex gap-5">
                {p.image && (
                  <div className="relative hidden h-24 w-36 flex-shrink-0 overflow-hidden rounded-md border border-surface-0/60 sm:block">
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="flex items-baseline gap-1 font-medium text-text">
                    <a
                      href={p.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors group-hover:text-accent motion-reduce:transition-none after:absolute after:inset-0"
                      aria-label={`${p.title} - view on GitHub`}
                    >
                      {p.title}
                    </a>
                    {p.links.github && (
                      <span
                        aria-hidden="true"
                        className="external-arrow text-[0.85em] text-accent"
                      >
                        ↗
                      </span>
                    )}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-subtext">{p.oneLiner}</p>

                  <div className="relative z-10 mt-4 w-fit">
                    <TagPills tags={p.tags} />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Also - smaller builds. One line each, no thumbnails; keeps nav at 3. */}
      <div className="mt-12 border-t border-surface-0 pt-8">
        <h3 className="font-mono text-xs uppercase tracking-widest text-overlay">
          Also - smaller builds
        </h3>
        <ul className="mt-4 space-y-2">
          {smallerBuilds.map((b) => (
            <li
              key={b.url}
              className="flex flex-wrap items-baseline gap-x-2 text-sm"
            >
              <a
                href={b.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-baseline gap-0.5 font-mono text-subtext transition-colors hover:text-accent motion-reduce:transition-none"
              >
                {b.name}
                <span aria-hidden="true" className="external-arrow text-[0.85em]">
                  ↗
                </span>
              </a>
              <span className="text-overlay"> -  {b.blurb}</span>
            </li>
          ))}
        </ul>
        <a
          href={site.socials.github}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-baseline gap-0.5 font-mono text-xs text-overlay transition-colors hover:text-accent motion-reduce:transition-none"
        >
          More on GitHub
          <span aria-hidden="true" className="external-arrow">
            ↗
          </span>
        </a>
      </div>
    </Section>
  );
}

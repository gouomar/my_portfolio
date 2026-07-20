import Image from "next/image";
import { Section } from "@/components/sections/Section";
import { TagPills } from "@/components/Tags";
import { experience } from "@/lib/experience";

function Logo1337() {
  return (
    <svg width="76" height="20" viewBox="0 0 76 20" fill="none" className="h-5 w-auto">
      <path d="M2.8333 17.6623H5.92418V2.33766H2.31816V5.45455H0V1.49012e-07H8.75748V17.6623H11.8484V20H2.8333V17.6623Z" fill="currentColor" />
      <path d="M21.3785 17.6623H30.6512V10.9091H22.1513V8.57143H30.6512V2.33766H21.3785V0H33.4845V20H21.3785V17.6623Z" fill="currentColor" />
      <path d="M42.2419 17.6623H51.5146V10.9091H43.0147V8.57143H51.5146V2.33766H42.2419V0H54.3479V20H42.2419V17.6623Z" fill="currentColor" />
      <path d="M72.6355 2.33766H64.9084V7.27273H62.5902V0H75.2113V20H72.6355V2.33766Z" fill="currentColor" />
    </svg>
  );
}

export function Experience() {
  return (
    <Section id="education" title="Education">
      <ol className="space-y-12">
        {experience.map((entry) => (
          <li key={`${entry.period}-${entry.org}`} className="group relative">
            <a
              href={entry.orgUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0"
              aria-label={entry.org}
            />
            <div className="flex gap-5 rounded-lg p-4 transition-colors group-hover:bg-surface-0/40 motion-reduce:transition-none">
              {entry.image && (
                <div className="hidden h-12 w-12 flex-shrink-0 items-center justify-center sm:flex">
                  {entry.image === "/images/1337.png" ? (
                    <Logo1337 />
                  ) : (
                    <Image
                      src={entry.image}
                      alt={entry.org}
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  )}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="mb-1 font-mono text-xs uppercase tracking-wide text-overlay">
                  {entry.period}
                </p>
                <h3 className="font-medium leading-snug text-text">
                  {entry.role}
                  <span className="text-subtext"> · </span>
                  {entry.orgUrl ? (
                    <a
                      href={entry.orgUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-baseline gap-0.5 text-text transition-colors hover:text-accent motion-reduce:transition-none"
                    >
                      {entry.org}
                      <span
                        aria-hidden="true"
                        className="external-arrow text-[0.85em]"
                      >
                        ↗
                      </span>
                    </a>
                  ) : (
                    <span className="text-text">{entry.org}</span>
                  )}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-subtext">
                  {entry.description}
                </p>
                <div className="mt-4">
                  <TagPills tags={entry.tags} />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

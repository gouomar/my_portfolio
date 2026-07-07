import { Section } from "@/components/sections/Section";
import { TagPills } from "@/components/Tags";
import { experience } from "@/lib/experience";

export function Experience() {
  return (
    <Section id="experience" title="Experience">
      <ol className="space-y-8">
        {experience.map((entry) => (
          <li key={`${entry.period}-${entry.org}`}>
            <div className="group grid grid-cols-1 gap-2 rounded-lg p-4 transition-colors hover:bg-surface-0/40 motion-reduce:transition-none sm:grid-cols-[8rem_1fr] sm:gap-6">
              <p className="pt-1 font-mono text-xs uppercase tracking-wide text-overlay">
                {entry.period}
              </p>
              <div>
                <h3 className="font-medium text-text">
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
                <p className="mt-2 leading-relaxed text-subtext">
                  {entry.description}
                </p>
                <div className="mt-3">
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

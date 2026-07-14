import type { ReactNode } from "react";

/**
 * One shape for every right-column section. On desktop the extending-line nav
 * names the section, so the heading is visually hidden (still there for screen
 * readers); on mobile a visible label appears since there's no side nav.
 */
export function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-label={title}
      className="scroll-mt-16 py-16 lg:py-24"
    >
      <h2 className="mb-8 font-mono text-xs font-bold uppercase tracking-widest text-text lg:sr-only">
        {title}
      </h2>
      {children}
    </section>
  );
}

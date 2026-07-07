"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";

/**
 * Vertical section nav. The short line left of each item extends and brightens
 * when its section is active (scroll-spied via IntersectionObserver) or hovered
 * - motion-budget item #2. All transitions are disabled under reduced motion.
 */
export function Nav() {
  const [active, setActive] = useState<string>(site.nav[0].id);

  useEffect(() => {
    const sections = site.nav
      .map((n) => document.getElementById(n.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry nearest the top that is intersecting.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="hidden lg:block" aria-label="In-page sections">
      <ul className="space-y-4">
        {site.nav.map((item) => {
          const isActive = active === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "true" : undefined}
                className="group flex items-center gap-4 py-1"
              >
                <span
                  aria-hidden="true"
                  className={[
                    "h-px transition-all duration-300 motion-reduce:transition-none",
                    isActive
                      ? "w-16 bg-text"
                      : "w-8 bg-surface-2 group-hover:w-16 group-hover:bg-text",
                  ].join(" ")}
                />
                <span
                  className={[
                    "font-mono text-xs uppercase tracking-widest transition-colors duration-300 motion-reduce:transition-none",
                    isActive
                      ? "text-text"
                      : "text-overlay group-hover:text-text",
                  ].join(" ")}
                >
                  {item.label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

/* ─── Navigation structure ──────────────────────────────────────────── */

export type SidebarItem = {
  id: string;
  label: string;
  children?: { id: string; label: string }[];
};

/* ─── Component ─────────────────────────────────────────────────────── */

export function CaseStudySidebar({
  items,
  projectTitle,
  githubUrl,
}: {
  items: SidebarItem[];
  projectTitle: string;
  githubUrl?: string;
}) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");
  const [mobileOpen, setMobileOpen] = useState(false);

  /* Scroll-spy via IntersectionObserver */
  useEffect(() => {
    const allIds = items.flatMap((item) => [
      item.id,
      ...(item.children?.map((c) => c.id) ?? []),
    ]);
    const elements = allIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  const handleClick = useCallback(
    (id: string) => {
      setActiveId(id);
      setMobileOpen(false);
    },
    [],
  );

  /* Is this item or any of its children active? */
  const isGroupActive = (item: SidebarItem) =>
    activeId === item.id ||
    (item.children?.some((c) => c.id === activeId) ?? false);

  return (
    <>
      {/* ── Mobile toggle ───────────────────────────────────────── */}
      <button
        onClick={() => setMobileOpen((o) => !o)}
        className="cs-sidebar-toggle"
        aria-label="Toggle navigation"
        aria-expanded={mobileOpen}
      >
        <span className="cs-sidebar-toggle-icon">
          {mobileOpen ? "✕" : "☰"}
        </span>
        <span className="cs-sidebar-toggle-label">Navigation</span>
      </button>

      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <nav
        className={`cs-sidebar ${mobileOpen ? "cs-sidebar--open" : ""}`}
        aria-label="Case study navigation"
      >
        {/* Back link */}
        <div className="cs-sidebar-back">
          <Link href="/#projects" className="cs-sidebar-back-link">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M10 12L6 8L10 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Back to portfolio</span>
          </Link>
        </div>

        {/* Project title */}
        <div className="cs-sidebar-title">{projectTitle}</div>

        {/* Nav items */}
        <ul className="cs-sidebar-nav">
          {items.map((item) => {
            const groupActive = isGroupActive(item);

            return (
              <li key={item.id} className="cs-sidebar-group">
                <a
                  href={`#${item.id}`}
                  onClick={() => handleClick(item.id)}
                  className={`cs-sidebar-link ${
                    activeId === item.id ? "cs-sidebar-link--active" : ""
                  }`}
                >
                  {item.label}
                </a>

                {/* Children (sub-items) */}
                {item.children && item.children.length > 0 && (
                  <ul
                    className={`cs-sidebar-children ${
                      groupActive ? "cs-sidebar-children--open" : ""
                    }`}
                  >
                    {item.children.map((child) => (
                      <li key={child.id}>
                        <a
                          href={`#${child.id}`}
                          onClick={() => handleClick(child.id)}
                          className={`cs-sidebar-link cs-sidebar-link--child ${
                            activeId === child.id
                              ? "cs-sidebar-link--active"
                              : ""
                          }`}
                        >
                          {child.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>

        {/* GitHub link */}
        {githubUrl && (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cs-sidebar-github"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            <span>View Source Code</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden="true"
              className="cs-sidebar-github-arrow"
            >
              <path
                d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        )}
      </nav>

      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          className="cs-sidebar-overlay"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}

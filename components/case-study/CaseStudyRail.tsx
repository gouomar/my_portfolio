"use client";

import { useEffect, useState } from "react";

/* ─── Types ─────────────────────────────────────────────────────────── */

export type TocItem = {
  id: string;
  label: string;
  level: 2 | 3;
};

export type AsideData = {
  anchor: string;
  title: string;
  content: React.ReactNode;
};

/* ─── Component ─────────────────────────────────────────────────────── */

export function CaseStudyRail({
  toc,
  asides,
}: {
  toc: TocItem[];
  asides: AsideData[];
}) {
  const [activeId, setActiveId] = useState<string>(toc[0]?.id ?? "");

  /* Scroll-spy for TOC highlighting */
  useEffect(() => {
    const ids = toc.map((t) => t.id);
    const elements = ids
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
  }, [toc]);

  // Group TOC items by h2 parents with h3 children
  const tocTree = toc.reduce((acc, item) => {
    if (item.level === 2) {
      acc.push({ parent: item, children: [] });
    } else if (item.level === 3 && acc.length > 0) {
      acc[acc.length - 1].children.push(item);
    }
    return acc;
  }, [] as { parent: TocItem; children: TocItem[] }[]);

  return (
    <>
      {/* ── TOC ───────────────────────────────────────────────── */}
      <div className="case-study-toc">
        <div className="case-study-toc-title">On this page</div>
        <ul className="case-study-toc-list">
          {tocTree.map((group) => (
            <li key={group.parent.id} className="case-study-toc-item">
              <a
                href={`#${group.parent.id}`}
                className={`case-study-toc-link ${
                  activeId === group.parent.id ? "active" : ""
                }`}
              >
                {group.parent.label}
              </a>

              {/* Nested h3 items */}
              {group.children.length > 0 && (
                <ul className="case-study-toc-sublist">
                  {group.children.map((child) => (
                    <li key={child.id} className="case-study-toc-item">
                      <a
                        href={`#${child.id}`}
                        className={`case-study-toc-link ${
                          activeId === child.id ? "active" : ""
                        }`}
                      >
                        {child.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* ── Aside Cards (v1: static stack) ────────────────────── */}
      {asides.map((aside) => (
        <div key={aside.anchor} className="case-study-aside" data-anchor={aside.anchor}>
          <div className="case-study-aside-title">{aside.title}</div>
          <div className="case-study-aside-content">{aside.content}</div>
        </div>
      ))}
    </>
  );
}

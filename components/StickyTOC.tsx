"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type TocItem = {
  id: string;
  label: string;
  level: 2 | 3;
};

export function StickyTOC({ toc }: { toc: TocItem[] }) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isFloating, setIsFloating] = useState(false);
  const [activeId, setActiveId] = useState<string>("");

  /* ── Detect when original TOC position scrolls out of view ────────── */
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // When the sentinel (original TOC spot) leaves the viewport, float the TOC
        setIsFloating(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "-80px 0px 0px 0px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  /* ── Track which section is currently in view ─────────────────────── */
  useEffect(() => {
    const headingIds = toc.map((item) => item.id);
    const elements = headingIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the topmost visible section
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [toc]);

  /* ── Smooth scroll on click ───────────────────────────────────────── */
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    []
  );

  return (
    <>
      {/* Sentinel: invisible marker at the original TOC position */}
      <div ref={sentinelRef} className="cs-toc-sentinel" />

      {/* Original TOC in the sidebar (visible when at top) */}
      <nav className={`cs-toc ${isFloating ? "cs-toc--hidden" : ""}`}>
        <span className="cs-toc-label">On this page</span>
        <ul className="cs-toc-list">
          {toc.map((item) => (
            <li key={item.id} className={item.level === 3 ? "cs-toc-sub" : ""}>
              <a href={`#${item.id}`} onClick={(e) => handleClick(e, item.id)}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Floating TOC on the left (visible when scrolled) */}
      <nav
        className={`cs-toc-float ${isFloating ? "cs-toc-float--visible" : ""}`}
        aria-label="Table of contents"
      >
        <span className="cs-toc-float-label">On this page</span>
        <ul className="cs-toc-float-list">
          {toc.map((item) => (
            <li
              key={item.id}
              className={`cs-toc-float-item ${
                item.level === 3 ? "cs-toc-float-sub" : ""
              } ${activeId === item.id ? "cs-toc-float-active" : ""}`}
            >
              <a href={`#${item.id}`} onClick={(e) => handleClick(e, item.id)}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

"use client";

import { useState } from "react";
import type { TocItem } from "./CaseStudyRail";

export function MobileTOC({ toc }: { toc: TocItem[] }) {
  const [open, setOpen] = useState(false);

  // Group h3s under their parent h2
  const tocTree = toc.reduce((acc, item) => {
    if (item.level === 2) {
      acc.push({ parent: item, children: [] });
    } else if (item.level === 3 && acc.length > 0) {
      acc[acc.length - 1].children.push(item);
    }
    return acc;
  }, [] as { parent: TocItem; children: TocItem[] }[]);

  return (
    <div className="case-study-toc-mobile">
      <button
        className="case-study-toc-toggle"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span>On this page</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="case-study-toc-toggle-icon"
          aria-hidden="true"
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className={`case-study-toc-dropdown ${open ? "open" : ""}`}>
        <ul className="case-study-toc-list">
          {tocTree.map((group) => (
            <li key={group.parent.id} className="case-study-toc-item">
              <a
                href={`#${group.parent.id}`}
                className="case-study-toc-link"
                onClick={() => setOpen(false)}
              >
                {group.parent.label}
              </a>
              {group.children.length > 0 && (
                <ul className="case-study-toc-sublist">
                  {group.children.map((child) => (
                    <li key={child.id} className="case-study-toc-item">
                      <a
                        href={`#${child.id}`}
                        className="case-study-toc-link"
                        onClick={() => setOpen(false)}
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
    </div>
  );
}

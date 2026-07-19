"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { MobileTOC } from "./MobileTOC";
import type { TocItem } from "./CaseStudyRail";

/* ─────────────────────────────────────────────────────────────────────
   2-Column Case Study Layout Wrapper
   Center Content (~720px max) → Right Rail (TOC + Asides)
   ───────────────────────────────────────────────────────────────────── */

type CaseStudyLayoutProps = {
  rightRail: ReactNode;
  toc: TocItem[];
  children: ReactNode;
  backHref?: string;
  backLabel?: string;
};

export function CaseStudyLayout({
  rightRail,
  toc,
  children,
  backHref = "/#projects",
  backLabel = "Back to portfolio",
}: CaseStudyLayoutProps) {
  return (
    <div className="case-study-layout">
      {/* Center Content (Main Reading Zone) */}
      <main className="case-study-content">
        {/* Back Link */}
        <div className="case-study-back">
          <Link href={backHref} className="case-study-back-link">
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
            <span>{backLabel}</span>
          </Link>
        </div>

        {/* Mobile TOC (hidden on desktop) */}
        <MobileTOC toc={toc} />

        {children}
      </main>

      {/* Right Rail (TOC + Contextual Asides) */}
      <aside className="case-study-rail" aria-label="Table of contents and reference cards">
        {rightRail}
      </aside>
    </div>
  );
}

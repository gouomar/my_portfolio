import { ReactNode } from "react";

/* ─────────────────────────────────────────────────────────────────────
   Breakout Component — Escapes the 720px center constraint
   Used for wide diagrams, tables, or ASCII art that need breathing room
   Spans center content + right rail (~1000px) on desktop
   ───────────────────────────────────────────────────────────────────── */

type BreakoutProps = {
  children: ReactNode;
  anchor?: string;
};

export function Breakout({ children, anchor }: BreakoutProps) {
  return (
    <div className="case-study-breakout" id={anchor}>
      <div className="case-study-breakout-content">
        {children}
      </div>
    </div>
  );
}

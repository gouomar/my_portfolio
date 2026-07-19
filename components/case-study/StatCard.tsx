/* ─────────────────────────────────────────────────────────────────────
   Stat Card Component — Mini data cards for the right rail
   Used inside Aside components to display metrics, benchmarks, etc.
   ───────────────────────────────────────────────────────────────────── */

type StatCardProps = {
  value: string;
  label: string;
};

export function StatCard({ value, label }: StatCardProps) {
  return (
    <div className="case-study-stat">
      <div className="case-study-stat-value">{value}</div>
      <div className="case-study-stat-label">{label}</div>
    </div>
  );
}

type StatGridProps = {
  children: React.ReactNode;
};

export function StatGrid({ children }: StatGridProps) {
  return (
    <div className="case-study-stat-grid">
      {children}
    </div>
  );
}

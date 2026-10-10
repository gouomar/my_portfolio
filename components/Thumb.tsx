/**
 * Small line drawings for the homepage rows, one per case study. Inline SVG:
 * no image request, sharp at any density, and drawn in the site's own colors.
 */
const round = (n: number) => Math.round(n * 100) / 100;

const drawings: Record<string, React.ReactNode> = {
  // One message forks into three lanes; only one lane is paid.
  "agency-brain": (
    <>
      <circle cx="18" cy="36" r="4" className="thumb__dot" />
      <path d="M22 36 H42 M42 36 L70 18 M42 36 H70 M42 36 L70 54" className="thumb__line" />
      <circle cx="74" cy="18" r="3.5" className="thumb__dot" />
      <circle cx="74" cy="36" r="3.5" className="thumb__dot" />
      <circle cx="74" cy="54" r="4.5" className="thumb__dot thumb__dot--accent" />
    </>
  ),
  // Five threads around a table, a dongle between each pair.
  codexion: (
    <>
      <circle cx="48" cy="36" r="20" className="thumb__line" />
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * 2 * Math.PI - Math.PI / 2;
        const b = a + Math.PI / 5;
        return (
          <g key={i}>
            <circle
              cx={round(48 + 20 * Math.cos(a))}
              cy={round(36 + 20 * Math.sin(a))}
              r={i === 0 ? 4.5 : 3.5}
              className={i === 0 ? "thumb__dot thumb__dot--accent" : "thumb__dot"}
            />
            <rect
              x={round(48 + 20 * Math.cos(b) - 1.5)}
              y={round(36 + 20 * Math.sin(b) - 1.5)}
              width="3"
              height="3"
              className="thumb__dot"
            />
          </g>
        );
      })}
    </>
  ),
  // A graph of hubs with one route traced through it.
  "fly-in": (
    <>
      <path
        d="M14 52 L34 28 L54 46 L74 20 M34 28 L54 16 L74 20 M14 52 L54 46 L82 54"
        className="thumb__line"
      />
      <path d="M14 52 L34 28 L54 46 L74 20" className="thumb__line thumb__line--accent" />
      {[
        [14, 52],
        [34, 28],
        [54, 46],
        [74, 20],
        [54, 16],
        [82, 54],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="3" className="thumb__dot" />
      ))}
    </>
  ),
};

export function Thumb({ slug }: { slug: string }) {
  return (
    <div className="thumb" aria-hidden="true">
      {drawings[slug] && (
        <svg viewBox="0 0 96 72" width="96" height="72">
          {drawings[slug]}
        </svg>
      )}
    </div>
  );
}

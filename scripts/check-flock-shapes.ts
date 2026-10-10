/**
 * Prints which cursor-flock shape changes are allowed: a morph is used only if
 * no two dots ever come closer than the minimum gap. Fails if a figure is
 * unsafe at rest, or if any figure has no way out (or no way back to circle).
 * Run with `pnpm exec tsx scripts/check-flock-shapes.ts` after editing SHAPES.
 */
import { morphGap, safeMorphs, SHAPES } from "../lib/flock-core";

const names = Object.keys(SHAPES);
const safe = safeMorphs();
let failures = 0;

for (const a of names) {
  const pts = SHAPES[a];
  const rest = Math.min(
    ...pts.flatMap((p, i) => pts.slice(i + 1).map((q) => Math.hypot(p[0] - q[0], p[1] - q[1]))),
  );
  const blocked = names.filter((b) => b !== a && !safe[a].includes(b));
  const reachesCircle = a === "circle" || safe[a].includes("circle");
  if (rest < 10 || safe[a].length === 0 || !reachesCircle) failures++;
  console.log(
    `${a.padEnd(10)} rest gap ${rest.toFixed(1)} px · ${safe[a].length} safe next` +
      (blocked.length ? ` · blocked: ${blocked.map((b) => `${b} (${morphGap(SHAPES[a], SHAPES[b]).toFixed(1)} px)`).join(", ")}` : "") +
      (reachesCircle ? "" : " · CANNOT RETURN TO CIRCLE"),
  );
}
process.exit(failures ? 1 : 0);

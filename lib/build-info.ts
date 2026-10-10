import { execSync } from "node:child_process";

/**
 * Date of the last commit, read once at build time. Falls back to the build
 * date when git history isn't available (e.g. a source tarball).
 */
function lastCommitDate(): Date {
  try {
    const iso = execSync("git log -1 --format=%cI", {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
    if (iso) return new Date(iso);
  } catch {
    // fall through
  }
  return new Date();
}

const updated = lastCommitDate();

export const lastUpdated = {
  /** For <time dateTime>, e.g. "2026-10-03". */
  iso: updated.toISOString().slice(0, 10),
  /** For display, e.g. "3 Oct 2026". */
  label: updated.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }),
};

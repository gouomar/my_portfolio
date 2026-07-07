import type { Tag } from "@/lib/tags";

/**
 * Skill pills - one shape everywhere (case-study header, project rows).
 * Tags come from the controlled taxonomy, so this list is always uniform.
 * The hover glow is wired in Step 6 (the tag-pill motion-budget item).
 */
export function TagPills({ tags }: { tags: readonly Tag[] }) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Skills">
      {tags.map((tag) => (
        <li key={tag}>
          <span className="tag-pill inline-block rounded-full border border-surface-0 px-3 py-1 font-mono text-xs text-subtext">
            {tag}
          </span>
        </li>
      ))}
    </ul>
  );
}

/**
 * The "Also - smaller builds" strip: everything worth showing but not worth a
 * detail page. Keeping them here (one line each, GitHub-only) is what lets the
 * nav stay at exactly three items - the featured work carries the story, these
 * show range and fundamentals without diluting it.
 */
export type SmallBuild = {
  name: string;
  blurb: string;
  url: string;
};

export const smallerBuilds: readonly SmallBuild[] = [
  {
    name: "libft",
    blurb: "libc core, reimplemented in C",
    url: "https://github.com/gouomar/libft",
  },
  {
    name: "ft_printf",
    blurb: "variadic printf as a static library",
    url: "https://github.com/gouomar/ft_printf",
  },
  {
    name: "get_next_line",
    blurb: "buffered line reader over a file descriptor",
    url: "https://github.com/gouomar/get_next_line",
  },
  {
    name: "push_swap",
    blurb: "near-optimal stack sort under op limits",
    url: "https://github.com/gouomar/push_swap",
  },
  {
    name: "pygrep",
    blurb: "grep-like regex CLI in Python",
    url: "https://github.com/gouomar/my_grep",
  },
  {
    name: "URL connectivity checker",
    blurb: "sync vs. async HTTP, measured",
    url: "https://github.com/gouomar/check_connectivity",
  },
  {
    name: "file organizer",
    blurb: "context-first, dry-run file tidier",
    url: "https://github.com/gouomar/file_organizer",
  },
] as const;

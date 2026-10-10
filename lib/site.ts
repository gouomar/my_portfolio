/**
 * Everything the site says about you, in one place. Pages read from here so
 * the sidebar, homepage and link previews never drift apart.
 */
export const site = {
  name: "Omar Gourragui",
  role: "AI Engineer",
  tagline:
    "I like the moment where many independent parts have to behave as one coherent thing.",
  description:
    "AI engineer. I build systems where correctness under concurrency matters more than how the demo looks.",
  email: "gomar@student.1337.ma",
  /** Canonical URL — set NEXT_PUBLIC_SITE_URL on Vercel; this is the fallback. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://omargourragui.vercel.app",
  socials: {
    github: "https://github.com/gouomar",
    linkedin: "https://www.linkedin.com/in/gourragui-omar-a8879531a/",
  },
  /** This site's own code. */
  source: "https://github.com/gouomar/my_portfolio",
  nav: [
    { id: "about", label: "About" },
    { id: "work", label: "Selected work" },
    { id: "other", label: "Other projects" },
    { id: "education", label: "Education" },
  ],
} as const;

export const otherProjects = [
  {
    name: "MedicAtlas",
    blurb: "unified health history from scanned medical reports",
  },
  {
    name: "Arabic OCR",
    blurb: "a CNN built from scratch for handwritten Arabic letters",
  },
] as const;

export const education = [
  { school: "1337 / UM6P — Systems Programming", period: "2025–present" },
  { school: "CPGE MP — Maths & Physics", period: "2023–2025" },
] as const;

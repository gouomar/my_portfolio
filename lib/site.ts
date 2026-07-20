/**
 * Identity the single source of truth for who this site is about. Used by
 * the left panel, the footer, and page metadata so nothing drifts.
 */
export const site = {
  name: "Omar Gourragui",
  /** The single highest-leverage line on the site (Step 0 decision). */
  role: "Backend & Systems Engineer",
  tagline:
    "I like the moment where many independent parts have to behave as one coherent thing.",
  /** Short description for metadata / social cards. */
  description:
    "CPGE math and physics, then low-level systems at 1337. I design the boundaries and coordination that let many independent parts behave as one system.",
  location: "Rabat, Morocco",
  email: "gomar@student.1337.ma",
  /** Canonical URL set NEXT_PUBLIC_SITE_URL on Vercel; this is the fallback. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://omargourragui.vercel.app",
  socials: {
    github: "https://github.com/gouomar",
    // TODO(Omar): confirm your real LinkedIn URL this is a placeholder.
    linkedin: "https://www.linkedin.com/in/gourragui-omar-a8879531a/",
  },
  /** The three right-column sections, in scroll order. */
  nav: [
    { id: "about", label: "About" },
    { id: "education", label: "Education" },
    { id: "projects", label: "Projects" },
  ],
} as const;

export type NavItem = (typeof site.nav)[number];

import type { Tag } from "@/lib/tags";

/**
 * Experience, populated honestly. Never invent job-sounding titles for
 * coursework - "Student" is accurate and fake seniority is the exact tell
 * recruiters distrust. Tags come from the same taxonomy as everything else.
 */
export type ExperienceEntry = {
  period: string;
  role: string;
  org: string;
  orgUrl?: string;
  description: string;
  tags: readonly Tag[];
};

export const experience: readonly ExperienceEntry[] = [
  {
    period: "2024 - Present",
    role: "Systems Programming Student",
    org: "1337 / UM6P",
    orgUrl: "https://1337.ma",
    description:
      "Low-level C, concurrency, and systems, alongside applied AI - focused on orchestration and backend. The case studies below come out of this work.",
    tags: ["C", "Python", "POSIX threads", "PyTorch", "systems"],
  },
  {
    period: "2022 - 2024",
    role: "CPGE MP (Maths & Physics)",
    // TODO(Omar): replace with your actual prep school name (+ URL if it has one).
    org: "Classe Préparatoire",
    description:
      "Two years of intensive mathematics and physics - rigorous theory and the habit of sitting with a hard problem until it breaks.",
    tags: ["Mathematics", "Physics", "Algorithms"],
  },
] as const;

/**
 * The controlled tag vocabulary. Tags are CHOSEN from this list, never
 * freeform-typed. A case study using a tag outside this set fails the build
 * (see lib/schema.ts). This is what keeps the pills homogeneous across every
 * project - one taxonomy, no synonyms, no drift.
 *
 * Tags are skills/techniques, not every library. Keep this list short and
 * deliberate; add here first, then use in content.
 */
export const TAGS = [
  "C",
  "Python",
  "POSIX threads",
  "concurrency",
  "scheduling",
  "A*",
  "FastAPI",
  "RAG",
  "constrained decoding",
  "systems",
  "PyTorch",
  "Mathematics",
  "Physics",
  "Algorithms",
  "Space-time A*",
  "Dijkstra",
  "Pydantic v2",
  "pthreads",
  "min-heap",
  "Valgrind",
  "ChromaDB",
  "Next.js",
  "PostgreSQL",
  "Docker",
  "OCR",
  "CNN",
  "torchvision",
  "scikit-learn",
] as const;

export type Tag = (typeof TAGS)[number];

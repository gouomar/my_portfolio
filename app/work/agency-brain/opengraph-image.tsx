import { getCaseStudy } from "@/lib/case-studies";
import { caseStudyOgImage, ogSize } from "@/lib/og";

const slug = "agency-brain";

export const alt = `${getCaseStudy(slug).title} — ${getCaseStudy(slug).summary}`;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return caseStudyOgImage(slug);
}

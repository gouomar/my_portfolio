import { CaseStudy, caseStudyMetadata } from "@/components/CaseStudy";

const slug = "codexion";

export const metadata = caseStudyMetadata(slug);

export default function Page() {
  return <CaseStudy slug={slug} />;
}

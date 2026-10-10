import type { MetadataRoute } from "next";
import { lastUpdated } from "@/lib/build-info";
import { getAllCaseStudies } from "@/lib/case-studies";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, lastModified: lastUpdated.iso },
    ...getAllCaseStudies().map((study) => ({
      url: `${site.url}/work/${study.slug}`,
      lastModified: lastUpdated.iso,
    })),
  ];
}

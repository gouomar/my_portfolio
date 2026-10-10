import Link from "next/link";
import { getAllCaseStudies } from "@/lib/case-studies";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main id="content" className="case not-found">
      <p className="label">404</p>
      <h1 className="case__title">Nothing at this address.</h1>
      <p className="case__lede">
        The link may be old, or mistyped. The work is all still here:
      </p>
      <ul className="not-found__list">
        {getAllCaseStudies().map((study) => (
          <li key={study.slug}>
            <Link href={`/work/${study.slug}`}>{study.title}</Link>
          </li>
        ))}
      </ul>
      <p className="case__back mono">
        <Link href="/">← Back to the homepage</Link>
      </p>
    </main>
  );
}

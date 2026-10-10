import { lastUpdated } from "@/lib/build-info";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="footer">
      <p>Built to be read, not scrolled through.</p>
      <p>
        Last updated <time dateTime={lastUpdated.iso}>{lastUpdated.label}</time>
        {" · "}
        <a href={site.source}>Source on GitHub</a>
      </p>
    </footer>
  );
}

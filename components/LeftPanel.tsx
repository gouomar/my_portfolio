import { site } from "@/lib/site";
import { Nav } from "@/components/Nav";
import { Socials } from "@/components/Socials";

/**
 * The fixed identity panel. On desktop it sticks full-height beside the
 * scrolling content; on mobile it collapses into a normal stacked header.
 * Order mirrors the reference: name · role · tagline · nav · socials.
 */
export function LeftPanel() {
  return (
    <header className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-[48%] lg:flex-col lg:justify-between lg:py-24">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-text sm:text-5xl">
          {site.name}
        </h1>
        <p className="mt-3 text-lg font-medium tracking-tight text-text sm:text-xl">
          {site.role}
        </p>
        <p className="mt-4 max-w-xs text-sm leading-relaxed text-subtext opacity-70">
          {site.tagline}
        </p>

        <div className="mt-16">
          <Nav />
        </div>
      </div>

      <div className="mt-10 lg:mt-0">
        <Socials />
      </div>
    </header>
  );
}

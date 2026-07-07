import { Section } from "@/components/sections/Section";

export function About() {
  return (
    <Section id="about" title="About">
      <div className="space-y-6 text-base leading-relaxed text-subtext">
        <p>
          I&apos;m a software engineer specializing in backend architecture and systems programming. I do my best work at the intersection of analytical theory and low-level execution - where rigorous problem-solving meets memory, state, and timing. I take pride in bringing order to chaotic environments through careful design of boundaries and coordination.
        </p>
        <p>
          My engineering approach was shaped by two contrasting environments: two intensive years of CPGE math and physics, followed by the gritty, low-level systems architecture of{" "}
          <a
            href="https://1337.ma"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-text underline decoration-surface-2 underline-offset-4 transition-colors hover:decoration-accent motion-reduce:transition-none"
          >
            1337
          </a>
          .
        </p>
        <p>
          Today, my obsession with orchestration extends to leading teams. As Vice President of {" "}
          <a
            href="https://www.praxis-club.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-text underline decoration-surface-2 underline-offset-4 transition-colors hover:decoration-accent motion-reduce:transition-none"
          >
            Praxis
          </a>
          , I drive student teams to ship serious technical products. The ultimate test of this has been building <a href="https://github.com/Praxis-13/medicAtlas" target="_blank" rel="noopener noreferrer" className="font-medium text-text underline decoration-surface-2 underline-offset-4 transition-colors hover:decoration-accent motion-reduce:transition-none">MedicAtlas</a> a full healthcare platform where I tackled the struggle of integrating DB architecture, dockerized services, and complex API layers into one reliable system.
        </p>
        <p>
          You&apos;ll see this same systems-first mindset across my solo work, whether managing thread contention in <em className="font-medium text-text not-italic">Codexion</em> or chaining AI decisions in <em className="font-medium text-text not-italic">Agency Brain</em>. I&apos;m currently seeking backend roles where scalable coordination is the core job. Outside of work, you can usually find me swimming, playing League of Legends, or immersed in a good book.
        </p>
      </div>
    </Section>
  );
}

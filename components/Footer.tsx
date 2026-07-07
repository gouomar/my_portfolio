export function Footer() {
  return (
    <footer className="py-12 text-sm leading-relaxed text-overlay">
      <p className="max-w-md">
        Built with{" "}
        <a
          href="https://nextjs.org"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-text underline decoration-surface-2 underline-offset-4 transition-colors hover:decoration-accent motion-reduce:transition-none"
        >
          Next.js
        </a>
        ,{" "}
        <a
          href="https://tailwindcss.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-text underline decoration-surface-2 underline-offset-4 transition-colors hover:decoration-accent motion-reduce:transition-none"
        >
          Tailwind CSS
        </a>
        , and{" "}
        <a
          href="https://mdxjs.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-text underline decoration-surface-2 underline-offset-4 transition-colors hover:decoration-accent motion-reduce:transition-none"
        >
          MDX
        </a>
        . Deployed on{" "}
        <a
          href="https://vercel.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-text underline decoration-surface-2 underline-offset-4 transition-colors hover:decoration-accent motion-reduce:transition-none"
        >
          Vercel
        </a>
        .
      </p>
    </footer>
  );
}

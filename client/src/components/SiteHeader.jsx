import { Link } from 'react-router-dom';

const navItems = [
  { label: 'Step by step mode', href: '#trace-preview' },
  { label: 'Focus Areas', href: '#focus-areas' },
  { label: 'Calm Study Flow', href: '#study-flow' },
];

export function SiteHeader() {
  return (
    <header id="top" className="flex flex-col gap-6 border-b border-line/70 pb-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
          AlgoLens
        </p>
        <p className="mt-2 max-w-lg text-sm leading-6 text-muted">
          A visual learning platform for students who understand algorithms better when they can
          watch state change over time.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
        <nav className="flex flex-wrap gap-3">
          {navItems.map((item) => (
            <a
              key={item.label}
              className="rounded-full border border-line/70 bg-white/55 px-4 py-2 transition hover:border-accent/40 hover:text-ink"
              href={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <Link
          className="inline-flex items-center whitespace-nowrap rounded-full bg-accent px-4 py-2 font-semibold text-white transition hover:bg-ink"
          to="/app/traces"
        >
          Open step-by-step examples
        </Link>
        <Link
          className="inline-flex items-center whitespace-nowrap rounded-full border border-line/70 bg-white/55 px-4 py-2 font-semibold text-ink transition hover:border-accent/40"
          to="/auth"
        >
          Sign in
        </Link>
      </div>
    </header>
  );
}

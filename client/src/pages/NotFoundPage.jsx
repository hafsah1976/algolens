import { Link } from 'react-router-dom';

export function NotFoundPage({
  actionLabel = 'Return to dashboard',
  actionTo = '/app/dashboard',
  eyebrow = 'Not found',
  message = 'That page does not exist in the current AlgoLens workspace.',
  title = 'This path is outside the map.',
}) {
  return (
    <main className="relative isolate grid min-h-[60vh] place-items-center overflow-hidden px-4 py-10">
      <div className="orb orb--right" aria-hidden="true" />
      <section className="app-panel max-w-xl p-6 text-center sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">{eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl tracking-[-0.04em] text-ink">{title}</h1>
        <p className="mt-4 text-sm leading-7 text-muted">{message}</p>
        <Link
          className="mt-6 inline-flex items-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink"
          to={actionTo}
        >
          {actionLabel}
        </Link>
      </section>
    </main>
  );
}

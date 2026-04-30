import { useState } from 'react';

export function GuidedCardDeck({
  cards,
  description,
  eyebrow = 'Guided cards',
  title,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const safeCards = cards.filter(Boolean);
  const activeCard = safeCards[activeIndex];
  const isFirst = activeIndex === 0;
  const isLast = activeIndex === safeCards.length - 1;

  if (!activeCard) {
    return null;
  }

  function goPrevious() {
    setActiveIndex((current) => Math.max(0, current - 1));
  }

  function goNext() {
    setActiveIndex((current) => Math.min(safeCards.length - 1, current + 1));
  }

  return (
    <section className="app-panel overflow-hidden p-6 sm:p-8">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">{eyebrow}</p>
          <h3 className="mt-3 font-display text-4xl tracking-[-0.04em] text-ink">{title}</h3>
          <p className="mt-4 text-sm leading-7 text-muted">{description}</p>

          <div className="mt-6 flex items-center gap-3">
            <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              Card {activeIndex + 1} of {safeCards.length}
            </span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-warm">
              <div
                className="h-full rounded-full bg-accent transition-[width] duration-300"
                style={{ width: `${((activeIndex + 1) / safeCards.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <article className="rounded-[1.7rem] border border-line/80 bg-white/80 p-6 shadow-[0_18px_60px_rgba(20,34,23,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
            {activeCard.label}
          </p>
          <h4 className="mt-4 font-display text-3xl tracking-[-0.04em] text-ink">
            {activeCard.title}
          </h4>
          <p className="mt-4 text-base leading-8 text-ink">{activeCard.body}</p>

          {activeCard.takeaway ? (
            <p className="mt-5 rounded-[1.1rem] bg-accent/10 px-4 py-3 text-sm font-medium leading-6 text-accent">
              {activeCard.takeaway}
            </p>
          ) : null}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              className="rounded-full border border-line/80 bg-white/80 px-4 py-2 text-sm font-semibold text-ink transition hover:border-accent/40 disabled:cursor-not-allowed disabled:text-muted/60"
              disabled={isFirst}
              onClick={goPrevious}
              type="button"
            >
              Previous
            </button>
            <button
              className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:bg-muted"
              disabled={isLast}
              onClick={goNext}
              type="button"
            >
              {isLast ? 'Ready for the lesson' : 'Next card'}
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}

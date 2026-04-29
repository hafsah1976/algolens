function MiniExample({ example, index }) {
  return (
    <article className="border-t border-line/70 pt-5">
      <div className="flex items-start gap-4">
        <span className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line/80 bg-white/80 text-xs font-semibold text-muted">
          {index + 1}
        </span>

        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            {example.pattern}
          </p>
          <h4 className="mt-2 text-xl font-semibold text-ink">{example.title}</h4>
          <p className="mt-3 text-sm leading-7 text-muted">{example.scenario}</p>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">What changes</p>
              <p className="mt-2 text-sm leading-7 text-ink">{example.whatChanges}</p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Look for</p>
              <p className="mt-2 text-sm leading-7 text-ink">{example.lookFor}</p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export function MiniExamples({ examples, title }) {
  return (
    <section className="app-panel p-6 sm:p-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">Mini examples</p>
          <h3 className="mt-3 font-display text-3xl text-ink">See {title} in smaller moments</h3>
        </div>
        <p className="max-w-xl text-sm leading-7 text-muted">
          These examples are intentionally small. They help learners recognize the pattern before
          opening a full lesson.
        </p>
      </div>

      <div className="mt-7 grid gap-7 xl:grid-cols-3">
        {examples.map((example, index) => (
          <MiniExample key={example.title} example={example} index={index} />
        ))}
      </div>
    </section>
  );
}

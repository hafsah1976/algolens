import { completionConcept } from '../data/appShellData.js';

export function CompletionConcept() {
  return (
    <section className="app-panel p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">Study close</p>
      <h3 className="mt-3 font-display text-4xl tracking-[-0.04em] text-ink">
        {completionConcept.title}
      </h3>
      <p className="mt-4 max-w-2xl text-base leading-7 text-muted">{completionConcept.body}</p>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {completionConcept.takeaways.map((item, index) => (
          <div key={item} className="app-panel-soft p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">
              Reflection {index + 1}
            </p>
            <p className="mt-3 text-sm leading-6 text-ink">{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

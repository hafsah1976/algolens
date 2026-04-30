const primerSectionMeta = [
  { key: 'whatThisIs', label: 'What this is' },
  { key: 'whyItHelps', label: 'Why it helps' },
  { key: 'pictureIt', label: 'How to picture it' },
  { key: 'commonMistake', label: 'Common beginner miss' },
  { key: 'traceMode', label: 'What step by step mode will show' },
];

function PrimerBlock({ body, label }) {
  return (
    <div className="app-panel-soft p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">{label}</p>
      <p className="mt-3 text-sm leading-7 text-ink">{body}</p>
    </div>
  );
}

function VocabularyItem({ meaning, term }) {
  return (
    <div className="rounded-[1.25rem] border border-line/80 bg-white/80 px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{term}</p>
      <p className="mt-2 text-sm leading-6 text-muted">{meaning}</p>
    </div>
  );
}

function TeachingPanel({ children, label, title }) {
  return (
    <div className="app-panel-soft p-5 sm:p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">{label}</p>
      <h4 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-ink">{title}</h4>
      <div className="mt-4 space-y-3 text-sm leading-7 text-muted">{children}</div>
    </div>
  );
}

export function ConceptPrimer({ primer, title }) {
  return (
    <section className="app-panel overflow-hidden p-6 sm:p-8">
      <div className="grid gap-8 xl:grid-cols-[minmax(280px,0.9fr)_minmax(0,1.1fr)]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">Concept primer</p>
          <h3 className="mt-3 font-display text-4xl tracking-[-0.04em] text-ink">
            Understand the idea before the algorithm
          </h3>
          <p className="mt-4 text-sm leading-7 text-muted">
            {title} should feel understandable before it feels efficient. This primer keeps the
            core idea concrete, visual, and beginner-safe.
          </p>

          <div className="mt-6 app-panel-soft px-5 py-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Start here</p>
            <p className="mt-3 text-sm leading-7 text-ink">{primer.intro}</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {primerSectionMeta.map((section) => (
            <PrimerBlock
              key={section.key}
              body={primer[section.key]}
              label={section.label}
            />
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(280px,0.9fr)]">
        <TeachingPanel label="When to reach for it" title="Spot the pattern sooner">
          <p className="text-ink">{primer.useItWhen}</p>
        </TeachingPanel>

        <TeachingPanel label="Tiny example" title={primer.tinyExample.prompt}>
          <p className="text-ink">{primer.tinyExample.story}</p>
          <p className="font-medium text-accent">{primer.tinyExample.takeaway}</p>
        </TeachingPanel>
      </div>

      <div className="mt-4 app-panel-soft p-5 sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">Self-check</p>
            <h4 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-ink">Questions a beginner should be able to answer</h4>
          </div>
          <p className="max-w-md text-sm leading-6 text-muted">
            These are not quiz questions. They are quick ways to see whether the concept is starting to click.
          </p>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-3">
          {primer.selfCheck.map((question, index) => (
            <div key={question} className="rounded-[1.25rem] border border-line/80 bg-white/80 px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                Check {index + 1}
              </p>
              <p className="mt-3 text-sm leading-7 text-ink">{question}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 border-t border-line/70 pt-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">Vocabulary</p>
            <h4 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-ink">Small words that unlock the topic</h4>
          </div>
          <p className="max-w-md text-sm leading-6 text-muted">
            These are the terms learners will keep seeing across lessons, walkthroughs, and explanations.
          </p>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {primer.vocabulary.map((item) => (
            <VocabularyItem key={item.term} meaning={item.meaning} term={item.term} />
          ))}
        </div>
      </div>
    </section>
  );
}

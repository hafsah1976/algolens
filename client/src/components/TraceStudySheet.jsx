function StudySheetFrame({ frame, label }) {
  return (
    <div className="rounded-2xl border border-line/80 bg-white/70 p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">{label}</p>
      <h3 className="mt-2 text-sm font-semibold text-ink">{frame.title}</h3>
      <p className="mt-2 text-xs leading-5 text-muted">{frame.status}</p>
      <p className="mt-3 text-xs leading-5 text-ink">{frame.decision}</p>
    </div>
  );
}

export function TraceStudySheet({ lesson, traceLesson, track }) {
  const firstFrame = traceLesson.frames[0];
  const middleFrame = traceLesson.frames[Math.floor(traceLesson.frames.length / 2)];
  const lastFrame = traceLesson.frames.at(-1);
  const recap = traceLesson.completionRecap;

  return (
    <section className="study-sheet-printable app-panel p-6 sm:p-8">
      <div className="flex flex-col gap-4 border-b border-line/70 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">AlgoLens study sheet</p>
          <h2 className="mt-3 font-display text-4xl tracking-[-0.04em] text-ink">{lesson.title}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">{traceLesson.summary}</p>
        </div>
        <div className="rounded-2xl border border-line/80 bg-white/70 px-4 py-3 text-sm text-muted">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Path</p>
          <p className="mt-1 font-semibold text-ink">{track.title}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Pattern</p>
          <p className="mt-2 text-sm font-semibold text-ink">{recap.pattern}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Key rule</p>
          <p className="mt-2 text-sm leading-6 text-ink">{recap.remember}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Look for next</p>
          <p className="mt-2 text-sm leading-6 text-ink">{recap.next}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <StudySheetFrame frame={firstFrame} label="Frame 1" />
        <StudySheetFrame frame={middleFrame} label="Middle frame" />
        <StudySheetFrame frame={lastFrame} label="Final frame" />
      </div>

      <div className="mt-6 rounded-2xl border border-line/80 bg-white/70 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Self-check before moving on</p>
        <ul className="mt-3 space-y-2 text-sm leading-6 text-ink">
          <li>Can I explain why the highlighted step happened?</li>
          <li>Can I name what changed in the data structure?</li>
          <li>Can I say when this pattern is useful in a new problem?</li>
        </ul>
      </div>
    </section>
  );
}

export function PrintStudySheetButton() {
  return (
    <button
      className="inline-flex items-center rounded-full border border-line/80 bg-white/70 px-4 py-2 text-sm font-medium text-ink transition hover:border-accent/40"
      onClick={() => window.print()}
      type="button"
    >
      Print study sheet
    </button>
  );
}

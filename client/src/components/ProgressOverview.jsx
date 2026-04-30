function getStorageMessage(storageMode) {
  if (storageMode === 'mongo') {
    return 'Progress is saved to your account.';
  }

  if (storageMode === 'file' || storageMode === 'file-fallback') {
    return 'Progress is saved locally until account storage reconnects.';
  }

  return 'Checking saved progress.';
}

export function ProgressOverview({
  error,
  isLoading,
  isSaving,
  overallProgress,
  snapshot,
  storageMode,
  tracks,
  userName,
}) {
  return (
    <section className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)]">
      <div className="app-panel p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">Progress overview</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-4xl font-semibold tracking-[-0.04em] text-ink">{overallProgress.percent}%</p>
            <p className="mt-2 text-sm leading-6 text-muted">Overall coverage across the current lesson set.</p>
          </div>
          <div>
            <p className="text-4xl font-semibold tracking-[-0.04em] text-ink">{overallProgress.completed}</p>
            <p className="mt-2 text-sm leading-6 text-muted">Lessons currently marked complete for this learner.</p>
          </div>
          <div>
            <p className="text-4xl font-semibold tracking-[-0.04em] text-ink">{tracks.length}</p>
            <p className="mt-2 text-sm leading-6 text-muted">Core paths visible in navigation and on the dashboard.</p>
          </div>
        </div>

        <div className="mt-8 h-3 overflow-hidden rounded-full bg-warm">
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-500"
            style={{ width: `${overallProgress.percent}%` }}
          />
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-muted">
          <span className="rounded-full border border-line/80 bg-white/70 px-3 py-2">
            {isLoading ? 'Loading saved progress…' : getStorageMessage(storageMode)}
          </span>
          <span className="rounded-full border border-line/80 bg-white/70 px-3 py-2">
            {isSaving ? 'Saving your place' : 'Ready to continue'}
          </span>
        </div>

        {error ? (
          <div className="mt-4 rounded-[1.2rem] border border-rose-200 bg-rose-50/90 px-4 py-3 text-sm leading-6 text-rose-700">
            {error}
          </div>
        ) : null}
      </div>

      <div className="app-panel p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">Today&apos;s rhythm</p>
        <h3 className="mt-3 font-display text-3xl tracking-[-0.04em] text-ink">{snapshot.studyRhythm}</h3>
        <p className="mt-3 text-sm leading-6 text-muted">
          {snapshot.focusWindow}. {snapshot.recentWin}
        </p>
        <div className="mt-6 space-y-3">
          <div className="app-panel-soft p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Recommended flow</p>
            <p className="mt-2 text-sm leading-6 text-ink">Resume one lesson, reflect once, then stop.</p>
          </div>
          <div className="app-panel-soft p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Current learner</p>
            <p className="mt-2 text-sm leading-6 text-ink">
              {(userName || snapshot.learnerName)} has saved progress across step-by-step lessons.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

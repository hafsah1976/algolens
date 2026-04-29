function MilestonePill({ milestone, variant = 'full' }) {
  const isCompact = variant === 'compact';

  return (
    <div
      className={`rounded-[1.25rem] border p-4 transition ${
        milestone.unlocked
          ? 'border-accent/25 bg-accent/10 text-ink'
          : 'border-line/70 bg-white/55 text-muted'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p
            className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${
              milestone.unlocked ? 'text-accent' : 'text-muted'
            }`}
          >
            {milestone.label}
          </p>
          <h3 className="mt-2 text-sm font-semibold tracking-[-0.02em] text-ink">
            {milestone.title}
          </h3>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
            milestone.unlocked ? 'bg-accent text-white' : 'bg-warm text-muted'
          }`}
        >
          {milestone.unlocked ? 'Earned' : 'Locked'}
        </span>
      </div>

      {!isCompact ? (
        <>
          <p className="mt-3 text-sm leading-6 text-muted">{milestone.description}</p>
          <p className="mt-3 text-xs leading-5 text-muted">
            <span className="font-semibold text-ink">Unlock:</span> {milestone.requirement}
          </p>
        </>
      ) : null}
    </div>
  );
}

export function MentalModelMilestones({ snapshot, variant = 'dashboard' }) {
  const featuredMilestones =
    variant === 'completion'
      ? snapshot.unlocked.slice(-3).reverse()
      : [...snapshot.unlocked, ...snapshot.locked].slice(0, 6);
  const nextMilestone = snapshot.nextMilestone;

  return (
    <section className="app-panel p-6 sm:p-7">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">
            Mental model milestones
          </p>
          <h2 className="mt-3 font-display text-3xl tracking-[-0.04em] text-ink">
            Reward understanding, not streak pressure.
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            AlgoLens marks conceptual breakthroughs as you complete Trace Mode lessons.
            The goal is confidence you can explain, not another feed to chase.
          </p>

          <div className="mt-6">
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
              <span>{snapshot.unlockedCount} / {snapshot.total} earned</span>
              <span>{snapshot.percent}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-warm">
              <div
                className="h-full rounded-full bg-accent transition-[width] duration-500"
                style={{ width: `${snapshot.percent}%` }}
              />
            </div>
          </div>

          {nextMilestone ? (
            <div className="mt-5 rounded-[1.15rem] border border-line/80 bg-white/65 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Next breakthrough</p>
              <p className="mt-2 text-sm font-semibold text-ink">{nextMilestone.title}</p>
              <p className="mt-2 text-sm leading-6 text-muted">{nextMilestone.requirement}</p>
            </div>
          ) : (
            <div className="mt-5 rounded-[1.15rem] border border-accent/25 bg-accent/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">All milestones earned</p>
              <p className="mt-2 text-sm leading-6 text-ink">
                This learner has completed the current milestone set.
              </p>
            </div>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {featuredMilestones.map((milestone) => (
            <MilestonePill
              key={milestone.id}
              milestone={milestone}
              variant={variant === 'completion' ? 'compact' : 'full'}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function EarnedMilestoneStrip({ milestones }) {
  if (!milestones.length) {
    return null;
  }

  return (
    <div className="rounded-[1.35rem] border border-accent/25 bg-accent/10 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        Breakthrough reinforced
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {milestones.slice(0, 3).map((milestone) => (
          <span
            className="rounded-full bg-white/75 px-3 py-2 text-xs font-semibold text-ink"
            key={milestone.id}
          >
            {milestone.title}
          </span>
        ))}
      </div>
    </div>
  );
}

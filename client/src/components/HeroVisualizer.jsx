const stepPreview = [
  'Check the current pair and compare it to the target.',
  'Move the left pointer forward when the sum is too small.',
  'Stop as soon as the right pair is found and explain why it works.',
];

const cells = [
  { value: 2, state: 'active-left', label: 'left' },
  { value: 4, state: 'idle' },
  { value: 7, state: 'idle' },
  { value: 11, state: 'active-right', label: 'right' },
];

export function HeroVisualizer() {
  return (
    <section
      className="overflow-hidden rounded-[2rem] border border-line/80 bg-surface/90 p-6 shadow-[0_30px_90px_rgba(20,34,23,0.08)] backdrop-blur-xl sm:p-8"
      id="trace-preview"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted">
            Step-by-step preview
          </p>
          <h2 className="mt-2 font-display text-3xl tracking-[-0.03em] text-ink">
            See the algorithm think.
          </h2>
        </div>

        <div className="rounded-full border border-line/80 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Step 2 of 3
        </div>
      </div>

      <div className="mt-8 rounded-[1.75rem] border border-line/80 bg-surface-strong/90 p-5">
        <div className="flex items-center justify-between gap-3 text-sm text-muted">
          <span className="font-semibold text-ink">Two Pointers</span>
          <span>Target: 13</span>
        </div>

        <div className="mt-5 grid grid-cols-4 gap-3">
          {cells.map((cell) => {
            const isActive = cell.state !== 'idle';
            const ringClass =
              cell.state === 'active-left'
                ? 'border-accent bg-accent/10 text-accent'
                : isActive
                  ? 'border-ink bg-ink/8 text-ink'
                  : 'border-line/80 bg-white text-ink';

            return (
              <div
                key={cell.value}
                className={`rounded-[1.25rem] border px-4 py-5 text-center transition ${ringClass}`}
              >
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                  {cell.label ?? 'index'}
                </div>
                <div className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
                  {cell.value}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 grid gap-3 text-sm text-muted sm:grid-cols-2">
          <div className="rounded-[1.25rem] bg-accent/8 px-4 py-3">
            <p className="font-semibold uppercase tracking-[0.18em] text-accent">left pointer</p>
            <p className="mt-2">Index 0 is too small to hit the target with the current right side.</p>
          </div>
          <div className="rounded-[1.25rem] bg-ink/6 px-4 py-3">
            <p className="font-semibold uppercase tracking-[0.18em] text-ink">right pointer</p>
            <p className="mt-2">Index 3 stays fixed while the walkthrough explains what changes next.</p>
          </div>
        </div>
      </div>

      <ol className="mt-6 space-y-3">
        {stepPreview.map((step, index) => {
          const active = index === 1;

          return (
            <li
              key={step}
              className={`rounded-[1.25rem] border px-4 py-4 text-sm leading-6 transition ${
                active
                  ? 'border-accent/40 bg-accent/8 text-ink'
                  : 'border-line/80 bg-white/65 text-muted'
              }`}
            >
              <span className="mr-3 inline-flex h-7 w-7 items-center justify-center rounded-full border border-current/20 text-xs font-semibold">
                {index + 1}
              </span>
              {step}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

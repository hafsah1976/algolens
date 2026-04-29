const values = [2, 5, 8, 12, 16, 23, 38];
const target = 16;
const low = 0;
const mid = 3;
const high = 6;

function getCellLabel(index) {
  const labels = [];

  if (index === low) {
    labels.push('low');
  }

  if (index === mid) {
    labels.push('mid');
  }

  if (index === high) {
    labels.push('high');
  }

  return labels.join(' / ');
}

export function BinarySearchVisualization() {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Binary search</p>
        <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-ink">
          Read the middle before moving the range.
        </h3>
        <p className="mt-3 text-sm leading-6 text-muted">
          Target {target}. The middle value is 12, so the next search can ignore the left half.
        </p>
      </div>

      <div className="flex flex-wrap items-end justify-center gap-3 rounded-[1.35rem] bg-white/70 p-5">
        {values.map((value, index) => {
          const isActive = index === low || index === mid || index === high;
          const isDiscarded = index < mid;

          return (
            <div
              className={`flex h-24 w-16 flex-col items-center justify-between rounded-[1rem] border px-2 py-3 text-center transition ${
                index === mid
                  ? 'border-accent bg-accent/10 text-accent'
                  : isActive
                    ? 'border-ink/35 bg-white text-ink'
                    : isDiscarded
                      ? 'border-line/60 bg-warm/70 text-muted opacity-60'
                      : 'border-line/80 bg-white text-ink'
              }`}
              key={value}
            >
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                {getCellLabel(index) || `i ${index}`}
              </span>
              <span className="text-xl font-semibold">{value}</span>
            </div>
          );
        })}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="app-panel-soft p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Compare</p>
          <p className="mt-2 text-sm text-ink">12 is less than 16.</p>
        </div>
        <div className="app-panel-soft p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Decision</p>
          <p className="mt-2 text-sm text-ink">Move low to mid + 1.</p>
        </div>
        <div className="app-panel-soft p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Why</p>
          <p className="mt-2 text-sm text-ink">Sorted order makes the discarded side safe.</p>
        </div>
      </div>
    </div>
  );
}

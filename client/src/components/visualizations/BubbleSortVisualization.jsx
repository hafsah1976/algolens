const before = [5, 1, 4, 2];
const after = [1, 5, 4, 2];

function Bars({ activePair, label, values }) {
  const maxValue = Math.max(...values);

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{label}</p>
      <div className="mt-3 flex h-32 items-end gap-3 rounded-[1.2rem] bg-white/70 p-4">
        {values.map((value, index) => (
          <div
            className={`flex flex-1 items-end justify-center rounded-t-[0.8rem] border text-sm font-semibold ${
              activePair.includes(index)
                ? 'border-accent bg-accent/20 text-accent'
                : 'border-line/80 bg-warm text-ink'
            }`}
            key={`${label}-${index}-${value}`}
            style={{ height: `${Math.max(22, (value / maxValue) * 100)}%` }}
          >
            <span className="mb-2">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BubbleSortVisualization() {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Bubble sort</p>
        <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-ink">
          Compare neighbors, then swap if needed.
        </h3>
        <p className="mt-3 text-sm leading-6 text-muted">
          Bubble sort repeatedly compares adjacent values. Here, 5 and 1 are out of order, so they swap.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Bars activePair={[0, 1]} label="Before swap" values={before} />
        <Bars activePair={[0, 1]} label="After swap" values={after} />
      </div>
    </div>
  );
}

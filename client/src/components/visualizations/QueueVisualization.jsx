const queueItems = ['A', 'B', 'C', 'D'];

export function QueueVisualization() {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Queue enqueue / dequeue</p>
        <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-ink">
          The oldest item leaves first.
        </h3>
        <p className="mt-3 text-sm leading-6 text-muted">
          Enqueue adds to the back. Dequeue removes from the front, preserving arrival order.
        </p>
      </div>

      <div className="rounded-[1.35rem] bg-white/70 p-5">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {queueItems.map((item, index) => (
            <div
              className={`rounded-[1rem] border px-5 py-4 text-center text-xl font-semibold ${
                index === 0
                  ? 'border-accent bg-accent/10 text-accent'
                  : index === queueItems.length - 1
                    ? 'border-ink/35 bg-white text-ink'
                    : 'border-line/80 bg-white text-ink'
              }`}
              key={item}
            >
              {item}
              <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                {index === 0 ? 'front' : index === queueItems.length - 1 ? 'back' : `wait ${index + 1}`}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-5 text-center text-sm leading-6 text-muted">
          Next dequeue removes A. A new enqueue would join after D.
        </p>
      </div>
    </div>
  );
}

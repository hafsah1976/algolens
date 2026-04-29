const stackItems = ['{', '[', '('];

export function StackVisualization() {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(260px,1fr)]">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Stack push / pop</p>
        <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-ink">
          The top item is the next one out.
        </h3>
        <p className="mt-3 text-sm leading-6 text-muted">
          A stack is last in, first out. New items enter at the top, and pop removes that same top item.
        </p>
      </div>

      <div className="rounded-[1.35rem] bg-white/70 p-5">
        <div className="mx-auto flex max-w-[220px] flex-col-reverse gap-3">
          {stackItems.map((item, index) => {
            const isTop = index === stackItems.length - 1;

            return (
              <div
                className={`rounded-[1rem] border px-5 py-4 text-center text-2xl font-semibold transition ${
                  isTop ? 'border-accent bg-accent/10 text-accent' : 'border-line/80 bg-white text-ink'
                }`}
                key={`${item}-${index}`}
              >
                <span>{item}</span>
                <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                  {isTop ? 'top / next pop' : `depth ${index + 1}`}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="app-panel-soft p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Push</p>
            <p className="mt-2 text-sm text-ink">Add to top.</p>
          </div>
          <div className="app-panel-soft p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Pop</p>
            <p className="mt-2 text-sm text-ink">Remove from top.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

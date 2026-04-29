const pathNodes = ['A', 'B', 'D'];
const waitingNodes = ['E', 'C'];

export function DFSVisualization() {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Depth-first search</p>
        <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-ink">
          Follow one branch before backing up.
        </h3>
        <p className="mt-3 text-sm leading-6 text-muted">
          DFS keeps the current path in focus. When the branch ends, it returns to unfinished work.
        </p>

        <div className="mt-5 rounded-[1.35rem] bg-white/70 p-5">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {pathNodes.map((node, index) => (
              <span
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-accent bg-accent/10 text-sm font-semibold text-accent"
                key={node}
              >
                {node}
                <span className="sr-only">path step {index + 1}</span>
              </span>
            ))}
          </div>
          <p className="mt-4 text-center text-sm leading-6 text-muted">
            Active path: A to B to D. Next, DFS backs up and checks unfinished neighbors.
          </p>
        </div>
      </div>

      <div className="app-panel-soft p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Waiting work</p>
        <div className="mt-3 space-y-2">
          {waitingNodes.map((node) => (
            <div className="rounded-[0.9rem] border border-line/70 bg-white/70 px-4 py-3 text-sm text-ink" key={node}>
              Return later to {node}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const levels = [
  ['A'],
  ['B', 'C'],
  ['D', 'E', 'F'],
];

export function BFSVisualization() {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Breadth-first search</p>
        <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-ink">
          Visit the tree one layer at a time.
        </h3>
        <p className="mt-3 text-sm leading-6 text-muted">
          BFS uses a queue so nodes discovered earlier are handled before deeper nodes.
        </p>
      </div>

      <div className="rounded-[1.35rem] bg-white/70 p-5">
        <div className="space-y-4">
          {levels.map((level, levelIndex) => (
            <div className="flex justify-center gap-3" key={`level-${levelIndex}`}>
              {level.map((node) => (
                <span
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-full border text-sm font-semibold ${
                    levelIndex === 1
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-line/80 bg-white text-ink'
                  }`}
                  key={node}
                >
                  {node}
                </span>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-5 app-panel-soft p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Queue now</p>
          <p className="mt-2 text-sm text-ink">B, C are waiting before D, E, F.</p>
        </div>
      </div>
    </div>
  );
}

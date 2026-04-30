import { Position } from '@xyflow/react';

import { LearningGraphCanvas } from './LearningGraphCanvas.jsx';

const nodes = [
  { id: 'A', label: 'A', position: { x: 260, y: 10 }, sourcePosition: Position.Bottom, status: 'path' },
  { id: 'B', label: 'B', position: { x: 145, y: 120 }, sourcePosition: Position.Bottom, targetPosition: Position.Top, status: 'path' },
  { id: 'C', label: 'C', position: { x: 375, y: 120 }, sourcePosition: Position.Bottom, targetPosition: Position.Top, status: 'queued' },
  { id: 'D', label: 'D', position: { x: 70, y: 240 }, targetPosition: Position.Top, status: 'active' },
  { id: 'E', label: 'E', position: { x: 220, y: 240 }, targetPosition: Position.Top, status: 'queued' },
  { id: 'F', label: 'F', position: { x: 450, y: 240 }, targetPosition: Position.Top, status: 'future' },
];

const edges = [
  { id: 'A-B', source: 'A', target: 'B', status: 'active' },
  { id: 'A-C', source: 'A', target: 'C' },
  { id: 'B-D', source: 'B', target: 'D', status: 'active' },
  { id: 'B-E', source: 'B', target: 'E' },
  { id: 'C-F', source: 'C', target: 'F' },
];

const legend = [
  { color: '#2f7350', label: 'Current node' },
  { color: '#8fc3a5', label: 'Current path' },
  { color: '#ffffff', label: 'Return later' },
];

export function DFSVisualization() {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Depth-first search</p>
        <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-ink">
          Follow one branch before backing up.
        </h3>
        <p className="mt-3 text-sm leading-6 text-muted">
          DFS keeps the current path in focus. When the branch ends, it returns to unfinished work.
        </p>

        <div className="mt-5">
          <LearningGraphCanvas edges={edges} legend={legend} nodes={nodes} />
        </div>
      </div>

      <div className="space-y-4">
        <div className="app-panel-soft p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Current path</p>
          <p className="mt-2 text-sm leading-6 text-ink">
            A to B to D. DFS keeps going down one branch until it cannot go deeper.
          </p>
        </div>
        <div className="app-panel-soft p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Waiting work</p>
          <div className="mt-3 space-y-2">
            {['E', 'C'].map((node) => (
              <div className="rounded-[0.9rem] border border-line/70 bg-white/70 px-4 py-3 text-sm text-ink" key={node}>
                Return later to {node}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

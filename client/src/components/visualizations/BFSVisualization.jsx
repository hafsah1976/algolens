import { Position } from '@xyflow/react';

import { LearningGraphCanvas } from './LearningGraphCanvas.jsx';

const nodes = [
  { id: 'A', label: 'A', position: { x: 260, y: 10 }, sourcePosition: Position.Bottom, status: 'visited' },
  { id: 'B', label: 'B', position: { x: 145, y: 120 }, sourcePosition: Position.Bottom, targetPosition: Position.Top, status: 'visited' },
  { id: 'C', label: 'C', position: { x: 375, y: 120 }, sourcePosition: Position.Bottom, targetPosition: Position.Top, status: 'active' },
  { id: 'D', label: 'D', position: { x: 70, y: 240 }, targetPosition: Position.Top, status: 'queued' },
  { id: 'E', label: 'E', position: { x: 220, y: 240 }, targetPosition: Position.Top, status: 'queued' },
  { id: 'F', label: 'F', position: { x: 450, y: 240 }, targetPosition: Position.Top, status: 'queued' },
];

const edges = [
  { id: 'A-B', source: 'A', target: 'B', status: 'active' },
  { id: 'A-C', source: 'A', target: 'C', status: 'active' },
  { id: 'B-D', source: 'B', target: 'D' },
  { id: 'B-E', source: 'B', target: 'E' },
  { id: 'C-F', source: 'C', target: 'F' },
];

const legend = [
  { color: '#2f7350', label: 'Current layer' },
  { color: '#8fc3a5', label: 'Already visited' },
  { color: '#ffffff', label: 'Waiting in queue' },
];

export function BFSVisualization() {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Breadth-first search</p>
        <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-ink">
          Visit the tree one layer at a time.
        </h3>
        <p className="mt-3 text-sm leading-6 text-muted">
          BFS uses a queue so nodes discovered earlier are handled before deeper nodes.
        </p>
        <div className="mt-5">
          <LearningGraphCanvas edges={edges} legend={legend} nodes={nodes} />
        </div>
      </div>

      <div className="space-y-4">
        <div className="app-panel-soft p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Queue now</p>
          <p className="mt-2 text-sm leading-6 text-ink">C is being read now. D, E, and F are waiting for their turn.</p>
        </div>
        <div className="app-panel-soft p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Beginner lens</p>
          <p className="mt-2 text-sm leading-6 text-ink">
            BFS is not trying to go deep yet. It protects the order by finishing the current layer first.
          </p>
        </div>
      </div>
    </div>
  );
}

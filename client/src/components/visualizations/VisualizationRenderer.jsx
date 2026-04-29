import { isRenderableVisualizationType } from '../../lib/visualizationTypes.js';
import { BFSVisualization } from './BFSVisualization.jsx';
import { BinarySearchVisualization } from './BinarySearchVisualization.jsx';
import { BubbleSortVisualization } from './BubbleSortVisualization.jsx';
import { DFSVisualization } from './DFSVisualization.jsx';
import { QueueVisualization } from './QueueVisualization.jsx';
import { StackVisualization } from './StackVisualization.jsx';

const visualizationComponents = {
  bfs: BFSVisualization,
  binary_search: BinarySearchVisualization,
  bubble_sort: BubbleSortVisualization,
  dfs: DFSVisualization,
  queue: QueueVisualization,
  stack: StackVisualization,
};

export function VisualizationRenderer({ visualizationType }) {
  if (!visualizationType || visualizationType === 'none' || visualizationType === 'trace') {
    return null;
  }

  if (!isRenderableVisualizationType(visualizationType)) {
    return (
      <section className="app-panel p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Visualization</p>
        <p className="mt-3 text-sm leading-6 text-muted">
          A visual for this lesson type is not available yet.
        </p>
      </section>
    );
  }

  const SelectedVisualization = visualizationComponents[visualizationType];

  return (
    <section className="app-panel p-6 sm:p-7">
      <SelectedVisualization />
    </section>
  );
}

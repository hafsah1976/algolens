import { lazy, Suspense } from 'react';

import { isRenderableVisualizationType } from '../../lib/visualizationTypes.js';

function loadVisualization(importer, exportName) {
  return lazy(() => importer().then((module) => ({ default: module[exportName] })));
}

const visualizationComponents = {
  bfs: loadVisualization(() => import('./BFSVisualization.jsx'), 'BFSVisualization'),
  binary_search: loadVisualization(() => import('./BinarySearchVisualization.jsx'), 'BinarySearchVisualization'),
  bubble_sort: loadVisualization(() => import('./BubbleSortVisualization.jsx'), 'BubbleSortVisualization'),
  dfs: loadVisualization(() => import('./DFSVisualization.jsx'), 'DFSVisualization'),
  queue: loadVisualization(() => import('./QueueVisualization.jsx'), 'QueueVisualization'),
  stack: loadVisualization(() => import('./StackVisualization.jsx'), 'StackVisualization'),
};

function VisualizationLoading() {
  return (
    <div className="app-panel-soft p-4 text-sm leading-6 text-muted">
      Loading the visual example…
    </div>
  );
}

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
      <Suspense fallback={<VisualizationLoading />}>
        <SelectedVisualization />
      </Suspense>
    </section>
  );
}

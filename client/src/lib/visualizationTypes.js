export const supportedVisualizationTypes = [
  'binary_search',
  'stack',
  'queue',
  'bfs',
  'dfs',
  'bubble_sort',
];

export function isRenderableVisualizationType(visualizationType) {
  return supportedVisualizationTypes.includes(visualizationType);
}

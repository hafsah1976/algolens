export const graphExplorerNodes = [
  { id: 'A', label: 'A', hint: 'Start / root' },
  { id: 'B', label: 'B', hint: 'Left branch' },
  { id: 'C', label: 'C', hint: 'Right branch' },
  { id: 'D', label: 'D', hint: 'Leaf' },
  { id: 'E', label: 'E', hint: 'Connector' },
  { id: 'F', label: 'F', hint: 'Leaf' },
  { id: 'G', label: 'G', hint: 'Deep branch' },
];

export const graphExplorerEdges = [
  { id: 'A-B', source: 'A', target: 'B' },
  { id: 'A-C', source: 'A', target: 'C' },
  { id: 'B-D', source: 'B', target: 'D' },
  { id: 'B-E', source: 'B', target: 'E' },
  { id: 'C-F', source: 'C', target: 'F' },
  { id: 'E-G', source: 'E', target: 'G' },
];

export const graphExplorerModes = [
  {
    id: 'bfs',
    label: 'BFS',
    structureLabel: 'Queue',
    description: 'Breadth-first search visits nearby nodes before deeper nodes.',
  },
  {
    id: 'dfs',
    label: 'DFS',
    structureLabel: 'Stack',
    description: 'Depth-first search follows one branch before backing up.',
  },
];

function sortNodeIds(nodeIds) {
  return [...nodeIds].sort((left, right) => left.localeCompare(right));
}

export function buildGraphAdjacency(nodes = graphExplorerNodes, edges = graphExplorerEdges) {
  const adjacency = new Map(nodes.map((node) => [node.id, []]));

  for (const edge of edges) {
    adjacency.get(edge.source)?.push(edge.target);
    adjacency.get(edge.target)?.push(edge.source);
  }

  for (const [nodeId, neighbors] of adjacency) {
    adjacency.set(nodeId, sortNodeIds(neighbors));
  }

  return adjacency;
}

function findEdgeId(source, target, edges) {
  return edges.find(
    (edge) =>
      (edge.source === source && edge.target === target) ||
      (edge.source === target && edge.target === source),
  )?.id;
}

function toFrame({
  activeEdgeId,
  currentNodeId,
  mode,
  order,
  structure,
  step,
  traversalEdgeIds,
}) {
  const modeLabel = mode === 'bfs' ? 'BFS' : 'DFS';
  const structureName = mode === 'bfs' ? 'queue' : 'stack';
  const currentPosition = order.length;

  return {
    activeEdgeId,
    currentNodeId,
    explanation:
      currentPosition === 1
        ? `${modeLabel} starts at ${currentNodeId}. Mark it visited, then add its unvisited neighbors.`
        : `${modeLabel} visits ${currentNodeId} next. The ${structureName} decides which waiting node is handled after this.`,
    order: [...order],
    status: structure.length
      ? `${structureName}: ${structure.join(' -> ')}`
      : `${structureName}: empty`,
    step,
    structure: [...structure],
    traversalEdgeIds: [...traversalEdgeIds],
    visitedNodeIds: [...order],
  };
}

export function buildGraphTraversal({
  edges = graphExplorerEdges,
  mode = 'bfs',
  nodes = graphExplorerNodes,
  startNodeId = 'A',
} = {}) {
  const nodeIds = new Set(nodes.map((node) => node.id));

  if (!nodeIds.has(startNodeId)) {
    return [];
  }

  const adjacency = buildGraphAdjacency(nodes, edges);
  const order = [];
  const seen = new Set([startNodeId]);
  const traversalEdgeIds = [];
  const frames = [];

  if (mode === 'dfs') {
    const stack = [{ id: startNodeId, parent: null }];

    while (stack.length) {
      const current = stack.pop();
      order.push(current.id);

      const activeEdgeId = current.parent ? findEdgeId(current.parent, current.id, edges) : null;
      if (activeEdgeId && !traversalEdgeIds.includes(activeEdgeId)) {
        traversalEdgeIds.push(activeEdgeId);
      }

      const neighbors = [...(adjacency.get(current.id) ?? [])].reverse();
      for (const neighborId of neighbors) {
        if (seen.has(neighborId)) {
          continue;
        }

        seen.add(neighborId);
        stack.push({ id: neighborId, parent: current.id });
      }

      frames.push(
        toFrame({
          activeEdgeId,
          currentNodeId: current.id,
          mode,
          order,
          structure: stack.map((item) => item.id).reverse(),
          step: frames.length,
          traversalEdgeIds,
        }),
      );
    }

    return frames;
  }

  const queue = [{ id: startNodeId, parent: null }];

  while (queue.length) {
    const current = queue.shift();
    order.push(current.id);

    const activeEdgeId = current.parent ? findEdgeId(current.parent, current.id, edges) : null;
    if (activeEdgeId && !traversalEdgeIds.includes(activeEdgeId)) {
      traversalEdgeIds.push(activeEdgeId);
    }

    for (const neighborId of adjacency.get(current.id) ?? []) {
      if (seen.has(neighborId)) {
        continue;
      }

      seen.add(neighborId);
      queue.push({ id: neighborId, parent: current.id });
    }

    frames.push(
      toFrame({
        activeEdgeId,
        currentNodeId: current.id,
        mode: 'bfs',
        order,
        structure: queue.map((item) => item.id),
        step: frames.length,
        traversalEdgeIds,
      }),
    );
  }

  return frames;
}

import cytoscape from 'cytoscape';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { SectionHeading } from '../components/SectionHeading.jsx';
import {
  buildGraphTraversal,
  graphExplorerEdges,
  graphExplorerModes,
  graphExplorerNodes,
} from '../lib/graphExplorer.js';

const modeCopy = {
  bfs: {
    focus: 'BFS is useful when distance from the start matters, such as levels, shortest unweighted paths, or spread over time.',
    structure: 'Queue means first in, first out. Older waiting nodes get handled first.',
  },
  dfs: {
    focus: 'DFS is useful when a path matters, such as recursion, backtracking, connected components, or subtree work.',
    structure: 'Stack means last in, first out. The newest branch keeps going first.',
  },
};

const baseElements = [
  ...graphExplorerNodes.map((node) => ({ data: { id: node.id, label: node.label } })),
  ...graphExplorerEdges.map((edge) => ({
    data: {
      id: edge.id,
      source: edge.source,
      target: edge.target,
    },
  })),
];

const stylesheet = [
  {
    selector: 'node',
    style: {
      'background-color': '#ffffff',
      'border-color': 'rgba(45, 58, 49, 0.18)',
      'border-width': 2,
      color: '#152019',
      'font-family': 'Avenir Next, Segoe UI, sans-serif',
      'font-size': 14,
      'font-weight': 700,
      height: 54,
      label: 'data(label)',
      'text-valign': 'center',
      width: 54,
    },
  },
  {
    selector: 'edge',
    style: {
      'curve-style': 'bezier',
      'line-color': 'rgba(45, 58, 49, 0.2)',
      'target-arrow-color': 'rgba(45, 58, 49, 0.2)',
      width: 2,
    },
  },
  {
    selector: '.is-visited',
    style: {
      'background-color': 'rgba(47, 115, 80, 0.18)',
      'border-color': 'rgba(47, 115, 80, 0.55)',
      color: '#214f38',
    },
  },
  {
    selector: '.is-frontier',
    style: {
      'background-color': '#f8f5ec',
      'border-color': 'rgba(181, 129, 52, 0.45)',
      color: '#6f4b14',
    },
  },
  {
    selector: '.is-current',
    style: {
      'background-color': '#2f7350',
      'border-color': '#2f7350',
      color: '#ffffff',
      'font-size': 16,
      height: 64,
      width: 64,
    },
  },
  {
    selector: '.is-traversed',
    style: {
      'line-color': 'rgba(47, 115, 80, 0.55)',
      width: 4,
    },
  },
  {
    selector: '.is-active-edge',
    style: {
      'line-color': '#2f7350',
      width: 5,
    },
  },
];

function getMode(modeId) {
  return graphExplorerModes.find((mode) => mode.id === modeId) ?? graphExplorerModes[0];
}

function GraphCanvas({ frame, mode, onSelectStartNode }) {
  const containerRef = useRef(null);
  const cyRef = useRef(null);
  const onSelectStartNodeRef = useRef(onSelectStartNode);

  useEffect(() => {
    onSelectStartNodeRef.current = onSelectStartNode;
  }, [onSelectStartNode]);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const cy = cytoscape({
      boxSelectionEnabled: false,
      container: containerRef.current,
      elements: baseElements,
      layout: {
        directed: false,
        name: 'breadthfirst',
        padding: 24,
        roots: '#A',
        spacingFactor: 1.15,
      },
      maxZoom: 1.35,
      minZoom: 0.7,
      style: stylesheet,
      userPanningEnabled: true,
      userZoomingEnabled: true,
    });

    cy.on('tap', 'node', (event) => {
      onSelectStartNodeRef.current(event.target.id());
    });

    cyRef.current = cy;

    return () => {
      cy.destroy();
      cyRef.current = null;
    };
  }, []);

  useEffect(() => {
    const cy = cyRef.current;

    if (!cy || !frame) {
      return;
    }

    cy.elements().removeClass('is-current is-visited is-frontier is-traversed is-active-edge');

    for (const nodeId of frame.visitedNodeIds) {
      cy.getElementById(nodeId).addClass('is-visited');
    }

    for (const nodeId of frame.structure) {
      cy.getElementById(nodeId).addClass('is-frontier');
    }

    for (const edgeId of frame.traversalEdgeIds) {
      cy.getElementById(edgeId).addClass('is-traversed');
    }

    if (frame.activeEdgeId) {
      cy.getElementById(frame.activeEdgeId).addClass('is-active-edge');
    }

    cy.getElementById(frame.currentNodeId).addClass('is-current');
  }, [frame, mode]);

  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-line/70 bg-white/75">
      <div className="h-[22rem] sm:h-[30rem]" ref={containerRef} />
    </div>
  );
}

function StepButton({ active, children, onClick }) {
  return (
    <button
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
        active
          ? 'bg-accent text-white'
          : 'border border-line/80 bg-white/70 text-ink hover:border-accent/40'
      }`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

export function GraphExplorerPage() {
  const [mode, setMode] = useState('bfs');
  const [startNodeId, setStartNodeId] = useState('A');
  const [stepIndex, setStepIndex] = useState(0);
  const frames = buildGraphTraversal({ mode, startNodeId });
  const currentFrame = frames[Math.min(stepIndex, frames.length - 1)] ?? null;
  const selectedMode = getMode(mode);
  const selectedCopy = modeCopy[mode];

  function handleModeChange(nextMode) {
    setMode(nextMode);
    setStepIndex(0);
  }

  function handleStartNodeChange(nextNodeId) {
    setStartNodeId(nextNodeId);
    setStepIndex(0);
  }

  function handlePrevious() {
    setStepIndex((current) => Math.max(current - 1, 0));
  }

  function handleNext() {
    setStepIndex((current) => Math.min(current + 1, frames.length - 1));
  }

  function handleRestart() {
    setStepIndex(0);
  }

  return (
    <div className="space-y-6">
      <SectionHeading
        actions={
          <>
            <Link
              className="inline-flex items-center rounded-full border border-line/80 bg-white/70 px-4 py-2 text-sm font-medium text-ink transition hover:border-accent/40"
              to="/app/topics/trees-traversals"
            >
              Trees path
            </Link>
            <Link
              className="inline-flex items-center rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink"
              to="/app/lessons/bfs-layers-preview?fresh=1"
            >
              Run BFS walkthrough
            </Link>
          </>
        }
        description="Explore how graph traversal order changes when the algorithm uses a queue or a stack."
        eyebrow="Graph Explorer"
        title="See relationships before solving graph problems."
      />

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="app-panel p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                Cytoscape graph lab
              </p>
              <h3 className="mt-3 font-display text-3xl tracking-[-0.04em] text-ink">
                {selectedMode.label} from node {startNodeId}
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
                {selectedMode.description} Tap a node or use the controls to change the start.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {graphExplorerModes.map((item) => (
                <StepButton
                  active={mode === item.id}
                  key={item.id}
                  onClick={() => handleModeChange(item.id)}
                >
                  {item.label}
                </StepButton>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <GraphCanvas
              frame={currentFrame}
              mode={mode}
              onSelectStartNode={handleStartNodeChange}
            />
          </div>

          <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {graphExplorerNodes.map((node) => (
                <StepButton
                  active={startNodeId === node.id}
                  key={node.id}
                  onClick={() => handleStartNodeChange(node.id)}
                >
                  Start {node.id}
                </StepButton>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                className="rounded-full border border-line/80 bg-white/70 px-4 py-2 text-sm font-medium text-ink transition hover:border-accent/40 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={stepIndex === 0}
                onClick={handlePrevious}
                type="button"
              >
                Previous
              </button>
              <button
                className="rounded-full border border-line/80 bg-white/70 px-4 py-2 text-sm font-medium text-ink transition hover:border-accent/40"
                onClick={handleRestart}
                type="button"
              >
                Restart
              </button>
              <button
                className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:bg-muted"
                disabled={stepIndex >= frames.length - 1}
                onClick={handleNext}
                type="button"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="app-panel p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              Step {currentFrame ? currentFrame.step + 1 : 0} of {frames.length}
            </p>
            <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-ink">
              Current node: {currentFrame?.currentNodeId ?? 'None'}
            </h3>
            <p className="mt-3 text-sm leading-7 text-muted">{currentFrame?.explanation}</p>
            <div className="mt-5 rounded-[1.1rem] border border-line/70 bg-white/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                {selectedMode.structureLabel}
              </p>
              <p className="mt-2 text-sm font-semibold text-ink">{currentFrame?.status}</p>
            </div>
          </div>

          <div className="app-panel p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Traversal order</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {currentFrame?.order.map((nodeId, index) => (
                <span
                  className="rounded-full bg-accent/10 px-3 py-2 text-xs font-semibold text-accent"
                  key={`${nodeId}-${index}`}
                >
                  {index + 1}. {nodeId}
                </span>
              ))}
            </div>
          </div>

          <div className="app-panel p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Beginner lens</p>
            <p className="mt-3 text-sm leading-7 text-muted">{selectedCopy.focus}</p>
            <p className="mt-4 rounded-[1.1rem] border border-line/70 bg-white/70 p-4 text-sm leading-6 text-ink">
              {selectedCopy.structure}
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}

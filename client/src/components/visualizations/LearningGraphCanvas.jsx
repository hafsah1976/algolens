import { Background, ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const nodeStyles = {
  active: {
    background: '#2f7350',
    border: '1px solid #2f7350',
    boxShadow: '0 18px 45px rgba(47, 115, 80, 0.2)',
    color: '#ffffff',
  },
  future: {
    background: '#ffffff',
    border: '1px solid rgba(45, 58, 49, 0.16)',
    color: '#162116',
  },
  muted: {
    background: 'rgba(244, 241, 234, 0.78)',
    border: '1px dashed rgba(45, 58, 49, 0.22)',
    color: '#667369',
  },
  path: {
    background: 'rgba(47, 115, 80, 0.12)',
    border: '1px solid rgba(47, 115, 80, 0.45)',
    color: '#2f7350',
  },
  queued: {
    background: 'rgba(255, 255, 255, 0.92)',
    border: '1px solid rgba(47, 115, 80, 0.3)',
    color: '#2f7350',
  },
  visited: {
    background: 'rgba(47, 115, 80, 0.18)',
    border: '1px solid rgba(47, 115, 80, 0.55)',
    color: '#214f38',
  },
};

const baseNodeStyle = {
  alignItems: 'center',
  borderRadius: 999,
  display: 'flex',
  fontSize: 14,
  fontWeight: 700,
  height: 54,
  justifyContent: 'center',
  padding: 0,
  width: 54,
};

function toFlowNode(node) {
  const status = node.status ?? 'future';

  return {
    ...node,
    data: { label: node.label },
    draggable: false,
    selectable: false,
    sourcePosition: node.sourcePosition,
    style: {
      ...baseNodeStyle,
      ...(nodeStyles[status] ?? nodeStyles.future),
      ...(node.style ?? {}),
    },
    targetPosition: node.targetPosition,
    type: 'default',
  };
}

function toFlowEdge(edge) {
  const active = edge.status === 'active';

  return {
    ...edge,
    animated: active,
    selectable: false,
    style: {
      stroke: active ? '#2f7350' : 'rgba(45, 58, 49, 0.22)',
      strokeWidth: active ? 3 : 2,
      ...(edge.style ?? {}),
    },
  };
}

export function LearningGraphCanvas({ edges, legend, nodes }) {
  const flowNodes = nodes.map(toFlowNode);
  const flowEdges = edges.map(toFlowEdge);

  return (
    <div className="overflow-hidden rounded-[1.35rem] border border-line/70 bg-white/75">
      <div className="h-[24rem] sm:h-[28rem]">
        <ReactFlow
          edges={flowEdges}
          elementsSelectable={false}
          fitView
          fitViewOptions={{ maxZoom: 1.1, padding: 0.2 }}
          nodes={flowNodes}
          nodesConnectable={false}
          nodesDraggable={false}
          panOnDrag={false}
          preventScrolling={false}
          proOptions={{ hideAttribution: true }}
          zoomOnDoubleClick={false}
          zoomOnPinch={false}
          zoomOnScroll={false}
        >
          <Background color="rgba(47, 115, 80, 0.12)" gap={22} size={1} />
        </ReactFlow>
      </div>

      {legend?.length ? (
        <div className="flex flex-wrap gap-2 border-t border-line/70 bg-warm/45 p-4">
          {legend.map((item) => (
            <span
              className="inline-flex items-center gap-2 rounded-full border border-line/70 bg-white/80 px-3 py-1 text-xs font-semibold text-muted"
              key={item.label}
            >
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: item.color }}
              />
              {item.label}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

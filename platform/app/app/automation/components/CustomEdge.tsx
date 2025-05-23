import { BaseEdge, EdgeLabelRenderer, EdgeProps, getBezierPath } from 'reactflow';

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={{ stroke: '#4a5568', strokeWidth: 2 }} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            // Everything inside EdgeLabelRenderer has no pointer events by default
            // We need to turn them on for buttons
            pointerEvents: 'all',
          }}
          className="nodrag nopan bg-[#1a1a2e] text-gray-300 px-2 py-1 rounded-md border border-gray-800"
        >
          {data?.label || 'Add label'}
        </div>
      </EdgeLabelRenderer>
    </>
  );
} 
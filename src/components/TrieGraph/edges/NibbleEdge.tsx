import React from 'react';
import { BaseEdge, EdgeLabelRenderer, getBezierPath, type EdgeProps } from '@xyflow/react';
import { edgeColors } from '../../../styles/theme';

export function NibbleEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  style,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const label = data?.label as string | undefined;
  const tooltip = label !== undefined
    ? `Branch child[0x${label}] = nibble ${parseInt(label, 16)}`
    : undefined;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: edgeColors.default,
          strokeWidth: 1.5,
          ...style,
        }}
      />
      {label !== undefined && (
        <EdgeLabelRenderer>
          <div
            className="nodrag nopan nibble-label-tooltip"
            data-tooltip={tooltip}
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              background: edgeColors.nibbleBg,
              color: edgeColors.nibbleLabel,
              padding: '1px 5px',
              borderRadius: 4,
              fontSize: 10,
              fontWeight: 700,
              fontFamily: 'monospace',
              border: '1px solid #E2E8F0',
              pointerEvents: 'all',
              cursor: 'default',
            }}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

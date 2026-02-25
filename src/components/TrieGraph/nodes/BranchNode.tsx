import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { nodeColors } from '../../../styles/theme';
import { truncateHex } from '../../../services/ethereum';

const SLOTS = Array.from({ length: 16 }, (_, i) => i);
const c = nodeColors.branch;

export function BranchNode({ data }: { data: any }) {
  const activeSlots: number[] = data.activeSlots || [];
  const activeSet = new Set(activeSlots);

  return (
    <div style={{
      background: c.bg,
      border: `2px solid ${c.border}`,
      borderRadius: 8,
      padding: '8px 10px',
      fontSize: 12,
      minWidth: 240,
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <Handle type="target" position={Position.Top} style={{ background: c.border }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        <span style={{
          background: c.border, color: '#fff', borderRadius: 4,
          padding: '1px 6px', fontSize: 10, fontWeight: 600,
        }}>Branch</span>
        {data.hash && (
          <span style={{ color: '#94A3B8', fontSize: 10, fontFamily: 'monospace' }}>
            {truncateHex('0x' + data.hash, 6)}
          </span>
        )}
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(16, 1fr)',
        gap: 2, marginTop: 4,
      }}>
        {SLOTS.map(i => (
          <div key={i} style={{
            width: 13, height: 18,
            background: activeSet.has(i) ? c.slotActive : c.slotInactive,
            color: activeSet.has(i) ? '#fff' : '#94A3B8',
            borderRadius: 2,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 8, fontWeight: 600, fontFamily: 'monospace',
          }}>
            {i.toString(16)}
          </div>
        ))}
      </div>

      {data.path && (
        <div style={{ marginTop: 4, fontSize: 10, color: '#94A3B8', fontFamily: 'monospace' }}>
          path: {data.path || '(root)'}
        </div>
      )}

      <Handle type="source" position={Position.Bottom} style={{ background: c.border }} />
    </div>
  );
}

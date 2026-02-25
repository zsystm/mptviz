import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { nodeColors } from '../../../styles/theme';

const c = nodeColors.hash;

export function HashNode({ data }: { data: any }) {
  const hash = data.hash || '';
  const display = hash.length > 16 ? `${hash.slice(0, 10)}...${hash.slice(-6)}` : hash;

  return (
    <div style={{
      background: c.bg,
      border: `2px solid ${c.border}`,
      borderRadius: 8,
      padding: '6px 10px',
      fontSize: 11,
      minWidth: 160,
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <Handle type="target" position={Position.Top} style={{ background: c.border }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{
          background: c.border, color: '#fff', borderRadius: 4,
          padding: '1px 6px', fontSize: 10, fontWeight: 600,
        }}>Hash</span>
      </div>

      <div style={{
        marginTop: 4,
        fontFamily: 'monospace',
        fontSize: 10,
        color: c.text,
        wordBreak: 'break-all',
      }}>
        {display}
      </div>

      <Handle type="source" position={Position.Bottom} style={{ background: c.border }} />
    </div>
  );
}

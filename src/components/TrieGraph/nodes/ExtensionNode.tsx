import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { nodeColors } from '../../../styles/theme';

const c = nodeColors.extension;

export function ExtensionNode({ data }: { data: any }) {
  const nibbles = data.nibbleKey ? data.nibbleKey.split('') : [];

  return (
    <div style={{
      background: c.bg,
      border: `2px solid ${c.border}`,
      borderRadius: 8,
      padding: '8px 10px',
      fontSize: 12,
      minWidth: 180,
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <Handle type="target" position={Position.Top} style={{ background: c.border }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        <span style={{
          background: c.border, color: '#fff', borderRadius: 4,
          padding: '1px 6px', fontSize: 10, fontWeight: 600,
        }}>Extension</span>
        <span style={{ color: '#94A3B8', fontSize: 10 }}>
          {nibbles.length} nibble{nibbles.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {nibbles.map((n: string, i: number) => (
          <span key={i} style={{
            background: c.nibbleBg,
            border: `1px solid ${c.border}`,
            borderRadius: 3,
            padding: '1px 4px',
            fontSize: 11,
            fontFamily: 'monospace',
            fontWeight: 600,
            color: c.text,
          }}>
            {n}
          </span>
        ))}
      </div>

      <Handle type="source" position={Position.Bottom} style={{ background: c.border }} />
    </div>
  );
}

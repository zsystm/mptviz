import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { nodeColors } from '../../../styles/theme';

const c = nodeColors.leaf;

export function LeafNode({ data }: { data: any }) {
  const nibbles = data.nibbleKey ? data.nibbleKey.split('') : [];
  const decoded = data.decodedValue;

  return (
    <div style={{
      background: c.bg,
      border: `2px solid ${c.border}`,
      borderRadius: 8,
      padding: '8px 10px',
      fontSize: 12,
      minWidth: 200,
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <Handle type="target" position={Position.Top} style={{ background: c.border }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
        <span style={{
          background: c.border, color: '#fff', borderRadius: 4,
          padding: '1px 6px', fontSize: 10, fontWeight: 600,
        }}>Leaf</span>
        <span style={{
          background: '#FEF9C3', color: '#854D0E', borderRadius: 3,
          padding: '0px 4px', fontSize: 9, fontWeight: 500,
        }}>+T</span>
      </div>

      {nibbles.length > 0 && (
        <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap', marginBottom: 4 }}>
          {nibbles.map((n: string, i: number) => (
            <span key={i} style={{
              background: c.valueBg,
              border: `1px solid ${c.border}`,
              borderRadius: 3,
              padding: '1px 4px',
              fontSize: 10,
              fontFamily: 'monospace',
              fontWeight: 600,
              color: c.text,
            }}>
              {n}
            </span>
          ))}
        </div>
      )}

      {decoded && (
        <div style={{
          background: c.valueBg,
          borderRadius: 4,
          padding: '4px 6px',
          marginTop: 2,
          fontSize: 10,
          fontFamily: 'monospace',
        }}>
          <div style={{ color: c.text }}>
            <strong>Nonce:</strong> {decoded.nonce}
          </div>
          <div style={{ color: c.text }}>
            <strong>Balance:</strong> {decoded.balance}
          </div>
        </div>
      )}

      <Handle type="source" position={Position.Bottom} style={{ background: c.border }} />
    </div>
  );
}

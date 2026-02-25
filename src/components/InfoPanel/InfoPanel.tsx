import React from 'react';
import { TrieNodeData } from '../../types/trie';
import { nodeColors } from '../../styles/theme';

interface InfoPanelProps {
  node: TrieNodeData | null;
  onClose: () => void;
}

const typeLabels: Record<string, { label: string; color: string }> = {
  branch: { label: 'Branch', color: nodeColors.branch.border },
  extension: { label: 'Extension', color: nodeColors.extension.border },
  leaf: { label: 'Leaf', color: nodeColors.leaf.border },
  hash: { label: 'Hash', color: nodeColors.hash.border },
  value: { label: 'Value', color: nodeColors.value.border },
};

export function InfoPanel({ node, onClose }: InfoPanelProps) {
  if (!node) return null;

  const info = typeLabels[node.nodeType] || { label: node.nodeType, color: '#94A3B8' };
  const pathNibbles = node.path ? node.path.split('') : [];
  const keyNibbles = node.nibbleKey ? node.nibbleKey.split('') : [];

  return (
    <div style={{
      width: 340,
      minWidth: 340,
      height: '100%',
      background: '#FAFBFC',
      borderLeft: '1px solid #E2E8F0',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid #E2E8F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            background: info.color,
            color: '#fff',
            padding: '2px 8px',
            borderRadius: 4,
            fontSize: 11,
            fontWeight: 600,
          }}>
            {info.label}
          </span>
          <span style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'monospace' }}>
            {node.id.slice(0, 8)}
          </span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 18,
            color: '#94A3B8',
            padding: '0 4px',
            lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
        {/* Full path from root */}
        {pathNibbles.length > 0 && (
          <Section title="Full Path (from root)">
            <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {pathNibbles.map((n, i) => (
                <NibbleBadge key={i} value={n} color={info.color} />
              ))}
            </div>
            <div style={{ marginTop: 4, fontSize: 10, color: '#94A3B8', fontFamily: 'monospace' }}>
              {pathNibbles.length} nibbles = {Math.ceil(pathNibbles.length / 2)} bytes
            </div>
          </Section>
        )}

        {/* Nibble key segment (extension/leaf) */}
        {keyNibbles.length > 0 && (
          <Section title="Node Key (nibble segment)">
            <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {keyNibbles.map((n, i) => (
                <NibbleBadge key={i} value={n} color={info.color} />
              ))}
            </div>
            {node.hasTerm && (
              <div style={{
                marginTop: 4,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                background: '#FEF9C3',
                color: '#854D0E',
                padding: '2px 6px',
                borderRadius: 3,
                fontSize: 9,
                fontWeight: 500,
              }}>
                +T (terminator flag = leaf node)
              </div>
            )}
          </Section>
        )}

        {/* Hex Prefix Encoding explanation */}
        {(node.nodeType === 'extension' || node.nodeType === 'leaf') && keyNibbles.length > 0 && (
          <Section title="Hex Prefix Encoding">
            <HexPrefixExplain nodeType={node.nodeType} nibbles={keyNibbles} hasTerm={node.hasTerm} />
          </Section>
        )}

        {/* Branch active slots */}
        {node.nodeType === 'branch' && node.activeSlots && (
          <Section title="Active Slots">
            <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              {Array.from({ length: 16 }, (_, i) => (
                <div key={i} style={{
                  width: 22,
                  height: 22,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 3,
                  fontSize: 10,
                  fontWeight: 600,
                  fontFamily: 'monospace',
                  background: node.activeSlots!.includes(i) ? nodeColors.branch.slotActive : '#F1F5F9',
                  color: node.activeSlots!.includes(i) ? '#fff' : '#CBD5E1',
                }}>
                  {i.toString(16)}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 4, fontSize: 10, color: '#94A3B8' }}>
              {node.activeSlots.length} of 16 slots occupied
            </div>
          </Section>
        )}

        {/* Decoded account (leaf) */}
        {node.decodedValue && (
          <Section title="Decoded StateAccount">
            <div style={{
              background: '#fff',
              border: '1px solid #E2E8F0',
              borderRadius: 6,
              padding: '8px 10px',
              fontSize: 11,
              fontFamily: 'monospace',
            }}>
              <Row label="Nonce" value={String(node.decodedValue.nonce)} />
              <Row label="Balance" value={node.decodedValue.balance} />
              {node.decodedValue.root && (
                <Row label="StorageRoot" value={truncate(node.decodedValue.root)} />
              )}
              {node.decodedValue.codeHash && (
                <Row label="CodeHash" value={truncate(node.decodedValue.codeHash)} />
              )}
            </div>
          </Section>
        )}

        {/* Hash value */}
        {node.hash && (
          <Section title="Node Hash">
            <div style={{
              background: '#fff',
              border: '1px solid #E2E8F0',
              borderRadius: 6,
              padding: '8px 10px',
              fontSize: 10,
              fontFamily: 'monospace',
              wordBreak: 'break-all',
              color: '#475569',
            }}>
              {node.hash}
            </div>
          </Section>
        )}

        {/* Raw value */}
        {node.value && (
          <Section title="Raw Value (hex)">
            <div style={{
              background: '#fff',
              border: '1px solid #E2E8F0',
              borderRadius: 6,
              padding: '8px 10px',
              fontSize: 9,
              fontFamily: 'monospace',
              wordBreak: 'break-all',
              color: '#64748B',
              maxHeight: 80,
              overflowY: 'auto',
            }}>
              {node.value}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{
        fontSize: 10,
        fontWeight: 600,
        color: '#475569',
        marginBottom: 6,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function NibbleBadge({ value, color }: { value: string; color: string }) {
  return (
    <span style={{
      background: color + '18',
      border: `1px solid ${color}40`,
      borderRadius: 3,
      padding: '1px 5px',
      fontSize: 11,
      fontFamily: 'monospace',
      fontWeight: 600,
      color: color,
    }}>
      {value}
    </span>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
      <span style={{ color: '#94A3B8', fontSize: 10 }}>{label}</span>
      <span style={{ color: '#1E293B', fontWeight: 500, fontSize: 10 }}>{value}</span>
    </div>
  );
}

function HexPrefixExplain({ nodeType, nibbles, hasTerm }: { nodeType: string; nibbles: string[]; hasTerm: boolean }) {
  const isLeaf = nodeType === 'leaf';
  const isOdd = nibbles.length % 2 !== 0;
  const flagBits = (isLeaf ? 2 : 0) + (isOdd ? 1 : 0);
  const prefixHex = flagBits.toString(16);

  // Build compact encoding representation
  const remaining = isOdd ? nibbles.slice(1) : nibbles;
  const pairs: string[] = [];
  for (let i = 0; i < remaining.length; i += 2) {
    pairs.push((remaining[i] || '0') + (remaining[i + 1] || '0'));
  }
  const firstByte = prefixHex + (isOdd ? nibbles[0] : '0');
  const compactHex = [firstByte, ...pairs].join(' ');

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #E2E8F0',
      borderRadius: 6,
      padding: '8px 10px',
      fontSize: 10,
      lineHeight: 1.6,
      color: '#475569',
    }}>
      <div><strong>Type:</strong> {isLeaf ? 'Leaf' : 'Extension'} ({isLeaf ? 'terminator=1' : 'terminator=0'})</div>
      <div><strong>Length:</strong> {nibbles.length} nibbles ({isOdd ? 'odd' : 'even'})</div>
      <div><strong>Flag:</strong> 0x{prefixHex} = {isLeaf ? '2' : '0'} (leaf) + {isOdd ? '1' : '0'} (odd)</div>
      <div style={{ marginTop: 4, padding: '4px 6px', background: '#F8FAFC', borderRadius: 3, fontFamily: 'monospace', fontSize: 9, wordBreak: 'break-all' }}>
        compact: [{compactHex}]
      </div>
    </div>
  );
}

function truncate(hex: string, chars = 10): string {
  if (hex.length <= chars * 2) return hex;
  return `${hex.slice(0, chars)}...${hex.slice(-6)}`;
}

import React, { useState, useCallback } from 'react';
import { KeyInput } from './KeyInput';
import { ValueInput } from './ValueInput';
import { OperationRecord, TrieMetadata } from '../../types/trie';
import { generateRandomAddress, generateRandomAccount } from '../../services/ethereum';
import { nodeColors } from '../../styles/theme';

interface ControlPanelProps {
  onInsert: (key: string, value: string) => void;
  onDelete: (key: string) => void;
  onReset: () => void;
  operations: OperationRecord[];
  metadata: TrieMetadata | null;
  loading: boolean;
  error: string | null;
}

const LEGEND_ITEMS = [
  { type: 'Branch', color: nodeColors.branch.border, desc: '16-slot branching node' },
  { type: 'Extension', color: nodeColors.extension.border, desc: 'Shared nibble prefix' },
  { type: 'Leaf', color: nodeColors.leaf.border, desc: 'Account data terminal' },
  { type: 'Hash', color: nodeColors.hash.border, desc: 'Collapsed hash reference' },
];

export function ControlPanel({
  onInsert, onDelete, onReset, operations, metadata, loading, error,
}: ControlPanelProps) {
  const [address, setAddress] = useState('');
  const [nonce, setNonce] = useState('1');
  const [balance, setBalance] = useState('1000');
  const [action, setAction] = useState<'insert' | 'delete'>('insert');

  const handleRandomize = useCallback(() => {
    const addr = generateRandomAddress();
    const acct = generateRandomAccount();
    setAddress(addr);
    setNonce(String(acct.Nonce));
    setBalance(String(acct.Balance));
  }, []);

  const handleExecute = useCallback(() => {
    if (!address) return;
    if (action === 'insert') {
      const value = JSON.stringify({ Nonce: parseInt(nonce) || 0, Balance: parseInt(balance) || 0 });
      onInsert(address, value);
    } else {
      onDelete(address);
    }
  }, [address, nonce, balance, action, onInsert, onDelete]);

  return (
    <div style={{
      width: 320,
      minWidth: 320,
      height: '100%',
      background: '#FAFBFC',
      borderRight: '1px solid #E2E8F0',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 16px 12px',
        borderBottom: '1px solid #E2E8F0',
      }}>
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#1E293B' }}>
          MPT Simulator
        </h2>
        <p style={{ margin: '4px 0 0', fontSize: 11, color: '#94A3B8' }}>
          Merkle Patricia Trie · go-ethereum compatible
        </p>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
        {/* Action toggle */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
          {(['insert', 'delete'] as const).map(a => (
            <button
              key={a}
              onClick={() => setAction(a)}
              style={{
                flex: 1,
                padding: '6px 0',
                border: '1px solid',
                borderColor: action === a ? '#6366F1' : '#E2E8F0',
                background: action === a ? '#EEF2FF' : '#fff',
                color: action === a ? '#4338CA' : '#64748B',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {a === 'insert' ? 'Insert' : 'Delete'}
            </button>
          ))}
        </div>

        {/* Key Input */}
        <KeyInput address={address} onAddressChange={setAddress} />

        {/* Value Input (only for insert) */}
        {action === 'insert' && (
          <ValueInput
            nonce={nonce}
            balance={balance}
            onNonceChange={setNonce}
            onBalanceChange={setBalance}
          />
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button
            onClick={handleExecute}
            disabled={loading || !address}
            style={{
              flex: 1,
              padding: '8px 0',
              background: loading ? '#94A3B8' : '#6366F1',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Processing...' : action === 'insert' ? 'Insert' : 'Delete'}
          </button>
          <button
            onClick={handleRandomize}
            style={{
              padding: '8px 12px',
              background: '#fff',
              color: '#475569',
              border: '1px solid #E2E8F0',
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Random
          </button>
        </div>

        <button
          onClick={onReset}
          style={{
            width: '100%',
            padding: '6px 0',
            marginTop: 8,
            background: 'transparent',
            color: '#EF4444',
            border: '1px solid #FECACA',
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Reset Trie
        </button>

        {error && (
          <div style={{
            marginTop: 8,
            padding: '6px 10px',
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: 6,
            fontSize: 11,
            color: '#DC2626',
          }}>
            {error}
          </div>
        )}

        {/* Stats */}
        {metadata && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#475569', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Trie Stats
            </div>
            <div style={{
              background: '#fff',
              border: '1px solid #E2E8F0',
              borderRadius: 6,
              padding: '8px 10px',
              fontSize: 11,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '4px 12px',
            }}>
              <span style={{ color: '#94A3B8' }}>Nodes:</span>
              <span style={{ fontWeight: 600, color: '#1E293B' }}>{metadata.nodeCount}</span>
              <span style={{ color: '#94A3B8' }}>Branch:</span>
              <span style={{ fontWeight: 600, color: nodeColors.branch.border }}>{metadata.branchCount}</span>
              <span style={{ color: '#94A3B8' }}>Extension:</span>
              <span style={{ fontWeight: 600, color: nodeColors.extension.border }}>{metadata.extensionCount}</span>
              <span style={{ color: '#94A3B8' }}>Leaf:</span>
              <span style={{ fontWeight: 600, color: nodeColors.leaf.border }}>{metadata.leafCount}</span>
              <span style={{ color: '#94A3B8' }}>Depth:</span>
              <span style={{ fontWeight: 600, color: '#1E293B' }}>{metadata.depth}</span>
              {metadata.rootHash && (
                <>
                  <span style={{ color: '#94A3B8' }}>Root:</span>
                  <span style={{ fontWeight: 500, color: '#64748B', fontFamily: 'monospace', fontSize: 9 }}>
                    {metadata.rootHash.slice(0, 10)}...
                  </span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Operation Log */}
        {operations.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#475569', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Operations ({operations.length})
            </div>
            <div style={{
              background: '#fff',
              border: '1px solid #E2E8F0',
              borderRadius: 6,
              maxHeight: 200,
              overflowY: 'auto',
            }}>
              {operations.map((op, i) => (
                <div key={i} style={{
                  padding: '6px 10px',
                  borderBottom: i < operations.length - 1 ? '1px solid #F1F5F9' : 'none',
                  fontSize: 10,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{
                      background: op.action === 'insert' ? '#DCFCE7' : '#FEE2E2',
                      color: op.action === 'insert' ? '#166534' : '#991B1B',
                      padding: '0 4px',
                      borderRadius: 3,
                      fontSize: 9,
                      fontWeight: 600,
                    }}>
                      #{op.step} {op.action.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ marginTop: 2, fontFamily: 'monospace', fontSize: 9, color: '#64748B' }}>
                    addr: {op.originalKey.slice(0, 10)}...{op.originalKey.slice(-4)}
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#94A3B8' }}>
                    keccak: {op.hashedKey.slice(0, 10)}...{op.hashedKey.slice(-4)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Legend */}
        <div style={{ marginTop: 16, paddingBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#475569', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Node Types
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {LEGEND_ITEMS.map(item => (
              <div key={item.type} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '4px 0', fontSize: 11,
              }}>
                <span style={{
                  display: 'inline-block',
                  width: 10, height: 10,
                  borderRadius: 2,
                  background: item.color,
                }} />
                <span style={{ fontWeight: 600, color: '#334155', minWidth: 65 }}>{item.type}</span>
                <span style={{ color: '#94A3B8', fontSize: 10 }}>{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

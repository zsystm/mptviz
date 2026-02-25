import React, { useMemo } from 'react';
import { keccak256Hex } from '../../services/ethereum';

interface KeyInputProps {
  address: string;
  onAddressChange: (value: string) => void;
}

export function KeyInput({ address, onAddressChange }: KeyInputProps) {
  const hashed = useMemo(() => {
    if (!address || address.length < 4) return '';
    return keccak256Hex(address);
  }, [address]);

  return (
    <div style={{ marginBottom: 8 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>
        Address (Key)
      </label>
      <input
        type="text"
        value={address}
        onChange={e => onAddressChange(e.target.value)}
        placeholder="0x742d35Cc6634C0532925a3b844Bc9e..."
        style={{
          width: '100%',
          padding: '7px 10px',
          border: '1px solid #E2E8F0',
          borderRadius: 6,
          fontSize: 11,
          fontFamily: 'monospace',
          outline: 'none',
          boxSizing: 'border-box',
          transition: 'border-color 0.15s',
        }}
        onFocus={e => e.target.style.borderColor = '#6366F1'}
        onBlur={e => e.target.style.borderColor = '#E2E8F0'}
      />
      {hashed && (
        <div style={{
          marginTop: 4,
          padding: '4px 8px',
          background: '#F8FAFC',
          borderRadius: 4,
          fontSize: 9,
          fontFamily: 'monospace',
          color: '#64748B',
          wordBreak: 'break-all',
        }}>
          <span style={{ color: '#94A3B8' }}>keccak256: </span>
          {hashed}
        </div>
      )}
    </div>
  );
}

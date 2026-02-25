import React from 'react';

interface ValueInputProps {
  nonce: string;
  balance: string;
  onNonceChange: (value: string) => void;
  onBalanceChange: (value: string) => void;
}

export function ValueInput({ nonce, balance, onNonceChange, onBalanceChange }: ValueInputProps) {
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '7px 10px',
    border: '1px solid #E2E8F0',
    borderRadius: 6,
    fontSize: 11,
    fontFamily: 'monospace',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  };

  return (
    <div>
      <label style={{ fontSize: 11, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>
        Value (StateAccount)
      </label>
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: '#94A3B8', marginBottom: 2 }}>Nonce</div>
          <input
            type="number"
            value={nonce}
            onChange={e => onNonceChange(e.target.value)}
            style={inputStyle}
            min="0"
          />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: '#94A3B8', marginBottom: 2 }}>Balance</div>
          <input
            type="number"
            value={balance}
            onChange={e => onBalanceChange(e.target.value)}
            style={inputStyle}
            min="0"
          />
        </div>
      </div>
    </div>
  );
}

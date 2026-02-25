import { keccak_256 } from '@noble/hashes/sha3';
import { bytesToHex } from '@noble/hashes/utils';

export function generateRandomAddress(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(20));
  return '0x' + Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

export function generateRandomAccount(): { Nonce: number; Balance: number } {
  return {
    Nonce: Math.floor(Math.random() * 100) + 1,
    Balance: Math.floor(Math.random() * 10000) + 1,
  };
}

export function keccak256Hex(hexStr: string): string {
  const clean = hexStr.startsWith('0x') ? hexStr.slice(2) : hexStr;
  if (clean.length === 0 || clean.length % 2 !== 0) return '';
  try {
    const bytes = new Uint8Array(clean.length / 2);
    for (let i = 0; i < clean.length; i += 2) {
      bytes[i / 2] = parseInt(clean.substring(i, i + 2), 16);
    }
    return '0x' + bytesToHex(keccak_256(bytes));
  } catch {
    return '';
  }
}

export function truncateHex(hex: string, chars = 8): string {
  if (hex.length <= chars * 2 + 4) return hex;
  return `${hex.slice(0, chars + 2)}...${hex.slice(-chars)}`;
}

export function nibblesToDisplay(nibbles: string): string[] {
  return nibbles.split('');
}

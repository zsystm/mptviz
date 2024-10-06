export function generateRandomEthereumAddress(): string {
  // 20 bytes of random data
  const randomBytes = crypto.getRandomValues(new Uint8Array(20));

  // Convert to hex string and prepend '0x'
  const address = '0x' + Array.from(randomBytes)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');

  return address;
}

// StateAccount type equivalent in TypeScript
interface StateAccount {
  Nonce: number;        // Equivalent to uint64
  Balance: number;      // Simulating *uint256.Int with a number
  // TODO: Handle contract account case
  // Root: string;         // Common Hash (could be a hex string or left empty)
  // CodeHash: Uint8Array; // Byte array
}

// Function to generate a random StateAccount
export function generateRandomStateAccount(): StateAccount {
  // Random values between 1 and 100 for Nonce and Balance
  const nonce = Math.floor(Math.random() * 100) + 1;
  const balance = Math.floor(Math.random() * 100) + 1;

  return {
    Nonce: nonce,
    Balance: balance,
    // TODO: Handle contract account case
    // Root: root,
    // CodeHash: codeHash
  };
}

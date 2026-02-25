export type NodeType = 'branch' | 'extension' | 'leaf' | 'hash' | 'value';

export interface DecodedAccount {
  nonce: number;
  balance: string;
  root: string;
  codeHash: string;
}

export interface TrieNodeData {
  id: string;
  nodeType: NodeType;
  path: string;
  nibbleKey?: string;
  hasTerm: boolean;
  value?: string;
  decodedValue?: DecodedAccount;
  hash?: string;
  childIndex: number;
  activeSlots?: number[];
  children: TrieNodeData[];
}

export interface OperationRecord {
  action: 'insert' | 'delete';
  originalKey: string;
  hashedKey: string;
  value?: string;
  step: number;
}

export interface TrieMetadata {
  nodeCount: number;
  branchCount: number;
  extensionCount: number;
  leafCount: number;
  hashNodeCount: number;
  depth: number;
  rootHash?: string;
}

export interface TrieResponse {
  root: TrieNodeData | null;
  operations: OperationRecord[];
  metadata: TrieMetadata;
}

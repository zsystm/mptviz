import { useState, useCallback } from 'react';
import { TrieNodeData } from '../types/trie';

export function useNodeSelection() {
  const [selectedNode, setSelectedNode] = useState<TrieNodeData | null>(null);

  const selectNode = useCallback((node: TrieNodeData | null) => {
    setSelectedNode(node);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedNode(null);
  }, []);

  return { selectedNode, selectNode, clearSelection };
}

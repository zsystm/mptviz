import { useState, useCallback } from 'react';
import { TrieResponse, TrieNodeData, OperationRecord, TrieMetadata } from '../types/trie';
import { insertKey, deleteKey, resetSession, getTrieState } from '../services/api';

export function useTrieState() {
  const [trieRoot, setTrieRoot] = useState<TrieNodeData | null>(null);
  const [operations, setOperations] = useState<OperationRecord[]>([]);
  const [metadata, setMetadata] = useState<TrieMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applyResponse = useCallback((resp: TrieResponse) => {
    setTrieRoot(resp.root);
    setOperations(resp.operations || []);
    setMetadata(resp.metadata);
    setError(null);
  }, []);

  const handleInsert = useCallback(async (key: string, value: string) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await insertKey(key, value);
      applyResponse(resp);
    } catch (e: any) {
      setError(e.message || 'Insert failed');
    } finally {
      setLoading(false);
    }
  }, [applyResponse]);

  const handleDelete = useCallback(async (key: string) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await deleteKey(key);
      applyResponse(resp);
    } catch (e: any) {
      setError(e.message || 'Delete failed');
    } finally {
      setLoading(false);
    }
  }, [applyResponse]);

  const handleReset = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await resetSession();
      setTrieRoot(null);
      setOperations([]);
      setMetadata(null);
    } catch (e: any) {
      setError(e.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLoad = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await getTrieState();
      applyResponse(resp);
    } catch {
      // No existing session, that's fine
    } finally {
      setLoading(false);
    }
  }, [applyResponse]);

  return {
    trieRoot, operations, metadata, loading, error,
    handleInsert, handleDelete, handleReset, handleLoad,
  };
}

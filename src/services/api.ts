import { TrieResponse } from '../types/trie';

const API_URL = import.meta.env.VITE_API_URL || 'https://educhain.guru/v1';

let sessionId: string | null = localStorage.getItem('sessionId');

async function ensureSession(): Promise<string> {
  if (sessionId) return sessionId;

  const response = await fetch(`${API_URL}/mpt/session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error('Failed to create session');

  const data = await response.json();
  sessionId = data.sessionId;
  localStorage.setItem('sessionId', sessionId!);
  return sessionId!;
}

export async function insertKey(key: string, value: string): Promise<TrieResponse> {
  const sid = await ensureSession();
  const params = new URLSearchParams({ sessionId: sid, key, value });
  const response = await fetch(`${API_URL}/mpt/insert?${params}`, { method: 'POST' });
  if (!response.ok) throw new Error('Failed to insert');
  return response.json();
}

export async function deleteKey(key: string): Promise<TrieResponse> {
  const sid = await ensureSession();
  const params = new URLSearchParams({ sessionId: sid, key });
  const response = await fetch(`${API_URL}/mpt/delete?${params}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Failed to delete');
  return response.json();
}

export async function getTrieState(): Promise<TrieResponse> {
  const sid = await ensureSession();
  const params = new URLSearchParams({ sessionId: sid });
  const response = await fetch(`${API_URL}/mpt/mpt?${params}`);
  if (!response.ok) throw new Error('Failed to get trie');
  return response.json();
}

export async function resetSession(): Promise<void> {
  localStorage.removeItem('sessionId');
  sessionId = null;
  await ensureSession();
}

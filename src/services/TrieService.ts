import { ensureSession } from "./Session";

const API_URL = process.env.REACT_APP_API_URL || "https://educhain.guru/v1";

export const fetchTrieData = async () => {
  const sessionID = await ensureSession();
  const response = await fetch(`${API_URL}/mpt/mpt?sessionId=${sessionID}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },      
    credentials: "include",  // Include credentials if using cookies for session handling
  });
  if (!response.ok) {
    throw new Error("Failed to fetch trie data");
  }
  const data = await response.json();
  return data;
};

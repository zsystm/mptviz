const API_URL = process.env.REACT_APP_API_URL || "https://educhain.guru/v1";

export const ensureSession = async (): Promise<string> => {
  // check if we have a session already in local storage
  let sessionId = localStorage.getItem("sessionId");
  if (!sessionId) {
    const response = await fetch(`${API_URL}/mpt/session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },      
      credentials: "include",  // Include credentials if using cookies for session handling
    });
    if (!response.ok) {
      throw new Error("Failed to create or get session");
    }
    const data = await response.json();
    sessionId = data.sessionId;
    if (!sessionId) {
      throw new Error("Session ID not found in response");
    }
    localStorage.setItem("sessionId", sessionId);
  }
  return sessionId;
};

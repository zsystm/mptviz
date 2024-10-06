import React, { useState, useEffect } from "react";
import "./App.css";
import TrieComponent from "./components/TrieComponent";
import ControlPanel from "./components/ControlPanel";
import { ensureSession } from "./services/Session";

const API_URL = process.env.REACT_APP_API_URL || "https://educhain.guru/v1";

function App() {
  const [trieData, setTrieData] = useState(null); // State to store tree data
  const [isPanelVisible, setPanelVisible] = useState(true);

  interface Log {
    action: string;
    key: string;
    value: string;
  }

  const [traceLogs, setTraceLogs] = useState<Log[]>([]); // State to store logs

  const handleExecute = async (action: string, key: string, value: string) => {
    try {
      const sessionID = await ensureSession();
      const queryParams = new URLSearchParams({
        action,
        sessionId: sessionID,
        key: key,
        ...(action !== "delete" && { value: value }), // we don't need value for delete
      }).toString();

      let method = "GET";
      let url = "";
      switch (action) {
        case "insertOrUpdate":
          method = "POST";
          url = `${API_URL}/mpt/insert?${queryParams}`;
          break;
        case "delete":
          method = "DELETE";
          url = `${API_URL}/v1/mpt/delete?${queryParams}`;
          break;
      }
      const response = await fetch(url, {
        method: method,
      });

      if (!response.ok) {
        throw new Error("Failed to execute action");
      }

      const data = await response.json();
      setTrieData(data);
      setTraceLogs([...traceLogs, { action, key, value }]);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleResetTrie = async () => {
    try {
      // delete session, trie data and logs
      localStorage.removeItem("sessionId");
      localStorage.removeItem("trieData");
      localStorage.removeItem("traceLogs");
      // reset states to initial values
      setTrieData(null);
      setTraceLogs([]);

      // get new session and trie data
      await ensureSession();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (trieData) {
      localStorage.setItem("trieData", JSON.stringify(trieData));
    }
  }, [trieData]);

  useEffect(() => {
    const savedData = localStorage.getItem("trieData");
    if (savedData) {
      setTrieData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    const savedLogs = localStorage.getItem("traceLogs");
    if (savedLogs) {
      console.log("setTraceLogs", JSON.parse(savedLogs));
      setTraceLogs(JSON.parse(savedLogs));
    }
  }, []);

  useEffect(() => {
    if (traceLogs.length > 0) {
      console.log("set traceLogs", traceLogs);
      localStorage.setItem("traceLogs", JSON.stringify(traceLogs));
    }
  }, [traceLogs]);

  return (
    <div className="App">
      <h1>MPT Simulator</h1>
      <TrieComponent trieData={trieData} isPanelVisible={isPanelVisible} />
      <ControlPanel
        isPanelVisible={isPanelVisible}
        setPanelVisible={setPanelVisible}
        traceLogs={traceLogs}
        handleRollback={() => {
          const logs = [...traceLogs];
          logs.pop();
          setTraceLogs(logs);
        }}
        handleExecute={handleExecute}
        handleResetTrie={handleResetTrie}
      />
      {/* Show Button when panel is hidden */}
      {!isPanelVisible && (
        <div className="show-bar">
          <button
            className="toggle-button"
            onClick={() => setPanelVisible(true)}
          >
            Show
          </button>
        </div>
      )}
      {/* GitHub Sponsor Section */}
      <div className="sponsor-section">
        <iframe
          src="https://github.com/sponsors/zsystm/card"
          title="Sponsor zsystm"
          height="130"
          width="450"
          style={{ border: 0 }}
        ></iframe>
      </div>
    </div>
  );
}

export default App;

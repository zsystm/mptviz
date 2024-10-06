import React, { useState } from "react";
import {
  generateRandomEthereumAddress,
  generateRandomStateAccount,
} from "../services/Eth";
import "./ControlPanel.css";

interface ControlPanelProps {
  isPanelVisible: boolean;
  setPanelVisible: (visible: boolean) => void;
  traceLogs: any[];
  handleRollback: () => void;
  handleExecute: (action: string, key: string, value: string) => void;
  handleResetTrie: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  isPanelVisible,
  setPanelVisible,
  traceLogs,
  handleRollback,
  handleExecute,
  handleResetTrie,
}) => {
  const [action, setAction] = useState("insertOrUpdate");
  const [keyValue, setKeyValue] = useState("");
  const [valueValue, setValueValue] = useState("");
  const [exampleKey, setExampleKey] = useState(generateRandomEthereumAddress());
  const [exampleValue, setExampleValue] = useState(
    generateRandomStateAccount()
  );

  const handleActionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAction(e.target.value);
    if (e.target.value === "delete") {
      setValueValue("");
    }
  };

  const handleExampleKeyClick = () => {
    setKeyValue(exampleKey);
    setExampleKey(generateRandomEthereumAddress());
  };

  const handleExampleValueClick = () => {
    setValueValue(JSON.stringify(exampleValue));
    setExampleValue(generateRandomStateAccount());
  };

  return (
    <div className={`control-panel ${isPanelVisible ? "visible" : "hidden"}`}>
      <div className="toggle-section">
        <button
          className="toggle-button"
          onClick={() => setPanelVisible(false)}
        >
          Hide
        </button>
      </div>
      <div className="control-console">
        <div className="controls-left">
          <div className="input-row">
            <div className="action">
              <label htmlFor="action">Action: </label>
              <select id="action" value={action} onChange={handleActionChange}>
                <option value="insertOrUpdate">InsertOrUpdate</option>
                <option value="delete">Delete</option>
              </select>
            </div>
            <div className="input-key">
              <label htmlFor="key-input">Key: </label>
              <input
                type="text"
                id="key-input"
                value={keyValue}
                onChange={(e) => setKeyValue(e.target.value)}
                placeholder="Enter key"
              />
            </div>
            <div className="example-key">
              <label htmlFor="key-example">E.g. </label>
              <button
                id="key-example"
                className="example-key-button"
                onClick={handleExampleKeyClick}
              >
                {exampleKey}
              </button>
            </div>
            <div className="input-value">
              <label htmlFor="value-input">Value: </label>
              <input
                type="text"
                id="value-input"
                value={valueValue}
                onChange={(e) => setValueValue(e.target.value)}
                placeholder="Enter value"
                disabled={action === "delete"}
              />
            </div>
            <div className="example-value">
              <label htmlFor="value-example">E.g. </label>
              <button
                id="value-example"
                className="example-value-button"
                onClick={handleExampleValueClick}
              >
                {JSON.stringify(exampleValue)}
              </button>
            </div>
          </div>
          <div className="button-box">
            <button
              className="execute-button"
              onClick={() => handleExecute(action, keyValue, valueValue)}
            >
              Execute
            </button>
            <button className="reset-button" onClick={() => handleResetTrie()}>
              ResetTrie
            </button>
          </div>
        </div>
        <div className="controls-right">
          <h3>trace logs</h3>
          <ul className="trace-log">
            {traceLogs.map((log, index) => (
              <li key={index} data-action={log.action}>
                [{log.action}] key: {log.key}, value: {log.value}
                {/* {index === traceLogs.length - 1 && (
                  <button onClick={handleRollback} className="rollback-button">
                    Rollback
                  </button>
                )} */}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;

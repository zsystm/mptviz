import React, { useEffect } from 'react';
import './App.css';
import { TrieGraph } from './components/TrieGraph/TrieGraph';
import { ControlPanel } from './components/ControlPanel/ControlPanel';
import { InfoPanel } from './components/InfoPanel/InfoPanel';
import { useTrieState } from './hooks/useTrieState';
import { useNodeSelection } from './hooks/useNodeSelection';

function App() {
  const {
    trieRoot, operations, metadata, loading, error,
    handleInsert, handleDelete, handleReset, handleLoad,
  } = useTrieState();

  const { selectedNode, selectNode, clearSelection } = useNodeSelection();

  useEffect(() => {
    handleLoad();
  }, [handleLoad]);

  return (
    <div className="app-layout">
      <ControlPanel
        onInsert={handleInsert}
        onDelete={handleDelete}
        onReset={handleReset}
        operations={operations}
        metadata={metadata}
        loading={loading}
        error={error}
      />

      <main className="app-canvas">
        <TrieGraph
          trieRoot={trieRoot}
          onNodeClick={selectNode}
        />
      </main>

      {selectedNode && (
        <InfoPanel
          node={selectedNode}
          onClose={clearSelection}
        />
      )}
    </div>
  );
}

export default App;

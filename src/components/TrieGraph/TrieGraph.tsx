import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  useReactFlow,
  ReactFlowProvider,
  type NodeMouseHandler,
  type Node,
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { BranchNode } from './nodes/BranchNode';
import { ExtensionNode } from './nodes/ExtensionNode';
import { LeafNode } from './nodes/LeafNode';
import { HashNode } from './nodes/HashNode';
import { NibbleEdge } from './edges/NibbleEdge';
import { useTrieLayout } from './useTrieLayout';
import { TrieNodeData } from '../../types/trie';
import { nodeColors } from '../../styles/theme';

const nodeTypes = {
  branch: BranchNode,
  extension: ExtensionNode,
  leaf: LeafNode,
  hash: HashNode,
};

const edgeTypes = {
  nibble: NibbleEdge,
};

/** Build set of ancestor node IDs from root to a given node */
function buildPathToNode(
  root: TrieNodeData | null,
  targetId: string,
): { nodeIds: Set<string>; edgeIds: Set<string> } {
  const nodeIds = new Set<string>();
  const edgeIds = new Set<string>();

  function dfs(node: TrieNodeData, path: string[]): boolean {
    if (node.id === targetId) {
      for (const id of path) nodeIds.add(id);
      nodeIds.add(node.id);
      return true;
    }
    for (const child of node.children) {
      if (dfs(child, [...path, node.id])) {
        edgeIds.add(`${node.id}-${child.id}`);
        return true;
      }
    }
    return false;
  }

  if (root) dfs(root, []);
  return { nodeIds, edgeIds };
}

interface TrieGraphInnerProps {
  trieRoot: TrieNodeData | null;
  onNodeClick?: (node: TrieNodeData) => void;
}

function TrieGraphInner({ trieRoot, onNodeClick }: TrieGraphInnerProps) {
  const { nodes, edges, nodeDataMap } = useTrieLayout(trieRoot);
  const { fitView } = useReactFlow();
  const prevNodeCount = useRef(0);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  useEffect(() => {
    if (nodes.length !== prevNodeCount.current) {
      prevNodeCount.current = nodes.length;
      setTimeout(() => fitView({ padding: 0.2, duration: 300 }), 50);
    }
  }, [nodes.length, fitView]);

  // Build highlighted path on hover
  const highlightPath = useMemo(() => {
    if (!hoveredNodeId || !trieRoot) return { nodeIds: new Set<string>(), edgeIds: new Set<string>() };
    return buildPathToNode(trieRoot, hoveredNodeId);
  }, [hoveredNodeId, trieRoot]);

  const hasHighlight = highlightPath.nodeIds.size > 0;

  // Apply highlighting styles to nodes
  const styledNodes: Node[] = useMemo(() => {
    if (!hasHighlight) return nodes;
    return nodes.map(node => ({
      ...node,
      style: {
        ...node.style,
        opacity: highlightPath.nodeIds.has(node.id) ? 1 : 0.3,
        transition: 'opacity 0.2s, filter 0.2s',
        filter: highlightPath.nodeIds.has(node.id) ? 'drop-shadow(0 0 6px rgba(99,102,241,0.4))' : 'none',
      },
    }));
  }, [nodes, hasHighlight, highlightPath.nodeIds]);

  // Apply highlighting styles to edges
  const styledEdges: Edge[] = useMemo(() => {
    if (!hasHighlight) return edges;
    return edges.map(edge => ({
      ...edge,
      style: {
        ...edge.style,
        stroke: highlightPath.edgeIds.has(edge.id) ? '#6366F1' : '#94A3B8',
        strokeWidth: highlightPath.edgeIds.has(edge.id) ? 2.5 : 1.5,
        opacity: highlightPath.edgeIds.has(edge.id) ? 1 : 0.2,
        transition: 'all 0.2s',
      },
    }));
  }, [edges, hasHighlight, highlightPath.edgeIds]);

  const handleNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      const data = nodeDataMap.get(node.id);
      if (data && onNodeClick) onNodeClick(data);
    },
    [nodeDataMap, onNodeClick],
  );

  const handleNodeMouseEnter: NodeMouseHandler = useCallback(
    (_, node) => setHoveredNodeId(node.id),
    [],
  );

  const handleNodeMouseLeave: NodeMouseHandler = useCallback(
    () => setHoveredNodeId(null),
    [],
  );

  if (!trieRoot) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100%', color: '#94A3B8', fontSize: 14, padding: 40, textAlign: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}>
        <div>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🌳</div>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8, color: '#475569' }}>
            Empty Trie
          </div>
          <div style={{ maxWidth: 360, lineHeight: 1.6 }}>
            Insert an Ethereum address to start building the MPT.
            The address will be hashed with keccak256 before insertion,
            matching go-ethereum's behavior.
          </div>
        </div>
      </div>
    );
  }

  return (
    <ReactFlow
      nodes={styledNodes}
      edges={styledEdges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onNodeClick={handleNodeClick}
      onNodeMouseEnter={handleNodeMouseEnter}
      onNodeMouseLeave={handleNodeMouseLeave}
      fitView
      fitViewOptions={{ padding: 0.2 }}
      minZoom={0.1}
      maxZoom={2}
      proOptions={{ hideAttribution: true }}
      nodesDraggable={false}
    >
      <Controls position="bottom-right" />
      <MiniMap
        nodeColor={(node) => {
          const colors = nodeColors[node.type as keyof typeof nodeColors];
          return colors ? colors.border : '#94A3B8';
        }}
        maskColor="rgba(0,0,0,0.08)"
        style={{ borderRadius: 8 }}
      />
      <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#E2E8F0" />
    </ReactFlow>
  );
}

interface TrieGraphProps {
  trieRoot: TrieNodeData | null;
  onNodeClick?: (node: TrieNodeData) => void;
}

export function TrieGraph({ trieRoot, onNodeClick }: TrieGraphProps) {
  return (
    <ReactFlowProvider>
      <TrieGraphInner trieRoot={trieRoot} onNodeClick={onNodeClick} />
    </ReactFlowProvider>
  );
}

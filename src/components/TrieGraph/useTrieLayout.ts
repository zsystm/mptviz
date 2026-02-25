import { useMemo } from 'react';
import dagre from '@dagrejs/dagre';
import { type Node, type Edge, Position } from '@xyflow/react';
import { TrieNodeData } from '../../types/trie';

const NODE_WIDTHS: Record<string, number> = {
  branch: 260,
  extension: 220,
  leaf: 240,
  hash: 200,
  value: 200,
};

const NODE_HEIGHTS: Record<string, number> = {
  branch: 120,
  extension: 80,
  leaf: 110,
  hash: 60,
  value: 70,
};

function flattenTrie(
  node: TrieNodeData,
  nodes: Node[],
  edges: Edge[],
  nodeDataMap: Map<string, TrieNodeData>,
) {
  const width = NODE_WIDTHS[node.nodeType] || 200;
  const height = NODE_HEIGHTS[node.nodeType] || 80;

  nodes.push({
    id: node.id,
    type: node.nodeType,
    data: { ...node },
    position: { x: 0, y: 0 },
    style: { width, height },
  });

  nodeDataMap.set(node.id, node);

  for (const child of node.children) {
    const edgeLabel =
      node.nodeType === 'branch' && child.childIndex >= 0 && child.childIndex < 16
        ? child.childIndex.toString(16)
        : undefined;

    edges.push({
      id: `${node.id}-${child.id}`,
      source: node.id,
      target: child.id,
      type: 'nibble',
      data: { label: edgeLabel },
    });

    flattenTrie(child, nodes, edges, nodeDataMap);
  }
}

function layoutGraph(nodes: Node[], edges: Edge[]): { nodes: Node[]; edges: Edge[] } {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: 'TB', nodesep: 50, ranksep: 80, marginx: 20, marginy: 20 });

  for (const node of nodes) {
    const w = (node.style?.width as number) || 200;
    const h = (node.style?.height as number) || 80;
    g.setNode(node.id, { width: w, height: h });
  }

  for (const edge of edges) {
    g.setEdge(edge.source, edge.target);
  }

  dagre.layout(g);

  const positioned = nodes.map((node) => {
    const pos = g.node(node.id);
    const w = (node.style?.width as number) || 200;
    const h = (node.style?.height as number) || 80;
    return {
      ...node,
      position: { x: pos.x - w / 2, y: pos.y - h / 2 },
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
    };
  });

  return { nodes: positioned, edges };
}

export function useTrieLayout(trieRoot: TrieNodeData | null) {
  return useMemo(() => {
    if (!trieRoot) return { nodes: [], edges: [], nodeDataMap: new Map<string, TrieNodeData>() };

    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const nodeDataMap = new Map<string, TrieNodeData>();

    flattenTrie(trieRoot, nodes, edges, nodeDataMap);
    const laid = layoutGraph(nodes, edges);

    return { ...laid, nodeDataMap };
  }, [trieRoot]);
}

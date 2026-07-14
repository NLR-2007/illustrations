import { DiagramInput, DiagramNode, Connection } from '../../schemas/diagram-schema.js';

export interface PositionedNode {
  id: string;
  type: string;
  text: string;
  highlight: boolean;
  x: number; // inches
  y: number; // inches
  w: number; // inches
  h: number; // inches
}

export interface PositionedConnection {
  fromId: string;
  toId: string;
  label?: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}

export interface LayoutOutput {
  title: string;
  type: string;
  nodes: PositionedNode[];
  connections: PositionedConnection[];
  extraShapes?: Array<{
    type: 'oval' | 'rect' | 'line';
    x: number;
    y: number;
    w: number;
    h: number;
    fill?: string;
    border?: string;
    text?: string;
  }>;
}

export interface LayoutOptions {
  canvasWidth?: number;
  canvasHeight?: number;
  nodeWidth?: number;
  nodeHeight?: number;
  verticalGap?: number;
  horizontalGap?: number;
  startX?: number;
  startY?: number;
}

const CANVAS_WIDTH_DEFAULT = 13.33;
const CANVAS_HEIGHT_DEFAULT = 7.5;
const NODE_WIDTH_DEFAULT = 2.0;
const NODE_HEIGHT_DEFAULT = 0.8;
const VERTICAL_GAP_DEFAULT = 0.5;
const HORIZONTAL_GAP_DEFAULT = 1.0;

export function computeLayout(diagram: DiagramInput, options?: LayoutOptions): LayoutOutput {
  const { type } = diagram;

  if (type === 'timeline') {
    return computeTimelineLayout(diagram, options);
  } else if (type === 'venn') {
    return computeVennLayout(diagram, options);
  } else if (type === 'comparison' || type === 'before_after') {
    return computeComparisonLayout(diagram, options);
  } else if (type === 'roadmap') {
    return computeRoadmapLayout(diagram, options);
  }

  // Default flow-based layout
  return computeHierarchicalLayout(diagram, options);
}

/**
 * Standard Hierarchical Layout (Sugiyama framework simplification)
 */
function computeHierarchicalLayout(diagram: DiagramInput, options?: LayoutOptions): LayoutOutput {
  const { title, type, nodes, connections } = diagram;
  const direction = diagram.direction || 'top-to-bottom';

  const canvasWidth = options?.canvasWidth ?? CANVAS_WIDTH_DEFAULT;
  const canvasHeight = options?.canvasHeight ?? CANVAS_HEIGHT_DEFAULT;
  const nodeWidth = options?.nodeWidth ?? NODE_WIDTH_DEFAULT;
  const nodeHeight = options?.nodeHeight ?? NODE_HEIGHT_DEFAULT;
  const verticalGap = options?.verticalGap ?? VERTICAL_GAP_DEFAULT;
  const horizontalGap = options?.horizontalGap ?? HORIZONTAL_GAP_DEFAULT;
  const startX = options?.startX ?? 1.0;
  const startY = options?.startY ?? 1.2;

  // Build adjacency graph
  const adj = new Map<string, string[]>();
  const inDegree = new Map<string, number>();
  nodes.forEach(n => {
    adj.set(n.id, []);
    inDegree.set(n.id, 0);
  });
  connections.forEach(c => {
    adj.get(c.from)?.push(c.to);
    inDegree.set(c.to, (inDegree.get(c.to) || 0) + 1);
  });

  // Calculate ranks
  const ranks = new Map<string, number>();
  const visited = new Set<string>();

  function assignRanks(nodeId: string, currentRank: number) {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);

    const prevRank = ranks.get(nodeId) || 0;
    ranks.set(nodeId, Math.max(prevRank, currentRank));

    const children = adj.get(nodeId) || [];
    children.forEach(childId => {
      if (!visited.has(childId)) {
        assignRanks(childId, currentRank + 1);
      }
    });
    visited.delete(nodeId);
  }

  // Start ranking from root nodes
  const roots = nodes.filter(n => inDegree.get(n.id) === 0 || n.type === 'start_end');
  if (roots.length === 0 && nodes.length > 0) {
    assignRanks(nodes[0].id, 0);
  } else {
    roots.forEach(r => assignRanks(r.id, 0));
  }

  nodes.forEach(n => {
    if (!ranks.has(n.id)) ranks.set(n.id, 0);
  });

  // Group nodes by rank
  const rankGroups = new Map<number, string[]>();
  ranks.forEach((rank, id) => {
    if (!rankGroups.has(rank)) rankGroups.set(rank, []);
    rankGroups.get(rank)!.push(id);
  });

  const sortedRanks = Array.from(rankGroups.keys()).sort((a, b) => a - b);

  const positionedNodes: PositionedNode[] = [];
  const nodeMap = new Map<string, PositionedNode>();

  if (direction === 'top-to-bottom') {
    sortedRanks.forEach((rank, rankIndex) => {
      const nodeIds = rankGroups.get(rank)!;
      const count = nodeIds.length;
      const y = startY + rankIndex * (nodeHeight + verticalGap);

      nodeIds.forEach((id, idx) => {
        const node = nodes.find(n => n.id === id)!;
        const x = startX + (canvasWidth - (startX * 2)) / 2 - ((count - 1) * (nodeWidth + horizontalGap)) / 2 + idx * (nodeWidth + horizontalGap);
        
        const posNode: PositionedNode = {
          id: node.id,
          type: node.type,
          text: node.text,
          highlight: node.highlight || false,
          x,
          y,
          w: nodeWidth,
          h: nodeHeight
        };
        positionedNodes.push(posNode);
        nodeMap.set(id, posNode);
      });
    });
  } else {
    sortedRanks.forEach((rank, rankIndex) => {
      const nodeIds = rankGroups.get(rank)!;
      const count = nodeIds.length;
      const x = startX + rankIndex * (nodeWidth + horizontalGap);

      nodeIds.forEach((id, idx) => {
        const node = nodes.find(n => n.id === id)!;
        const y = startY + (canvasHeight - startY - 0.5) / 2 - ((count - 1) * (nodeHeight + verticalGap)) / 2 + idx * (nodeHeight + verticalGap);
        
        const posNode: PositionedNode = {
          id: node.id,
          type: node.type,
          text: node.text,
          highlight: node.highlight || false,
          x,
          y,
          w: nodeWidth,
          h: nodeHeight
        };
        positionedNodes.push(posNode);
        nodeMap.set(id, posNode);
      });
    });
  }

  // Calculate connections
  const positionedConnections: PositionedConnection[] = [];
  connections.forEach(c => {
    const fromNode = nodeMap.get(c.from);
    const toNode = nodeMap.get(c.to);
    if (!fromNode || !toNode) return;

    let fromX, fromY, toX, toY;
    if (direction === 'top-to-bottom') {
      fromX = fromNode.x + fromNode.w / 2;
      fromY = fromNode.y + fromNode.h;
      toX = toNode.x + toNode.w / 2;
      toY = toNode.y;
    } else {
      fromX = fromNode.x + fromNode.w;
      fromY = fromNode.y + fromNode.h / 2;
      toX = toNode.x;
      toY = toNode.y + toNode.h / 2;
    }

    positionedConnections.push({
      fromId: c.from,
      toId: c.to,
      label: c.label,
      fromX,
      fromY,
      toX,
      toY
    });
  });

  return {
    title,
    type,
    nodes: positionedNodes,
    connections: positionedConnections
  };
}

/**
 * Timeline Layout
 */
function computeTimelineLayout(diagram: DiagramInput, options?: LayoutOptions): LayoutOutput {
  const { title, type, nodes, connections } = diagram;
  
  const canvasWidth = options?.canvasWidth ?? CANVAS_WIDTH_DEFAULT;
  const startX = options?.startX ?? 1.0;
  const startY = options?.startY ?? 1.8;
  const canvasHeight = options?.canvasHeight ?? CANVAS_HEIGHT_DEFAULT;

  const orderedNodes = [...nodes];
  const positionedNodes: PositionedNode[] = [];
  const nodeMap = new Map<string, PositionedNode>();

  const count = orderedNodes.length;
  const spacing = (canvasWidth - startX - 1.0) / Math.max(1, count - 1 || 1);
  const axisY = startY + (canvasHeight - startY) / 2;

  orderedNodes.forEach((node, idx) => {
    const x = startX + idx * spacing;
    const isAbove = idx % 2 === 0;
    const y = isAbove ? (axisY - 1.1) : (axisY + 0.3);

    const posNode: PositionedNode = {
      id: node.id,
      type: node.type,
      text: node.text,
      highlight: node.highlight || false,
      x,
      y,
      w: 1.6,
      h: 0.8
    };
    positionedNodes.push(posNode);
    nodeMap.set(node.id, posNode);
  });

  const extraShapes: LayoutOutput['extraShapes'] = [
    {
      type: 'line',
      x: startX - 0.2,
      y: axisY,
      w: canvasWidth - startX + 0.2,
      h: 0,
      border: '#111111'
    }
  ];

  const positionedConnections: PositionedConnection[] = [];
  positionedNodes.forEach((pn, idx) => {
    const fromX = pn.x + pn.w / 2;
    const fromY = idx % 2 === 0 ? (pn.y + pn.h) : pn.y;
    const toX = fromX;
    const toY = axisY;

    positionedConnections.push({
      fromId: pn.id,
      toId: 'axis',
      fromX,
      fromY,
      toX,
      toY
    });
  });

  connections.forEach(c => {
    const fromN = nodeMap.get(c.from);
    const toN = nodeMap.get(c.to);
    if (!fromN || !toN) return;
    positionedConnections.push({
      fromId: c.from,
      toId: c.to,
      label: c.label,
      fromX: fromN.x + fromN.w,
      fromY: fromN.y + fromN.h / 2,
      toX: toN.x,
      toY: toN.y + toN.h / 2
    });
  });

  return {
    title,
    type,
    nodes: positionedNodes,
    connections: positionedConnections,
    extraShapes
  };
}

/**
 * Roadmap Layout
 */
function computeRoadmapLayout(diagram: DiagramInput, options?: LayoutOptions): LayoutOutput {
  const { title, type, nodes, connections } = diagram;
  
  const canvasWidth = options?.canvasWidth ?? CANVAS_WIDTH_DEFAULT;
  const startX = options?.startX ?? 1.0;
  const startY = options?.startY ?? 1.8;
  const canvasHeight = options?.canvasHeight ?? CANVAS_HEIGHT_DEFAULT;

  const count = nodes.length;
  const spacingX = (canvasWidth - startX - 1.0) / Math.max(1, count - 1 || 1);
  const y = startY + (canvasHeight - startY - 0.8) / 2;

  const positionedNodes: PositionedNode[] = [];
  const nodeMap = new Map<string, PositionedNode>();

  nodes.forEach((node, idx) => {
    const x = startX + idx * spacingX;
    const posNode: PositionedNode = {
      id: node.id,
      type: node.type,
      text: node.text,
      highlight: node.highlight || false,
      x,
      y,
      w: 1.6,
      h: 0.8
    };
    positionedNodes.push(posNode);
    nodeMap.set(node.id, posNode);
  });

  const positionedConnections: PositionedConnection[] = [];
  connections.forEach(c => {
    const fromN = nodeMap.get(c.from);
    const toN = nodeMap.get(c.to);
    if (!fromN || !toN) return;
    positionedConnections.push({
      fromId: c.from,
      toId: c.to,
      label: c.label,
      fromX: fromN.x + fromN.w,
      fromY: fromN.y + fromN.h / 2,
      toX: toN.x,
      toY: toN.y + toN.h / 2
    });
  });

  return {
    title,
    type,
    nodes: positionedNodes,
    connections: positionedConnections
  };
}

/**
 * Venn Diagram Layout
 */
function computeVennLayout(diagram: DiagramInput, options?: LayoutOptions): LayoutOutput {
  const { title, type, nodes } = diagram;

  const canvasWidth = options?.canvasWidth ?? CANVAS_WIDTH_DEFAULT;
  const startX = options?.startX ?? 1.0;
  const startY = options?.startY ?? 1.8;
  const canvasHeight = options?.canvasHeight ?? CANVAS_HEIGHT_DEFAULT;

  const circleSize = Math.min(canvasHeight - startY - 0.5, (canvasWidth - startX) / 2.3);
  const leftCircleX = startX + (canvasWidth - startX - circleSize * 1.6) / 2;
  const rightCircleX = leftCircleX + circleSize * 0.6;
  const circleY = startY + (canvasHeight - startY - circleSize) / 2;

  const extraShapes: LayoutOutput['extraShapes'] = [
    {
      type: 'oval',
      x: leftCircleX,
      y: circleY,
      w: circleSize,
      h: circleSize,
      fill: 'transparent',
      border: '#111111'
    },
    {
      type: 'oval',
      x: rightCircleX,
      y: circleY,
      w: circleSize,
      h: circleSize,
      fill: 'transparent',
      border: '#111111'
    }
  ];

  const positionedNodes: PositionedNode[] = [];
  const leftNodes: DiagramNode[] = [];
  const rightNodes: DiagramNode[] = [];
  const centerNodes: DiagramNode[] = [];

  nodes.forEach(n => {
    const idLower = n.id.toLowerCase();
    const textLower = n.text.toLowerCase();
    if (idLower.includes('left') || textLower.includes('traditional') || idLower.includes('trad')) {
      leftNodes.push(n);
    } else if (idLower.includes('right') || textLower.includes('ai')) {
      rightNodes.push(n);
    } else if (idLower.includes('both') || idLower.includes('center') || idLower.includes('intersect') || idLower.includes('common')) {
      centerNodes.push(n);
    } else {
      if (leftNodes.length <= rightNodes.length && leftNodes.length <= centerNodes.length) {
        leftNodes.push(n);
      } else if (rightNodes.length <= centerNodes.length) {
        rightNodes.push(n);
      } else {
        centerNodes.push(n);
      }
    }
  });

  const placeVennNodes = (nList: DiagramNode[], minX: number, maxX: number) => {
    const count = nList.length;
    const innerStartY = circleY + 0.6;
    const gapY = (circleSize - 1.2) / Math.max(1, count - 1 || 1);
    
    nList.forEach((node, idx) => {
      const x = minX + (maxX - minX - 1.2) / 2;
      const y = innerStartY + idx * gapY;
      positionedNodes.push({
        id: node.id,
        type: 'annotation',
        text: node.text,
        highlight: node.highlight || false,
        x,
        y,
        w: 1.2,
        h: 0.5
      });
    });
  };

  placeVennNodes(leftNodes, leftCircleX + 0.2, rightCircleX - 0.1);
  placeVennNodes(centerNodes, rightCircleX + 0.1, leftCircleX + circleSize - 0.1);
  placeVennNodes(rightNodes, leftCircleX + circleSize + 0.1, rightCircleX + circleSize - 0.2);

  return {
    title,
    type,
    nodes: positionedNodes,
    connections: [],
    extraShapes
  };
}

/**
 * Comparison Layout
 */
function computeComparisonLayout(diagram: DiagramInput, options?: LayoutOptions): LayoutOutput {
  const { title, type, nodes, connections } = diagram;

  const canvasWidth = options?.canvasWidth ?? CANVAS_WIDTH_DEFAULT;
  const startX = options?.startX ?? 1.0;
  const startY = options?.startY ?? 1.8;
  const canvasHeight = options?.canvasHeight ?? CANVAS_HEIGHT_DEFAULT;

  const positionedNodes: PositionedNode[] = [];
  const nodeMap = new Map<string, PositionedNode>();

  const mid = Math.ceil(nodes.length / 2);
  const leftCol = nodes.slice(0, mid);
  const rightCol = nodes.slice(mid);

  const columnWidth = (canvasWidth - startX - 1.5) / 2;
  const gapY = (canvasHeight - startY - 0.5) / Math.max(2, Math.max(leftCol.length, rightCol.length));

  leftCol.forEach((node, idx) => {
    const x = startX;
    const y = startY + idx * gapY;
    const posNode: PositionedNode = {
      id: node.id,
      type: node.type,
      text: node.text,
      highlight: node.highlight || false,
      x,
      y,
      w: columnWidth,
      h: 0.8
    };
    positionedNodes.push(posNode);
    nodeMap.set(node.id, posNode);
  });

  rightCol.forEach((node, idx) => {
    const x = startX + columnWidth + 1.0;
    const y = startY + idx * gapY;
    const posNode: PositionedNode = {
      id: node.id,
      type: node.type,
      text: node.text,
      highlight: node.highlight || false,
      x,
      y,
      w: columnWidth,
      h: 0.8
    };
    positionedNodes.push(posNode);
    nodeMap.set(node.id, posNode);
  });

  const positionedConnections: PositionedConnection[] = [];
  connections.forEach(c => {
    const fromN = nodeMap.get(c.from);
    const toN = nodeMap.get(c.to);
    if (!fromN || !toN) return;
    positionedConnections.push({
      fromId: c.from,
      toId: c.to,
      label: c.label,
      fromX: fromN.x + fromN.w,
      fromY: fromN.y + fromN.h / 2,
      toX: toN.x,
      toY: toN.y + toN.h / 2
    });
  });

  return {
    title,
    type,
    nodes: positionedNodes,
    connections: positionedConnections
  };
}

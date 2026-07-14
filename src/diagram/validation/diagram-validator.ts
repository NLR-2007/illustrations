import { LayoutOutput, PositionedNode } from '../layout/layout-engine.js';
import { DiagramInput } from '../../schemas/diagram-schema.js';

export interface ValidationIssue {
  severity: 'error' | 'warning';
  message: string;
  nodeId?: string;
  connectionId?: string;
}

export interface ValidationReport {
  isValid: boolean;
  issues: ValidationIssue[];
}

/**
 * Validates the raw DiagramInput structure.
 */
export function validateDiagramInput(diagram: DiagramInput): ValidationReport {
  const issues: ValidationIssue[] = [];
  const ids = new Set<string>();

  // 1. Check for title
  if (!diagram.title || diagram.title.trim() === '') {
    issues.push({ severity: 'error', message: 'Diagram title is missing.' });
  }

  // 2. Validate nodes
  if (diagram.nodes.length === 0) {
    issues.push({ severity: 'error', message: 'Diagram contains no nodes.' });
  }

  diagram.nodes.forEach(n => {
    // Check duplicates
    if (ids.has(n.id)) {
      issues.push({ severity: 'error', message: `Duplicate node ID detected: "${n.id}".`, nodeId: n.id });
    }
    ids.add(n.id);

    // Check empty text
    if (!n.text || n.text.trim() === '') {
      issues.push({ severity: 'warning', message: `Node "${n.id}" has empty label text.`, nodeId: n.id });
    }
  });

  // 3. Validate connections
  diagram.connections.forEach((c, idx) => {
    const fromExists = ids.has(c.from);
    const toExists = ids.has(c.to);

    if (!fromExists) {
      issues.push({ 
        severity: 'error', 
        message: `Connection from non-existent node: "${c.from}" to "${c.to}".`, 
        connectionId: `${c.from}-${c.to}` 
      });
    }

    if (!toExists) {
      issues.push({ 
        severity: 'error', 
        message: `Connection to non-existent node: "${c.from}" to "${c.to}".`, 
        connectionId: `${c.from}-${c.to}` 
      });
    }

    if (c.from === c.to) {
      issues.push({ 
        severity: 'warning', 
        message: `Self-connecting node loop: "${c.from}".`, 
        nodeId: c.from 
      });
    }
  });

  return {
    isValid: !issues.some(i => i.severity === 'error'),
    issues
  };
}

/**
 * Checks for overlapping bounding boxes.
 */
export function checkOverlap(n1: PositionedNode, n2: PositionedNode): boolean {
  // Allow a tiny margin of error (0.01 inches) to prevent floating-point overlap false positives
  return (
    n1.x + 0.01 < n2.x + n2.w &&
    n1.x + n1.w - 0.01 > n2.x &&
    n1.y + 0.01 < n2.y + n2.h &&
    n1.y + n1.h - 0.01 > n2.y
  );
}

/**
 * Validates the computed LayoutOutput placement coordinates.
 */
export function validateDiagramLayout(layout: LayoutOutput): ValidationReport {
  const issues: ValidationIssue[] = [];

  // 1. Check for off-slide bounds
  layout.nodes.forEach(n => {
    const rightX = n.x + n.w;
    const bottomY = n.y + n.h;

    if (n.x < 0 || rightX > 13.33 || n.y < 0 || bottomY > 7.5) {
      issues.push({
        severity: 'error',
        message: `Node "${n.id}" exceeds slide bounds (X: ${n.x.toFixed(2)}, Y: ${n.y.toFixed(2)}, W: ${n.w.toFixed(2)}, H: ${n.h.toFixed(2)}).`,
        nodeId: n.id
      });
    }
  });

  // 2. Check for node overlaps
  for (let i = 0; i < layout.nodes.length; i++) {
    for (let j = i + 1; j < layout.nodes.length; j++) {
      const n1 = layout.nodes[i];
      const n2 = layout.nodes[j];
      
      // Skip annotations overlap validation as they are just comments or notes
      if (n1.type === 'annotation' || n2.type === 'annotation') continue;

      if (checkOverlap(n1, n2)) {
        issues.push({
          severity: 'error',
          message: `Collision detected: Node "${n1.id}" overlaps with node "${n2.id}".`,
          nodeId: n1.id
        });
      }
    }
  }

  return {
    isValid: !issues.some(i => i.severity === 'error'),
    issues
  };
}

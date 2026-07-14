import { describe, it, expect } from 'vitest';
import { checkOverlap, validateDiagramInput, validateDiagramLayout } from '../../src/diagram/validation/diagram-validator.js';
import { computeLayout, PositionedNode } from '../../src/diagram/layout/layout-engine.js';
import { DiagramInput } from '../../src/schemas/diagram-schema.js';

describe('Layout Calculations & Bounds Validation', () => {
  it('detects overlapping rectangular nodes correctly', () => {
    const nodeA: PositionedNode = { id: 'A', type: 'process', text: 'Node A', highlight: false, x: 1.0, y: 1.0, w: 2.0, h: 1.0 };
    const nodeB: PositionedNode = { id: 'B', type: 'process', text: 'Node B', highlight: false, x: 2.0, y: 1.5, w: 2.0, h: 1.0 }; // overlaps
    const nodeC: PositionedNode = { id: 'C', type: 'process', text: 'Node C', highlight: false, x: 4.0, y: 1.0, w: 2.0, h: 1.0 }; // distinct

    expect(checkOverlap(nodeA, nodeB)).toBe(true);
    expect(checkOverlap(nodeA, nodeC)).toBe(false);
  });

  it('detects layout boundaries outside canvas slide limits', () => {
    const outOfBoundsNode: PositionedNode = { id: 'A', type: 'process', text: 'Out', highlight: false, x: 12.0, y: 1.0, w: 2.0, h: 1.0 }; // x + w = 14.0 > 13.33
    const layout = {
      title: 'Test slide',
      type: 'flowchart',
      nodes: [outOfBoundsNode],
      connections: []
    };

    const report = validateDiagramLayout(layout);
    expect(report.isValid).toBe(false);
  });

  it('validates invalid connection endpoints', () => {
    const diagram: DiagramInput = {
      title: 'Bad connections',
      type: 'flowchart',
      nodes: [
        { id: 'start', type: 'start_end', text: 'Start' }
      ],
      connections: [
        { from: 'start', to: 'ghost_node' } // ghost_node doesn't exist
      ]
    };

    const report = validateDiagramInput(diagram);
    expect(report.isValid).toBe(false);
    expect(report.issues.some(i => i.message.includes('ghost_node'))).toBe(true);
  });

  it('computes hierarchical coordinates for sequential nodes without overlaps', () => {
    const diagram: DiagramInput = {
      title: 'Simple Flow',
      type: 'flowchart',
      direction: 'top-to-bottom',
      nodes: [
        { id: 'a', type: 'start_end', text: 'A' },
        { id: 'b', type: 'process', text: 'B' },
        { id: 'c', type: 'start_end', text: 'C' }
      ],
      connections: [
        { from: 'a', to: 'b' },
        { from: 'b', to: 'c' }
      ]
    };

    const layout = computeLayout(diagram);
    const report = validateDiagramLayout(layout);
    expect(report.isValid).toBe(true);
  });
});

import { describe, it, expect } from 'vitest';
import { DiagramSchema } from '../../src/schemas/diagram-schema.js';

describe('Diagram Schema Validation', () => {
  it('validates a correct flowchart structure successfully', () => {
    const valid = {
      title: 'User Login Flow',
      type: 'flowchart',
      direction: 'top-to-bottom',
      nodes: [
        { id: 'start', type: 'start_end', text: 'Start' },
        { id: 'credentials', type: 'input_output', text: 'Enter Details' }
      ],
      connections: [
        { from: 'start', to: 'credentials' }
      ]
    };

    const res = DiagramSchema.safeParse(valid);
    expect(res.success).toBe(true);
  });

  it('fails when diagram nodes contain invalid shape types', () => {
    const invalid = {
      title: 'Invalid Flow',
      type: 'flowchart',
      nodes: [
        { id: 'node1', type: 'hexagon', text: 'Invalid Shape' }
      ],
      connections: []
    };

    const res = DiagramSchema.safeParse(invalid);
    expect(res.success).toBe(false);
  });
});

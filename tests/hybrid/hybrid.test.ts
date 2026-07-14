import { describe, it, expect } from 'vitest';
import { routeRequest } from '../../src/router/visual-router.js';
import { RequestInput } from '../../src/schemas/request-schema.js';

describe('AI Visual Router & Hybrid Routing Decisions', () => {
  it('routes login flowchart request to DIAGRAM mode', () => {
    const req: RequestInput = {
      topic: 'Create login authentication flowchart',
      purpose: 'presentation',
      audience: 'PROFESSIONAL',
      mode: 'auto',
      format: '16:9',
      style: 'default',
      editable: true,
      outputName: 'login-flow'
    };

    const res = routeRequest(req);
    expect(res.mode).toBe('DIAGRAM');
  });

  it('routes API restaurant analogy to ILLUSTRATION mode', () => {
    const req: RequestInput = {
      topic: 'Explain API using restaurant example',
      purpose: 'presentation',
      audience: 'TEEN',
      mode: 'auto',
      format: '16:9',
      style: 'default',
      editable: false,
      outputName: 'api-analogy'
    };

    const res = routeRequest(req);
    expect(res.mode).toBe('ILLUSTRATION');
  });

  it('routes combined analogy and pipeline to HYBRID mode', () => {
    const req: RequestInput = {
      topic: 'Create a PPT visual explaining API with analogy and technical flow',
      purpose: 'presentation',
      audience: 'GENERAL',
      mode: 'auto',
      format: '16:9',
      style: 'default',
      editable: true,
      outputName: 'api-hybrid'
    };

    const res = routeRequest(req);
    expect(res.mode).toBe('HYBRID');
  });

  it('routes child audience request automatically to ILLUSTRATION mode', () => {
    const req: RequestInput = {
      topic: 'Explain photosynthesis to an 8-year-old',
      purpose: 'presentation',
      audience: 'CHILD_8_12',
      mode: 'auto',
      format: '16:9',
      style: 'default',
      editable: true,
      outputName: 'photosynthesis'
    };

    const res = routeRequest(req);
    expect(res.mode).toBe('ILLUSTRATION');
  });
});

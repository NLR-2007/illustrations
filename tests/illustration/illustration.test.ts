import { describe, it, expect } from 'vitest';
import { planIllustrationScene } from '../../src/illustration/planner/illustration-planner.js';
import { buildPositivePrompt } from '../../src/illustration/generation/generator.js';
import { validateIllustrationPackage } from '../../src/illustration/validation/illustration-validator.js';
import { RequestInput } from '../../src/schemas/request-schema.js';

describe('Illustration Planning & Prompt Engine', () => {
  it('creates a custom scene plan for the API restaurant analogy', () => {
    const request: RequestInput = {
      topic: 'Explain API restaurant analogy',
      purpose: 'presentation',
      audience: 'TEEN',
      mode: 'illustration',
      format: '16:9',
      style: 'default',
      editable: false,
      outputName: 'api-test'
    };

    const scene = planIllustrationScene(request);
    expect(scene.mascotRole).toBe('Waiter');
    expect(scene.objects.some(obj => obj.name === 'Kitchen')).toBe(true);
  });

  it('builds positive prompt containing character and style locks', () => {
    const request: RequestInput = {
      topic: 'Explain API restaurant analogy',
      purpose: 'presentation',
      audience: 'TEEN',
      mode: 'illustration',
      format: '16:9',
      style: 'default',
      editable: false,
      outputName: 'api-test'
    };

    const scene = planIllustrationScene(request);
    const prompt = buildPositivePrompt(scene, request);

    expect(prompt).toContain('STYLE LOCK');
    expect(prompt).toContain('CHARACTER LOCK');
    expect(prompt).toContain('yellow');
    expect(prompt).toContain('chest');
    expect(prompt).toContain('marks');
  });

  it('audits prompt text and returns compliance reports', () => {
    const prompt = 'Crisp black outline drawing of mascot with yellow chest marks, minimal hand-drawn style, white background';
    const negPrompt = 'photorealistic, 3d render';

    const report = validateIllustrationPackage('test-audit', prompt, negPrompt);
    expect(report.identityScore).toBeGreaterThanOrEqual(4); // yellow chest marks scored +4
    expect(report.colorCompliance).toBe(true);
  });
});

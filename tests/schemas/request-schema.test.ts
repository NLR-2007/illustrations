import { describe, it, expect } from 'vitest';
import { RequestSchema } from '../../src/schemas/request-schema.js';

describe('Request Schema Validation', () => {
  it('validates a correct request successfully', () => {
    const valid = {
      topic: 'How APIs Work',
      purpose: 'presentation',
      audience: 'COLLEGE',
      mode: 'auto',
      format: '16:9',
      style: 'default',
      editable: true,
      outputName: 'api-explanation'
    };

    const res = RequestSchema.safeParse(valid);
    expect(res.success).toBe(true);
  });

  it('fails validation when topic is empty', () => {
    const invalid = {
      topic: '',
      outputName: 'api-explanation'
    };

    const res = RequestSchema.safeParse(invalid);
    expect(res.success).toBe(false);
  });

  it('fails validation when audience is invalid', () => {
    const invalid = {
      topic: 'Some topic',
      audience: 'BABY',
      outputName: 'api-explanation'
    };

    const res = RequestSchema.safeParse(invalid);
    expect(res.success).toBe(false);
  });
});

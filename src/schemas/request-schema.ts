import { z } from 'zod';

export const AudienceSchema = z.enum([
  'CHILD_5_7',
  'CHILD_8_12',
  'TEEN',
  'COLLEGE',
  'GENERAL',
  'PROFESSIONAL',
  'TECHNICAL',
  'EXECUTIVE'
]);

export const ModeSchema = z.enum([
  'auto',
  'illustration',
  'diagram',
  'hybrid'
]);

export const FormatSchema = z.enum([
  '16:9',
  '4:3',
  '1:1',
  '9:16',
  'A4'
]);

export const RequestSchema = z.object({
  topic: z.string().min(1, 'Topic is required'),
  purpose: z.string().default('presentation'),
  audience: AudienceSchema.default('GENERAL'),
  mode: ModeSchema.default('auto'),
  format: FormatSchema.default('16:9'),
  style: z.string().default('default'),
  editable: z.boolean().default(true),
  outputName: z.string().min(1, 'outputName is required')
});

export type Audience = z.infer<typeof AudienceSchema>;
export type Mode = z.infer<typeof ModeSchema>;
export type Format = z.infer<typeof FormatSchema>;
export type RequestInput = z.infer<typeof RequestSchema>;

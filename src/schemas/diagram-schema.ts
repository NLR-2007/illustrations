import { z } from 'zod';

export const DiagramTypeSchema = z.enum([
  'flowchart',
  'process',
  'decision_tree',
  'timeline',
  'roadmap',
  'architecture',
  'system_flow',
  'comparison',
  'venn',
  'funnel',
  'cycle',
  'hierarchy',
  'journey',
  'before_after'
]);

export const NodeTypeSchema = z.enum([
  'start_end',
  'process',
  'decision',
  'input_output',
  'database',
  'document',
  'connector',
  'manual_input',
  'annotation'
]);

export const NodeSchema = z.object({
  id: z.string().min(1),
  type: NodeTypeSchema,
  text: z.string(),
  highlight: z.boolean().optional()
});

export const ConnectionSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  label: z.string().optional()
});

export const DiagramSchema = z.object({
  title: z.string().min(1),
  type: DiagramTypeSchema,
  direction: z.enum(['top-to-bottom', 'left-to-right']).optional(),
  nodes: z.array(NodeSchema),
  connections: z.array(ConnectionSchema)
});

export type DiagramType = z.infer<typeof DiagramTypeSchema>;
export type NodeType = z.infer<typeof NodeTypeSchema>;
export type DiagramNode = z.infer<typeof NodeSchema>;
export type Connection = z.infer<typeof ConnectionSchema>;
export type DiagramInput = z.infer<typeof DiagramSchema>;

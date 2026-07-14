import { RequestInput } from '../schemas/request-schema.js';

export type RoutedMode = 'ILLUSTRATION' | 'DIAGRAM' | 'HYBRID';

export interface RoutingResult {
  mode: RoutedMode;
  reason: string;
  suggestedTemplate?: string;
}

export function routeRequest(request: RequestInput): RoutingResult {
  // If the user specified a explicit mode, respect it.
  if (request.mode !== 'auto') {
    return {
      mode: request.mode.toUpperCase() as RoutedMode,
      reason: `User explicitly requested mode: ${request.mode}`
    };
  }

  const topicLower = request.topic.toLowerCase();
  const purposeLower = request.purpose.toLowerCase();

  // 1. Keyword search for Hybrid Mode
  const hybridKeywords = [
    'hybrid', 
    'analogy and technical', 
    'analogy and flow', 
    'analogy and pipeline', 
    'diagram and illustration',
    'both'
  ];
  if (
    hybridKeywords.some(kw => topicLower.includes(kw)) ||
    purposeLower.includes('hybrid')
  ) {
    return {
      mode: 'HYBRID',
      reason: 'Topic or purpose contains keywords requesting both analogy and technical flow.',
      suggestedTemplate: 'IllustrationLeft_DiagramRight'
    };
  }

  // 2. Keyword search for Illustration
  const illustrationKeywords = [
    'analogy', 
    'metaphor', 
    'story', 
    'explain to a child', 
    'illustration', 
    'cartoon', 
    'drawing',
    'mascot', 
    'analogy of', 
    'photosynthesis', 
    'journey to success',
    'restaurant'
  ];
  if (illustrationKeywords.some(kw => topicLower.includes(kw))) {
    return {
      mode: 'ILLUSTRATION',
      reason: 'Topic contains conceptual or analogy keywords.'
    };
  }

  // 3. Keyword search for Diagram
  const diagramKeywords = [
    'flowchart', 
    'architecture', 
    'timeline', 
    'roadmap', 
    'system flow', 
    'database schema', 
    'pipeline', 
    'decision tree', 
    'comparison', 
    'venn', 
    'hierarchy',
    'deployment'
  ];
  if (diagramKeywords.some(kw => topicLower.includes(kw))) {
    return {
      mode: 'DIAGRAM',
      reason: 'Topic contains structured diagram terminology.'
    };
  }

  // 4. Fallback based on Audience
  switch (request.audience) {
    case 'CHILD_5_7':
    case 'CHILD_8_12':
      return {
        mode: 'ILLUSTRATION',
        reason: 'Target audience is young children; routing to Illustration Mode for simpler visual learning.'
      };
    case 'TECHNICAL':
    case 'COLLEGE':
      return {
        mode: 'DIAGRAM',
        reason: 'Technical or academic audience; routing to Diagram Mode for structural accuracy.'
      };
    case 'EXECUTIVE':
    case 'PROFESSIONAL':
    case 'GENERAL':
    default:
      // Default fallback: if the topic sounds like it contains "how X works" or "analogy", illustration.
      // Else default to Diagram.
      if (topicLower.includes('how') && (topicLower.includes('work') || topicLower.includes('explain'))) {
        return {
          mode: 'HYBRID',
          reason: 'General explanatory topic; routing to Hybrid Mode to balance explanation and structure.',
          suggestedTemplate: 'IllustrationLeft_DiagramRight'
        };
      }
      return {
        mode: 'DIAGRAM',
        reason: 'Default routing fallback for general structured presentations.'
      };
  }
}

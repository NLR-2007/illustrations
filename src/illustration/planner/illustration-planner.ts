import { RequestInput } from '../../schemas/request-schema.js';

export interface SceneElement {
  name: string;
  role: string;
  position: string;
  description: string;
}

export interface VisualScenePlan {
  analogyTitle: string;
  explanation: string;
  mascotRole: string;
  mascotPose: string;
  mascotAccessories: string[];
  objects: SceneElement[];
  visualFlow: string[];
}

/**
 * Pre-defined analogy plans for common concepts to guarantee premium visual quality.
 */
const PRESETS: Record<string, (req: RequestInput) => VisualScenePlan> = {
  api: (req) => ({
    analogyTitle: 'Restaurant API Analogy',
    explanation: 'A customer orders food from a kitchen via a waiter. The waiter acts as the API, carrying requests and responses.',
    mascotRole: 'Waiter',
    mascotPose: 'Mascot is wearing a small waiter apron (minimalist line art) and carrying a notebook/tray.',
    mascotAccessories: ['waiter tray', 'notebook'],
    objects: [
      { name: 'Customer', role: 'Client', position: 'Left side', description: 'Sitting at a simple dining table.' },
      { name: 'Kitchen', role: 'Server/Backend', position: 'Right side', description: 'A window looking into a kitchen with pots.' }
    ],
    visualFlow: [
      'Customer hands a paper order to the Mascot Waiter.',
      'Mascot Waiter carries the order to the Kitchen.',
      'Kitchen prepares the food.',
      'Mascot Waiter returns carrying a covered platter to the Customer.'
    ]
  }),
  photosynthesis: (req) => ({
    analogyTitle: 'Sun, Water, and Leaf Kitchen',
    explanation: 'A plant leaf acts as a mini-kitchen where sunlight and water are cooked into energy, releasing clean air.',
    mascotRole: 'Gardener Chef',
    mascotPose: 'Mascot is standing with a watering can, smiling happily.',
    mascotAccessories: ['watering can'],
    objects: [
      { name: 'Sun', role: 'Energy Source', position: 'Top Left', description: 'Sun with thin black rays and yellow highlights.' },
      { name: 'Plant Pot', role: 'The Leaf Factory', position: 'Center', description: 'A healthy plant in a simple clay pot.' },
      { name: 'Water Droplets', role: 'Inputs', position: 'Top Right', description: 'Simple cartoon rain droplets falling.' }
    ],
    visualFlow: [
      'Sunlight shines down on the plant leaf.',
      'Water droplets sink into the soil.',
      'Mascot waters the plant.',
      'Small bubbles marked "Oxygen" float upwards from the leaves.'
    ]
  }),
  ml: (req) => ({
    analogyTitle: 'The Sorting Machine',
    explanation: 'Machine learning acts as a filter where random shapes are fed in, the mascot trains a sorting box, and structured answers come out.',
    mascotRole: 'Systems Scientist',
    mascotPose: 'Mascot is wearing safety goggles and looking at a computer monitor.',
    mascotAccessories: ['safety goggles', 'computer monitor'],
    objects: [
      { name: 'Data Funnel', role: 'Input Stream', position: 'Left side', description: 'A funnel being filled with mixed geometric shapes.' },
      { name: 'Prediction Box', role: 'ML Model', position: 'Center', description: 'A smart box with gears showing sorting patterns.' },
      { name: 'Sorted Trays', role: 'Outputs', position: 'Right side', description: 'Separate baskets for sorted squares and circles.' }
    ],
    visualFlow: [
      'Mixed shape blocks flow into the Data Funnel.',
      'Shapes pass through the Prediction Box.',
      'Mascot adjusts a dial on the side of the Box.',
      'Perfectly grouped shapes land in their respective output trays.'
    ]
  }),
  success: (req) => ({
    analogyTitle: 'Climbing the Mountain of Goals',
    explanation: 'A startup or project success is represented as a winding trail to a high peak.',
    mascotRole: 'Adventurer Climber',
    mascotPose: 'Mascot is standing on the summit of a hill, holding a yellow flag.',
    mascotAccessories: ['yellow banner flag', 'small backpack'],
    objects: [
      { name: 'Mountain Path', role: 'The Journey', position: 'Bottom Left to Top Right', description: 'A winding dotted line representing milestones.' },
      { name: 'Clouds', role: 'Past Challenges', position: 'Bottom Left', description: 'Rain clouds below the summit.' },
      { name: 'Sunrise', role: 'Victory / Future', position: 'Background', description: 'A simple sun rising behind the summit.' }
    ],
    visualFlow: [
      'Mascot leaves footprints climbing the path.',
      'Mascot overcomes rain clouds.',
      'Mascot plants a yellow victory flag on the mountain top.'
    ]
  })
};

/**
 * Plans the visual illustration scene based on topic, audience, and presets.
 */
export function planIllustrationScene(request: RequestInput): VisualScenePlan {
  const topic = request.topic.toLowerCase();

  // Check presets
  if (topic.includes('api') || topic.includes('restaurant')) {
    return PRESETS.api(request);
  }
  if (topic.includes('photosynthesis') || topic.includes('plant') || topic.includes('leaf')) {
    return PRESETS.photosynthesis(request);
  }
  if (topic.includes('machine learning') || topic.includes(' ml') || topic.includes('data science') || topic.includes('pipeline')) {
    return PRESETS.ml(request);
  }
  if (topic.includes('success') || topic.includes('startup') || topic.includes('journey')) {
    return PRESETS.success(request);
  }

  // Generic Fallback Plan
  return {
    analogyTitle: `Visual Metaphor for ${request.topic}`,
    explanation: `An educational scene explaining the mechanics of: ${request.topic}.`,
    mascotRole: 'Curious Inspector',
    mascotPose: 'Mascot is holding a magnifying glass, examining the core subject.',
    mascotAccessories: ['magnifying glass'],
    objects: [
      { name: 'Core Concept Block', role: 'Main Subject', position: 'Center', description: 'A symbolic box representing the topic.' },
      { name: 'Input Source', role: 'Source Trigger', position: 'Left side', description: 'A simple box pointing an arrow towards the center.' }
    ],
    visualFlow: [
      'Input source triggers action.',
      'Mascot inspects the Core Concept Block using the magnifying glass.',
      'A path flows from the concept block showing the outcome.'
    ]
  };
}

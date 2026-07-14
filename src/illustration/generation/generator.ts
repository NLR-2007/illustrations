import path from 'path';
import { RequestInput } from '../../schemas/request-schema.js';
import { planIllustrationScene, VisualScenePlan } from '../planner/illustration-planner.js';
import { ImageGenerationProvider, ImageGenerationResult } from '../providers/provider-interface.js';
import { ManualProvider } from '../providers/manual-provider.js';
import { OpenAIProvider } from '../providers/openai-provider.js';
import { CustomHTTPProvider } from '../providers/custom-http-provider.js';

export function getProvider(): ImageGenerationProvider {
  const providerType = process.env.IMAGE_PROVIDER || 'manual';

  switch (providerType) {
    case 'openai-compatible':
      return new OpenAIProvider();
    case 'custom-http':
      return new CustomHTTPProvider();
    case 'manual':
    default:
      return new ManualProvider();
  }
}

/**
 * Builds the comprehensive positive prompt incorporating character and style locks.
 */
export function buildPositivePrompt(scene: VisualScenePlan, request: RequestInput): string {
  const objectDescriptions = scene.objects
    .map(obj => `- ${obj.name} (${obj.role}): placed on ${obj.position}. Detail: ${obj.description}`)
    .join('\n');

  const flowDescription = scene.visualFlow.map(f => `- ${f}`).join('\n');

  return `CONCEPT ILLUSTRATION: ${scene.analogyTitle} for topic "${request.topic}".
EXPLANATION: ${scene.explanation}
AUDIENCE: ${request.audience}

SCENE COMPOSITION:
- Main Character: Mascot playing the role of ${scene.mascotRole}.
- Mascot Pose: ${scene.mascotPose}
- Mascot Accessories: ${scene.mascotAccessories.join(', ') || 'none'}
- Other Objects:
${objectDescriptions}
- Visual Flow:
${flowDescription}

CHARACTER LOCK:
- Simple mascot with a rounded soft white body (MUST be a single continuous rounded shape, NOT a stacked head-and-body "snowman" structure).
- Large expressive solid-black circular eyes.
- Tiny friendly mouth (simple thin black hand-drawn smile).
- Thin imperfect hand-drawn black arms.
- Thin imperfect hand-drawn black legs.
- Two small bright yellow chest marks (critical identification; must be two small thin diagonal ticks, NOT large rectangular buttons).
- Proportions are short and friendly. No clothes except strictly required scene accessories.

STYLE LOCK:
- Minimal editorial hand-drawn line-art illustration style (outlines must look like thin, sketchy, hand-drawn lines, NOT thick clean geometric vector curves).
- Clean, 100% flat solid pure white background (#FFFFFF) with absolutely NO gradients, sky colors, shadows, or background elements.
- Crisp black outline drawing with bright yellow accent color only (#FFC21A).
- Simple composition with ample negative white space.
- NO photorealism, NO 3D rendering, NO complex gradients, NO background scenery.`;
}

/**
 * Builds the standard negative prompt.
 */
export function buildNegativePrompt(): string {
  return `photorealistic, 3d render, blender, digital painting, oil painting, watercolor, complex background, scenery, shadows, gradients, realistic human anatomy, extra limbs, extra arms, extra legs, malformed hands, fingers, clothes, shirts, pants, hats, shoes, socks, missing chest marks, different colors, red, blue, green, text, letters, words, watermarks, logos, signature, frame, border`;
}

/**
 * Generates illustration asset packages.
 */
export async function generateIllustration(request: RequestInput): Promise<ImageGenerationResult> {
  // 1. Plan the conceptual scene
  const scenePlan = planIllustrationScene(request);

  // 2. Build the locked prompts
  const prompt = buildPositivePrompt(scenePlan, request);
  const negativePrompt = buildNegativePrompt();

  // 3. Resolve output dimensions (default widescreen 16:9)
  let width = 1024;
  let height = 576;
  if (request.format === '4:3') {
    width = 1024;
    height = 768;
  } else if (request.format === '1:1') {
    width = 1024;
    height = 1024;
  } else if (request.format === '9:16') {
    width = 576;
    height = 1024;
  }

  // 4. Retrieve provider and execute
  const provider = getProvider();
  
  // Health check: fallback to manual if config fails
  const healthy = await provider.healthCheck();
  const activeProvider = healthy ? provider : new ManualProvider();

  return await activeProvider.generateImage({
    prompt,
    negativePrompt,
    width,
    height,
    outputName: request.outputName
  });
}

import fs from 'fs';
import path from 'path';
import { ImageGenerationProvider, ImageGenerationOptions, ImageGenerationResult } from './provider-interface.js';

export class ManualProvider implements ImageGenerationProvider {
  async generateImage(options: ImageGenerationOptions): Promise<ImageGenerationResult> {
    const outputDir = path.join('output', options.outputName);
    
    // Ensure output sub-directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const finalPromptPath = path.join(outputDir, 'final-image-prompt.md');
    const negativePromptPath = path.join(outputDir, 'negative-prompt.md');
    const scenePlanPath = path.join(outputDir, 'scene-plan.json');
    const manifestPath = path.join(outputDir, 'generation-manifest.json');

    // 1. Write final prompt
    fs.writeFileSync(finalPromptPath, `# Final Image Prompt\n\n\`\`\`\n${options.prompt}\n\`\`\`\n`);

    // 2. Write negative prompt
    const neg = options.negativePrompt || 'photorealistic, 3d render, text, logos';
    fs.writeFileSync(negativePromptPath, `# Negative Prompt\n\n\`\`\`\n${neg}\n\`\`\`\n`);

    // 3. Write scene plan JSON
    const scenePlan = {
      outputName: options.outputName,
      timestamp: new Date().toISOString(),
      prompt: options.prompt,
      negativePrompt: neg,
      suggestedResolution: `${options.width || 1024}x${options.height || 576}`,
      status: 'AWAITING_MANUAL_IMAGE_PLACEMENT',
      instructions: `Please generate an image using the prompt inside final-image-prompt.md. Save the resulting image as "${options.outputName}.png" inside the folder: ${outputDir}`
    };
    fs.writeFileSync(scenePlanPath, JSON.stringify(scenePlan, null, 2));

    // 4. Write manifest
    const manifest = {
      success: true,
      provider: 'manual',
      outputName: options.outputName,
      createdFiles: {
        prompt: finalPromptPath,
        negativePrompt: negativePromptPath,
        scenePlan: scenePlanPath
      },
      imagePlaceholderPath: path.join(outputDir, `${options.outputName}.png`),
      qaChecklist: [
        'Mascot face consists of large expressive black eyes and simple mouth.',
        'Mascot has two yellow chest marks.',
        'Outline is hand-drawn black line art.',
        'Color scheme is strictly black, white, and accent yellow (#FFC21A).',
        'Pure white background.',
        'No watermarks or typo text.'
      ]
    };
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

    return {
      success: true,
      imagePath: manifest.imagePlaceholderPath,
      manifestPath,
      promptUsed: options.prompt,
      negativePromptUsed: neg,
      providerUsed: 'manual'
    };
  }

  async editImage(imagePath: string, options: ImageGenerationOptions): Promise<ImageGenerationResult> {
    return this.generateImage(options);
  }

  async generateFromReferences(references: string[], options: ImageGenerationOptions): Promise<ImageGenerationResult> {
    return this.generateImage(options);
  }

  async healthCheck(): Promise<boolean> {
    return true; // Manual provider is always healthy
  }
}

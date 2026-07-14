import fs from 'fs';
import path from 'path';
import { ImageGenerationProvider, ImageGenerationOptions, ImageGenerationResult } from './provider-interface.js';

export class OpenAIProvider implements ImageGenerationProvider {
  private apiKey: string;
  private apiBase: string;
  private model: string;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || '';
    this.apiBase = process.env.OPENAI_API_BASE || 'https://api.openai.com/v1';
    this.model = process.env.IMAGE_MODEL || 'dall-e-3';
  }

  async generateImage(options: ImageGenerationOptions): Promise<ImageGenerationResult> {
    if (!this.apiKey) {
      return {
        success: false,
        promptUsed: options.prompt,
        negativePromptUsed: options.negativePrompt || '',
        providerUsed: 'openai-compatible',
        error: 'OPENAI_API_KEY environment variable is not defined.'
      };
    }

    const outputDir = path.join('output', options.outputName);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const imagePath = path.join(outputDir, `${options.outputName}.png`);
    const manifestPath = path.join(outputDir, 'generation-manifest.json');

    try {
      // Call DALL-E (or compatible) endpoint
      const response = await fetch(`${this.apiBase}/images/generations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          prompt: options.prompt,
          n: 1,
          size: `${options.width || 1024}x${options.height || 1024}`, // DALL-E 3 usually wants 1024x1024 or 1024x1792 etc.
          response_format: 'url'
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI API responded with status ${response.status}: ${errorText}`);
      }

      const resData = (await response.json()) as any;
      const imageUrl = resData?.data?.[0]?.url;

      if (!imageUrl) {
        throw new Error('No image URL returned from OpenAI API.');
      }

      // Download the image
      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        throw new Error(`Failed to download image from ${imageUrl}`);
      }

      const arrayBuffer = await imageResponse.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      fs.writeFileSync(imagePath, buffer);

      // Save manifest
      const manifest = {
        success: true,
        provider: 'openai-compatible',
        outputName: options.outputName,
        model: this.model,
        imagePath,
        timestamp: new Date().toISOString()
      };
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

      return {
        success: true,
        imagePath,
        manifestPath,
        promptUsed: options.prompt,
        negativePromptUsed: options.negativePrompt || '',
        providerUsed: 'openai-compatible'
      };

    } catch (e: any) {
      return {
        success: false,
        promptUsed: options.prompt,
        negativePromptUsed: options.negativePrompt || '',
        providerUsed: 'openai-compatible',
        error: e.message || String(e)
      };
    }
  }

  async editImage(imagePath: string, options: ImageGenerationOptions): Promise<ImageGenerationResult> {
    return this.generateImage(options);
  }

  async generateFromReferences(references: string[], options: ImageGenerationOptions): Promise<ImageGenerationResult> {
    return this.generateImage(options);
  }

  async healthCheck(): Promise<boolean> {
    return this.apiKey.length > 0;
  }
}

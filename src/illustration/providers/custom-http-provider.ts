import fs from 'fs';
import path from 'path';
import { ImageGenerationProvider, ImageGenerationOptions, ImageGenerationResult } from './provider-interface.js';

export class CustomHTTPProvider implements ImageGenerationProvider {
  private url: string;
  private headers: Record<string, string>;

  constructor() {
    this.url = process.env.CUSTOM_HTTP_URL || '';
    
    const rawHeaders = process.env.CUSTOM_HTTP_HEADERS || '{}';
    try {
      this.headers = JSON.parse(rawHeaders);
    } catch {
      this.headers = {};
    }
  }

  async generateImage(options: ImageGenerationOptions): Promise<ImageGenerationResult> {
    if (!this.url) {
      return {
        success: false,
        promptUsed: options.prompt,
        negativePromptUsed: options.negativePrompt || '',
        providerUsed: 'custom-http',
        error: 'CUSTOM_HTTP_URL environment variable is not defined.'
      };
    }

    const outputDir = path.join('output', options.outputName);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const imagePath = path.join(outputDir, `${options.outputName}.png`);
    const manifestPath = path.join(outputDir, 'generation-manifest.json');

    try {
      const response = await fetch(this.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.headers
        },
        body: JSON.stringify({
          prompt: options.prompt,
          negative_prompt: options.negativePrompt || '',
          width: options.width || 1024,
          height: options.height || 576,
          samples: 1
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Custom HTTP API responded with status ${response.status}: ${errorText}`);
      }

      const resData = (await response.json()) as any;
      
      // Parse output: could be a URL or a base64-encoded string
      // Supports standard formats like { image: "base64..." } or { url: "http..." } or { images: [ "base64..." ] }
      let imageBuffer: Buffer | null = null;

      if (resData.url) {
        const downloadRes = await fetch(resData.url);
        if (!downloadRes.ok) throw new Error(`Failed to download image from custom URL: ${resData.url}`);
        imageBuffer = Buffer.from(await downloadRes.arrayBuffer());
      } else if (resData.image) {
        imageBuffer = Buffer.from(resData.image, 'base64');
      } else if (Array.isArray(resData.images) && resData.images.length > 0) {
        imageBuffer = Buffer.from(resData.images[0], 'base64');
      } else if (resData.data?.[0]?.b64_json) {
        imageBuffer = Buffer.from(resData.data[0].b64_json, 'base64');
      } else if (resData.data?.[0]?.url) {
        const downloadRes = await fetch(resData.data[0].url);
        imageBuffer = Buffer.from(await downloadRes.arrayBuffer());
      }

      if (!imageBuffer) {
        throw new Error(`Unable to extract image data from Custom HTTP response. Response body: ${JSON.stringify(resData)}`);
      }

      fs.writeFileSync(imagePath, imageBuffer);

      // Save manifest
      const manifest = {
        success: true,
        provider: 'custom-http',
        outputName: options.outputName,
        urlUsed: this.url,
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
        providerUsed: 'custom-http'
      };

    } catch (e: any) {
      return {
        success: false,
        promptUsed: options.prompt,
        negativePromptUsed: options.negativePrompt || '',
        providerUsed: 'custom-http',
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
    return this.url.length > 0;
  }
}

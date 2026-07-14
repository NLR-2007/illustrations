export interface ImageGenerationOptions {
  prompt: string;
  negativePrompt?: string;
  width?: number;
  height?: number;
  outputName: string;
  references?: string[];
}

export interface ImageGenerationResult {
  success: boolean;
  imagePath?: string; // Path to generated image
  manifestPath?: string; // Path to generation metadata manifest
  promptUsed: string;
  negativePromptUsed: string;
  error?: string;
  providerUsed: string;
}

export interface ImageGenerationProvider {
  generateImage(options: ImageGenerationOptions): Promise<ImageGenerationResult>;
  editImage(imagePath: string, options: ImageGenerationOptions): Promise<ImageGenerationResult>;
  generateFromReferences(references: string[], options: ImageGenerationOptions): Promise<ImageGenerationResult>;
  healthCheck(): Promise<boolean>;
}

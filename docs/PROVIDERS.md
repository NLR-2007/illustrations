# Image Generation Providers

ExplainDraw isolates the image generation pipeline from specific service vendors. We support three provider modes, configurable via environment variables or request parameters.

---

## 1. Manual Provider (Default)

The `manual` provider does not call any external APIs. Instead, it generates a structured folder inside `output/` containing:

- `final-image-prompt.md`: The optimized, style-locked prompt ready to be pasted into OpenAI DALL-E, Midjourney, ChatGPT, or Canva.
- `negative-prompt.md`: Negative prompt parameters to exclude 3D shapes, photorealism, and extra colors.
- `scene-plan.json`: Position and action details of the mascot and objects.
- `generation-manifest.json`: Configuration tracking metadata and a placeholder path where you can save the downloaded image once generated.

This allows the CLI to run locally without internet access or paid API keys, and guarantees that the system always succeeds.

---

## 2. OpenAI-Compatible Provider

To automate generation using OpenAI (DALL-E 3) or any compatible server:
1. In your `.env` file, set `IMAGE_PROVIDER=openai-compatible`.
2. Provide your API key in `OPENAI_API_KEY`.
3. Set your target model with `IMAGE_MODEL` (e.g. `dall-e-3`).
4. (Optional) Provide `OPENAI_API_BASE` if you are using an alternative provider, proxy, or local LLM engine.

When active, the generator makes a POST request to the completions or image generation endpoints, downloads the image file, and saves it directly to the designated output folder.

---

## 3. Custom HTTP Provider

For enterprise setups, local stable-diffusion pipelines, or custom image generators:
1. Set `IMAGE_PROVIDER=custom-http`.
2. Provide `CUSTOM_HTTP_URL` (the API endpoint).
3. Set `CUSTOM_HTTP_HEADERS` as a stringified JSON object (e.g. headers with custom auth keys).

The request payload is structured as:
```json
{
  "prompt": "Optimized prompt here...",
  "negative_prompt": "Negative prompt here...",
  "width": 1024,
  "height": 576,
  "samples": 1
}
```
The endpoint is expected to return either a base64-encoded image string or a JSON payload containing the image download URL.

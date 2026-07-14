---
name: explaindraw
description: Create clear visual explanations from natural-language requests as mascot illustrations, editable PowerPoint diagrams, or hybrid illustration-plus-diagram slides. Use when a user asks to draw, illustrate, visualize, make a flowchart, architecture diagram, timeline, roadmap, conceptual analogy, educational visual, or hybrid explanatory slide, especially when they provide this repository URL and ask the AI to use it as a skill.
---

# ExplainDraw

Turn a user's topic into a finished visual artifact using the repository's white-background, hand-drawn visual language. Work from the installed skill directory; do not clone the repository again when these files are already available.

## Resolve the repository

1. Treat the directory containing this `SKILL.md` as the repository root.
2. Use the local copy when present. Never delete and reclone a usable local checkout.
3. If the user supplied a repository URL but no local files exist, clone it once into a writable temporary or workspace directory.
4. If cloning fails because DNS or network access is unavailable, continue from any existing checkout. If no checkout exists, request a repository archive or restored network access; do not pretend the skill was loaded.
5. Run commands from the repository root. If `node_modules/` is absent, run `npm install` before using the CLI. On Windows PowerShell, use `npm.cmd` instead of `npm` when script execution policy blocks `npm.ps1`.

## Choose one output mode

- **Illustration**: Use for analogy, story, emotion, educational scene, mascot, or conceptual explanation. Read [skills/illustration/SKILL.md](skills/illustration/SKILL.md), [docs/MASCOT_BIBLE.md](docs/MASCOT_BIBLE.md), and [docs/IMAGE_GENERATION_RULES.md](docs/IMAGE_GENERATION_RULES.md).
- **Diagram**: Use for flowchart, decision tree, architecture, pipeline, comparison, Venn diagram, timeline, roadmap, hierarchy, or any request emphasizing editable structure. Read [skills/diagram/SKILL.md](skills/diagram/SKILL.md) and only the applicable rule file in `skills/diagram/`.
- **Hybrid**: Use when both a memorable illustration and precise structured flow materially improve the explanation. Read [skills/hybrid/SKILL.md](skills/hybrid/SKILL.md), [skills/hybrid/HYBRID_RULES.md](skills/hybrid/HYBRID_RULES.md), and the illustration and diagram rules relevant to the request.

Respect an explicit user choice. Otherwise choose the smallest mode that communicates the concept clearly; do not force hybrid output.

## Build the artifact

### Illustration

1. Convert the request into a concise scene: one visual metaphor, one focal action, only essential objects, and ample negative space.
2. Preserve the mascot and style locks exactly. Use reference images from `references/mascot/` when the active image-generation tool accepts image references.
3. Prefer the host AI's available image-generation tool to create the actual bitmap. Ask it for a flat pure-white background, black sketch lines, and yellow `#FFC21A` accents only.
4. Save the generated image in `output/<output-name>/` when the tool returns a writable artifact.
5. When direct image generation is unavailable, create the deterministic prompt package instead:

   ```bash
   npm run generate -- --input <request.json>
   ```

   State clearly that this fallback produced generation-ready prompts, not a rendered image.

### Editable diagram

1. Translate the user's content into diagram JSON matching `src/schemas/diagram-schema.ts`. Keep labels short and preserve the actual logic; never invent system relationships merely to fill space.
2. Generate native editable PowerPoint shapes:

   ```bash
   npm run diagram -- --input <diagram.json>
   ```

3. Deliver the `.pptx` from `output/<input-name>/`. Do not rasterize editable diagrams unless the user explicitly asks for a preview image.

### Hybrid

1. Create request JSON matching `src/schemas/request-schema.ts` with `mode` set to `hybrid`.
2. Generate the split visual:

   ```bash
   npm run hybrid -- --input <request.json>
   ```

3. If an image-generation tool is available, render the illustration from the generated prompt and place or return it with the editable PowerPoint. Otherwise deliver the `.pptx` plus prompt package and identify the illustration placeholder.

## Natural-language requests

The user does not need to author JSON. Infer safe defaults and write a small temporary JSON input in the workspace:

- `audience`: `GENERAL`
- `purpose`: `presentation`
- `format`: `16:9`
- `editable`: `true`
- `outputName`: a lowercase, filesystem-safe slug

Ask a question only when a missing choice would materially change the artifact. Otherwise proceed and mention the chosen mode.

## Validate before delivery

1. Run `npm test` after code or schema changes.
2. For prompt packages, run:

   ```bash
   npm run validate -- --input output/<output-name>
   ```

3. For diagrams, verify every connection references a real node, no shapes overlap, all content stays inside slide bounds, and text is legible.
4. For illustrations, visually inspect the rendered result when possible. Reject extra colors, gradients, shadows, scenery, malformed mascot anatomy, missing two yellow chest marks, and accidental text.
5. Report the actual artifact paths and distinguish rendered images, editable decks, and prompt-only fallbacks.

## Non-negotiable visual rules

- Use a pure white `#FFFFFF` background, black/near-black linework, and yellow `#FFC21A` accents only.
- Keep illustration lines thin, imperfect, and hand-drawn.
- Draw the mascot as one continuous egg/potato-shaped body, never a snowman-shaped separate head and torso.
- Keep exactly two small organic yellow chest marks.
- Keep diagrams editable and do not flatten them into images by default.
- Avoid decorative complexity that weakens the explanation.

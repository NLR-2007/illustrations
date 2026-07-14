---
name: explaindraw
description: Generate presentation-ready mascot illustrations, flowcharts and structured diagrams, or hybrid visuals that combine an illustration with a diagram. Use when a user asks to illustrate, draw, visualize, explain a concept visually, create a flowchart, architecture diagram, timeline, roadmap, editable presentation diagram, or combined illustration-and-process visual in the ExplainDraw black-white-yellow style.
---

# ExplainDraw

Turn a topic into a finished visual artifact. Use the host's available image-generation, presentation, document, or file tools directly; do not require the user to write JSON or run repository code.

## Choose the mode

- Choose **illustration** for a metaphor, educational scene, story, emotion, or mascot-led explanation. Read [references/illustration-mode.md](references/illustration-mode.md).
- Choose **diagram** for a flowchart, decision tree, architecture, pipeline, comparison, timeline, roadmap, hierarchy, or structured process. Read [references/diagram-mode.md](references/diagram-mode.md).
- Choose **hybrid** when one composed visual needs both a memorable mascot scene and a precise structured flow. Read [references/hybrid-mode.md](references/hybrid-mode.md).

Respect an explicit mode. Otherwise choose the smallest mode that communicates the topic clearly.

## Apply the visual identity

Read [references/visual-language.md](references/visual-language.md) for every mode. Inspect the images in `assets/mascot/` before generating a mascot scene. Use them as strict character references when the image tool accepts reference images. Inspect the corresponding example in `assets/examples/` to calibrate composition density, spacing, and mode—not to copy its topic.

## Generate the artifact

1. Extract the core message, audience, required labels, aspect ratio, and whether editability matters.
2. Produce a compact internal visual plan. Keep one dominant idea per image or slide.
3. Generate the artifact immediately when the necessary tool is available:
   - Call the image-generation tool for illustrations and raster diagram previews.
   - Use presentation or file-generation tools for editable PowerPoint diagrams.
   - For hybrid output, render the illustration and combine it with a structured diagram in one 16:9 composition.
4. Save generated files under the current workspace in `output/<topic-slug>/` when filesystem output is available.
5. If a required tool is unavailable, provide the complete generation prompt or diagram specification and state exactly which artifact could not be rendered. Never claim that a placeholder is a finished image.
6. Review the result using [references/qa-checklist.md](references/qa-checklist.md). Regenerate or correct material violations before delivery.

## Preserve output behavior

- Default illustrations and hybrid visuals to 16:9 unless the user specifies another format.
- Keep flowchart semantics correct. Do not invent missing technical relationships merely to fill space.
- Prefer native editable PowerPoint shapes when the user requests a presentation flowchart.
- Do not flatten an editable diagram unless the user explicitly asks for an image preview.
- Report whether each result is a rendered image, editable presentation, or prompt-only fallback.

## Example invocations

```text
Use $explaindraw in illustration mode to explain photosynthesis to an eight-year-old.
Use $explaindraw in diagram mode to create an editable login flowchart for PowerPoint.
Use $explaindraw in hybrid mode to show how an API gateway carries a request.
```

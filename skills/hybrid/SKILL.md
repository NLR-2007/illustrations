# Hybrid Skill (SKILL.md)

This skill defines how an AI agent designs hybrid slides containing both an illustration prompt pack and editable PowerPoint shapes.

---

## WHEN TO USE THE SKILL
- When the visual router decides a request is of type `HYBRID`.
- When a user asks to explain a concept using both an analogy (to capture attention/concept) and a technical flowchart/structure (to show precise details).
- When a slide needs to combine a visual story with a structured process.

---

## WHAT INPUT IT NEEDS
A structured request JSON:
- `topic`: The core subject.
- `audience`: Target demographics.
- `layout`: The chosen layout template (e.g. `IllustrationLeft_DiagramRight`).
- `illustration`: Configuration/prompt metadata for the illustration block.
- `diagram`: Node and connector topology JSON.

---

## HOW TO PLAN
1. **Choose Template**: Select the template that fits the request (e.g., side-by-side for parallel comparison, top-bottom for journey progression).
2. **Allocate Coordinates**: Divide the widescreen canvas. Ensure the illustration bounding box and diagram bounding box do not overlap.
3. **Mascot Concept**: Design the mascot illustration prompt, focusing on storytelling.
4. **Diagram Structure**: Design the flowchart/architecture shapes that detail the mechanics.
5. **Color Sync**: Match color parameters of both components.

---

## WHAT OUTPUT TO CREATE
- A PowerPoint slide (`.pptx`) with:
  - Title text box.
  - Image block representing the illustration (using a placeholder or direct generated image path).
  - Native editable process/decision nodes and connectors.
- The manual prompt pack for the illustration side.

---

## WHAT MUST NEVER BE DONE
- **NEVER** combine both into a single flat image.
- **NEVER** allow the diagram shapes to overflow into the illustration pane.
- **NEVER** use conflicting color systems. Keep them aligned to the central palette.

---

## HOW TO VALIDATE THE RESULT
- Check that the coordinate boundaries for the left and right components are separate and do not cross.
- Ensure the slide title is aligned with both blocks.

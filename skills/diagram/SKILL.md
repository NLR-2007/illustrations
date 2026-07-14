# Diagram Skill (SKILL.md)

This skill defines how an AI agent designs structured, editable diagrams in PowerPoint slides.

---

## WHEN TO USE THE SKILL
- When the visual router decides a request is of type `DIAGRAM`.
- When the concept represents logical steps, state machines, flowcharts, architectures, comparisons, Venn diagrams, timelines, or roadmap schedules.
- When the user requires the outputs to remain editable (rectangles must remain editable rectangles, text must be searchable and editable, colors must be alterable).

---

## WHAT INPUT IT NEEDS
A JSON schema representing the diagram topology:
- `title`: The slide header.
- `type`: `flowchart`, `timeline`, `roadmap`, `architecture`, `venn`, etc.
- `nodes`: List of objects, each containing an `id`, `type` (`process`, `decision`, `start_end`, etc.), `text`, and optional `highlight` flag.
- `connections`: List of edges showing flow (`from`, `to`, and optional `label`).

---

## HOW TO PLAN
1. **Choose Layout Direction**:
   - Vertical (`top-to-bottom`) for standard flowcharts, trees, and decision hierarchies.
   - Horizontal (`left-to-right`) for timelines, roadmaps, and linear processes.
2. **Calculate Bounds**: Position nodes sequentially to prevent overlapping. Ensure nodes fit within the 16:9 safe margins.
3. **Route Connectors**: Connect nodes from bottom-to-top or right-to-left. Label decision paths clearly (e.g. Yes/No).
4. **Style Configuration**: Apply the black outline, white fill, and accent yellow rules.

---

## WHAT OUTPUT TO CREATE
- A native PowerPoint `.pptx` presentation containing editable shapes and connectors.
- Validation manifest detailing layout correctness.

---

## WHAT MUST NEVER BE DONE
- **NEVER** rasterize the diagram or embed it as a flat image.
- **NEVER** allow nodes to overlap or spill outside slide margins.
- **NEVER** use generic or random colors. Outlines must remain black, highlights yellow, backgrounds white.

---

## HOW TO VALIDATE THE RESULT
- Verify no node boundaries overlap.
- Check that all connections point to valid node IDs.
- Ensure text size is within safe bounds and doesn't wrap awkwardly.

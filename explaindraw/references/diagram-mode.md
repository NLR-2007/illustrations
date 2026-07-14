# Diagram mode

1. Extract nodes, node types, connections, branch labels, direction, and terminal states from the user's content.
2. Use standard semantics:
   - oval for start/end
   - rectangle for process
   - diamond for decision
   - parallelogram for input/output
   - cylinder for database
3. Prefer top-to-bottom flow for decisions and left-to-right flow for timelines or pipelines.
4. Keep labels short, connectors unambiguous, and branches visibly separated.
5. Use black outlines, white fills, and yellow only for the most important node or path.
6. Use `assets/examples/flowchart.png` as spacing and hierarchy calibration.
7. When presentation/file tools exist, create an editable `.pptx` with native shapes and connectors. Otherwise create a clean raster preview and disclose that it is not editable.
8. Check that every connector references a real node, shapes do not overlap, and text remains inside bounds.

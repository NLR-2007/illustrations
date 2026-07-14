# Editable Diagram Guide

ExplainDraw generates native, editable PowerPoint diagrams. This guide outlines how these diagrams are built, styled, and laid out.

---

## 1. Supported Shapes & Mapping

The diagram engine maps node types to native PowerPoint shapes:

| Diagram Node Type | PowerPoint Shape | Standard Use |
| :--- | :--- | :--- |
| `start_end` | Oval | Starting or ending point of a process. |
| `process` | Rectangle | Action, operation, or step. |
| `decision` | Diamond | Conditional step. Usually branches into 'Yes' and 'No' connectors. |
| `input_output` | Parallelogram | Data input or output action. |
| `database` | Cylinder / Can | Database or storage system. |
| `document` | Document | File or generated report. |
| `connector` | Circle | Small connecting point for complex flows. |
| `annotation` | Text frame | Floating notes or explanations. |

---

## 2. Layout Mathematics & Spacing

To prevent overlapping nodes and messy connectors, the engine uses a layered coordinate system:

- **Canvas Size**: Widescreen (13.33 inches wide by 7.5 inches high).
- **Safe Margins**: `0.8 inches` margin on all sides. Printable width: `11.73 inches`, height: `5.9 inches`.
- **Node Sizing**: Standard node is `2.0 inches` wide and `1.0 inches` high.
- **Node Spacing**: Standard spacing is `1.2 inches` between nodes (edges).
- **Direction**:
  - `top-to-bottom` (default for deep trees/processes)
  - `left-to-right` (default for timelines, roadmaps, and shallow flows)

---

## 3. Connector Lines & Arrows

- Connectors are created as native editable PowerPoint lines with arrowhead terminals.
- In top-to-bottom layouts, lines leave from the **bottom center** of the source shape and enter the **top center** of the destination shape.
- In left-to-right layouts, lines connect from the **right center** to the **left center**.
- Decision branch labels (e.g. `Yes` and `No`) are positioned next to the connector lines using native text blocks to maintain full editability.

---

## 4. Text Fitting & Safety

To prevent text clipping or wrapping outside shape bounds:
1. **Constraint Checks**: Calculates text length relative to shape width.
2. **Font Resizing**: If a text string is too long for the shape at `12pt`, the engine drops the font size to `10pt` or `8pt` dynamically.
3. **Shape Enlargement**: If font resizing is insufficient, the engine expands the shape's width (up to `2.8 inches` maximum) and shifts downstream nodes to prevent collisions.
4. **Validation Failures**: If text still doesn't fit, the generator raises an warning or truncates the text and logs the error.

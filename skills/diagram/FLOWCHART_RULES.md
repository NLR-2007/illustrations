# Flowchart Rules (FLOWCHART_RULES.md)

This document contains standard rules for flowchart creation, layouts, shape assignments, and aesthetic design.

---

## 1. Shape Standards

Flowcharts must use these shapes consistently:

- **Oval (`start_end`)**: Represents the entry and exit points (Start / End).
- **Rectangle (`process`)**: Represents a process, action, or state change.
- **Diamond (`decision`)**: Represents a conditional branch. Must have at least two outbound connectors.
- **Parallelogram (`input_output`)**: Represents user input (e.g. entering details) or output (e.g. showing message).
- **Cylinder (`database`)**: Represents data storage or reads/writes.
- **Circle (`connector`)**: Connecting point between separate branches.
- **Arrow**: Direction of flow.

---

## 2. Layout & Routing Rules

- **Flow Direction**:
  - Prefer **top-to-bottom** flows for general logic.
  - Use **left-to-right** for linear processes with few decisions.
- **Spacing**: Keep nodes equally spaced (e.g., standard vertical gap of `1.2 inches`).
- **Alignments**: Center-align nodes along the primary axis.
- **Branch Labeling**:
  - Outbound paths from a `decision` shape (Diamond) **MUST** be labeled.
  - Prefer simple labels: **Yes** and **No**.
  - Position labels centered beside or above the arrow line.

---

## 3. Style Constraints

- **Outlines**: Always solid `#111111` (Black), width `1.5pt` or `2pt`.
- **Fills**: Pure white `#FFFFFF` by default.
- **Highlights**: Max one node highlighted using `#FFC21A` (Yellow) fill to mark the key outcome or success block.
- **No Overlaps**: Arrow lines must never cross each other or pass under/through other shapes.
- **Conciseness**: Keep labels to 1-4 words. Use annotations for long explanations.

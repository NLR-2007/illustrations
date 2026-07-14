# Architecture Diagram Rules

Guidelines for software architecture diagram structure, layout, and block styling.

---

## 1. Structural Layers

Architecture diagrams must be organized into logical layers, stacked from top to bottom:

1. **Client / User Tier**:
   - Web App, Mobile App, API client shapes.
   - Positioned at the top or leftmost side.
2. **Network / Security Tier**:
   - Load Balancer, Gateway, Firewall.
3. **Application / Microservices Tier**:
   - Backend APIs, workers, message brokers.
4. **Data / Storage Tier**:
   - Databases, caches, file systems.
   - Positioned at the bottom or rightmost side.

---

## 2. Shape Code Mapping

- **Clients**: Standard Rectangles or rounded rectangles representing user devices.
- **Microservices**: Rectangles with solid black outlines.
- **Queues / Streams**: Long horizontal capsules.
- **Databases**: cylinders/cans (`database` shape).

---

## 3. Placement & Connector Flow

- Align elements in the same tier along the horizontal center line.
- Connectors flow downwards to indicate request pipelines, or upwards to indicate data returns.
- Group boxes can be drawn as larger rectangles with a light gray dashed border (`#E8E8E8`) and text labels in `#666666` to mark subnet boundaries or service clusters.

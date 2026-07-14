# Getting Started with ExplainDraw

ExplainDraw is an AI Visual Explanation System that generates:
1. **Mascot-based illustrations** (via a Prompt consistency pipeline)
2. **Editable PowerPoint diagrams** (via programmatic PptxGenJS shapes)
3. **Hybrid layouts** (combining the two)

---

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

---

## Installation

1. Clone or copy the project files to your system.
2. Install dependencies:
   ```bash
   npm install
   ```

---

## Workspace Setup

Before generating mascot illustrations, you should place references of the mascot and scenes:
- Mascot references: Put images in `references/mascot/`
- Scene references: Put images in `references/scenes/`

These references are analyzed by the AI provider to maintain style consistency.

---

## Basic CLI Commands

ExplainDraw comes with a command-line interface. To run it:

### 1. Generating diagrams from a JSON schema
```bash
npm run diagram -- --input examples/flowcharts/login-flow.json
```
This generates a PowerPoint deck (`output/login-flow.pptx`) with native, editable process blocks, arrows, and text.

### 2. Generating illustration prompt packs
```bash
npm run generate -- --input examples/requests/api-analogy.json
```
Under default `manual` mode, this creates a prompt pack in `output/` containing the optimized prompt, negative prompt, and layout instructions, which you can paste into ChatGPT/Midjourney.

### 3. Generating a hybrid presentation
```bash
npm run hybrid -- --input examples/hybrid/api-explanation.json
```
This produces a slide with a side-by-side layout: a conceptual mascot illustration prompt pack on the left, and an editable flowchart on the right.

### 4. Running Tests
```bash
npm test
```
This runs the full suite of layout calculations, schema validation, and collision tests.

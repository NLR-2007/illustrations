# Style Guide & Color System

ExplainDraw relies on a cohesive, premium visual language. This guide details the core design system used across both image generation and PowerPoint rendering.

---

## 1. Color Palette

The system defines six core colors, managed in a central configuration block so the accent color can be easily changed in one place.

| Color Token | Hex Code | Visual Role |
| :--- | :--- | :--- |
| **BLACK** | `#111111` | Primary text, node outlines, flow arrows, and core mascot lines. |
| **WHITE** | `#FFFFFF` | Slide background, mascot body fill, and node background fills. |
| **ACCENT YELLOW**| `#FFC21A` | Mascot chest marks, highlighted steps, or key callouts. |
| **LIGHT BG** | `#FAFAF8` | Slide content background or subtle section blocks. |
| **SECONDARY GRAY**| `#666666` | Secondary labels, descriptions, and metadata text. |
| **LIGHT GRAY** | `#E8E8E8` | Secondary borders, non-highlighted connectors, or divider lines. |

---

## 2. Typography

For PowerPoint presentation decks, use clean modern fonts. Avoid browser or OS defaults like Times New Roman.

- **Primary Font**: `Arial` or `Helvetica` (Safe web fonts that maintain formatting across platforms).
- **Preferred Font (if available)**: `Inter`, `Outfit`, or `Roboto` (Loaded via system presentation templates).
- **Title Sizing**: `24pt` to `36pt`, bold, left-aligned or centered, color `#111111`.
- **Node Text**: `10pt` to `14pt`, regular or medium, centered, color `#111111`.
- **Annotation Text**: `9pt` to `11pt`, italic or regular, left-aligned, color `#666666`.

---

## 3. Layout & White Space

- **Safe Margins**: Keep a minimum padding of `0.5 inches` on all sides of the 16:9 widescreen canvas.
- **Node Spacing**: Keep nodes separated by at least `0.8 inches` vertically or horizontally to prevent overlap.
- **Widescreen Default**: Standardize all outputs to 16:9 widescreen (`10.0 x 5.625` inches or `13.33 x 7.5` inches).
- **Minimalist Aesthetic**: White space is design. Do not pack slides with unnecessary icons, borders, or decorative shapes.

---

## 4. Color Accent Rules
- Use **ACCENT YELLOW** sparingly. A maximum of one node per diagram (or one key path) should use the accent yellow fill to highlight the final outcome or the most important process.
- Outlines of shapes must remain solid `#111111` (Black).

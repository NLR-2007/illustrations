# ExplainDraw: AI Illustration Skill (SKILL.md)

This skill defines how an AI agent designs mascot-based conceptual illustrations to explain topics or stories using the ExplainDraw visual language.

---

## 📅 WHEN TO USE THIS SKILL
- When generating visual analogies, technical metaphors, educational explanations, or conceptual scenes (e.g. "Explain API using a restaurant analogy").
- When the user requests a clean, wobbly line-art illustration with a mascot.

---

## 🎨 VISUAL IDENTITY & RULES (MANDATORY)

You must strictly adhere to the mascot and styling rules below. Avoid common rendering failures:

### 1. Mascot Characteristics (Locks)
- **Body**: **ONE single, continuous, rounded bean/egg/blob shape**. Do **NOT** stack a separate head circle on top of a body circle (no "snowman" structure). The eyes and mouth are drawn directly inside this single shape.
- **Eyes**: Large, expressive, solid-black circular eyes (no irises or white pupils).
- **Mouth**: A simple, thin, black hand-drawn smile line.
- **Chest Marks**: Exactly **two small, thin, diagonal yellow ticks** on the chest (Hex `#FFC21A`). Do **NOT** draw them as large rectangular buttons, squares, or badges.
- **Limbs**: Thin, imperfect, hand-drawn sketchy black arms and legs.
- **Clothing**: **None**. Do not add shirts, pants, hats, or scarves unless required by the scene context (e.g. safety goggles for science).

### 2. Illustration Style (Locks)
- **Style**: Minimalist, editorial, hand-drawn line-art outlines. Outlines must look like **thin, sketchy, imperfect hand-drawn ink/pencil strokes**, not thick, perfectly smooth geometric vector lines.
- **Background**: **100% solid flat pure white (`#FFFFFF`)**. Absolutely **NO** sky color, blue gradients, shadows, or background elements.
- **Colors**: Strictly black, white, and accent yellow (`#FFC21A`) highlights only. No other colors.

---

## 📝 PROMPT TEMPLATE

When writing image generation prompts for DALL-E or Midjourney, use this template:

### Positive Prompt:
```text
CONCEPT ILLUSTRATION: [Insert Analogy Title] for topic "[Insert User Topic]".
EXPLANATION: [Brief explanation of how the visual explains the topic]

SCENE COMPOSITION:
- Main Character: Mascot playing the role of [Insert Mascot Role].
- Mascot Pose: [Insert Mascot Pose]
- Mascot Accessories: [List accessories, e.g. laptop, magnifying glass]
- Other Objects: [List key metaphor objects, e.g. dining table, customer]
- Visual Flow: [List 2-4 flow steps with arrow indicators]

CHARACTER LOCK:
- Simple mascot with a rounded soft white body (MUST be a single continuous rounded shape, NOT a stacked head-and-body "snowman" structure).
- Large expressive solid-black circular eyes.
- Tiny friendly mouth (simple thin black hand-drawn smile).
- Thin imperfect hand-drawn black arms.
- Thin imperfect hand-drawn black legs.
- Two small bright yellow chest marks (critical identification; must be two small thin diagonal ticks, NOT large rectangular buttons).
- Proportions are short and friendly. No clothes except required accessories.

STYLE LOCK:
- Minimal editorial hand-drawn line-art illustration style (outlines must look like thin, sketchy, hand-drawn lines, NOT thick clean geometric vector curves).
- Clean, 100% flat solid pure white background (#FFFFFF) with absolutely NO gradients, sky colors, shadows, or background elements.
- Crisp black outline drawing with bright yellow accent color only (#FFC21A).
- Simple composition with ample negative white space.
- NO photorealistic elements, NO 3D rendering, NO complex gradients, NO background scenery.
```

### Negative Prompt:
```text
photorealistic, 3d render, blender, digital painting, oil painting, watercolor, complex background, scenery, shadows, gradients, realistic human anatomy, extra limbs, extra arms, extra legs, malformed hands, fingers, clothes, shirts, pants, hats, shoes, socks, missing chest marks, different colors, red, blue, green, text, letters, words, watermarks, logos, signature, frame, border
```

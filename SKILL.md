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
- **Body**: **ONE single, continuous, vertical egg-shaped or potato-shaped smooth white outline**. Do **NOT** stack a separate head circle on top of a body circle (no "snowman" structure). The eyes and mouth are drawn directly inside this single shape.
- **Eyes**: Large upright white ovals, each containing a large solid black circular pupil. Inside each black pupil, there are two tiny white circular light reflections (one larger at the top-left, one smaller at the bottom-right). Above the eyes are two thin curved black eyebrow lines.
- **Mouth**: A simple, thin, black hand-drawn curved smile line, positioned directly below the eyes.
- **Chest Marks**: Exactly **two small, organic yellow paint marks** on the center of the chest, stacked one above the other. Do **NOT** draw them as large rectangular buttons, squares, or code symbols (like `</>`, brackets, or gears), even if the scene is about coding or technology. The chest marks must always remain two yellow paint blobs.
- **Face/Cheeks**: Keep the face completely clean and minimal. Do **NOT** add red, pink, or yellow cheek blush marks, or makeup.
- **Limbs**: Thin, sketchy black arms ending in hands with 4 fingers each, and thin sketchy black legs ending in flat black feet.
- **Clothing**: **None**. Do not add shirts, pants, hats, or scarves unless required by the scene context.

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
- Simple mascot with a vertical egg-shaped or potato-shaped smooth white body outline (MUST be a single continuous rounded shape, NOT a stacked head-and-body "snowman" structure).
- Large upright oval white eyes, each containing a large solid black circular pupil. Inside each black pupil, there are two tiny white circular light reflections (one larger at the top-left, one smaller at the bottom-right). Above the eyes are two thin curved black eyebrow lines.
- Tiny friendly mouth (simple thin black hand-drawn curved smile line directly below the eyes).
- Thin sketchy hand-drawn black arms ending in hands with 4 fingers each.
- Thin sketchy hand-drawn black legs ending in flat black feet.
- Exactly two small, organic yellow paint marks on the center of the chest, stacked one above the other (critical identification; do NOT draw them as large rectangular buttons, code symbols, or badges).
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

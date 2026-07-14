# Illustration Skill (SKILL.md)

This skill defines how an AI agent designs mascot-based conceptual illustrations to tell a story or explain a topic.

---

## WHEN TO USE THE SKILL
- When the visual router decides a request is of type `ILLUSTRATION`.
- When the topic involves analogies (e.g. "API as a restaurant"), emotions (e.g. "team success"), journey milestones, or conceptual scenes (e.g. "explaining photosynthesis to a child").
- When the primary goal is visual storytelling rather than showing structured step-by-step logic flows.

---

## WHAT INPUT IT NEEDS
A structured request JSON matching the request schema:
- `topic`: The core concept (e.g., "how database indexing works").
- `audience`: Target demographics (e.g., `CHILD_8_12`, `PROFESSIONAL`, `TECHNICAL`).
- `purpose`: Why it's being made (e.g., `presentation`, `educational`).
- `outputName`: Target file name.

---

## HOW TO PLAN
1. **Analyze Audience**: Adapt complexity. If it's a child, choose a tangible analogy (e.g., library catalog for index). If technical, keep the objects accurate (e.g., books with index tags).
2. **Design Analogy**: Outline characters, objects, and positions.
3. **Mascot Placement**: Position the mascot as the main character interacting with the objects (e.g., mascot looking at a book).
4. **Style Locks**: Build the final prompt by attaching Mascot Bible and Style Guide rules.

---

## WHAT OUTPUT TO CREATE
1. **Scene Plan**: A JSON layout detailing character coordinates, posture, and items.
2. **Optimized Prompts**: Positive prompt containing character and style locks, plus a matching negative prompt.
3. **Manifest**: Metadata capturing generation configurations.

---

## WHAT MUST NEVER BE DONE
- **NEVER** add clothes or remove the two yellow chest marks from the mascot.
- **NEVER** draw the mascot as a "snowman" (do not stack a separate head circle on top of a body circle; it must be one single continuous vertical egg-shaped or potato-shaped smooth white body outline).
- **NEVER** draw the eyes as solid-black circles without reflections; they must be large upright white ovals containing black pupils with two tiny white light reflections in each.
- **NEVER** draw the arms without fingers; they must end in hand-drawn hands with 4 fingers each.
- **NEVER** draw the two yellow chest marks as large rectangular buttons, squares, code symbols (like `</>`, brackets, or gears), or badges; they must be exactly two small, organic yellow paint marks stacked vertically on the chest, regardless of the scene topic.
- **NEVER** add red, pink, or yellow cheek blush marks, makeup, or facial decorations.
- **NEVER** use blue sky backgrounds, shadows, or background gradients; the background must be flat, pure solid white (#FFFFFF).
- **NEVER** use heavy, perfectly smooth geometric vector lines; outlines must be thin, sketchy, and hand-drawn.
- **NEVER** use colors other than `#111111` (black), `#FFFFFF` (white), and `#FFC21A` (yellow).
- **NEVER** output photorealistic or 3D scene requests. Keep the prompt style strictly hand-drawn line-art.

---

## HOW TO VALIDATE THE RESULT
- Check if all required objects are present.
- Verify the style locks exist in the final prompt.
- Perform a QA score check using the Manual QA Review Checklist.

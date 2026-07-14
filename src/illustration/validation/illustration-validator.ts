import fs from 'fs';
import path from 'path';

export interface IllustrationValidationResult {
  styleScore: number; // 0-10
  identityScore: number; // 0-10
  colorCompliance: boolean;
  overallPass: boolean;
  checklistReportPath: string;
}

/**
 * Validates prompt compliance and outputs a manual QA checklist report.
 */
export function validateIllustrationPackage(
  outputName: string,
  promptText: string,
  negPromptText: string
): IllustrationValidationResult {
  const outputDir = path.join('output', outputName);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const reportPath = path.join(outputDir, 'validation-report.md');
  const promptLower = promptText.toLowerCase();

  // 1. Analyze prompt locks and keywords
  let styleScore = 0;
  if (promptLower.includes('minimal')) styleScore += 2;
  if (promptLower.includes('hand-drawn') || promptLower.includes('sketch')) styleScore += 2;
  if (promptLower.includes('white background')) styleScore += 2;
  if (promptLower.includes('line-art') || promptLower.includes('line art')) styleScore += 2;
  if (promptLower.includes('yellow') || promptLower.includes('#ffc21a')) styleScore += 2;

  let identityScore = 0;
  if (promptLower.includes('white body') || promptLower.includes('blob') || promptLower.includes('rounded')) identityScore += 3;
  if (promptLower.includes('black eyes') || promptLower.includes('circular eyes') || promptLower.includes('oval white eyes') || promptLower.includes('black pupils')) identityScore += 3;
  if (promptLower.includes('chest marks') || (promptLower.includes('chest') && promptLower.includes('marks'))) identityScore += 4;

  // Validate the prompt contract, not isolated color words. Correct prompts mention
  // forbidden colors inside negative instructions (for example, "NO gradients").
  const negativeLower = negPromptText.toLowerCase();
  const declaresAllowedPalette =
    promptLower.includes('white background') &&
    (promptLower.includes('black outline') || promptLower.includes('black line')) &&
    (promptLower.includes('yellow') || promptLower.includes('#ffc21a')) &&
    (promptLower.includes('only') || promptLower.includes('strictly'));
  const excludesForbiddenPalette =
    ['red', 'blue', 'green', 'gradient'].every(term =>
      negativeLower.includes(term) ||
      promptLower.includes(`no ${term}`) ||
      promptLower.includes(`do not draw ${term}`)
    );
  const colorCompliance = declaresAllowedPalette && excludesForbiddenPalette;

  const overallPass = styleScore >= 6 && identityScore >= 7 && colorCompliance;

  // 2. Generate detailed report markdown
  const reportContent = `# Visual Validation & QA Report

**Project Output Name**: \`${outputName}\`
**Validation Timestamp**: ${new Date().toISOString()}

---

## 1. Compliance Checklist Scores

| Category | Score | Pass Threshold | Status |
| :--- | :--- | :--- | :--- |
| **Style Consistency** | ${styleScore}/10 | 6/10 | ${styleScore >= 6 ? '✅ PASS' : '❌ FAIL'} |
| **Mascot Identity** | ${identityScore}/10 | 7/10 | ${identityScore >= 7 ? '✅ PASS' : '❌ FAIL'} |
| **Color Compliance** | ${colorCompliance ? '100%' : 'WARNING'} | 100% | ${colorCompliance ? '✅ PASS' : '⚠️ WARNING'} |

---

## 2. Dynamic Manual Quality Assurance Check

Since computer vision may not be active on your host system, you must review the generated image against these rules before publishing:

- **[ ] Mascot Face**: Large expressive solid-black circles. Tiny friendly smile. No realistic nostrils or ears.
- **[ ] Chest Marks**: Exactly two small bright yellow chest marks visible on the body.
- **[ ] Line Style**: Looks like clean, minimalist hand-drawn ink outlines. No 3D render look.
- **[ ] Color Palette**: Pure white background. Only black outlines, white fills, and yellow accents. No third-party colors (red/blue/green/gradients).
- **[ ] Artifacts**: No mangled fingers or extra limbs. No garbled text inside the image.

**Overall System Verification Status**: **${overallPass ? 'APPROVED FOR DEPLOYMENT' : 'REQUIRES MANUAL ADJUSTMENT'}**
`;

  fs.writeFileSync(reportPath, reportContent);

  return {
    styleScore,
    identityScore,
    colorCompliance,
    overallPass,
    checklistReportPath: reportPath
  };
}

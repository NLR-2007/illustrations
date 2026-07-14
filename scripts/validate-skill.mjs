import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = path.resolve(process.cwd(), 'explaindraw');
const required = [
  'SKILL.md',
  'agents/openai.yaml',
  'references/visual-language.md',
  'references/illustration-mode.md',
  'references/diagram-mode.md',
  'references/hybrid-mode.md',
  'references/qa-checklist.md',
  'assets/examples/illustration.png',
  'assets/examples/flowchart.png',
  'assets/examples/hybrid.png',
];

const failures = [];
for (const relative of required) {
  const target = path.join(root, relative);
  if (!fs.existsSync(target) || fs.statSync(target).size === 0) {
    failures.push(`Missing or empty: ${relative}`);
  }
}

const skillPath = path.join(root, 'SKILL.md');
if (fs.existsSync(skillPath)) {
  const skill = fs.readFileSync(skillPath, 'utf8');
  if (!/^---\r?\nname: explaindraw\r?\ndescription: .+\r?\n---/s.test(skill)) {
    failures.push('SKILL.md must have valid name and description frontmatter');
  }
  const links = [...skill.matchAll(/\]\(([^)]+\.md)\)/g)].map(match => match[1]);
  for (const link of links) {
    if (!fs.existsSync(path.resolve(root, link))) {
      failures.push(`Broken SKILL.md link: ${link}`);
    }
  }
}

const mascotDir = path.join(root, 'assets', 'mascot');
const mascotCount = fs.existsSync(mascotDir)
  ? fs.readdirSync(mascotDir).filter(name => /\.(png|jpe?g|webp)$/i.test(name)).length
  : 0;
if (mascotCount < 3) failures.push('Expected at least three mascot reference images');

if (failures.length) {
  console.error(failures.map(item => `- ${item}`).join('\n'));
  process.exit(1);
}

console.log(`ExplainDraw skill bundle is valid (${mascotCount} mascot references).`);

import fs from 'node:fs';
import path from 'node:path';

const root = path.join(process.cwd(), 'expansion-packs/ai-product-factory');
const strict = process.argv.includes('--strict');
const ignored = new Set(['inventory', 'schemas', 'policies', 'adapters', 'evals']);
const requirements = [
  '# Outcome',
  '# Use when',
  '# Do not use when',
  '# Inputs',
  '# Procedure',
  '# Execution defaults',
  '# Escalate when',
  '# Done when',
];

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  });
}

const findings = [];
for (const file of walk(root).filter((file) => path.basename(file) === 'SKILL.md')) {
  if (file.split(path.sep).some((part) => ignored.has(part))) continue;
  const text = fs.readFileSync(file, 'utf8');
  const relative = path.relative(process.cwd(), file);
  const lineCount = text.split(/\r?\n/).length;
  const isWorkflow = relative.includes(`${path.sep}workflows${path.sep}`);
  const limit = isWorkflow ? 180 : 100;
  for (const heading of requirements) if (!text.includes(heading)) findings.push(`${relative}: missing ${heading}`);
  if (/\bCursor\b/.test(text)) findings.push(`${relative}: vendor-specific Cursor instruction`);
  if (/always use subagents|must use subagents/i.test(text)) findings.push(`${relative}: mandatory subagent use`);
  if (/must run (the )?full test suite|always run (the )?full test suite/i.test(text))
    findings.push(`${relative}: unconditional full test suite`);
  if (lineCount > limit && !text.includes('lint-waiver:')) findings.push(`${relative}: ${lineCount} lines exceeds ${limit}`);
}
if (findings.length > 0) {
  console.error(findings.join('\n'));
  process.exit(strict ? 1 : 0);
}
console.log('APF skill lint passed.');

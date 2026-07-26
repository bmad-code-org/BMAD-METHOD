import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const root = path.join(process.cwd(), 'expansion-packs/ai-product-factory');
const findings = [];
for (const directory of ['adapters', 'policies']) {
  for (const file of fs.readdirSync(path.join(root, directory)).filter((file) => file.endsWith('.yaml'))) {
    const parsed = yaml.load(fs.readFileSync(path.join(root, directory, file), 'utf8'));
    if (!parsed?.version) findings.push(`${directory}/${file}: missing version`);
  }
}
for (const file of fs.readdirSync(path.join(root, 'schemas')).filter((file) => file.endsWith('.json'))) {
  try {
    const parsed = JSON.parse(fs.readFileSync(path.join(root, 'schemas', file), 'utf8'));
    if (!parsed.$schema || !parsed.required) findings.push(`schemas/${file}: missing JSON schema metadata`);
  } catch (error) {
    findings.push(`schemas/${file}: invalid JSON (${error.message})`);
  }
}
if (findings.length > 0) {
  console.error(findings.join('\n'));
  process.exit(1);
}
console.log('APF foundation files are valid.');

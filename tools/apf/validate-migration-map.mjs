import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const root = process.cwd();
const apfRoot = path.join(root, 'expansion-packs/ai-product-factory');
const mapPath = path.join(apfRoot, 'inventory/entity-migration-map.yaml');
const dispositions = new Set(['KEEP', 'REWRITE', 'MERGE', 'DELEGATE_TO_BMAD', 'CONVERT', 'DEPRECATE', 'DELETE']);

const map = yaml.load(fs.readFileSync(mapPath, 'utf8'));
const entries = [...Object.values(map.agents).flat(), ...map.workflows];
const ids = entries.map((entry) => entry.id);
const findings = [];
if (entries.length !== map.source.active_skills)
  findings.push(`expected ${map.source.active_skills} baseline entries, found ${entries.length}`);
for (const [index, entry] of entries.entries()) {
  if (!dispositions.has(entry.disposition)) findings.push(`invalid disposition at entry ${index}: ${entry.disposition}`);
  for (const field of ['id', 'target', 'rationale', 'compatibility'])
    if (!entry[field]) findings.push(`missing ${field}: ${entry.id ?? index}`);
  if (ids.indexOf(entry.id) !== index) findings.push(`duplicate map entry: ${entry.id}`);
}
if (findings.length > 0) {
  console.error(findings.join('\n'));
  process.exit(1);
}
console.log(`APF migration map valid: ${entries.length} baseline skills covered.`);

import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { classifyTask } from './task-router.mjs';

const fixture = yaml.load(
  fs.readFileSync(path.join(process.cwd(), 'expansion-packs/ai-product-factory/evals/router-fixtures.yaml'), 'utf8'),
);
const failures = [];
for (const item of fixture.cases) {
  const actual = classifyTask(item.request).mode;
  if (actual !== item.expected_mode) failures.push(`${item.id}: expected ${item.expected_mode}, got ${actual}`);
}
if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`APF router benchmark passed: ${fixture.cases.length} cases.`);

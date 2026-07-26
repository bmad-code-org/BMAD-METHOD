import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const requested = process.argv[2];
if (!requested) throw new Error('Usage: node tools/apf/resolve-legacy-skill.mjs <legacy-skill-id>');
const mapFile = path.join(process.cwd(), 'expansion-packs/ai-product-factory/inventory/entity-migration-map.yaml');
const map = yaml.load(fs.readFileSync(mapFile, 'utf8'));
const entries = [...Object.values(map.agents).flat(), ...map.workflows];
const entry = entries.find((candidate) => candidate.id === requested);
if (!entry) throw new Error(`Unknown APF v1 skill: ${requested}`);
console.log(yaml.dump({ requested, disposition: entry.disposition, target: entry.target, compatibility: entry.compatibility }));

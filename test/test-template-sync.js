/**
 * Sprint-status template sync check.
 *
 * The sprint-status template is a cross-skill contract: bmad-sprint-planning
 * owns the source of truth, and bmad-retrospective's tests round-trip a
 * vendored copy (skills must not reach into each other's directories —
 * PATH-05 in tools/skill-validator.md). This repo-level check keeps the
 * vendored fixture byte-identical to the source so the contract cannot drift.
 */

const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const source = path.join(root, 'src/bmm-skills/plan/bmad-sprint-planning/sprint-status-template.yaml');
const fixture = path.join(root, 'src/bmm-skills/ship/bmad-retrospective/scripts/tests/fixtures/sprint-status-template.yaml');

const sourceText = fs.readFileSync(source, 'utf-8');
const fixtureText = fs.readFileSync(fixture, 'utf-8');

if (sourceText !== fixtureText) {
  console.error('FAIL: sprint-status template fixture is out of sync.');
  console.error(`  source:  ${path.relative(root, source)}`);
  console.error(`  fixture: ${path.relative(root, fixture)}`);
  console.error('  Copy the source over the fixture to resolve.');
  process.exit(1);
}

console.log('ok: sprint-status template fixture matches the source template');

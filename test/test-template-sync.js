/**
 * Cross-skill vendored-copy sync check.
 *
 * Skills must not reach into each other's directories (PATH-05 in
 * tools/skill-validator.md), so a contract two skills share is vendored into
 * each. This repo-level check keeps every vendored copy byte-identical to its
 * source so the contract cannot drift:
 *
 * - The sprint-status template: bmad-sprint-planning owns the source of truth,
 *   and bmad-retrospective's tests round-trip a vendored copy.
 * - The deferred-work ledger entry contract: bmad-build owns the source, and
 *   bmad-code-review writes the same ledger from a vendored copy.
 */

const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');

const pairs = [
  {
    label: 'sprint-status template fixture',
    source: 'src/bmm-skills/plan/bmad-sprint-planning/sprint-status-template.yaml',
    copy: 'src/bmm-skills/ship/bmad-retrospective/scripts/tests/fixtures/sprint-status-template.yaml',
  },
  {
    label: 'deferred-work entry contract',
    source: 'src/bmm-skills/ship/bmad-build/references/deferred-work-entry.md',
    copy: 'src/bmm-skills/ship/bmad-code-review/references/deferred-work-entry.md',
  },
];

let failed = false;

for (const { label, source, copy } of pairs) {
  const sourceText = fs.readFileSync(path.join(root, source), 'utf-8');
  const copyText = fs.readFileSync(path.join(root, copy), 'utf-8');

  if (sourceText !== copyText) {
    failed = true;
    console.error(`FAIL: ${label} is out of sync.`);
    console.error(`  source: ${source}`);
    console.error(`  copy:   ${copy}`);
    console.error('  Copy the source over the copy to resolve.');
    continue;
  }

  console.log(`ok: ${label} matches its source`);
}

if (failed) process.exit(1);

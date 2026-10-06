/**
 * README diagram export stays English-only.
 *
 * Usage: node docs-site/test/test-export-readme-diagrams.mjs
 */

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const siteRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = join(siteRoot, '..');
const marker = ['data', 'i18n'].join('-');
const koreanExport = ['bmad-delivery-loop', 'ko.svg'].join('-');
const englishExport = join(repoRoot, 'docs/images/bmad-delivery-loop.svg');

const before = readFileSync(englishExport, 'utf8');
execFileSync('node', ['scripts/export-readme-diagrams.mjs'], { cwd: siteRoot, stdio: 'pipe' });
const after = readFileSync(englishExport, 'utf8');

assert.equal(after, before, 'Running the export again does not change the English diagram');
assert.equal(after.includes(marker), false, 'The English export has no translation attribute');
assert.equal(existsSync(join(repoRoot, 'docs/images', koreanExport)), false, 'The Korean export is not rewritten');

console.log('README diagram export checks passed.');

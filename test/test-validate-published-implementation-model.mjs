/**
 * Tests for validatePublishedImplementationModel.
 *
 * Usage: node test/test-validate-published-implementation-model.mjs
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { validatePublishedImplementationModel } from '../tools/validate-published-implementation-model.mjs';

const tests = [];

function test(name, run) {
  tests.push({ name, run });
}

function makeSiteDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'bmad-site-'));
}

test('succeeds on a clean site directory with HTML only', () => {
  const siteDir = makeSiteDir();
  try {
    fs.writeFileSync(path.join(siteDir, 'index.html'), '<html><body><p>Build a Change</p></body></html>\n');
    validatePublishedImplementationModel(siteDir);
  } finally {
    fs.rmSync(siteDir, { recursive: true, force: true });
  }
});

test('throws with file:line when HTML contains an obsolete implementation term', () => {
  const siteDir = makeSiteDir();
  try {
    fs.writeFileSync(path.join(siteDir, 'index.html'), '<html><body><p>Quick Dev is gone</p></body></html>\n');
    assert.throws(
      () => validatePublishedImplementationModel(siteDir),
      (error) => {
        assert.match(error.message, /index\.html:1: Quick Dev/);
        return true;
      },
    );
  } finally {
    fs.rmSync(siteDir, { recursive: true, force: true });
  }
});

let failures = 0;

for (const { name, run } of tests) {
  try {
    run();
    console.log(`  \u001B[32m✓\u001B[0m ${name}`);
  } catch (error) {
    failures++;
    console.error(`  \u001B[31m✗\u001B[0m ${name}: ${error.message}`);
  }
}

if (failures > 0) {
  console.error(`\n${failures} implementation model test${failures === 1 ? '' : 's'} failed.`);
  process.exit(1);
}

console.log(`\nAll ${tests.length} implementation model tests passed.`);

/**
 * Site URL resolver regression tests.
 *
 * Usage: node test/test-site-url.mjs
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { findObsoleteImplementationTerms } from '../tools/validate-published-implementation-model.mjs';
import { getSiteUrl } from '../website/src/lib/site-url.mjs';

const originalSiteUrl = process.env.SITE_URL;
const originalRepository = process.env.GITHUB_REPOSITORY;
const tests = [];

function test(name, run) {
  tests.push({ name, run });
}

function setEnvironment(siteUrl, repository) {
  if (siteUrl === undefined) {
    delete process.env.SITE_URL;
  } else {
    process.env.SITE_URL = siteUrl;
  }

  if (repository === undefined) {
    delete process.env.GITHUB_REPOSITORY;
  } else {
    process.env.GITHUB_REPOSITORY = repository;
  }
}

function restoreEnvironment() {
  setEnvironment(originalSiteUrl, originalRepository);
}

test('removes a trailing slash from a root deployment URL', () => {
  setEnvironment('https://docs.example/', undefined);
  assert.equal(getSiteUrl(), 'https://docs.example');
});

test('removes repeated trailing slashes from a root deployment URL', () => {
  setEnvironment('https://docs.example////', undefined);
  assert.equal(getSiteUrl(), 'https://docs.example');
});

test('preserves a custom base path while removing trailing slashes', () => {
  setEnvironment('https://example.github.io/team/repo///', undefined);
  assert.equal(getSiteUrl(), 'https://example.github.io/team/repo');
});

test('leaves an already normalized override unchanged', () => {
  setEnvironment('https://docs.example', undefined);
  assert.equal(getSiteUrl(), 'https://docs.example');
});

test('prefers SITE_URL over the GitHub repository fallback', () => {
  setEnvironment('https://docs.example/', 'ignored/repository');
  assert.equal(getSiteUrl(), 'https://docs.example');
});

test('uses the GitHub Pages fallback when SITE_URL is empty', () => {
  setEnvironment('', 'owner/repository');
  assert.equal(getSiteUrl(), 'https://owner.github.io/repository');
});

test('uses the local development fallback when deployment variables are absent', () => {
  setEnvironment(undefined, undefined);
  assert.equal(getSiteUrl(), 'http://localhost:3000');
});

test('rejects a malformed GitHub repository fallback', () => {
  setEnvironment('', 'malformed');
  assert.throws(() => getSiteUrl(), /Invalid GITHUB_REPOSITORY format/);
});

for (const obsoleteTerm of ['bmad-quick-dev', 'bmad-dev-auto', 'Quick Dev', 'Dev Auto']) {
  test(`published-model validation rejects ${obsoleteTerm}`, () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'bmad-published-model-'));
    fs.writeFileSync(path.join(directory, 'fixture.html'), `<p>${obsoleteTerm}</p>`, 'utf8');
    assert.ok(findObsoleteImplementationTerms(directory).some(({ match }) => match === obsoleteTerm));
  });
}

test('published-model validation accepts canonical Build terminology', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'bmad-published-model-'));
  fs.writeFileSync(path.join(directory, 'fixture.html'), '<p>bmad-build and bmad-build-auto</p>', 'utf8');
  assert.deepEqual(findObsoleteImplementationTerms(directory), []);
});

let failures = 0;

try {
  for (const { name, run } of tests) {
    try {
      run();
      console.log(`  \u001B[32m✓\u001B[0m ${name}`);
    } catch (error) {
      failures++;
      console.error(`  \u001B[31m✗\u001B[0m ${name}: ${error.message}`);
    }
  }
} finally {
  restoreEnvironment();
}

if (failures > 0) {
  console.error(`\n${failures} site URL test${failures === 1 ? '' : 's'} failed.`);
  process.exit(1);
}

console.log(`\nAll ${tests.length} site URL tests passed.`);

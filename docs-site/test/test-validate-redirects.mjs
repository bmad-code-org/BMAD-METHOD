/**
 * Tests for the redirect validator.
 *
 * Usage: node docs-site/test/test-validate-redirects.mjs
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { findRedirectProblems, parseRedirects } from '../scripts/validate-redirects.mjs';

const tests = [];

function test(name, run) {
  tests.push({ name, run });
}

const CONFIG = `
export default defineConfig({
  outDir: '../build/site',
  redirects: {
    '/old/page': \`\${basePath}new/page/\`,
    '/fr/old/page': \`\${basePath}fr/new/page/\`,
  },
  integrations: [],
});
`;

function makeFixture(files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'bmad-redirects-'));
  for (const [relativePath, content] of Object.entries(files)) {
    const fullPath = path.join(root, relativePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content);
  }
  return { root, docsDir: path.join(root, 'docs'), siteDir: path.join(root, 'site') };
}

function withFixture(files, run) {
  const { root, docsDir, siteDir } = makeFixture(files);
  try {
    return run({ docsDir, siteDir });
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

test('parses redirect entries relative to the base path', () => {
  assert.deepEqual(parseRedirects(CONFIG), [
    { from: '/old/page', to: 'new/page/' },
    { from: '/fr/old/page', to: 'fr/new/page/' },
  ]);
});

test('rejects a redirect line it cannot read', () => {
  const broken = CONFIG.replace('`${basePath}new/page/`', "'/new/page/'");
  assert.throws(() => parseRedirects(broken), /Unrecognized redirect line/);
});

test('passes when targets are built pages and sources are gone', () => {
  withFixture(
    {
      'site/new/page/index.html': '<html></html>',
      'site/fr/new/page/index.html': '<html></html>',
    },
    (dirs) => assert.deepEqual(findRedirectProblems(parseRedirects(CONFIG), dirs), []),
  );
});

test('reports a target that was not built', () => {
  withFixture(
    {
      'site/new/page/index.html': '<html></html>',
    },
    (dirs) => assert.deepEqual(findRedirectProblems(parseRedirects(CONFIG), dirs), ['/fr/old/page -> fr/new/page/: target was not built']),
  );
});

test('reports a target that is itself a redirect', () => {
  withFixture(
    {
      'site/new/page/index.html': '<meta http-equiv="refresh" content="0;url=/elsewhere/">',
      'site/fr/new/page/index.html': '<html></html>',
    },
    (dirs) => assert.deepEqual(findRedirectProblems(parseRedirects(CONFIG), dirs), ['/old/page -> new/page/: target is itself a redirect']),
  );
});

test('reports a source that still exists as a doc page', () => {
  withFixture(
    {
      'docs/old/page.md': '# old',
      'docs/fr/old/page/index.md': '# old',
      'site/new/page/index.html': '<html></html>',
      'site/fr/new/page/index.html': '<html></html>',
    },
    (dirs) =>
      assert.deepEqual(findRedirectProblems(parseRedirects(CONFIG), dirs), [
        '/old/page -> new/page/: source still exists as a doc page',
        '/fr/old/page -> fr/new/page/: source still exists as a doc page',
      ]),
  );
});

let failures = 0;

for (const { name, run } of tests) {
  try {
    run();
    console.log(`  [32m✓[0m ${name}`);
  } catch (error) {
    failures++;
    console.error(`  [31m✗[0m ${name}: ${error.message}`);
  }
}

if (failures > 0) {
  console.error(`\n${failures} redirect test${failures === 1 ? '' : 's'} failed.`);
  process.exit(1);
}

console.log(`\nAll ${tests.length} redirect tests passed.`);

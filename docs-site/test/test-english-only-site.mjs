/**
 * English-only site checks for the locale removal.
 *
 * Usage: node docs-site/test/test-english-only-site.mjs
 */

import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { parseRedirects } from '../scripts/validate-redirects.mjs';
import rehypeInlineDiagrams from '../src/rehype-inline-diagrams.js';

const LOCALE_PREFIX = /^\/(?:fr|cs|ko-kr|vi-vn|zh-cn)\//;
const tests = [];

function test(name, run) {
  tests.push({ name, run });
}

test('locale URLs have no redirect', () => {
  const source = readFileSync(new URL('../astro.config.mjs', import.meta.url), 'utf8');
  const locale = parseRedirects(source).filter((entry) => LOCALE_PREFIX.test(entry.from));
  assert.deepEqual(locale, []);
});

test('a diagram keeps its English text when locales are omitted', () => {
  const root = mkdtempSync(join(tmpdir(), 'bmad-en-diagram-'));
  try {
    mkdirSync(join(root, 'src', 'diagrams'), { recursive: true });
    writeFileSync(join(root, 'src', 'diagrams', 'flow.svg'), '<svg class="bmad-diagram" viewBox="0 0 10 10"><text>Start</text></svg>');
    const tree = {
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'img',
          properties: { src: '/diagrams/flow.svg', alt: 'a diagram' },
          children: [],
        },
      ],
    };
    rehypeInlineDiagrams({ root })(tree, { path: '/project/docs/build/a-change.md' });
    assert.equal(tree.children[0].tagName, 'svg');
    assert.match(JSON.stringify(tree), /"value":"Start"/);
  } finally {
    rmSync(root, { recursive: true, force: true });
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
  console.error(`\n${failures} English-only site test${failures === 1 ? '' : 's'} failed.`);
  process.exit(1);
}

console.log(`\nAll ${tests.length} English-only site tests passed.`);

/**
 * Tests for the locale coverage guard.
 *
 * Usage: node docs-site/test/test-validate-locale-coverage.mjs
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { diffAgainstBaseline, findFallbacks, summarise, validateLocaleCoverage } from '../scripts/validate-locale-coverage.mjs';

const tests = [];

function test(name, run) {
  tests.push({ name, run });
}

/** A built page whose `<main>` declares `lang`, as Starlight emits it. */
function page(lang) {
  return `<!doctype html><html lang="fr-FR"><body><main data-pagefind-body lang="${lang}" dir="ltr">x</main></body></html>`;
}

function withFixture(files, run) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'bmad-locale-'));
  try {
    for (const [relativePath, content] of Object.entries(files)) {
      const full = path.join(root, relativePath);
      fs.mkdirSync(path.dirname(full), { recursive: true });
      fs.writeFileSync(full, content);
    }
    return run(root);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

test('reports a page whose content language is not the locale', () => {
  withFixture(
    {
      'site/fr/start/install-bmad/index.html': page('en'),
      'site/fr/how-to/install-bmad/index.html': page('fr-FR'),
    },
    (root) => {
      const found = findFallbacks(path.join(root, 'site'));
      assert.deepEqual(found.fr, ['start/install-bmad']);
    },
  );
});

test('treats a page with no <main lang> as nothing to check', () => {
  withFixture({ 'site/fr/404/index.html': '<!doctype html><html lang="fr-FR"><body><main>x</main></body></html>' }, (root) =>
    assert.deepEqual(findFallbacks(path.join(root, 'site')).fr, []),
  );
});

test('reports the locale index itself', () => {
  withFixture({ 'site/cs/index.html': page('en') }, (root) => assert.deepEqual(findFallbacks(path.join(root, 'site')).cs, ['index']));
});

test('leaves a locale with no build output empty rather than failing', () => {
  withFixture({ 'site/fr/index.html': page('fr-FR') }, (root) => {
    const found = findFallbacks(path.join(root, 'site'));
    assert.deepEqual(found.fr, []);
    assert.deepEqual(found['zh-cn'], []);
  });
});

test('counts a new fallback as added and a fixed one as resolved', () => {
  const { added, resolved } = diffAgainstBaseline({ fr: ['start/install-bmad'], cs: [] }, { fr: ['plan/research-a-decision'], cs: [] });
  assert.deepEqual(added, ['fr/start/install-bmad']);
  assert.deepEqual(resolved, ['fr/plan/research-a-decision']);
});

test('says nothing when the site matches the baseline exactly', () => {
  const { added, resolved } = diffAgainstBaseline({ fr: ['a', 'b'] }, { fr: ['b', 'a'] });
  assert.deepEqual(added, []);
  assert.deepEqual(resolved, []);
});

test('summarises translated against total routes per locale', () => {
  withFixture(
    {
      'site/fr/a/index.html': page('en'),
      'site/fr/b/index.html': page('fr-FR'),
      'site/fr/c/index.html': page('fr-FR'),
    },
    (root) => {
      const siteDir = path.join(root, 'site');
      const row = summarise(siteDir, findFallbacks(siteDir)).find((r) => r.locale === 'fr');
      assert.deepEqual(
        { total: row.total, translated: row.translated, english: row.english, share: row.share },
        { total: 3, translated: 2, english: 1, share: 33 },
      );
    },
  );
});

test('fails on a fallback the baseline does not record', () => {
  withFixture({ 'site/fr/start/install-bmad/index.html': page('en') }, (root) => {
    const baselinePath = path.join(root, 'baseline.json');
    fs.writeFileSync(baselinePath, '{}');
    assert.throws(
      () => validateLocaleCoverage(path.join(root, 'site'), { baselinePath }),
      /now serve English under another locale[\s\S]*fr\/start\/install-bmad/,
    );
  });
});

test('fails on a baseline entry that no longer falls back', () => {
  withFixture({ 'site/fr/start/install-bmad/index.html': page('fr-FR') }, (root) => {
    const baselinePath = path.join(root, 'baseline.json');
    fs.writeFileSync(baselinePath, JSON.stringify({ fr: ['start/install-bmad'] }));
    assert.throws(
      () => validateLocaleCoverage(path.join(root, 'site'), { baselinePath }),
      /no longer falling back[\s\S]*fr\/start\/install-bmad/,
    );
  });
});

test('passes when the fallbacks are exactly the ones recorded', () => {
  withFixture({ 'site/fr/start/install-bmad/index.html': page('en') }, (root) => {
    const baselinePath = path.join(root, 'baseline.json');
    fs.writeFileSync(baselinePath, JSON.stringify({ fr: ['start/install-bmad'] }));
    assert.doesNotThrow(() => validateLocaleCoverage(path.join(root, 'site'), { baselinePath }));
  });
});

test('--update rewrites the baseline instead of failing', () => {
  withFixture({ 'site/fr/start/install-bmad/index.html': page('en') }, (root) => {
    const baselinePath = path.join(root, 'baseline.json');
    fs.writeFileSync(baselinePath, '{}');
    validateLocaleCoverage(path.join(root, 'site'), { baselinePath, update: true });
    assert.deepEqual(JSON.parse(fs.readFileSync(baselinePath, 'utf-8')).fr, ['start/install-bmad']);
  });
});

test('treats a missing baseline as recording no gaps at all', () => {
  withFixture({ 'site/fr/a/index.html': page('en') }, (root) => {
    assert.throws(
      () =>
        validateLocaleCoverage(path.join(root, 'site'), {
          baselinePath: path.join(root, 'does-not-exist.json'),
        }),
      /fr\/a/,
    );
  });
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
  console.error(`\n${failures} locale coverage test${failures === 1 ? '' : 's'} failed.`);
  process.exit(1);
}

console.log(`\nAll ${tests.length} locale coverage tests passed.`);

import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { writeFileSync, unlinkSync, mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

const DIR = fileURLToPath(new URL('.', import.meta.url));
const SCRIPT = join(DIR, 'validate-dead-code.mjs');
const CATALOG = join(DIR, 'pitfalls-catalog.json');
const TMP = tmpdir();

let tmpDir;

function uniqueFile(prefix = 'candidates') {
  return join(tmpDir, `${prefix}-${crypto.randomUUID()}.json`);
}

function writeUnique(data, prefix = 'candidates') {
  const p = uniqueFile(prefix);
  writeFileSync(p, JSON.stringify(data));
  return p;
}

function runScript(candidates, catalogPath = CATALOG) {
  const candidatesFile = writeUnique(candidates);
  const args = ['--candidates', candidatesFile, '--catalog', catalogPath];
  const stdout = execFileSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8', timeout: 5000 });
  try { unlinkSync(candidatesFile); } catch {}
  return JSON.parse(stdout.trim());
}

function runScriptExpectFail(candidates) {
  const candidatesFile = writeUnique(candidates);
  try {
    execFileSync(process.execPath, [SCRIPT, '--candidates', candidatesFile, '--catalog', CATALOG], { encoding: 'utf8', timeout: 5000 });
    try { unlinkSync(candidatesFile); } catch {}
    return { exitCode: 0 };
  } catch (e) {
    try { unlinkSync(candidatesFile); } catch {}
    return { exitCode: e.status || 1, stdout: e.stdout || '', stderr: e.stderr || '' };
  }
}

before(() => {
  tmpDir = mkdtempSync(join(TMP, 'vdc-test-'));
});

after(() => {
  rmSync(tmpDir, { recursive: true, force: true });
});

describe('validate-dead-code.mjs', () => {
  it('should classify all candidates as FALSE_POS when they match catalog patterns', () => {
    const candidates = [
      { name: 'BUILDERS', kind: 'Function', file: 'src/dispatch.ts', line: 42 },
      { name: 'CopyIcon', kind: 'Function', file: 'src/components/icon.tsx', line: 15 },
      { name: 'handler', kind: 'Function', file: 'app/api/route.ts', line: 1 },
      { name: 'observe', kind: 'Function', file: 'vitest.setup.ts', line: 5 }
    ];
    const result = runScript(candidates);
    assert.equal(result.status, 'clean');
    assert.equal(result.total_candidates, 4);
    assert.equal(result.classified.false_positive, 4);
    assert.equal(result.classified.suspect, 0);
    assert.equal(result.classified.ghost, 0);
    assert.equal(result.false_positives.length, 4);
    assert.equal(result.suspects.length, 0);
    assert.equal(result.ghosts.length, 0);
    assert.ok(result.false_positives.every(fp => fp.pitfall_id));
    assert.ok(result.false_positives.every(fp => fp.reason));
  });

  it('should classify mixed candidates correctly', () => {
    const testFile = join(tmpDir, 'test-symbol.ts');
    writeFileSync(testFile, 'export function foo() {}');
    try {
      const candidates = [
        { name: 'dispatchByType', kind: 'Function', file: 'src/dispatch.ts', line: 10 },
        { name: 'realDeadFunction', kind: 'Function', file: testFile, line: 1 },
        { name: 'nonExistentFunc', kind: 'Function', file: join(tmpDir, 'deleted.ts'), line: 20 }
      ];
      const result = runScript(candidates);
      assert.equal(result.status, 'needs_review');
      assert.equal(result.total_candidates, 3);
      assert.equal(result.classified.false_positive, 1);
      assert.equal(result.classified.suspect, 1);
      assert.equal(result.classified.ghost, 1);

      assert.equal(result.false_positives.length, 1);
      assert.equal(result.false_positives[0].name, 'dispatchByType');
      assert.equal(result.false_positives[0].pitfall_id, 'record-dispatch-001');

      assert.equal(result.suspects.length, 1);
      assert.equal(result.suspects[0].name, 'realDeadFunction');

      assert.equal(result.ghosts.length, 1);
      assert.equal(result.ghosts[0].name, 'nonExistentFunc');
      assert.ok(result.ghosts[0].reason);
    } finally {
      try { unlinkSync(testFile); } catch {}
    }
  });

  it('should return clean status with zero counts for empty candidates array', () => {
    const result = runScript([]);
    assert.equal(result.status, 'clean');
    assert.equal(result.total_candidates, 0);
    assert.equal(result.classified.suspect, 0);
    assert.equal(result.classified.false_positive, 0);
    assert.equal(result.classified.ghost, 0);
  });

  it('should exit with error for malformed JSON input', () => {
    const badFile = uniqueFile('bad');
    writeFileSync(badFile, '{not json}');
    try {
      execFileSync(process.execPath, [SCRIPT, '--candidates', badFile, '--catalog', CATALOG], { encoding: 'utf8', timeout: 5000 });
      assert.fail('Should have thrown');
    } catch (e) {
      assert.equal(e.status, 1);
      const stderr = e.stderr || '';
      assert.ok(stderr.includes('ERROR'));
    } finally {
      try { unlinkSync(badFile); } catch {}
    }
  });

  it('should exit with error for missing candidates file', () => {
    const missingFile = uniqueFile('missing');
    try {
      execFileSync(process.execPath, [SCRIPT, '--candidates', missingFile, '--catalog', CATALOG], { encoding: 'utf8', timeout: 5000 });
      assert.fail('Should have thrown');
    } catch (e) {
      assert.equal(e.status, 1);
    }
  });

  it('should exit with error for missing pitfalls catalog', () => {
    const candidatesFile = writeUnique([]);
    const badCatalog = uniqueFile('nonexistent-catalog');
    try {
      execFileSync(process.execPath, [SCRIPT, '--candidates', candidatesFile, '--catalog', badCatalog], { encoding: 'utf8', timeout: 5000 });
      assert.fail('Should have thrown');
    } catch (e) {
      assert.equal(e.status, 1);
    } finally {
      try { unlinkSync(candidatesFile); } catch {}
    }
  });

  it('should handle candidate names with regex special characters', () => {
    const testFile = join(tmpDir, 'special.ts');
    writeFileSync(testFile, 'export function bar() {}');
    try {
      const candidates = [
        { name: 'foo.$bar[0]', kind: 'Function', file: testFile, line: 1 },
        { name: 'handler', kind: 'Function', file: 'route.ts', line: 1 },
        { name: '$invalid()', kind: 'Function', file: testFile, line: 2 }
      ];
      const result = runScript(candidates);
      assert.equal(result.status, 'needs_review');
      assert.equal(result.total_candidates, 3);
      assert.equal(result.classified.false_positive, 1);
      assert.equal(result.classified.suspect, 2);
      assert.equal(result.classified.ghost, 0);
    } finally {
      try { unlinkSync(testFile); } catch {}
    }
  });

  it('should use first match when candidate matches multiple pitfalls', () => {
    const candidates = [
      { name: 'handler', kind: 'Function', file: 'app/api/route.ts', line: 1 },
      { name: 'GET_https_api_example_com_users', kind: 'Variable', file: 'msw.ts', line: 5 },
      { name: 'observe', kind: 'Function', file: 'vitest.setup.ts', line: 3 }
    ];
    const result = runScript(candidates);
    assert.equal(result.status, 'clean');
    assert.equal(result.classified.false_positive, 3);
    assert.ok(result.false_positives[0].pitfall_id);
    assert.ok(result.false_positives[1].pitfall_id);
    assert.ok(result.false_positives[2].pitfall_id);
  });

  it('should handle null and undefined candidate entries gracefully', () => {
    const testFile = join(tmpDir, 'real-file.ts');
    writeFileSync(testFile, 'export function x() {}');
    try {
      const candidates = [
        null,
        undefined,
        42,
        'string',
        {},
        { name: 'realFunc', kind: 'Function', file: testFile, line: 1 }
      ];
      const result = runScript(candidates);
      assert.equal(result.status, 'needs_review');
      assert.equal(result.total_candidates, 6);
      assert.equal(result.classified.suspect, 1);
      assert.equal(result.classified.false_positive, 0);
      assert.equal(result.classified.ghost, 5);
      assert.equal(result.suspects[0].name, 'realFunc');
    } finally {
      try { unlinkSync(testFile); } catch {}
    }
  });

  it('should reject too-large candidates file', () => {
    const largeFile = uniqueFile('large');
    const largeData = [];
    for (let i = 0; i < 100001; i++) {
      largeData.push({ name: `func${i}`, kind: 'Function', file: 'src/test.ts' });
    }
    writeFileSync(largeFile, JSON.stringify(largeData));
    try {
      execFileSync(process.execPath, [SCRIPT, '--candidates', largeFile, '--catalog', CATALOG], { encoding: 'utf8', timeout: 5000 });
      assert.fail('Should have thrown');
    } catch (e) {
      assert.equal(e.status, 1);
      assert.ok((e.stderr || '').includes('Too many candidates') || (e.stdout || '').includes('MEMTRACE_MCP_ERROR_TIMEOUT'));
    } finally {
      try { unlinkSync(largeFile); } catch {}
    }
  });

  it('should validate --help flag prints usage', () => {
    const stdout = execFileSync(process.execPath, [SCRIPT, '--help'], { encoding: 'utf8', timeout: 5000 });
    assert.ok(stdout.includes('Usage:'));
    assert.ok(stdout.includes('--candidates'));
  });

  it('should validate --catalog flag with custom catalog', () => {
    const customCatalog = uniqueFile('custom-catalog');
    writeFileSync(customCatalog, JSON.stringify({
      version: '1.0.0',
      description: 'Custom test catalog',
      last_updated: '2026-05-20',
      categories: [
        {
          name: 'Custom Patterns',
          entries: [
            { id: 'custom-001', pattern: '^my[A-Z]', reason: 'Custom test pattern', examples: ['myFunc'] }
          ]
        }
      ]
    }));

    const testFile = join(tmpDir, 'test-file.ts');
    writeFileSync(testFile, 'export function regularFunc() {}');
    try {
      const candidates = [
        { name: 'myFunction', kind: 'Function', file: 'src/test.ts', line: 1 },
        { name: 'regularFunc', kind: 'Function', file: testFile, line: 10 }
      ];
      const result = runScript(candidates, customCatalog);
      assert.equal(result.classified.false_positive, 1);
      assert.equal(result.false_positives[0].name, 'myFunction');
      assert.equal(result.false_positives[0].pitfall_id, 'custom-001');
      assert.equal(result.classified.suspect, 1);
      assert.equal(result.suspects[0].name, 'regularFunc');
    } finally {
      try { unlinkSync(testFile); } catch {}
      try { unlinkSync(customCatalog); } catch {}
    }
  });
});

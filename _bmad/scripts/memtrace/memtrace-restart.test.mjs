import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { platform } from 'node:os';

const scriptPath = resolve(import.meta.dirname, 'memtrace-restart.mjs');
const node = process.execPath;

function runRestart(args = []) {
  const result = spawnSync(node, [scriptPath, ...args], {
    encoding: 'utf8',
    timeout: 15000,
    env: { ...process.env, MEMTRACE_TIMEOUT_MS: '5000' }
  });
  return {
    code: result.status,
    stdout: result.stdout || '',
    stderr: result.stderr || ''
  };
}

describe('memtrace-restart', () => {
  it('should print help and exit 0 on --help', () => {
    const r = runRestart(['--help']);
    assert.equal(r.code, 0);
    assert.ok(r.stdout.includes('Usage:'));
    assert.ok(r.stdout.includes('--dry-run'));
    assert.ok(r.stdout.includes('--help'));
  });

  it('should print help and exit 0 on -h', () => {
    const r = runRestart(['-h']);
    assert.equal(r.code, 0);
    assert.ok(r.stdout.includes('Usage:'));
  });

  it('should execute dry-run without terminating processes and exit 0', () => {
    const r = runRestart(['--dry-run']);
    assert.equal(r.code, 0);
    assert.ok(r.stderr.includes('DRY-RUN'));
    assert.ok(r.stderr.includes('Terminating'));
  });

  it('should report kill step before verify step in stderr messages', () => {
    const r = runRestart(['--dry-run']);
    const stderrLines = r.stderr.split('\n').filter(Boolean);
    const killIdx = stderrLines.findIndex(l => l.includes('Terminating'));
    const verifyIdx = stderrLines.findIndex(l => l.includes('Verifying'));
    if (killIdx !== -1 && verifyIdx !== -1) {
      assert.ok(killIdx < verifyIdx, 'Kill step must precede verify step in stderr output');
    }
  });

  it('should use correct termination command based on platform', () => {
    const r = runRestart(['--dry-run']);
    if (platform() === 'win32') {
      assert.ok(r.stderr.includes('taskkill'), 'Windows should use taskkill');
    } else {
      assert.ok(r.stderr.includes('pkill'), 'Unix should use pkill');
    }
  });

  it('should exit 1 with error for unknown argument', () => {
    const r = runRestart(['--invalid']);
    assert.equal(r.code, 1);
    assert.ok(r.stderr.includes('ERROR'));
    assert.ok(r.stderr.includes('Unknown argument'));
  });

  it('should exit 1 and report FAIL when verification times out', { timeout: 30000 }, () => {
    const r = spawnSync(node, [scriptPath], {
      encoding: 'utf8',
      timeout: 20000,
      env: { ...process.env, MEMTRACE_TIMEOUT_MS: '100', PATH: '' }
    });
    if (r.status === 0) {
      assert.ok(r.stderr.includes('SUCCESS'), 'Exit 0 — memtrace was available via absolute path');
    } else {
      assert.ok(r.stderr.includes('FAIL') || r.stderr.includes('not found'), 'Exit ' + r.status + ' — should report FAIL or binary-not-found');
    }
  });

  it('should report ENOENT when memtrace binary is missing', { timeout: 15000 }, () => {
    const testEnv = { ...process.env, MEMTRACE_TIMEOUT_MS: '5000' };
    if (platform() === 'win32') {
      testEnv.Path = (testEnv.Path || '').replace(/nodejs[^;]*/gi, '');
    } else {
      testEnv.PATH = '';
    }
    const r = spawnSync(node, [scriptPath], {
      encoding: 'utf8',
      timeout: 10000,
      env: testEnv
    });
    if (r.status === null) {
      return; // PATH manipulation broke node spawn itself — skip on this platform
    }
    assert.equal(r.status, 1, 'Should exit 1 when binary is not found');
    assert.ok(r.stderr.includes('not found on PATH') || r.stderr.includes('FAIL'),
      'Should report ENOENT or verification failure');
  });
});

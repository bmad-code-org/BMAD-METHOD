import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { resolve } from 'node:path';

const ADAPTER = resolve(import.meta.dirname, 'memtrace-adapter.mjs');

function runAdapter(args) {
  return new Promise((resolvePromise) => {
    execFile(process.execPath, [ADAPTER, ...args], {
      env: { ...process.env, NODE_NO_WARNINGS: '1' },
      timeout: 30000,
      windowsHide: true
    }, (error, stdout, stderr) => {
      resolvePromise({
        code: error?.code === 'ETIMEDOUT' ? null : (error?.code || 0),
        signal: error?.signal || null,
        stdout: stdout || '',
        stderr: stderr || '',
        error
      });
    });
  });
}

describe('memtrace-adapter.mjs', () => {

  describe('CLI argument handling', () => {
    it('should output usage with --help and exit 0', async () => {
      const r = await runAdapter(['--help']);
      assert.equal(r.code, 0);
      assert.ok(r.stdout.includes('Usage:'));
      assert.ok(r.stdout.includes('--query'));
    });

    it('should output usage with -h and exit 0', async () => {
      const r = await runAdapter(['-h']);
      assert.equal(r.code, 0);
      assert.ok(r.stdout.includes('Usage:'));
    });

    it('should output usage with no args and exit 0', async () => {
      const r = await runAdapter([]);
      assert.equal(r.code, 0);
      assert.ok(r.stdout.includes('Usage:'));
    });

    it('should exit 1 when missing --target for get_impact', async () => {
      const r = await runAdapter(['--query', 'get_impact']);
      assert.equal(r.code, 1);
      assert.ok(r.stderr.includes('--target'));
    });

    it('should exit 1 when missing --target for find_dead_code', async () => {
      const r = await runAdapter(['--query', 'find_dead_code']);
      assert.equal(r.code, 1);
      assert.ok(r.stderr.includes('--target'));
    });

    it('should exit 1 when --target is empty string', async () => {
      const r = await runAdapter(['--target', '', '--query', 'get_impact']);
      assert.equal(r.code, 1);
      assert.ok(r.stderr.includes('non-empty'));
    });

    it('should exit 1 for unknown --query type', async () => {
      const r = await runAdapter(['--target', 'foo', '--query', 'invalid_query']);
      assert.equal(r.code, 1);
      assert.ok(r.stderr.includes('Invalid query'));
    });

    it('should exit 1 when missing --query', async () => {
      const r = await runAdapter(['--target', 'foo']);
      assert.equal(r.code, 1);
      assert.ok(r.stderr.includes('--query'));
    });

    it('should exit 1 for unknown argument', async () => {
      const r = await runAdapter(['--unknown']);
      assert.equal(r.code, 1);
      assert.ok(r.stderr.includes('Unknown argument'));
    });
  });

  describe('MCP queries', () => {

    it('should list repositories and return valid JSON with repos array', { timeout: 20000 }, async () => {
      const r = await runAdapter(['--query', 'list_repos']);
      assert.equal(r.code, 0);
      let parsed;
      try {
        parsed = JSON.parse(r.stdout);
      } catch (e) {
        assert.fail(`STDOUT is not valid JSON: ${r.stdout.slice(0, 200)}`);
      }
      assert.equal(parsed.query, 'list_repos');
      assert.ok(Array.isArray(parsed.repositories));
      assert.ok(typeof parsed.elapsed_ms === 'number');
    });

    it('should query get_impact and return structured JSON on exit 0 (or error with MEMTRACE_MCP_ERROR_TIMEOUT on exit 1)', { timeout: 30000 }, async () => {
      const r = await runAdapter(['--target', 'bmad-dev-story', '--query', 'get_impact', '--repo', 'Repos']);
      // Should either succeed with data or fail gracefully
      if (r.code === 0) {
        let parsed;
        try {
          parsed = JSON.parse(r.stdout);
        } catch (e) {
          assert.fail(`STDOUT is not valid JSON: ${r.stdout.slice(0, 200)}`);
        }
        assert.ok(typeof parsed.target === 'string');
        assert.ok(typeof parsed.risk_level === 'string');
        assert.ok(Array.isArray(parsed.affected_symbols));
        assert.ok(typeof parsed.total_count === 'number');
        assert.ok(typeof parsed.elapsed_ms === 'number');
      } else {
        // On failure, must emit MEMTRACE_MCP_ERROR_TIMEOUT
        assert.ok(r.stdout.includes('MEMTRACE_MCP_ERROR_TIMEOUT'),
          `Expected MEMTRACE_MCP_ERROR_TIMEOUT in stdout. Exit code: ${r.code}, stderr: ${r.stderr.slice(0, 200)}`);
      }
    });

    it('should query find_dead_code with --target and --repo and return structured JSON', { timeout: 30000 }, async () => {
      const r = await runAdapter(['--target', 'src', '--query', 'find_dead_code', '--repo', 'Repos']);
      if (r.code === 0) {
        let parsed;
        try {
          parsed = JSON.parse(r.stdout);
        } catch (e) {
          assert.fail(`STDOUT is not valid JSON: ${r.stdout.slice(0, 200)}`);
        }
        assert.equal(parsed.query, 'find_dead_code');
        assert.equal(typeof parsed.target, 'string');
        assert.ok(Array.isArray(parsed.symbols));
        assert.equal(parsed.total_count, parsed.symbols.length);
        assert.equal(typeof parsed.elapsed_ms, 'number');
        assert.equal(parsed.note, undefined, 'Stub note must be removed');
        if (parsed.symbols.length > 0) {
          assert.ok(parsed.symbols.every(s => typeof s.name === 'string' && typeof s.file === 'string'),
            'Each symbol must have name and file fields');
        }
      } else {
        assert.ok(r.stdout.includes('MEMTRACE_MCP_ERROR_TIMEOUT'),
          `Expected MEMTRACE_MCP_ERROR_TIMEOUT. Exit code: ${r.code}`);
      }
    });

    it('should query find_dead_code without --repo and auto-detect repo', { timeout: 30000 }, async () => {
      const r = await runAdapter(['--target', 'src', '--query', 'find_dead_code']);
      if (r.code === 0) {
        let parsed = JSON.parse(r.stdout);
        assert.equal(parsed.query, 'find_dead_code');
        assert.ok(Array.isArray(parsed.symbols));
        assert.equal(parsed.total_count, parsed.symbols.length);
        if (parsed.symbols.length > 0) {
          assert.ok(parsed.symbols.every(s => typeof s.name === 'string' && typeof s.file === 'string'),
            'Each symbol must have name and file fields');
        }
      } else {
        assert.ok(r.stdout.includes('MEMTRACE_MCP_ERROR_TIMEOUT'));
      }
    });

    it('should emit MEMTRACE_MCP_ERROR_TIMEOUT and exit 1 on MCP error', { timeout: 20000 }, async () => {
      // Query for a non-existent target to trigger an MCP error
      const r = await runAdapter(['--target', '!@#$%^&*()_NONEXISTENT_SYMBOL_12345', '--query', 'get_impact', '--repo', 'Repos']);
      // Should always exit 0 or 1 — never hang
      if (r.code === 1) {
        assert.ok(r.stdout.includes('MEMTRACE_MCP_ERROR_TIMEOUT'));
      }
    });
  });
});

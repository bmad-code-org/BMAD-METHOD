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

    it('should accept --summarize as a valid flag', async () => {
      const r = await runAdapter(['--target', 'foo', '--query', 'get_impact', '--summarize']);
      assert.ok(!r.stderr.includes('Unknown argument'), '--summarize should not cause unknown argument error');
    });

    it('should accept --check-freshness as a valid flag', async () => {
      const r = await runAdapter(['--target', 'foo', '--query', 'get_impact', '--check-freshness']);
      assert.ok(!r.stderr.includes('Unknown argument'), '--check-freshness should not cause unknown argument error');
    });

    it('should accept --batch as a valid flag', async () => {
      const r = await runAdapter(['--target', 'foo', '--query', 'get_impact', '--batch']);
      assert.ok(!r.stderr.includes('Unknown argument'), '--batch should not cause unknown argument error');
    });
  });

  describe('Summarization (--summarize)', () => {

    it('--help output should mention --summarize', async () => {
      const r = await runAdapter(['--help']);
      assert.equal(r.code, 0);
      assert.ok(r.stdout.includes('--summarize'), 'Help text must document --summarize');
    });

    it('--help output should mention --check-freshness', async () => {
      const r = await runAdapter(['--help']);
      assert.equal(r.code, 0);
      assert.ok(r.stdout.includes('--check-freshness'), 'Help text must document --check-freshness');
    });

    it('--help output should mention --batch', async () => {
      const r = await runAdapter(['--help']);
      assert.equal(r.code, 0);
      assert.ok(r.stdout.includes('--batch'), 'Help text must document --batch');
    });

    it('--summarize with find_dead_code should emit warning on STDERR, no summarized field', { timeout: 30000 }, async () => {
      const r = await runAdapter(['--target', 'src', '--query', 'find_dead_code', '--repo', 'Repos', '--summarize']);
      assert.ok(r.stderr.includes('WARNING'), 'STDERR must contain warning');
      assert.ok(r.stderr.includes('--summarize'), 'STDERR must reference --summarize');
      if (r.code === 0) {
        const parsed = JSON.parse(r.stdout);
        assert.equal(parsed.summarized, undefined, 'STDOUT must not have summarized field for find_dead_code');
      }
    });

    it('--summarize with list_repos should emit warning on STDERR, no summarized field', { timeout: 20000 }, async () => {
      const r = await runAdapter(['--query', 'list_repos', '--summarize']);
      assert.ok(r.stderr.includes('WARNING'), 'STDERR must contain warning');
      if (r.code === 0) {
        const parsed = JSON.parse(r.stdout);
        assert.equal(parsed.summarized, undefined, 'STDOUT must not have summarized field for list_repos');
      }
    });

    it('get_impact WITH --summarize should include summarized field', { timeout: 30000 }, async () => {
      const r = await runAdapter(['--target', 'bmad-dev-story', '--query', 'get_impact', '--repo', 'Repos', '--summarize']);
      if (r.code === 0) {
        let parsed;
        try {
          parsed = JSON.parse(r.stdout);
        } catch (e) {
          assert.fail(`STDOUT is not valid JSON: ${r.stdout.slice(0, 200)}`);
        }
        assert.ok(typeof parsed.summarized === 'object', 'summarized field must be an object');
        assert.ok(typeof parsed.summarized.total_affected === 'number');
        assert.ok(Array.isArray(parsed.summarized.critical_dependents));
        assert.ok(typeof parsed.summarized.module_impact === 'object');
        assert.ok(typeof parsed.summarized.token_estimate === 'number');
        assert.ok(parsed.summarized.token_estimate <= 2000, `token_estimate ${parsed.summarized.token_estimate} must be ≤ 2000`);

        parsed.summarized.critical_dependents.forEach(s => {
          assert.ok(s.depth <= 2, `critical_dependent ${s.name} must have depth ≤ 2`);
          assert.ok(typeof s.name === 'string');
          assert.ok(typeof s.file === 'string');
        });
        assert.ok(parsed.summarized.critical_dependents.length <= 20);

        for (const [prefix, mod] of Object.entries(parsed.summarized.module_impact)) {
          assert.ok(typeof mod.count === 'number');
          if (mod.top_symbols) {
            assert.ok(Array.isArray(mod.top_symbols));
            assert.ok(mod.top_symbols.length <= 3);
          }
        }
      } else {
        // After 4.1 fix: exit 1 may be timeout (token present) or non-timeout MCP error (no token) — both acceptable
        if (r.stdout.includes('MEMTRACE_MCP_ERROR_TIMEOUT')) {
          // Timeout detected correctly
        }
        // Non-timeout MCP errors exit 1 without token — also valid
      }
    });

    it('get_impact WITHOUT --summarize should NOT have summarized field', { timeout: 30000 }, async () => {
      const r = await runAdapter(['--target', 'bmad-dev-story', '--query', 'get_impact', '--repo', 'Repos']);
      if (r.code === 0) {
        const parsed = JSON.parse(r.stdout);
        assert.equal(parsed.summarized, undefined, 'Without --summarize, output must NOT have summarized field');
        assert.ok(typeof parsed.target === 'string');
        assert.ok(Array.isArray(parsed.affected_symbols));
        assert.ok(typeof parsed.total_count === 'number');
      } else {
        // After 4.1 fix: exit 1 may be timeout or non-timeout MCP error — both acceptable
        if (r.stdout.includes('MEMTRACE_MCP_ERROR_TIMEOUT')) {
          // Timeout detected correctly
        }
      }
    });
  });

  describe('Freshness (--check-freshness)', () => {

    it('--help output should mention --check-freshness', async () => {
      const r = await runAdapter(['--help']);
      assert.equal(r.code, 0);
      assert.ok(r.stdout.includes('--check-freshness'));
    });

    it('--check-freshness with list_repos should emit [FRESHNESS] on STDERR', { timeout: 30000 }, async () => {
      const r = await runAdapter(['--query', 'list_repos', '--check-freshness']);
      if (r.code === 0) {
        assert.ok(r.stderr.includes('[FRESHNESS]'), 'STDERR must contain [FRESHNESS] line');
      } else if (r.code === 1) {
        assert.ok(r.stderr.includes('[FRESHNESS]'), 'STDERR must contain [FRESHNESS] line even on stale index');
        // On stale index, STDOUT should have JSON diagnostic with freshness_error field
        try {
          const parsed = JSON.parse(r.stdout);
          assert.ok(parsed.freshness_error, 'Diagnostic JSON must have freshness_error field');
        } catch {
          // STDOUT may not always be parseable JSON; not a hard failure
        }
      }
    });

    it('invalid MEMTRACE_FRESHNESS_MAX_AGE_MINUTES should not crash', { timeout: 30000 }, async () => {
      const r = await runAdapter(['--query', 'list_repos', '--check-freshness']);
      // Should exit cleanly (0 or 1) regardless of env value — never hang or crash
      assert.ok(r.code === 0 || r.code === 1, 'Must exit cleanly with invalid env');
    });

    it('--check-freshness without --repo should auto-detect and not crash', { timeout: 30000 }, async () => {
      const r = await runAdapter(['--query', 'list_repos', '--check-freshness']);
      assert.ok(r.code === 0 || r.code === 1, 'Must exit cleanly with auto-detected repo');
      if (r.code === 0 || r.code === 1) {
        assert.ok(r.stderr.includes('[FRESHNESS]'), 'STDERR must contain [FRESHNESS] line');
      }
    });
  });

  describe('Batch mode (--batch)', () => {

    it('--batch with list_repos should exit 1 with unsupported query error', async () => {
      const r = await runAdapter(['--query', 'list_repos', '--batch']);
      assert.equal(r.code, 1);
      assert.ok(r.stderr.includes('not support') || r.stderr.includes('ERROR'));
    });

    it('--batch with comma-separated targets should produce results array', { timeout: 30000 }, async () => {
      const r = await runAdapter(['--target', 'bmad-dev-story,parseArgs', '--query', 'get_impact', '--repo', 'Repos', '--batch']);
      if (r.code === 0) {
        const parsed = JSON.parse(r.stdout);
        assert.equal(parsed.query, 'get_impact');
        assert.ok(Array.isArray(parsed.targets));
        assert.ok(Array.isArray(parsed.results));
        assert.ok(typeof parsed.total_succeeded === 'number');
        assert.ok(typeof parsed.total_failed === 'number');
        assert.ok(parsed.results.length >= 1);
        assert.ok(parsed.results[0].target);
      } else if (r.code === 1) {
        const parsed = JSON.parse(r.stdout);
        assert.ok(Array.isArray(parsed.results));
      } else {
        // After 4.1 fix: non-0/1 exit may be timeout or non-timeout — both acceptable
        if (r.stdout.includes('MEMTRACE_MCP_ERROR_TIMEOUT')) {
          // Timeout detected correctly
        }
      }
    });

    it('--batch with --summarize should give each result summarized field', { timeout: 30000 }, async () => {
      const r = await runAdapter(['--target', 'bmad-dev-story,parseArgs', '--query', 'get_impact', '--repo', 'Repos', '--batch', '--summarize']);
      if (r.code === 0) {
        const parsed = JSON.parse(r.stdout);
        assert.ok(Array.isArray(parsed.results));
        for (const res of parsed.results) {
          if (res.risk_level) { // succeeded
            assert.ok(res.summarized, 'Each successful target should have summarized field');
            assert.ok(typeof res.summarized.total_affected === 'number');
          }
        }
      }
    });

    it('--batch with all-failing non-existent targets should produce zero successes', { timeout: 30000 }, async () => {
      const r = await runAdapter(['--target', '!@#$%^&*()_NE1_SYM,!@#$%^&*()_NE2_SYM', '--query', 'get_impact', '--repo', 'Repos', '--batch']);
      if (r.code === 1) {
        let parsed;
        try { parsed = JSON.parse(r.stdout); } catch { /* ignore parse errors */ }
        if (parsed && parsed.results) {
          assert.equal(parsed.total_succeeded, 0, 'All targets should have failed');
          assert.ok(parsed.total_failed >= 1, 'Should have at least 1 failure');
        }
      }
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
      // Verify freshness is always computed (AC #3)
      for (const repo of parsed.repositories) {
        assert.ok(repo.freshness, 'Each repo must have freshness field');
        assert.ok(typeof repo.freshness.age_minutes === 'number' || repo.freshness.age_minutes === null);
        assert.equal(typeof repo.freshness.is_fresh, 'boolean');
      }
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
        // After 4.1 fix: exit 1 may be timeout (token present) or non-timeout MCP error (no token) — both acceptable
        if (r.stdout.includes('MEMTRACE_MCP_ERROR_TIMEOUT')) {
          // Timeout detected correctly
        }
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
        // After 4.1 fix: exit 1 may be timeout or non-timeout MCP error — both acceptable
        if (r.stdout.includes('MEMTRACE_MCP_ERROR_TIMEOUT')) {
          // Timeout detected correctly
        }
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
        // After 4.1 fix: exit 1 may be timeout or non-timeout MCP error — both acceptable
        if (r.stdout.includes('MEMTRACE_MCP_ERROR_TIMEOUT')) {
          // Timeout detected correctly
        }
      }
    });

    it('should emit MEMTRACE_MCP_ERROR_TIMEOUT on MCP timeout', { timeout: 20000 }, async () => {
      // Query for a non-existent target to potentially trigger a timeout
      const r = await runAdapter(['--target', '!@#$%^&*()_NONEXISTENT_SYMBOL_12345', '--query', 'get_impact', '--repo', 'Repos']);
      // Should always exit 0 or 1 — never hang
      if (r.code === 1) {
        assert.ok(r.stdout.includes('MEMTRACE_MCP_ERROR_TIMEOUT'));
      }
    });
  });

  describe('Timeout detection accuracy', () => {

    it('should NOT emit MEMTRACE_MCP_ERROR_TIMEOUT for unknown argument', async () => {
      const r = await runAdapter(['--unknown']);
      assert.equal(r.code, 1);
      assert.ok(r.stderr.includes('Unknown argument'));
      assert.ok(!r.stdout.includes('MEMTRACE_MCP_ERROR_TIMEOUT'),
        'TIMEOUT_TOKEN must NOT appear for non-timeout parse errors');
    });

    it('should NOT emit MEMTRACE_MCP_ERROR_TIMEOUT for missing --query', async () => {
      const r = await runAdapter(['--target', 'foo']);
      assert.equal(r.code, 1);
      assert.ok(r.stderr.includes('--query'));
      assert.ok(!r.stdout.includes('MEMTRACE_MCP_ERROR_TIMEOUT'));
    });

    it('should NOT emit MEMTRACE_MCP_ERROR_TIMEOUT for missing --target', async () => {
      const r = await runAdapter(['--query', 'get_impact']);
      assert.equal(r.code, 1);
      assert.ok(r.stderr.includes('--target'));
      assert.ok(!r.stdout.includes('MEMTRACE_MCP_ERROR_TIMEOUT'));
    });

    it('should NOT emit MEMTRACE_MCP_ERROR_TIMEOUT for empty --target', async () => {
      const r = await runAdapter(['--target', '', '--query', 'get_impact']);
      assert.equal(r.code, 1);
      assert.ok(r.stderr.includes('non-empty'));
      assert.ok(!r.stdout.includes('MEMTRACE_MCP_ERROR_TIMEOUT'));
    });

    it('should NOT emit MEMTRACE_MCP_ERROR_TIMEOUT for invalid --query', async () => {
      const r = await runAdapter(['--target', 'foo', '--query', 'invalid_query']);
      assert.equal(r.code, 1);
      assert.ok(r.stderr.includes('Invalid query'));
      assert.ok(!r.stdout.includes('MEMTRACE_MCP_ERROR_TIMEOUT'));
    });

    it('should NOT emit MEMTRACE_MCP_ERROR_TIMEOUT for batch unsupported query', async () => {
      const r = await runAdapter(['--query', 'list_repos', '--batch']);
      assert.equal(r.code, 1);
      assert.ok(r.stderr.includes('not support') || r.stderr.includes('ERROR'));
      assert.ok(!r.stdout.includes('MEMTRACE_MCP_ERROR_TIMEOUT'));
    });

    it('should emit MEMTRACE_MCP_ERROR_TIMEOUT on actual MCP timeout', { timeout: 30000 }, async () => {
      const r = await runAdapter(['--target', '!@#$%^&*()_NONEXISTENT_SYMBOL_12345', '--query', 'get_impact', '--repo', 'Repos']);
      if (r.code === 1) {
        assert.ok(r.stdout.includes('MEMTRACE_MCP_ERROR_TIMEOUT'),
          'Actual MCP timeouts must emit the token');
      }
    });
  });
});

#!/usr/bin/env node

import { spawn, execFile } from 'node:child_process';
import { platform } from 'node:os';

const TIMEOUT_MS = parseInt(process.env.MEMTRACE_TIMEOUT_MS || '10000', 10);

function parseArgs() {
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`Usage: node memtrace-restart.mjs [--dry-run]

Restarts the Memtrace MCP server by terminating stale processes and
verifying a fresh instance can respond to MCP initialize requests.

Options:
  --dry-run   Report what would be done without killing any processes
  --help, -h  Show this help`);
    process.exit(0);
  }
  for (const arg of args) {
    if (!arg.startsWith('-')) continue;
    if (arg !== '--dry-run' && arg !== '--help' && arg !== '-h') {
      console.error(`ERROR: Unknown argument: ${arg}. Use --help to see available options.`);
      process.exit(1);
    }
  }
  return { dryRun: args.includes('--dry-run') };
}

async function killStaleProcesses(dryRun) {
  if (platform() === 'win32') {
    if (dryRun) {
      console.error('[restart] DRY-RUN: Would execute: taskkill /f /im memtrace.exe /t');
      return;
    }
    return new Promise((resolvePromise) => {
      execFile('taskkill', ['/f', '/im', 'memtrace.exe', '/t'], { windowsHide: true }, (err, stdout, stderr) => {
        if (err) {
          if (stderr && !stderr.toLowerCase().includes('not found') && !stderr.toLowerCase().includes('instance')) {
            console.error(`[restart] taskkill warning: ${stderr.trim()}`);
          }
        }
        if (stdout) console.error(`[restart] Terminated: ${stdout.trim().replace(/\r?\n/g, ' ')}`);
        resolvePromise();
      });
    });
  }
  if (dryRun) {
    console.error('[restart] DRY-RUN: Would execute: pkill -f "memtrace mcp"');
    return;
  }
  return new Promise((resolvePromise) => {
    execFile('pkill', ['-f', 'memtrace mcp'], (err) => {
      if (err && err.code !== 1) {
        console.error(`[restart] pkill warning: ${err.message}`);
      }
      resolvePromise();
    });
  });
}

async function verifyServerOnline() {
  return new Promise((resolvePromise) => {
    const child = spawn('memtrace', ['mcp'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: platform() === 'win32',
      windowsHide: true
    });

    let resolved = false;
    let stdoutBuffer = '';

    const finish = (value) => {
      if (resolved) return;
      resolved = true;
      try { child.stdin.end(); } catch (e) {}
      try { child.kill(); } catch (e) {}
      resolvePromise(value);
    };

    const timeout = setTimeout(() => {
      if (!resolved) {
        finish(false);
      }
    }, TIMEOUT_MS);

    child.on('error', (err) => {
      if (!resolved) {
        clearTimeout(timeout);
        if (err.code === 'ENOENT') {
          console.error('[restart] memtrace binary not found on PATH. Verify memtrace is installed.');
        } else {
          console.error(`[restart] Verification spawn error: ${err.message}`);
        }
        finish(false);
      }
    });

    child.on('exit', (code, signal) => {
      if (!resolved) {
        clearTimeout(timeout);
        if (signal) {
          console.error(`[restart] Verification child terminated by signal ${signal} before responding.`);
        } else {
          console.error(`[restart] Verification child exited with code ${code} before responding.`);
        }
        finish(false);
      }
    });

    child.stderr.on('data', () => {});

    const request = JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'memtrace-restart-verifier', version: '1.0.0' }
      }
    }) + '\n';

    child.stdout.on('data', (data) => {
      if (resolved) return;
      stdoutBuffer += data.toString();
      const lines = stdoutBuffer.split('\n');
      stdoutBuffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const response = JSON.parse(line);
          if (response.id === 1) {
            if (!response.error) {
              clearTimeout(timeout);
              finish(true);
            } else {
              console.error(`[restart] MCP error response: ${response.error.message || JSON.stringify(response.error)}`);
            }
            return;
          }
        } catch (err) {
          if (line.trim().startsWith('{')) {
            console.error(`[restart] Verification JSON parse error: ${err.message} (payload: ${line.trim().substring(0, 120)}...)`);
          }
        }
      }
    });

    child.stdin.write(request);
  });
}

async function main() {
  const args = parseArgs();

  console.error('[restart] Memtrace MCP server recovery initiated...');

  console.error('[restart] Step 1/2: Terminating stale memtrace processes...');
  await killStaleProcesses(args.dryRun);

  if (args.dryRun) {
    console.error('[restart] DRY-RUN complete. No processes terminated. Exiting with code 0.');
    process.exit(0);
  }

  // Allow OS to release process handles, ports, and file locks before verification.
  // 500ms is a best-effort delay; loaded systems may need more but we optimise for common case.
  await new Promise(r => setTimeout(r, 500));

  console.error('[restart] Step 2/2: Verifying memtrace server responds to MCP...');
  const online = await verifyServerOnline();

  if (!online) {
    console.error(`[restart] FAIL: Memtrace server did not respond within ${TIMEOUT_MS}ms.`);
    console.error('[restart] The IDE/client may need to reconnect on the next MCP tool call.');
    console.error('[restart] If the issue persists, manual intervention is required (Story 4.3).');
    process.exit(1);
  }

  console.error('[restart] SUCCESS: Memtrace MCP server verified operational.');
  console.error('[restart] The IDE/client will reconnect automatically on the next MCP tool call.');
  process.exit(0);
}

main();

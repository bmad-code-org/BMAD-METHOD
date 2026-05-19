#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const TIMEOUT_MS = parseInt(process.env.MEMTRACE_TIMEOUT_MS || '10000', 10);
const TIMEOUT_TOKEN = 'MEMTRACE_MCP_ERROR_TIMEOUT';
const SUMMARIZE_TOKEN_LIMIT = 2000;

function parseArgs() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`Usage: node memtrace-adapter.mjs --target <symbol> --query <type> [--repo <repo_id>] [--summarize]

Arguments:
  --target <symbol>   Symbol name or file path to query (required for get_impact, find_dead_code)
  --query <type>      Query type: get_impact, find_dead_code, list_repos (required)
  --repo <repo_id>    Repository ID (optional — auto-detected from .memtrace-workspace if omitted)
  --summarize         (Optional) Apply token-budgeted hierarchical summarization for --query get_impact (output ≤ 2000 tokens)

Query types:
  get_impact          Fetch structural blast radius for a target symbol
  find_dead_code      Find dead code in a target module
  list_repos          List indexed repositories with freshness timestamps

Examples:
  node memtrace-adapter.mjs --target "validateToken" --query get_impact
  node memtrace-adapter.mjs --target "validateToken" --query get_impact --summarize
  node memtrace-adapter.mjs --query list_repos
  node memtrace-adapter.mjs --target "src/auth" --query find_dead_code
  node memtrace-adapter.mjs --help`);
    process.exit(0);
  }

  const result = { target: null, query: null, repo: null, summarize: false };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--target' && i + 1 < args.length) {
      result.target = args[++i];
    } else if (args[i] === '--query' && i + 1 < args.length) {
      result.query = args[++i];
    } else if (args[i] === '--repo' && i + 1 < args.length) {
      result.repo = args[++i];
    } else if (args[i] === '--summarize') {
      result.summarize = true;
    } else {
      fail(`Unknown argument: ${args[i]}`);
      process.exit(1);
    }
  }

  if (!result.query) {
    fail('Missing required argument: --query');
    process.exit(1);
  }

  const validQueries = ['get_impact', 'find_dead_code', 'list_repos'];
  if (!validQueries.includes(result.query)) {
    fail(`Invalid query type: "${result.query}". Valid: ${validQueries.join(', ')}`);
    process.exit(1);
  }

  if ((result.query === 'get_impact' || result.query === 'find_dead_code')) {
    if (result.target === null) {
      fail(`Missing required argument: --target is required for --query ${result.query}`);
      process.exit(1);
    }
    if (result.target.trim() === '') {
      fail('--target must be a non-empty string');
      process.exit(1);
    }
  }

  return result;
}

function fail(msg) {
  console.error(`ERROR: ${msg}`);
  console.log(TIMEOUT_TOKEN);
}

class McpClient {
  constructor() {
    this.child = null;
    this.stdoutBuffer = '';
    this.requestId = 0;
  }

  spawn() {
    return new Promise((resolvePromise, reject) => {
      try {
        this.child = spawn('memtrace', ['mcp'], {
          stdio: ['pipe', 'pipe', 'pipe'],
          shell: process.platform === 'win32',
          windowsHide: true
        });
      } catch (err) {
        reject(new Error(`Failed to spawn memtrace: ${err.message}`));
        return;
      }

      const onError = (err) => {
        cleanup();
        const msg = err.code === 'ENOENT'
          ? `memtrace binary not found on PATH. Ensure memtrace is installed (npm install -g memtrace) and available.`
          : `memtrace spawn error: ${err.message}`;
        reject(new Error(msg));
      };

      const onExit = (code, signal) => {
        cleanup();
        if (signal) {
          reject(new Error(`memtrace process terminated by signal ${signal}`));
        } else if (code !== 0) {
          reject(new Error(`memtrace process exited with code ${code}`));
        }
      };

      const cleanup = () => {
        if (this.child) {
          this.child.removeListener('error', onError);
          this.child.removeListener('exit', onExit);
          this.child.stderr.removeListener('data', onStderr);
        }
      };

      const onStderr = () => {
        // MCP servers may log diagnostics to stderr — capture but don't reject
      };

      this.child.on('error', onError);
      this.child.on('exit', onExit);
      this.child.stderr.on('data', onStderr);

      resolvePromise();
    });
  }

  sendRequest(method, params = {}) {
    const id = ++this.requestId;
    const request = JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n';
    return new Promise((resolvePromise, reject) => {
      const listener = (data) => {
        this.stdoutBuffer += data.toString();
        const lines = this.stdoutBuffer.split('\n');
        this.stdoutBuffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const response = JSON.parse(line);
            if (response.id === id) {
              this.child.stdout.removeListener('data', listener);
              if (response.error) {
                reject(new Error(`MCP error: ${response.error.message || JSON.stringify(response.error)}`));
              } else {
                resolvePromise(response.result);
              }
              return;
            }
          } catch (err) {
            // Partial JSON in buffer — wait for more data
          }
        }
      };

      this.child.stdout.on('data', listener);
      this.child.stdin.write(request);
    });
  }

  async handshake() {
    const capabilities = await this.sendRequest('initialize', {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: { name: 'bmad-memtrace-adapter', version: '1.0.0' }
    });
    // Send initialized notification (fire-and-forget, no response expected)
    this.child.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized', params: {} }) + '\n');
    return capabilities;
  }

  async callTool(name, args) {
    return this.sendRequest('tools/call', { name, arguments: args });
  }

  async shutdown() {
    try {
      await this.sendRequest('shutdown', {});
    } catch (err) {
      // Shutdown errors are non-fatal
    }
  }

  kill() {
    if (this.child) {
      try { this.child.stdin.end(); } catch (e) {}
      try { this.child.kill('SIGTERM'); } catch (e) {}
      // SIGTERM is sufficient on modern systems; no need for SIGKILL timer
    }
  }
}

function resolveRepoId(args) {
  if (args.repo) return args.repo;

  // Try to auto-detect from .memtrace-workspace
  let cwd = process.cwd();
  const parts = cwd.split(/[\\/]/);
  for (let i = parts.length; i > 0; i--) {
    const dir = parts.slice(0, i).join('/');
    if (existsSync(resolve('/', ...(process.platform === 'win32' ? [dir.split(':')[0] + ':', ...dir.split(':')[1]?.split('/').filter(Boolean) || []] : []), '.memtrace-workspace'))) {
      // Found workspace anchor — use basename
      return parts[i - 1] || parts[parts.length - 1];
    }
  }

  // Fallback: use CWD basename
  return parts[parts.length - 1];
}

async function queryGetImpact(client, target, repoId) {
  const result = await client.callTool('get_impact', { target, repo_id: repoId });
  return {
    target,
    risk_level: result.risk || 'Low',
    affected_symbols: (result.affected_symbols || []).map(s => ({
      name: s.name,
      file: s.file || '',
      depth: s.depth || 1
    })),
    affected_files: result.affected_files || [],
    total_count: result.total_affected || result.affected_symbols?.length || 0,
    elapsed_ms: 0
  };
}

async function queryFindDeadCode(client, target, repoId) {
  const result = await client.callTool('find_dead_code', {
    repo_id: repoId,
    file_path: target
  });
  const symbols = (result?.symbols || []).map(s => ({
    name: s.name || '<unknown>',
    kind: s.kind || 'Function',
    file: s.file || '',
    line: s.line || 0
  }));
  return {
    query: 'find_dead_code',
    target,
    symbols,
    total_count: symbols.length,
    elapsed_ms: 0
  };
}

async function queryListRepos(client) {
  const result = await client.callTool('list_indexed_repositories', {});
  const repos = Array.isArray(result?.repos) ? result.repos : [];
  return {
    query: 'list_repos',
    repositories: repos.map(r => ({
      repo_id: r.repo_id,
      last_indexed: r.last_indexed_at || r.last_indexed || null,
      total_nodes: r.total_nodes || r.nodes || 0
    })),
    elapsed_ms: 0
  };
}

function estimateTokens(obj) {
  try {
    return Math.ceil(JSON.stringify(obj).length / 4 * 1.15);
  } catch {
    return Infinity;
  }
}

function summarizeBlastRadius(result) {
  const raw = result.affected_symbols;
  const symbols = Array.isArray(raw) ? raw : [];

  const modules = new Map();
  for (const s of symbols) {
    if (typeof s !== 'object' || s === null) continue;
    const file = s.file || '';
    const parts = file.split(/[\\/]/);
    const dir = parts.slice(0, -1).join('/');
    const prefix = dir ? dir.split('/').slice(0, 2).join('/') + '/' : '/';
    if (!modules.has(prefix)) modules.set(prefix, []);
    modules.get(prefix).push(s);
  }

  const isFiniteDepth = (s) => typeof s.depth === 'number' && isFinite(s.depth);

  const crit = symbols
    .filter(s => typeof s === 'object' && s !== null && isFiniteDepth(s) && s.depth <= 2)
    .sort((a, b) => (a.depth ?? 99) - (b.depth ?? 99) || (a.name || '').localeCompare(b.name || ''))
    .slice(0, 20)
    .map(s => ({ name: s.name, file: s.file || '', depth: s.depth }));

  const moduleImpact = {};
  for (const [prefix, syms] of modules) {
    const valid = syms.filter(s => typeof s === 'object' && s !== null);
    const sorted = [...valid].sort((a, b) => (a.depth ?? 99) - (b.depth ?? 99) || (a.name || '').localeCompare(b.name || ''));
    moduleImpact[prefix] = {
      count: syms.length,
      top_symbols: sorted.slice(0, 3).map(s => ({ name: s.name, file: s.file || '', depth: s.depth }))
    };
  }

  const MAX_CRITICAL = 20;
  const STAGE_CRITICAL = 10;
  const MIN_CRITICAL = 5;
  const MAX_MODULES = 50;

  let summarized = {
    total_affected: symbols.length,
    total_critical: crit.length,
    critical_dependents: crit,
    module_impact: moduleImpact
  };
  summarized.token_estimate = estimateTokens(summarized);

  while (summarized.token_estimate > SUMMARIZE_TOKEN_LIMIT) {
    const cur = summarized.critical_dependents.length;
    if (cur > STAGE_CRITICAL) {
      summarized.critical_dependents = summarized.critical_dependents.slice(0, STAGE_CRITICAL);
      summarized.total_critical = summarized.critical_dependents.length;
    } else if (cur > MIN_CRITICAL) {
      summarized.critical_dependents = summarized.critical_dependents.slice(0, MIN_CRITICAL);
      summarized.total_critical = summarized.critical_dependents.length;
    } else if (Object.keys(summarized.module_impact).some(k => summarized.module_impact[k].top_symbols)) {
      for (const key of Object.keys(summarized.module_impact)) {
        delete summarized.module_impact[key].top_symbols;
      }
    } else {
      const entries = Object.entries(summarized.module_impact)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, MAX_MODULES);
      summarized.module_impact = Object.fromEntries(entries);
    }
    summarized.token_estimate = estimateTokens(summarized);
  }

  return summarized;
}

function withTimeout(promise, ms) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => {
      reject(new TimeoutError(`Query timed out after ${ms}ms`));
    }, ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

class TimeoutError extends Error {
  constructor(message) {
    super(message);
    this.name = 'TimeoutError';
  }
}

async function main() {
  const args = parseArgs();
  const start = Date.now();

  if (args.summarize && args.query !== 'get_impact') {
    console.error('WARNING: --summarize is only applicable to --query get_impact. Ignored.');
    args.summarize = false;
  }

  const repoId = resolveRepoId(args);
  const client = new McpClient();

  try {
    await client.spawn();
    await withTimeout(client.handshake(), TIMEOUT_MS);

    let queryFn;
    if (args.query === 'get_impact') {
      queryFn = queryGetImpact(client, args.target, repoId);
    } else if (args.query === 'find_dead_code') {
      queryFn = queryFindDeadCode(client, args.target, repoId);
    } else if (args.query === 'list_repos') {
      queryFn = queryListRepos(client);
    } else {
      throw new Error(`Unhandled query type: ${args.query}`);
    }

    let result = await withTimeout(queryFn, TIMEOUT_MS);
    result.elapsed_ms = Date.now() - start;

    if (args.summarize && args.query === 'get_impact') {
      result.summarized = summarizeBlastRadius(result);
    }

    await withTimeout(client.shutdown(), 5000);

    try {
      console.log(JSON.stringify(result, null, 2));
    } catch (serializeErr) {
      fail(`Failed to serialize result: ${serializeErr.message}`);
      process.exit(1);
    }
    process.exit(0);
  } catch (err) {
    client.kill();
    const elapsed = Date.now() - start;

    if (err instanceof TimeoutError) {
      console.log(TIMEOUT_TOKEN);
      console.error(`ERROR: Query timed out after ${elapsed}ms`);
    } else {
      fail(err.message);
    }
    process.exit(1);
  }
}

main();

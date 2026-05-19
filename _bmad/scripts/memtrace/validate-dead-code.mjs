#!/usr/bin/env node

import { existsSync, statSync } from 'fs';
import { readFile } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const TIMEOUT_MS = 10000;
const TIMEOUT_TOKEN = 'MEMTRACE_MCP_ERROR_TIMEOUT';
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const MAX_CANDIDATES = 10000;
const __dirname = dirname(fileURLToPath(import.meta.url));
const DEFAULT_CATALOG = resolve(__dirname, 'pitfalls-catalog.json');

class TimeoutError extends Error {
  constructor() {
    super('TIMEOUT');
    this.name = 'TimeoutError';
  }
}

function showHelp() {
  console.log(`Usage: node validate-dead-code.mjs --candidates <file.json> [--catalog <file.json>]

Arguments:
  --candidates <file>  Path to JSON array of dead-code candidates from find_dead_code
  --catalog <file>     Path to pitfalls-catalog.json (default: sibling dir)

Each candidate should have fields: name, kind, file, line.

Output JSON includes: status, total_candidates, classified breakdown,
suspects[], false_positives[], ghosts[].

Exit codes:
  0  Classification completed successfully
  1  Processing error or timeout`);
}

function parseArgs() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    showHelp();
    process.exit(0);
  }

  const result = { candidates: null, catalog: DEFAULT_CATALOG };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--candidates' && i + 1 < args.length) {
      result.candidates = args[++i];
    } else if (args[i] === '--catalog' && i + 1 < args.length) {
      result.catalog = args[++i];
    } else {
      console.error(`ERROR: Unknown argument: ${args[i]}`);
      process.exit(1);
    }
  }

  if (!result.candidates) {
    console.error('ERROR: Missing --candidates');
    process.exit(1);
  }

  return result;
}

async function readJsonFile(filePath) {
  const resolved = resolve(filePath);
  if (!existsSync(resolved)) {
    throw new Error(`File not found: ${resolved}`);
  }
  const st = statSync(resolved);
  if (st.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(`File too large: ${resolved} (${st.size} bytes, max ${MAX_FILE_SIZE_BYTES})`);
  }
  try {
    return JSON.parse(await readFile(resolved, 'utf-8'));
  } catch (e) {
    throw new Error(`Failed to parse JSON from ${resolved}: ${e.message}`);
  }
}

function validateCatalog(catalog) {
  if (!catalog || !Array.isArray(catalog.categories)) {
    throw new Error('Invalid pitfalls catalog: "categories" must be an array');
  }
  const entries = [];
  for (const cat of catalog.categories) {
    if (!cat.name || !Array.isArray(cat.entries)) continue;
    for (const entry of cat.entries) {
      if (!entry.id || !entry.pattern || !entry.reason) {
        throw new Error(`Invalid catalog entry in "${cat.name}": missing id, pattern, or reason`);
      }
      let regex;
      try {
        regex = new RegExp(entry.pattern);
      } catch (e) {
        throw new Error(`Invalid regex pattern in "${cat.name}/${entry.id}": ${entry.pattern} — ${e.message}`);
      }
      entries.push({
        id: entry.id,
        category: cat.name,
        pattern: entry.pattern,
        regex,
        reason: entry.reason
      });
    }
  }
  if (entries.length === 0) {
    throw new Error('Pitfalls catalog has zero valid entries');
  }
  return entries;
}

function classify(candidates, catalogEntries) {
  const suspects = [];
  const falsePositives = [];
  const ghosts = [];

  for (const c of candidates) {
    if (!c || typeof c !== 'object') {
      ghosts.push({
        name: String(c),
        file: '',
        line: 0,
        kind: 'Unknown',
        reason: 'Invalid candidate entry (null or non-object)'
      });
      continue;
    }

    const name = typeof c.name === 'string' ? c.name : '';
    const filePath = typeof c.file === 'string' ? c.file : '';

    let matched = null;
    for (const entry of catalogEntries) {
      if (entry.regex.test(name)) {
        matched = entry;
        break;
      }
    }

    if (matched) {
      falsePositives.push({
        name,
        file: filePath,
        line: c.line,
        kind: c.kind,
        pitfall_id: matched.id,
        category: matched.category,
        reason: matched.reason
      });
    } else if (filePath && existsSync(resolve(filePath))) {
      suspects.push({
        name,
        file: filePath,
        line: c.line,
        kind: c.kind
      });
    } else {
      ghosts.push({
        name,
        file: filePath,
        line: c.line,
        kind: c.kind,
        reason: filePath ? 'Source file no longer exists on disk' : 'No file path provided'
      });
    }
  }

  return {
    status: suspects.length > 0 ? 'needs_review' : 'clean',
    total_candidates: candidates.length,
    classified: {
      suspect: suspects.length,
      false_positive: falsePositives.length,
      ghost: ghosts.length
    },
    suspects,
    false_positives: falsePositives,
    ghosts
  };
}

async function main() {
  const args = parseArgs();

  const candidatesData = await readJsonFile(args.candidates);
  if (!Array.isArray(candidatesData)) {
    throw new Error('Invalid candidates data: must be a JSON array');
  }
  if (candidatesData.length > MAX_CANDIDATES) {
    throw new Error(`Too many candidates: ${candidatesData.length} (max ${MAX_CANDIDATES})`);
  }

  const catalogData = await readJsonFile(args.catalog);
  const catalogEntries = validateCatalog(catalogData);

  const result = classify(candidatesData, catalogEntries);

  return result;
}

const timeout = new Promise((_, reject) =>
  setTimeout(() => reject(new TimeoutError()), TIMEOUT_MS)
);

Promise.race([main(), timeout])
  .then(result => {
    result.elapsed_ms = 0;
    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
  })
  .catch(err => {
    if (err instanceof TimeoutError) {
      console.log(TIMEOUT_TOKEN);
      console.error('ERROR: Processing timeout exceeded');
    } else {
      console.error(`ERROR: ${err.message}`);
    }
    process.exit(1);
  });

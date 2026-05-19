#!/usr/bin/env node

import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { resolve } from 'path';

const TIMEOUT_MS = 10000;
const TIMEOUT_TOKEN = 'MEMTRACE_MCP_ERROR_TIMEOUT';

function parseArgs() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`Usage: node qa-memtrace.mjs --blast-radius <file.json> --test-coverage <file.json> [--threshold N]

Arguments:
  --blast-radius <file>   Path to JSON file with get_impact output
  --test-coverage <file>  Path to JSON file with test coverage data
  --threshold N           Coverage threshold 0-100 (default: 100)

Exit codes:
  0  All required nodes covered (coverage >= threshold)
  1  Coverage insufficient or error

The output JSON includes: status, blast_radius_total, covered_nodes,
uncovered_nodes, coverage_percentage, threshold, passed, uncovered_details.`);
    process.exit(0);
  }

  const result = { blastRadius: null, testCoverage: null, threshold: 100 };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--blast-radius' && i + 1 < args.length) {
      result.blastRadius = args[++i];
    } else if (args[i] === '--test-coverage' && i + 1 < args.length) {
      result.testCoverage = args[++i];
    } else if (args[i] === '--threshold' && i + 1 < args.length) {
      result.threshold = parseInt(args[++i], 10);
      if (isNaN(result.threshold) || result.threshold < 0 || result.threshold > 100) {
        fail(`Invalid threshold. Must be integer 0-100.`);
        process.exit(1);
      }
    } else {
      fail(`Unknown argument: ${args[i]}`);
      process.exit(1);
    }
  }

  if (!result.blastRadius) { fail('Missing --blast-radius'); process.exit(1); }
  if (!result.testCoverage) { fail('Missing --test-coverage'); process.exit(1); }

  return result;
}

function fail(msg) {
  console.error(`ERROR: ${msg}`);
  console.log(TIMEOUT_TOKEN);
}

async function readJsonFile(filePath) {
  const resolved = resolve(filePath);
  if (!existsSync(resolved)) {
    throw new Error(`File not found: ${resolved}`);
  }
  return JSON.parse(await readFile(resolved, 'utf-8'));
}

function compute(blastData, coverageData, threshold) {
  if (!Array.isArray(blastData.affected_symbols) || blastData.affected_symbols.length === 0) {
    return {
      status: 'pass',
      blast_radius_total: 0,
      covered_nodes: 0,
      uncovered_nodes: 0,
      coverage_percentage: 100,
      threshold,
      passed: true,
      uncovered_details: [],
      elapsed_ms: 0,
      note: 'Empty blast radius — no nodes to intersect'
    };
  }

  const blastSet = new Map();
  for (const sym of blastData.affected_symbols) {
    const key = `${sym.file}:${sym.name}`;
    blastSet.set(key, sym);
  }

  const coveredSet = new Set();
  for (const mod of coverageData.modules) {
    const modPath = mod.module || '';
    const cov = mod.coverage || '';

    if (cov === 'Yes') {
      for (const sym of (mod.symbols_covered || [])) {
        if (blastSet.has(`${modPath}:${sym}`)) {
          coveredSet.add(`${modPath}:${sym}`);
        }
      }
    } else if ((mod.coverage || '').startsWith('Partial:')) {
      const n = parseInt(cov.split(':')[1], 10) || 0;
      const covered = (mod.symbols_covered || []).slice(0, n);
      for (const sym of covered) {
        if (blastSet.has(`${modPath}:${sym}`)) {
          coveredSet.add(`${modPath}:${sym}`);
        }
      }
    }
  }

  const uncoveredDetails = [];
  for (const [key, sym] of blastSet) {
    if (!coveredSet.has(key)) {
      uncoveredDetails.push({ symbol: sym.name, file: sym.file, depth: sym.depth });
    }
  }

  const total = blastSet.size;
  const covered = coveredSet.size;
  const uncovered = uncoveredDetails.length;
  const pct = total > 0 ? (covered / total) * 100 : 100;
  const passed = pct >= threshold;

  return {
    status: passed ? 'pass' : 'fail',
    blast_radius_total: total,
    covered_nodes: covered,
    uncovered_nodes: uncovered,
    coverage_percentage: Math.round(pct * 10) / 10,
    threshold,
    passed,
    uncovered_details: uncoveredDetails,
    elapsed_ms: 0
  };
}

async function main() {
  const args = parseArgs();
  const start = Date.now();

  const blastData = await readJsonFile(args.blastRadius);
  if (!Array.isArray(blastData.affected_symbols)) {
    throw new Error('Invalid blast-radius data: "affected_symbols" must be an array');
  }
  if (typeof blastData.total_count !== 'number') {
    throw new Error('Invalid blast-radius data: "total_count" must be a number');
  }

  const coverageData = await readJsonFile(args.testCoverage);
  if (!Array.isArray(coverageData.modules)) {
    throw new Error('Invalid test-coverage data: "modules" must be an array');
  }

  const result = compute(blastData, coverageData, args.threshold);
  result.elapsed_ms = Date.now() - start;

  console.log(JSON.stringify(result, null, 2));
  process.exit(result.passed ? 0 : 1);
}

const timeout = new Promise((_, reject) =>
  setTimeout(() => reject(new Error('TIMEOUT')), TIMEOUT_MS)
);

Promise.race([main(), timeout])
  .catch(err => {
    if (err.message === 'TIMEOUT') {
      console.log(TIMEOUT_TOKEN);
    } else {
      fail(err.message);
    }
    process.exit(1);
  });

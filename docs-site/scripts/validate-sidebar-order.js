/**
 * Sidebar Order Validator
 *
 * Validates sidebar.order values in YAML frontmatter of markdown doc files.
 *
 * Errors:
 *   - Duplicate sidebar.order values within the same directory
 *   - Gaps in the ordering sequence
 *   - sidebar: block present but missing or invalid order: field
 *   - frontmatter that does not close or is not a YAML mapping
 *
 * Frontmatter is read by tools/read_frontmatter.py, so this needs uv.
 *
 * Usage:
 *   node docs-site/scripts/validate-sidebar-order.js
 */

const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const DOCS_ROOT = path.resolve(__dirname, '../../docs');
const READER = path.resolve(__dirname, '../../tools/read_frontmatter.py');
const MAX_GAPS = 50;

// ── Main ─────────────────────────────────────────────────────────────────

/**
 * Scan all docs, validate sidebar orders, and report errors.
 * Exits 0 on success, 1 if any errors found.
 */
function main() {
  if (!fs.existsSync(DOCS_ROOT)) {
    console.error(`Error: docs directory not found at ${DOCS_ROOT}`);
    process.exit(1);
  }

  const sections = classifyDocsDirs();
  console.log(`\nValidating sidebar ordering in: ${DOCS_ROOT}\n`);
  console.log(`English sections: ${sections.join(', ')}\n`);

  const allErrors = [];
  const sectionDirs = sections.map((section) => path.join(DOCS_ROOT, section)).filter((dir) => fs.existsSync(dir));
  const frontmatters = readFrontmatter(sectionDirs.flatMap((dir) => listMdEntries(dir).map((e) => path.join(dir, e.name))));

  for (const sectionDir of sectionDirs) {
    const section = path.basename(sectionDir);
    console.log(`\nChecking English docs/${section}/`);
    const { issues } = checkDirectory(sectionDir, frontmatters);

    for (const issue of issues) {
      allErrors.push(issue);
      reportIssue(issue, '  ', `docs/${section}`);
    }
    if (issues.length === 0) {
      console.log(`  [OK] docs/${section}/ — all orders valid`);
    }
  }

  printSummary(allErrors);
  process.exit(allErrors.length > 0 ? 1 : 0);
}

// ── Directory classification ─────────────────────────────────────────────

/**
 * Top-level docs/ directories whose names do not start with `_` are sections.
 * @returns {string[]}
 */
function classifyDocsDirs() {
  return fs
    .readdirSync(DOCS_ROOT, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith('_'))
    .map((e) => e.name);
}

// ── Per-directory validation ─────────────────────────────────────────────

/**
 * Validate sidebar.order values for all markdown files in a directory.
 * Detects duplicates, gaps in sequence, missing-order, and invalid-order fields.
 * @param {string} dirPath - Absolute path to the directory to scan.
 * @param {object} frontmatters - readFrontmatter() output for the directory's files.
 * @returns {{ orderMap: Map<number, string[]>, issues: object[] }}
 */
function checkDirectory(dirPath, frontmatters) {
  const issues = [];
  const orderMap = new Map();
  const missingOrder = [];
  const invalidOrder = [];

  for (const entry of listMdEntries(dirPath)) {
    const fullPath = path.join(dirPath, entry.name);
    const { fields, error } = frontmatters[fullPath];
    if (error) {
      issues.push({ level: 'error', type: 'invalid-frontmatter', file: fullPath, message: `Invalid frontmatter (${error})` });
      continue;
    }
    const result = extractSidebarOrder(fields);

    if (!result.hasSidebar) continue;
    if (result.order === null) {
      if (result.orderInvalid) {
        invalidOrder.push(fullPath);
      } else {
        missingOrder.push(fullPath);
      }
      continue;
    }

    if (!orderMap.has(result.order)) orderMap.set(result.order, []);
    orderMap.get(result.order).push(fullPath);
  }

  for (const file of missingOrder) {
    issues.push({ level: 'error', type: 'missing-order', file, message: 'Has sidebar: block but no order: field' });
  }

  for (const file of invalidOrder) {
    issues.push({ level: 'error', type: 'invalid-order', file, message: 'Invalid sidebar.order: must be a positive integer' });
  }

  for (const [order, files] of orderMap) {
    if (files.length > 1) {
      for (const file of files) {
        issues.push({ level: 'error', type: 'duplicate-order', file, order, message: `Duplicate sidebar.order: ${order}` });
      }
    }
  }

  if (orderMap.size > 0) {
    let max = -Infinity;
    for (const k of orderMap.keys()) if (k > max) max = k;

    let gapCount = 0;
    for (let i = 1; i <= max; i++) {
      if (!orderMap.has(i)) {
        issues.push({
          level: 'error',
          type: 'gap',
          directory: dirPath,
          missing: i,
          message: `Gap in sidebar order: missing position ${i}`,
        });
        gapCount++;
        if (gapCount >= MAX_GAPS) {
          issues.push({
            level: 'error',
            type: 'gap-truncated',
            directory: dirPath,
            message: `Too many gaps (stopped after ${MAX_GAPS}) — check for typos in sidebar.order values`,
          });
          break;
        }
      }
    }
  }

  return { orderMap, issues };
}

// ── Output ───────────────────────────────────────────────────────────────

/**
 * Print a single validation issue to stdout.
 * @param {object} issue - Issue object with type, file/order/message fields.
 * @param {string} indent - Whitespace prefix for indentation.
 * @param {string} ctxPath - Display path for gap issues (e.g. "docs/explanation").
 */
function reportIssue(issue, indent, ctxPath) {
  switch (issue.type) {
    case 'duplicate-order': {
      console.log(`${indent}[ERROR] Duplicate order ${issue.order}: ${rel(issue.file)}`);
      break;
    }
    case 'gap': {
      console.log(`${indent}[ERROR] ${issue.message} in ${ctxPath}/`);
      break;
    }
    case 'gap-truncated': {
      console.log(`${indent}[ERROR] ${issue.message}`);
      break;
    }
    case 'missing-order': {
      console.log(`${indent}[ERROR] ${issue.message}: ${rel(issue.file)}`);
      break;
    }
    case 'invalid-order':
    case 'invalid-frontmatter': {
      console.log(`${indent}[ERROR] ${issue.message}: ${rel(issue.file)}`);
      break;
    }
  }
}

/**
 * Print summary with the error count and error type breakdown.
 * @param {object[]} errors - All collected errors.
 */
function printSummary(errors) {
  console.log(`\n${'─'.repeat(60)}`);
  console.log('\nSummary:');
  console.log(`   Errors:   ${errors.length}`);

  if (errors.length > 0) {
    const breakdown = {};
    for (const e of errors) breakdown[e.type] = (breakdown[e.type] || 0) + 1;
    console.log('\n   Error breakdown:');
    for (const [type, count] of Object.entries(breakdown)) console.log(`     ${type}: ${count}`);
  }

  if (errors.length === 0) {
    console.log('\n   All sidebar orders valid!');
  }

  console.log('');
}

// ── Leaf helpers ─────────────────────────────────────────────────────────

/**
 * Convert an absolute path to one relative to DOCS_ROOT.
 * @param {string} filePath - Absolute file path.
 * @returns {string} Relative path from docs root.
 */
function rel(filePath) {
  return path.relative(DOCS_ROOT, filePath);
}

/**
 * Read the frontmatter of markdown files through tools/read_frontmatter.py.
 * @param {string[]} files - Absolute file paths.
 * @returns {Object<string, { fields?: object, error?: string }>} Fields, every scalar as text, or an error, by path.
 */
function readFrontmatter(files) {
  try {
    return JSON.parse(execFileSync('uv', ['run', '--quiet', READER], { input: files.join('\n'), encoding: 'utf8' }));
  } catch (error) {
    if (error.code === 'ENOENT') console.error('Error: uv is required to read frontmatter: https://docs.astral.sh/uv/');
    process.exit(1);
  }
}

/**
 * Extract sidebar.order from frontmatter fields.
 * @param {object} fields - The file's frontmatter, every scalar as text.
 * @returns {{ hasSidebar: boolean, order?: number|null, orderInvalid?: boolean }}
 */
function extractSidebarOrder(fields) {
  if (!('sidebar' in fields)) return { hasSidebar: false };
  const order = fields.sidebar?.order;
  if (order === undefined) return { hasSidebar: true, order: null };
  if (typeof order !== 'string' || !/^\d+$/.test(order)) return { hasSidebar: true, order: null, orderInvalid: true };
  return validateOrder(order);
}

/**
 * Validate a parsed order value and return a result object.
 * Rejects non-finite values (Infinity, NaN) and non-positive values (0, negative).
 * @param {string} raw - Raw digit string from frontmatter.
 * @returns {{ hasSidebar: boolean, order?: number|null, orderInvalid?: boolean }}
 */
function validateOrder(raw) {
  const n = parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 1) return { hasSidebar: true, order: null, orderInvalid: true };
  return { hasSidebar: true, order: n };
}

/**
 * List markdown files (.md/.mdx) in a directory, excluding subdirectories.
 * @param {string} dirPath - Absolute path to the directory.
 * @returns {fs.Dirent[]} Dirent entries for markdown files.
 */
function listMdEntries(dirPath) {
  return fs.readdirSync(dirPath, { withFileTypes: true }).filter((e) => e.isFile() && (e.name.endsWith('.md') || e.name.endsWith('.mdx')));
}

main();

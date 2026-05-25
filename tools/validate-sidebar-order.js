/**
 * Sidebar Order Validator
 *
 * Validates sidebar.order values in YAML frontmatter of markdown doc files.
 *
 * English docs — strict (errors):
 *   - Duplicate sidebar.order values within the same directory
 *   - Gaps in the ordering sequence
 *   - sidebar: block present but missing or invalid order: field
 *
 * Translations — errors + warnings:
 *   - Same structural rules as English (duplicates, gaps) — errors
 *   - Order drift from English counterpart — warnings (non-blocking)
 *
 * Usage:
 *   node tools/validate-sidebar-order.js
 */

const fs = require('node:fs');
const path = require('node:path');

const DOCS_ROOT = path.resolve(__dirname, '../docs');
const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/;
const LOCALE_RE = /^[a-z]{2}(?:-[a-zA-Z0-9]+)*$/;
const MAX_GAPS = 50;

// ── Main ─────────────────────────────────────────────────────────────────

/**
 * Scan all docs, validate sidebar orders, and report errors/warnings.
 * Exits 0 on success, 1 if any errors found.
 */
function main() {
  if (!fs.existsSync(DOCS_ROOT)) {
    console.error(`Error: docs directory not found at ${DOCS_ROOT}`);
    process.exit(1);
  }

  const { languageDirs, englishSections } = classifyDocsDirs();
  console.log(`\nValidating sidebar ordering in: ${DOCS_ROOT}\n`);
  console.log(`English sections: ${englishSections.join(', ')}`);
  console.log(`Translation languages: ${languageDirs.join(', ')}\n`);

  const allErrors = [];
  const allWarnings = [];
  const englishOrderMaps = new Map();

  for (const section of englishSections) {
    const sectionDir = path.join(DOCS_ROOT, section);
    if (!fs.existsSync(sectionDir)) continue;

    console.log(`\nChecking English docs/${section}/`);
    const { orderMap, issues } = checkDirectory(sectionDir);
    englishOrderMaps.set(section, orderMap);

    for (const issue of issues) {
      allErrors.push(issue);
      reportIssue(issue, '  ', `docs/${section}`);
    }
    if (issues.length === 0) {
      console.log(`  [OK] docs/${section}/ — all orders valid`);
    }
  }

  for (const lang of languageDirs) {
    const langDir = path.join(DOCS_ROOT, lang);
    const langSections = fs
      .readdirSync(langDir, { withFileTypes: true })
      .filter((e) => e.isDirectory() && !e.name.startsWith('_'))
      .map((e) => e.name);

    console.log(`\nChecking ${lang}/ docs`);

    for (const section of langSections) {
      const sectionDir = path.join(langDir, section);
      if (!fs.existsSync(sectionDir)) continue;

      console.log(`  ${lang}/${section}/`);
      const { issues } = checkDirectory(sectionDir);

      for (const issue of issues) {
        allErrors.push(issue);
        reportIssue(issue, '    ', `${lang}/${section}`);
      }
      if (issues.length === 0) {
        console.log(`    [OK] ${lang}/${section}/ — all orders valid`);
      }
    }

    for (const w of checkTranslationDrift(lang, langSections, englishOrderMaps)) {
      allWarnings.push(w);
      const langDisplay = w.langOrder === null ? 'no order' : `order ${w.langOrder}`;
      console.log(`  [WARN] ${rel(w.file)}: ${langDisplay} (English: ${w.englishOrder})`);
    }
  }

  printSummary(allErrors, allWarnings);
  process.exit(allErrors.length > 0 ? 1 : 0);
}

// ── Directory classification ─────────────────────────────────────────────

/**
 * Classify top-level docs/ subdirectories as language dirs or English sections.
 * Language dirs match BCP 47 locale pattern; everything else is English.
 * @returns {{ languageDirs: string[], englishSections: string[] }}
 */
function classifyDocsDirs() {
  const dirs = fs.readdirSync(DOCS_ROOT, { withFileTypes: true }).filter((e) => e.isDirectory() && !e.name.startsWith('_'));

  const languageDirs = [];
  const englishSections = [];

  for (const d of dirs) {
    (LOCALE_RE.test(d.name) ? languageDirs : englishSections).push(d.name);
  }

  return { languageDirs, englishSections };
}

// ── Per-directory validation ─────────────────────────────────────────────

/**
 * Validate sidebar.order values for all markdown files in a directory.
 * Detects duplicates, gaps in sequence, missing-order, and invalid-order fields.
 * @param {string} dirPath - Absolute path to the directory to scan.
 * @returns {{ orderMap: Map<number, string[]>, issues: object[] }}
 */
function checkDirectory(dirPath) {
  const issues = [];
  const orderMap = new Map();
  const missingOrder = [];
  const invalidOrder = [];

  for (const entry of listMdEntries(dirPath)) {
    const fullPath = path.join(dirPath, entry.name);
    const result = extractSidebarOrder(fs.readFileSync(fullPath, 'utf-8'));

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

// ── Cross-language drift ─────────────────────────────────────────────────

/**
 * Compare translated sidebar orders against English counterparts and warn on drift.
 * Warns on numeric drift and on translation having sidebar but missing order.
 * Files without an English counterpart are skipped silently.
 * @param {string} lang - Language directory name (e.g. "cs", "zh-cn").
 * @param {string[]} langSections - Section subdirectories within the language folder.
 * @param {Map<string, Map<number, string[]>>} englishOrderMaps - English order maps keyed by section name.
 * @returns {object[]} Drift warnings.
 */
function checkTranslationDrift(lang, langSections, englishOrderMaps) {
  const warnings = [];

  for (const section of langSections) {
    const sectionDir = path.join(DOCS_ROOT, lang, section);
    if (!fs.existsSync(sectionDir)) continue;

    const englishMap = englishOrderMaps.get(section);
    if (!englishMap) continue;

    for (const entry of listMdEntries(sectionDir)) {
      const langFile = path.join(sectionDir, entry.name);
      const englishFile = path.join(DOCS_ROOT, section, entry.name);
      if (!fs.existsSync(englishFile)) continue;

      const langResult = extractSidebarOrder(fs.readFileSync(langFile, 'utf-8'));
      const engResult = extractSidebarOrder(fs.readFileSync(englishFile, 'utf-8'));

      const langHasOrder = typeof langResult.order === 'number';
      const engHasOrder = typeof engResult.order === 'number';

      if (langHasOrder && engHasOrder && langResult.order !== engResult.order) {
        warnings.push({
          level: 'warning',
          type: 'order-drift',
          file: langFile,
          englishFile,
          langOrder: langResult.order,
          englishOrder: engResult.order,
        });
      } else if (engHasOrder && langResult.hasSidebar && !langHasOrder) {
        warnings.push({
          level: 'warning',
          type: 'order-drift',
          file: langFile,
          englishFile,
          langOrder: null,
          englishOrder: engResult.order,
        });
      }
    }
  }

  return warnings;
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
    case 'invalid-order': {
      console.log(`${indent}[ERROR] ${issue.message}: ${rel(issue.file)}`);
      break;
    }
  }
}

/**
 * Print summary with error/warning counts and error type breakdown.
 * @param {object[]} errors - All collected errors.
 * @param {object[]} warnings - All collected warnings.
 */
function printSummary(errors, warnings) {
  console.log(`\n${'─'.repeat(60)}`);
  console.log('\nSummary:');
  console.log(`   Errors:   ${errors.length}`);
  console.log(`   Warnings: ${warnings.length}`);

  if (errors.length > 0) {
    const breakdown = {};
    for (const e of errors) breakdown[e.type] = (breakdown[e.type] || 0) + 1;
    console.log('\n   Error breakdown:');
    for (const [type, count] of Object.entries(breakdown)) console.log(`     ${type}: ${count}`);
  }

  if (errors.length === 0 && warnings.length === 0) {
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
 * Extract sidebar.order from YAML frontmatter.
 * Handles block mapping (sidebar:\n  order: 5) and flow mapping (sidebar: { order: 5 }).
 * Only matches order: as a direct child of sidebar:, not from nested blocks.
 * @param {string} content - Full file contents of a markdown file.
 * @returns {{ hasSidebar: boolean, order?: number|null, orderInvalid?: boolean }}
 */
function extractSidebarOrder(content) {
  const match = content.match(FRONTMATTER_RE);
  if (!match) return { hasSidebar: false };

  const frontmatter = match[1];

  // Flow mapping: sidebar: { order: 5 }
  const inline = frontmatter.match(/^sidebar:[ \t]*\{[^}]*\border:[ \t]*(\d+)/m);
  if (inline) return validateOrder(inline[1]);

  // Block mapping: sidebar:\n  order: 5
  if (!/^sidebar:[ \t]*$/m.test(frontmatter)) return { hasSidebar: false };

  const lines = frontmatter.split(/\r?\n/);
  const start = lines.findIndex((l) => /^sidebar:[ \t]*$/.test(l));
  let baseIndent = null;

  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*$/.test(line)) continue;

    const indent = line.search(/\S/);
    if (indent === 0) break;
    if (baseIndent === null) baseIndent = indent;
    if (indent < baseIndent) break;
    if (indent > baseIndent) continue;

    const m = line.match(/^\s+order:[ \t]*(\d+)/);
    if (m) return validateOrder(m[1]);
  }

  return { hasSidebar: true, order: null };
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

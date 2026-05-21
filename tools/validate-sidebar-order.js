/**
 * Sidebar Order Validator
 *
 * Validates sidebar.order values in YAML frontmatter of markdown doc files.
 *
 * What it checks (English — strict, errors):
 * - Duplicate sidebar.order values within the same directory
 * - Gaps in the ordering sequence (e.g., 1, 2, 4 missing 3)
 * - sidebar: block present but missing order: field
 *
 * What it checks (translations — errors + warnings):
 * - Same structural rules as English (duplicates, gaps) — errors
 * - Order drift from English counterpart — warnings (non-blocking)
 *
 * Usage:
 *   node tools/validate-sidebar-order.js
 */

const fs = require('node:fs');
const path = require('node:path');

const DOCS_ROOT = path.resolve(__dirname, '../docs');
const FRONTMATTER_REGEX = /^---\r?\n([\s\S]*?)\r?\n---/;
const SIDEBAR_ORDER_REGEX = /sidebar:\s*\r?\n(?:(?:[ \t]+.*\r?\n)|(?:\r?\n))*?[ \t]+order:\s*(\d+)/;
const HAS_SIDEBAR_REGEX = /^sidebar:/m;
function extractSidebarOrder(content) {
  const match = content.match(FRONTMATTER_REGEX);
  if (!match) return { hasSidebar: false };

  const frontmatter = match[1];

  if (!HAS_SIDEBAR_REGEX.test(frontmatter)) {
    return { hasSidebar: false };
  }

  const orderMatch = frontmatter.match(SIDEBAR_ORDER_REGEX);
  if (!orderMatch) {
    return { hasSidebar: true, order: null };
  }

  return { hasSidebar: true, order: parseInt(orderMatch[1], 10) };
}

function detectLanguageDirs() {
  const dirs = [];
  const entries = fs.readdirSync(DOCS_ROOT, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith('_')) continue;

    const subPath = path.join(DOCS_ROOT, entry.name);
    const subEntries = fs.readdirSync(subPath, { withFileTypes: true });
    const hasSubdirs = subEntries.some((e) => e.isDirectory() && !e.name.startsWith('_'));

    if (hasSubdirs) {
      dirs.push(entry.name);
    }
  }
  return dirs;
}

function getEnglishSections() {
  const entries = fs.readdirSync(DOCS_ROOT, { withFileTypes: true });
  return entries.filter((e) => e.isDirectory() && !e.name.startsWith('_')).map((e) => e.name);
}

function checkDirectory(dirPath, issues) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const mdFiles = entries.filter((e) => e.isFile() && (e.name.endsWith('.md') || e.name.endsWith('.mdx')));

  const orderMap = new Map();
  const missingOrder = [];

  for (const entry of mdFiles) {
    const fullPath = path.join(dirPath, entry.name);
    const content = fs.readFileSync(fullPath, 'utf-8');
    const { hasSidebar, order } = extractSidebarOrder(content);

    if (!hasSidebar) continue;

    if (order === null) {
      missingOrder.push(fullPath);
      continue;
    }

    if (!orderMap.has(order)) {
      orderMap.set(order, []);
    }
    orderMap.get(order).push(fullPath);
  }

  for (const file of missingOrder) {
    issues.push({
      level: 'error',
      type: 'missing-order',
      file,
      message: `Has sidebar: block but no order: field`,
    });
  }

  for (const [order, files] of orderMap) {
    if (files.length > 1) {
      for (const file of files) {
        issues.push({
          level: 'error',
          type: 'duplicate-order',
          file,
          order,
          message: `Duplicate sidebar.order: ${order}`,
        });
      }
    }
  }

  if (orderMap.size > 0) {
    const orders = [...orderMap.keys()].sort((a, b) => a - b);
    const max = orders.at(-1);

    for (let i = 1; i <= max; i++) {
      if (!orderMap.has(i)) {
        issues.push({
          level: 'error',
          type: 'gap',
          directory: dirPath,
          missing: i,
          message: `Gap in sidebar order: missing position ${i}`,
        });
      }
    }
  }

  return orderMap;
}

function checkTranslationDrift(lang, langSections, englishOrderMaps, warnings) {
  for (const section of langSections) {
    const sectionDir = path.join(DOCS_ROOT, lang, section);
    if (!fs.existsSync(sectionDir)) continue;

    const englishMap = englishOrderMaps.get(section);
    if (!englishMap) continue;

    const entries = fs.readdirSync(sectionDir, { withFileTypes: true });
    const mdFiles = entries.filter((e) => e.isFile() && (e.name.endsWith('.md') || e.name.endsWith('.mdx')));

    for (const entry of mdFiles) {
      const langFile = path.join(sectionDir, entry.name);
      const englishFile = path.join(DOCS_ROOT, section, entry.name);

      if (!fs.existsSync(englishFile)) continue;

      const langContent = fs.readFileSync(langFile, 'utf-8');
      const engContent = fs.readFileSync(englishFile, 'utf-8');

      const langResult = extractSidebarOrder(langContent);
      const engResult = extractSidebarOrder(engContent);

      if (langResult.order !== null && engResult.order !== null && langResult.order !== engResult.order) {
        warnings.push({
          level: 'warning',
          type: 'order-drift',
          file: langFile,
          englishFile,
          langOrder: langResult.order,
          englishOrder: engResult.order,
          message: `Order drift: ${lang} has order ${langResult.order}, English has ${engResult.order}`,
        });
      }
    }
  }
}

function relativePath(filePath) {
  return path.relative(DOCS_ROOT, filePath);
}

// Main execution
console.log(`\nValidating sidebar ordering in: ${DOCS_ROOT}\n`);

const languageDirs = detectLanguageDirs();
const englishSections = getEnglishSections().filter((s) => !languageDirs.includes(s));

console.log(`English sections: ${englishSections.join(', ')}`);
console.log(`Translation languages: ${languageDirs.join(', ')}\n`);

const allErrors = [];
const allWarnings = [];

const englishOrderMaps = new Map();

for (const section of englishSections) {
  const sectionDir = path.join(DOCS_ROOT, section);
  if (!fs.existsSync(sectionDir) || !fs.statSync(sectionDir).isDirectory()) continue;

  console.log(`\nChecking English docs/${section}/`);
  const issues = [];
  const orderMap = checkDirectory(sectionDir, issues);
  englishOrderMaps.set(section, orderMap);

  for (const issue of issues) {
    if (issue.level === 'error') {
      allErrors.push(issue);
      switch (issue.type) {
        case 'duplicate-order': {
          console.log(`  [ERROR] Duplicate order ${issue.order}: ${relativePath(issue.file)}`);
          break;
        }
        case 'gap': {
          console.log(`  [ERROR] ${issue.message} in docs/${section}/`);
          break;
        }
        case 'missing-order': {
          console.log(`  [ERROR] ${issue.message}: ${relativePath(issue.file)}`);
          break;
        }
      }
    }
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
    const issues = [];
    checkDirectory(sectionDir, issues);

    for (const issue of issues) {
      allErrors.push(issue);
      switch (issue.type) {
        case 'duplicate-order': {
          console.log(`    [ERROR] Duplicate order ${issue.order}: ${relativePath(issue.file)}`);
          break;
        }
        case 'gap': {
          console.log(`    [ERROR] ${issue.message} in ${lang}/${section}/`);
          break;
        }
        case 'missing-order': {
          console.log(`    [ERROR] ${issue.message}: ${relativePath(issue.file)}`);
          break;
        }
      }
    }

    if (issues.length === 0) {
      console.log(`    [OK] ${lang}/${section}/ — all orders valid`);
    }
  }

  const driftWarnings = [];
  checkTranslationDrift(lang, langSections, englishOrderMaps, driftWarnings);
  for (const w of driftWarnings) {
    allWarnings.push(w);
    console.log(`  [WARN] ${relativePath(w.file)}: order ${w.langOrder} (English: ${w.englishOrder})`);
  }
}

console.log(`\n${'─'.repeat(60)}`);
console.log(`\nSummary:`);
console.log(`   Errors:   ${allErrors.length}`);
console.log(`   Warnings: ${allWarnings.length}`);

if (allErrors.length > 0) {
  const types = {};
  for (const e of allErrors) {
    types[e.type] = (types[e.type] || 0) + 1;
  }
  console.log(`\n   Error breakdown:`);
  for (const [type, count] of Object.entries(types)) {
    console.log(`     ${type}: ${count}`);
  }
}

if (allErrors.length === 0 && allWarnings.length === 0) {
  console.log(`\n   All sidebar orders valid!`);
}

console.log('');
process.exit(allErrors.length > 0 ? 1 : 0);

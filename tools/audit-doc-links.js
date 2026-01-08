/**
 * Documentation Link Auditor
 *
 * Scans markdown files in docs/ and:
 * - Identifies broken relative links
 * - Attempts to find where files may have moved
 * - Generates a report with auto-fix suggestions
 * - Outputs JSON for the fixer script to consume
 *
 * Usage: node tools/audit-doc-links.js
 */

const { readFileSync, writeFileSync, existsSync } = require('node:fs');
const { resolve, dirname, join, normalize, relative, basename } = require('node:path');
const { glob } = require('glob');

const DOCS_DIR = resolve(process.cwd(), 'docs');
const REPORT_PATH = resolve(__dirname, '.link-audit-report.json');

// Regex to match markdown links: [text](path)
const LINK_PATTERN = /\[([^\]]*)\]\(([^)]+)\)/g;

// Colors for console output
const colors = {
  reset: '\u001B[0m',
  red: '\u001B[31m',
  green: '\u001B[32m',
  yellow: '\u001B[33m',
  cyan: '\u001B[36m',
  dim: '\u001B[2m',
};

/**
 * Determines whether a link should be ignored during validation.
 */
function shouldIgnoreLink(link) {
  return (
    link.startsWith('http://') ||
    link.startsWith('https://') ||
    link.startsWith('mailto:') ||
    link.startsWith('tel:') ||
    link.startsWith('/') || // Absolute paths handled by Astro routing
    link.startsWith('#') // Same-file anchors
  );
}

/**
 * Remove fenced and inline code segments from Markdown content.
 */
function stripCodeBlocks(content) {
  return content
    .replaceAll(/```[\s\S]*?```/g, '')
    .replaceAll(/~~~[\s\S]*?~~~/g, '')
    .replaceAll(/`[^`\n]+`/g, '');
}

/**
 * Parse link to extract path and anchor.
 */
function parseLink(link) {
  const hashIndex = link.indexOf('#');
  if (hashIndex === -1) {
    return { path: link, anchor: null };
  }
  return {
    path: link.slice(0, hashIndex) || null,
    anchor: link.slice(hashIndex + 1),
  };
}

/**
 * Get line number for a character position in content.
 */
function getLineNumber(content, charIndex) {
  const lines = content.slice(0, charIndex).split('\n');
  return lines.length;
}

/**
 * Extract links with their line numbers from markdown content.
 */
function extractLinksWithPositions(content, filePath) {
  const strippedContent = stripCodeBlocks(content);
  const links = [];

  let match;
  LINK_PATTERN.lastIndex = 0;

  while ((match = LINK_PATTERN.exec(strippedContent)) !== null) {
    const rawLink = match[2];
    if (!shouldIgnoreLink(rawLink)) {
      const lineNumber = getLineNumber(strippedContent, match.index);
      links.push({
        raw: rawLink,
        text: match[1],
        line: lineNumber,
        fullMatch: match[0],
      });
    }
  }

  return links;
}

/**
 * Resolve a relative link path to an absolute file path.
 */
function resolveLink(fromFile, linkPath) {
  if (!linkPath) return fromFile;

  const fromDir = dirname(fromFile);
  let resolved = normalize(resolve(fromDir, linkPath));

  // If link doesn't have extension, try .md
  if (!resolved.endsWith('.md') && !resolved.endsWith('.mdx') && !existsSync(resolved)) {
    const withMd = resolved + '.md';
    if (existsSync(withMd)) {
      return withMd;
    }
    // Try as directory with index.md
    const asIndex = join(resolved, 'index.md');
    if (existsSync(asIndex)) {
      return asIndex;
    }
  }

  return resolved;
}

/**
 * Search for a file that may have moved.
 * Uses multiple strategies to find the best match.
 *
 * @param {string} brokenPath - The original broken link path (e.g., "../tutorials/getting-started/foo.md")
 * @returns {string[]} Array of matching absolute paths
 */
async function findMovedFile(brokenPath) {
  const fileName = basename(brokenPath);
  const searchName = fileName.endsWith('.md') ? fileName : `${fileName}.md`;

  // Strategy 1: Try to match with directory context
  // e.g., for "tutorials/getting-started/foo.md", look for "*/getting-started/foo.md"
  const pathParts = brokenPath.replace(/^\.\.?\/?/, '').split('/');
  if (pathParts.length >= 2) {
    const parentDir = pathParts.at(-2);
    const contextPattern = `**/${parentDir}/${searchName}`;
    const contextMatches = await glob(contextPattern, {
      cwd: DOCS_DIR,
      absolute: true,
      ignore: ['**/_*/**'],
    });
    if (contextMatches.length > 0) {
      return contextMatches;
    }
  }

  // Strategy 2: For non-index files, try filename-only match
  // Skip this for index.md since it's too generic (exists in every directory)
  if (searchName !== 'index.md') {
    const matches = await glob(`**/${searchName}`, {
      cwd: DOCS_DIR,
      absolute: true,
      ignore: ['**/_*/**'],
    });
    return matches;
  }

  // For index.md with no context match, return empty (truly missing)
  return [];
}

/**
 * Calculate the relative path from source file to target file.
 */
function calculateRelativePath(fromFile, toFile) {
  const fromDir = dirname(fromFile);
  let relativePath = relative(fromDir, toFile);

  // Ensure path starts with ./ or ../
  if (!relativePath.startsWith('.')) {
    relativePath = './' + relativePath;
  }

  return relativePath;
}

/**
 * Main audit function.
 */
async function main() {
  console.log('\n  Documentation Link Auditor');
  console.log('  ==========================\n');
  console.log('  Scanning for broken links and attempting auto-resolution...\n');

  // Find all markdown files, excluding underscore directories
  const files = await glob('**/*.{md,mdx}', {
    cwd: DOCS_DIR,
    absolute: true,
    ignore: ['**/_*/**'],
  });

  console.log(`  Found ${files.length} markdown files to scan.\n`);

  const brokenLinks = [];
  const autoFixable = [];
  const needsReview = [];
  const missing = [];

  // Track all files for fast lookup
  const allFiles = new Set(files);

  for (const file of files) {
    const content = readFileSync(file, 'utf-8');
    const links = extractLinksWithPositions(content, file);
    const relativePath = relative(DOCS_DIR, file);

    for (const linkInfo of links) {
      const { path: linkPath } = parseLink(linkInfo.raw);

      if (!linkPath) continue; // Same-file anchor only

      const targetFile = resolveLink(file, linkPath);

      // Check if target exists
      if (!existsSync(targetFile)) {
        const fileName = basename(linkPath);

        // Try to find the file elsewhere
        const candidates = await findMovedFile(linkPath);

        const brokenInfo = {
          sourceFile: relativePath,
          sourceFileAbsolute: file,
          line: linkInfo.line,
          linkText: linkInfo.text,
          originalLink: linkInfo.raw,
          expectedTarget: linkPath,
          fullMatch: linkInfo.fullMatch,
        };

        if (candidates.length === 1) {
          // Found exactly one match - auto-fixable
          const newPath = calculateRelativePath(file, candidates[0]);
          brokenInfo.suggestedFix = newPath;
          brokenInfo.foundAt = relative(DOCS_DIR, candidates[0]);
          brokenInfo.status = 'auto-fixable';
          autoFixable.push(brokenInfo);
        } else if (candidates.length > 1) {
          // Multiple matches - needs manual review
          brokenInfo.candidates = candidates.map((c) => relative(DOCS_DIR, c));
          brokenInfo.status = 'needs-review';
          needsReview.push(brokenInfo);
        } else {
          // No matches found
          brokenInfo.status = 'missing';
          missing.push(brokenInfo);
        }

        brokenLinks.push(brokenInfo);
      }
    }
  }

  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalFiles: files.length,
      totalBroken: brokenLinks.length,
      autoFixable: autoFixable.length,
      needsReview: needsReview.length,
      missing: missing.length,
    },
    autoFixable,
    needsReview,
    missing,
  };

  // Write JSON report
  writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));

  // Console output
  console.log('  ' + '─'.repeat(50));
  console.log('\n  SUMMARY\n');

  if (brokenLinks.length === 0) {
    console.log(`  ${colors.green}✓${colors.reset} No broken links found!\n`);
    process.exit(0);
  }

  console.log(`  Total broken links: ${colors.red}${brokenLinks.length}${colors.reset}`);
  console.log(`  ├─ Auto-fixable:    ${colors.green}${autoFixable.length}${colors.reset}`);
  console.log(`  ├─ Needs review:    ${colors.yellow}${needsReview.length}${colors.reset}`);
  console.log(`  └─ Missing:         ${colors.red}${missing.length}${colors.reset}\n`);

  // Show auto-fixable
  if (autoFixable.length > 0) {
    console.log(`  ${colors.green}AUTO-FIXABLE${colors.reset} (file found elsewhere)\n`);
    for (const item of autoFixable) {
      console.log(`    ${colors.cyan}${item.sourceFile}${colors.reset}:${item.line}`);
      console.log(`      ${colors.dim}Link:${colors.reset} ${item.originalLink}`);
      console.log(`      ${colors.dim}Fix:${colors.reset}  ${item.suggestedFix}`);
      console.log(`      ${colors.dim}Found at:${colors.reset} ${item.foundAt}\n`);
    }
  }

  // Show needs review
  if (needsReview.length > 0) {
    console.log(`  ${colors.yellow}NEEDS REVIEW${colors.reset} (multiple matches found)\n`);
    for (const item of needsReview) {
      console.log(`    ${colors.cyan}${item.sourceFile}${colors.reset}:${item.line}`);
      console.log(`      ${colors.dim}Link:${colors.reset} ${item.originalLink}`);
      console.log(`      ${colors.dim}Candidates:${colors.reset}`);
      for (const candidate of item.candidates) {
        console.log(`        - ${candidate}`);
      }
      console.log();
    }
  }

  // Show missing
  if (missing.length > 0) {
    console.log(`  ${colors.red}MISSING${colors.reset} (file not found anywhere)\n`);
    for (const item of missing) {
      console.log(`    ${colors.cyan}${item.sourceFile}${colors.reset}:${item.line}`);
      console.log(`      ${colors.dim}Link:${colors.reset} ${item.originalLink}\n`);
    }
  }

  console.log('  ' + '─'.repeat(50));
  console.log(`\n  Report saved to: ${colors.dim}${relative(process.cwd(), REPORT_PATH)}${colors.reset}`);
  console.log(`\n  To fix auto-fixable links, run:`);
  console.log(`    node tools/fix-doc-links.js --apply\n`);

  process.exit(1);
}

main().catch((error) => {
  console.error('Error:', error.message);
  process.exit(1);
});

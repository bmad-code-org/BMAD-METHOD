/**
 * Documentation Link Validator
 *
 * Validates site-relative links in markdown files and attempts to fix broken ones.
 *
 * What it checks:
 * - All site-relative links (starting with /) point to existing .md files
 * - Anchor links (#section) point to valid headings
 *
 * What it fixes:
 * - Broken links where the target file can be found elsewhere in /docs
 *
 * Usage:
 *   node tools/validate-doc-links.js           # Dry run (validate and show issues)
 *   node tools/validate-doc-links.js --write   # Fix auto-fixable issues
 */

const fs = require('node:fs');
const path = require('node:path');

const DOCS_ROOT = path.resolve(__dirname, '../docs');
const DRY_RUN = !process.argv.includes('--write');

// Regex to match markdown links with site-relative paths or bare .md references
const LINK_REGEX = /\[([^\]]*)\]\(((?:\.{1,2}\/|\/)[^)]+|[\w][^)\s]*\.md(?:[?#][^)]*)?)\)/g;

// File extensions that are static assets, not markdown docs
const STATIC_ASSET_EXTENSIONS = ['.zip', '.txt', '.pdf', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico'];

// Custom Astro page routes (not part of the docs content collection)
const CUSTOM_PAGE_ROUTES = new Set([]);

// Regex to extract headings for anchor validation
const HEADING_PATTERN = /^#{1,6}\s+(.+)$/gm;

/**
 * Get all markdown files in docs directory, excluding _* directories/files
 */
function getMarkdownFiles(dir) {
  const files = [];

  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.name.startsWith('_')) {
        continue;
      }

      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        files.push(fullPath);
      }
    }
  }

  walk(dir);
  return files;
}

/**
 * Strip fenced code blocks from content
 */
function stripCodeBlocks(content) {
  return content.replaceAll(/```[\s\S]*?```/g, '');
}

/**
 * Convert a heading to its anchor slug
 */
function headingToAnchor(heading) {
  return heading
    .toLowerCase()
    .replaceAll(/[\u{1F300}-\u{1F9FF}]/gu, '') // Remove emojis
    .replaceAll(/[^\w\s-]/g, '') // Remove special chars
    .replaceAll(/\s+/g, '-') // Spaces to hyphens
    .replaceAll(/-+/g, '-') // Collapse hyphens
    .replaceAll(/^-+|-+$/g, ''); // Trim hyphens
}

/**
 * Extract anchor slugs from a markdown file
 */
function extractAnchors(content) {
  const anchors = new Set();
  let match;

  HEADING_PATTERN.lastIndex = 0;
  while ((match = HEADING_PATTERN.exec(content)) !== null) {
    const headingText = match[1]
      .trim()
      .replaceAll(/`[^`]+`/g, '')
      .replaceAll(/\*\*([^*]+)\*\*/g, '$1')
      .replaceAll(/\*([^*]+)\*/g, '$1')
      .replaceAll(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .trim();
    anchors.add(headingToAnchor(headingText));
  }

  return anchors;
}

/**
 * Resolve a site-relative link to a file path
 * /docs/how-to/installation/install-bmad.md -> docs/how-to/installation/install-bmad.md
 * /how-to/installation/install-bmad/ -> docs/how-to/installation/install-bmad.md or .../index.md
 */
function resolveLink(siteRelativePath, sourceFile) {
  // Strip anchor and query
  let checkPath = siteRelativePath.split('#')[0].split('?')[0];

  // Handle relative paths (including bare .md): resolve from source file's directory
  if (checkPath.startsWith('./') || checkPath.startsWith('../') || (!checkPath.startsWith('/') && checkPath.endsWith('.md'))) {
    const sourceDir = path.dirname(sourceFile);
    const resolved = path.resolve(sourceDir, checkPath);
    // Ensure the resolved path stays within DOCS_ROOT
    if (!resolved.startsWith(DOCS_ROOT + path.sep) && resolved !== DOCS_ROOT) return null;
    if (fs.existsSync(resolved) && fs.statSync(resolved).isFile()) return resolved;
    if (fs.existsSync(resolved + '.md')) return resolved + '.md';
    // Directory: check for index.md
    if (fs.existsSync(resolved) && fs.statSync(resolved).isDirectory()) {
      const indexFile = path.join(resolved, 'index.md');
      if (fs.existsSync(indexFile)) return indexFile;
    }
    return null;
  }

  // Strip /docs/ prefix if present (legacy absolute links)
  if (checkPath.startsWith('/docs/')) {
    checkPath = checkPath.slice(5); // Remove '/docs' but keep leading '/'
  }

  if (checkPath.endsWith('/')) {
    // Could be file.md or directory/index.md
    const asFile = path.join(DOCS_ROOT, checkPath.slice(0, -1) + '.md');
    const asIndex = path.join(DOCS_ROOT, checkPath, 'index.md');

    if (fs.existsSync(asFile)) return asFile;
    if (fs.existsSync(asIndex)) return asIndex;
    return null;
  }

  // Direct path (e.g., /path/file.md)
  const direct = path.join(DOCS_ROOT, checkPath);
  if (fs.existsSync(direct) && fs.statSync(direct).isFile()) return direct;

  // Try with .md extension
  const withMd = direct + '.md';
  if (fs.existsSync(withMd)) return withMd;

  // Directory without trailing slash: check for index.md
  if (fs.existsSync(direct) && fs.statSync(direct).isDirectory()) {
    const indexFile = path.join(direct, 'index.md');
    if (fs.existsSync(indexFile)) return indexFile;
  }

  return null;
}

/**
 * Search for a file with directory context
 */
function findFileWithContext(brokenPath) {
  // Extract filename and parent directory from the broken path
  // e.g., /tutorials/getting-started/foo/ -> parent: getting-started, file: foo.md
  const cleanPath = brokenPath.replace(/\/$/, '').replace(/^(\.\.\/|\.\/|\/)+/, '');
  const parts = cleanPath.split('/');
  const fileName = parts.at(-1) + '.md';
  const parentDir = parts.length > 1 ? parts.at(-2) : null;

  const allFiles = getMarkdownFiles(DOCS_ROOT);
  const matches = [];

  for (const file of allFiles) {
    const fileBaseName = path.basename(file);
    const fileParentDir = path.basename(path.dirname(file));

    // Exact filename match with parent directory context
    if (fileBaseName === fileName) {
      if (parentDir && fileParentDir === parentDir) {
        // Strong match: both filename and parent dir match
        return [file];
      }
      matches.push(file);
    }

    // Also check for index.md in a matching directory
    if (fileBaseName === 'index.md' && fileParentDir === fileName.replace('.md', '')) {
      matches.push(file);
    }
  }

  return matches;
}

/**
 * Convert absolute file path to site-relative URL
 */
function fileToSiteRelative(filePath) {
  let relative = '/' + path.relative(DOCS_ROOT, filePath);
  relative = relative.split(path.sep).join('/');

  if (relative.endsWith('/index.md')) {
    return relative.replace(/\/index\.md$/, '/');
  }
  return relative.replace(/\.md$/, '/');
}

/**
 * Process a single file and find issues
 */
function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const strippedContent = stripCodeBlocks(content);
  const issues = [];

  let match;
  LINK_REGEX.lastIndex = 0;

  while ((match = LINK_REGEX.exec(strippedContent)) !== null) {
    const linkText = match[1];
    const href = match[2];

    // Extract path and anchor
    const hashIndex = href.indexOf('#');
    const linkPath = hashIndex === -1 ? href : href.slice(0, hashIndex);
    const anchor = hashIndex === -1 ? null : href.slice(hashIndex + 1);

    // Skip static asset links (zip, txt, images, etc.)
    const linkLower = linkPath.toLowerCase();
    if (STATIC_ASSET_EXTENSIONS.some((ext) => linkLower.endsWith(ext))) {
      continue;
    }

    // Skip custom Astro page routes
    if (CUSTOM_PAGE_ROUTES.has(linkPath)) {
      continue;
    }

    // Validate the link target exists
    const targetFile = resolveLink(linkPath, filePath);

    if (!targetFile) {
      // Link is broken - try to find the file
      const candidates = findFileWithContext(linkPath);

      const issue = {
        type: 'broken-link',
        linkText,
        href,
        linkPath,
        fullMatch: match[0],
      };

      if (candidates.length === 1) {
        issue.status = 'auto-fixable';
        issue.suggestedFix = fileToSiteRelative(candidates[0]) + (anchor ? '#' + anchor : '');
        issue.foundAt = path.relative(DOCS_ROOT, candidates[0]);
      } else if (candidates.length > 1) {
        issue.status = 'needs-review';
        issue.candidates = candidates.map((c) => path.relative(DOCS_ROOT, c));
      } else {
        issue.status = 'manual-check';
      }

      issues.push(issue);
      continue;
    }

    // Validate anchor if present
    if (anchor) {
      const targetContent = fs.readFileSync(targetFile, 'utf-8');
      const anchors = extractAnchors(targetContent);

      if (!anchors.has(anchor)) {
        issues.push({
          type: 'broken-anchor',
          linkText,
          href,
          anchor,
          status: 'manual-check',
          message: `Anchor "#${anchor}" not found`,
        });
      }
    }
  }

  return { content, issues };
}

/**
 * Apply fixes to file content
 */
function applyFixes(content, issues) {
  let updated = content;

  for (const issue of issues) {
    if (issue.status === 'auto-fixable' && issue.suggestedFix) {
      const oldLink = `[${issue.linkText}](${issue.href})`;
      const newLink = `[${issue.linkText}](${issue.suggestedFix})`;
      updated = updated.replace(oldLink, newLink);
    }
  }

  return updated;
}

// Main execution
console.log(`\nValidating docs in: ${DOCS_ROOT}`);
console.log(`Mode: ${DRY_RUN ? 'DRY RUN (use --write to fix)' : 'WRITE MODE'}\n`);

const files = getMarkdownFiles(DOCS_ROOT);
console.log(`Found ${files.length} markdown files\n`);

let totalIssues = 0;
let autoFixable = 0;
let needsReview = 0;
let manualCheck = 0;
let filesWithIssues = 0;

const allIssues = [];

for (const filePath of files) {
  const relativePath = path.relative(DOCS_ROOT, filePath);
  const { content, issues } = processFile(filePath);

  if (issues.length > 0) {
    filesWithIssues++;
    totalIssues += issues.length;

    console.log(`\n${relativePath}`);

    for (const issue of issues) {
      if (issue.status === 'auto-fixable') {
        autoFixable++;
        console.log(`  [FIX] ${issue.href}`);
        console.log(`     -> ${issue.suggestedFix}`);
      } else if (issue.status === 'needs-review') {
        needsReview++;
        console.log(`  [REVIEW] ${issue.href}`);
        console.log(`     Multiple matches found:`);
        for (const candidate of issue.candidates) {
          console.log(`       - ${candidate}`);
        }
      } else if (issue.type === 'broken-anchor') {
        manualCheck++;
        console.log(`  [MANUAL] ${issue.href}`);
        console.log(`     ${issue.message}`);
      } else {
        manualCheck++;
        console.log(`  [MANUAL] ${issue.href}`);
        console.log(`     File not found anywhere - may need to remove link`);
      }

      allIssues.push({ file: relativePath, ...issue });
    }

    // Apply fixes if not dry run
    if (!DRY_RUN) {
      const fixableIssues = issues.filter((i) => i.status === 'auto-fixable');
      if (fixableIssues.length > 0) {
        const updated = applyFixes(content, fixableIssues);
        fs.writeFileSync(filePath, updated, 'utf-8');
      }
    }
  }
}

console.log(`\n${'─'.repeat(60)}`);
console.log(`\nSummary:`);
console.log(`   Files scanned: ${files.length}`);
console.log(`   Files with issues: ${filesWithIssues}`);
console.log(`   Total issues: ${totalIssues}`);

if (totalIssues > 0) {
  console.log(`\n   Breakdown:`);
  console.log(`     Auto-fixable:  ${autoFixable}`);
  console.log(`     Needs review:  ${needsReview}`);
  console.log(`     Manual check:  ${manualCheck}`);
}

if (totalIssues === 0) {
  console.log(`\n   All links valid!`);
} else if (DRY_RUN && autoFixable > 0) {
  console.log(`\nRun with --write to auto-fix ${autoFixable} issue(s)`);
}

console.log('');

process.exit(totalIssues > 0 ? 1 : 0);

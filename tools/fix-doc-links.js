/**
 * Fix Documentation Links
 *
 * Converts relative markdown links to repo-relative paths with .md extension.
 * This ensures links work both in GitHub and on the Astro/Starlight site
 * (the rehype plugin transforms /docs/path/file.md → /path/file/ at build time).
 *
 * - ./file.md → /docs/current/path/file.md
 * - ../other/file.md → /docs/resolved/path/file.md
 * - /path/file/ → /docs/path/file.md (or /docs/path/file/index.md if it's a directory)
 *
 * Usage:
 *   node tools/fix-doc-links.js           # Dry run (shows what would change)
 *   node tools/fix-doc-links.js --write   # Actually write changes
 */

const fs = require('node:fs');
const path = require('node:path');

const DOCS_ROOT = path.resolve(__dirname, '../docs');
const DRY_RUN = !process.argv.includes('--write');

// Match all markdown links; filtering (external, anchors, assets) happens in convertToRepoRelative.
// This intentionally matches broadly so the handler can make context-aware decisions.
const ALL_MARKDOWN_LINKS_REGEX = /\[([^\]]*)\]\(([^)]+)\)/g;

/**
 * Get all markdown files in docs directory, excluding _* directories/files
 */
function getMarkdownFiles(dir) {
  const files = [];

  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      // Skip underscore-prefixed entries
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
 * Convert a markdown link href to repo-relative path with .md extension
 *
 * @param {string} href - The original href (e.g., "./file.md", "/path/to/page/", "/path/to/page/#anchor")
 * @param {string} currentFilePath - Absolute path to the file containing this link
 * @returns {string|null} - Repo-relative path (e.g., "/docs/path/to/file.md"), or null if shouldn't be converted
 */
function convertToRepoRelative(href, currentFilePath) {
  // Skip external links (including protocol-relative URLs like //cdn.example.com)
  if (href.includes('://') || href.startsWith('//') || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return null;
  }

  // Skip anchor-only links
  if (href.startsWith('#')) {
    return null;
  }

  // Extract anchor and query string if present
  let anchor = '';
  let query = '';
  let pathPortion = href;

  const hashIndex = href.indexOf('#');
  const queryIndex = href.indexOf('?');

  if (hashIndex !== -1 || queryIndex !== -1) {
    const firstDelimiter = Math.min(hashIndex === -1 ? Infinity : hashIndex, queryIndex === -1 ? Infinity : queryIndex);
    pathPortion = href.slice(0, Math.max(0, firstDelimiter));

    const suffix = href.slice(Math.max(0, firstDelimiter));
    const anchorInSuffix = suffix.indexOf('#');

    if (suffix.startsWith('?')) {
      if (anchorInSuffix === -1) {
        query = suffix;
      } else {
        query = suffix.slice(0, Math.max(0, anchorInSuffix));
        anchor = suffix.slice(Math.max(0, anchorInSuffix));
      }
    } else {
      anchor = suffix;
    }
  }

  // Skip non-documentation links (images, external assets, etc.)
  const ext = path.extname(pathPortion).toLowerCase();
  if (
    ext &&
    ext !== '.md' &&
    !['.md'].includes(ext) && // Has an extension that's not .md - skip unless it's a trailing slash path
    !pathPortion.endsWith('/')
  ) {
    return null;
  }

  // Check if original path ends with / (directory reference) BEFORE path.join normalizes it
  const isDirectoryPath = pathPortion.endsWith('/');

  let absolutePath;

  if (pathPortion.startsWith('/docs/')) {
    // Already repo-relative with /docs/ prefix
    absolutePath = path.join(path.dirname(DOCS_ROOT), pathPortion);
  } else if (pathPortion.startsWith('/')) {
    // Site-relative (e.g., /tutorials/getting-started/) - resolve from docs root
    absolutePath = path.join(DOCS_ROOT, pathPortion);
  } else {
    // Relative path (./, ../, or bare filename) - resolve from current file's directory
    const currentDir = path.dirname(currentFilePath);
    absolutePath = path.resolve(currentDir, pathPortion);
  }

  // Convert to repo-relative path (with /docs/ prefix)
  let repoRelative = '/docs/' + path.relative(DOCS_ROOT, absolutePath);

  // Normalize path separators for Windows
  repoRelative = repoRelative.split(path.sep).join('/');

  // If original path was a directory reference (ended with /), check for index.md or file.md
  if (isDirectoryPath) {
    const relativeDir = repoRelative.slice(6); // Remove '/docs/'

    // Handle root path case (relativeDir is empty or just '.')
    const normalizedDir = relativeDir === '' || relativeDir === '.' ? '' : relativeDir;
    const indexPath = path.join(DOCS_ROOT, normalizedDir, 'index.md');
    const filePath = normalizedDir ? path.join(DOCS_ROOT, normalizedDir + '.md') : null;

    if (fs.existsSync(indexPath)) {
      // Avoid double slash when repoRelative is '/docs/' (root case)
      repoRelative = repoRelative.endsWith('/') ? repoRelative + 'index.md' : repoRelative + '/index.md';
    } else if (filePath && fs.existsSync(filePath)) {
      repoRelative = repoRelative + '.md';
    } else {
      // Neither exists - default to index.md and let validation catch it
      repoRelative = repoRelative.endsWith('/') ? repoRelative + 'index.md' : repoRelative + '/index.md';
    }
  } else if (!repoRelative.endsWith('.md')) {
    // Path doesn't end with .md - add .md
    repoRelative = repoRelative + '.md';
  }

  return repoRelative + query + anchor;
}

/**
 * Process a single markdown file, skipping links inside fenced code blocks
 *
 * @param {string} filePath - Absolute path to the file
 * @returns {Object} - { changed: boolean, original: string, updated: string, changes: Array }
 */
function processFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf-8');
  const changes = [];

  // Extract fenced code blocks and replace with placeholders
  const codeBlocks = [];
  const CODE_PLACEHOLDER = '\u0000CODE_BLOCK_';

  let contentWithPlaceholders = original.replaceAll(/```[\s\S]*?```/g, (match) => {
    const index = codeBlocks.length;
    codeBlocks.push(match);
    return `${CODE_PLACEHOLDER}${index}\u0000`;
  });

  // Process links only in non-code-block content
  contentWithPlaceholders = contentWithPlaceholders.replaceAll(ALL_MARKDOWN_LINKS_REGEX, (match, linkText, href) => {
    const newHref = convertToRepoRelative(href, filePath);

    // Skip if conversion returned null (external link, anchor, etc.)
    if (newHref === null) {
      return match;
    }

    // Only record as change if actually different
    if (newHref !== href) {
      changes.push({ from: href, to: newHref });
      return `[${linkText}](${newHref})`;
    }

    return match;
  });

  // Restore code blocks
  const updated = contentWithPlaceholders.replaceAll(
    new RegExp(`${CODE_PLACEHOLDER}(\\d+)\u0000`, 'g'),
    (match, index) => codeBlocks[parseInt(index, 10)],
  );

  return {
    changed: changes.length > 0,
    original,
    updated,
    changes,
  };
}

/**
 * Validate that a repo-relative link points to an existing file
 */
function validateLink(repoRelativePath) {
  // Strip anchor/query
  const checkPath = repoRelativePath.split('#')[0].split('?')[0];

  // Remove /docs/ prefix to get path relative to DOCS_ROOT
  const relativePath = checkPath.startsWith('/docs/') ? checkPath.slice(6) : checkPath.slice(1);

  return fs.existsSync(path.join(DOCS_ROOT, relativePath));
}

// Main execution
console.log(`\nScanning docs in: ${DOCS_ROOT}`);
console.log(`Mode: ${DRY_RUN ? 'DRY RUN (use --write to apply changes)' : 'WRITE MODE'}\n`);

const files = getMarkdownFiles(DOCS_ROOT);
console.log(`Found ${files.length} markdown files (excluding _* paths)\n`);

let totalChanges = 0;
let filesChanged = 0;
const brokenLinks = [];

for (const filePath of files) {
  const relativePath = path.relative(DOCS_ROOT, filePath);
  const result = processFile(filePath);

  if (result.changed) {
    filesChanged++;
    totalChanges += result.changes.length;

    console.log(`\n${relativePath}`);
    for (const change of result.changes) {
      const isValid = validateLink(change.to);
      const status = isValid ? '  ' : '! ';

      console.log(`${status}  ${change.from}`);
      console.log(`    -> ${change.to}`);

      if (!isValid) {
        brokenLinks.push({
          file: relativePath,
          link: change.to,
          original: change.from,
        });
      }
    }

    if (!DRY_RUN) {
      fs.writeFileSync(filePath, result.updated, 'utf-8');
    }
  }
}

console.log(`\n${'─'.repeat(60)}`);
console.log(`\nSummary:`);
console.log(`   Files scanned: ${files.length}`);
console.log(`   Files with changes: ${filesChanged}`);
console.log(`   Total link updates: ${totalChanges}`);

if (brokenLinks.length > 0) {
  console.log(`\n!  Potential broken links (${brokenLinks.length}):`);
  for (const bl of brokenLinks) {
    console.log(`   ${bl.file}: ${bl.link}`);
  }
}

if (DRY_RUN && totalChanges > 0) {
  console.log(`\nRun with --write to apply these changes`);
}

console.log('');

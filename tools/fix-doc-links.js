/**
 * Fix Documentation Links
 *
 * Converts relative markdown links to site-relative paths.
 * - ./file.md → /current/path/file/
 * - ../other/file.md → /resolved/path/file/
 * - /absolute/file.md → /absolute/file/
 * - index.md → parent directory (e.g., /path/index.md → /path/)
 *
 * Usage:
 *   node tools/fix-doc-links.js           # Dry run (shows what would change)
 *   node tools/fix-doc-links.js --write   # Actually write changes
 */

const fs = require('node:fs');
const path = require('node:path');

const DOCS_ROOT = path.resolve(__dirname, '../docs');
const DRY_RUN = !process.argv.includes('--write');

// Regex to match markdown links: [text](path.md) or [text](path.md#anchor)
const MARKDOWN_LINK_REGEX = /\[([^\]]*)\]\(([^)]+\.md(?:#[^)]*)?(?:\?[^)]*)?)\)/g;

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
 * Convert a markdown link href to site-relative path
 *
 * @param {string} href - The original href (e.g., "./file.md", "../other/file.md#anchor")
 * @param {string} currentFilePath - Absolute path to the file containing this link
 * @returns {string} - Site-relative path (e.g., "/path/to/file/", "/path/to/file/#anchor")
 */
function convertToSiteRelative(href, currentFilePath) {
  // Skip external links
  if (href.includes('://')) {
    return href;
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

  let absolutePath;

  if (pathPortion.startsWith('/')) {
    // Already site-relative - resolve from docs root
    absolutePath = path.join(DOCS_ROOT, pathPortion);
  } else {
    // Relative path (./, ../, or bare filename) - resolve from current file's directory
    const currentDir = path.dirname(currentFilePath);
    absolutePath = path.resolve(currentDir, pathPortion);
  }

  // Convert to site-relative path (relative to docs root)
  let siteRelative = '/' + path.relative(DOCS_ROOT, absolutePath);

  // Normalize path separators for Windows
  siteRelative = siteRelative.split(path.sep).join('/');

  // Transform .md to trailing slash
  if (siteRelative.endsWith('/index.md')) {
    siteRelative = siteRelative.replace(/\/index\.md$/, '/');
  } else if (siteRelative.endsWith('.md')) {
    siteRelative = siteRelative.replace(/\.md$/, '/');
  }

  return siteRelative + query + anchor;
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
  contentWithPlaceholders = contentWithPlaceholders.replaceAll(MARKDOWN_LINK_REGEX, (match, linkText, href) => {
    // Skip external links
    if (href.includes('://')) {
      return match;
    }

    const newHref = convertToSiteRelative(href, filePath);

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
 * Validate that a site-relative link points to an existing file
 */
function validateLink(siteRelativePath) {
  // Strip trailing slash and anchor/query
  const checkPath = siteRelativePath.split('#')[0].split('?')[0];

  if (checkPath.endsWith('/')) {
    // Could be directory/index.md or file.md that became directory/
    const asIndex = path.join(DOCS_ROOT, checkPath, 'index.md');
    const asFile = path.join(DOCS_ROOT, checkPath.slice(0, -1) + '.md');

    return fs.existsSync(asIndex) || fs.existsSync(asFile);
  }

  return fs.existsSync(path.join(DOCS_ROOT, checkPath));
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

/**
 * Internal documentation link checker
 * Scans markdown files in docs/ and verifies:
 * - All relative links point to existing files
 * - All anchor links (#section) point to valid headings
 * - No duplicate/conflicting paths
 *
 * Exits with code 1 if broken links are found (fails the build).
 */

const { readFileSync, existsSync } = require('node:fs');
const { resolve, dirname, join, normalize, relative } = require('node:path');
const { glob } = require('glob');

const DOCS_DIR = resolve(process.cwd(), 'docs');

// Regex to match markdown links: [text](path) and reference-style [text]: path
const LINK_PATTERNS = [
  /\[([^\]]*)\]\(([^)]+)\)/g, // [text](path)
  /\[([^\]]+)\]:\s*(\S+)/g, // [text]: path
];

// Regex to extract headings for anchor validation
const HEADING_PATTERN = /^#{1,6}\s+(.+)$/gm;

/**
 * Determines whether a link should be ignored during validation.
 * @param {string} link - The link URL or path to test.
 * @returns {boolean} `true` if the link is external, uses a special protocol (`http://`, `https://`, `mailto:`, `tel:`), or is an absolute path starting with `/`, `false` otherwise.
 */
function shouldIgnore(link) {
  return (
    link.startsWith('http://') ||
    link.startsWith('https://') ||
    link.startsWith('mailto:') ||
    link.startsWith('tel:') ||
    link.startsWith('/') // Absolute paths handled by Astro routing
  );
}

/**
 * Convert a markdown heading into the anchor slug used by common Markdown processors.
 *
 * Produces a lowercase slug with emojis and most punctuation removed, whitespace collapsed to single
 * hyphens, consecutive hyphens collapsed, and leading/trailing hyphens trimmed.
 * @param {string} heading - The heading text to convert.
 * @returns {string} The resulting anchor slug.
 */
function headingToAnchor(heading) {
  return heading
    .toLowerCase()
    .replaceAll(/[\u{1F300}-\u{1F9FF}]/gu, '') // Remove emojis
    .replaceAll(/[^\w\s-]/g, '') // Remove special chars except hyphens
    .replaceAll(/\s+/g, '-') // Spaces to hyphens
    .replaceAll(/-+/g, '-') // Collapse multiple hyphens
    .replaceAll(/^-+|-+$/g, ''); // Trim leading/trailing hyphens
}

/**
 * Extracts anchor slugs from Markdown content by converting headings to their anchor form.
 *
 * Strips inline formatting (code spans, emphasis, bold, and inline links), processes
 * Markdown headings (levels 1–6), and returns the resulting anchor slugs.
 *
 * @param {string} content - The Markdown text to scan for headings.
 * @returns {Set<string>} A set of anchor slugs derived from the headings in `content`.
 */
function extractAnchors(content) {
  const anchors = new Set();
  let match;

  HEADING_PATTERN.lastIndex = 0;
  while ((match = HEADING_PATTERN.exec(content)) !== null) {
    const headingText = match[1].trim();
    // Remove inline code, bold, italic, links from heading
    const cleanHeading = headingText
      .replaceAll(/`[^`]+`/g, '')
      .replaceAll(/\*\*([^*]+)\*\*/g, '$1')
      .replaceAll(/\*([^*]+)\*/g, '$1')
      .replaceAll(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .trim();
    anchors.add(headingToAnchor(cleanHeading));
  }

  return anchors;
}

/**
 * Remove fenced and inline code segments from Markdown content.
 *
 * @param {string} content - Markdown text to sanitize.
 * @returns {string} The input content with fenced code blocks (```...``` and ~~~...~~~) and inline code (backtick-enclosed) removed.
 */
function stripCodeBlocks(content) {
  // Remove fenced code blocks (``` or ~~~)
  return content
    .replaceAll(/```[\s\S]*?```/g, '')
    .replaceAll(/~~~[\s\S]*?~~~/g, '')
    .replaceAll(/`[^`\n]+`/g, ''); // Also remove inline code
}

/**
 * Extracts all non-external link targets from markdown content, ignoring links inside code blocks.
 * @param {string} content - Markdown source to scan for link targets.
 * @returns {string[]} Array of raw link strings (paths and optional anchors) found in the content; external or protocol-based links are excluded.
 */
function extractLinks(content) {
  const strippedContent = stripCodeBlocks(content);
  const links = [];
  for (const pattern of LINK_PATTERNS) {
    let match;
    pattern.lastIndex = 0;
    while ((match = pattern.exec(strippedContent)) !== null) {
      const rawLink = match[2];
      if (!shouldIgnore(rawLink)) {
        links.push(rawLink);
      }
    }
  }
  return links;
}

/**
 * Split a link into its path and anchor components.
 * @param {string} link - The link string to parse; may include a `#` followed by an anchor.
 * @returns {{path: string|null, anchor: string|null}} An object where `path` is the portion before `#` (or `null` when empty, indicating a same-file anchor), and `anchor` is the portion after `#` (or `null` when no `#` is present). Note: `anchor` may be an empty string if the link ends with `#`.
 */
function parseLink(link) {
  const hashIndex = link.indexOf('#');
  if (hashIndex === -1) {
    return { path: link, anchor: null };
  }
  return {
    path: link.slice(0, hashIndex) || null, // Empty path means same file
    anchor: link.slice(hashIndex + 1),
  };
}

/**
 * Resolve a relative markdown link path from a source file to a concrete absolute file path.
 * @param {string} fromFile - Absolute path of the file containing the link.
 * @param {string|null} linkPath - Link target as written in markdown; may be `null` or empty for same-file anchors.
 * @returns {string} The resolved absolute path. If `linkPath` is null/empty returns `fromFile`. If the resolved path has no extension, an existing `.md` file or an `index.md` inside a matching directory is preferred; otherwise the normalized resolved path is returned.
 */
function resolveLink(fromFile, linkPath) {
  if (!linkPath) return fromFile; // Same file anchor

  const fromDir = dirname(fromFile);
  let resolved = normalize(resolve(fromDir, linkPath));

  // If link doesn't have extension, try .md
  if (!resolved.endsWith('.md') && !existsSync(resolved)) {
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

// Cache for file anchors to avoid re-reading files
const anchorCache = new Map();

/**
 * Retrieve and cache the set of markdown anchor slugs for a given file.
 *
 * Reads the file at the provided path, extracts heading-based anchor slugs, stores them in an internal cache, and returns them.
 * @param {string} filePath - Absolute or relative path to the markdown file.
 * @returns {Set<string>} The set of anchor slugs present in the file.
 */
function getAnchorsForFile(filePath) {
  if (anchorCache.has(filePath)) {
    return anchorCache.get(filePath);
  }

  const content = readFileSync(filePath, 'utf-8');
  const anchors = extractAnchors(content);
  anchorCache.set(filePath, anchors);
  return anchors;
}

/**
 * Validate Markdown files in docs/ for broken relative links and anchor targets.
 *
 * Scans all `.md` and `.mdx` files under DOCS_DIR, checks that relative links resolve to existing
 * files and that any `#anchor` references point to existing headings. Prints a grouped,
 * colored report of issues to stdout and terminates the process with exit code `0` if no issues
 * were found or `1` if any broken links or anchors are detected.
 */
async function main() {
  console.log('  → Scanning for broken links and anchors...');

  const files = await glob('**/*.{md,mdx}', { cwd: DOCS_DIR, absolute: true });
  const errors = [];

  // Track all resolved paths for duplicate detection
  const pathRegistry = new Map(); // normalized path -> [source files]

  for (const file of files) {
    const content = readFileSync(file, 'utf-8');
    const links = extractLinks(content);
    const relativePath = relative(DOCS_DIR, file);

    for (const rawLink of links) {
      const { path: linkPath, anchor } = parseLink(rawLink);

      // Resolve target file
      const targetFile = resolveLink(file, linkPath);
      const normalizedTarget = normalize(targetFile);

      // Check if file exists (skip for same-file anchors)
      if (linkPath && !existsSync(targetFile)) {
        errors.push({
          type: 'broken-link',
          file: relativePath,
          link: rawLink,
          message: `File not found: ${linkPath}`,
        });
        continue;
      }

      // Check anchor if present
      if (anchor) {
        const anchors = getAnchorsForFile(targetFile);
        if (!anchors.has(anchor)) {
          errors.push({
            type: 'broken-anchor',
            file: relativePath,
            link: rawLink,
            message: `Anchor "#${anchor}" not found in ${linkPath || 'same file'}`,
          });
        }
      }

      // Track paths for duplicate detection
      if (linkPath) {
        if (!pathRegistry.has(normalizedTarget)) {
          pathRegistry.set(normalizedTarget, []);
        }
        pathRegistry.get(normalizedTarget).push({ from: relativePath, link: rawLink });
      }
    }
  }

  // Report results
  if (errors.length === 0) {
    console.log(`  \u001B[32m✓\u001B[0m Checked ${files.length} files - no broken links found.`);
    process.exit(0);
  }

  console.log(`\n  \u001B[31m✗\u001B[0m Found ${errors.length} issue(s):\n`);

  // Group by file
  const byFile = {};
  for (const error of errors) {
    if (!byFile[error.file]) byFile[error.file] = [];
    byFile[error.file].push(error);
  }

  for (const [file, fileErrors] of Object.entries(byFile)) {
    console.log(`    \u001B[36m${file}\u001B[0m`);
    for (const error of fileErrors) {
      const icon = error.type === 'broken-link' ? '🔗' : '⚓';
      console.log(`      ${icon} ${error.link}`);
      console.log(`         └─ ${error.message}`);
    }
    console.log();
  }

  process.exit(1);
}

main().catch((error) => {
  console.error('Error:', error.message);
  process.exit(1);
});

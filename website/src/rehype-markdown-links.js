/**
 * Rehype plugin to transform relative .md links into correct site URLs.
 *
 * Uses the source file's disk path (via vfile) to resolve the link target,
 * then computes the output URL relative to the content root directory.
 * This correctly handles Starlight's directory-per-page URL structure
 * where ./sibling.md from reference/testing.md must become /reference/sibling/
 * (not ./sibling/ which would resolve to /reference/testing/sibling/).
 *
 * Supports: ./sibling.md, ../other/page.md, bare.md, /docs/absolute.md
 * Preserves: query strings, hash anchors
 * Skips: external URLs, non-.md links
 */

import { visit } from 'unist-util-visit';
import path from 'node:path';

/**
 * @param {Object} options
 * @param {string} options.base - Site base path (e.g., '/BMAD-METHOD/')
 * @param {string} [options.contentDir] - Absolute path to content root; auto-detected if omitted
 */
export default function rehypeMarkdownLinks(options = {}) {
  const base = options.base || '/';
  const normalizedBase = base === '/' ? '' : base.replace(/\/$/, '');

  return (tree, file) => {
    // The current file's absolute path on disk, set by Astro's markdown pipeline
    const currentFilePath = file.path;
    if (!currentFilePath) return;

    // Auto-detect content root: walk up from current file to find src/content/docs
    const contentDir = options.contentDir || detectContentDir(currentFilePath);
    if (!contentDir) {
      throw new Error(`[rehype-markdown-links] Could not detect content directory for: ${currentFilePath}`);
    }

    visit(tree, 'element', (node) => {
      if (node.tagName !== 'a' || typeof node.properties?.href !== 'string') {
        return;
      }

      const href = node.properties.href;

      // Skip external links (including protocol-relative URLs like //cdn.example.com)
      if (href.includes('://') || href.startsWith('//') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return;
      }

      // Split href into path vs query+fragment suffix
      const delimIdx = findFirstDelimiter(href);
      const linkPath = delimIdx === -1 ? href : href.substring(0, delimIdx);
      const suffix = delimIdx === -1 ? '' : href.substring(delimIdx);

      // Only process .md links
      if (!linkPath.endsWith('.md')) return;

      // Resolve the target file's absolute path on disk
      let targetPath;
      if (linkPath.startsWith('/docs/')) {
        // Absolute /docs/ path — resolve from content root
        targetPath = path.join(contentDir, linkPath.slice(5)); // strip '/docs'
      } else if (linkPath.startsWith('/')) {
        // Other absolute paths — resolve from content root
        targetPath = path.join(contentDir, linkPath);
      } else {
        // Relative path (./sibling.md, ../other.md, bare.md) — resolve from current file
        targetPath = path.resolve(path.dirname(currentFilePath), linkPath);
      }

      // Compute the target's path relative to content root
      const relativeToContent = path.relative(contentDir, targetPath);

      // Safety: skip if target resolves outside content root
      if (relativeToContent.startsWith('..')) return;

      // Convert file path to URL: strip .md, handle index, ensure leading/trailing slashes
      let urlPath = relativeToContent.replace(/\.md$/, '');

      // index.md becomes the directory root
      if (urlPath.endsWith('/index') || urlPath === 'index') {
        urlPath = urlPath.slice(0, -'index'.length);
      }

      // Build absolute URL with base path, normalizing any double slashes
      const raw = normalizedBase + '/' + urlPath.replace(/\/?$/, '/') + suffix;
      node.properties.href = raw.replace(/\/\/+/g, '/');
    });
  };
}

/** Find the index of the first ? or # in a string, or -1 if neither exists. */
export function findFirstDelimiter(str) {
  const q = str.indexOf('?');
  const h = str.indexOf('#');
  if (q === -1) return h;
  if (h === -1) return q;
  return Math.min(q, h);
}

/** Walk up from a file path to find the content docs directory. */
export function detectContentDir(filePath) {
  const segments = filePath.split(path.sep);
  // Look for src/content/docs in the path
  for (let i = segments.length - 1; i >= 2; i--) {
    if (segments[i - 2] === 'src' && segments[i - 1] === 'content' && segments[i] === 'docs') {
      return segments.slice(0, i + 1).join(path.sep);
    }
  }
  return null;
}

/**
 * Rehype plugin to transform relative markdown file links (.md) to page routes
 *
 * Transforms:
 *   ./path/to/file.md → ./path/to/file/
 *   ./path/index.md → ./path/ (index.md becomes directory root)
 *   ../path/file.md#anchor → ../path/file/#anchor
 *   ./file.md?query=param → ./file/?query=param
 *
 * Only affects relative links (./,  ../) - absolute and external links are unchanged
 */

import { visit } from 'unist-util-visit';

/**
 * Convert relative Markdown file links (./ or ../) into equivalent page route-style links.
 *
 * The returned transformer walks the HTML tree and rewrites anchor `href` values that are relative paths pointing to `.md` files. It preserves query strings and hash anchors, rewrites `.../index.md` to the directory root path (`.../`), and rewrites other `.md` file paths by removing the `.md` extension and ensuring a trailing slash. Absolute, external, non-relative, non-string, or links without `.md` are left unchanged.
 *
 * @returns {function} A HAST tree transformer that mutates `a` element `href` properties as described.
 */
export default function rehypeMarkdownLinks() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      // Only process anchor tags with href
      if (node.tagName !== 'a' || !node.properties?.href) {
        return;
      }

      const href = node.properties.href;

      // Skip if not a string (shouldn't happen, but be safe)
      if (typeof href !== 'string') {
        return;
      }

      // Only transform relative paths starting with ./ or ../
      if (!href.startsWith('./') && !href.startsWith('../')) {
        return;
      }

      // Don't transform if already doesn't have .md (already transformed or link to directory)
      if (!href.includes('.md')) {
        return;
      }

      // Split the URL into parts: path, anchor, and query
      let urlPath = href;
      let anchor = '';
      let query = '';

      // Extract query string (everything after ?)
      const queryIndex = urlPath.indexOf('?');
      if (queryIndex !== -1) {
        query = urlPath.substring(queryIndex);
        urlPath = urlPath.substring(0, queryIndex);
      }

      // Extract anchor (everything after #)
      const anchorIndex = urlPath.indexOf('#');
      if (anchorIndex !== -1) {
        anchor = urlPath.substring(anchorIndex);
        urlPath = urlPath.substring(0, anchorIndex);
      }

      // Transform .md to / only if it ends with .md
      // Special case: index.md → directory root (e.g., ./tutorials/index.md → ./tutorials/)
      if (urlPath.endsWith('/index.md')) {
        urlPath = urlPath.replace(/\/index\.md$/, '/');
      } else if (urlPath.endsWith('.md')) {
        urlPath = urlPath.replace(/\.md$/, '/');
      }

      // Reconstruct the href: path + anchor + query
      node.properties.href = urlPath + anchor + query;
    });
  };
}
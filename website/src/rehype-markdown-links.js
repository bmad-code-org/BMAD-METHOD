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

      // Extract path portion (before ? and #) to check if it's a .md file
      const firstDelimiter = Math.min(
        href.indexOf('?') === -1 ? Infinity : href.indexOf('?'),
        href.indexOf('#') === -1 ? Infinity : href.indexOf('#'),
      );
      const pathPortion = firstDelimiter === Infinity ? href : href.substring(0, firstDelimiter);

      // Don't transform if path doesn't end with .md
      if (!pathPortion.endsWith('.md')) {
        return;
      }

      // Split the URL into parts: path, anchor, and query
      let urlPath = pathPortion;
      let anchor = '';
      let query = '';

      // Extract query string and anchor from original href
      if (firstDelimiter !== Infinity) {
        const suffix = href.substring(firstDelimiter);
        const anchorInSuffix = suffix.indexOf('#');
        if (suffix.startsWith('?')) {
          if (anchorInSuffix !== -1) {
            query = suffix.substring(0, anchorInSuffix);
            anchor = suffix.substring(anchorInSuffix);
          } else {
            query = suffix;
          }
        } else {
          // starts with #
          anchor = suffix;
        }
      }

      // Transform .md to /
      // Special case: index.md → directory root (e.g., ./tutorials/index.md → ./tutorials/)
      if (urlPath.endsWith('/index.md')) {
        urlPath = urlPath.replace(/\/index\.md$/, '/');
      } else {
        urlPath = urlPath.replace(/\.md$/, '/');
      }

      // Reconstruct the href
      node.properties.href = urlPath + query + anchor;
    });
  };
}

/**
 * Rehype plugin to transform markdown file links (.md) to page routes
 *
 * Transforms:
 *   ./path/to/file.md → ./path/to/file/
 *   ./path/index.md → ./path/ (index.md becomes directory root)
 *   ../path/file.md#anchor → ../path/file/#anchor
 *   ./file.md?query=param → ./file/?query=param
 *   /docs/absolute/path/file.md → /absolute/path/file/
 *
 * For absolute paths starting with /docs/, the /docs prefix is stripped
 * since the Astro site serves content from the docs directory as the root.
 *
 * Affects relative links (./, ../) and absolute paths (/) - external links are unchanged
 */

import { visit } from 'unist-util-visit';

/**
 * Convert Markdown file links (.md) into equivalent page route-style links.
 *
 * The returned transformer walks the HTML tree and rewrites anchor `href` values that are relative paths (./, ../) or absolute paths (/) pointing to `.md` files. It preserves query strings and hash anchors, rewrites `.../index.md` to the directory root path (`.../`), and rewrites other `.md` file paths by removing the `.md` extension and ensuring a trailing slash. External links (http://, https://) and non-.md links are left unchanged.
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

      // Skip external links (http://, https://, mailto:, etc.)
      if (href.includes('://') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return;
      }

      // Only transform paths starting with ./, ../, or / (absolute)
      if (!href.startsWith('./') && !href.startsWith('../') && !href.startsWith('/')) {
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

      // Strip /docs/ prefix from absolute paths (repo-relative → site-relative)
      if (urlPath.startsWith('/docs/')) {
        urlPath = urlPath.slice(5); // Remove '/docs' prefix, keeping the leading /
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

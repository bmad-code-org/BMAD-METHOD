/**
 * Rehype plugin to prepend base path to absolute URLs
 *
 * Transforms:
 *   /img/foo.png → /BMAD-METHOD/img/foo.png (when base is /BMAD-METHOD/)
 *   /llms.txt → /BMAD-METHOD/llms.txt
 *
 * Supported elements:
 *   - img[src], iframe[src], video[src], source[src], audio[src]
 *   - a[href], link[href]
 *
 * Only affects absolute paths (/) - relative paths and external URLs are unchanged.
 * Does NOT process .md links (those are handled by rehype-markdown-links).
 */

import { visit } from 'unist-util-visit';

/**
 * Create a rehype plugin that prepends the base path to absolute URLs.
 *
 * @param {Object} options - Plugin options
 * @param {string} options.base - The base path to prepend (e.g., '/BMAD-METHOD/')
 * @returns {function} A HAST tree transformer
 */
export default function rehypeBasePaths(options = {}) {
  const base = options.base || '/';

  // Normalize base: ensure trailing slash so concatenation with path.slice(1) (no leading /)
  // produces correct paths like /BMAD-METHOD/img/foo.png.
  // Note: rehype-markdown-links uses the opposite convention (strips trailing slash) because
  // it concatenates with paths that start with /.
  const normalizedBase = base === '/' ? '/' : base.endsWith('/') ? base : base + '/';

  /**
   * Prepend base path to an absolute URL attribute if needed.
   * Skips protocol-relative URLs (//) and paths that already include the base.
   *
   * @param {object} node - HAST element node
   * @param {string} attr - Attribute name ('src' or 'href')
   */
  function prependBase(node, attr) {
    const value = node.properties?.[attr];
    if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) {
      return;
    }
    if (normalizedBase !== '/' && !value.startsWith(normalizedBase)) {
      node.properties[attr] = normalizedBase + value.slice(1);
    }
  }

  return (tree) => {
    // Handle raw HTML blocks (inline HTML in markdown that isn't parsed into HAST elements)
    if (normalizedBase !== '/') {
      visit(tree, 'raw', (node) => {
        // Replace absolute src="/..." and href="/..." attributes, skipping protocol-relative
        // and paths that already have the base prefix
        node.value = node.value.replace(/(?<attr>\b(?:src|href))="(?<path>\/(?!\/)[^"]*)"/g, (match, attr, pathValue) => {
          if (pathValue.startsWith(normalizedBase)) return match;
          return `${attr}="${normalizedBase}${pathValue.slice(1)}"`;
        });
      });
    }

    visit(tree, 'element', (node) => {
      const tag = node.tagName;

      // Tags with src attribute
      if (['img', 'iframe', 'video', 'source', 'audio'].includes(tag)) {
        prependBase(node, 'src');
      }

      // Link tags with href attribute (stylesheets, preloads, etc.)
      if (tag === 'link') {
        prependBase(node, 'href');
      }

      // Anchor tags need special handling - skip .md links
      if (tag === 'a' && node.properties?.href) {
        const href = node.properties.href;

        if (typeof href !== 'string') {
          return;
        }

        // Only transform absolute paths starting with / (but not //)
        if (!href.startsWith('/') || href.startsWith('//')) {
          return;
        }

        // Skip if already has the base path
        if (normalizedBase !== '/' && href.startsWith(normalizedBase)) {
          return;
        }

        // Skip .md links - those are handled by rehype-markdown-links
        // Extract path portion (before ? and #)
        const firstDelimiter = Math.min(
          href.indexOf('?') === -1 ? Infinity : href.indexOf('?'),
          href.indexOf('#') === -1 ? Infinity : href.indexOf('#'),
        );
        const pathPortion = firstDelimiter === Infinity ? href : href.substring(0, firstDelimiter);

        if (pathPortion.endsWith('.md')) {
          return; // Let rehype-markdown-links handle this
        }

        // Prepend base path
        node.properties.href = normalizedBase + href.slice(1);
      }
    });
  };
}

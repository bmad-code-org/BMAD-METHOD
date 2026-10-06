/**
 * Rehype plugin to inline hand-authored SVG diagrams.
 *
 * Transforms:
 *   ![alt](/diagrams/build-run.svg) → the contents of src/diagrams/build-run.svg
 *
 * Diagrams are inlined rather than left as `<img src>` for one reason: an
 * `<img>` is an opaque document, so page CSS cannot reach inside it. Inlined,
 * the SVG carries no colours of its own — only classes (`.node`, `.edge`,
 * `.gate`, `.k`) that `custom.css` styles once for every diagram, in both
 * themes.
 *
 * Diagrams that are not hand-authored (raster files, the workflow-map iframe)
 * are left alone.
 */

import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

import { fromHtml } from 'hast-util-from-html';
import { visit } from 'unist-util-visit';

/** Where the authored diagrams live, relative to the Astro site root. */
const DIAGRAM_DIR = 'src/diagrams';

/**
 * Create a rehype plugin that replaces diagram images with inline SVG.
 *
 * @param {object} options
 * @param {string} options.root - Absolute path to the Astro site root.
 * @returns {function} A HAST tree transformer.
 */
export default function rehypeInlineDiagrams(options = {}) {
  const { root } = options;
  const cache = new Map();

  /**
   * Read a diagram, keyed on the file's modification time.
   *
   * The dev server is one long-lived process, so a cache keyed on the name
   * alone would hand back the first drawing it ever read and keep serving it
   * after the file changed — the page would look built and be wrong.
   */
  function load(name) {
    const svgPath = join(root, DIAGRAM_DIR, `${name}.svg`);
    if (!existsSync(svgPath)) return undefined;

    const stamp = String(statSync(svgPath).mtimeMs);

    const cached = cache.get(name);
    if (cached?.stamp === stamp) return cached;

    const entry = {
      stamp,
      svg: readFileSync(svgPath, 'utf8'),
    };
    cache.set(name, entry);
    return entry;
  }

  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'img' || !parent || index === undefined) return;

      const src = node.properties?.src;
      if (typeof src !== 'string') return;

      const match = /\/diagrams\/([\w-]+)\.svg$/.exec(src);
      if (!match) return;

      const diagram = load(match[1]);
      if (!diagram) return;

      const fragment = fromHtml(diagram.svg, { fragment: true, space: 'svg' });

      // Carry the markdown alt text through as the accessible name, but only
      // when the diagram does not name itself. hast camel-cases ARIA
      // attributes, so these are `ariaLabelledBy` / `ariaLabel`; reading the
      // hyphenated form found nothing and overrode every diagram's own <title>.
      const svg = fragment.children.find((child) => child.tagName === 'svg');
      if (svg && node.properties.alt && !svg.properties.ariaLabelledBy && !svg.properties.ariaLabel) {
        svg.properties.ariaLabel = node.properties.alt;
      }

      parent.children.splice(index, 1, ...fragment.children);
    });
  };
}

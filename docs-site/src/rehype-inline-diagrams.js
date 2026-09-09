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
 * Labels are translated, not redrawn. Each `<text>` carries a `data-i18n` key;
 * this plugin swaps in the string for the page's locale from the diagram's
 * sibling `<name>.labels.json`, falling back to the English already in the file.
 * One geometry file serves every language, so a translation can never drift out
 * of shape with the original.
 *
 * Diagrams that are not hand-authored (raster files, the workflow-map iframe)
 * are left alone.
 */

import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';

import { fromHtml } from 'hast-util-from-html';
import { visit } from 'unist-util-visit';

/** Where the authored diagrams live, relative to the Astro site root. */
const DIAGRAM_DIR = 'src/diagrams';

/** `docs/fr/build/x.md` → `fr`. Returns undefined for the root locale. */
function localeFromPath(filePath, docsDirName = 'docs') {
  if (!filePath) return undefined;
  const parts = filePath.split('/');
  const i = parts.lastIndexOf(docsDirName);
  return i === -1 ? undefined : parts[i + 1];
}

/**
 * Create a rehype plugin that replaces diagram images with inline SVG.
 *
 * @param {object} options
 * @param {string} options.root - Absolute path to the Astro site root.
 * @param {Record<string, {lang?: string}>} options.locales - Starlight locale config.
 * @returns {function} A HAST tree transformer.
 */
export default function rehypeInlineDiagrams(options = {}) {
  const { root, locales = {} } = options;
  const cache = new Map();

  /**
   * Read a diagram and its labels, keyed on the file's modification time.
   *
   * The dev server is one long-lived process, so a cache keyed on the name
   * alone would hand back the first drawing it ever read and keep serving it
   * after the file changed — the page would look built and be wrong.
   */
  function load(name) {
    const svgPath = join(root, DIAGRAM_DIR, `${name}.svg`);
    if (!existsSync(svgPath)) return undefined;

    const labelsPath = join(dirname(svgPath), `${name}.labels.json`);
    const stamp = [svgPath, labelsPath]
      .map((file) => (existsSync(file) ? statSync(file).mtimeMs : 0))
      .join(':');

    const cached = cache.get(name);
    if (cached?.stamp === stamp) return cached;

    const entry = {
      stamp,
      svg: readFileSync(svgPath, 'utf8'),
      labels: existsSync(labelsPath) ? JSON.parse(readFileSync(labelsPath, 'utf8')) : {},
    };
    cache.set(name, entry);
    return entry;
  }

  return (tree, file) => {
    const localeKey = localeFromPath(file?.path);
    const lang = locales[localeKey]?.lang;

    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'img' || !parent || index === undefined) return;

      const src = node.properties?.src;
      if (typeof src !== 'string') return;

      const match = /\/diagrams\/([\w-]+)\.svg$/.exec(src);
      if (!match) return;

      const diagram = load(match[1]);
      if (!diagram) return;

      const strings = (lang && diagram.labels[lang]) || {};
      const fragment = fromHtml(diagram.svg, { fragment: true, space: 'svg' });

      // Swap each keyed label for its translation, keeping the authored English
      // wherever a translation is missing.
      visit(fragment, 'element', (el) => {
        const key = el.properties?.dataI18n;
        if (typeof key === 'string' && strings[key]) {
          el.children = [{ type: 'text', value: strings[key] }];
        }
      });

      // Carry the markdown alt text through as the accessible name, but only
      // when the diagram does not name itself. hast camel-cases ARIA
      // attributes, so these are `ariaLabelledBy` / `ariaLabel`; reading the
      // hyphenated form found nothing and overrode every diagram's own <title>.
      const svg = fragment.children.find((child) => child.tagName === 'svg');
      if (svg && node.properties.alt && !svg.properties.ariaLabelledBy) {
        svg.properties.ariaLabel = node.properties.alt;
      }

      parent.children.splice(index, 1, ...fragment.children);
    });
  };
}

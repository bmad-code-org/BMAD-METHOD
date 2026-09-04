/**
 * Astro integration that keeps inlined diagrams from going stale.
 *
 * `rehype-inline-diagrams` splices an SVG into a page while that page's HTML is
 * being rendered, which means the SVG's contents end up inside Astro's content
 * layer cache. Astro keys that cache on the markdown file, and the markdown
 * does not change when a diagram is redrawn — so an edited diagram would keep
 * serving the previous drawing until something else forced a re-render. That is
 * silent and slow to notice: the build succeeds, the page looks fine, and it is
 * simply the wrong picture.
 *
 * This closes the loop from both ends:
 *
 *   - `addWatchFile` so the dev server restarts when a diagram or its labels
 *     change, rather than holding the old render for the session.
 *   - a stamped hash of the diagram directory, compared on every startup and
 *     build; when it moves, the content layer store is dropped so the pages
 *     that embed a diagram render again.
 */

import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const DIAGRAM_DIR = 'src/diagrams';
const STAMP = 'bmad-diagrams.hash';

/** Absolute paths of every diagram and label file, sorted for a stable hash. */
function diagramFiles(root) {
  const dir = fileURLToPath(new URL(`${DIAGRAM_DIR}/`, root));
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((name) => name.endsWith('.svg') || name.endsWith('.labels.json'))
    .sort()
    .map((name) => dir + name);
}

/** A digest of every diagram's contents. */
function digest(files) {
  const hash = createHash('sha1');
  for (const file of files) {
    hash.update(file);
    hash.update(readFileSync(file));
  }
  return hash.digest('hex');
}

/**
 * @returns {import('astro').AstroIntegration}
 */
export default function bmadDiagrams() {
  return {
    name: 'bmad-diagrams',
    hooks: {
      'astro:config:setup'({ config, addWatchFile }) {
        for (const file of diagramFiles(config.root)) {
          addWatchFile(file);
        }
      },

      'astro:config:done'({ config, logger }) {
        const files = diagramFiles(config.root);
        if (files.length === 0) return;

        const stampPath = fileURLToPath(new URL(STAMP, config.cacheDir));
        const store = fileURLToPath(new URL('data-store.json', config.cacheDir));
        const current = digest(files);
        const previous = existsSync(stampPath) ? readFileSync(stampPath, 'utf8') : '';

        if (current === previous) return;

        if (existsSync(store)) {
          rmSync(store);
          logger.info('diagram changed, cleared the content layer cache');
        }
        writeFileSync(stampPath, current);
      },
    },
  };
}

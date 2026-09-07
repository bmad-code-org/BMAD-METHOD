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
 * On `build` — the run whose output ships — a stamped hash of the diagram
 * directory is compared before rendering. When it moves, the content layer
 * store is dropped so every page embedding a diagram renders again. The stamp
 * is per command, because `dev` and `build` share a cache directory and a
 * single stamp let whichever ran first consume the invalidation.
 *
 * This runs on startup, before the content layer loads, so it is safe in both
 * commands: an edited diagram appears on the next `dev` start or `build`. It
 * deliberately does not watch the files and clear mid-session — deleting the
 * store under a running dev server leaves the content layer holding entries it
 * can no longer render, and Astro fails the page rather than rebuilding it.
 */

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const DIAGRAM_DIR = 'src/diagrams';
const STAMP = 'bmad-diagrams';

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
  let mode = 'build';

  return {
    name: 'bmad-diagrams',
    hooks: {
      'astro:config:setup'({ command }) {
        mode = command;
      },

      'astro:config:done'({ config, logger }) {
        const files = diagramFiles(config.root);
        if (files.length === 0) return;

        const cacheDir = fileURLToPath(config.cacheDir);
        const stampPath = fileURLToPath(new URL(`${STAMP}.${mode}.hash`, config.cacheDir));
        const stores = [
          fileURLToPath(new URL('data-store.json', config.cacheDir)),
          fileURLToPath(new URL('.astro/data-store.json', config.root)),
        ];
        const current = digest(files);

        try {
          const previous = existsSync(stampPath) ? readFileSync(stampPath, 'utf8') : '';
          if (current === previous) return;

          for (const store of stores.filter((path) => existsSync(path))) {
            rmSync(store);
            logger.info('diagram changed, cleared the content layer cache');
          }

          // On a fresh checkout the cache directory does not exist yet; Astro
          // creates it later in the build, so the stamp has to make its own.
          mkdirSync(cacheDir, { recursive: true });
          writeFileSync(stampPath, current);
        } catch (error) {
          // A cache that cannot be stamped is a slower build, not a broken one.
          logger.warn(`could not stamp the diagram cache: ${error.message}`);
        }
      },
    },
  };
}

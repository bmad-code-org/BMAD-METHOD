/**
 * Locale coverage guard.
 *
 * When a translated locale has no page at a given route, Starlight serves the
 * English one in its place. Nothing fails, nothing warns, and the reader gets
 * English prose inside a document that declares itself French or Korean — so a
 * missing translation and a working one look identical from the outside. That
 * is how every locale in this repo ended up stranded on the pre-restructure
 * tree without anyone noticing.
 *
 * Starlight marks the substitution itself: on a fallback page the `<main>`
 * element carries `lang="en"` while the document carries the locale. This
 * checks the built site for that mismatch, which measures the symptom directly
 * rather than inferring it from the sidebar.
 *
 * Fixing the backlog is a separate, large piece of work, so the current gaps
 * live in `locale-coverage-baseline.json` and are tolerated. The build fails
 * only when the picture changes:
 *
 *   - a route falls back that did not before (a new page with no translations,
 *     or a translation that was moved or deleted)
 *   - a route in the baseline no longer falls back, and the entry is stale
 *
 * Both are fixed by rerunning with `--update`, which rewrites the baseline. The
 * second case failing is deliberate: it is what stops the baseline from
 * quietly outliving the problem it records.
 *
 * Runs as part of the docs build. Standalone usage after a build:
 *   node docs-site/scripts/validate-locale-coverage.mjs
 *   node docs-site/scripts/validate-locale-coverage.mjs --update
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { locales, translatedLocales } from '../src/lib/locales.mjs';

/** Starlight puts the content's own language on `<main>`, not just on `<html>`. */
const MAIN_LANG_RE = /<main\b[^>]*\blang="([^"]+)"/;

/**
 * Every built page under a directory, as routes relative to it.
 * @param {string} dir - Absolute path to a locale's build output.
 * @returns {string[]} Routes such as `start/install-bmad`, sorted.
 */
function builtRoutes(dir) {
  if (!fs.existsSync(dir)) return [];

  const routes = [];
  const walk = (current) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.name === 'index.html') {
        const route = path.relative(dir, current).split(path.sep).join('/');
        routes.push(route === '' ? 'index' : route);
      }
    }
  };
  walk(dir);
  return routes.sort();
}

/**
 * Find the routes each locale serves in English rather than its own language.
 * @param {string} siteDir - Absolute path to the built site.
 * @returns {Record<string, string[]>} Fallback routes per locale, sorted.
 */
export function findFallbacks(siteDir) {
  const fallbacks = {};

  for (const key of translatedLocales) {
    const dir = path.join(siteDir, key);
    const expected = locales[key].lang;
    const routes = [];

    for (const route of builtRoutes(dir)) {
      const file = path.join(dir, route === 'index' ? '' : route, 'index.html');
      const lang = MAIN_LANG_RE.exec(fs.readFileSync(file, 'utf-8'))?.[1];
      // No `<main lang>` at all means the page is not a Starlight content page
      // (the 404 route, say), so there is nothing to compare.
      if (lang && lang !== expected) routes.push(route);
    }

    fallbacks[key] = routes;
  }

  return fallbacks;
}

/**
 * Compare what the site does now against what the baseline records.
 * @param {Record<string, string[]>} found - Fallbacks in the built site.
 * @param {Record<string, string[]>} baseline - Fallbacks the baseline tolerates.
 * @returns {{ added: string[], resolved: string[] }} Messages, one per route.
 */
export function diffAgainstBaseline(found, baseline) {
  const added = [];
  const resolved = [];

  for (const key of translatedLocales) {
    const now = new Set(found[key] ?? []);
    const before = new Set(baseline[key] ?? []);

    for (const route of now) if (!before.has(route)) added.push(`${key}/${route}`);
    for (const route of before) if (!now.has(route)) resolved.push(`${key}/${route}`);
  }

  return { added: added.sort(), resolved: resolved.sort() };
}

/** A one-line-per-locale summary of how much of each locale is really translated. */
export function summarise(siteDir, found) {
  return translatedLocales.map((key) => {
    const total = builtRoutes(path.join(siteDir, key)).length;
    const english = found[key]?.length ?? 0;
    const share = total === 0 ? 0 : Math.round((100 * english) / total);
    return { locale: key, total, english, translated: total - english, share };
  });
}

/**
 * Check the built site against the baseline.
 * @param {string} siteDir - Absolute path to the built site.
 * @param {{ baselinePath: string, update?: boolean }} options
 * @returns {{ found: Record<string, string[]>, summary: object[] }}
 * @throws {Error} When a route starts or stops falling back and `update` is off.
 */
export function validateLocaleCoverage(siteDir, { baselinePath, update = false }) {
  const found = findFallbacks(siteDir);
  const summary = summarise(siteDir, found);

  if (update) {
    fs.writeFileSync(baselinePath, `${JSON.stringify(found, null, 2)}\n`);
    return { found, summary };
  }

  const baseline = fs.existsSync(baselinePath) ? JSON.parse(fs.readFileSync(baselinePath, 'utf-8')) : {};
  const { added, resolved } = diffAgainstBaseline(found, baseline);

  const problems = [];
  if (added.length > 0) {
    problems.push(
      `${added.length} route(s) now serve English under another locale:`,
      ...added.map((route) => `    ${route}`),
      '  Add the translation, or record the gap with --update.',
    );
  }
  if (resolved.length > 0) {
    problems.push(
      `${resolved.length} baseline entry/entries are no longer falling back:`,
      ...resolved.map((route) => `    ${route}`),
      '  Rerun with --update so the baseline stops claiming they are missing.',
    );
  }
  if (problems.length > 0) throw new Error(`Locale coverage changed.\n  ${problems.join('\n  ')}`);

  return { found, summary };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const projectRoot = path.resolve(siteRoot, '..');
  const update = process.argv.includes('--update');

  try {
    const { summary } = validateLocaleCoverage(path.join(projectRoot, 'build', 'site'), {
      baselinePath: path.join(siteRoot, 'locale-coverage-baseline.json'),
      update,
    });
    for (const row of summary) {
      console.log(
        `  ${row.locale.padEnd(6)} ${String(row.translated).padStart(3)}/${row.total} translated, ` +
          `${row.english} served in English (${row.share}%)`,
      );
    }
    console.log(update ? 'Baseline updated.' : 'Locale coverage matches the baseline.');
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

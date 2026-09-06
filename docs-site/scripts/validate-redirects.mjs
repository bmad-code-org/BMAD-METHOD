/**
 * Redirect validator.
 *
 * Reads the `redirects` block of astro.config.mjs and checks each entry
 * against the source docs and the built site:
 *   - the target must exist as a built page
 *   - the target must not itself be a redirect
 *   - the source must not still exist as a doc file
 *
 * Runs as part of the docs build. Standalone usage after a build:
 *   node docs-site/scripts/validate-redirects.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REDIRECT_LINE_RE = /^\s*'(\/[^']*)':\s*`\$\{basePath\}([^`]*)`,?\s*$/;

/**
 * Extract redirect entries from the astro config source.
 * @param {string} configSource - Contents of astro.config.mjs.
 * @returns {{ from: string, to: string }[]} Entries; `to` is relative to the site base.
 */
export function parseRedirects(configSource) {
  const block = configSource.match(/^\s*redirects:\s*\{\r?\n([\s\S]*?)^\s*\},/m);
  if (!block) throw new Error('No redirects block found in astro.config.mjs');

  const redirects = [];
  for (const line of block[1].split(/\r?\n/)) {
    if (line.trim() === '') continue;
    const match = line.match(REDIRECT_LINE_RE);
    if (!match) throw new Error(`Unrecognized redirect line: ${line.trim()}`);
    redirects.push({ from: match[1], to: match[2] });
  }
  return redirects;
}

/**
 * Check redirect entries against the docs source tree and the built site.
 * @param {{ from: string, to: string }[]} redirects
 * @param {{ docsDir: string, siteDir: string }} dirs
 * @returns {string[]} One message per problem; empty when all entries are valid.
 */
export function findRedirectProblems(redirects, { docsDir, siteDir }) {
  const problems = [];

  for (const { from, to } of redirects) {
    const sourceBase = path.join(docsDir, from);
    if (fs.existsSync(`${sourceBase}.md`) || fs.existsSync(path.join(sourceBase, 'index.md'))) {
      problems.push(`${from} -> ${to}: source still exists as a doc page`);
    }

    const targetPage = path.join(siteDir, to, 'index.html');
    if (!fs.existsSync(targetPage)) {
      problems.push(`${from} -> ${to}: target was not built`);
    } else if (fs.readFileSync(targetPage, 'utf-8').includes('http-equiv="refresh"')) {
      problems.push(`${from} -> ${to}: target is itself a redirect`);
    }
  }

  return problems;
}

/**
 * Validate the redirects in a config file. Throws with every problem listed.
 * @param {string} configPath - Path to astro.config.mjs.
 * @param {{ docsDir: string, siteDir: string }} dirs
 * @returns {number} Number of redirects checked.
 */
export function validateRedirects(configPath, dirs) {
  const redirects = parseRedirects(fs.readFileSync(configPath, 'utf-8'));
  const problems = findRedirectProblems(redirects, dirs);
  if (problems.length > 0) {
    throw new Error(`Invalid redirects in ${path.basename(configPath)}:\n  ${problems.join('\n  ')}`);
  }
  return redirects.length;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const projectRoot = path.resolve(siteRoot, '..');
  try {
    const count = validateRedirects(path.join(siteRoot, 'astro.config.mjs'), {
      docsDir: path.join(projectRoot, 'docs'),
      siteDir: path.join(projectRoot, 'build', 'site'),
    });
    console.log(`All ${count} redirects valid.`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

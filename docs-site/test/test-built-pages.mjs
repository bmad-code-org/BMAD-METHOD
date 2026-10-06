/**
 * Section eyebrow, footer links, and the sidebar log on a built English site.
 *
 * Usage: node docs-site/test/test-built-pages.mjs
 * Requires a prior `npm run build` so docs-site/dist exists.
 */

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getSiteUrl } from '../src/lib/site-url.mjs';

const siteRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(siteRoot, 'dist');
const pathname = new URL(getSiteUrl()).pathname;
const base = pathname === '/' ? '' : pathname.replace(/\/$/, '');

function page(relativePath) {
  return readFileSync(join(dist, relativePath), 'utf8');
}

const buildPage = page('build/build-a-change/index.html');
assert.match(buildPage, /<p class="eyebrow[^"]*">Build<\/p>/);
assert.equal(buildPage.includes(`href="${base}/build/build-a-change/"`), true);
assert.equal(buildPage.includes('href="https://www.bmadcode.com/philosophy"'), true);

const unknownSection = page('404.html');
assert.equal(unknownSection.includes('id="_top"'), true);
assert.equal(unknownSection.includes('class="eyebrow'), false);

const sidebar = execFileSync('node', ['scripts/validate-sidebar-order.js'], {
  cwd: siteRoot,
  encoding: 'utf8',
});
assert.equal(sidebar.includes('Translation languages'), false);
assert.match(sidebar, /English sections: .+/);

console.log('Built page checks passed.');

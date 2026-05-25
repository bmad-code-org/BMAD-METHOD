/**
 * Web Bundle Release Packager
 *
 * Zips each bundle under web-bundles/ into dist/web-bundles/{slug}.zip
 * for attachment to a GitHub Release.
 *
 * Usage:
 *   node tools/bundle-web-bundles.js
 *
 * After running, the script prints the exact `gh release create` command
 * (with the correct tag from bundles.json) for you to copy.
 */

const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

const REPO_ROOT = path.resolve(__dirname, '..');
const BUNDLES_DIR = path.join(REPO_ROOT, 'web-bundles');
const DIST_DIR = path.join(REPO_ROOT, 'dist', 'web-bundles');
const MANIFEST = path.join(BUNDLES_DIR, 'bundles.json');

function fail(msg) {
  console.error(`[ERROR] ${msg}`);
  process.exit(1);
}

function requireZipCli() {
  try {
    execSync('zip -v', { stdio: 'ignore' });
  } catch {
    fail("'zip' CLI not found on PATH. Install zip (macOS: preinstalled; Debian/Ubuntu: apt install zip; Alpine: apk add zip) and re-run.");
  }
}

function loadManifest() {
  if (!fs.existsSync(MANIFEST)) {
    fail(`bundles.json not found at ${MANIFEST}`);
  }
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf-8'));
  } catch (error) {
    fail(`bundles.json is not valid JSON: ${error.message}`);
  }
  if (!Array.isArray(manifest.bundles) || manifest.bundles.length === 0) {
    fail('bundles.json is missing a non-empty "bundles" array.');
  }
  if (typeof manifest.releaseTag !== 'string' || !manifest.releaseTag) {
    fail('bundles.json is missing "releaseTag".');
  }
  return manifest;
}

function main() {
  requireZipCli();
  const manifest = loadManifest();
  const releaseTag = manifest.releaseTag;

  fs.mkdirSync(DIST_DIR, { recursive: true });

  console.log(`Packaging ${manifest.bundles.length} bundles for release ${releaseTag}\n`);

  const zipped = [];
  for (const bundle of manifest.bundles) {
    if (!bundle.slug) {
      console.warn(`  [SKIP] bundle entry missing slug — ${JSON.stringify(bundle).slice(0, 80)}`);
      continue;
    }
    const src = path.join(BUNDLES_DIR, bundle.slug);
    if (!fs.existsSync(src)) {
      console.warn(`  [SKIP] ${bundle.slug} — directory not found`);
      continue;
    }

    const out = path.join(DIST_DIR, `${bundle.slug}.zip`);
    if (fs.existsSync(out)) fs.unlinkSync(out);

    try {
      execSync(`zip -r -X -q "${out}" "${bundle.slug}" -x "*.DS_Store"`, {
        cwd: BUNDLES_DIR,
        stdio: 'inherit',
      });
    } catch (error) {
      fail(`zip failed for ${bundle.slug}: ${error.message}`);
    }

    const size = (fs.statSync(out).size / 1024).toFixed(1);
    console.log(`  [OK] ${bundle.slug}.zip (${size} KB)`);
    zipped.push(bundle.slug);
  }

  if (zipped.length === 0) {
    fail('No bundles were packaged. Check bundles.json slugs against web-bundles/ subdirectories.');
  }

  console.log(`\nWrote ${zipped.length} bundles to ${path.relative(REPO_ROOT, DIST_DIR)}/`);
  console.log('\nNext step — create or update the GitHub Release:\n');
  console.log(`  gh release create ${releaseTag} dist/web-bundles/*.zip \\`);
  console.log(`    --title "${releaseTag}" \\`);
  console.log(`    --notes "BMad web bundles for Gemini Gems and ChatGPT Custom GPTs. See https://bmadcode.com/web-bundles/"\n`);
  console.log('Or, to refresh an existing release:\n');
  console.log(`  gh release upload ${releaseTag} dist/web-bundles/*.zip --clobber\n`);
}

main();

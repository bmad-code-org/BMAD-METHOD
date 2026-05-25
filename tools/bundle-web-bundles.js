/**
 * Web Bundle Release Packager
 *
 * Zips each bundle under web-bundles/ into dist/web-bundles/{slug}.zip
 * for attachment to a GitHub Release.
 *
 * Usage:
 *   node tools/bundle-web-bundles.js
 *
 * Then upload the resulting zips to a GitHub Release:
 *   gh release create web-bundles-v1 dist/web-bundles/*.zip \
 *     --title "Web Bundles v1" \
 *     --notes "BMad web bundles for Gemini Gems and ChatGPT Custom GPTs"
 */

const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

const REPO_ROOT = path.resolve(__dirname, '..');
const BUNDLES_DIR = path.join(REPO_ROOT, 'web-bundles');
const DIST_DIR = path.join(REPO_ROOT, 'dist', 'web-bundles');
const MANIFEST = path.join(BUNDLES_DIR, 'bundles.json');

function main() {
  if (!fs.existsSync(MANIFEST)) {
    console.error(`Error: bundles.json not found at ${MANIFEST}`);
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf-8'));
  const releaseTag = manifest.releaseTag || 'web-bundles-v1';

  fs.mkdirSync(DIST_DIR, { recursive: true });

  console.log(`Packaging ${manifest.bundles.length} bundles for release ${releaseTag}\n`);

  const zipped = [];
  for (const bundle of manifest.bundles) {
    const src = path.join(BUNDLES_DIR, bundle.slug);
    if (!fs.existsSync(src)) {
      console.warn(`  [SKIP] ${bundle.slug} — directory not found`);
      continue;
    }

    const out = path.join(DIST_DIR, `${bundle.slug}.zip`);
    if (fs.existsSync(out)) fs.unlinkSync(out);

    execSync(`zip -r -X -q "${out}" "${bundle.slug}" -x "*.DS_Store"`, {
      cwd: BUNDLES_DIR,
      stdio: 'inherit',
    });

    const size = (fs.statSync(out).size / 1024).toFixed(1);
    console.log(`  [OK] ${bundle.slug}.zip (${size} KB)`);
    zipped.push(bundle.slug);
  }

  console.log(`\nWrote ${zipped.length} bundles to ${path.relative(REPO_ROOT, DIST_DIR)}/`);
  console.log('\nNext step — create or update the GitHub Release:\n');
  console.log(`  gh release create ${releaseTag} dist/web-bundles/*.zip \\`);
  console.log(`    --title "Web Bundles v1" \\`);
  console.log(`    --notes "BMad web bundles for Gemini Gems and ChatGPT Custom GPTs. See https://bmadcode.com/web-bundles/"\n`);
  console.log('Or, to refresh an existing release:\n');
  console.log(`  gh release upload ${releaseTag} dist/web-bundles/*.zip --clobber\n`);
}

main();

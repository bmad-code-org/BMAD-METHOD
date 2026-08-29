/**
 * BMAD Documentation Build Pipeline
 *
 * Validates documentation links and builds the Astro+Starlight site.
 *
 * Build output:
 *   build/site/          - Final Astro output (deployable)
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validatePublishedImplementationModel } from './validate-published-implementation-model.mjs';

// =============================================================================
// Configuration
// =============================================================================

const PROJECT_ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const BUILD_DIR = path.join(PROJECT_ROOT, 'build');

// =============================================================================
// Main Entry Point
/**
 * Orchestrates the full BMAD documentation build pipeline.
 *
 * Executes the high-level build steps in sequence: prints headers and paths, validates internal
 * documentation links, cleans the build directory, builds the Astro site, and prints a final
 * build summary.
 */

async function main() {
  if (process.platform === 'win32') {
    console.error('Error: The docs build pipeline does not support Windows.');
    console.error('Please build on Linux, macOS, or WSL.');
    process.exit(1);
  }

  console.log();
  printBanner('BMAD Documentation Build Pipeline');
  console.log();
  console.log(`Project root: ${PROJECT_ROOT}`);
  console.log(`Build directory: ${BUILD_DIR}`);
  console.log();

  // Check for broken internal links before building
  checkDocLinks();

  cleanBuildDirectory();

  const docsDir = path.join(PROJECT_ROOT, 'docs');
  const siteDir = buildAstroSite();

  printBuildSummary(docsDir, siteDir);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

// =============================================================================
// Pipeline Stages
/**
 * Builds the Astro + Starlight site and validates the published implementation model.
 *
 * @returns {string} The filesystem path to the built site directory (e.g., build/site).
 */
function buildAstroSite() {
  printHeader('Building Astro + Starlight site');

  const siteDir = path.join(BUILD_DIR, 'site');

  // Build Astro site (outputs to build/site via astro.config.mjs)
  runAstroBuild();
  console.log('  → Checking published implementation model...');
  validatePublishedImplementationModel(siteDir);
  console.log('    Published implementation model check passed');

  console.log();
  console.log(`  \u001B[32m✓\u001B[0m Astro build complete`);

  return siteDir;
}

// =============================================================================
// Astro Build
/**
 * Builds the Astro site to build/site (configured in astro.config.mjs).
 */
function runAstroBuild() {
  console.log('  → Running astro build...');
  execSync('npx astro build --root website', {
    cwd: PROJECT_ROOT,
    stdio: 'inherit',
    env: {
      ...process.env,
    },
  });
}

// =============================================================================
// Build Summary
/**
 * Prints a concise end-of-build summary and displays a sample listing of the final site directory.
 *
 * @param {string} docsDir - Path to the source documentation directory used for the build.
 * @param {string} siteDir - Path to the final built site directory whose contents will be listed.
 */

function printBuildSummary(docsDir, siteDir) {
  console.log();
  printBanner('Build Complete!');
  console.log();
  console.log('Build output:');
  console.log(`  Source docs:     ${docsDir}`);
  console.log(`  Final site:      ${siteDir}`);
  console.log();
  console.log(`Deployable output: ${siteDir}/`);
  console.log();

  listDirectoryContents(siteDir);
}

function listDirectoryContents(dir) {
  const entries = fs.readdirSync(dir).slice(0, 15);

  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);

    if (stat.isFile()) {
      const sizeStr = formatFileSize(stat.size);
      console.log(`  ${entry.padEnd(40)} ${sizeStr.padStart(8)}`);
    } else {
      console.log(`  ${entry}/`);
    }
  }
}

/**
 * Format a byte count into a compact human-readable string using B, K, or M units.
 * @param {number} bytes - The number of bytes to format.
 * @returns {string} The formatted size: bytes as `N B` (e.g. `512B`), kilobytes truncated to an integer with `K` (e.g. `2K`), or megabytes with one decimal and `M` (e.g. `1.2M`).
 */
function formatFileSize(bytes) {
  if (bytes > 1024 * 1024) {
    return `${(bytes / 1024 / 1024).toFixed(1)}M`;
  } else if (bytes > 1024) {
    return `${Math.floor(bytes / 1024)}K`;
  }
  return `${bytes}B`;
}

// =============================================================================
// File System Utilities
/**
 * Remove any existing build output and recreate the build directory.
 *
 * Ensures the configured BUILD_DIR is empty by deleting it if present and then creating a fresh directory.
 */

function cleanBuildDirectory() {
  console.log('Cleaning previous build...');

  if (fs.existsSync(BUILD_DIR)) {
    fs.rmSync(BUILD_DIR, { recursive: true });
  }
  fs.mkdirSync(BUILD_DIR, { recursive: true });
}

// =============================================================================
// Console Output Formatting
// =============================================================================

function printHeader(title) {
  console.log();
  console.log('┌' + '─'.repeat(62) + '┐');
  console.log(`│ ${title.padEnd(60)} │`);
  console.log('└' + '─'.repeat(62) + '┘');
}

/**
 * Prints a centered decorative ASCII banner to the console using the provided title.
 * @param {string} title - Text to display centered inside the banner. */
function printBanner(title) {
  console.log('╔' + '═'.repeat(62) + '╗');
  console.log(`║${title.padStart(31 + title.length / 2).padEnd(62)}║`);
  console.log('╚' + '═'.repeat(62) + '╝');
}

// =============================================================================
// Link Checking
/**
 * Verify internal documentation links by running the link-checking script.
 *
 * Executes the Node script tools/validate-doc-links.js from the project root and
 * exits the process with code 1 if the check fails.
 */

function checkDocLinks() {
  printHeader('Checking documentation links');

  try {
    execSync('node tools/validate-doc-links.js', {
      cwd: PROJECT_ROOT,
      stdio: 'inherit',
    });
  } catch {
    console.error('\n  \u001B[31m✗\u001B[0m Link check failed - fix broken links before building\n');
    process.exit(1);
  }
}

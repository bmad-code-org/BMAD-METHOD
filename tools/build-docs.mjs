/**
 * BMAD Documentation Build Pipeline
 *
 * Consolidates docs from multiple sources, generates LLM-friendly files,
 * and builds the Astro+Starlight site.
 *
 * Build outputs:
 *   build/artifacts/     - With llms.txt, llms-full.txt
 *   build/site/          - Final Astro output (deployable)
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getSiteUrl } from '../website/src/lib/site-url.mjs';

// =============================================================================
// Configuration
// =============================================================================

const PROJECT_ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const BUILD_DIR = path.join(PROJECT_ROOT, 'build');

const REPO_URL = 'https://github.com/bmad-code-org/BMAD-METHOD';

// DO NOT CHANGE THESE VALUES!
// llms-full.txt is consumed by AI agents as context. Most LLMs have ~200k token limits.
// 600k chars ≈ 150k tokens (safe margin). Exceeding this breaks AI agent functionality.
const LLM_MAX_CHARS = 600_000;
const LLM_WARN_CHARS = 500_000;

const LLM_EXCLUDE_PATTERNS = [
  'changelog',
  'ide-info/',
  'v4-to-v6-upgrade',
  'faq',
  'reference/glossary/',
  'explanation/game-dev/',
  'bmgd/',
  // Note: Files/dirs starting with _ (like _STYLE_GUIDE.md, _archive/) are excluded in shouldExcludeFromLlm()
];

// =============================================================================
// Main Entry Point
/**
 * Orchestrates the full BMAD documentation build pipeline.
 *
 * Executes the high-level build steps in sequence: prints headers and paths, validates internal
 * documentation links, cleans the build directory, generates artifacts from the `docs/` folder,
 * builds the Astro site, and prints a final build summary.
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
  const artifactsDir = await generateArtifacts(docsDir);
  const siteDir = buildAstroSite();

  printBuildSummary(docsDir, artifactsDir, siteDir);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

// =============================================================================
// Pipeline Stages
/**
 * Generate LLM files for the documentation pipeline.
 *
 * Creates the build/artifacts directory and writes `llms.txt` and `llms-full.txt` (sourced from the provided docs directory).
 *
 * @param {string} docsDir - Path to the source docs directory containing Markdown files.
 * @returns {string} Path to the created artifacts directory.
 */

async function generateArtifacts(docsDir) {
  printHeader('Generating LLM files');

  const outputDir = path.join(BUILD_DIR, 'artifacts');
  fs.mkdirSync(outputDir, { recursive: true });

  // Generate LLM files reading from docs/, output to artifacts/
  generateLlmsTxt(outputDir);
  generateLlmsFullTxt(docsDir, outputDir);

  console.log();
  console.log(`  \u001B[32m✓\u001B[0m Artifact generation complete`);

  return outputDir;
}

/**
 * Builds the Astro + Starlight site and copies generated artifacts into the site output directory.
 *
 * @returns {string} The filesystem path to the built site directory (e.g., build/site).
 */
function buildAstroSite() {
  printHeader('Building Astro + Starlight site');

  const siteDir = path.join(BUILD_DIR, 'site');
  const artifactsDir = path.join(BUILD_DIR, 'artifacts');

  // Build Astro site (outputs to build/site via astro.config.mjs)
  runAstroBuild();
  copyArtifactsToSite(artifactsDir, siteDir);

  console.log();
  console.log(`  \u001B[32m✓\u001B[0m Astro build complete`);

  return siteDir;
}

// =============================================================================
// LLM File Generation
/**
 * Create a concise llms.txt summary file containing project metadata, core links, and quick navigation entries for LLM consumption.
 *
 * Writes the file to `${outputDir}/llms.txt`.
 *
 * @param {string} outputDir - Destination directory where `llms.txt` will be written.
 */

function generateLlmsTxt(outputDir) {
  console.log('  → Generating llms.txt...');

  const siteUrl = getSiteUrl();
  const content = [
    '# BMAD Method Documentation',
    '',
    '> AI-driven agile development with specialized agents and workflows that scale from bug fixes to enterprise platforms.',
    '',
    `Documentation: ${siteUrl}`,
    `Repository: ${REPO_URL}`,
    `Full docs: ${siteUrl}/llms-full.txt`,
    '',
    '## Quick Start',
    '',
    `- **[Getting Started](${siteUrl}/tutorials/getting-started/)** - Tutorial: install and learn how BMad works`,
    `- **[Installation](${siteUrl}/how-to/install-bmad/)** - How to install BMad Method`,
    '',
    '## Core Concepts',
    '',
    `- **[Quick Flow](${siteUrl}/explanation/quick-flow/)** - Fast development workflow`,
    `- **[Party Mode](${siteUrl}/explanation/party-mode/)** - Multi-agent collaboration`,
    `- **[Workflow Map](${siteUrl}/reference/workflow-map/)** - Visual overview of phases and workflows`,
    '',
    '## Modules',
    '',
    `- **[Official Modules](${siteUrl}/reference/modules/)** - BMM, BMB, BMGD, and more`,
    '',
    '---',
    '',
    '## Quick Links',
    '',
    `- [Full Documentation (llms-full.txt)](${siteUrl}/llms-full.txt) - Complete docs for AI context`,
    '',
  ].join('\n');

  const outputPath = path.join(outputDir, 'llms.txt');
  fs.writeFileSync(outputPath, content, 'utf-8');
  console.log(`    Generated llms.txt (${content.length.toLocaleString()} chars)`);
}

/**
 * Builds a consolidated llms-full.txt containing all Markdown files under docsDir wrapped in <document path="..."> tags for LLM consumption.
 *
 * Writes the generated file to outputDir/llms-full.txt. Files matching LLM_EXCLUDE_PATTERNS are skipped; read errors for individual files are logged. The combined content is validated against configured size thresholds (will exit on overflow and warn if near limit).
 * @param {string} docsDir - Root directory containing source Markdown files; paths in the output are relative to this directory.
 * @param {string} outputDir - Directory where llms-full.txt will be written.
 */
function generateLlmsFullTxt(docsDir, outputDir) {
  console.log('  → Generating llms-full.txt...');

  const date = new Date().toISOString().split('T')[0];
  const files = getAllMarkdownFiles(docsDir).sort(compareLlmDocs);

  const output = [
    '# BMAD Method Documentation (Full)',
    '',
    '> Complete documentation for AI consumption',
    `> Generated: ${date}`,
    `> Repository: ${REPO_URL}`,
    '',
  ];

  let fileCount = 0;
  let skippedCount = 0;

  for (const mdPath of files) {
    if (shouldExcludeFromLlm(mdPath)) {
      skippedCount++;
      continue;
    }

    const fullPath = path.join(docsDir, mdPath);
    try {
      const content = readMarkdownContent(fullPath);
      output.push(`<document path="${mdPath}">`, content, '</document>', '');
      fileCount++;
    } catch (error) {
      console.error(`    Warning: Could not read ${mdPath}: ${error.message}`);
    }
  }

  const result = output.join('\n');
  validateLlmSize(result);

  const outputPath = path.join(outputDir, 'llms-full.txt');
  fs.writeFileSync(outputPath, result, 'utf-8');

  const tokenEstimate = Math.floor(result.length / 4).toLocaleString();
  console.log(
    `    Processed ${fileCount} files (skipped ${skippedCount}), ${result.length.toLocaleString()} chars (~${tokenEstimate} tokens)`,
  );
}

function compareLlmDocs(a, b) {
  const aKey = getLlmSortKey(a);
  const bKey = getLlmSortKey(b);

  if (aKey !== bKey) return aKey - bKey;
  return a.localeCompare(b);
}

function getLlmSortKey(filePath) {
  if (filePath === 'index.md') return 0;
  if (filePath.startsWith(`tutorials${path.sep}`) || filePath.startsWith('tutorials/')) return 2;
  if (filePath.startsWith(`how-to${path.sep}`) || filePath.startsWith('how-to/')) return 3;
  if (filePath.startsWith(`explanation${path.sep}`) || filePath.startsWith('explanation/')) return 4;
  if (filePath.startsWith(`reference${path.sep}`) || filePath.startsWith('reference/')) return 5;
  if (filePath.startsWith(`bmgd${path.sep}`) || filePath.startsWith('bmgd/')) return 6;
  return 7;
}

/**
 * Collects all Markdown (.md) files under a directory and returns their paths relative to a base directory.
 * @param {string} dir - Directory to search for Markdown files.
 * @param {string} [baseDir=dir] - Base directory used to compute returned relative paths.
 * @returns {string[]} An array of file paths (relative to `baseDir`) for every `.md` file found under `dir`.
 */
function getAllMarkdownFiles(dir, baseDir = dir) {
  const files = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...getAllMarkdownFiles(fullPath, baseDir));
    } else if (entry.name.endsWith('.md')) {
      // Return relative path from baseDir
      const relativePath = path.relative(baseDir, fullPath);
      files.push(relativePath);
    }
  }

  return files;
}

/**
 * Determine whether a file path matches any configured LLM exclusion pattern.
 * Also excludes any files or directories starting with underscore.
 * @param {string} filePath - The file path to test.
 * @returns {boolean} `true` if excluded, `false` otherwise.
 */
function shouldExcludeFromLlm(filePath) {
  // Exclude if ANY path component starts with underscore
  // (e.g., _STYLE_GUIDE.md, _archive/file.md, dir/_STYLE_GUIDE.md)
  const pathParts = filePath.split(path.sep);
  if (pathParts.some((part) => part.startsWith('_'))) return true;

  // Check configured patterns
  return LLM_EXCLUDE_PATTERNS.some((pattern) => filePath.includes(pattern));
}

function readMarkdownContent(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');

  if (content.startsWith('---')) {
    const end = content.indexOf('---', 3);
    if (end !== -1) {
      content = content.slice(end + 3).trim();
    }
  }

  return content;
}

function validateLlmSize(content) {
  const charCount = content.length;

  if (charCount > LLM_MAX_CHARS) {
    console.error(`    ERROR: Exceeds ${LLM_MAX_CHARS.toLocaleString()} char limit`);
    process.exit(1);
  } else if (charCount > LLM_WARN_CHARS) {
    console.warn(`    \u001B[33mWARNING: Approaching ${LLM_WARN_CHARS.toLocaleString()} char limit\u001B[0m`);
  }
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

/**
 * Copy generated artifact files into the built site directory.
 *
 * Copies llms.txt and llms-full.txt from the artifacts directory into the site directory.
 *
 * @param {string} artifactsDir - Path to the build artifacts directory containing generated files.
 * @param {string} siteDir - Path to the target site directory where artifacts should be placed.
 */
function copyArtifactsToSite(artifactsDir, siteDir) {
  console.log('  → Copying artifacts to site...');

  fs.copyFileSync(path.join(artifactsDir, 'llms.txt'), path.join(siteDir, 'llms.txt'));
  fs.copyFileSync(path.join(artifactsDir, 'llms-full.txt'), path.join(siteDir, 'llms-full.txt'));
}

// =============================================================================
// Build Summary
/**
 * Prints a concise end-of-build summary and displays a sample listing of the final site directory.
 *
 * @param {string} docsDir - Path to the source documentation directory used for the build.
 * @param {string} artifactsDir - Path to the directory containing generated artifacts (e.g., llms.txt).
 * @param {string} siteDir - Path to the final built site directory whose contents will be listed.
 */

function printBuildSummary(docsDir, artifactsDir, siteDir) {
  console.log();
  printBanner('Build Complete!');
  console.log();
  console.log('Build artifacts:');
  console.log(`  Source docs:     ${docsDir}`);
  console.log(`  Generated files: ${artifactsDir}`);
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

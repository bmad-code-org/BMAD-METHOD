/**
 * BMAD Documentation Build Pipeline
 *
 * Consolidates docs from multiple sources, generates LLM-friendly files,
 * creates downloadable bundles, and builds the Astro+Starlight site.
 *
 * Build outputs:
 *   build/artifacts/     - With llms.txt, llms-full.txt, ZIPs
 *   build/site/          - Final Astro output (deployable)
 */

const { execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const archiver = require('archiver');

// =============================================================================
// Configuration
// =============================================================================

const PROJECT_ROOT = path.dirname(__dirname);
const BUILD_DIR = path.join(PROJECT_ROOT, 'build');

const SITE_URL = process.env.SITE_URL || 'https://bmad-code-org.github.io/BMAD-METHOD';
const REPO_URL = 'https://github.com/bmad-code-org/BMAD-METHOD';

const LLM_MAX_CHARS = 600_000;
const LLM_WARN_CHARS = 500_000;

const LLM_EXCLUDE_PATTERNS = ['changelog', 'ide-info/', 'v4-to-v6-upgrade', 'downloads/', 'faq'];

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
 * Generate LLM files and downloadable bundles for the documentation pipeline.
 *
 * Creates the build/artifacts directory, writes `llms.txt` and `llms-full.txt` (sourced from the provided docs directory),
 * and produces download ZIP bundles.
 *
 * @param {string} docsDir - Path to the source docs directory containing Markdown files.
 * @returns {string} Path to the created artifacts directory.
 */

async function generateArtifacts(docsDir) {
  printHeader('Generating LLM files and download bundles');

  const outputDir = path.join(BUILD_DIR, 'artifacts');
  fs.mkdirSync(outputDir, { recursive: true });

  // Generate LLM files reading from docs/, output to artifacts/
  generateLlmsTxt(outputDir);
  generateLlmsFullTxt(docsDir, outputDir);
  await generateDownloadBundles(outputDir);

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

  // No longer needed: Inject AI agents banner into every HTML page
  // injectAgentBanner(siteDir);

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

  const content = [
    '# BMAD Method Documentation',
    '',
    '> AI-driven agile development with specialized agents and workflows that scale from bug fixes to enterprise platforms.',
    '',
    `Documentation: ${SITE_URL}`,
    `Repository: ${REPO_URL}`,
    `Full docs: ${SITE_URL}/llms-full.txt`,
    '',
    '## Quick Start',
    '',
    `- **[Quick Start](${SITE_URL}/docs/modules/bmm/quick-start)** - Get started with BMAD Method`,
    `- **[Installation](${SITE_URL}/docs/getting-started/installation)** - Installation guide`,
    '',
    '## Core Concepts',
    '',
    `- **[Scale Adaptive System](${SITE_URL}/docs/modules/bmm/scale-adaptive-system)** - Understand BMAD scaling`,
    `- **[Quick Flow](${SITE_URL}/docs/modules/bmm/bmad-quick-flow)** - Fast development workflow`,
    `- **[Party Mode](${SITE_URL}/docs/modules/bmm/party-mode)** - Multi-agent collaboration`,
    '',
    '## Modules',
    '',
    `- **[BMM - Method](${SITE_URL}/docs/modules/bmm/quick-start)** - Core methodology module`,
    `- **[BMB - Builder](${SITE_URL}/docs/modules/bmb/)** - Agent and workflow builder`,
    `- **[BMGD - Game Dev](${SITE_URL}/docs/modules/bmgd/quick-start)** - Game development module`,
    '',
    '---',
    '',
    '## Quick Links',
    '',
    `- [Full Documentation (llms-full.txt)](${SITE_URL}/llms-full.txt) - Complete docs for AI context`,
    `- [Source Bundle](${SITE_URL}/downloads/bmad-sources.zip) - Complete source code`,
    `- [Prompts Bundle](${SITE_URL}/downloads/bmad-prompts.zip) - Agent prompts and workflows`,
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
  const files = getAllMarkdownFiles(docsDir);

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
 * @param {string} filePath - The file path to test.
 * @returns {boolean} `true` if the path contains any pattern from LLM_EXCLUDE_PATTERNS, `false` otherwise.
 */
function shouldExcludeFromLlm(filePath) {
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
// Download Bundle Generation
// =============================================================================

async function generateDownloadBundles(outputDir) {
  console.log('  → Generating download bundles...');

  const downloadsDir = path.join(outputDir, 'downloads');
  fs.mkdirSync(downloadsDir, { recursive: true });

  await generateSourcesBundle(downloadsDir);
  await generatePromptsBundle(downloadsDir);
}

async function generateSourcesBundle(downloadsDir) {
  const srcDir = path.join(PROJECT_ROOT, 'src');
  if (!fs.existsSync(srcDir)) return;

  const zipPath = path.join(downloadsDir, 'bmad-sources.zip');
  await createZipArchive(srcDir, zipPath, ['__pycache__', '.pyc', '.DS_Store', 'node_modules']);

  const size = (fs.statSync(zipPath).size / 1024 / 1024).toFixed(1);
  console.log(`    bmad-sources.zip (${size}M)`);
}

/**
 * Create a zip archive of the project's prompts modules and place it in the downloads directory.
 *
 * Creates bmad-prompts.zip from src/modules, excluding common unwanted paths, writes it to the provided downloads directory, and logs the resulting file size. If the modules directory does not exist, the function returns without creating a bundle.
 * @param {string} downloadsDir - Destination directory where bmad-prompts.zip will be written.
 */
async function generatePromptsBundle(downloadsDir) {
  const modulesDir = path.join(PROJECT_ROOT, 'src', 'modules');
  if (!fs.existsSync(modulesDir)) return;

  const zipPath = path.join(downloadsDir, 'bmad-prompts.zip');
  await createZipArchive(modulesDir, zipPath, ['docs', '.DS_Store', '__pycache__', 'node_modules']);

  const size = Math.floor(fs.statSync(zipPath).size / 1024);
  console.log(`    bmad-prompts.zip (${size}K)`);
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
      NODE_OPTIONS: `${process.env.NODE_OPTIONS || ''} --disable-warning=MODULE_TYPELESS_PACKAGE_JSON`.trim(),
    },
  });
}

/**
 * Copy generated artifact files into the built site directory.
 *
 * Copies llms.txt and llms-full.txt from the artifacts directory into the site directory.
 * If a downloads subdirectory exists under artifacts, copies it into siteDir/downloads.
 *
 * @param {string} artifactsDir - Path to the build artifacts directory containing generated files.
 * @param {string} siteDir - Path to the target site directory where artifacts should be placed.
 */
function copyArtifactsToSite(artifactsDir, siteDir) {
  console.log('  → Copying artifacts to site...');

  fs.copyFileSync(path.join(artifactsDir, 'llms.txt'), path.join(siteDir, 'llms.txt'));
  fs.copyFileSync(path.join(artifactsDir, 'llms-full.txt'), path.join(siteDir, 'llms-full.txt'));

  const downloadsDir = path.join(artifactsDir, 'downloads');
  if (fs.existsSync(downloadsDir)) {
    copyDirectory(downloadsDir, path.join(siteDir, 'downloads'));
  }
}

// =============================================================================
// Build Summary
/**
 * Prints a concise end-of-build summary and displays a sample listing of the final site directory.
 *
 * @param {string} docsDir - Path to the source documentation directory used for the build.
 * @param {string} artifactsDir - Path to the directory containing generated artifacts (e.g., llms.txt, downloads).
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
// Post-build Injection
/**
 * Recursively collects all files with the given extension under a directory.
 *
 * @param {string} dir - Root directory to search.
 * @param {string} ext - File extension to match (include the leading dot, e.g. ".md").
 * @returns {string[]} An array of file paths for files ending with `ext` found under `dir`.
 */

function getAllFilesByExtension(dir, ext) {
  const result = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      result.push(...getAllFilesByExtension(fullPath, ext));
    } else if (entry.name.endsWith(ext)) {
      result.push(fullPath);
    }
  }

  return result;
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

/**
 * Recursively copies all files and subdirectories from one directory to another, creating the destination if needed.
 *
 * @param {string} src - Path to the source directory to copy from.
 * @param {string} dest - Path to the destination directory to copy to.
 * @param {string[]} [exclude=[]] - List of file or directory names (not paths) to skip while copying.
 * @returns {boolean} `true` if the source existed and copying proceeded, `false` if the source did not exist.
 */
function copyDirectory(src, dest, exclude = []) {
  if (!fs.existsSync(src)) return false;
  fs.mkdirSync(dest, { recursive: true });

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (exclude.includes(entry.name)) continue;

    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath, exclude);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
  return true;
}

/**
 * Create a ZIP archive of a directory, optionally excluding entries that match given substrings.
 * @param {string} sourceDir - Path to the source directory to archive.
 * @param {string} outputPath - Path to write the resulting ZIP file.
 * @param {string[]} [exclude=[]] - Array of substrings; any entry whose path includes one of these substrings will be omitted.
 * @returns {Promise<void>} Resolves when the archive has been fully written and closed, rejects on error.
 */
function createZipArchive(sourceDir, outputPath, exclude = []) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', resolve);
    archive.on('error', reject);

    archive.pipe(output);

    const baseName = path.basename(sourceDir);
    archive.directory(sourceDir, baseName, (entry) => {
      for (const pattern of exclude) {
        if (entry.name.includes(pattern)) return false;
      }
      return entry;
    });

    archive.finalize();
  });
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
 * Executes the Node script tools/check-doc-links.js from the project root and
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

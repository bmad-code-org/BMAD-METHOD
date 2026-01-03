/**
 * BMAD Documentation Build Pipeline
 *
 * Consolidates docs from multiple sources, generates LLM-friendly files,
 * creates downloadable bundles, and builds the Docusaurus site.
 *
 * Build outputs:
 *   build/consolidated/  - Merged docs from all sources
 *   build/artifacts/     - With llms.txt, llms-full.txt, ZIPs
 *   build/site/          - Final Docusaurus output (deployable)
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

const MODULES = ['bmm', 'bmb', 'bmgd', 'cis'];

// No root docs copied - only docs/ folder content goes to site
// README.md, CHANGELOG.md etc. link to GitHub
const ROOT_DOCS = [];

const LLM_EXCLUDE_PATTERNS = ['changelog', 'ide-info/', 'v4-to-v6-upgrade', 'downloads/', 'faq'];

// =============================================================================
// Main Entry Point
// =============================================================================

async function main() {
  console.log();
  printBanner('BMAD Documentation Build Pipeline');
  console.log();
  console.log(`Project root: ${PROJECT_ROOT}`);
  console.log(`Build directory: ${BUILD_DIR}`);
  console.log();

  cleanBuildDirectory();

  const consolidatedDir = consolidateDocs();
  const artifactsDir = await generateArtifacts(consolidatedDir);
  const siteDir = buildDocusaurusSite(artifactsDir);

  printBuildSummary(consolidatedDir, artifactsDir, siteDir);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

// =============================================================================
// Pipeline Stages
// =============================================================================

function consolidateDocs() {
  printHeader('Consolidating documentation sources');

  const outputDir = path.join(BUILD_DIR, 'consolidated');
  fs.mkdirSync(outputDir, { recursive: true });

  copyMainDocs(outputDir);
  copyRootDocs(outputDir);
  copyModuleDocs(outputDir);

  const mdCount = countMarkdownFiles(outputDir);
  console.log();
  console.log(`  \u001B[32m✓\u001B[0m Consolidation complete: ${mdCount} markdown files`);

  return outputDir;
}

async function generateArtifacts(consolidatedDir) {
  printHeader('Generating LLM files and download bundles');

  const outputDir = path.join(BUILD_DIR, 'artifacts');
  copyDirectory(consolidatedDir, outputDir);

  generateLlmsTxt(outputDir);
  generateLlmsFullTxt(outputDir);
  await generateDownloadBundles(outputDir);

  console.log();
  console.log(`  \u001B[32m✓\u001B[0m Artifact generation complete`);

  return outputDir;
}

function buildDocusaurusSite(artifactsDir) {
  printHeader('Building Docusaurus site');

  const siteDir = path.join(BUILD_DIR, 'site');
  const mainDocs = path.join(PROJECT_ROOT, 'docs');
  const docsBackup = path.join(BUILD_DIR, 'docs-backup');

  backupAndReplaceDocs(mainDocs, docsBackup, artifactsDir);

  try {
    runDocusaurusBuild(siteDir);
  } finally {
    restoreDocs(mainDocs, docsBackup);
  }

  copyArtifactsToSite(artifactsDir, siteDir);

  console.log();
  console.log(`  \u001B[32m✓\u001B[0m Docusaurus build complete`);

  return siteDir;
}

// =============================================================================
// Documentation Consolidation
// =============================================================================

function copyMainDocs(destDir) {
  console.log('  → Copying main docs...');
  const docsDir = path.join(PROJECT_ROOT, 'docs');
  // Include modules folder - docs now live in docs/modules/ instead of src/modules/*/docs/
  copyDirectory(docsDir, destDir, ['llms.txt', 'llms-full.txt'], true);
}

function copyRootDocs(destDir) {
  console.log('  → Copying root documentation files...');

  for (const doc of ROOT_DOCS) {
    const srcPath = path.join(PROJECT_ROOT, doc.src);
    const destPath = path.join(destDir, doc.dest);

    if (fs.existsSync(srcPath)) {
      let content = fs.readFileSync(srcPath, 'utf-8');

      if (!content.startsWith('---')) {
        content = `---\ntitle: "${doc.title}"\n---\n\n${content}`;
      }

      content = transformMarkdownLinks(content);
      fs.writeFileSync(destPath, content);
      console.log(`    ${doc.src} → ${doc.dest}`);
    }
  }
}

function copyModuleDocs(destDir) {
  fs.mkdirSync(path.join(destDir, 'modules'), { recursive: true });

  for (const moduleName of MODULES) {
    const srcPath = path.join(PROJECT_ROOT, 'src', 'modules', moduleName, 'docs');
    const moduleDest = path.join(destDir, 'modules', moduleName);

    if (fs.existsSync(srcPath)) {
      console.log(`  → Copying ${moduleName} docs...`);
      copyDirectory(srcPath, moduleDest, [], false, moduleName);
      const count = countMarkdownFiles(moduleDest);
      console.log(`    ${count} markdown files`);
    } else {
      console.log(`  ⚠ WARNING: ${moduleName} docs not found`);
    }
  }
}

// =============================================================================
// LLM File Generation
// =============================================================================

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

function generateLlmsFullTxt(outputDir) {
  console.log('  → Generating llms-full.txt...');

  const date = new Date().toISOString().split('T')[0];
  const files = getDocsFromSidebar();

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

    const fullPath = path.join(outputDir, mdPath);
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

function getDocsFromSidebar() {
  const sidebarsPath = path.join(PROJECT_ROOT, 'website', 'sidebars.js');

  try {
    const sidebarContent = fs.readFileSync(sidebarsPath, 'utf-8');
    const matches = sidebarContent.matchAll(/'([a-zA-Z0-9\-_/]+)'/g);
    const files = [];

    for (const match of matches) {
      const docId = match[1];
      // Skip Docusaurus keywords
      if (docId.includes('Sidebar') || docId === 'doc' || docId === 'category') {
        continue;
      }
      // Skip category labels (Title Case words without slashes like 'Workflows', 'Reference')
      if (!docId.includes('/') && /^[A-Z][a-z]/.test(docId)) {
        continue;
      }
      files.push(docId + '.md');
    }

    return files;
  } catch {
    console.log('    Warning: Could not parse sidebars');
    return [];
  }
}

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

async function generatePromptsBundle(downloadsDir) {
  const modulesDir = path.join(PROJECT_ROOT, 'src', 'modules');
  if (!fs.existsSync(modulesDir)) return;

  const zipPath = path.join(downloadsDir, 'bmad-prompts.zip');
  await createZipArchive(modulesDir, zipPath, ['docs', '.DS_Store', '__pycache__', 'node_modules']);

  const size = Math.floor(fs.statSync(zipPath).size / 1024);
  console.log(`    bmad-prompts.zip (${size}K)`);
}

// =============================================================================
// Docusaurus Build
// =============================================================================

function backupAndReplaceDocs(mainDocs, backupDir, artifactsDir) {
  console.log('  → Preparing docs for Docusaurus...');

  if (fs.existsSync(mainDocs)) {
    copyDirectory(mainDocs, backupDir);
    fs.rmSync(mainDocs, { recursive: true });
  }

  copyDirectory(artifactsDir, mainDocs, ['llms.txt', 'llms-full.txt']);
  removeZipFiles(path.join(mainDocs, 'downloads'));
}

function runDocusaurusBuild(siteDir) {
  console.log('  → Running docusaurus build...');
  execSync('npx docusaurus build --config website/docusaurus.config.js --out-dir ' + siteDir, {
    cwd: PROJECT_ROOT,
    stdio: 'inherit',
  });
}

function restoreDocs(mainDocs, backupDir) {
  console.log('  → Restoring original docs...');
  fs.rmSync(mainDocs, { recursive: true });

  if (fs.existsSync(backupDir)) {
    copyDirectory(backupDir, mainDocs);
    fs.rmSync(backupDir, { recursive: true });
  }
}

function copyArtifactsToSite(artifactsDir, siteDir) {
  console.log('  → Copying artifacts to site...');

  fs.copyFileSync(path.join(artifactsDir, 'llms.txt'), path.join(siteDir, 'llms.txt'));
  fs.copyFileSync(path.join(artifactsDir, 'llms-full.txt'), path.join(siteDir, 'llms-full.txt'));

  const downloadsDir = path.join(artifactsDir, 'downloads');
  if (fs.existsSync(downloadsDir)) {
    copyDirectory(downloadsDir, path.join(siteDir, 'downloads'));
  }
}

function removeZipFiles(dir) {
  if (!fs.existsSync(dir)) return;

  for (const file of fs.readdirSync(dir)) {
    if (file.endsWith('.zip')) {
      fs.unlinkSync(path.join(dir, file));
    }
  }
}

// =============================================================================
// Build Summary
// =============================================================================

function printBuildSummary(consolidatedDir, artifactsDir, siteDir) {
  console.log();
  printBanner('Build Complete!');
  console.log();
  console.log('Build artifacts:');
  console.log(`  Consolidated docs: ${consolidatedDir}`);
  console.log(`  Generated files:   ${artifactsDir}`);
  console.log(`  Final site:        ${siteDir}`);
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
// =============================================================================

function cleanBuildDirectory() {
  console.log('Cleaning previous build...');

  if (fs.existsSync(BUILD_DIR)) {
    fs.rmSync(BUILD_DIR, { recursive: true });
  }
  fs.mkdirSync(BUILD_DIR, { recursive: true });
}

function copyDirectory(src, dest, exclude = [], transformMd = false, moduleName = null) {
  if (!fs.existsSync(src)) return false;
  fs.mkdirSync(dest, { recursive: true });

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (exclude.includes(entry.name)) continue;

    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath, exclude, transformMd, moduleName);
    } else if (entry.name.endsWith('.md')) {
      // Always transform markdown links, use module context if provided
      let content = fs.readFileSync(srcPath, 'utf-8');
      content = transformMarkdownLinks(content, moduleName);
      fs.writeFileSync(destPath, content);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
  return true;
}

function transformMarkdownLinks(content, moduleName = null) {
  // Transform HTML img src attributes for module docs images
  content = content.replaceAll(/src="\.\/src\/modules\/([^/]+)\/docs\/images\/([^"]+)"/g, (match, mod, file) => {
    return `src="./modules/${mod}/images/${file}"`;
  });

  return content.replaceAll(/\]\(([^)]+)\)/g, (match, url) => {
    // src/modules/{mod}/docs/{path}.md → ./modules/{mod}/{path}.md
    // Keeps .md - Docusaurus handles .md → page conversion
    const docsMatch = url.match(/^\.\.?\/src\/modules\/([^/]+)\/docs\/(.+\.md)$/);
    if (docsMatch) return `](./modules/${docsMatch[1]}/${docsMatch[2]})`;

    // src/modules/{mod}/docs/ → ./modules/{mod}/
    const docsDirMatch = url.match(/^\.\.?\/src\/modules\/([^/]+)\/docs\/$/);
    if (docsDirMatch) return `](./modules/${docsDirMatch[1]}/)`;

    // src/modules/{mod}/docs/images/{file} → ./modules/{mod}/images/{file}
    const docsImageMatch = url.match(/^\.\.?\/src\/modules\/([^/]+)\/docs\/images\/(.+)$/);
    if (docsImageMatch) return `](./modules/${docsImageMatch[1]}/images/${docsImageMatch[2]})`;

    // src/modules/{mod}/README.md → GitHub (not in docs folder)
    const readmeMatch = url.match(/^\.\.?\/src\/modules\/([^/]+)\/README\.md$/i);
    if (readmeMatch) return `](${REPO_URL}/blob/main/src/modules/${readmeMatch[1]}/README.md)`;

    // src/modules/* (non-docs) → GitHub
    const srcMatch = url.match(/^\.\.?\/src\/modules\/(.+)$/);
    if (srcMatch) return `](${REPO_URL}/tree/main/src/modules/${srcMatch[1]})`;

    // Relative paths escaping docs/ folder → GitHub (when module context is known)
    // e.g., ../workflows/foo/bar.md from within docs/ → src/modules/{mod}/workflows/foo/bar.md
    if (moduleName) {
      const relativeEscapeMatch = url.match(/^\.\.\/([^.][^)]+)$/);
      if (relativeEscapeMatch && !relativeEscapeMatch[1].startsWith('src/')) {
        const relativePath = relativeEscapeMatch[1];
        return `](${REPO_URL}/blob/main/src/modules/${moduleName}/${relativePath})`;
      }
    }

    // ./docs/{path}.md → ./{path}.md (docs folder contents are at root in build)
    // Keeps .md - Docusaurus handles .md → page conversion
    const rootDocsMatch = url.match(/^\.\/docs\/(.+\.md)$/);
    if (rootDocsMatch) return `](./${rootDocsMatch[1]})`;

    // Root docs → GitHub (not part of docs site)
    if (url === '../README.md' || url === './README.md' || url === './project-readme') {
      return `](${REPO_URL}/blob/main/README.md)`;
    }
    if (url === '../CHANGELOG.md' || url === './CHANGELOG.md' || url === './changelog') {
      return `](${REPO_URL}/blob/main/CHANGELOG.md)`;
    }

    // Root files → GitHub (CONTRIBUTING, LICENSE, CODE_OF_CONDUCT, etc.)
    const contributingMatch = url.match(/^(\.\.\/)?CONTRIBUTING\.md(#.*)?$/);
    if (contributingMatch) {
      const anchor = contributingMatch[2] || '';
      return `](${REPO_URL}/blob/main/CONTRIBUTING.md${anchor})`;
    }
    if (url === 'LICENSE' || url === '../LICENSE') {
      return `](${REPO_URL}/blob/main/LICENSE)`;
    }
    if (url === '.github/CODE_OF_CONDUCT.md' || url === '../.github/CODE_OF_CONDUCT.md') {
      return `](${REPO_URL}/blob/main/.github/CODE_OF_CONDUCT.md)`;
    }

    // Other root .md files → GitHub
    const rootFileMatch = url.match(/^\.\.\/([A-Z][^/]+\.md)$/);
    if (rootFileMatch) return `](${REPO_URL}/blob/main/${rootFileMatch[1]})`;

    // Cross-module doc links: ../../{mod}/docs/{path}.md → ../{mod}/{path}.md
    // Fixes path structure but keeps .md (Docusaurus handles .md → page conversion)
    const crossModuleDocsMatch = url.match(/^\.\.\/\.\.\/([^/]+)\/docs\/(.+\.md)$/);
    if (crossModuleDocsMatch) return `](../${crossModuleDocsMatch[1]}/${crossModuleDocsMatch[2]})`;

    // Root-level folders (samples/) → GitHub
    const rootFolderMatch = url.match(/^\.\.\/((samples)\/.*)/);
    if (rootFolderMatch) return `](${REPO_URL}/blob/main/${rootFolderMatch[1]})`;

    return match;
  });
}

function countMarkdownFiles(dir) {
  let count = 0;
  if (!fs.existsSync(dir)) return 0;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      count += countMarkdownFiles(fullPath);
    } else if (entry.name.endsWith('.md')) {
      count++;
    }
  }
  return count;
}

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

function printBanner(title) {
  console.log('╔' + '═'.repeat(62) + '╗');
  console.log(`║${title.padStart(31 + title.length / 2).padEnd(62)}║`);
  console.log('╚' + '═'.repeat(62) + '╝');
}

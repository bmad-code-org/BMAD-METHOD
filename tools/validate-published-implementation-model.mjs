import fs from 'node:fs';
import path from 'node:path';

const CANONICAL_LLMS_ENTRY = '**[Build a Change]';
const CANONICAL_LLMS_DESCRIPTION = 'Canonical implementation workflow for direct intent and fully planned work';
const REQUIRED_LLMS_TITLES = ['**[Build a Change]', '**[Walk Through a Change]', '**[Test Completed Work]'];
const REQUIRED_LLMS_ROUTES = ['/build/build-a-change/', '/build/walk-through-a-change/', '/build/test-completed-work/'];
const SUPERSEDED_LLMS_ROUTES = [
  '/how-to/quick-fixes/',
  '/explanation/build/',
  '/explanation/checkpoint-preview/',
  '/reference/testing/',
  '/build/review-a-completed-change/',
  '/build/checkpoint-a-change/',
];

const FORBIDDEN_TERMS = [
  /\bbmad-(?:quick-dev|dev-auto)\b/gi,
  /\bQuick[ -]?Dev\b/gi,
  /\bDev[ -]?Auto\b/gi,
  /\bbmad-(?:create|dev)-story\b/gi,
  /\b(?:create-story|dev-story)\b/gi,
  /\b(?:Create Story|Dev Story)\b/g,
  /\b(?:createStory|devStory|create_story|dev_story)\b/g,
  /\bquick[ -]?flow\b/gi,
  /flux rapide|parcours parallèle/gi,
  /paralelní cesta/gi,
  /luồng nhanh|nhánh nhanh/gi,
  /快速流程|并行快线/g,
];

export function validatePublishedImplementationModel(siteDir) {
  const findings = findObsoleteImplementationTerms(siteDir);
  if (findings.length > 0) {
    const details = findings.map(({ file, line, match }) => `${file}:${line}: ${match}`).join('\n  ');
    throw new Error(`Obsolete implementation terminology found in deployable documentation:\n  ${details}`);
  }

  const llmsPath = path.join(siteDir, 'llms.txt');
  const llmsContent = fs.readFileSync(llmsPath, 'utf-8');
  if (!llmsContent.includes(CANONICAL_LLMS_ENTRY) || !llmsContent.includes(CANONICAL_LLMS_DESCRIPTION)) {
    throw new Error('llms.txt must describe Build as canonical for both direct intent and fully planned work');
  }

  const missingTitles = REQUIRED_LLMS_TITLES.filter((title) => !llmsContent.includes(title));
  const missingRoutes = REQUIRED_LLMS_ROUTES.filter((route) => !llmsContent.includes(route));
  if (missingTitles.length > 0 || missingRoutes.length > 0) {
    throw new Error(`llms.txt must list the Build chapter pages: missing ${[...missingTitles, ...missingRoutes].join(', ')}`);
  }

  const staleRoutes = SUPERSEDED_LLMS_ROUTES.filter((route) => llmsContent.includes(route));
  if (staleRoutes.length > 0) {
    throw new Error(`llms.txt still lists superseded English routes: ${staleRoutes.join(', ')}`);
  }
}

export function findObsoleteImplementationTerms(siteDir) {
  const findings = [];

  for (const filePath of getPublishedTextFiles(siteDir)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    for (const pattern of FORBIDDEN_TERMS) {
      for (const match of content.matchAll(pattern)) {
        findings.push({
          file: path.relative(siteDir, filePath),
          line: content.slice(0, match.index).split('\n').length,
          match: match[0],
        });
      }
    }
  }

  return findings;
}

function getPublishedTextFiles(dir) {
  const files = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getPublishedTextFiles(fullPath));
    } else if (/\.(?:html|txt|xml|json|svg)$/i.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

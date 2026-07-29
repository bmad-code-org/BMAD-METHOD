import fs from 'node:fs';
import path from 'node:path';

const CANONICAL_LLMS_ENTRY = '**[Quick Dev]';
const CANONICAL_LLMS_DESCRIPTION = 'Canonical implementation workflow for direct intent and fully planned work';

const FORBIDDEN_TERMS = [
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
    throw new Error('llms.txt must describe Quick Dev as canonical for both direct intent and fully planned work');
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

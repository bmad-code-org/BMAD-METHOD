import fs from 'node:fs/promises';
import path from 'node:path';
import { EXIT, BmadModuleError } from './exit.mjs';
import { safePathInsideRoot } from './fs-safe.mjs';

// Default ignore patterns always applied on top of user ignores.
// `.claude-plugin/` is intentionally NOT ignored — the manifest is needed
// post-install for `update` and `list` to re-resolve the module.
const DEFAULT_IGNORES = ['.git/**', '.git', 'node_modules/**', 'node_modules', '.bmadignore', '.DS_Store', '**/.DS_Store'];

// Compile one ignore pattern (gitignore-lite: supports `*`, `**`, `?`, and
// trailing `/`; no negation, no leading `/` anchoring) into a RegExp matched
// against a POSIX-style relative path.
function compilePattern(pattern) {
  let p = pattern.trim();
  if (!p || p.startsWith('#')) return null;
  // Treat trailing slash as "directory" — match the dir and its contents.
  const dirOnly = p.endsWith('/');
  if (dirOnly) p = p.slice(0, -1);
  // Anchor by default (gitignore semantics): if no slash in pattern, match
  // basename anywhere; else anchor to root.
  const anchored = p.includes('/');
  let body = p
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*\*/g, '\uFFFF')
    .replace(/\*/g, '[^/]*')
    .replace(/\uFFFF/g, '.*')
    .replace(/\?/g, '[^/]');
  const re = anchored ? new RegExp(`^${body}(/.*)?$`) : new RegExp(`(^|/)${body}(/.*)?$`);
  return re;
}

export function buildIgnoreMatcher(userPatterns) {
  const patterns = [...DEFAULT_IGNORES, ...(userPatterns || [])];
  const compiled = patterns.map(compilePattern).filter(Boolean);
  return (relPath) => {
    const posix = relPath.replaceAll('\\', '/');
    return compiled.some((re) => re.test(posix));
  };
}

// Load user ignore patterns from manifest first, then .bmadignore. Spec §15
// disallows both at once — readUserIgnores enforces it.
export async function readUserIgnores(sourceDir, manifest) {
  const fromManifest = manifest?.bmad?.install?.ignore;
  const ignoreFilePath = path.join(sourceDir, '.bmadignore');
  let fromFile = null;
  try {
    const buf = await fs.readFile(ignoreFilePath, 'utf8');
    fromFile = buf
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);
  } catch {
    /* no .bmadignore — fine */
  }
  if (Array.isArray(fromManifest) && fromFile) {
    throw new BmadModuleError(EXIT.BAD_MANIFEST, `both .bmadignore and bmad.install.ignore are present — pick one`);
  }
  if (Array.isArray(fromManifest)) return fromManifest;
  if (fromFile) return fromFile;
  return [];
}

// Validate that every declared path in the manifest exists inside the source
// tree and resolves safely (no traversal, no symlink escape). Declared paths
// double as documentation; they do NOT drive the copy list, but if they are
// broken the install would land a non-functional module.
export function validateDeclaredPaths(sourceDir, manifest) {
  const declared = [];
  const arr = (key, val) => Array.isArray(val) && val.forEach((v) => declared.push({ key, val: v }));
  const str = (key, val) => typeof val === 'string' && declared.push({ key, val });
  arr('skills', manifest.skills);
  arr('agents', manifest.agents);
  arr('commands', manifest.commands);
  str('hooks', manifest.hooks);
  if (typeof manifest.mcpServers === 'string') str('mcpServers', manifest.mcpServers);
  str('lspServers', manifest.lspServers);
  str('settings', manifest.settings);
  str('bmad.moduleDefinition', manifest.bmad?.moduleDefinition);
  str('bmad.moduleHelpCsv', manifest.bmad?.moduleHelpCsv);
  arr('bmad.customize.schemas', manifest.bmad?.customize?.schemas);
  if (manifest.bmad?.docs) {
    str('bmad.docs.readme', manifest.bmad.docs.readme);
    str('bmad.docs.changelog', manifest.bmad.docs.changelog);
    if (typeof manifest.bmad.docs.homepage === 'string' && !/^https?:/.test(manifest.bmad.docs.homepage)) {
      str('bmad.docs.homepage', manifest.bmad.docs.homepage);
    }
  }
  for (const { key, val } of declared) {
    const safe = safePathInsideRoot(sourceDir, val);
    if (safe === null) {
      throw new BmadModuleError(EXIT.PATH_TRAVERSAL, `manifest ${key}: "${val}" escapes module root`);
    }
  }
  // Existence is enforced by the validator pre-publish; at install time we
  // surface missing declared paths as PATH_TRAVERSAL-class problems too, so
  // the user gets a single failure mode for "manifest doesn't match tree".
  return declared;
}

// Walk the module source tree and return the list of POSIX-relative file
// paths that should be copied into `_bmad/<code>/`. Honors ignore patterns
// and skips symlinks (they're not preserved in the install).
export async function buildCopyList(sourceDir, ignoreMatch) {
  const out = [];
  async function walk(rel) {
    const absDir = path.join(sourceDir, rel);
    const entries = await fs.readdir(absDir, { withFileTypes: true });
    for (const entry of entries) {
      const childRel = rel ? `${rel}/${entry.name}` : entry.name;
      if (ignoreMatch(childRel)) continue;
      if (entry.isSymbolicLink()) continue;
      if (entry.isDirectory()) await walk(childRel);
      else if (entry.isFile()) out.push(childRel);
    }
  }
  await walk('');
  out.sort();
  return out;
}

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

// Top-level files we always copy if present (and not ignored). Authors don't
// have to declare these — they're conventional repo metadata.
const ALWAYS_TOPLEVEL = new Set([
  'README.md',
  'README',
  'README.rst',
  'CHANGELOG.md',
  'CHANGELOG',
  'LICENSE',
  'LICENSE.md',
  'LICENSE.txt',
  'LICENCE',
  'LICENCE.md',
  'NOTICE',
  'NOTICE.md',
]);

function stripDotSlash(p) {
  if (typeof p !== 'string') return p;
  let s = p.replaceAll('\\', '/');
  if (s.startsWith('./')) s = s.slice(2);
  return s;
}

// Recursively list files under `sourceDir/relDir`, returning POSIX paths
// relative to `sourceDir`. Skips symlinks and ignore-matched entries.
async function listFilesUnder(sourceDir, relDir, ignoreMatch) {
  const out = [];
  async function walk(rel) {
    const absDir = path.join(sourceDir, rel);
    let entries;
    try {
      entries = await fs.readdir(absDir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const childRel = rel ? `${rel}/${entry.name}` : entry.name;
      if (ignoreMatch && ignoreMatch(childRel)) continue;
      if (entry.isSymbolicLink()) continue;
      if (entry.isDirectory()) await walk(childRel);
      else if (entry.isFile()) out.push(childRel);
    }
  }
  await walk(relDir);
  return out;
}

// Build a manifest-driven copy plan. Each entry is { srcRel, destRel } in
// POSIX form, relative to the module's source root / install root respectively.
//
// The plan:
//   - Each declared `skills[]` / `agents[]` / `commands[]` dir is copied
//     recursively into the canonical slot (`skills/<basename>/...` etc.),
//     regardless of where the author kept it in source (e.g. under `src/`).
//   - `bmad.moduleDefinition` → `module.yaml`
//   - `bmad.moduleHelpCsv` → `module-help.csv`
//   - `bmad.docs.readme` / `bmad.docs.changelog` / `bmad.docs.homepage`
//     (relative path) → preserved at module root with their basename.
//   - `hooks` / `mcpServers` / `lspServers` / `settings` (when string paths) →
//     canonical root slot (`hooks.json`, `.mcp.json`, etc.).
//   - `.claude-plugin/plugin.json` is always kept (callers rewrite paths in it
//     via `rewriteManifestPaths`).
//   - `.claude-plugin/marketplace.json` is preserved if present.
//   - Conventional top-level metadata files (README/CHANGELOG/LICENSE/NOTICE)
//     are copied if present at source root.
//
// Anything NOT covered by the above is dropped. This means `tools/`, `website/`,
// `.github/`, `.trunk/`, etc. don't leak into the install even if the author
// forgot to list them in `bmad.install.ignore`.
//
// Returns: { plan, skillDestDirs } where skillDestDirs is the list of canonical
// skill paths (`skills/X`) for the skill-manifest writer.
export async function buildCopyPlan(sourceDir, manifest, ignoreMatch) {
  const plan = [];
  const claimedSrc = new Set();
  const claimedDest = new Set();

  const addFile = (srcRel, destRel) => {
    if (!srcRel || !destRel) return;
    if (claimedSrc.has(srcRel)) return;
    if (claimedDest.has(destRel)) return;
    claimedSrc.add(srcRel);
    claimedDest.add(destRel);
    plan.push({ srcRel, destRel });
  };

  const addDirRecursive = async (srcRelDir, destRelDir) => {
    const files = await listFilesUnder(sourceDir, srcRelDir, ignoreMatch);
    for (const fileSrcRel of files) {
      const rest = fileSrcRel.slice(srcRelDir.length).replace(/^\//, '');
      const destRel = rest ? `${destRelDir}/${rest}` : destRelDir;
      addFile(fileSrcRel, destRel);
    }
  };

  // Helper: if `srcRel` exists as a file in source, queue it.
  const queueFileIfExists = async (srcRel, destRel) => {
    if (!srcRel) return;
    if (ignoreMatch && ignoreMatch(srcRel)) return;
    try {
      const stat = await fs.stat(path.join(sourceDir, srcRel));
      if (stat.isFile()) addFile(srcRel, destRel);
    } catch {
      /* missing — silently skip; validateDeclaredPaths surfaces declared misses */
    }
  };

  // Plugin manifest itself — always kept. Path is rewritten by the caller
  // before staging; here we just reserve the slot so nothing else claims it.
  claimedDest.add('.claude-plugin/plugin.json');

  // Optional marketplace.json — copy verbatim if present.
  await queueFileIfExists('.claude-plugin/marketplace.json', '.claude-plugin/marketplace.json');

  // Skills / agents / commands.
  const arrCategories = [
    ['skills', 'skills', manifest.skills],
    ['agents', 'agents', manifest.agents],
    ['commands', 'commands', manifest.commands],
  ];
  const skillDestDirs = [];
  for (const [, destPrefix, arr] of arrCategories) {
    if (!Array.isArray(arr)) continue;
    for (const declared of arr) {
      const srcRel = stripDotSlash(declared);
      if (!srcRel) continue;
      const destRel = `${destPrefix}/${path.posix.basename(srcRel)}`;
      // Entries may be directories (skills, agent packs) or single files
      // (e.g. a subagent declared as `./agents/foo.md`). Stat to branch;
      // rewriteManifestPaths() remaps both to `<destPrefix>/<basename>`.
      try {
        const stat = await fs.stat(path.join(sourceDir, srcRel));
        if (stat.isDirectory()) {
          await addDirRecursive(srcRel, destRel);
          if (destPrefix === 'skills') skillDestDirs.push(destRel);
        } else if (stat.isFile() && (!ignoreMatch || !ignoreMatch(srcRel))) addFile(srcRel, destRel);
      } catch {
        /* missing — validateDeclaredPaths surfaces declared misses */
      }
    }
  }

  // moduleDefinition / moduleHelpCsv — flatten to canonical names at root.
  if (typeof manifest.bmad?.moduleDefinition === 'string') {
    await queueFileIfExists(stripDotSlash(manifest.bmad.moduleDefinition), 'module.yaml');
  }
  if (typeof manifest.bmad?.moduleHelpCsv === 'string') {
    await queueFileIfExists(stripDotSlash(manifest.bmad.moduleHelpCsv), 'module-help.csv');
  }

  // Top-level docs declared in the manifest — keep at root by basename.
  const docs = manifest.bmad?.docs;
  if (docs && typeof docs === 'object') {
    for (const key of ['readme', 'changelog', 'homepage']) {
      const v = docs[key];
      if (typeof v !== 'string') continue;
      if (/^https?:/i.test(v)) continue;
      const srcRel = stripDotSlash(v);
      await queueFileIfExists(srcRel, path.posix.basename(srcRel));
    }
  }

  // String-typed Claude-Code surfaces — canonical root slot.
  const stringSurfaces = [
    ['hooks', 'hooks.json'],
    ['mcpServers', '.mcp.json'],
    ['lspServers', 'lsp-servers.json'],
    ['settings', 'settings.json'],
  ];
  for (const [key, destName] of stringSurfaces) {
    const v = manifest[key];
    if (typeof v !== 'string') continue;
    const srcRel = stripDotSlash(v);
    if (!srcRel) continue;
    // If the declared path is a directory, copy it under its basename.
    try {
      const stat = await fs.stat(path.join(sourceDir, srcRel));
      if (stat.isDirectory()) {
        await addDirRecursive(srcRel, path.posix.basename(srcRel));
      } else if (stat.isFile()) {
        addFile(srcRel, destName);
      }
    } catch {
      /* missing — skip */
    }
  }

  // Conventional top-level metadata files — copy if present.
  for (const name of ALWAYS_TOPLEVEL) {
    await queueFileIfExists(name, name);
  }

  // Stable order — dest-relative sort makes diffs and dry-run output readable.
  plan.sort((a, b) => a.destRel.localeCompare(b.destRel));
  skillDestDirs.sort();

  return { plan, skillDestDirs };
}

// Produce a rewritten plugin.json where every declared path points at its
// canonical post-install location (so the on-disk manifest stays self-consistent
// inside `_bmad/<code>/`). Returns a JSON string.
export function rewriteManifestPaths(manifest) {
  const out = structuredClone(manifest);

  const remapArr = (arr, destPrefix) => {
    if (!Array.isArray(arr)) return arr;
    return arr.map((entry) => {
      if (typeof entry !== 'string') return entry;
      const srcRel = stripDotSlash(entry);
      return `./${destPrefix}/${path.posix.basename(srcRel)}`;
    });
  };

  if (Array.isArray(out.skills)) out.skills = remapArr(out.skills, 'skills');
  if (Array.isArray(out.agents)) out.agents = remapArr(out.agents, 'agents');
  if (Array.isArray(out.commands)) out.commands = remapArr(out.commands, 'commands');

  if (typeof out.hooks === 'string') out.hooks = './hooks.json';
  if (typeof out.mcpServers === 'string') out.mcpServers = './.mcp.json';
  if (typeof out.lspServers === 'string') out.lspServers = './lsp-servers.json';
  if (typeof out.settings === 'string') out.settings = './settings.json';

  if (out.bmad && typeof out.bmad === 'object') {
    if (typeof out.bmad.moduleDefinition === 'string') out.bmad.moduleDefinition = './module.yaml';
    if (typeof out.bmad.moduleHelpCsv === 'string') out.bmad.moduleHelpCsv = './module-help.csv';

    // customize.schemas — each entry lives inside its skill dir; the skill dir
    // itself is remapped to `skills/<basename>`, so the schema's new path is
    // `./skills/<skill-basename>/<file>`.
    const schemas = out.bmad.customize?.schemas;
    if (Array.isArray(schemas)) {
      out.bmad.customize.schemas = schemas.map((entry) => {
        if (typeof entry !== 'string') return entry;
        const srcRel = stripDotSlash(entry);
        const parts = srcRel.split('/');
        // Heuristic: last two segments are `<skill-name>/<filename>`.
        if (parts.length >= 2) {
          const file = parts.at(-1);
          const skill = parts.at(-2);
          return `./skills/${skill}/${file}`;
        }
        return `./${srcRel}`;
      });
    }

    if (out.bmad.docs && typeof out.bmad.docs === 'object') {
      for (const key of ['readme', 'changelog', 'homepage']) {
        const v = out.bmad.docs[key];
        if (typeof v !== 'string') continue;
        if (/^https?:/i.test(v)) continue;
        out.bmad.docs[key] = `./${path.posix.basename(stripDotSlash(v))}`;
      }
    }
  }

  return JSON.stringify(out, null, 2) + '\n';
}

import fs from 'node:fs/promises';
import path from 'node:path';
import { parse as parseYaml } from './vendor/yaml.mjs';

// Create the project working directories a module declares in its module.yaml
// `directories:` key, mirroring the full installer's
// OfficialModules.createModuleDirectories (tools/installer/modules/official-modules.js).
//
// Each entry is a `{config_key}` reference resolved against the module's config
// values (produced by config-gen). `{project-root}` is stripped to a project-
// relative path; the dir is created under the project root (the parent of
// `_bmad/`). On update, a changed path moves the old directory to the new one.
// All failures are non-fatal warnings — the module itself is already installed.

const warn = (msg) => process.stderr.write(`[bmad-module] warn: ${msg}\n`);

async function pathExists(p) {
  try {
    await fs.stat(p);
    return true;
  } catch {
    return false;
  }
}

// `moduleConfig` / `existingConfig`: {configKey: resolvedValue} maps, where a
// value may carry a leading `{project-root}/`. Returns a summary for display.
export async function createModuleDirectories(bmadDir, code, moduleConfig = {}, existingConfig = {}) {
  const projectRoot = path.dirname(bmadDir);
  const empty = { createdDirs: [], movedDirs: [], createdWdsFolders: [] };

  let moduleYamlRaw;
  try {
    moduleYamlRaw = await fs.readFile(path.join(bmadDir, code, 'module.yaml'), 'utf8');
  } catch {
    return empty; // no module.yaml flattened into the install — nothing to do
  }
  let moduleYaml;
  try {
    moduleYaml = parseYaml(moduleYamlRaw);
  } catch (e) {
    warn(`invalid ${code}/module.yaml: ${e.message}`);
    return empty;
  }
  if (!moduleYaml || !Array.isArray(moduleYaml.directories)) return empty;

  const wdsFolders = Array.isArray(moduleYaml.wds_folders) ? moduleYaml.wds_folders : [];
  const createdDirs = [];
  const movedDirs = [];
  const createdWdsFolders = [];
  const normalizedRoot = path.normalize(projectRoot);

  const toRelPath = (value) => path.normalize(value.replace(/^\{project-root\}\/?/, '').replaceAll('{project-root}', ''));

  for (const dirRef of moduleYaml.directories) {
    const varMatch = typeof dirRef === 'string' && dirRef.match(/^\{([^}]+)\}$/);
    if (!varMatch) continue; // only variable references are honored
    const configKey = varMatch[1];
    const dirValue = moduleConfig[configKey];
    if (!dirValue || typeof dirValue !== 'string') continue;

    const dirPath = toRelPath(dirValue);
    const fullPath = path.join(projectRoot, dirPath);
    const normalizedNewAbs = path.normalize(fullPath);
    if (normalizedNewAbs !== normalizedRoot && !normalizedNewAbs.startsWith(normalizedRoot + path.sep)) {
      warn(`${configKey} path escapes project root, skipping: ${dirPath}`);
      continue;
    }

    // Detect a changed path vs the previous install for a move.
    let oldFullPath = null;
    let oldDirPath = null;
    const oldValue = existingConfig[configKey];
    if (oldValue && typeof oldValue === 'string') {
      const normalizedOld = toRelPath(oldValue);
      if (normalizedOld !== dirPath) {
        oldDirPath = normalizedOld;
        oldFullPath = path.join(projectRoot, oldDirPath);
        const normalizedOldAbs = path.normalize(oldFullPath);
        if (normalizedOldAbs !== normalizedRoot && !normalizedOldAbs.startsWith(normalizedRoot + path.sep)) {
          oldFullPath = null; // old path escapes root — ignore
        } else if (normalizedOldAbs.startsWith(normalizedNewAbs + path.sep) || normalizedNewAbs.startsWith(normalizedOldAbs + path.sep)) {
          warn(`${configKey}: cannot move between parent/child paths (${oldDirPath} / ${dirPath}); creating new directory`);
          oldFullPath = null;
        }
      }
    }

    const dirName = configKey.replaceAll('_', ' ');
    const newExists = await pathExists(fullPath);
    if (oldFullPath && (await pathExists(oldFullPath)) && !newExists) {
      try {
        await fs.mkdir(path.dirname(fullPath), { recursive: true });
        await fs.rename(oldFullPath, fullPath);
        movedDirs.push(`${dirName}: ${oldDirPath} → ${dirPath}`);
      } catch (moveErr) {
        warn(`failed to move ${oldDirPath} → ${dirPath}: ${moveErr.message}. Creating new directory; move contents manually.`);
        await fs.mkdir(fullPath, { recursive: true });
        createdDirs.push(`${dirName}: ${dirPath}`);
      }
    } else if (oldFullPath && (await pathExists(oldFullPath)) && newExists) {
      warn(`${dirName}: path changed but both old (${oldDirPath}) and new (${dirPath}) exist — review/merge manually.`);
    } else if (!newExists) {
      await fs.mkdir(fullPath, { recursive: true });
      createdDirs.push(`${dirName}: ${dirPath}`);
    }

    // WDS subfolders under design_artifacts.
    if (configKey === 'design_artifacts' && wdsFolders.length) {
      for (const sub of wdsFolders) {
        if (typeof sub !== 'string' || sub === '') continue;
        const subPath = path.normalize(path.join(fullPath, sub));
        // `sub` is untrusted module content; reject traversal/absolute escapes
        // out of the design_artifacts directory.
        if (subPath !== normalizedNewAbs && !subPath.startsWith(normalizedNewAbs + path.sep)) {
          warn(`wds_folders entry escapes design_artifacts, skipping: ${sub}`);
          continue;
        }
        if (!(await pathExists(subPath))) {
          await fs.mkdir(subPath, { recursive: true });
          createdWdsFolders.push(sub);
        }
      }
    }
  }

  return { createdDirs, movedDirs, createdWdsFolders };
}

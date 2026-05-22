import fs from 'node:fs/promises';
import path from 'node:path';
import semver from 'semver';
import { EXIT, BmadModuleError } from './exit.mjs';

// Reserved bmad.code values — must match docs/spec.md §7.1 and the
// validator's RESERVED_CODES set. Single source of truth for the runtime.
export const RESERVED_CODES = new Set([
  'core',
  'bmm',
  'bmb',
  'cis',
  'gds',
  'tea',
  'wds',
  'automator',
  '_config',
  '_memory',
  'custom',
  'agents',
  'hooks',
  'config',
  'commands',
  'skills',
]);

export const CODE_REGEX = /^[a-z][a-z0-9-]{1,31}$/;
export const NAME_REGEX = /^[a-z][a-z0-9-]+$/;

// Read and install-time-validate a module manifest. Install-time checks are
// intentionally narrower than the author validator (scripts/validate-module.mjs)
// — we only block things that would corrupt _bmad/ or cause data loss.
export async function readAndValidateManifest(sourceDir) {
  const manifestPath = path.join(sourceDir, '.claude-plugin', 'plugin.json');
  let raw;
  try {
    raw = await fs.readFile(manifestPath, 'utf8');
  } catch {
    throw new BmadModuleError(EXIT.BAD_MANIFEST, `missing .claude-plugin/plugin.json at ${sourceDir}`);
  }
  let m;
  try {
    m = JSON.parse(raw);
  } catch (e) {
    throw new BmadModuleError(EXIT.BAD_MANIFEST, `plugin.json failed to parse: ${e.message}`);
  }

  const missing = [];
  if (typeof m.name !== 'string') missing.push('name');
  if (typeof m.version !== 'string') missing.push('version');
  if (typeof m.description !== 'string') missing.push('description');
  if (!m.bmad || typeof m.bmad !== 'object') {
    missing.push('bmad');
  } else {
    if (typeof m.bmad.specVersion !== 'string') missing.push('bmad.specVersion');
    if (typeof m.bmad.code !== 'string') missing.push('bmad.code');
    if (typeof m.bmad.compatibility?.bmadMethod !== 'string') missing.push('bmad.compatibility.bmadMethod');
  }
  if (missing.length) {
    throw new BmadModuleError(EXIT.BAD_MANIFEST, `plugin.json missing required fields: ${missing.join(', ')}`);
  }

  if (!NAME_REGEX.test(m.name) || m.name.length < 3 || m.name.length > 64) {
    throw new BmadModuleError(EXIT.BAD_MANIFEST, `plugin.json#name "${m.name}" must match ${NAME_REGEX} and be 3–64 chars`);
  }
  if (!semver.valid(m.version)) {
    throw new BmadModuleError(EXIT.BAD_MANIFEST, `plugin.json#version "${m.version}" is not valid semver`);
  }
  if (!CODE_REGEX.test(m.bmad.code)) {
    throw new BmadModuleError(EXIT.BAD_MANIFEST, `plugin.json#bmad.code "${m.bmad.code}" must match ${CODE_REGEX}`);
  }
  if (RESERVED_CODES.has(m.bmad.code)) {
    throw new BmadModuleError(EXIT.RESERVED_PREFIX, `plugin.json#bmad.code "${m.bmad.code}" is reserved (spec §7.1)`);
  }
  if (!semver.validRange(m.bmad.compatibility.bmadMethod)) {
    throw new BmadModuleError(
      EXIT.BAD_MANIFEST,
      `plugin.json#bmad.compatibility.bmadMethod "${m.bmad.compatibility.bmadMethod}" is not a valid semver range`,
    );
  }

  return m;
}

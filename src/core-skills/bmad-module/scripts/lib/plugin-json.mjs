import fs from 'node:fs/promises';
import path from 'node:path';
import { valid as semverValid, validRange as semverValidRange } from './semver-lite.mjs';
import { EXIT, BmadModuleError } from './exit.mjs';

// Reserved bmad.code values — must match the validator's RESERVED_CODES
// set. Single source of truth for the runtime.
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
  return validateManifestObject(m);
}

// Validate an already-parsed manifest object against the install-time rules.
// Shared by readAndValidateManifest (new-spec, from disk) and the legacy
// resolver (which synthesizes a manifest from marketplace.json + module.yaml).
// `allowReserved` lets the legacy path install first-party modules whose codes
// (gds, bmm, cis, …) are reserved against new-spec community authors. Returns
// the validated object.
export function validateManifestObject(m, { allowReserved = false } = {}) {
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
  if (!semverValid(m.version)) {
    throw new BmadModuleError(EXIT.BAD_MANIFEST, `plugin.json#version "${m.version}" is not valid semver`);
  }
  if (!CODE_REGEX.test(m.bmad.code)) {
    throw new BmadModuleError(EXIT.BAD_MANIFEST, `plugin.json#bmad.code "${m.bmad.code}" must match ${CODE_REGEX}`);
  }
  if (!allowReserved && RESERVED_CODES.has(m.bmad.code)) {
    throw new BmadModuleError(EXIT.RESERVED_PREFIX, `plugin.json#bmad.code "${m.bmad.code}" is reserved`);
  }
  if (!semverValidRange(m.bmad.compatibility.bmadMethod)) {
    throw new BmadModuleError(
      EXIT.BAD_MANIFEST,
      `plugin.json#bmad.compatibility.bmadMethod "${m.bmad.compatibility.bmadMethod}" is not a valid semver range`,
    );
  }

  return m;
}

// Probe whether a source dir carries a new-spec manifest — a parseable
// `.claude-plugin/plugin.json` with a `bmad{}` block. Returns false when the
// file is absent or has no `bmad` object (→ caller tries the legacy resolver),
// and true on parse failure so a malformed new manifest surfaces via
// readAndValidateManifest rather than being silently treated as legacy.
export async function hasBmadPluginJson(sourceDir) {
  const manifestPath = path.join(sourceDir, '.claude-plugin', 'plugin.json');
  let raw;
  try {
    raw = await fs.readFile(manifestPath, 'utf8');
  } catch {
    return false;
  }
  try {
    const m = JSON.parse(raw);
    return !!(m && typeof m === 'object' && m.bmad && typeof m.bmad === 'object');
  } catch {
    return true;
  }
}

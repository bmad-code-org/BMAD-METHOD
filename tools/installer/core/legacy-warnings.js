const os = require('node:os');
const path = require('node:path');
const semver = require('semver');
const fs = require('../fs-native');
const prompts = require('../prompts');

const MIN_NATIVE_SKILLS_VERSION = '6.1.0';

const LEGACY_PATHS = [
  '.agent/workflows',
  '.augment/commands',
  '.claude/commands',
  '.clinerules/workflows',
  '.codex/prompts',
  '~/.codex/prompts',
  '.codebuddy/commands',
  '.crush/commands',
  '.cursor/commands',
  '.gemini/commands',
  '.github/agents',
  '.github/prompts',
  '.iflow/commands',
  '.kilocode/workflows',
  '.kiro/steering',
  '.opencode/agents',
  '.opencode/commands',
  '.opencode/agent',
  '.opencode/command',
  '.qwen/commands',
  '.roo/commands',
  '.rovodev/workflows',
  '.trae/rules',
  '.windsurf/workflows',
];

function expandPath(p) {
  if (p === '~') return os.homedir();
  if (p.startsWith('~/')) return path.join(os.homedir(), p.slice(2));
  return p;
}

function resolveLegacyPath(projectRoot, p) {
  if (path.isAbsolute(p) || p.startsWith('~')) return expandPath(p);
  return path.join(projectRoot, p);
}

async function findStaleLegacyDirs(projectRoot) {
  const findings = [];
  for (const legacyPath of LEGACY_PATHS) {
    const resolved = resolveLegacyPath(projectRoot, legacyPath);
    if (!(await fs.pathExists(resolved))) continue;
    try {
      const entries = await fs.readdir(resolved);
      const bmadEntries = entries.filter(
        (e) => typeof e === 'string' && e.toLowerCase().startsWith('bmad') && !e.toLowerCase().startsWith('bmad-os-'),
      );
      if (bmadEntries.length > 0) {
        findings.push({ path: resolved, displayPath: legacyPath, count: bmadEntries.length });
      }
    } catch {
      // Unreadable dir — skip
    }
  }
  return findings;
}

function isPreNativeSkillsVersion(version) {
  if (!version) return false;
  const coerced = semver.valid(version) || semver.valid(semver.coerce(version));
  if (!coerced) return false;
  return semver.lt(coerced, MIN_NATIVE_SKILLS_VERSION);
}

async function warnPreNativeSkillsLegacy({ projectRoot, existingVersion } = {}) {
  const versionTriggered = isPreNativeSkillsVersion(existingVersion);
  const staleDirs = await findStaleLegacyDirs(projectRoot);

  if (!versionTriggered && staleDirs.length === 0) return;

  if (versionTriggered) {
    await prompts.log.warn(
      `Detected previous BMAD install v${existingVersion} (pre-${MIN_NATIVE_SKILLS_VERSION}). ` +
        `BMAD switched to native skills format in v${MIN_NATIVE_SKILLS_VERSION}; old command/workflow directories from your prior install may still be present.`,
    );
  }

  if (staleDirs.length > 0) {
    await prompts.log.warn(
      `Found stale BMAD entries in ${staleDirs.length} legacy location(s) that the new installer no longer manages. ` +
        `Your AI tool may load these alongside the new skills, causing duplicates. Remove them manually:`,
    );
    for (const finding of staleDirs) {
      await prompts.log.message(`    rm -rf "${finding.path}"/bmad*    # ${finding.count} stale entr${finding.count === 1 ? 'y' : 'ies'}`);
    }
  } else if (versionTriggered) {
    await prompts.log.message(
      '  No stale legacy directories detected, but if your AI tool shows duplicate BMAD commands after install, check for old `bmad-*` entries in tool-specific dirs (e.g. .claude/commands, .cursor/commands).',
    );
  }
}

module.exports = {
  warnPreNativeSkillsLegacy,
  findStaleLegacyDirs,
  isPreNativeSkillsVersion,
  LEGACY_PATHS,
  MIN_NATIVE_SKILLS_VERSION,
};

const path = require('node:path');
const fs = require('../fs-native');

const STORY_SKILL = 'bmad-story-automator';
const REVIEW_SKILL = 'bmad-story-automator-review';

async function installBmaRuntimePackage(moduleName, sourcePath, targetPath, fileTrackingCallback = null) {
  if (moduleName !== 'bma') return false;

  const storyTarget = path.join(targetPath, STORY_SKILL);
  const reviewTarget = path.join(targetPath, REVIEW_SKILL);
  if (!(await fs.pathExists(path.join(storyTarget, 'SKILL.md')))) {
    throw new Error(`BMad Automator payload missing installed skill: ${STORY_SKILL}`);
  }
  if (!(await fs.pathExists(path.join(reviewTarget, 'SKILL.md')))) {
    throw new Error(`BMad Automator payload missing installed skill: ${REVIEW_SKILL}`);
  }

  const repoRoot = await findAutomatorRepoRoot(sourcePath);
  const sourceRoot = path.join(repoRoot, 'source');
  const runtimeFiles = {
    pyproject: path.join(sourceRoot, 'pyproject.toml'),
    readme: path.join(sourceRoot, 'README.md'),
    license: path.join(sourceRoot, 'LICENSE'),
    scripts: path.join(sourceRoot, 'scripts'),
    src: path.join(sourceRoot, 'src'),
  };

  for (const [label, requiredPath] of Object.entries(runtimeFiles)) {
    if (!(await fs.pathExists(requiredPath))) {
      throw new Error(`BMad Automator runtime ${label} missing: ${requiredPath}`);
    }
  }

  await copyTracked(runtimeFiles.pyproject, path.join(storyTarget, 'pyproject.toml'), fileTrackingCallback);
  await copyTracked(runtimeFiles.readme, path.join(storyTarget, 'README.md'), fileTrackingCallback);
  await copyTracked(runtimeFiles.license, path.join(storyTarget, 'LICENSE'), fileTrackingCallback);
  await copyTracked(runtimeFiles.scripts, path.join(storyTarget, 'scripts'), fileTrackingCallback);
  await copyTracked(runtimeFiles.src, path.join(storyTarget, 'src'), fileTrackingCallback);
  await fs.chmod(path.join(storyTarget, 'scripts', 'story-automator'), 0o755);

  return true;
}

async function findAutomatorRepoRoot(sourcePath) {
  let current = path.resolve(sourcePath);
  for (let depth = 0; depth < 8; depth += 1) {
    if (
      (await fs.pathExists(path.join(current, 'source', 'scripts', 'story-automator'))) &&
      (await fs.pathExists(path.join(current, 'payload', '.claude', 'skills', STORY_SKILL, 'SKILL.md')))
    ) {
      return current;
    }
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
  throw new Error(`BMad Automator runtime source not found above: ${sourcePath}`);
}

async function copyTracked(source, target, fileTrackingCallback) {
  await fs.remove(target);
  await fs.copy(source, target, { overwrite: true });
  await trackRecursive(target, fileTrackingCallback);
}

async function trackRecursive(target, fileTrackingCallback) {
  if (!fileTrackingCallback) return;
  const stat = await fs.stat(target);
  if (stat.isFile()) {
    fileTrackingCallback(target);
    return;
  }
  if (!stat.isDirectory()) return;
  const entries = await fs.readdir(target, { withFileTypes: true });
  for (const entry of entries) {
    await trackRecursive(path.join(target, entry.name), fileTrackingCallback);
  }
}

module.exports = {
  installBmaRuntimePackage,
};

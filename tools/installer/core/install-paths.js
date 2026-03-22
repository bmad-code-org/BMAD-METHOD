const path = require('node:path');
const fs = require('fs-extra');
const { getProjectRoot } = require('../project-root');
const { BMAD_FOLDER_NAME } = require('../ide/shared/path-utils');

class InstallPaths {
  static async create(config) {
    const srcDir = getProjectRoot();
    await assertReadableDir(srcDir, 'BMAD source root');

    const pkgPath = path.join(srcDir, 'package.json');
    await assertReadableFile(pkgPath, 'package.json');
    const version = require(pkgPath).version;

    const projectRoot = path.resolve(config.directory);
    await ensureWritableDir(projectRoot, 'project root');

    const bmadDir = path.join(projectRoot, BMAD_FOLDER_NAME);
    const isUpdate = await fs.pathExists(bmadDir);

    const configDir = path.join(bmadDir, '_config');
    const agentsDir = path.join(configDir, 'agents');
    const customCacheDir = path.join(configDir, 'custom');
    const coreDir = path.join(bmadDir, 'core');

    for (const [dir, label] of [
      [bmadDir, 'bmad directory'],
      [configDir, 'config directory'],
      [agentsDir, 'agents config directory'],
      [customCacheDir, 'custom modules cache'],
      [coreDir, 'core module directory'],
    ]) {
      await ensureWritableDir(dir, label);
    }

    return new InstallPaths({
      srcDir,
      version,
      projectRoot,
      bmadDir,
      configDir,
      agentsDir,
      customCacheDir,
      coreDir,
      isUpdate,
    });
  }

  constructor(props) {
    Object.assign(this, props);
    Object.freeze(this);
  }

  manifestFile() {
    return path.join(this.configDir, 'manifest.yaml');
  }
  agentManifest() {
    return path.join(this.configDir, 'agent-manifest.csv');
  }
  filesManifest() {
    return path.join(this.configDir, 'files-manifest.csv');
  }
  helpCatalog() {
    return path.join(this.configDir, 'bmad-help.csv');
  }
  moduleDir(name) {
    return path.join(this.bmadDir, name);
  }
  moduleConfig(name) {
    return path.join(this.bmadDir, name, 'config.yaml');
  }
}

async function assertReadableDir(dirPath, label) {
  const stat = await fs.stat(dirPath).catch(() => null);
  if (!stat) {
    throw new Error(`${label} does not exist: ${dirPath}`);
  }
  if (!stat.isDirectory()) {
    throw new Error(`${label} is not a directory: ${dirPath}`);
  }
  try {
    await fs.access(dirPath, fs.constants.R_OK);
  } catch {
    throw new Error(`${label} is not readable: ${dirPath}`);
  }
}

async function assertReadableFile(filePath, label) {
  const stat = await fs.stat(filePath).catch(() => null);
  if (!stat) {
    throw new Error(`${label} does not exist: ${filePath}`);
  }
  if (!stat.isFile()) {
    throw new Error(`${label} is not a file: ${filePath}`);
  }
  try {
    await fs.access(filePath, fs.constants.R_OK);
  } catch {
    throw new Error(`${label} is not readable: ${filePath}`);
  }
}

async function ensureWritableDir(dirPath, label) {
  const stat = await fs.stat(dirPath).catch(() => null);
  if (stat && !stat.isDirectory()) {
    throw new Error(`${label} exists but is not a directory: ${dirPath}`);
  }

  try {
    await fs.ensureDir(dirPath);
  } catch (error) {
    if (error.code === 'EACCES') {
      throw new Error(`${label}: permission denied creating directory: ${dirPath}`);
    }
    if (error.code === 'ENOSPC') {
      throw new Error(`${label}: no space left on device: ${dirPath}`);
    }
    throw new Error(`${label}: cannot create directory: ${dirPath} (${error.message})`);
  }

  try {
    await fs.access(dirPath, fs.constants.R_OK | fs.constants.W_OK);
  } catch {
    throw new Error(`${label} is not writable: ${dirPath}`);
  }
}

module.exports = { InstallPaths };

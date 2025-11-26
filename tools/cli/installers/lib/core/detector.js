const path = require('node:path');
const fs = require('fs-extra');
const yaml = require('js-yaml');
const { Manifest } = require('./manifest');

class Detector {
  /**
   * Detect existing BMAD installation
   * @param {string} bmadDir - Path to bmad directory
   * @returns {Object} Installation status and details
   */
  async detect(bmadDir) {
    const result = {
      installed: false,
      path: bmadDir,
      version: null,
      hasCore: false,
      modules: [],
      ides: [],
      manifest: null,
    };

    // Check if bmad directory exists
    if (!(await fs.pathExists(bmadDir))) {
      return result;
    }

    // Check for manifest using the Manifest class
    const manifest = new Manifest();
    const manifestData = await manifest.read(bmadDir);
    if (manifestData) {
      result.manifest = manifestData;
      result.version = manifestData.version;
      result.installed = true;
    }

    // Check for core
    const corePath = path.join(bmadDir, 'core');
    if (await fs.pathExists(corePath)) {
      result.hasCore = true;

      // Try to get core version from config
      const coreConfigPath = path.join(corePath, 'config.yaml');
      if (await fs.pathExists(coreConfigPath)) {
        try {
          const configContent = await fs.readFile(coreConfigPath, 'utf8');
          const config = yaml.load(configContent);
          if (!result.version && config.version) {
            result.version = config.version;
          }
        } catch {
          // Ignore config read errors
        }
      }
    }

    // Check for modules
    // If manifest exists, use it as the source of truth for installed modules
    // Otherwise fall back to directory scanning (legacy installations)
    if (manifestData && manifestData.modules && manifestData.modules.length > 0) {
      // Use manifest module list - these are officially installed modules
      for (const moduleId of manifestData.modules) {
        const modulePath = path.join(bmadDir, moduleId);
        const moduleConfigPath = path.join(modulePath, 'config.yaml');

        const moduleInfo = {
          id: moduleId,
          path: modulePath,
          version: 'unknown',
        };

        if (await fs.pathExists(moduleConfigPath)) {
          try {
            const configContent = await fs.readFile(moduleConfigPath, 'utf8');
            const config = yaml.load(configContent);
            moduleInfo.version = config.version || 'unknown';
            moduleInfo.name = config.name || moduleId;
            moduleInfo.description = config.description;
          } catch {
            // Ignore config read errors
          }
        }

        result.modules.push(moduleInfo);
      }
    } else {
      // Fallback: scan directory for modules (legacy installations without manifest)
      const entries = await fs.readdir(bmadDir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory() && entry.name !== 'core' && entry.name !== '_cfg') {
          const modulePath = path.join(bmadDir, entry.name);
          const moduleConfigPath = path.join(modulePath, 'config.yaml');

          // Only treat it as a module if it has a config.yaml
          if (await fs.pathExists(moduleConfigPath)) {
            const moduleInfo = {
              id: entry.name,
              path: modulePath,
              version: 'unknown',
            };

            try {
              const configContent = await fs.readFile(moduleConfigPath, 'utf8');
              const config = yaml.load(configContent);
              moduleInfo.version = config.version || 'unknown';
              moduleInfo.name = config.name || entry.name;
              moduleInfo.description = config.description;
            } catch {
              // Ignore config read errors
            }

            result.modules.push(moduleInfo);
          }
        }
      }
    }

    // Check for IDE configurations from manifest
    if (result.manifest && result.manifest.ides) {
      // Filter out any undefined/null values
      result.ides = result.manifest.ides.filter((ide) => ide && typeof ide === 'string');
    }

    // Mark as installed if we found core or modules
    if (result.hasCore || result.modules.length > 0) {
      result.installed = true;
    }

    return result;
  }

  /**
   * Detect legacy installation (.bmad-method, .bmm, .cis)
   * @param {string} projectDir - Project directory to check
   * @returns {Object} Legacy installation details
   */
  async detectLegacy(projectDir) {
    const result = {
      hasLegacy: false,
      legacyCore: false,
      legacyModules: [],
      paths: [],
    };

    // Check for legacy core (.bmad-method)
    const legacyCorePath = path.join(projectDir, '.bmad-method');
    if (await fs.pathExists(legacyCorePath)) {
      result.hasLegacy = true;
      result.legacyCore = true;
      result.paths.push(legacyCorePath);
    }

    // Check for legacy modules (directories starting with .)
    const entries = await fs.readdir(projectDir, { withFileTypes: true });
    for (const entry of entries) {
      if (
        entry.isDirectory() &&
        entry.name.startsWith('.') &&
        entry.name !== '.bmad-method' &&
        !entry.name.startsWith('.git') &&
        !entry.name.startsWith('.vscode') &&
        !entry.name.startsWith('.idea')
      ) {
        const modulePath = path.join(projectDir, entry.name);
        const moduleManifestPath = path.join(modulePath, 'install-manifest.yaml');

        // Check if it's likely a BMAD module
        if ((await fs.pathExists(moduleManifestPath)) || (await fs.pathExists(path.join(modulePath, 'config.yaml')))) {
          result.hasLegacy = true;
          result.legacyModules.push({
            name: entry.name.slice(1), // Remove leading dot
            path: modulePath,
          });
          result.paths.push(modulePath);
        }
      }
    }

    return result;
  }

  /**
   * Check if migration from legacy is needed
   * @param {string} projectDir - Project directory
   * @returns {Object} Migration requirements
   */
  async checkMigrationNeeded(projectDir) {
    const bmadDir = path.join(projectDir, 'bmad');
    const current = await this.detect(bmadDir);
    const legacy = await this.detectLegacy(projectDir);

    return {
      needed: legacy.hasLegacy && !current.installed,
      canMigrate: legacy.hasLegacy,
      legacy: legacy,
      current: current,
    };
  }

  /**
   * Detect legacy BMAD v4 footprints (case-sensitive path checks)
   * V4 used .bmad-method as default folder name
   * V6+ uses configurable folder names and ALWAYS has _cfg/manifest.yaml with installation.version
   * @param {string} projectDir - Project directory to check
   * @returns {{ hasLegacyV4: boolean, offenders: string[] }}
   */
  async detectLegacyV4(projectDir) {
    // Helper: check existence of a nested path with case-sensitive segment matching
    const existsCaseSensitive = async (baseDir, segments) => {
      let dir = baseDir;
      for (let i = 0; i < segments.length; i++) {
        const seg = segments[i];
        let entries;
        try {
          entries = await fs.readdir(dir, { withFileTypes: true });
        } catch {
          return false;
        }
        const hit = entries.find((e) => e.name === seg);
        if (!hit) return false;
        // Parents must be directories; the last segment may be a file or directory
        if (i < segments.length - 1 && !hit.isDirectory()) return false;
        dir = path.join(dir, hit.name);
      }
      return true;
    };

    // Helper: check if a directory is a V6+ installation
    const isV6Installation = async (dirPath) => {
      const manifestPath = path.join(dirPath, '_cfg', 'manifest.yaml');
      if (!(await fs.pathExists(manifestPath))) {
        return false;
      }
      try {
        const yaml = require('js-yaml');
        const manifestContent = await fs.readFile(manifestPath, 'utf8');
        const manifest = yaml.load(manifestContent);
        // V6+ manifest has installation.version
        return manifest && manifest.installation && manifest.installation.version;
      } catch {
        return false;
      }
    };

    const offenders = [];

    // Strategy:
    // 1. First scan for ANY V6+ installation (_cfg/manifest.yaml)
    // 2. If V6+ found → don't flag anything (user is already on V6+)
    // 3. If NO V6+ found → flag folders with "bmad" in name as potential V4 legacy

    let hasV6Installation = false;
    const potentialV4Folders = [];

    try {
      const entries = await fs.readdir(projectDir, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory()) {
          const name = entry.name;
          const fullPath = path.join(projectDir, entry.name);

          // Check if directory is empty (skip empty leftover folders)
          const dirContents = await fs.readdir(fullPath);
          if (dirContents.length === 0) {
            continue; // Skip empty folders
          }

          // Check if it's a V6+ installation by looking for _cfg/manifest.yaml
          // This works for ANY folder name (not just bmad-prefixed)
          const isV6 = await isV6Installation(fullPath);

          if (isV6) {
            // Found a V6+ installation - user is already on V6+
            hasV6Installation = true;
            // Don't break - continue scanning to be thorough
          } else {
            // Not V6+, check if folder name contains "bmad" (case insensitive)
            const nameLower = name.toLowerCase();
            if (nameLower.includes('bmad')) {
              // Potential V4 legacy folder
              potentialV4Folders.push(fullPath);
            }
          }
        }
      }
    } catch {
      // Ignore errors reading directory
    }

    // Only flag V4 folders if NO V6+ installation was found
    if (!hasV6Installation && potentialV4Folders.length > 0) {
      offenders.push(...potentialV4Folders);
    }

    // Check inside various IDE command folders for legacy bmad folders
    // V4 used folders like 'bmad-method' or custom names in IDE commands
    // V6+ uses 'bmad' in IDE commands (hardcoded in IDE handlers)
    // Legacy V4 IDE command folders won't have a corresponding V6+ installation
    const ideConfigFolders = ['.opencode', '.claude', '.crush', '.continue', '.cursor', '.windsurf', '.cline', '.roo-cline'];

    for (const ideFolder of ideConfigFolders) {
      const commandsDirName = ideFolder === '.opencode' ? 'command' : 'commands';
      const commandsPath = path.join(projectDir, ideFolder, commandsDirName);
      if (await fs.pathExists(commandsPath)) {
        try {
          const commandEntries = await fs.readdir(commandsPath, { withFileTypes: true });
          for (const entry of commandEntries) {
            if (entry.isDirectory()) {
              const name = entry.name;
              // V4 used 'bmad-method' or similar in IDE commands folders
              // V6+ uses 'bmad' (hardcoded)
              // So anything that's NOT 'bmad' but starts with bmad/Bmad is likely V4
              if ((name.startsWith('bmad') || name.startsWith('Bmad') || name === 'BMad') && name !== 'bmad') {
                offenders.push(path.join(commandsPath, entry.name));
              }
            }
          }
        } catch {
          // Ignore errors reading commands directory
        }
      }
    }

    return { hasLegacyV4: offenders.length > 0, offenders };
  }
}

module.exports = { Detector };

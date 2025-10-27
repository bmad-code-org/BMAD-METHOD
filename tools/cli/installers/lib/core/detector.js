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

    const offenders = [];

    // Find all directories starting with .bmad, bmad, or Bmad
    try {
      const entries = await fs.readdir(projectDir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const name = entry.name;
          // Match .bmad*, bmad* (lowercase), or Bmad* (capital B)
          // BUT exclude 'bmad' exactly (that's the new v6 installation directory)
          if ((name.startsWith('.bmad') || name.startsWith('bmad') || name.startsWith('Bmad')) && name !== 'bmad') {
            offenders.push(path.join(projectDir, entry.name));
          }
        }
      }
    } catch {
      // Ignore errors reading directory
    }

    // Check inside various IDE command folders for legacy bmad folders
    // List of IDE config folders that might have commands directories
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
              // Find bmad-related folders (excluding exact 'bmad' if it exists)
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

const path = require('node:path');
const fs = require('fs-extra');
const yaml = require('yaml');
const prompts = require('../../../lib/prompts');
/**
 * Handler for custom content (custom.yaml)
 * Discovers custom agents and workflows in the project
 */
class CustomHandler {
  /**
   * Find all custom.yaml files in the project
   * @param {string} projectRoot - Project root directory
   * @returns {Array} List of custom content paths
   */
  async findCustomContent(projectRoot) {
    const customPaths = [];

    // Helper function to recursively scan directories
    async function scanDirectory(dir, excludePaths = []) {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);

          // Skip hidden directories and common exclusions
          if (
            entry.name.startsWith('.') ||
            entry.name === 'node_modules' ||
            entry.name === 'dist' ||
            entry.name === 'build' ||
            entry.name === '.git' ||
            entry.name === 'bmad'
          ) {
            continue;
          }

          // Skip excluded paths
          if (excludePaths.some((exclude) => fullPath.startsWith(exclude))) {
            continue;
          }

          if (entry.isDirectory()) {
            // Recursively scan subdirectories
            await scanDirectory(fullPath, excludePaths);
          } else if (entry.name === 'custom.yaml') {
            // Found a custom.yaml file
            customPaths.push(fullPath);
          } else if (
            entry.name === 'module.yaml' && // Check if this is a custom module (in root directory)
            // Skip if it's in src/modules (those are standard modules)
            !fullPath.includes(path.join('src', 'modules'))
          ) {
            customPaths.push(fullPath);
          }
        }
      } catch {
        // Ignore errors (e.g., permission denied)
      }
    }

    // Scan the entire project, but exclude source directories
    await scanDirectory(projectRoot, [path.join(projectRoot, 'src'), path.join(projectRoot, 'tools'), path.join(projectRoot, 'test')]);

    return customPaths;
  }

  /**
   * Get custom content info from a custom.yaml or module.yaml file
   * @param {string} configPath - Path to config file
   * @param {string} projectRoot - Project root directory for calculating relative paths
   * @returns {Object|null} Custom content info
   */
  async getCustomInfo(configPath, projectRoot = null) {
    try {
      const configContent = await fs.readFile(configPath, 'utf8');

      // Try to parse YAML with error handling
      let config;
      try {
        config = yaml.parse(configContent);
      } catch (parseError) {
        await prompts.log.warn('YAML parse error in ' + configPath + ': ' + parseError.message);
        return null;
      }

      // Check if this is an module.yaml (module) or custom.yaml (custom content)
      const isInstallConfig = configPath.endsWith('module.yaml');
      const configDir = path.dirname(configPath);

      // Use provided projectRoot or fall back to process.cwd()
      const basePath = projectRoot || process.cwd();
      const relativePath = path.relative(basePath, configDir);

      return {
        id: config.code || 'unknown-code',
        name: config.name,
        description: config.description || '',
        path: configDir,
        relativePath: relativePath,
        defaultSelected: config.default_selected === true,
        config: config,
        isInstallConfig: isInstallConfig, // Track which type this is
      };
    } catch (error) {
      await prompts.log.warn('Failed to read ' + configPath + ': ' + error.message);
      return null;
    }
  }
}

module.exports = { CustomHandler };

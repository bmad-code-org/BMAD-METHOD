const path = require('node:path');
const fs = require('fs-extra');
const yaml = require('yaml');
const prompts = require('../../../lib/prompts');
const { FileOps } = require('../../../lib/file-ops');
const { XmlHandler } = require('../../../lib/xml-handler');

/**
 * Handler for custom content (custom.yaml)
 * Installs custom agents and workflows without requiring a full module structure
 */
class CustomHandler {
  constructor() {
    this.fileOps = new FileOps();
    this.xmlHandler = new XmlHandler();
  }

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

  /**
   * Install custom content
   * @param {string} customPath - Path to custom content directory
   * @param {string} bmadDir - Target bmad directory
   * @param {Object} config - Configuration from custom.yaml
   * @param {Function} fileTrackingCallback - Optional callback to track installed files
   * @returns {Object} Installation result
   */
  async install(customPath, bmadDir, config, fileTrackingCallback = null) {
    const results = {
      agentsInstalled: 0,
      workflowsInstalled: 0,
      filesCopied: 0,
      preserved: 0,
      errors: [],
    };

    try {
      // Create custom directories in bmad
      const bmadCustomDir = path.join(bmadDir, 'custom');
      const bmadAgentsDir = path.join(bmadCustomDir, 'agents');
      const bmadWorkflowsDir = path.join(bmadCustomDir, 'workflows');

      await fs.ensureDir(bmadCustomDir);
      await fs.ensureDir(bmadAgentsDir);
      await fs.ensureDir(bmadWorkflowsDir);

      // Process agents - compile and copy agents
      const agentsDir = path.join(customPath, 'agents');
      if (await fs.pathExists(agentsDir)) {
        await this.compileAndCopyAgents(agentsDir, bmadAgentsDir, bmadDir, config, fileTrackingCallback, results);

        // Count agent files
        const agentFiles = await this.findFilesRecursively(agentsDir, ['.agent.yaml', '.md']);
        results.agentsInstalled = agentFiles.length;
      }

      // Process workflows - copy entire workflows directory structure
      const workflowsDir = path.join(customPath, 'workflows');
      if (await fs.pathExists(workflowsDir)) {
        await this.copyDirectory(workflowsDir, bmadWorkflowsDir, results, fileTrackingCallback, config);

        // Count workflow files
        const workflowFiles = await this.findFilesRecursively(workflowsDir, ['.md']);
        results.workflowsInstalled = workflowFiles.length;
      }

      // Process any additional files at root
      const entries = await fs.readdir(customPath, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isFile() && entry.name !== 'custom.yaml' && !entry.name.startsWith('.') && !entry.name.endsWith('.md')) {
          // Skip .md files at root as they're likely docs
          const sourcePath = path.join(customPath, entry.name);
          const targetPath = path.join(bmadCustomDir, entry.name);

          try {
            // Check if file already exists
            if (await fs.pathExists(targetPath)) {
              // File already exists, preserve it
              results.preserved = (results.preserved || 0) + 1;
            } else {
              await fs.copy(sourcePath, targetPath);
              results.filesCopied++;

              if (fileTrackingCallback) {
                fileTrackingCallback(targetPath);
              }
            }
          } catch (error) {
            results.errors.push(`Failed to copy file ${entry.name}: ${error.message}`);
          }
        }
      }
    } catch (error) {
      results.errors.push(`Installation failed: ${error.message}`);
    }

    return results;
  }

  /**
   * Find all files with specific extensions recursively
   * @param {string} dir - Directory to search
   * @param {Array} extensions - File extensions to match
   * @returns {Array} List of matching files
   */
  async findFilesRecursively(dir, extensions) {
    const files = [];

    async function search(currentDir) {
      const entries = await fs.readdir(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);

        if (entry.isDirectory()) {
          await search(fullPath);
        } else if (extensions.some((ext) => entry.name.endsWith(ext))) {
          files.push(fullPath);
        }
      }
    }

    await search(dir);
    return files;
  }

  /**
   * Recursively copy a directory
   * @param {string} sourceDir - Source directory
   * @param {string} targetDir - Target directory
   * @param {Object} results - Results object to update
   * @param {Function} fileTrackingCallback - Optional callback
   * @param {Object} config - Configuration for placeholder replacement
   */
  async copyDirectory(sourceDir, targetDir, results, fileTrackingCallback, config) {
    await fs.ensureDir(targetDir);
    const entries = await fs.readdir(sourceDir, { withFileTypes: true });

    for (const entry of entries) {
      const sourcePath = path.join(sourceDir, entry.name);
      const targetPath = path.join(targetDir, entry.name);

      if (entry.isDirectory()) {
        await this.copyDirectory(sourcePath, targetPath, results, fileTrackingCallback, config);
      } else {
        try {
          // Check if file already exists
          if (await fs.pathExists(targetPath)) {
            // File already exists, preserve it
            results.preserved = (results.preserved || 0) + 1;
          } else {
            // Copy with placeholder replacement for text files
            const textExtensions = ['.md', '.yaml', '.yml', '.txt', '.json'];
            if (textExtensions.some((ext) => entry.name.endsWith(ext))) {
              // Read source content
              let content = await fs.readFile(sourcePath, 'utf8');

              // Replace placeholders
              content = content.replaceAll('{user_name}', config.user_name || 'User');
              content = content.replaceAll('{communication_language}', config.communication_language || 'English');
              content = content.replaceAll('{output_folder}', config.output_folder || 'docs');

              // Write to target
              await fs.ensureDir(path.dirname(targetPath));
              await fs.writeFile(targetPath, content, 'utf8');
            } else {
              // Copy binary files as-is
              await fs.copy(sourcePath, targetPath);
            }

            results.filesCopied++;
            if (entry.name.endsWith('.md')) {
              results.workflowsInstalled++;
            }
            if (fileTrackingCallback) {
              fileTrackingCallback(targetPath);
            }
          }
        } catch (error) {
          results.errors.push(`Failed to copy ${entry.name}: ${error.message}`);
        }
      }
    }
  }

  /**
   * Compile .agent.yaml files to .md format and handle sidecars
   * @param {string} sourceAgentsPath - Source agents directory
   * @param {string} targetAgentsPath - Target agents directory
   * @param {string} bmadDir - BMAD installation directory
   * @param {Object} config - Configuration for placeholder replacement
   * @param {Function} fileTrackingCallback - Optional callback to track installed files
   * @param {Object} results - Results object to update
   */
  async compileAndCopyAgents(sourceAgentsPath, targetAgentsPath, bmadDir, config, fileTrackingCallback, results) {
    // Get all .agent.yaml files recursively
    const agentFiles = await this.findFilesRecursively(sourceAgentsPath, ['.agent.yaml']);

    for (const agentFile of agentFiles) {
      const relativePath = path.relative(sourceAgentsPath, agentFile).split(path.sep).join('/');
      const targetDir = path.join(targetAgentsPath, path.dirname(relativePath));

      await fs.ensureDir(targetDir);

      const agentName = path.basename(agentFile, '.agent.yaml');
      const targetMdPath = path.join(targetDir, `${agentName}.md`);
      // Use the actual bmadDir if available (for when installing to temp dir)
      const actualBmadDir = config._bmadDir || bmadDir;
      const customizePath = path.join(actualBmadDir, '_config', 'agents', `custom-${agentName}.customize.yaml`);

      // Read and compile the YAML
      try {
        const yamlContent = await fs.readFile(agentFile, 'utf8');
        const { compileAgent } = require('../../../lib/agent/compiler');

        // Create customize template if it doesn't exist
        if (!(await fs.pathExists(customizePath))) {
          const { getSourcePath } = require('../../../lib/project-root');
          const genericTemplatePath = getSourcePath('utility', 'agent-components', 'agent.customize.template.yaml');
          if (await fs.pathExists(genericTemplatePath)) {
            let templateContent = await fs.readFile(genericTemplatePath, 'utf8');
            await fs.writeFile(customizePath, templateContent, 'utf8');
            // Only show customize creation in verbose mode
            if (process.env.BMAD_VERBOSE_INSTALL === 'true') {
              await prompts.log.message('  Created customize: custom-' + agentName + '.customize.yaml');
            }
          }
        }

        // Compile the agent
        const { xml } = compileAgent(yamlContent, {}, agentName, relativePath, { config });

        // Replace placeholders in the compiled content
        let processedXml = xml;
        processedXml = processedXml.replaceAll('{user_name}', config.user_name || 'User');
        processedXml = processedXml.replaceAll('{communication_language}', config.communication_language || 'English');
        processedXml = processedXml.replaceAll('{output_folder}', config.output_folder || 'docs');

        // Write the compiled MD file
        await fs.writeFile(targetMdPath, processedXml, 'utf8');

        // Track the file
        if (fileTrackingCallback) {
          fileTrackingCallback(targetMdPath);
        }

        // Only show compilation details in verbose mode
        if (process.env.BMAD_VERBOSE_INSTALL === 'true') {
          await prompts.log.message('    Compiled agent: ' + agentName + ' -> ' + path.relative(targetAgentsPath, targetMdPath));
        }
      } catch (error) {
        await prompts.log.warn('    Failed to compile agent ' + agentName + ': ' + error.message);
        results.errors.push(`Failed to compile agent ${agentName}: ${error.message}`);
      }
    }
  }
}

module.exports = { CustomHandler };

/**
 * Post-installation sidecar folder replacement utility
 * Replaces {agent_sidecar_folder} placeholders in all installed agents
 */

const fs = require('fs-extra');
const path = require('node:path');
const yaml = require('yaml');
const glob = require('glob');
const chalk = require('chalk');

/**
 * Replace {agent_sidecar_folder} placeholders in all agent files
 * @param {string} bmadDir - Path to .bmad directory
 * @returns {Object} Statistics about replacements made
 */
async function replaceAgentSidecarFolders(bmadDir) {
  const results = {
    filesScanned: 0,
    filesReplaced: 0,
    totalReplacements: 0,
    errors: [],
  };

  try {
    // Load core config to get agent_sidecar_folder value
    const coreConfigPath = path.join(bmadDir, 'bmb', 'config.yaml');

    if (!(await fs.pathExists(coreConfigPath))) {
      throw new Error(`Core config not found at ${coreConfigPath}`);
    }

    const coreConfigContent = await fs.readFile(coreConfigPath, 'utf8');
    const coreConfig = yaml.parse(coreConfigContent);
    const agentSidecarFolder = coreConfig.agent_sidecar_folder;

    // Use the literal value from config, don't resolve the placeholders
    console.log(chalk.dim(`\n  Replacing {agent_sidecar_folder} with: ${agentSidecarFolder}`));

    // Find all agent .md files
    const agentPattern = path.join(bmadDir, '**/*.md');
    const agentFiles = glob.sync(agentPattern);

    for (const agentFile of agentFiles) {
      results.filesScanned++;

      try {
        let content = await fs.readFile(agentFile, 'utf8');

        // Check if file contains {agent_sidecar_folder}
        if (content.includes('{agent_sidecar_folder}')) {
          // Replace all occurrences
          const originalContent = content;
          content = content.replaceAll('{agent_sidecar_folder}', agentSidecarFolder);

          // Only write if content changed
          if (content !== originalContent) {
            await fs.writeFile(agentFile, content, 'utf8');

            const replacementCount = (originalContent.match(/{agent_sidecar_folder}/g) || []).length;
            results.filesReplaced++;
            results.totalReplacements += replacementCount;

            console.log(chalk.dim(`    ✓ Replaced ${replacementCount} occurrence(s) in ${path.relative(bmadDir, agentFile)}`));
          }
        }
      } catch (error) {
        results.errors.push(`Error processing ${agentFile}: ${error.message}`);
      }
    }

    return results;
  } catch (error) {
    results.errors.push(`Fatal error: ${error.message}`);
    return results;
  }
}

module.exports = { replaceAgentSidecarFolders };

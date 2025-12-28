const path = require('node:path');
const fs = require('fs-extra');
const { workflowPromptsConfig } = require('./workflow-prompts-config');

/**
 * Generate workflow prompt recommendations for IDE new chat starters
 * Uses static configuration from workflow-prompts-config.js which mirrors
 * the workflows documented in quick-start.md
 *
 * Generates two VS Code settings:
 * - chat.promptFilesRecommendations: Shows prompts as new chat starters
 * - chat.suggestedPromptFiles: Suggests next prompts after completing a workflow
 *
 * The implementation-readiness and sprint-planning workflows update
 * VS Code settings to toggle which prompts are shown based on project phase.
 */
class WorkflowPromptGenerator {
  /**
   * Get workflow prompts for selected modules
   * @param {Array<string>} selectedModules - Modules to include (e.g., ['bmm', 'bmgd'])
   * @returns {Array<Object>} Array of workflow prompt configurations
   */
  getWorkflowPrompts(selectedModules = []) {
    const allPrompts = [];

    // Always include core prompts
    if (workflowPromptsConfig.core) {
      allPrompts.push(...workflowPromptsConfig.core);
    }

    // Add prompts for each selected module
    for (const moduleName of selectedModules) {
      if (workflowPromptsConfig[moduleName]) {
        allPrompts.push(...workflowPromptsConfig[moduleName]);
      }
    }

    return allPrompts;
  }

  /**
   * Generate prompt files for an IDE
   * @param {string} promptsDir - Directory to write prompt files
   * @param {Array<string>} selectedModules - Modules to include
   * @returns {Object} Object containing recommendations and suggestedHandoffs for VS Code settings
   */
  async generatePromptFiles(promptsDir, selectedModules = []) {
    const prompts = this.getWorkflowPrompts(selectedModules);
    const recommendations = {};
    const suggestedHandoffs = {};

    // Build set of available prompt names for handoff validation
    const availablePromptNames = new Set(prompts.map((p) => p.name));

    for (const prompt of prompts) {
      const promptContent = ['---', `agent: ${prompt.agent}`, `description: "${prompt.description}"`, '---', '', prompt.prompt, ''].join(
        '\n',
      );

      const promptFilePath = path.join(promptsDir, `bmd-${prompt.name}.prompt.md`);
      await fs.writeFile(promptFilePath, promptContent);
      recommendations[`bmd-${prompt.name}`] = true;

      // Generate suggested handoffs for this prompt, filtering out invalid references
      if (prompt.handoffs && prompt.handoffs.length > 0) {
        const validHandoffs = prompt.handoffs.filter((h) => availablePromptNames.has(h));
        if (validHandoffs.length > 0) {
          suggestedHandoffs[`bmd-${prompt.name}`] = validHandoffs.map((h) => `bmd-${h}`);
        }
      }
    }

    return { recommendations, suggestedHandoffs };
  }
}

module.exports = { WorkflowPromptGenerator };

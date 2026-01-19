const path = require('node:path');
const fs = require('fs-extra');
const yaml = require('yaml');
const { workflowPromptsConfig } = require('./workflow-prompts-config');

/**
 * Generate workflow prompt recommendations for IDE new chat starters
 * Uses static configuration from workflow-prompts-config.js which mirrors
 * the workflows documented in quick-start.md
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
   * @returns {Object} Map of prompt names to true for VS Code settings
   */
  async generatePromptFiles(promptsDir, selectedModules = [], options = {}) {
    const prompts = this.getWorkflowPrompts(selectedModules);
    const pathPrompts = await this.getWorkflowPathPrompts({
      bmadDir: options.bmadDir,
      projectDir: options.projectDir,
      selectedModules,
    });
    const mergedPrompts = this.mergePrompts(prompts, pathPrompts);
    const recommendations = {};

    for (const prompt of mergedPrompts) {
      const frontmatter = ['---', `agent: ${prompt.agent}`, `description: "${prompt.description}"`];

      if (prompt.model) {
        frontmatter.push(`model: ${prompt.model}`);
      }

      const promptContent = [...frontmatter, '---', '', prompt.prompt, ''].join('\n');

      const promptFilePath = path.join(promptsDir, `bmd-${prompt.name}.prompt.md`);
      await fs.writeFile(promptFilePath, promptContent);
      recommendations[`bmd-${prompt.name}`] = true;
    }

    return recommendations;
  }

  mergePrompts(staticPrompts, dynamicPrompts) {
    const merged = [];
    const seen = new Set();

    for (const prompt of [...staticPrompts, ...dynamicPrompts]) {
      if (seen.has(prompt.name)) {
        continue;
      }
      seen.add(prompt.name);
      merged.push(prompt);
    }

    return merged;
  }

  async getWorkflowPathPrompts({ bmadDir, projectDir, selectedModules = [] }) {
    if (!bmadDir) {
      return [];
    }

    const prompts = [];
    const promptKeys = new Map();

    for (const moduleName of selectedModules) {
      const pathFilesDir = await this.resolvePathFilesDir({ moduleName, bmadDir, projectDir });
      if (!pathFilesDir) {
        continue;
      }

      let pathFiles = [];
      try {
        pathFiles = await fs.readdir(pathFilesDir);
      } catch {
        continue;
      }

      const yamlFiles = pathFiles.filter((file) => file.endsWith('.yaml') || file.endsWith('.yml'));

      for (const file of yamlFiles) {
        const filePath = path.join(pathFilesDir, file);
        let pathData;

        try {
          pathData = yaml.parse(await fs.readFile(filePath, 'utf8'));
        } catch {
          continue;
        }

        const phases = Array.isArray(pathData?.phases) ? pathData.phases : [];
        let lastAgent = null;

        for (const phase of phases) {
          const phaseName = phase?.name || '';
          const workflows = Array.isArray(phase?.workflows) ? phase.workflows : [];

          for (const workflow of workflows) {
            const agentKey = workflow?.agent || '';
            const command = workflow?.command || '';
            const workflowId = workflow?.id || '';

            if (!command && !workflowId) {
              continue;
            }

            const promptName = this.buildPromptName({ moduleName, workflowId, command });
            const prompt = this.buildPromptText({ moduleName, workflowId, command });
            const agent = this.buildAgentName({ moduleName, agentKey });
            const requiresNewChat = !!lastAgent && !!agentKey && agentKey !== lastAgent;
            const description = this.buildPromptDescription({
              workflow,
              promptName,
              requiresNewChat,
            });
            const model = this.resolveModel({ phaseName, workflow, agentKey });

            lastAgent = agentKey || lastAgent;

            const promptKey = `${moduleName}:${promptName}`;
            const existing = promptKeys.get(promptKey);

            if (!existing) {
              const promptEntry = {
                name: promptName,
                agent,
                description,
                model,
                prompt,
              };

              promptKeys.set(promptKey, promptEntry);
              prompts.push(promptEntry);
            } else if (requiresNewChat && !existing.description.includes('Ctrl+Shift+Enter')) {
              existing.description = this.appendNewChatHint(existing.description);
            }
          }
        }
      }
    }

    return prompts;
  }

  async resolvePathFilesDir({ moduleName, bmadDir, projectDir }) {
    const workflowStatusPath = path.join(bmadDir, moduleName, 'workflows', 'workflow-status', 'workflow.yaml');

    if (!(await fs.pathExists(workflowStatusPath))) {
      return null;
    }

    let workflowStatus;
    try {
      workflowStatus = yaml.parse(await fs.readFile(workflowStatusPath, 'utf8'));
    } catch {
      return null;
    }

    const pathFilesRaw = workflowStatus?.path_files;
    if (!pathFilesRaw || typeof pathFilesRaw !== 'string') {
      return null;
    }

    const workflowDir = path.dirname(workflowStatusPath).replaceAll('\\', '/');
    let resolved = pathFilesRaw.replace('{installed_path}', workflowDir);

    if (projectDir) {
      const normalizedProjectDir = projectDir.replaceAll('\\', '/');
      resolved = resolved.replace('{project-root}', normalizedProjectDir);

      const relativeBmadDir = path.relative(projectDir, bmadDir).replaceAll('\\', '/');
      if (relativeBmadDir && relativeBmadDir !== '_bmad') {
        resolved = resolved.replace('/_bmad/', `/${relativeBmadDir}/`);
      }
    }

    resolved = resolved.replaceAll('\\', '/');

    return path.resolve(resolved);
  }

  buildPromptName({ moduleName, workflowId, command }) {
    let baseName = workflowId || command || 'workflow';

    if (command && command.startsWith('/')) {
      baseName = command.split(':').pop() || baseName;
    } else if (command) {
      baseName = command;
    }

    baseName = baseName.replace(/^\/+/, '');

    return `${moduleName}-${baseName}`;
  }

  buildPromptText({ moduleName, workflowId, command }) {
    if (command) {
      if (command.startsWith('/')) {
        return command;
      }

      return `/bmad:${moduleName}:workflows:${command}`;
    }

    if (workflowId) {
      return `/bmad:${moduleName}:workflows:${workflowId}`;
    }

    return '*workflow-status';
  }

  buildAgentName({ moduleName, agentKey }) {
    if (!agentKey) {
      return `bmd-custom-${moduleName}-pm`;
    }

    return `bmd-custom-${moduleName}-${agentKey}`;
  }

  buildPromptDescription({ workflow, promptName, requiresNewChat }) {
    const title = this.toTitle(promptName.replace(/^[^-]+-/, ''));
    const detail = workflow?.note || workflow?.output || workflow?.description || '';
    const baseDescription = detail ? `${title} — ${detail}` : title;

    return requiresNewChat ? this.appendNewChatHint(baseDescription) : baseDescription;
  }

  appendNewChatHint(description) {
    return `${description} (open a new chat with Ctrl+Shift+Enter)`;
  }

  resolveModel({ phaseName, workflow, agentKey }) {
    const phase = (phaseName || '').toLowerCase();
    const id = (workflow?.id || '').toLowerCase();
    const command = (workflow?.command || '').toLowerCase();
    const agent = (agentKey || '').toLowerCase();

    if (id.includes('code-review') || command.includes('code-review') || agent.endsWith('dev') || agent.includes('game-dev')) {
      return 'gpt-5.2-codex';
    }

    if (id.includes('dev-story') || command.includes('dev-story') || id.includes('implement') || command.includes('implement')) {
      return 'gpt-5.2-codex';
    }

    if (id.includes('sprint-planning') || command.includes('sprint-planning')) {
      return 'claude-opus-4.5';
    }

    if (
      phase.includes('analysis') ||
      phase.includes('planning') ||
      phase.includes('solution') ||
      phase.includes('design') ||
      phase.includes('technical') ||
      phase.includes('pre-production')
    ) {
      return 'claude-opus-4.5';
    }

    return 'gpt-5.2';
  }

  toTitle(value) {
    return value.replaceAll(/[-_]/g, ' ').replaceAll(/\b\w/g, (match) => match.toUpperCase());
  }
}

module.exports = { WorkflowPromptGenerator };

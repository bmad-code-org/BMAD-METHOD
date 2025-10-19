const path = require('node:path');
const fs = require('fs-extra');
const cjson = require('comment-json');
const chalk = require('chalk');
const inquirer = require('inquirer');
const yaml = require('js-yaml');
const { BaseIdeSetup } = require('./_base-ide');
const { getAgentsFromBmad, getTasksFromBmad } = require('./shared/bmad-artifacts');

/**
 * OpenCode IDE Setup
 *
 * OpenCode integrates with BMAD via a project-level opencode.json or opencode.jsonc file.
 * Unlike other IDEs that copy files, OpenCode uses file references: {file:./.bmad-core/agents/<id>.md}
 *
 * Features:
 * - Detects existing opencode.json/opencode.jsonc or creates minimal config
 * - Idempotent merges - safe to run multiple times
 * - Optional agent/command prefixes to avoid collisions
 * - Generates AGENTS.md for system prompt memory
 * - Supports expansion packs
 */
class OpenCodeSetup extends BaseIdeSetup {
  constructor() {
    super('opencode', 'OpenCode', false); // Set to true if should be "preferred"
  }

  /**
   * Collect configuration preferences before setup
   */
  async collectConfiguration(options = {}) {
    console.log(chalk.cyan('\n⚙️  OpenCode Configuration'));
    console.log(
      chalk.dim(
        'OpenCode will include agents and tasks from the packages you selected.\n' +
          'Choose optional key prefixes to avoid collisions.\n',
      ),
    );

    const response = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'useAgentPrefix',
        message: "Prefix agent keys with 'bmad-'? (e.g., 'bmad-dev' instead of 'dev')",
        default: true,
      },
      {
        type: 'confirm',
        name: 'useCommandPrefix',
        message: "Prefix command keys with 'bmad:tasks:'? (e.g., 'bmad:tasks:create-doc')",
        default: true,
      },
    ]);

    return {
      useAgentPrefix: response.useAgentPrefix,
      useCommandPrefix: response.useCommandPrefix,
    };
  }

  /**
   * Main setup method - creates/updates OpenCode configuration
   */
  async setup(projectDir, bmadDir, options = {}) {
    console.log(chalk.cyan(`\nSetting up ${this.displayName}...`));

    const selectedModules = options.selectedModules || [];
    const config = options.preCollectedConfig || {};
    const useAgentPrefix = config.useAgentPrefix ?? true;
    const useCommandPrefix = config.useCommandPrefix ?? true;

    // Check for existing config files
    const jsonPath = path.join(projectDir, 'opencode.json');
    const jsoncPath = path.join(projectDir, 'opencode.jsonc');
    const hasJson = await this.pathExists(jsonPath);
    const hasJsonc = await this.pathExists(jsoncPath);

    let configObj;
    let targetPath;
    let isNewConfig = false;

    if (hasJson || hasJsonc) {
      // Update existing config
      targetPath = hasJsonc ? jsoncPath : jsonPath;
      console.log(chalk.dim(`  Found existing: ${path.basename(targetPath)}`));

      const raw = await fs.readFile(targetPath, 'utf8');
      configObj = cjson.parse(raw, undefined, true);
    } else {
      // Create new minimal config
      targetPath = jsoncPath;
      isNewConfig = true;
      configObj = {
        $schema: 'https://opencode.ai/config.json',
        instructions: [],
        agent: {},
        command: {},
      };
    }

    // Ensure instructions array includes BMAD core config
    await this.ensureInstructions(configObj, projectDir, bmadDir, selectedModules);

    // Merge agents and commands
    const summary = await this.mergeBmadAgentsAndCommands(
      configObj,
      projectDir,
      bmadDir,
      selectedModules,
      useAgentPrefix,
      useCommandPrefix,
    );

    // Write updated config
    const output = cjson.stringify(configObj, null, 2);
    await fs.writeFile(targetPath, output + (output.endsWith('\n') ? '' : '\n'));

    console.log(
      chalk.green(
        isNewConfig
          ? `✓ Created ${path.basename(targetPath)} with BMAD configuration`
          : `✓ Updated ${path.basename(targetPath)} with BMAD configuration`,
      ),
    );
    console.log(
      chalk.dim(
        `  Agents: +${summary.agentsAdded} ~${summary.agentsUpdated} ⨯${summary.agentsSkipped} | ` +
          `Commands: +${summary.commandsAdded} ~${summary.commandsUpdated} ⨯${summary.commandsSkipped}`,
      ),
    );

    // Generate/update AGENTS.md
    await this.generateAgentsMd(projectDir, bmadDir, selectedModules);

    return {
      success: true,
      config: path.basename(targetPath),
      agents: summary.agentsAdded + summary.agentsUpdated,
      commands: summary.commandsAdded + summary.commandsUpdated,
    };
  }

  /**
   * Ensure instructions array includes BMAD config files
   */
  async ensureInstructions(configObj, projectDir, bmadDir, selectedModules) {
    if (!configObj.instructions) configObj.instructions = [];
    if (!Array.isArray(configObj.instructions)) {
      configObj.instructions = [configObj.instructions];
    }

    // Helper to add instruction if not present
    const ensureInstruction = (instrPath) => {
      // Normalize: remove './' prefix if present
      const normalized = instrPath.startsWith('./') ? instrPath.slice(2) : instrPath;
      const withDot = `./${normalized}`;

      // Replace any './path' with 'path' for consistency
      configObj.instructions = configObj.instructions.map((it) =>
        typeof it === 'string' && it === withDot ? normalized : it,
      );

      // Add if not present
      if (!configObj.instructions.some((it) => typeof it === 'string' && it === normalized)) {
        configObj.instructions.push(normalized);
      }
    };

    // Add core config
    const coreConfigRel = path.relative(projectDir, path.join(bmadDir, 'core-config.yaml'));
    ensureInstruction(coreConfigRel.replace(/\\/g, '/'));

    // Add expansion pack configs
    for (const module of selectedModules) {
      const moduleConfigPath = path.join(bmadDir, 'modules', module, 'config.yaml');
      if (await this.pathExists(moduleConfigPath)) {
        const relPath = path.relative(projectDir, moduleConfigPath).replace(/\\/g, '/');
        ensureInstruction(relPath);
      }
    }
  }

  /**
   * Merge BMAD agents and commands into OpenCode config
   */
  async mergeBmadAgentsAndCommands(
    configObj,
    projectDir,
    bmadDir,
    selectedModules,
    useAgentPrefix,
    useCommandPrefix,
  ) {
    // Ensure objects exist
    if (!configObj.agent || typeof configObj.agent !== 'object') configObj.agent = {};
    if (!configObj.command || typeof configObj.command !== 'object') configObj.command = {};

    const summary = {
      agentsAdded: 0,
      agentsUpdated: 0,
      agentsSkipped: 0,
      commandsAdded: 0,
      commandsUpdated: 0,
      commandsSkipped: 0,
    };

    // Get agents and tasks
    const agents = await getAgentsFromBmad(bmadDir, selectedModules);
    const tasks = await getTasksFromBmad(bmadDir, selectedModules);

    // Process agents
    for (const agent of agents) {
      const relPath = path.relative(projectDir, agent.path).replace(/\\/g, '/');
      const fileRef = `{file:./${relPath}}`;

      // Determine key with optional prefix
      let key = agent.name;
      if (agent.module !== 'core') {
        // Force prefix for expansion pack agents
        key = `bmad-${agent.module}-${agent.name}`;
      } else if (useAgentPrefix) {
        key = `bmad-${agent.name}`;
      }

      // Extract metadata
      const whenToUse = await this.extractWhenToUse(agent.path);

      // Build agent definition
      const agentDef = {
        prompt: fileRef,
        mode: this.isOrchestratorAgent(agent.name) ? 'primary' : 'all',
        tools: { write: true, edit: true, bash: true },
        ...(whenToUse ? { description: whenToUse } : {}),
      };

      // Add or update
      const existing = configObj.agent[key];
      if (!existing) {
        configObj.agent[key] = agentDef;
        summary.agentsAdded++;
      } else if (this.isBmadManaged(existing, relPath)) {
        Object.assign(existing, agentDef);
        summary.agentsUpdated++;
      } else {
        summary.agentsSkipped++;
        console.log(
          chalk.yellow(
            `  ⚠ Skipped agent '${key}' (existing entry not BMAD-managed).\n` +
              `    Tip: Enable agent prefixes to avoid collisions.`,
          ),
        );
      }
    }

    // Process commands
    for (const task of tasks) {
      const relPath = path.relative(projectDir, task.path).replace(/\\/g, '/');
      const fileRef = `{file:./${relPath}}`;

      // Determine key with optional prefix
      let key = task.name;
      if (task.module !== 'core') {
        // Force prefix for expansion pack tasks
        key = `bmad:${task.module}:${task.name}`;
      } else if (useCommandPrefix) {
        key = `bmad:tasks:${task.name}`;
      }

      // Extract metadata
      const purpose = await this.extractTaskPurpose(task.path);

      // Build command definition
      const cmdDef = {
        template: fileRef,
        ...(purpose ? { description: purpose } : {}),
      };

      // Add or update
      const existing = configObj.command[key];
      if (!existing) {
        configObj.command[key] = cmdDef;
        summary.commandsAdded++;
      } else if (this.isBmadManaged(existing, relPath)) {
        Object.assign(existing, cmdDef);
        summary.commandsUpdated++;
      } else {
        summary.commandsSkipped++;
        console.log(
          chalk.yellow(
            `  ⚠ Skipped command '${key}' (existing entry not BMAD-managed).\n` +
              `    Tip: Enable command prefixes to avoid collisions.`,
          ),
        );
      }
    }

    return summary;
  }

  /**
   * Generate AGENTS.md file for OpenCode system prompt
   */
  async generateAgentsMd(projectDir, bmadDir, selectedModules) {
    const filePath = path.join(projectDir, 'AGENTS.md');
    const startMarker = '<!-- BEGIN: BMAD-AGENTS-OPENCODE -->';
    const endMarker = '<!-- END: BMAD-AGENTS-OPENCODE -->';

    const agents = await getAgentsFromBmad(bmadDir, selectedModules);
    const tasks = await getTasksFromBmad(bmadDir, selectedModules);

    let section = '';
    section += `${startMarker}\n`;
    section += `# BMAD-METHOD Agents and Tasks (OpenCode)\n\n`;
    section +=
      `OpenCode reads AGENTS.md during initialization as part of its system prompt. ` +
      `This section is auto-generated by BMAD-METHOD.\n\n`;
    section += `## How To Use With OpenCode\n\n`;
    section += `- Run \`opencode\` in this project directory\n`;
    section += `- OpenCode will read your \`opencode.json\` or \`opencode.jsonc\` configuration\n`;
    section += `- Reference agents by their ID in your prompts (e.g., "As dev, implement...")\n`;
    section += `- Update this section after changes: \`npx bmad install -i opencode\`\n\n`;

    section += `## Agents\n\n`;
    section += `| Title | ID | When To Use |\n|---|---|---|\n`;

    for (const agent of agents) {
      const title = this.formatTitle(agent.name);
      const whenToUse = (await this.extractWhenToUse(agent.path)) || '—';
      section += `| ${title} | ${agent.name} | ${whenToUse} |\n`;
    }
    section += `\n`;

    if (tasks.length > 0) {
      section += `## Tasks\n\n`;
      section += `Available task templates that can be invoked via OpenCode commands:\n\n`;
      for (const task of tasks) {
        const title = this.formatTitle(task.name);
        const relPath = path.relative(projectDir, task.path).replace(/\\/g, '/');
        section += `- **${title}** (\`${task.name}\`) - [${relPath}](${relPath})\n`;
      }
      section += `\n`;
    }

    section += `${endMarker}\n`;

    // Update or create AGENTS.md
    let finalContent = '';
    if (await this.pathExists(filePath)) {
      const existing = await fs.readFile(filePath, 'utf8');
      if (existing.includes(startMarker) && existing.includes(endMarker)) {
        const pattern = String.raw`${startMarker}[\s\S]*?${endMarker}`;
        finalContent = existing.replace(new RegExp(pattern, 'm'), section);
      } else {
        finalContent = existing.trimEnd() + `\n\n` + section;
      }
    } else {
      finalContent = `# Project Agents\n\n`;
      finalContent += `This file provides guidance and memory for OpenCode.\n\n`;
      finalContent += section;
    }

    await fs.writeFile(filePath, finalContent);
    console.log(chalk.green(`✓ Created/updated AGENTS.md`));
    console.log(
      chalk.dim(
        `  OpenCode reads AGENTS.md on startup. Run \`opencode\` to use BMAD agents.`,
      ),
    );
  }

  /**
   * Check if existing entry is BMAD-managed (by checking if file reference matches)
   */
  isBmadManaged(entry, relativePath) {
    if (entry.prompt && typeof entry.prompt === 'string') {
      return entry.prompt.includes(relativePath);
    }
    if (entry.template && typeof entry.template === 'string') {
      return entry.template.includes(relativePath);
    }
    return false;
  }

  /**
   * Check if agent is an orchestrator (should run in 'primary' mode)
   */
  isOrchestratorAgent(name) {
    return /(^|-)orchestrator$/i.test(name);
  }

  /**
   * Extract whenToUse metadata from agent YAML block
   */
  async extractWhenToUse(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const yamlMatch = content.match(/```ya?ml\r?\n([\s\S]*?)```/);
      if (!yamlMatch) return null;

      const yamlBlock = yamlMatch[1].trim();

      // Try to parse as YAML
      try {
        const data = yaml.load(yamlBlock);
        if (data && typeof data.whenToUse === 'string') {
          return data.whenToUse.trim();
        }
      } catch {
        // Fall through to regex
      }

      // Fallback: regex extraction
      const quoted = yamlBlock.match(/whenToUse:\s*"([^"]+)"/i);
      if (quoted) return quoted[1].trim();

      const unquoted = yamlBlock.match(/whenToUse:\s*([^\n\r]+)/i);
      if (unquoted) return unquoted[1].trim();
    } catch {
      // Ignore errors
    }
    return null;
  }

  /**
   * Extract Purpose from task file
   */
  async extractTaskPurpose(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf8');

      // Try YAML block first
      const yamlMatch = content.match(/```ya?ml\r?\n([\s\S]*?)```/);
      if (yamlMatch) {
        try {
          const data = yaml.load(yamlMatch[1]);
          if (data) {
            const purpose = data.Purpose || data.purpose;
            if (purpose && typeof purpose === 'string') {
              return this.cleanupDescription(purpose);
            }
          }
        } catch {
          // Fall through
        }
      }

      // Try markdown heading
      const headingMatch = content.match(/^#{2,6}\s*Purpose\s*$/im);
      if (headingMatch) {
        const start = headingMatch.index + headingMatch[0].length;
        const rest = content.slice(start);
        const nextHeading = rest.match(/^#{1,6}\s+/m);
        const section = nextHeading ? rest.slice(0, nextHeading.index) : rest;
        return this.cleanupDescription(section);
      }

      // Try inline
      const inline = content.match(/(?:^|\n)\s*Purpose\s*:\s*([^\n\r]+)/i);
      if (inline) {
        return this.cleanupDescription(inline[1]);
      }
    } catch {
      // Ignore errors
    }
    return null;
  }

  /**
   * Clean up and summarize description text
   */
  cleanupDescription(text) {
    if (!text) return null;
    let cleaned = String(text);

    // Remove code fences and HTML comments
    cleaned = cleaned.replace(/```[\s\S]*?```/g, '');
    cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, '');

    // Normalize whitespace
    cleaned = cleaned.replace(/\r\n?/g, '\n');

    // Take first paragraph
    const paragraphs = cleaned.split(/\n\s*\n/).map((p) => p.trim());
    let first = paragraphs.find((p) => p.length > 0) || '';

    // Remove markdown formatting
    first = first.replace(/^[>*-]\s+/gm, '');
    first = first.replace(/^#{1,6}\s+/gm, '');
    first = first.replace(/\*\*([^*]+)\*\*/g, '$1');
    first = first.replace(/\*([^*]+)\*/g, '$1');
    first = first.replace(/`([^`]+)`/g, '$1');
    first = first.replace(/\s+/g, ' ').trim();

    if (!first) return null;

    // Truncate at sentence boundary if too long
    const maxLen = 320;
    if (first.length > maxLen) {
      const boundary = first.slice(0, maxLen + 40).match(/^[\s\S]*?[.!?](\s|$)/);
      return boundary ? boundary[0].trim() : first.slice(0, maxLen).trim();
    }

    return first;
  }

  /**
   * Detect if OpenCode is already configured in project
   */
  async detect(projectDir) {
    const jsonPath = path.join(projectDir, 'opencode.json');
    const jsoncPath = path.join(projectDir, 'opencode.jsonc');
    return (await this.pathExists(jsonPath)) || (await this.pathExists(jsoncPath));
  }

  /**
   * Remove BMAD configuration from OpenCode
   */
  async cleanup(projectDir) {
    console.log(chalk.cyan(`\nCleaning up ${this.displayName} configuration...`));

    const jsonPath = path.join(projectDir, 'opencode.json');
    const jsoncPath = path.join(projectDir, 'opencode.jsonc');
    const agentsMdPath = path.join(projectDir, 'AGENTS.md');

    // Remove BMAD entries from config file
    let cleaned = false;
    for (const configPath of [jsonPath, jsoncPath]) {
      if (await this.pathExists(configPath)) {
        try {
          const raw = await fs.readFile(configPath, 'utf8');
          const configObj = cjson.parse(raw, undefined, true);

          // Remove BMAD-prefixed agents
          if (configObj.agent) {
            for (const key of Object.keys(configObj.agent)) {
              if (key.startsWith('bmad-') || key.startsWith('bmad:')) {
                delete configObj.agent[key];
                cleaned = true;
              }
            }
          }

          // Remove BMAD-prefixed commands
          if (configObj.command) {
            for (const key of Object.keys(configObj.command)) {
              if (key.startsWith('bmad:')) {
                delete configObj.command[key];
                cleaned = true;
              }
            }
          }

          // Remove BMAD instructions
          if (configObj.instructions && Array.isArray(configObj.instructions)) {
            const originalLength = configObj.instructions.length;
            configObj.instructions = configObj.instructions.filter(
              (instr) =>
                typeof instr !== 'string' ||
                (!instr.includes('bmad') && !instr.includes('.bmad-core')),
            );
            if (configObj.instructions.length !== originalLength) cleaned = true;
          }

          if (cleaned) {
            const output = cjson.stringify(configObj, null, 2);
            await fs.writeFile(configPath, output + '\n');
          }
        } catch (error) {
          console.log(chalk.yellow(`  ⚠ Could not clean ${path.basename(configPath)}`));
        }
      }
    }

    // Remove BMAD section from AGENTS.md
    if (await this.pathExists(agentsMdPath)) {
      try {
        let content = await fs.readFile(agentsMdPath, 'utf8');
        const startMarker = '<!-- BEGIN: BMAD-AGENTS-OPENCODE -->';
        const endMarker = '<!-- END: BMAD-AGENTS-OPENCODE -->';

        if (content.includes(startMarker) && content.includes(endMarker)) {
          const pattern = String.raw`${startMarker}[\s\S]*?${endMarker}\n*`;
          content = content.replace(new RegExp(pattern, 'm'), '');
          await fs.writeFile(agentsMdPath, content);
          cleaned = true;
        }
      } catch (error) {
        console.log(chalk.yellow(`  ⚠ Could not clean AGENTS.md`));
      }
    }

    if (cleaned) {
      console.log(chalk.green(`✓ Removed BMAD configuration from ${this.displayName}`));
    } else {
      console.log(chalk.dim(`  No BMAD configuration found to remove`));
    }

    return { success: true };
  }
}

module.exports = { OpenCodeSetup };

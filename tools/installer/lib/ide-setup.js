const path = require('node:path');
const fs = require('fs-extra');
const yaml = require('js-yaml');
const chalk = require('chalk');
const inquirer = require('inquirer');
const cjson = require('comment-json');
const fileManager = require('./file-manager');
const configLoader = require('./config-loader');
const { extractYamlFromAgent } = require('../../lib/yaml-utils');
const BaseIdeSetup = require('./ide-base-setup');
const resourceLocator = require('./resource-locator');

class IdeSetup extends BaseIdeSetup {
  constructor() {
    super();
    this.ideAgentConfig = null;
  }

  async loadIdeAgentConfig() {
    if (this.ideAgentConfig) return this.ideAgentConfig;

    try {
      const configPath = path.join(__dirname, '..', 'config', 'ide-agent-config.yaml');
      const configContent = await fs.readFile(configPath, 'utf8');
      this.ideAgentConfig = yaml.load(configContent);
      return this.ideAgentConfig;
    } catch {
      console.warn('Failed to load IDE agent configuration, using defaults');
      return {
        'roo-permissions': {},
        'cline-order': {},
      };
    }
  }

  async setup(ide, installDir, selectedAgent = null, spinner = null, preConfiguredSettings = null) {
    const ideConfig = await configLoader.getIdeConfiguration(ide);

    if (!ideConfig) {
      console.log(chalk.yellow(`\nNo configuration available for ${ide}`));
      return false;
    }

    switch (ide) {
      case 'cursor': {
        return this.setupCursor(installDir, selectedAgent);
      }
      case 'opencode': {
        return this.setupOpenCode(installDir, selectedAgent, spinner, preConfiguredSettings);
      }
      case 'claude-code': {
        return this.setupClaudeCode(installDir, selectedAgent);
      }
      case 'iflow-cli': {
        return this.setupIFlowCli(installDir, selectedAgent);
      }
      case 'crush': {
        return this.setupCrush(installDir, selectedAgent);
      }
      case 'windsurf': {
        return this.setupWindsurf(installDir, selectedAgent);
      }
      case 'trae': {
        return this.setupTrae(installDir, selectedAgent);
      }
      case 'roo': {
        return this.setupRoo(installDir, selectedAgent);
      }
      case 'cline': {
        return this.setupCline(installDir, selectedAgent);
      }
      case 'kilo': {
        return this.setupKilocode(installDir, selectedAgent);
      }
      case 'gemini': {
        return this.setupGeminiCli(installDir, selectedAgent);
      }
      case 'github-copilot': {
        return this.setupGitHubCopilot(installDir, selectedAgent, spinner, preConfiguredSettings);
      }
      case 'qwen-code': {
        return this.setupQwenCode(installDir, selectedAgent);
      }
      case 'auggie-cli': {
        return this.setupAuggieCLI(installDir, selectedAgent, spinner, preConfiguredSettings);
      }
      case 'codex': {
        return this.setupCodex(installDir, selectedAgent, { webEnabled: false });
      }
      case 'codex-web': {
        return this.setupCodex(installDir, selectedAgent, { webEnabled: true });
      }
      default: {
        console.log(chalk.yellow(`\nIDE ${ide} not yet supported`));
        return false;
      }
    }
  }

  async setupOpenCode(installDir, selectedAgent, spinner = null, preConfiguredSettings = null) {
    // Minimal JSON-only integration per plan:
    // - If opencode.json or opencode.jsonc exists: only ensure instructions include .bmad-core/core-config.yaml
    // - If none exists: create minimal opencode.jsonc with $schema and instructions array including that file

    const jsonPath = path.join(installDir, 'opencode.json');
    const jsoncPath = path.join(installDir, 'opencode.jsonc');
    const hasJson = await fileManager.pathExists(jsonPath);
    const hasJsonc = await fileManager.pathExists(jsoncPath);

    // Determine key prefix preferences (with sensible defaults)
    // Defaults: non-prefixed (agents = "dev", commands = "create-doc")
    let useAgentPrefix = false;
    let useCommandPrefix = false;

    // Allow pre-configuration (if passed) to skip prompts
    const pre = preConfiguredSettings && preConfiguredSettings.opencode;
    if (pre && typeof pre.useAgentPrefix === 'boolean') useAgentPrefix = pre.useAgentPrefix;
    if (pre && typeof pre.useCommandPrefix === 'boolean') useCommandPrefix = pre.useCommandPrefix;

    // If no pre-config and in interactive mode, prompt the user
    if (!pre) {
      // Pause spinner during prompts if active
      let spinnerWasActive = false;
      if (spinner && spinner.isSpinning) {
        spinner.stop();
        spinnerWasActive = true;
      }

      try {
        const resp = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'useAgentPrefix',
            message:
              "Prefix agent keys with 'bmad-'? (Recommended to avoid collisions, e.g., 'bmad-dev')",
            default: true,
          },
          {
            type: 'confirm',
            name: 'useCommandPrefix',
            message:
              "Prefix command keys with 'bmad:tasks:'? (Recommended, e.g., 'bmad:tasks:create-doc')",
            default: true,
          },
        ]);
        useAgentPrefix = resp.useAgentPrefix;
        useCommandPrefix = resp.useCommandPrefix;
      } catch {
        // Keep defaults if prompt fails or is not interactive
      } finally {
        if (spinner && spinnerWasActive) spinner.start();
      }
    }

    const ensureInstructionRef = (obj) => {
      const preferred = '.bmad-core/core-config.yaml';
      const alt = './.bmad-core/core-config.yaml';
      if (!obj.instructions) obj.instructions = [];
      if (!Array.isArray(obj.instructions)) obj.instructions = [obj.instructions];
      // Normalize alternative form (with './') to preferred without './'
      obj.instructions = obj.instructions.map((it) =>
        typeof it === 'string' && it === alt ? preferred : it,
      );
      const hasPreferred = obj.instructions.some(
        (it) => typeof it === 'string' && it === preferred,
      );
      if (!hasPreferred) obj.instructions.push(preferred);
      return obj;
    };

    const mergeBmadAgentsAndCommands = async (configObj) => {
      // Ensure objects exist
      if (!configObj.agent || typeof configObj.agent !== 'object') configObj.agent = {};
      if (!configObj.command || typeof configObj.command !== 'object') configObj.command = {};
      if (!configObj.instructions) configObj.instructions = [];
      if (!Array.isArray(configObj.instructions)) configObj.instructions = [configObj.instructions];

      // Track a concise summary of changes
      const summary = {
        target: null,
        created: false,
        agentsAdded: 0,
        agentsUpdated: 0,
        agentsSkipped: 0,
        commandsAdded: 0,
        commandsUpdated: 0,
        commandsSkipped: 0,
      };

      // Determine package scope: previously SELECTED packages in installer UI
      const selectedPackages = preConfiguredSettings?.selectedPackages || {
        includeCore: true,
        packs: [],
      };

      // Helper: ensure an instruction path is present without './' prefix, de-duplicating './' variants
      const ensureInstructionPath = (pathNoDot) => {
        const withDot = `./${pathNoDot}`;
        // Normalize any existing './' variant to non './'
        configObj.instructions = configObj.instructions.map((it) =>
          typeof it === 'string' && it === withDot ? pathNoDot : it,
        );
        const has = configObj.instructions.some((it) => typeof it === 'string' && it === pathNoDot);
        if (!has) configObj.instructions.push(pathNoDot);
      };

      // Helper: detect orchestrator agents to set as primary mode
      const isOrchestratorAgent = (agentId) => /(^|-)orchestrator$/i.test(agentId);

      // Helper: extract whenToUse string from an agent markdown file
      const extractWhenToUseFromFile = async (absPath) => {
        try {
          const raw = await fileManager.readFile(absPath);
          const yamlMatch = raw.match(/```ya?ml\r?\n([\s\S]*?)```/);
          const yamlBlock = yamlMatch ? yamlMatch[1].trim() : null;
          if (!yamlBlock) return null;
          // Try quoted first, then unquoted
          const quoted = yamlBlock.match(/whenToUse:\s*"([^"]+)"/i);
          if (quoted && quoted[1]) return quoted[1].trim();
          const unquoted = yamlBlock.match(/whenToUse:\s*([^\n\r]+)/i);
          if (unquoted && unquoted[1]) return unquoted[1].trim();
        } catch {
          // ignore
        }
        return null;
      };

      // Helper: extract Purpose string from a task file (YAML fenced block, Markdown heading, or inline 'Purpose:')
      const extractTaskPurposeFromFile = async (absPath) => {
        const cleanupAndSummarize = (text) => {
          if (!text) return null;
          let t = String(text);
          // Drop code fences and HTML comments
          t = t.replaceAll(/```[\s\S]*?```/g, '');
          t = t.replaceAll(/<!--([\s\S]*?)-->/g, '');
          // Normalize line endings
          t = t.replaceAll(/\r\n?/g, '\n');
          // Take the first non-empty paragraph
          const paragraphs = t.split(/\n\s*\n/g).map((p) => p.trim());
          let first = paragraphs.find((p) => p.length > 0) || '';
          // Remove leading list markers, quotes, and headings remnants
          first = first.replaceAll(/^\s*[>*-]\s+/gm, '');
          first = first.replaceAll(/^#{1,6}\s+/gm, '');
          // Strip simple Markdown formatting
          first = first.replaceAll(/\*\*([^*]+)\*\*/g, '$1').replaceAll(/\*([^*]+)\*/g, '$1');
          first = first.replaceAll(/`([^`]+)`/g, '$1');
          // Collapse whitespace
          first = first.replaceAll(/\s+/g, ' ').trim();
          if (!first) return null;
          // Prefer ending at a sentence boundary if long
          const maxLen = 320;
          if (first.length > maxLen) {
            const boundary = first.slice(0, maxLen + 40).match(/^[\s\S]*?[.!?](\s|$)/);
            const cut = boundary ? boundary[0] : first.slice(0, maxLen);
            return cut.trim();
          }
          return first;
        };

        try {
          const raw = await fileManager.readFile(absPath);
          // 1) YAML fenced block: look for Purpose fields
          const yamlMatch = raw.match(/```ya?ml\r?\n([\s\S]*?)```/);
          const yamlBlock = yamlMatch ? yamlMatch[1].trim() : null;
          if (yamlBlock) {
            try {
              const data = yaml.load(yamlBlock);
              if (data) {
                let val = data.Purpose ?? data.purpose;
                if (!val && data.task && (data.task.Purpose || data.task.purpose)) {
                  val = data.task.Purpose ?? data.task.purpose;
                }
                if (typeof val === 'string') {
                  const cleaned = cleanupAndSummarize(val);
                  if (cleaned) return cleaned;
                }
              }
            } catch {
              // ignore YAML parse errors
            }
            // Fallback regex inside YAML block
            const quoted = yamlBlock.match(/(?:^|\n)\s*(?:Purpose|purpose):\s*"([^"]+)"/);
            if (quoted && quoted[1]) {
              const cleaned = cleanupAndSummarize(quoted[1]);
              if (cleaned) return cleaned;
            }
            const unquoted = yamlBlock.match(/(?:^|\n)\s*(?:Purpose|purpose):\s*([^\n\r]+)/);
            if (unquoted && unquoted[1]) {
              const cleaned = cleanupAndSummarize(unquoted[1]);
              if (cleaned) return cleaned;
            }
          }

          // 2) Markdown heading section: ## Purpose (any level >= 2)
          const headingRe = /^(#{2,6})\s*Purpose\s*$/im;
          const headingMatch = headingRe.exec(raw);
          if (headingMatch) {
            const headingLevel = headingMatch[1].length;
            const sectionStart = headingMatch.index + headingMatch[0].length;
            const rest = raw.slice(sectionStart);
            // Next heading of same or higher level ends the section
            const nextHeadingRe = new RegExp(`^#{1,${headingLevel}}\\s+[^\n]+`, 'im');
            const nextMatch = nextHeadingRe.exec(rest);
            const section = nextMatch ? rest.slice(0, nextMatch.index) : rest;
            const cleaned = cleanupAndSummarize(section);
            if (cleaned) return cleaned;
          }

          // 3) Inline single-line fallback: Purpose: ...
          const inline = raw.match(/(?:^|\n)\s*Purpose\s*:\s*([^\n\r]+)/i);
          if (inline && inline[1]) {
            const cleaned = cleanupAndSummarize(inline[1]);
            if (cleaned) return cleaned;
          }
        } catch {
          // ignore
        }
        return null;
      };

      // Build core sets
      const coreAgentIds = new Set();
      const coreTaskIds = new Set();
      if (selectedPackages.includeCore) {
        for (const id of await this.getCoreAgentIds(installDir)) coreAgentIds.add(id);
        for (const id of await this.getCoreTaskIds(installDir)) coreTaskIds.add(id);
      }

      // Build packs info: { packId, packPath, packKey, agents:Set, tasks:Set }
      const packsInfo = [];
      if (Array.isArray(selectedPackages.packs)) {
        for (const packId of selectedPackages.packs) {
          const dotPackPath = path.join(installDir, `.${packId}`);
          const altPackPath = path.join(installDir, 'expansion-packs', packId);
          const packPath = (await fileManager.pathExists(dotPackPath))
            ? dotPackPath
            : (await fileManager.pathExists(altPackPath))
              ? altPackPath
              : null;
          if (!packPath) continue;

          // Ensure pack config.yaml is added to instructions (relative path, no './')
          const packConfigAbs = path.join(packPath, 'config.yaml');
          if (await fileManager.pathExists(packConfigAbs)) {
            const relCfg = path.relative(installDir, packConfigAbs).replaceAll('\\', '/');
            ensureInstructionPath(relCfg);
          }

          const packKey = packId.replace(/^bmad-/, '').replaceAll('/', '-');
          const info = { packId, packPath, packKey, agents: new Set(), tasks: new Set() };

          const glob = require('glob');
          const agentsDir = path.join(packPath, 'agents');
          if (await fileManager.pathExists(agentsDir)) {
            const files = glob.sync('*.md', { cwd: agentsDir });
            for (const f of files) info.agents.add(path.basename(f, '.md'));
          }
          const tasksDir = path.join(packPath, 'tasks');
          if (await fileManager.pathExists(tasksDir)) {
            const files = glob.sync('*.md', { cwd: tasksDir });
            for (const f of files) info.tasks.add(path.basename(f, '.md'));
          }
          packsInfo.push(info);
        }
      }

      // Generate agents - core first (respect optional agent prefix)
      for (const agentId of coreAgentIds) {
        const p = await this.findAgentPath(agentId, installDir); // prefers core
        if (!p) continue;
        const rel = path.relative(installDir, p).replaceAll('\\', '/');
        const fileRef = `{file:./${rel}}`;
        const baseKey = agentId;
        const key = useAgentPrefix
          ? baseKey.startsWith('bmad-')
            ? baseKey
            : `bmad-${baseKey}`
          : baseKey;
        const existing = configObj.agent[key];
        const whenToUse = await extractWhenToUseFromFile(p);
        const agentDef = {
          prompt: fileRef,
          mode: isOrchestratorAgent(agentId) ? 'primary' : 'all',
          tools: { write: true, edit: true, bash: true },
          ...(whenToUse ? { description: whenToUse } : {}),
        };
        if (!existing) {
          configObj.agent[key] = agentDef;
          summary.agentsAdded++;
        } else if (
          existing &&
          typeof existing === 'object' &&
          typeof existing.prompt === 'string' &&
          existing.prompt.includes(rel)
        ) {
          existing.prompt = agentDef.prompt;
          existing.mode = agentDef.mode;
          if (whenToUse) existing.description = whenToUse;
          existing.tools = { write: true, edit: true, bash: true };
          configObj.agent[key] = existing;
          summary.agentsUpdated++;
        } else {
          summary.agentsSkipped++;
          // Collision warning: key exists but does not appear BMAD-managed (different prompt path)
          console.log(
            chalk.yellow(
              `⚠︎ Skipped agent key '${key}' (existing entry not BMAD-managed). Tip: enable agent prefixes to avoid collisions.`,
            ),
          );
        }
      }

      // Generate agents - expansion packs (forced pack-specific prefix)
      for (const pack of packsInfo) {
        for (const agentId of pack.agents) {
          const p = path.join(pack.packPath, 'agents', `${agentId}.md`);
          if (!(await fileManager.pathExists(p))) continue;
          const rel = path.relative(installDir, p).replaceAll('\\', '/');
          const fileRef = `{file:./${rel}}`;
          const prefixedKey = `bmad-${pack.packKey}-${agentId}`;
          const existing = configObj.agent[prefixedKey];
          const whenToUse = await extractWhenToUseFromFile(p);
          const agentDef = {
            prompt: fileRef,
            mode: isOrchestratorAgent(agentId) ? 'primary' : 'all',
            tools: { write: true, edit: true, bash: true },
            ...(whenToUse ? { description: whenToUse } : {}),
          };
          if (!existing) {
            configObj.agent[prefixedKey] = agentDef;
            summary.agentsAdded++;
          } else if (
            existing &&
            typeof existing === 'object' &&
            typeof existing.prompt === 'string' &&
            existing.prompt.includes(rel)
          ) {
            existing.prompt = agentDef.prompt;
            existing.mode = agentDef.mode;
            if (whenToUse) existing.description = whenToUse;
            existing.tools = { write: true, edit: true, bash: true };
            configObj.agent[prefixedKey] = existing;
            summary.agentsUpdated++;
          } else {
            summary.agentsSkipped++;
            console.log(
              chalk.yellow(
                `⚠︎ Skipped agent key '${prefixedKey}' (existing entry not BMAD-managed). Tip: enable agent prefixes to avoid collisions.`,
              ),
            );
          }
        }
      }

      // Generate commands - core first (respect optional command prefix)
      for (const taskId of coreTaskIds) {
        const p = await this.findTaskPath(taskId, installDir); // prefers core/common
        if (!p) continue;
        const rel = path.relative(installDir, p).replaceAll('\\', '/');
        const fileRef = `{file:./${rel}}`;
        const key = useCommandPrefix ? `bmad:tasks:${taskId}` : `${taskId}`;
        const existing = configObj.command[key];
        const purpose = await extractTaskPurposeFromFile(p);
        const cmdDef = { template: fileRef, ...(purpose ? { description: purpose } : {}) };
        if (!existing) {
          configObj.command[key] = cmdDef;
          summary.commandsAdded++;
        } else if (
          existing &&
          typeof existing === 'object' &&
          typeof existing.template === 'string' &&
          existing.template.includes(rel)
        ) {
          existing.template = cmdDef.template;
          if (purpose) existing.description = purpose;
          configObj.command[key] = existing;
          summary.commandsUpdated++;
        } else {
          summary.commandsSkipped++;
          console.log(
            chalk.yellow(
              `⚠︎ Skipped command key '${key}' (existing entry not BMAD-managed). Tip: enable command prefixes to avoid collisions.`,
            ),
          );
        }
      }

      // Generate commands - expansion packs (forced pack-specific prefix)
      for (const pack of packsInfo) {
        for (const taskId of pack.tasks) {
          const p = path.join(pack.packPath, 'tasks', `${taskId}.md`);
          if (!(await fileManager.pathExists(p))) continue;
          const rel = path.relative(installDir, p).replaceAll('\\', '/');
          const fileRef = `{file:./${rel}}`;
          const prefixedKey = `bmad:${pack.packKey}:${taskId}`;
          const existing = configObj.command[prefixedKey];
          const purpose = await extractTaskPurposeFromFile(p);
          const cmdDef = { template: fileRef, ...(purpose ? { description: purpose } : {}) };
          if (!existing) {
            configObj.command[prefixedKey] = cmdDef;
            summary.commandsAdded++;
          } else if (
            existing &&
            typeof existing === 'object' &&
            typeof existing.template === 'string' &&
            existing.template.includes(rel)
          ) {
            existing.template = cmdDef.template;
            if (purpose) existing.description = purpose;
            configObj.command[prefixedKey] = existing;
            summary.commandsUpdated++;
          } else {
            summary.commandsSkipped++;
            console.log(
              chalk.yellow(
                `⚠︎ Skipped command key '${prefixedKey}' (existing entry not BMAD-managed). Tip: enable command prefixes to avoid collisions.`,
              ),
            );
          }
        }
      }

      return { configObj, summary };
    };

    // Helper: generate AGENTS.md section for OpenCode (acts as system prompt memory)
    const generateOpenCodeAgentsMd = async () => {
      try {
        const filePath = path.join(installDir, 'AGENTS.md');
        const startMarker = '<!-- BEGIN: BMAD-AGENTS-OPENCODE -->';
        const endMarker = '<!-- END: BMAD-AGENTS-OPENCODE -->';

        const agents = selectedAgent ? [selectedAgent] : await this.getAllAgentIds(installDir);
        const tasks = await this.getAllTaskIds(installDir);

        let section = '';
        section += `${startMarker}\n`;
        section += `# BMAD-METHOD Agents and Tasks (OpenCode)\n\n`;
        section += `OpenCode reads AGENTS.md during initialization and uses it as part of its system prompt for the session. This section is auto-generated by BMAD-METHOD for OpenCode.\n\n`;
        section += `## How To Use With OpenCode\n\n`;
        section += `- Run \`opencode\` in this project. OpenCode will read \`AGENTS.md\` and your OpenCode config (opencode.json[c]).\n`;
        section += `- Reference a role naturally, e.g., "As dev, implement ..." or use commands defined in your BMAD tasks.\n`;
        section += `- Commit \`.bmad-core\` and \`AGENTS.md\` if you want teammates to share the same configuration.\n`;
        section += `- Refresh this section after BMAD updates: \`npx bmad-method install -f -i opencode\`.\n\n`;

        section += `### Helpful Commands\n\n`;
        section += `- List agents: \`npx bmad-method list:agents\`\n`;
        section += `- Reinstall BMAD core and regenerate this section: \`npx bmad-method install -f -i opencode\`\n`;
        section += `- Validate configuration: \`npx bmad-method validate\`\n\n`;

        // Brief context note for modes and tools
        section += `Note\n`;
        section += `- Orchestrators run as mode: primary; other agents as all.\n`;
        section += `- All agents have tools enabled: write, edit, bash.\n\n`;

        section += `## Agents\n\n`;
        section += `### Directory\n\n`;
        section += `| Title | ID | When To Use |\n|---|---|---|\n`;

        // Fallback descriptions for core agents (used if whenToUse is missing)
        const fallbackDescriptions = {
          'ux-expert':
            'Use for UI/UX design, wireframes, prototypes, front-end specs, and user experience optimization',
          sm: 'Use for story creation, epic management, retrospectives in party-mode, and agile process guidance',
          qa: 'Ensure quality strategy, test design, risk profiling, and QA gates across features',
          po: 'Backlog management, story refinement, acceptance criteria, sprint planning, prioritization decisions',
          pm: 'PRDs, product strategy, feature prioritization, roadmap planning, and stakeholder communication',
          dev: 'Code implementation, debugging, refactoring, and development best practices',
          'bmad-orchestrator':
            'Workflow coordination, multi-agent tasks, role switching guidance, and when unsure which specialist to consult',
          'bmad-master':
            'Comprehensive cross-domain execution for tasks that do not require a specific persona',
          architect:
            'System design, architecture docs, technology selection, API design, and infrastructure planning',
          analyst:
            'Discovery/research, competitive analysis, project briefs, initial discovery, and brownfield documentation',
        };

        const sanitizeDesc = (s) => {
          if (!s) return '';
          let t = String(s).trim();
          // Drop surrounding single/double/backtick quotes
          t = t.replaceAll(/^['"`]+|['"`]+$/g, '');
          // Collapse whitespace
          t = t.replaceAll(/\s+/g, ' ').trim();
          return t;
        };
        const agentSummaries = [];
        for (const agentId of agents) {
          const agentPath = await this.findAgentPath(agentId, installDir);
          if (!agentPath) continue;
          let whenToUse = '';
          try {
            const raw = await fileManager.readFile(agentPath);
            const yamlMatch = raw.match(/```ya?ml\r?\n([\s\S]*?)```/);
            const yamlBlock = yamlMatch ? yamlMatch[1].trim() : null;
            if (yamlBlock) {
              try {
                const data = yaml.load(yamlBlock);
                if (data && typeof data.whenToUse === 'string') {
                  whenToUse = data.whenToUse;
                }
              } catch {
                // ignore YAML parse errors
              }
              if (!whenToUse) {
                // Fallback regex supporting single or double quotes
                const m1 = yamlBlock.match(/whenToUse:\s*"([^\n"]+)"/i);
                const m2 = yamlBlock.match(/whenToUse:\s*'([^\n']+)'/i);
                const m3 = yamlBlock.match(/whenToUse:\s*([^\n\r]+)/i);
                whenToUse = (m1?.[1] || m2?.[1] || m3?.[1] || '').trim();
              }
            }
          } catch {
            // ignore read/parse errors for agent metadata extraction
          }
          const title = await this.getAgentTitle(agentId, installDir);
          const finalDesc = sanitizeDesc(whenToUse) || fallbackDescriptions[agentId] || '—';
          agentSummaries.push({ agentId, title, whenToUse: finalDesc, path: agentPath });
          // Strict 3-column row
          section += `| ${title} | ${agentId} | ${finalDesc} |\n`;
        }
        section += `\n`;

        for (const { agentId, title, whenToUse, path: agentPath } of agentSummaries) {
          const relativePath = path.relative(installDir, agentPath).replaceAll('\\', '/');
          section += `### ${title} (id: ${agentId})\n`;
          section += `Source: [${relativePath}](${relativePath})\n\n`;
          if (whenToUse) section += `- When to use: ${whenToUse}\n`;
          section += `- How to activate: Mention "As ${agentId}, ..." to get role-aligned behavior\n`;
          section += `- Full definition: open the source file above (content not embedded)\n\n`;
        }

        if (tasks && tasks.length > 0) {
          section += `## Tasks\n\n`;
          section += `These are reusable task briefs; use the paths to open them as needed.\n\n`;
          for (const taskId of tasks) {
            const taskPath = await this.findTaskPath(taskId, installDir);
            if (!taskPath) continue;
            const relativePath = path.relative(installDir, taskPath).replaceAll('\\', '/');
            section += `### Task: ${taskId}\n`;
            section += `Source: [${relativePath}](${relativePath})\n`;
            section += `- How to use: Reference the task in your prompt or execute via your configured commands.\n`;
            section += `- Full brief: open the source file above (content not embedded)\n\n`;
          }
        }

        section += `${endMarker}\n`;

        let finalContent = '';
        if (await fileManager.pathExists(filePath)) {
          const existing = await fileManager.readFile(filePath);
          if (existing.includes(startMarker) && existing.includes(endMarker)) {
            const pattern = String.raw`${startMarker}[\s\S]*?${endMarker}`;
            const replaced = existing.replace(new RegExp(pattern, 'm'), section);
            finalContent = replaced;
          } else {
            finalContent = existing.trimEnd() + `\n\n` + section;
          }
        } else {
          finalContent += '# Project Agents\n\n';
          finalContent += 'This file provides guidance and memory for your coding CLI.\n\n';
          finalContent += section;
        }

        await fileManager.writeFile(filePath, finalContent);
        console.log(chalk.green('✓ Created/updated AGENTS.md for OpenCode CLI integration'));
        console.log(
          chalk.dim(
            'OpenCode reads AGENTS.md automatically on init. Run `opencode` in this project to use BMAD agents.',
          ),
        );
      } catch {
        console.log(chalk.yellow('⚠︎ Skipped creating AGENTS.md for OpenCode (write failed)'));
      }
    };

    if (hasJson || hasJsonc) {
      // Preserve existing top-level fields; only touch instructions
      const targetPath = hasJsonc ? jsoncPath : jsonPath;
      try {
        const raw = await fs.readFile(targetPath, 'utf8');
        // Use comment-json for both .json and .jsonc for resilience
        const parsed = cjson.parse(raw, undefined, true);
        ensureInstructionRef(parsed);
        const { configObj, summary } = await mergeBmadAgentsAndCommands(parsed);
        const output = cjson.stringify(parsed, null, 2);
        await fs.writeFile(targetPath, output + (output.endsWith('\n') ? '' : '\n'));
        console.log(
          chalk.green(
            '✓ Updated OpenCode config: ensured BMAD instructions and merged agents/commands',
          ),
        );
        // Summary output
        console.log(
          chalk.dim(
            `  File: ${path.basename(targetPath)} | Agents +${summary.agentsAdded} ~${summary.agentsUpdated} ⨯${summary.agentsSkipped} | Commands +${summary.commandsAdded} ~${summary.commandsUpdated} ⨯${summary.commandsSkipped}`,
          ),
        );
        // Ensure AGENTS.md is created/updated for OpenCode as well
        await generateOpenCodeAgentsMd();
      } catch (error) {
        console.log(chalk.red('✗ Failed to update existing OpenCode config'), error.message);
        return false;
      }
      return true;
    }

    // Create minimal opencode.jsonc
    const minimal = {
      $schema: 'https://opencode.ai/config.json',
      instructions: ['.bmad-core/core-config.yaml'],
      agent: {},
      command: {},
    };
    try {
      const { configObj, summary } = await mergeBmadAgentsAndCommands(minimal);
      const output = cjson.stringify(minimal, null, 2);
      await fs.writeFile(jsoncPath, output + (output.endsWith('\n') ? '' : '\n'));
      console.log(
        chalk.green('✓ Created opencode.jsonc with BMAD instructions, agents, and commands'),
      );
      console.log(
        chalk.dim(
          `  File: opencode.jsonc | Agents +${summary.agentsAdded} | Commands +${summary.commandsAdded}`,
        ),
      );
      // Also create/update AGENTS.md for OpenCode on new-config path
      await generateOpenCodeAgentsMd();
      return true;
    } catch (error) {
      console.log(chalk.red('✗ Failed to create opencode.jsonc'), error.message);
      return false;
    }
  }

  async setupCodex(installDir, selectedAgent, options) {
    options = options ?? { webEnabled: false };
    // Codex reads AGENTS.md at the project root as project memory (CLI & Web).
    // Inject/update a BMAD section with guidance, directory, and details.
    const filePath = path.join(installDir, 'AGENTS.md');
    const startMarker = '<!-- BEGIN: BMAD-AGENTS -->';
    const endMarker = '<!-- END: BMAD-AGENTS -->';

    const agents = selectedAgent ? [selectedAgent] : await this.getAllAgentIds(installDir);
    const tasks = await this.getAllTaskIds(installDir);

    // Build BMAD section content
    let section = '';
    section += `${startMarker}\n`;
    section += `# BMAD-METHOD Agents and Tasks\n\n`;
    section += `This section is auto-generated by BMAD-METHOD for Codex. Codex merges this AGENTS.md into context.\n\n`;
    section += `## How To Use With Codex\n\n`;
    section += `- Codex CLI: run \`codex\` in this project. Reference an agent naturally, e.g., "As dev, implement ...".\n`;
    section += `- Codex Web: open this repo and reference roles the same way; Codex reads \`AGENTS.md\`.\n`;
    section += `- Commit \`.bmad-core\` and this \`AGENTS.md\` file to your repo so Codex (Web/CLI) can read full agent definitions.\n`;
    section += `- Refresh this section after agent updates: \`npx bmad-method install -f -i codex\`.\n\n`;

    section += `### Helpful Commands\n\n`;
    section += `- List agents: \`npx bmad-method list:agents\`\n`;
    section += `- Reinstall BMAD core and regenerate AGENTS.md: \`npx bmad-method install -f -i codex\`\n`;
    section += `- Validate configuration: \`npx bmad-method validate\`\n\n`;

    // Agents directory table
    section += `## Agents\n\n`;
    section += `### Directory\n\n`;
    section += `| Title | ID | When To Use |\n|---|---|---|\n`;
    const agentSummaries = [];
    for (const agentId of agents) {
      const agentPath = await this.findAgentPath(agentId, installDir);
      if (!agentPath) continue;
      const raw = await fileManager.readFile(agentPath);
      const yamlMatch = raw.match(/```ya?ml\r?\n([\s\S]*?)```/);
      const yamlBlock = yamlMatch ? yamlMatch[1].trim() : null;
      const title = await this.getAgentTitle(agentId, installDir);
      const whenToUse = yamlBlock?.match(/whenToUse:\s*"?([^\n"]+)"?/i)?.[1]?.trim() || '';
      agentSummaries.push({ agentId, title, whenToUse, yamlBlock, raw, path: agentPath });
      section += `| ${title} | ${agentId} | ${whenToUse || '—'} |\n`;
    }
    section += `\n`;

    // Detailed agent sections
    for (const { agentId, title, whenToUse, yamlBlock, raw, path: agentPath } of agentSummaries) {
      const relativePath = path.relative(installDir, agentPath).replaceAll('\\', '/');
      section += `### ${title} (id: ${agentId})\n`;
      section += `Source: ${relativePath}\n\n`;
      if (whenToUse) section += `- When to use: ${whenToUse}\n`;
      section += `- How to activate: Mention "As ${agentId}, ..." or "Use ${title} to ..."\n\n`;
      if (yamlBlock) {
        section += '```yaml\n' + yamlBlock + '\n```\n\n';
      } else {
        section += '```md\n' + raw.trim() + '\n```\n\n';
      }
    }

    // Tasks
    if (tasks && tasks.length > 0) {
      section += `## Tasks\n\n`;
      section += `These are reusable task briefs you can reference directly in Codex.\n\n`;
      for (const taskId of tasks) {
        const taskPath = await this.findTaskPath(taskId, installDir);
        if (!taskPath) continue;
        const raw = await fileManager.readFile(taskPath);
        const relativePath = path.relative(installDir, taskPath).replaceAll('\\', '/');
        section += `### Task: ${taskId}\n`;
        section += `Source: ${relativePath}\n`;
        section += `- How to use: "Use task ${taskId} with the appropriate agent" and paste relevant parts as needed.\n\n`;
        section += '```md\n' + raw.trim() + '\n```\n\n';
      }
    }

    section += `${endMarker}\n`;

    // Write or update AGENTS.md
    let finalContent = '';
    if (await fileManager.pathExists(filePath)) {
      const existing = await fileManager.readFile(filePath);
      if (existing.includes(startMarker) && existing.includes(endMarker)) {
        // Replace existing BMAD block
        const pattern = String.raw`${startMarker}[\s\S]*?${endMarker}`;
        const replaced = existing.replace(new RegExp(pattern, 'm'), section);
        finalContent = replaced;
      } else {
        // Append BMAD block to existing file
        finalContent = existing.trimEnd() + `\n\n` + section;
      }
    } else {
      // Create fresh AGENTS.md with a small header and BMAD block
      finalContent += '# Project Agents\n\n';
      finalContent += 'This file provides guidance and memory for Codex CLI.\n\n';
      finalContent += section;
    }

    await fileManager.writeFile(filePath, finalContent);
    console.log(chalk.green('✓ Created/updated AGENTS.md for Codex CLI integration'));
    console.log(
      chalk.dim(
        'Codex reads AGENTS.md automatically. Run `codex` in this project to use BMAD agents.',
      ),
    );

    // Optionally add helpful npm scripts if a package.json exists
    try {
      const pkgPath = path.join(installDir, 'package.json');
      if (await fileManager.pathExists(pkgPath)) {
        const pkgRaw = await fileManager.readFile(pkgPath);
        const pkg = JSON.parse(pkgRaw);
        pkg.scripts = pkg.scripts || {};
        const updated = { ...pkg.scripts };
        if (!updated['bmad:refresh']) updated['bmad:refresh'] = 'bmad-method install -f -i codex';
        if (!updated['bmad:list']) updated['bmad:list'] = 'bmad-method list:agents';
        if (!updated['bmad:validate']) updated['bmad:validate'] = 'bmad-method validate';
        const changed = JSON.stringify(updated) !== JSON.stringify(pkg.scripts);
        if (changed) {
          const newPkg = { ...pkg, scripts: updated };
          await fileManager.writeFile(pkgPath, JSON.stringify(newPkg, null, 2) + '\n');
          console.log(chalk.green('✓ Added npm scripts: bmad:refresh, bmad:list, bmad:validate'));
        }
      }
    } catch {
      console.log(
        chalk.yellow('⚠︎ Skipped adding npm scripts (package.json not writable or invalid)'),
      );
    }

    // Adjust .gitignore behavior depending on Codex mode
    try {
      const gitignorePath = path.join(installDir, '.gitignore');
      const ignoreLines = ['# BMAD (local only)', '.bmad-core/', '.bmad-*/'];
      const exists = await fileManager.pathExists(gitignorePath);
      if (options.webEnabled) {
        if (exists) {
          let gi = await fileManager.readFile(gitignorePath);
          const updated = gi
            .split(/\r?\n/)
            .filter((l) => !/^\s*\.bmad-core\/?\s*$/.test(l) && !/^\s*\.bmad-\*\/?\s*$/.test(l))
            .join('\n');
          if (updated !== gi) {
            await fileManager.writeFile(gitignorePath, updated.trimEnd() + '\n');
            console.log(chalk.green('✓ Updated .gitignore to include .bmad-core in commits'));
          }
        }
      } else {
        // Local-only: add ignores if missing
        let base = exists ? await fileManager.readFile(gitignorePath) : '';
        const haveCore = base.includes('.bmad-core/');
        const haveStar = base.includes('.bmad-*/');
        if (!haveCore || !haveStar) {
          const sep = base.endsWith('\n') || base.length === 0 ? '' : '\n';
          const add = [!haveCore || !haveStar ? ignoreLines.join('\n') : '']
            .filter(Boolean)
            .join('\n');
          const out = base + sep + add + '\n';
          await fileManager.writeFile(gitignorePath, out);
          console.log(chalk.green('✓ Added .bmad-core/* to .gitignore for local-only Codex setup'));
        }
      }
    } catch {
      console.log(chalk.yellow('⚠︎ Could not update .gitignore (skipping)'));
    }

    return true;
  }

  async setupCursor(installDir, selectedAgent) {
    const cursorRulesDir = path.join(installDir, '.cursor', 'rules', 'bmad');
    const agents = selectedAgent ? [selectedAgent] : await this.getAllAgentIds(installDir);

    await fileManager.ensureDirectory(cursorRulesDir);

    for (const agentId of agents) {
      const agentPath = await this.findAgentPath(agentId, installDir);

      if (agentPath) {
        const mdcContent = await this.createAgentRuleContent(agentId, agentPath, installDir, 'mdc');
        const mdcPath = path.join(cursorRulesDir, `${agentId}.mdc`);
        await fileManager.writeFile(mdcPath, mdcContent);
        console.log(chalk.green(`✓ Created rule: ${agentId}.mdc`));
      }
    }

    console.log(chalk.green(`\n✓ Created Cursor rules in ${cursorRulesDir}`));
    return true;
  }

  async setupCrush(installDir, selectedAgent) {
    // Setup bmad-core commands
    const coreSlashPrefix = await this.getCoreSlashPrefix(installDir);
    const coreAgents = selectedAgent ? [selectedAgent] : await this.getCoreAgentIds(installDir);
    const coreTasks = await this.getCoreTaskIds(installDir);
    await this.setupCrushForPackage(
      installDir,
      'core',
      coreSlashPrefix,
      coreAgents,
      coreTasks,
      '.bmad-core',
    );

    // Setup expansion pack commands
    const expansionPacks = await this.getInstalledExpansionPacks(installDir);
    for (const packInfo of expansionPacks) {
      const packSlashPrefix = await this.getExpansionPackSlashPrefix(packInfo.path);
      const packAgents = await this.getExpansionPackAgents(packInfo.path);
      const packTasks = await this.getExpansionPackTasks(packInfo.path);

      if (packAgents.length > 0 || packTasks.length > 0) {
        // Use the actual directory name where the expansion pack is installed
        const rootPath = path.relative(installDir, packInfo.path);
        await this.setupCrushForPackage(
          installDir,
          packInfo.name,
          packSlashPrefix,
          packAgents,
          packTasks,
          rootPath,
        );
      }
    }

    return true;
  }

  async setupClaudeCode(installDir, selectedAgent) {
    // Setup bmad-core commands
    const coreSlashPrefix = await this.getCoreSlashPrefix(installDir);
    const coreAgents = selectedAgent ? [selectedAgent] : await this.getCoreAgentIds(installDir);
    const coreTasks = await this.getCoreTaskIds(installDir);
    await this.setupClaudeCodeForPackage(
      installDir,
      'core',
      coreSlashPrefix,
      coreAgents,
      coreTasks,
      '.bmad-core',
    );

    // Setup expansion pack commands
    const expansionPacks = await this.getInstalledExpansionPacks(installDir);
    for (const packInfo of expansionPacks) {
      const packSlashPrefix = await this.getExpansionPackSlashPrefix(packInfo.path);
      const packAgents = await this.getExpansionPackAgents(packInfo.path);
      const packTasks = await this.getExpansionPackTasks(packInfo.path);

      if (packAgents.length > 0 || packTasks.length > 0) {
        // Use the actual directory name where the expansion pack is installed
        const rootPath = path.relative(installDir, packInfo.path);
        await this.setupClaudeCodeForPackage(
          installDir,
          packInfo.name,
          packSlashPrefix,
          packAgents,
          packTasks,
          rootPath,
        );
      }
    }

    return true;
  }

  async setupClaudeCodeForPackage(
    installDir,
    packageName,
    slashPrefix,
    agentIds,
    taskIds,
    rootPath,
  ) {
    const commandsBaseDir = path.join(installDir, '.claude', 'commands', slashPrefix);
    const agentsDir = path.join(commandsBaseDir, 'agents');
    const tasksDir = path.join(commandsBaseDir, 'tasks');

    // Ensure directories exist
    await fileManager.ensureDirectory(agentsDir);
    await fileManager.ensureDirectory(tasksDir);

    // Setup agents
    for (const agentId of agentIds) {
      // Find the agent file - for expansion packs, prefer the expansion pack version
      let agentPath;
      if (packageName === 'core') {
        // For core, use the normal search
        agentPath = await this.findAgentPath(agentId, installDir);
      } else {
        // For expansion packs, first try to find the agent in the expansion pack directory
        const expansionPackPath = path.join(installDir, rootPath, 'agents', `${agentId}.md`);
        if (await fileManager.pathExists(expansionPackPath)) {
          agentPath = expansionPackPath;
        } else {
          // Fall back to core if not found in expansion pack
          agentPath = await this.findAgentPath(agentId, installDir);
        }
      }

      const commandPath = path.join(agentsDir, `${agentId}.md`);

      if (agentPath) {
        // Create command file with agent content
        let agentContent = await fileManager.readFile(agentPath);

        // Replace {root} placeholder with the appropriate root path for this context
        agentContent = agentContent.replaceAll('{root}', rootPath);

        // Add command header
        let commandContent = `# /${agentId} Command\n\n`;
        commandContent += `When this command is used, adopt the following agent persona:\n\n`;
        commandContent += agentContent;

        await fileManager.writeFile(commandPath, commandContent);
        console.log(chalk.green(`✓ Created agent command: /${agentId}`));
      }
    }

    // Setup tasks
    for (const taskId of taskIds) {
      // Find the task file - for expansion packs, prefer the expansion pack version
      let taskPath;
      if (packageName === 'core') {
        // For core, use the normal search
        taskPath = await this.findTaskPath(taskId, installDir);
      } else {
        // For expansion packs, first try to find the task in the expansion pack directory
        const expansionPackPath = path.join(installDir, rootPath, 'tasks', `${taskId}.md`);
        if (await fileManager.pathExists(expansionPackPath)) {
          taskPath = expansionPackPath;
        } else {
          // Fall back to core if not found in expansion pack
          taskPath = await this.findTaskPath(taskId, installDir);
        }
      }

      const commandPath = path.join(tasksDir, `${taskId}.md`);

      if (taskPath) {
        // Create command file with task content
        let taskContent = await fileManager.readFile(taskPath);

        // Replace {root} placeholder with the appropriate root path for this context
        taskContent = taskContent.replaceAll('{root}', rootPath);

        // Add command header
        let commandContent = `# /${taskId} Task\n\n`;
        commandContent += `When this command is used, execute the following task:\n\n`;
        commandContent += taskContent;

        await fileManager.writeFile(commandPath, commandContent);
        console.log(chalk.green(`✓ Created task command: /${taskId}`));
      }
    }

    console.log(
      chalk.green(`\n✓ Created Claude Code commands for ${packageName} in ${commandsBaseDir}`),
    );
    console.log(chalk.dim(`  - Agents in: ${agentsDir}`));
    console.log(chalk.dim(`  - Tasks in: ${tasksDir}`));
  }

  async setupIFlowCli(installDir, selectedAgent) {
    // Setup bmad-core commands
    const coreSlashPrefix = await this.getCoreSlashPrefix(installDir);
    const coreAgents = selectedAgent ? [selectedAgent] : await this.getCoreAgentIds(installDir);
    const coreTasks = await this.getCoreTaskIds(installDir);
    await this.setupIFlowCliForPackage(
      installDir,
      'core',
      coreSlashPrefix,
      coreAgents,
      coreTasks,
      '.bmad-core',
    );

    // Setup expansion pack commands
    const expansionPacks = await this.getInstalledExpansionPacks(installDir);
    for (const packInfo of expansionPacks) {
      const packSlashPrefix = await this.getExpansionPackSlashPrefix(packInfo.path);
      const packAgents = await this.getExpansionPackAgents(packInfo.path);
      const packTasks = await this.getExpansionPackTasks(packInfo.path);

      if (packAgents.length > 0 || packTasks.length > 0) {
        // Use the actual directory name where the expansion pack is installed
        const rootPath = path.relative(installDir, packInfo.path);
        await this.setupIFlowCliForPackage(
          installDir,
          packInfo.name,
          packSlashPrefix,
          packAgents,
          packTasks,
          rootPath,
        );
      }
    }

    return true;
  }

  async setupIFlowCliForPackage(installDir, packageName, slashPrefix, agentIds, taskIds, rootPath) {
    const commandsBaseDir = path.join(installDir, '.iflow', 'commands', slashPrefix);
    const agentsDir = path.join(commandsBaseDir, 'agents');
    const tasksDir = path.join(commandsBaseDir, 'tasks');

    // Ensure directories exist
    await fileManager.ensureDirectory(agentsDir);
    await fileManager.ensureDirectory(tasksDir);

    // Setup agents
    for (const agentId of agentIds) {
      // Find the agent file - for expansion packs, prefer the expansion pack version
      let agentPath;
      if (packageName === 'core') {
        // For core, use the normal search
        agentPath = await this.findAgentPath(agentId, installDir);
      } else {
        // For expansion packs, first try to find the agent in the expansion pack directory
        const expansionPackPath = path.join(installDir, rootPath, 'agents', `${agentId}.md`);
        if (await fileManager.pathExists(expansionPackPath)) {
          agentPath = expansionPackPath;
        } else {
          // Fall back to core if not found in expansion pack
          agentPath = await this.findAgentPath(agentId, installDir);
        }
      }

      const commandPath = path.join(agentsDir, `${agentId}.md`);

      if (agentPath) {
        // Create command file with agent content
        let agentContent = await fileManager.readFile(agentPath);

        // Replace {root} placeholder with the appropriate root path for this context
        agentContent = agentContent.replaceAll('{root}', rootPath);

        // Add command header
        let commandContent = `# /${agentId} Command\n\n`;
        commandContent += `When this command is used, adopt the following agent persona:\n\n`;
        commandContent += agentContent;

        await fileManager.writeFile(commandPath, commandContent);
        console.log(chalk.green(`✓ Created agent command: /${agentId}`));
      }
    }

    // Setup tasks
    for (const taskId of taskIds) {
      // Find the task file - for expansion packs, prefer the expansion pack version
      let taskPath;
      if (packageName === 'core') {
        // For core, use the normal search
        taskPath = await this.findTaskPath(taskId, installDir);
      } else {
        // For expansion packs, first try to find the task in the expansion pack directory
        const expansionPackPath = path.join(installDir, rootPath, 'tasks', `${taskId}.md`);
        if (await fileManager.pathExists(expansionPackPath)) {
          taskPath = expansionPackPath;
        } else {
          // Fall back to core if not found in expansion pack
          taskPath = await this.findTaskPath(taskId, installDir);
        }
      }

      const commandPath = path.join(tasksDir, `${taskId}.md`);

      if (taskPath) {
        // Create command file with task content
        let taskContent = await fileManager.readFile(taskPath);

        // Replace {root} placeholder with the appropriate root path for this context
        taskContent = taskContent.replaceAll('{root}', rootPath);

        // Add command header
        let commandContent = `# /${taskId} Task\n\n`;
        commandContent += `When this command is used, execute the following task:\n\n`;
        commandContent += taskContent;

        await fileManager.writeFile(commandPath, commandContent);
        console.log(chalk.green(`✓ Created task command: /${taskId}`));
      }
    }

    console.log(
      chalk.green(`\n✓ Created iFlow CLI commands for ${packageName} in ${commandsBaseDir}`),
    );
    console.log(chalk.dim(`  - Agents in: ${agentsDir}`));
    console.log(chalk.dim(`  - Tasks in: ${tasksDir}`));
  }

  async setupCrushForPackage(installDir, packageName, slashPrefix, agentIds, taskIds, rootPath) {
    const commandsBaseDir = path.join(installDir, '.crush', 'commands', slashPrefix);
    const agentsDir = path.join(commandsBaseDir, 'agents');
    const tasksDir = path.join(commandsBaseDir, 'tasks');

    // Ensure directories exist
    await fileManager.ensureDirectory(agentsDir);
    await fileManager.ensureDirectory(tasksDir);

    // Setup agents
    for (const agentId of agentIds) {
      // Find the agent file - for expansion packs, prefer the expansion pack version
      let agentPath;
      if (packageName === 'core') {
        // For core, use the normal search
        agentPath = await this.findAgentPath(agentId, installDir);
      } else {
        // For expansion packs, first try to find the agent in the expansion pack directory
        const expansionPackPath = path.join(installDir, rootPath, 'agents', `${agentId}.md`);
        if (await fileManager.pathExists(expansionPackPath)) {
          agentPath = expansionPackPath;
        } else {
          // Fall back to core if not found in expansion pack
          agentPath = await this.findAgentPath(agentId, installDir);
        }
      }

      const commandPath = path.join(agentsDir, `${agentId}.md`);

      if (agentPath) {
        // Create command file with agent content
        let agentContent = await fileManager.readFile(agentPath);

        // Replace {root} placeholder with the appropriate root path for this context
        agentContent = agentContent.replaceAll('{root}', rootPath);

        // Add command header
        let commandContent = `# /${agentId} Command\n\n`;
        commandContent += `When this command is used, adopt the following agent persona:\n\n`;
        commandContent += agentContent;

        await fileManager.writeFile(commandPath, commandContent);
        console.log(chalk.green(`✓ Created agent command: /${agentId}`));
      }
    }

    // Setup tasks
    for (const taskId of taskIds) {
      // Find the task file - for expansion packs, prefer the expansion pack version
      let taskPath;
      if (packageName === 'core') {
        // For core, use the normal search
        taskPath = await this.findTaskPath(taskId, installDir);
      } else {
        // For expansion packs, first try to find the task in the expansion pack directory
        const expansionPackPath = path.join(installDir, rootPath, 'tasks', `${taskId}.md`);
        if (await fileManager.pathExists(expansionPackPath)) {
          taskPath = expansionPackPath;
        } else {
          // Fall back to core if not found in expansion pack
          taskPath = await this.findTaskPath(taskId, installDir);
        }
      }

      const commandPath = path.join(tasksDir, `${taskId}.md`);

      if (taskPath) {
        // Create command file with task content
        let taskContent = await fileManager.readFile(taskPath);

        // Replace {root} placeholder with the appropriate root path for this context
        taskContent = taskContent.replaceAll('{root}', rootPath);

        // Add command header
        let commandContent = `# /${taskId} Task\n\n`;
        commandContent += `When this command is used, execute the following task:\n\n`;
        commandContent += taskContent;

        await fileManager.writeFile(commandPath, commandContent);
        console.log(chalk.green(`✓ Created task command: /${taskId}`));
      }
    }

    console.log(chalk.green(`\n✓ Created Crush commands for ${packageName} in ${commandsBaseDir}`));
    console.log(chalk.dim(`  - Agents in: ${agentsDir}`));
    console.log(chalk.dim(`  - Tasks in: ${tasksDir}`));
  }

  async setupWindsurf(installDir, selectedAgent) {
    const windsurfWorkflowDir = path.join(installDir, '.windsurf', 'workflows');
    const agents = selectedAgent ? [selectedAgent] : await this.getAllAgentIds(installDir);

    await fileManager.ensureDirectory(windsurfWorkflowDir);

    for (const agentId of agents) {
      // Find the agent file
      const agentPath = await this.findAgentPath(agentId, installDir);

      if (agentPath) {
        const agentContent = await fileManager.readFile(agentPath);
        const mdPath = path.join(windsurfWorkflowDir, `${agentId}.md`);

        // Write the agent file contents prefixed with Windsurf frontmatter
        let mdContent = `---\n`;
        mdContent += `description: ${agentId}\n`;
        mdContent += `auto_execution_mode: 3\n`;
        mdContent += `---\n\n`;
        mdContent += agentContent;

        await fileManager.writeFile(mdPath, mdContent);
        console.log(chalk.green(`✓ Created workflow: ${agentId}.md`));
      }
    }

    console.log(chalk.green(`\n✓ Created Windsurf workflows in ${windsurfWorkflowDir}`));

    return true;
  }

  async setupTrae(installDir, selectedAgent) {
    const traeRulesDir = path.join(installDir, '.trae', 'rules');
    const agents = selectedAgent ? [selectedAgent] : await this.getAllAgentIds(installDir);

    await fileManager.ensureDirectory(traeRulesDir);

    for (const agentId of agents) {
      // Find the agent file
      const agentPath = await this.findAgentPath(agentId, installDir);

      if (agentPath) {
        const agentContent = await fileManager.readFile(agentPath);
        const mdPath = path.join(traeRulesDir, `${agentId}.md`);

        // Create MD content (similar to Cursor but without frontmatter)
        let mdContent = `# ${agentId.toUpperCase()} Agent Rule\n\n`;
        mdContent += `This rule is triggered when the user types \`@${agentId}\` and activates the ${await this.getAgentTitle(
          agentId,
          installDir,
        )} agent persona.\n\n`;
        mdContent += '## Agent Activation\n\n';
        mdContent +=
          'CRITICAL: Read the full YAML, start activation to alter your state of being, follow startup section instructions, stay in this being until told to exit this mode:\n\n';
        mdContent += '```yaml\n';
        // Extract just the YAML content from the agent file
        const yamlContent = extractYamlFromAgent(agentContent);
        if (yamlContent) {
          mdContent += yamlContent;
        } else {
          // If no YAML found, include the whole content minus the header
          mdContent += agentContent.replace(/^#.*$/m, '').trim();
        }
        mdContent += '\n```\n\n';
        mdContent += '## File Reference\n\n';
        const relativePath = path.relative(installDir, agentPath).replaceAll('\\', '/');
        mdContent += `The complete agent definition is available in [${relativePath}](${relativePath}).\n\n`;
        mdContent += '## Usage\n\n';
        mdContent += `When the user types \`@${agentId}\`, activate this ${await this.getAgentTitle(
          agentId,
          installDir,
        )} persona and follow all instructions defined in the YAML configuration above.\n`;

        await fileManager.writeFile(mdPath, mdContent);
        console.log(chalk.green(`✓ Created rule: ${agentId}.md`));
      }
    }
  }

  async findAgentPath(agentId, installDir) {
    // Try to find the agent file in various locations
    const possiblePaths = [
      path.join(installDir, '.bmad-core', 'agents', `${agentId}.md`),
      path.join(installDir, 'agents', `${agentId}.md`),
    ];

    // Also check expansion pack directories
    const glob = require('glob');
    const expansionDirectories = glob.sync('.*/agents', { cwd: installDir });
    for (const expDir of expansionDirectories) {
      possiblePaths.push(path.join(installDir, expDir, `${agentId}.md`));
    }

    for (const agentPath of possiblePaths) {
      if (await fileManager.pathExists(agentPath)) {
        return agentPath;
      }
    }

    return null;
  }

  async getAllAgentIds(installDir) {
    const glob = require('glob');
    const allAgentIds = [];

    // Check core agents in .bmad-core or root
    let agentsDir = path.join(installDir, '.bmad-core', 'agents');
    if (!(await fileManager.pathExists(agentsDir))) {
      agentsDir = path.join(installDir, 'agents');
    }

    if (await fileManager.pathExists(agentsDir)) {
      const agentFiles = glob.sync('*.md', { cwd: agentsDir });
      allAgentIds.push(...agentFiles.map((file) => path.basename(file, '.md')));
    }

    // Also check for expansion pack agents in dot folders
    const expansionDirectories = glob.sync('.*/agents', { cwd: installDir });
    for (const expDir of expansionDirectories) {
      const fullExpDir = path.join(installDir, expDir);
      const expAgentFiles = glob.sync('*.md', { cwd: fullExpDir });
      allAgentIds.push(...expAgentFiles.map((file) => path.basename(file, '.md')));
    }

    // Remove duplicates
    return [...new Set(allAgentIds)];
  }

  async getCoreAgentIds(installDir) {
    const allAgentIds = [];

    // Check core agents in .bmad-core or root only
    let agentsDir = path.join(installDir, '.bmad-core', 'agents');
    if (!(await fileManager.pathExists(agentsDir))) {
      agentsDir = path.join(installDir, 'bmad-core', 'agents');
    }

    if (await fileManager.pathExists(agentsDir)) {
      const glob = require('glob');
      const agentFiles = glob.sync('*.md', { cwd: agentsDir });
      allAgentIds.push(...agentFiles.map((file) => path.basename(file, '.md')));
    }

    return [...new Set(allAgentIds)];
  }

  async getCoreTaskIds(installDir) {
    const allTaskIds = [];
    const glob = require('glob');

    // Check core tasks in .bmad-core or root only
    let tasksDir = path.join(installDir, '.bmad-core', 'tasks');
    if (!(await fileManager.pathExists(tasksDir))) {
      tasksDir = path.join(installDir, 'bmad-core', 'tasks');
    }

    if (await fileManager.pathExists(tasksDir)) {
      const taskFiles = glob.sync('*.md', { cwd: tasksDir });
      allTaskIds.push(...taskFiles.map((file) => path.basename(file, '.md')));
    }

    // Check common tasks
    const commonTasksDir = path.join(installDir, 'common', 'tasks');
    if (await fileManager.pathExists(commonTasksDir)) {
      const glob = require('glob');
      const commonTaskFiles = glob.sync('*.md', { cwd: commonTasksDir });
      allTaskIds.push(...commonTaskFiles.map((file) => path.basename(file, '.md')));
    }

    return [...new Set(allTaskIds)];
  }

  async getAgentTitle(agentId, installDir) {
    // Try to find the agent file in various locations
    const possiblePaths = [
      path.join(installDir, '.bmad-core', 'agents', `${agentId}.md`),
      path.join(installDir, 'agents', `${agentId}.md`),
    ];

    // Also check expansion pack directories
    const glob = require('glob');
    const expansionDirectories = glob.sync('.*/agents', { cwd: installDir });
    for (const expDir of expansionDirectories) {
      possiblePaths.push(path.join(installDir, expDir, `${agentId}.md`));
    }

    for (const agentPath of possiblePaths) {
      if (await fileManager.pathExists(agentPath)) {
        try {
          const agentContent = await fileManager.readFile(agentPath);
          const yamlMatch = agentContent.match(/```ya?ml\r?\n([\s\S]*?)```/);

          if (yamlMatch) {
            const yaml = yamlMatch[1];
            const titleMatch = yaml.match(/title:\s*(.+)/);
            if (titleMatch) {
              return titleMatch[1].trim();
            }
          }
        } catch (error) {
          console.warn(`Failed to read agent title for ${agentId}: ${error.message}`);
        }
      }
    }

    // Fallback to formatted agent ID
    return agentId
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  async getAllTaskIds(installDir) {
    const glob = require('glob');
    const allTaskIds = [];

    // Check core tasks in .bmad-core or root
    let tasksDir = path.join(installDir, '.bmad-core', 'tasks');
    if (!(await fileManager.pathExists(tasksDir))) {
      tasksDir = path.join(installDir, 'bmad-core', 'tasks');
    }

    if (await fileManager.pathExists(tasksDir)) {
      const taskFiles = glob.sync('*.md', { cwd: tasksDir });
      allTaskIds.push(...taskFiles.map((file) => path.basename(file, '.md')));
    }

    // Check common tasks
    const commonTasksDir = path.join(installDir, 'common', 'tasks');
    if (await fileManager.pathExists(commonTasksDir)) {
      const commonTaskFiles = glob.sync('*.md', { cwd: commonTasksDir });
      allTaskIds.push(...commonTaskFiles.map((file) => path.basename(file, '.md')));
    }

    // Also check for expansion pack tasks in dot folders
    const expansionDirectories = glob.sync('.*/tasks', { cwd: installDir });
    for (const expDir of expansionDirectories) {
      const fullExpDir = path.join(installDir, expDir);
      const expTaskFiles = glob.sync('*.md', { cwd: fullExpDir });
      allTaskIds.push(...expTaskFiles.map((file) => path.basename(file, '.md')));
    }

    // Check expansion-packs folder tasks
    const expansionPacksDir = path.join(installDir, 'expansion-packs');
    if (await fileManager.pathExists(expansionPacksDir)) {
      const expPackDirectories = glob.sync('*/tasks', { cwd: expansionPacksDir });
      for (const expDir of expPackDirectories) {
        const fullExpDir = path.join(expansionPacksDir, expDir);
        const expTaskFiles = glob.sync('*.md', { cwd: fullExpDir });
        allTaskIds.push(...expTaskFiles.map((file) => path.basename(file, '.md')));
      }
    }

    // Remove duplicates
    return [...new Set(allTaskIds)];
  }

  async findTaskPath(taskId, installDir) {
    // Try to find the task file in various locations
    const possiblePaths = [
      path.join(installDir, '.bmad-core', 'tasks', `${taskId}.md`),
      path.join(installDir, 'bmad-core', 'tasks', `${taskId}.md`),
      path.join(installDir, 'common', 'tasks', `${taskId}.md`),
    ];

    // Also check expansion pack directories
    const glob = require('glob');

    // Check dot folder expansion packs
    const expansionDirectories = glob.sync('.*/tasks', { cwd: installDir });
    for (const expDir of expansionDirectories) {
      possiblePaths.push(path.join(installDir, expDir, `${taskId}.md`));
    }

    // Check expansion-packs folder
    const expansionPacksDir = path.join(installDir, 'expansion-packs');
    if (await fileManager.pathExists(expansionPacksDir)) {
      const expPackDirectories = glob.sync('*/tasks', { cwd: expansionPacksDir });
      for (const expDir of expPackDirectories) {
        possiblePaths.push(path.join(expansionPacksDir, expDir, `${taskId}.md`));
      }
    }

    for (const taskPath of possiblePaths) {
      if (await fileManager.pathExists(taskPath)) {
        return taskPath;
      }
    }

    return null;
  }

  async getCoreSlashPrefix(installDir) {
    try {
      const coreConfigPath = path.join(installDir, '.bmad-core', 'core-config.yaml');
      if (!(await fileManager.pathExists(coreConfigPath))) {
        // Try bmad-core directory
        const altConfigPath = path.join(installDir, 'bmad-core', 'core-config.yaml');
        if (await fileManager.pathExists(altConfigPath)) {
          const configContent = await fileManager.readFile(altConfigPath);
          const config = yaml.load(configContent);
          return config.slashPrefix || 'BMad';
        }
        return 'BMad'; // fallback
      }

      const configContent = await fileManager.readFile(coreConfigPath);
      const config = yaml.load(configContent);
      return config.slashPrefix || 'BMad';
    } catch (error) {
      console.warn(`Failed to read core slashPrefix, using default 'BMad': ${error.message}`);
      return 'BMad';
    }
  }

  async getInstalledExpansionPacks(installDir) {
    const expansionPacks = [];

    // Check for dot-prefixed expansion packs in install directory
    const glob = require('glob');
    const dotExpansions = glob.sync('.bmad-*', { cwd: installDir });

    for (const dotExpansion of dotExpansions) {
      if (dotExpansion !== '.bmad-core') {
        const packPath = path.join(installDir, dotExpansion);
        const packName = dotExpansion.slice(1); // remove the dot
        expansionPacks.push({
          name: packName,
          path: packPath,
        });
      }
    }

    // Check for expansion-packs directory style
    const expansionPacksDir = path.join(installDir, 'expansion-packs');
    if (await fileManager.pathExists(expansionPacksDir)) {
      const packDirectories = glob.sync('*', { cwd: expansionPacksDir });

      for (const packDir of packDirectories) {
        const packPath = path.join(expansionPacksDir, packDir);
        if (
          (await fileManager.pathExists(packPath)) &&
          (await fileManager.pathExists(path.join(packPath, 'config.yaml')))
        ) {
          expansionPacks.push({
            name: packDir,
            path: packPath,
          });
        }
      }
    }

    return expansionPacks;
  }

  async getExpansionPackSlashPrefix(packPath) {
    try {
      const configPath = path.join(packPath, 'config.yaml');
      if (await fileManager.pathExists(configPath)) {
        const configContent = await fileManager.readFile(configPath);
        const config = yaml.load(configContent);
        return config.slashPrefix || path.basename(packPath);
      }
    } catch (error) {
      console.warn(`Failed to read expansion pack slashPrefix from ${packPath}: ${error.message}`);
    }

    return path.basename(packPath); // fallback to directory name
  }

  async getExpansionPackAgents(packPath) {
    const agentsDir = path.join(packPath, 'agents');
    if (!(await fileManager.pathExists(agentsDir))) {
      return [];
    }

    try {
      const glob = require('glob');
      const agentFiles = glob.sync('*.md', { cwd: agentsDir });
      return agentFiles.map((file) => path.basename(file, '.md'));
    } catch (error) {
      console.warn(`Failed to read expansion pack agents from ${packPath}: ${error.message}`);
      return [];
    }
  }

  async getExpansionPackTasks(packPath) {
    const tasksDir = path.join(packPath, 'tasks');
    if (!(await fileManager.pathExists(tasksDir))) {
      return [];
    }

    try {
      const glob = require('glob');
      const taskFiles = glob.sync('*.md', { cwd: tasksDir });
      return taskFiles.map((file) => path.basename(file, '.md'));
    } catch (error) {
      console.warn(`Failed to read expansion pack tasks from ${packPath}: ${error.message}`);
      return [];
    }
  }

  async setupRoo(installDir, selectedAgent) {
    const agents = selectedAgent ? [selectedAgent] : await this.getAllAgentIds(installDir);

    // Check for existing .roomodes file in project root
    const roomodesPath = path.join(installDir, '.roomodes');
    let existingModes = [];
    let existingContent = '';

    if (await fileManager.pathExists(roomodesPath)) {
      existingContent = await fileManager.readFile(roomodesPath);
      // Parse existing modes to avoid duplicates
      const modeMatches = existingContent.matchAll(/- slug: ([\w-]+)/g);
      for (const match of modeMatches) {
        existingModes.push(match[1]);
      }
      console.log(chalk.yellow(`Found existing .roomodes file with ${existingModes.length} modes`));
    }

    // Create new modes content
    let newModesContent = '';

    // Load dynamic agent permissions from configuration
    const config = await this.loadIdeAgentConfig();
    const agentPermissions = config['roo-permissions'] || {};

    for (const agentId of agents) {
      // Skip if already exists
      // Check both with and without bmad- prefix to handle both cases
      const checkSlug = agentId.startsWith('bmad-') ? agentId : `bmad-${agentId}`;
      if (existingModes.includes(checkSlug)) {
        console.log(chalk.dim(`Skipping ${agentId} - already exists in .roomodes`));
        continue;
      }

      // Read agent file to extract all information
      const agentPath = await this.findAgentPath(agentId, installDir);

      if (agentPath) {
        const agentContent = await fileManager.readFile(agentPath);

        // Extract YAML content
        const yamlMatch = agentContent.match(/```ya?ml\r?\n([\s\S]*?)```/);
        if (yamlMatch) {
          const yaml = yamlMatch[1];

          // Extract agent info from YAML
          const titleMatch = yaml.match(/title:\s*(.+)/);
          const iconMatch = yaml.match(/icon:\s*(.+)/);
          const whenToUseMatch = yaml.match(/whenToUse:\s*"(.+)"/);
          const roleDefinitionMatch = yaml.match(/roleDefinition:\s*"(.+)"/);

          const title = titleMatch
            ? titleMatch[1].trim()
            : await this.getAgentTitle(agentId, installDir);
          const icon = iconMatch ? iconMatch[1].trim() : '🤖';
          const whenToUse = whenToUseMatch ? whenToUseMatch[1].trim() : `Use for ${title} tasks`;
          const roleDefinition = roleDefinitionMatch
            ? roleDefinitionMatch[1].trim()
            : `You are a ${title} specializing in ${title.toLowerCase()} tasks and responsibilities.`;

          // Add permissions based on agent type
          const permissions = agentPermissions[agentId];
          // Build mode entry with proper formatting (matching exact indentation)
          // Avoid double "bmad-" prefix for agents that already have it
          const slug = agentId.startsWith('bmad-') ? agentId : `bmad-${agentId}`;
          newModesContent += ` - slug: ${slug}\n`;
          newModesContent += `   name: '${icon} ${title}'\n`;
          if (permissions) {
            newModesContent += `   description: '${permissions.description}'\n`;
          }
          newModesContent += `   roleDefinition: ${roleDefinition}\n`;
          newModesContent += `   whenToUse: ${whenToUse}\n`;
          // Get relative path from installDir to agent file
          const relativePath = path.relative(installDir, agentPath).replaceAll('\\', '/');
          newModesContent += `   customInstructions: CRITICAL Read the full YAML from ${relativePath} start activation to alter your state of being follow startup section instructions stay in this being until told to exit this mode\n`;
          newModesContent += `   groups:\n`;
          newModesContent += `    - read\n`;

          if (permissions) {
            newModesContent += `    - - edit\n`;
            newModesContent += `      - fileRegex: ${permissions.fileRegex}\n`;
            newModesContent += `        description: ${permissions.description}\n`;
          } else {
            newModesContent += `    - edit\n`;
          }

          console.log(chalk.green(`✓ Added mode: bmad-${agentId} (${icon} ${title})`));
        }
      }
    }

    // Build final roomodes content
    let roomodesContent = '';
    if (existingContent) {
      // If there's existing content, append new modes to it
      roomodesContent = existingContent.trim() + '\n' + newModesContent;
    } else {
      // Create new .roomodes file with proper YAML structure
      roomodesContent = 'customModes:\n' + newModesContent;
    }

    // Write .roomodes file
    await fileManager.writeFile(roomodesPath, roomodesContent);
    console.log(chalk.green('✓ Created .roomodes file in project root'));

    console.log(chalk.green(`\n✓ Roo Code setup complete!`));
    console.log(chalk.dim('Custom modes will be available when you open this project in Roo Code'));

    return true;
  }

  async setupKilocode(installDir, selectedAgent) {
    const filePath = path.join(installDir, '.kilocodemodes');
    const agents = selectedAgent ? [selectedAgent] : await this.getAllAgentIds(installDir);

    let existingModes = [],
      existingContent = '';
    if (await fileManager.pathExists(filePath)) {
      existingContent = await fileManager.readFile(filePath);
      for (const match of existingContent.matchAll(/- slug: ([\w-]+)/g)) {
        existingModes.push(match[1]);
      }
      console.log(
        chalk.yellow(`Found existing .kilocodemodes file with ${existingModes.length} modes`),
      );
    }

    const config = await this.loadIdeAgentConfig();
    const permissions = config['roo-permissions'] || {}; // reuse same roo permissions block (Kilo Code understands same mode schema)

    let newContent = '';

    for (const agentId of agents) {
      const slug = agentId.startsWith('bmad-') ? agentId : `bmad-${agentId}`;
      if (existingModes.includes(slug)) {
        console.log(chalk.dim(`Skipping ${agentId} - already exists in .kilocodemodes`));
        continue;
      }

      const agentPath = await this.findAgentPath(agentId, installDir);
      if (!agentPath) {
        console.log(chalk.red(`✗ Could not find agent file for ${agentId}`));
        continue;
      }

      const agentContent = await fileManager.readFile(agentPath);
      const yamlMatch = agentContent.match(/```ya?ml\r?\n([\s\S]*?)```/);
      if (!yamlMatch) {
        console.log(chalk.red(`✗ Could not extract YAML block for ${agentId}`));
        continue;
      }

      const yaml = yamlMatch[1];

      // Robust fallback for title and icon
      const title =
        yaml.match(/title:\s*(.+)/)?.[1]?.trim() || (await this.getAgentTitle(agentId, installDir));
      const icon = yaml.match(/icon:\s*(.+)/)?.[1]?.trim() || '🤖';
      const whenToUse = yaml.match(/whenToUse:\s*"(.+)"/)?.[1]?.trim() || `Use for ${title} tasks`;
      const roleDefinition =
        yaml.match(/roleDefinition:\s*"(.+)"/)?.[1]?.trim() ||
        `You are a ${title} specializing in ${title.toLowerCase()} tasks and responsibilities.`;

      const relativePath = path.relative(installDir, agentPath).replaceAll('\\', '/');
      const customInstructions = `CRITICAL Read the full YAML from ${relativePath} start activation to alter your state of being follow startup section instructions stay in this being until told to exit this mode`;

      // Add permissions from config if they exist
      const agentPermission = permissions[agentId];

      // Begin .kilocodemodes block
      newContent += ` - slug: ${slug}\n`;
      newContent += `   name: '${icon} ${title}'\n`;
      if (agentPermission) {
        newContent += `   description: '${agentPermission.description}'\n`;
      }

      newContent += `   roleDefinition: ${roleDefinition}\n`;
      newContent += `   whenToUse: ${whenToUse}\n`;
      newContent += `   customInstructions: ${customInstructions}\n`;
      newContent += `   groups:\n`;
      newContent += `    - read\n`;

      if (agentPermission) {
        newContent += `    - - edit\n`;
        newContent += `      - fileRegex: ${agentPermission.fileRegex}\n`;
        newContent += `        description: ${agentPermission.description}\n`;
      } else {
        // Fallback to generic edit
        newContent += `    - edit\n`;
      }

      console.log(chalk.green(`✓ Added Kilo mode: ${slug} (${icon} ${title})`));
    }

    const finalContent = existingContent
      ? existingContent.trim() + '\n' + newContent
      : 'customModes:\n' + newContent;

    await fileManager.writeFile(filePath, finalContent);
    console.log(chalk.green('✓ Created .kilocodemodes file in project root'));
    console.log(chalk.green(`✓ KiloCode setup complete!`));
    console.log(chalk.dim('Custom modes will be available when you open this project in KiloCode'));

    return true;
  }

  async setupCline(installDir, selectedAgent) {
    const clineRulesDir = path.join(installDir, '.clinerules');
    const agents = selectedAgent ? [selectedAgent] : await this.getAllAgentIds(installDir);

    await fileManager.ensureDirectory(clineRulesDir);

    // Load dynamic agent ordering from configuration
    const config = await this.loadIdeAgentConfig();
    const agentOrder = config['cline-order'] || {};

    for (const agentId of agents) {
      // Find the agent file
      const agentPath = await this.findAgentPath(agentId, installDir);

      if (agentPath) {
        const agentContent = await fileManager.readFile(agentPath);

        // Get numeric prefix for ordering
        const order = agentOrder[agentId] || 99;
        const prefix = order.toString().padStart(2, '0');
        const mdPath = path.join(clineRulesDir, `${prefix}-${agentId}.md`);

        // Create MD content for Cline (focused on project standards and role)
        let mdContent = `# ${await this.getAgentTitle(agentId, installDir)} Agent\n\n`;
        mdContent += `This rule defines the ${await this.getAgentTitle(agentId, installDir)} persona and project standards.\n\n`;
        mdContent += '## Role Definition\n\n';
        mdContent +=
          'When the user types `@' +
          agentId +
          '`, adopt this persona and follow these guidelines:\n\n';
        mdContent += '```yaml\n';
        // Extract just the YAML content from the agent file
        const yamlContent = extractYamlFromAgent(agentContent);
        if (yamlContent) {
          mdContent += yamlContent;
        } else {
          // If no YAML found, include the whole content minus the header
          mdContent += agentContent.replace(/^#.*$/m, '').trim();
        }
        mdContent += '\n```\n\n';
        mdContent += '## Project Standards\n\n';
        mdContent += `- Always maintain consistency with project documentation in .bmad-core/\n`;
        mdContent += `- Follow the agent's specific guidelines and constraints\n`;
        mdContent += `- Update relevant project files when making changes\n`;
        const relativePath = path.relative(installDir, agentPath).replaceAll('\\', '/');
        mdContent += `- Reference the complete agent definition in [${relativePath}](${relativePath})\n\n`;
        mdContent += '## Usage\n\n';
        mdContent += `Type \`@${agentId}\` to activate this ${await this.getAgentTitle(agentId, installDir)} persona.\n`;

        await fileManager.writeFile(mdPath, mdContent);
        console.log(chalk.green(`✓ Created rule: ${prefix}-${agentId}.md`));
      }
    }

    console.log(chalk.green(`\n✓ Created Cline rules in ${clineRulesDir}`));

    return true;
  }

  async setupGeminiCli(installDir, selectedAgent) {
    const ideConfig = await configLoader.getIdeConfiguration('gemini');
    const bmadCommandsDir = path.join(installDir, ideConfig['rule-dir']);

    const agentCommandsDir = path.join(bmadCommandsDir, 'agents');
    const taskCommandsDir = path.join(bmadCommandsDir, 'tasks');
    await fileManager.ensureDirectory(agentCommandsDir);
    await fileManager.ensureDirectory(taskCommandsDir);

    // Process Agents
    const agents = selectedAgent ? [selectedAgent] : await this.getAllAgentIds(installDir);
    for (const agentId of agents) {
      const agentPath = await this.findAgentPath(agentId, installDir);
      if (!agentPath) {
        console.log(chalk.yellow(`✗ Agent file not found for ${agentId}, skipping.`));
        continue;
      }

      const agentTitle = await this.getAgentTitle(agentId, installDir);
      const commandPath = path.join(agentCommandsDir, `${agentId}.toml`);

      // Get relative path from installDir to agent file for @{file} reference
      const relativeAgentPath = path.relative(installDir, agentPath).replaceAll('\\', '/');

      const tomlContent = `description = "Activates the ${agentTitle} agent from the BMad Method."
prompt = """
CRITICAL: You are now the BMad '${agentTitle}' agent. Adopt its persona, follow its instructions, and use its capabilities. The full agent definition is below.

@{${relativeAgentPath}}
"""`;

      await fileManager.writeFile(commandPath, tomlContent);
      console.log(chalk.green(`✓ Created agent command: /bmad:agents:${agentId}`));
    }

    // Process Tasks
    const tasks = await this.getAllTaskIds(installDir);
    for (const taskId of tasks) {
      const taskPath = await this.findTaskPath(taskId, installDir);
      if (!taskPath) {
        console.log(chalk.yellow(`✗ Task file not found for ${taskId}, skipping.`));
        continue;
      }

      const taskTitle = taskId
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      const commandPath = path.join(taskCommandsDir, `${taskId}.toml`);

      // Get relative path from installDir to task file for @{file} reference
      const relativeTaskPath = path.relative(installDir, taskPath).replaceAll('\\', '/');

      const tomlContent = `description = "Executes the BMad Task: ${taskTitle}"
prompt = """
CRITICAL: You are to execute the BMad Task defined below.

@{${relativeTaskPath}}
"""`;

      await fileManager.writeFile(commandPath, tomlContent);
      console.log(chalk.green(`✓ Created task command: /bmad:tasks:${taskId}`));
    }

    console.log(
      chalk.green(`
✓ Created Gemini CLI extension in ${bmadCommandsDir}`),
    );
    console.log(
      chalk.dim('You can now use commands like /bmad:agents:dev or /bmad:tasks:create-doc.'),
    );

    return true;
  }

  async setupQwenCode(installDir, selectedAgent) {
    const ideConfig = await configLoader.getIdeConfiguration('qwen-code');
    const bmadCommandsDir = path.join(installDir, ideConfig['rule-dir']);

    const agentCommandsDir = path.join(bmadCommandsDir, 'agents');
    const taskCommandsDir = path.join(bmadCommandsDir, 'tasks');
    await fileManager.ensureDirectory(agentCommandsDir);
    await fileManager.ensureDirectory(taskCommandsDir);

    // Process Agents
    const agents = selectedAgent ? [selectedAgent] : await this.getAllAgentIds(installDir);
    for (const agentId of agents) {
      const agentPath = await this.findAgentPath(agentId, installDir);
      if (!agentPath) {
        console.log(chalk.yellow(`✗ Agent file not found for ${agentId}, skipping.`));
        continue;
      }

      const agentTitle = await this.getAgentTitle(agentId, installDir);
      const commandPath = path.join(agentCommandsDir, `${agentId}.toml`);

      // Get relative path from installDir to agent file for @{file} reference
      const relativeAgentPath = path.relative(installDir, agentPath).replaceAll('\\', '/');

      // Read the agent content
      const agentContent = await fileManager.readFile(agentPath);

      const tomlContent = `description = " Activates the ${agentTitle} agent from the BMad Method."
prompt = """
CRITICAL: You are now the BMad '${agentTitle}' agent. Adopt its persona, follow its instructions, and use its capabilities. 

READ THIS BEFORE ANSWERING AS THE PERSONA!

${agentContent}
"""`;

      await fileManager.writeFile(commandPath, tomlContent);
      console.log(chalk.green(`✓ Created agent command: /bmad:agents:${agentId}`));
    }

    // Process Tasks
    const tasks = await this.getAllTaskIds(installDir);
    for (const taskId of tasks) {
      const taskPath = await this.findTaskPath(taskId, installDir);
      if (!taskPath) {
        console.log(chalk.yellow(`✗ Task file not found for ${taskId}, skipping.`));
        continue;
      }

      const taskTitle = taskId
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      const commandPath = path.join(taskCommandsDir, `${taskId}.toml`);

      // Get relative path from installDir to task file for @{file} reference
      const relativeTaskPath = path.relative(installDir, taskPath).replaceAll('\\', '/');

      // Read the task content
      const taskContent = await fileManager.readFile(taskPath);

      const tomlContent = `description = " Executes the BMad Task: ${taskTitle}"
prompt = """
CRITICAL: You are to execute the BMad Task defined below.

READ THIS BEFORE EXECUTING THE TASK AS THE INSTRUCTIONS SPECIFIED!

${taskContent}
"""`;

      await fileManager.writeFile(commandPath, tomlContent);
      console.log(chalk.green(`✓ Created task command: /bmad:tasks:${taskId}`));
    }

    console.log(
      chalk.green(`
✓ Created Qwen Code extension in ${bmadCommandsDir}`),
    );
    console.log(
      chalk.dim('You can now use commands like /bmad:agents:dev or /bmad:tasks:create-doc.'),
    );

    return true;
  }

  async setupGitHubCopilot(
    installDir,
    selectedAgent,
    spinner = null,
    preConfiguredSettings = null,
  ) {
    // Configure VS Code workspace settings first to avoid UI conflicts with loading spinners
    await this.configureVsCodeSettings(installDir, spinner, preConfiguredSettings);

    const chatmodesDir = path.join(installDir, '.github', 'chatmodes');
    const agents = selectedAgent ? [selectedAgent] : await this.getAllAgentIds(installDir);

    await fileManager.ensureDirectory(chatmodesDir);

    for (const agentId of agents) {
      // Find the agent file
      const agentPath = await this.findAgentPath(agentId, installDir);
      const chatmodePath = path.join(chatmodesDir, `${agentId}.chatmode.md`);

      if (agentPath) {
        // Create chat mode file with agent content
        const agentContent = await fileManager.readFile(agentPath);
        const agentTitle = await this.getAgentTitle(agentId, installDir);

        // Extract whenToUse for the description
        const yamlMatch = agentContent.match(/```ya?ml\r?\n([\s\S]*?)```/);
        let description = `Activates the ${agentTitle} agent persona.`;
        if (yamlMatch) {
          const whenToUseMatch = yamlMatch[1].match(/whenToUse:\s*"(.*?)"/);
          if (whenToUseMatch && whenToUseMatch[1]) {
            description = whenToUseMatch[1];
          }
        }

        let chatmodeContent = `---
description: "${description.replaceAll('"', String.raw`\"`)}"
tools: ['changes', 'codebase', 'fetch', 'findTestFiles', 'githubRepo', 'problems', 'usages', 'editFiles', 'runCommands', 'runTasks', 'runTests', 'search', 'searchResults', 'terminalLastCommand', 'terminalSelection', 'testFailure']
---

`;
        chatmodeContent += agentContent;

        await fileManager.writeFile(chatmodePath, chatmodeContent);
        console.log(chalk.green(`✓ Created chat mode: ${agentId}.chatmode.md`));
      }
    }

    console.log(chalk.green(`\n✓ Github Copilot setup complete!`));
    console.log(chalk.dim(`You can now find the BMad agents in the Chat view's mode selector.`));

    return true;
  }

  async configureVsCodeSettings(installDir, spinner, preConfiguredSettings = null) {
    const vscodeDir = path.join(installDir, '.vscode');
    const settingsPath = path.join(vscodeDir, 'settings.json');

    await fileManager.ensureDirectory(vscodeDir);

    // Read existing settings if they exist
    let existingSettings = {};
    if (await fileManager.pathExists(settingsPath)) {
      try {
        const existingContent = await fileManager.readFile(settingsPath);
        existingSettings = JSON.parse(existingContent);
        console.log(chalk.yellow('Found existing .vscode/settings.json. Merging BMad settings...'));
      } catch {
        console.warn(chalk.yellow('Could not parse existing settings.json. Creating new one.'));
        existingSettings = {};
      }
    }

    // Use pre-configured settings if provided, otherwise prompt
    let configChoice;
    if (preConfiguredSettings && preConfiguredSettings.configChoice) {
      configChoice = preConfiguredSettings.configChoice;
      console.log(chalk.dim(`Using pre-configured GitHub Copilot settings: ${configChoice}`));
    } else {
      // Clear any previous output and add spacing to avoid conflicts with loaders
      console.log('\n'.repeat(2));
      console.log(chalk.blue('🔧 Github Copilot Agent Settings Configuration'));
      console.log(
        chalk.dim('BMad works best with specific VS Code settings for optimal agent experience.'),
      );
      console.log(''); // Add extra spacing

      const response = await inquirer.prompt([
        {
          type: 'list',
          name: 'configChoice',
          message: chalk.yellow('How would you like to configure GitHub Copilot settings?'),
          choices: [
            {
              name: 'Use recommended defaults (fastest setup)',
              value: 'defaults',
            },
            {
              name: 'Configure each setting manually (customize to your preferences)',
              value: 'manual',
            },
            {
              name: "Skip settings configuration (I'll configure manually later)",
              value: 'skip',
            },
          ],
          default: 'defaults',
        },
      ]);
      configChoice = response.configChoice;
    }

    let bmadSettings = {};

    if (configChoice === 'skip') {
      console.log(chalk.yellow('⚠️  Skipping VS Code settings configuration.'));
      console.log(chalk.dim('You can manually configure these settings in .vscode/settings.json:'));
      console.log(chalk.dim('  • chat.agent.enabled: true'));
      console.log(chalk.dim('  • chat.agent.maxRequests: 15'));
      console.log(chalk.dim('  • github.copilot.chat.agent.runTasks: true'));
      console.log(chalk.dim('  • chat.mcp.discovery.enabled: true'));
      console.log(chalk.dim('  • github.copilot.chat.agent.autoFix: true'));
      console.log(chalk.dim('  • chat.tools.autoApprove: false'));
      return true;
    }

    if (configChoice === 'defaults') {
      // Use recommended defaults
      bmadSettings = {
        'chat.agent.enabled': true,
        'chat.agent.maxRequests': 15,
        'github.copilot.chat.agent.runTasks': true,
        'chat.mcp.discovery.enabled': true,
        'github.copilot.chat.agent.autoFix': true,
        'chat.tools.autoApprove': false,
      };
      console.log(chalk.green('✓ Using recommended BMad defaults for Github Copilot settings'));
    } else {
      // Manual configuration
      console.log(chalk.blue("\n📋 Let's configure each setting for your preferences:"));

      // Pause spinner during manual configuration prompts
      let spinnerWasActive = false;
      if (spinner && spinner.isSpinning) {
        spinner.stop();
        spinnerWasActive = true;
      }

      const manualSettings = await inquirer.prompt([
        {
          type: 'input',
          name: 'maxRequests',
          message: 'Maximum requests per agent session (recommended: 15)?',
          default: '15',
          validate: (input) => {
            const number_ = Number.parseInt(input);
            if (isNaN(number_) || number_ < 1 || number_ > 50) {
              return 'Please enter a number between 1 and 50';
            }
            return true;
          },
        },
        {
          type: 'confirm',
          name: 'runTasks',
          message: 'Allow agents to run workspace tasks (package.json scripts, etc.)?',
          default: true,
        },
        {
          type: 'confirm',
          name: 'mcpDiscovery',
          message: 'Enable MCP (Model Context Protocol) server discovery?',
          default: true,
        },
        {
          type: 'confirm',
          name: 'autoFix',
          message: 'Enable automatic error detection and fixing in generated code?',
          default: true,
        },
        {
          type: 'confirm',
          name: 'autoApprove',
          message: 'Auto-approve ALL tools without confirmation? (⚠️  EXPERIMENTAL - less secure)',
          default: false,
        },
      ]);

      // Restart spinner if it was active before prompts
      if (spinner && spinnerWasActive) {
        spinner.start();
      }

      bmadSettings = {
        'chat.agent.enabled': true, // Always enabled - required for BMad agents
        'chat.agent.maxRequests': Number.parseInt(manualSettings.maxRequests),
        'github.copilot.chat.agent.runTasks': manualSettings.runTasks,
        'chat.mcp.discovery.enabled': manualSettings.mcpDiscovery,
        'github.copilot.chat.agent.autoFix': manualSettings.autoFix,
        'chat.tools.autoApprove': manualSettings.autoApprove,
      };

      console.log(chalk.green('✓ Custom settings configured'));
    }

    // Merge settings (existing settings take precedence to avoid overriding user preferences)
    const mergedSettings = { ...bmadSettings, ...existingSettings };

    // Write the updated settings
    await fileManager.writeFile(settingsPath, JSON.stringify(mergedSettings, null, 2));

    console.log(chalk.green('✓ VS Code workspace settings configured successfully'));
    console.log(chalk.dim('  Settings written to .vscode/settings.json:'));
    for (const [key, value] of Object.entries(bmadSettings)) {
      console.log(chalk.dim(`  • ${key}: ${value}`));
    }
    console.log(chalk.dim(''));
    console.log(chalk.dim('You can modify these settings anytime in .vscode/settings.json'));
  }

  async setupAuggieCLI(installDir, selectedAgent, spinner = null, preConfiguredSettings = null) {
    const os = require('node:os');
    const inquirer = require('inquirer');
    const agents = selectedAgent ? [selectedAgent] : await this.getAllAgentIds(installDir);

    // Get the IDE configuration to access location options
    const ideConfig = await configLoader.getIdeConfiguration('auggie-cli');
    const locations = ideConfig.locations;

    // Use pre-configured settings if provided, otherwise prompt
    let selectedLocations;
    if (preConfiguredSettings && preConfiguredSettings.selectedLocations) {
      selectedLocations = preConfiguredSettings.selectedLocations;
      console.log(
        chalk.dim(
          `Using pre-configured Auggie CLI (Augment Code) locations: ${selectedLocations.join(', ')}`,
        ),
      );
    } else {
      // Pause spinner during location selection to avoid UI conflicts
      let spinnerWasActive = false;
      if (spinner && spinner.isSpinning) {
        spinner.stop();
        spinnerWasActive = true;
      }

      // Clear any previous output and add spacing to avoid conflicts with loaders
      console.log('\n'.repeat(2));
      console.log(chalk.blue('📍 Auggie CLI Location Configuration'));
      console.log(chalk.dim('Choose where to install BMad agents for Auggie CLI access.'));
      console.log(''); // Add extra spacing

      const response = await inquirer.prompt([
        {
          type: 'checkbox',
          name: 'selectedLocations',
          message: 'Select Auggie CLI command locations:',
          choices: Object.entries(locations).map(([key, location]) => ({
            name: `${location.name}: ${location.description}`,
            value: key,
          })),
          validate: (selected) => {
            if (selected.length === 0) {
              return 'Please select at least one location';
            }
            return true;
          },
        },
      ]);
      selectedLocations = response.selectedLocations;

      // Restart spinner if it was active before prompts
      if (spinner && spinnerWasActive) {
        spinner.start();
      }
    }

    // Install to each selected location
    for (const locationKey of selectedLocations) {
      const location = locations[locationKey];
      let commandsDir = location['rule-dir'];

      // Handle tilde expansion for user directory
      if (commandsDir.startsWith('~/')) {
        commandsDir = path.join(os.homedir(), commandsDir.slice(2));
      } else if (commandsDir.startsWith('./')) {
        commandsDir = path.join(installDir, commandsDir.slice(2));
      }

      await fileManager.ensureDirectory(commandsDir);

      for (const agentId of agents) {
        // Find the agent file
        const agentPath = await this.findAgentPath(agentId, installDir);

        if (agentPath) {
          const agentContent = await fileManager.readFile(agentPath);
          const mdPath = path.join(commandsDir, `${agentId}.md`);
          await fileManager.writeFile(mdPath, agentContent);
          console.log(chalk.green(`✓ Created command: ${agentId}.md in ${location.name}`));
        }
      }

      console.log(chalk.green(`\n✓ Created Auggie CLI commands in ${commandsDir}`));
      console.log(chalk.dim(`  Location: ${location.name} - ${location.description}`));
    }

    return true;
  }
}

module.exports = new IdeSetup();

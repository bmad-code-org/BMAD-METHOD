const path = require('node:path');
const os = require('node:os');
const fs = require('fs-extra');
const yaml = require('yaml');
const { BaseIdeSetup } = require('./_base-ide');
const { WorkflowCommandGenerator } = require('./shared/workflow-command-generator');
const { AgentCommandGenerator } = require('./shared/agent-command-generator');
const { TaskToolCommandGenerator } = require('./shared/task-tool-command-generator');
const { getTasksFromBmad } = require('./shared/bmad-artifacts');
const { toDashPath, customAgentDashName } = require('./shared/path-utils');
const prompts = require('../../../lib/prompts');

/**
 * Codex setup handler (CLI mode)
 */
class CodexSetup extends BaseIdeSetup {
  constructor() {
    super('codex', 'Codex', false);
  }

  /**
   * Setup Codex configuration
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   * @param {Object} options - Setup options
   */
  async setup(projectDir, bmadDir, options = {}) {
    if (!options.silent) await prompts.log.info(`Setting up ${this.name}...`);

    // Always use CLI mode
    const mode = 'cli';

    const { artifacts, counts } = await this.collectClaudeArtifacts(projectDir, bmadDir, options);

    // Clean up old .codex/prompts locations (both global and project)
    const oldGlobalDir = this.getOldCodexPromptDir(null, 'global');
    await this.clearOldBmadFiles(oldGlobalDir, options);
    const oldProjectDir = this.getOldCodexPromptDir(projectDir, 'project');
    await this.clearOldBmadFiles(oldProjectDir, options);

    // Install to .agents/skills
    const destDir = this.getCodexSkillsDir(projectDir);
    await fs.ensureDir(destDir);
    await this.clearOldBmadSkills(destDir, options);

    // Collect and write agent skills
    const agentGen = new AgentCommandGenerator(this.bmadFolderName);
    const { artifacts: agentArtifacts } = await agentGen.collectAgentArtifacts(bmadDir, options.selectedModules || []);
    const agentCount = await this.writeSkillArtifacts(destDir, agentArtifacts, 'agent-launcher');

    // Collect and write task skills
    const tasks = await getTasksFromBmad(bmadDir, options.selectedModules || []);
    const taskArtifacts = [];
    for (const task of tasks) {
      const content = await this.readAndProcessWithProject(
        task.path,
        {
          module: task.module,
          name: task.name,
        },
        projectDir,
      );
      taskArtifacts.push({
        type: 'task',
        name: task.name,
        displayName: task.name,
        module: task.module,
        path: task.path,
        sourcePath: task.path,
        relativePath: path.join(task.module, 'tasks', `${task.name}.md`),
        content,
      });
    }

    const ttGen = new TaskToolCommandGenerator(this.bmadFolderName);
    const taskSkillArtifacts = taskArtifacts.map((artifact) => ({
      ...artifact,
      content: ttGen.generateCommandContent(artifact, artifact.type),
    }));
    const tasksWritten = await this.writeSkillArtifacts(destDir, taskSkillArtifacts, 'task');

    // Collect and write workflow skills
    const workflowGenerator = new WorkflowCommandGenerator(this.bmadFolderName);
    const { artifacts: workflowArtifacts } = await workflowGenerator.collectWorkflowArtifacts(bmadDir);
    const workflowCount = await this.writeSkillArtifacts(destDir, workflowArtifacts, 'workflow-command');

    const written = agentCount + workflowCount + tasksWritten;

    if (!options.silent) {
      await prompts.log.success(
        `${this.name} configured: ${counts.agents} agents, ${counts.workflows} workflows, ${counts.tasks} tasks, ${written} skills → ${destDir}`,
      );
    }

    return {
      success: true,
      mode,
      artifacts,
      counts,
      destination: destDir,
      written,
    };
  }

  /**
   * Detect Codex installation by checking for BMAD skills
   */
  async detect(projectDir) {
    const dir = this.getCodexSkillsDir(projectDir || process.cwd());

    if (await fs.pathExists(dir)) {
      try {
        const entries = await fs.readdir(dir);
        if (entries && entries.some((entry) => entry && typeof entry === 'string' && entry.startsWith('bmad'))) {
          return true;
        }
      } catch {
        // Ignore errors
      }
    }

    return false;
  }

  /**
   * Collect Claude-style artifacts for Codex export.
   * Returns the normalized artifact list for further processing.
   */
  async collectClaudeArtifacts(projectDir, bmadDir, options = {}) {
    const selectedModules = options.selectedModules || [];
    const artifacts = [];

    // Generate agent launchers
    const agentGen = new AgentCommandGenerator(this.bmadFolderName);
    const { artifacts: agentArtifacts } = await agentGen.collectAgentArtifacts(bmadDir, selectedModules);

    for (const artifact of agentArtifacts) {
      artifacts.push({
        type: 'agent',
        module: artifact.module,
        sourcePath: artifact.sourcePath,
        relativePath: artifact.relativePath,
        content: artifact.content,
      });
    }

    const tasks = await getTasksFromBmad(bmadDir, selectedModules);
    for (const task of tasks) {
      const content = await this.readAndProcessWithProject(
        task.path,
        {
          module: task.module,
          name: task.name,
        },
        projectDir,
      );

      artifacts.push({
        type: 'task',
        name: task.name,
        displayName: task.name,
        module: task.module,
        path: task.path,
        sourcePath: task.path,
        relativePath: path.join(task.module, 'tasks', `${task.name}.md`),
        content,
      });
    }

    const workflowGenerator = new WorkflowCommandGenerator(this.bmadFolderName);
    const { artifacts: workflowArtifacts, counts: workflowCounts } = await workflowGenerator.collectWorkflowArtifacts(bmadDir);
    artifacts.push(...workflowArtifacts);

    return {
      artifacts,
      counts: {
        agents: agentArtifacts.length,
        tasks: tasks.length,
        workflows: workflowCounts.commands,
        workflowLaunchers: workflowCounts.launchers,
      },
    };
  }

  getCodexSkillsDir(projectDir) {
    if (!projectDir) {
      throw new Error('projectDir is required for project-scoped skill installation');
    }
    return path.join(projectDir, '.agents', 'skills');
  }

  /**
   * Get the old .codex/prompts directory for cleanup purposes
   */
  getOldCodexPromptDir(projectDir = null, location = 'global') {
    if (location === 'project' && projectDir) {
      return path.join(projectDir, '.codex', 'prompts');
    }
    return path.join(os.homedir(), '.codex', 'prompts');
  }

  /**
   * Write artifacts as Agent Skills (agentskills.io format).
   * Each artifact becomes a directory containing SKILL.md.
   * @param {string} destDir - Base skills directory
   * @param {Array} artifacts - Artifacts to write
   * @param {string} artifactType - Type filter (e.g., 'agent-launcher', 'workflow-command', 'task')
   * @returns {number} Number of skills written
   */
  async writeSkillArtifacts(destDir, artifacts, artifactType) {
    let writtenCount = 0;

    for (const artifact of artifacts) {
      // Filter by type if the artifact has a type field
      if (artifact.type && artifact.type !== artifactType) {
        continue;
      }

      // Get the dash-format name (e.g., bmad-bmm-create-prd.md) and remove .md
      const flatName = toDashPath(artifact.relativePath);
      const skillName = flatName.replace(/\.md$/, '');

      // Create skill directory
      const skillDir = path.join(destDir, skillName);
      await fs.ensureDir(skillDir);

      // Transform content: rewrite frontmatter for skills format
      const skillContent = this.transformToSkillFormat(artifact.content, skillName);

      // Write SKILL.md with platform-native line endings
      const platformContent = skillContent.replaceAll('\n', os.EOL);
      await fs.writeFile(path.join(skillDir, 'SKILL.md'), platformContent, 'utf8');
      writtenCount++;
    }

    return writtenCount;
  }

  /**
   * Transform artifact content from Codex prompt format to Agent Skills format.
   * Removes disable-model-invocation, ensures name matches directory.
   * @param {string} content - Original content with YAML frontmatter
   * @param {string} skillName - Skill name (must match directory name)
   * @returns {string} Transformed content
   */
  transformToSkillFormat(content, skillName) {
    // Normalize line endings so body matches rebuilt frontmatter (both LF)
    content = content.replaceAll('\r\n', '\n').replaceAll('\r', '\n');

    // Parse frontmatter
    const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
    if (!fmMatch) {
      // No frontmatter -- wrap with minimal frontmatter
      const fm = yaml.stringify({ name: skillName, description: skillName }).trimEnd();
      return `---\n${fm}\n---\n\n${content}`;
    }

    const frontmatter = fmMatch[1];
    const body = fmMatch[2];

    // Parse frontmatter with yaml library to handle all quoting variants
    let description;
    try {
      const parsed = yaml.parse(frontmatter);
      description = parsed?.description || `${skillName} skill`;
    } catch {
      description = `${skillName} skill`;
    }

    // Build new frontmatter with only skills-spec fields, let yaml handle quoting
    const newFrontmatter = yaml.stringify({ name: skillName, description }, { lineWidth: 0 }).trimEnd();
    return `---\n${newFrontmatter}\n---\n${body}`;
  }

  /**
   * Remove existing BMAD skill directories from the skills directory.
   */
  async clearOldBmadSkills(destDir, options = {}) {
    if (!(await fs.pathExists(destDir))) {
      return;
    }

    let entries;
    try {
      entries = await fs.readdir(destDir);
    } catch (error) {
      if (!options.silent) await prompts.log.warn(`Warning: Could not read directory ${destDir}: ${error.message}`);
      return;
    }

    if (!entries || !Array.isArray(entries)) {
      return;
    }

    for (const entry of entries) {
      if (!entry || typeof entry !== 'string') {
        continue;
      }
      if (!entry.startsWith('bmad')) {
        continue;
      }

      const entryPath = path.join(destDir, entry);
      try {
        await fs.remove(entryPath);
      } catch (error) {
        if (!options.silent) {
          await prompts.log.message(`  Skipping ${entry}: ${error.message}`);
        }
      }
    }
  }

  /**
   * Clean old BMAD files from legacy .codex/prompts directories.
   */
  async clearOldBmadFiles(destDir, options = {}) {
    if (!(await fs.pathExists(destDir))) {
      return;
    }

    let entries;
    try {
      entries = await fs.readdir(destDir);
    } catch (error) {
      // Directory exists but can't be read - skip cleanup
      if (!options.silent) await prompts.log.warn(`Warning: Could not read directory ${destDir}: ${error.message}`);
      return;
    }

    if (!entries || !Array.isArray(entries)) {
      return;
    }

    for (const entry of entries) {
      // Skip non-strings or undefined entries
      if (!entry || typeof entry !== 'string') {
        continue;
      }
      if (!entry.startsWith('bmad')) {
        continue;
      }

      const entryPath = path.join(destDir, entry);
      try {
        await fs.remove(entryPath);
      } catch (error) {
        if (!options.silent) {
          await prompts.log.message(`  Skipping ${entry}: ${error.message}`);
        }
      }
    }
  }

  async readAndProcessWithProject(filePath, metadata, projectDir) {
    const rawContent = await fs.readFile(filePath, 'utf8');
    const content = rawContent.replaceAll('\r\n', '\n').replaceAll('\r', '\n');
    return super.processContent(content, metadata, projectDir);
  }

  /**
   * Get instructions for project-specific installation
   * @param {string} projectDir - Optional project directory
   * @param {string} destDir - Optional destination directory
   * @returns {string} Instructions text
   */
  getProjectSpecificInstructions(projectDir = null, destDir = null) {
    const lines = [
      'Project-Specific Codex Configuration',
      '',
      `Skills installed to: ${destDir || '<project>/.agents/skills'}`,
      '',
      'Codex automatically discovers skills in .agents/skills/ at and above the current directory and in your home directory.',
      'No additional configuration is needed.',
    ];

    return lines.join('\n');
  }

  /**
   * Cleanup Codex configuration - cleans both new .agents/skills and old .codex/prompts
   */
  async cleanup(projectDir = null) {
    // Clean old .codex/prompts locations
    const oldGlobalDir = this.getOldCodexPromptDir(null, 'global');
    await this.clearOldBmadFiles(oldGlobalDir);

    if (projectDir) {
      const oldProjectDir = this.getOldCodexPromptDir(projectDir, 'project');
      await this.clearOldBmadFiles(oldProjectDir);

      // Clean new .agents/skills location
      const destDir = this.getCodexSkillsDir(projectDir);
      await this.clearOldBmadSkills(destDir);
    }
  }

  /**
   * Install a custom agent launcher for Codex as an Agent Skill
   * @param {string} projectDir - Project directory
   * @param {string} agentName - Agent name (e.g., "fred-commit-poet")
   * @param {string} agentPath - Path to compiled agent (relative to project root)
   * @param {Object} metadata - Agent metadata
   * @returns {Object|null} Info about created skill
   */
  async installCustomAgentLauncher(projectDir, agentName, agentPath, metadata) {
    const destDir = this.getCodexSkillsDir(projectDir);

    // Skill name from the dash name (without .md)
    const skillName = customAgentDashName(agentName).replace(/\.md$/, '');
    const skillDir = path.join(destDir, skillName);
    await fs.ensureDir(skillDir);

    const description = metadata?.description || `${agentName} agent`;
    const fm = yaml.stringify({ name: skillName, description }).trimEnd();
    const skillContent =
      `---\n${fm}\n---\n` +
      "\nYou must fully embody this agent's persona and follow all activation instructions exactly as specified. NEVER break character until given an exit command.\n" +
      '\n<agent-activation CRITICAL="TRUE">\n' +
      `1. LOAD the FULL agent file from @${agentPath}\n` +
      '2. READ its entire contents - this contains the complete agent persona, menu, and instructions\n' +
      '3. FOLLOW every step in the <activation> section precisely\n' +
      '4. DISPLAY the welcome/greeting as instructed\n' +
      '5. PRESENT the numbered menu\n' +
      '6. WAIT for user input before proceeding\n' +
      '</agent-activation>\n';

    // Write with platform-native line endings
    const platformContent = skillContent.replaceAll('\n', os.EOL);
    const skillPath = path.join(skillDir, 'SKILL.md');
    await fs.writeFile(skillPath, platformContent, 'utf8');

    return {
      path: path.relative(projectDir, skillPath),
      command: `$${skillName}`,
    };
  }
}

module.exports = { CodexSetup };

const path = require('node:path');
const fs = require('fs-extra');
const os = require('node:os');
const chalk = require('chalk');
const { BaseIdeSetup } = require('./_base-ide');
const { WorkflowCommandGenerator } = require('./shared/workflow-command-generator');
const { AgentCommandGenerator } = require('./shared/agent-command-generator');
const { getTasksFromBmad } = require('./shared/bmad-artifacts');

/**
 * Mistral Vibe setup handler (CLI mode)
 */
class MistralVibeSetup extends BaseIdeSetup {
  constructor() {
    super('mistral-vibe', 'Mistral Vibe CLI', false);
  }

  /**
   * Setup Mistral Vibe configuration
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   * @param {Object} options - Setup options
   */
  async setup(projectDir, bmadDir, options = {}) {
    console.log(chalk.cyan(`Setting up ${this.name}...`));

    // Always use CLI mode
    const mode = 'cli';

    // Get the skills directory
    const skillsDir = path.join(projectDir, '.vibe', 'skills');
    await fs.ensureDir(skillsDir);
    await this.clearOldBmadFiles(skillsDir);

    // Collect artifacts and write using the same pattern as Codex
    const agentGen = new AgentCommandGenerator(this.bmadFolderName);

    // Collect core and BMM agents separately
    const { artifacts: coreAgents } = await agentGen.collectAgentArtifacts(bmadDir, ['core']);
    const { artifacts: bmmAgents } = await agentGen.collectAgentArtifacts(bmadDir, ['bmm']);

    // Filter bmad-master from BMM agents (it appears in both)
    const filteredBmmAgents = bmmAgents.filter((a) => a.name !== 'bmad-master');

    // Combine: core bmad-master + BMM agents
    const filteredAgentArtifacts = [...coreAgents, ...filteredBmmAgents];

    // Write agent skills with "agent-" or "agent-bmm-" prefix
    const agentCount = await this.writeMistralVibeArtifacts(skillsDir, filteredAgentArtifacts, 'agent');

    // Collect workflows
    const workflowGen = new WorkflowCommandGenerator(this.bmadFolderName);
    const workflows = await workflowGen.loadWorkflowManifest(bmadDir);

    // Filter to only include BMM workflows (matching existing .vibe/skills/)
    const bmmWorkflows = workflows ? workflows.filter((wf) => wf.module === 'bmm') : [];

    // Write workflow skills with "bmm-" prefix
    const workflowCount = await this.writeMistralVibeWorkflows(skillsDir, bmmWorkflows);

    // Write other skills (brainstorming, help, party-mode)
    const otherCount = await this.writeOtherSkills(skillsDir);

    const totalWritten = agentCount + workflowCount + otherCount;

    console.log(chalk.green(`✓ ${this.name} configured:`));
    console.log(chalk.dim(`  - ${totalWritten} skills generated`));
    console.log(chalk.dim(`  - Destination: ${skillsDir}`));

    return { success: true, written: totalWritten, destination: skillsDir };
  }

  /**
   * Clear old BMAD files from the destination directory
   */
  async clearOldBmadFiles(destDir) {
    if (await fs.pathExists(destDir)) {
      const existingFiles = await fs.readdir(destDir);
      for (const file of existingFiles) {
        if (file !== 'README.md') {
          const filePath = path.join(destDir, file);
          const stat = await fs.lstat(filePath);
          if (stat.isDirectory()) {
            await fs.remove(filePath);
          }
        }
      }
    }
  }

  /**
   * Write Mistral Vibe agent artifacts
   */
  async writeMistralVibeArtifacts(destDir, artifacts, prefix = '') {
    let count = 0;
    for (const artifact of artifacts) {
      const skillName =
        prefix === 'agent' ? (artifact.name === 'bmad-master' ? 'agent-bmad-master' : `agent-bmm-${artifact.name}`) : artifact.name;

      const skillDir = path.join(destDir, skillName);
      await fs.ensureDir(skillDir);

      const skillContent = await this.generateAgentSkillContent(artifact, skillName);
      await fs.writeFile(path.join(skillDir, 'SKILL.md'), skillContent);
      count++;
    }
    return count;
  }

  /**
   * Write Mistral Vibe workflow artifacts
   */
  async writeMistralVibeWorkflows(destDir, workflows) {
    let count = 0;
    for (const workflow of workflows) {
      const skillName = `bmm-${workflow.name}`;
      const skillDir = path.join(destDir, skillName);
      await fs.ensureDir(skillDir);

      const skillContent = await this.generateWorkflowSkillContent(workflow, skillName);
      await fs.writeFile(path.join(skillDir, 'SKILL.md'), skillContent);
      count++;
    }
    return count;
  }

  /**
   * Write other skills (brainstorming, help, party-mode)
   */
  async writeOtherSkills(destDir) {
    const otherSkills = [
      { name: 'brainstorming', description: 'Brainstorm Project Ideas with guided facilitation of a brainstorming coach' },
      { name: 'help', description: 'Execute undefined' },
      {
        name: 'party-mode',
        description: 'Orchestrates group discussions between all installed BMAD agents, enabling natural multi-agent conversations',
      },
    ];

    let count = 0;
    for (const skill of otherSkills) {
      const skillDir = path.join(destDir, skill.name);
      await fs.ensureDir(skillDir);

      const skillContent = `---
name: ${skillName}
description: ${skill.description}
license: MIT
compatibility: Mistral Vibe CLI
user-invocable: True
---

# ${skill.name.toUpperCase()}

IT IS CRITICAL THAT YOU FOLLOW THIS COMMAND: LOAD the FULL @.vibe/{bmad-folder}/core/workflows/${skill.name}/workflow.md, READ its entire contents and follow its directions exactly!`;

      await fs.writeFile(path.join(skillDir, 'SKILL.md'), skillContent);
      count++;
    }
    return count;
  }

  async generateAgentSkills(skillsDir, bmadDir, options) {
    // Get agents from both core and bmm modules
    const agentGen = new AgentCommandGenerator(this.bmadFolderName);
    const { artifacts: coreAgents } = await agentGen.collectAgentArtifacts(bmadDir, ['core']);
    const { artifacts: bmmAgents } = await agentGen.collectAgentArtifacts(bmadDir, ['bmm']);
    const allAgents = [...coreAgents, ...bmmAgents];

    let written = 0;
    for (const artifact of allAgents) {
      // Use "agent-" prefix for core, "agent-bmm-" for BMM agents to match existing format
      const skillName = artifact.module === 'bmm' ? `agent-bmm-${artifact.name}` : `agent-${artifact.name}`;
      const skillDir = path.join(skillsDir, skillName);
      await fs.ensureDir(skillDir);

      const skillContent = this.addUserInvocableToContent(artifact.content, {
        ...artifact,
        name: skillName,
      });
      const skillPath = path.join(skillDir, 'SKILL.md');
      await fs.writeFile(skillPath, skillContent);
      written++;
    }

    return written;
  }

  async generateWorkflowSkills(skillsDir, bmadDir) {
    const workflowGen = new WorkflowCommandGenerator(this.bmadFolderName);
    const workflows = await workflowGen.loadWorkflowManifest(bmadDir);

    if (!workflows || workflows.length === 0) {
      return 0;
    }

    let written = 0;
    for (const workflow of workflows) {
      // Add module prefix to workflow names (bmm- for BMM workflows)
      const skillName = workflow.module === 'bmm' ? `bmm-${workflow.name}` : workflow.name;
      const skillDir = path.join(skillsDir, skillName);
      await fs.ensureDir(skillDir);

      // Generate workflow content in the same format as existing skills
      const workflowContent = await this.generateSimpleWorkflowSkillContent(workflow, bmadDir);
      const skillContent = this.addUserInvocableToContent(workflowContent, {
        name: skillName,
        description: workflow.description || `${workflow.name} workflow`,
      });

      const skillPath = path.join(skillDir, 'SKILL.md');
      await fs.writeFile(skillPath, skillContent);
      written++;
    }

    return written;
  }

  async generateSimpleWorkflowSkillContent(workflow, bmadDir) {
    // Generate content in the same format as existing workflow skills
    return `IT IS CRITICAL THAT YOU FOLLOW THIS COMMAND: LOAD the FULL @${workflow.path}, READ its entire contents and follow its directions exactly!`;
  }

  async generateOtherSkills(skillsDir, bmadDir) {
    // Generate additional skills that aren't agents or workflows
    // These are core workflows that don't have the bmm- prefix
    const otherSkills = [
      { name: 'help', description: 'BMAD help system' },
      { name: 'brainstorming', description: 'Brainstorming workflow' },
      { name: 'party-mode', description: 'Multi-agent collaboration mode' },
    ];

    let written = 0;
    for (const skill of otherSkills) {
      const skillDir = path.join(skillsDir, skill.name);
      await fs.ensureDir(skillDir);

      // Create basic skill content
      const skillContent = `---
name: ${skill.name}
description: ${skill.description}
license: MIT
compatibility: Mistral Vibe CLI
user-invocable: True
---

# ${skill.name.toUpperCase()} Skill

This skill provides ${skill.description.toLowerCase()} functionality.`;

      const skillPath = path.join(skillDir, 'SKILL.md');
      await fs.writeFile(skillPath, skillContent);
      written++;
    }

    return written;
  }

  async generateAgentSkillContent(artifact, skillName) {
    const agentName = artifact.name;
    const isBmmAgent = artifact.module === 'bmm';
    const agentPath = isBmmAgent ? `{bmad-folder}/bmm/agents/${agentName}.md` : `{bmad-folder}/core/agents/${agentName}.md`;

    return `---
name: ${skill.name}
description: ${agentName} agent
license: MIT
compatibility: Mistral Vibe CLI
user-invocable: True
---

# Agent ${agentName.toUpperCase()}

You must fully embody this agent's persona and follow all activation instructions exactly as specified. NEVER break character until given an exit command.

<agent-activation CRITICAL="TRUE">
1. LOAD the FULL agent file from @${agentPath}
2. READ its entire contents - this contains the complete agent persona, menu, and instructions
3. Execute ALL activation steps exactly as written in the agent file
4. Follow the agent's persona and menu system precisely
5. Stay in character throughout the session
</agent-activation>`;
  }

  async generateWorkflowSkillContent(workflow, skillName) {
    // Generate workflow skill content in the exact format
    const workflowName = skillName.replace('bmm-', '');

    // Determine the workflow path based on the workflow name
    let workflowPath;
    switch (workflowName) {
      case 'brainstorming':
      case 'party-mode': {
        workflowPath = `{bmad-folder}/core/workflows/${workflowName}/workflow.md`;
        break;
      }
      case 'help': {
        workflowPath = `{bmad-folder}/core/tasks/help.md`;
        break;
      }
      default: {
        // BMM workflows are in various subdirectories
        workflowPath = `{bmad-folder}/bmm/workflows/${workflowName}/workflow.md`;
      }
    }

    return `---
name: ${skill.name}
description: ${this.getWorkflowDescription(workflowName)}
license: MIT
compatibility: Mistral Vibe CLI
user-invocable: True
---

# ${workflowName.toUpperCase()}

IT IS CRITICAL THAT YOU FOLLOW THIS COMMAND: LOAD the FULL @${workflowPath}, READ its entire contents and follow its directions exactly!`;
  }

  generateOtherSkillContent(skill) {
    // Generate other skill content
    const descriptions = {
      brainstorming: 'Brainstorm Project Ideas with guided facilitation of a brainstorming coach',
      help: 'Execute undefined',
      'party-mode': 'Orchestrates group discussions between all installed BMAD agents, enabling natural multi-agent conversations',
    };

    return `---
name: ${skill.name}
description: ${descriptions[skill.name] || skill.name}
license: MIT
compatibility: Mistral Vibe CLI
user-invocable: True
---

# ${skill.name.toUpperCase()}

IT IS CRITICAL THAT YOU FOLLOW THIS COMMAND: LOAD the FULL @.vibe/{bmad-folder}/core/workflows/${skill.name}/workflow.md, READ its entire contents and follow its directions exactly!`;
  }

  getWorkflowDescription(workflowName) {
    const descriptions = {
      'check-implementation-readiness': 'Gate check before implementation',
      'code-review': 'Validate implementation quality',
      'correct-course': 'Handle significant mid-sprint changes',
      'create-architecture': 'Make technical decisions explicit',
      'create-epics-and-stories': 'Break requirements into implementable work',
      'create-excalidraw-dataflow': 'Create data flow diagrams',
      'create-excalidraw-diagram': 'Create diagrams',
      'create-excalidraw-flowchart': 'Create flowcharts',
      'create-excalidraw-wireframe': 'Create wireframes',
      'create-prd': 'Define requirements (FRs/NFRs)',
      'create-product-brief': 'Capture strategic vision',
      'create-story': 'Prepare next story for implementation',
      'create-ux-design': 'Design user experience (when UX matters)',
      'dev-story': 'Implement the story',
      'document-project': 'Document the project',
      'qa-automate': 'Generate tests for existing features',
      'quick-dev': 'Implement from spec or direct instructions',
      'quick-spec': 'Define an ad-hoc change',
      research: 'Validate market, technical, or domain assumptions',
      retrospective: 'Review after epic completion',
      'sprint-planning': 'Initialize tracking (once per project)',
      'sprint-status': 'Track sprint status',
    };
    return descriptions[workflowName] || workflowName;
  }
}

module.exports = { MistralVibeSetup };

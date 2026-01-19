/**
 * Workflow prompt configuration for IDE new chat starters
 *
 * This configuration defines the workflow prompts that appear as suggestions
 * when starting a new chat in VS Code (via chat.promptFilesRecommendations).
 *
 * The implementation-readiness and sprint-planning workflows update the
 * VS Code settings to toggle which prompts are shown based on project phase.
 *
 * Reference: docs/modules/bmm-bmad-method/quick-start.md
 */

const workflowPromptsConfig = {
  // BMad Method Module (bmm) - Static prompts not covered by path files
  bmm: [
    {
      name: 'workflow-init',
      agent: 'bmd-custom-bmm-analyst',
      shortcut: 'WI',
      description: '[WI] Initialize workflow and choose planning track',
      model: 'claude-opus-4.5',
      prompt: '*workflow-init',
    },
    {
      name: 'workflow-status',
      agent: 'bmd-custom-bmm-pm',
      shortcut: 'WS',
      description: '[WS] Check current workflow status and next steps (open a new chat with Ctrl+Shift+Enter)',
      model: 'claude-opus-4.5',
      prompt: '*workflow-status',
    },
    {
      name: 'create-story',
      agent: 'bmd-custom-bmm-sm',
      shortcut: 'CS',
      description: '[CS] Create developer-ready story from epic',
      model: 'gpt-5.2-codex',
      prompt: '*create-story',
    },
    {
      name: 'dev-story',
      agent: 'bmd-custom-bmm-dev',
      shortcut: 'DS',
      description: '[DS] Implement the current story (open a new chat with Ctrl+Shift+Enter)',
      model: 'gpt-5.2-codex',
      prompt: '*dev-story',
    },
    {
      name: 'code-review',
      agent: 'bmd-custom-bmm-dev',
      shortcut: 'CR',
      description: '[CR] Perform code review on implementation',
      model: 'gpt-5.2-codex',
      prompt: '*code-review',
    },
    {
      name: 'retrospective',
      agent: 'bmd-custom-bmm-sm',
      shortcut: 'ER',
      description: '[ER] Run epic retrospective after completion (open a new chat with Ctrl+Shift+Enter)',
      model: 'claude-opus-4.5',
      prompt: '*epic-retrospective',
    },
    {
      name: 'correct-course',
      agent: 'bmd-custom-bmm-sm',
      shortcut: 'CC',
      description: '[CC] Course correction when things go off track',
      model: 'claude-opus-4.5',
      prompt: '*correct-course',
    },
  ],

  // BMad Game Development Module (bmgd) - Static prompts not covered by path files
  bmgd: [
    {
      name: 'game-implement',
      agent: 'bmd-custom-bmgd-game-dev',
      shortcut: 'GI',
      description: '[GI] Implement game feature',
      model: 'gpt-5.2-codex',
      prompt: '*game-implement',
    },
    {
      name: 'game-qa',
      agent: 'bmd-custom-bmgd-game-qa',
      shortcut: 'GQ',
      description: '[GQ] Test and QA game feature (open a new chat with Ctrl+Shift+Enter)',
      model: 'gpt-5.2',
      prompt: '*game-qa',
    },
  ],

  // Core agents (always available)
  core: [
    {
      name: 'list-tasks',
      agent: 'bmd-custom-core-bmad-master',
      shortcut: 'LT',
      description: '[LT] List available tasks',
      model: 'gpt-5-mini',
      prompt: '*list-tasks',
    },
    {
      name: 'list-workflows',
      agent: 'bmd-custom-core-bmad-master',
      shortcut: 'LW',
      description: '[LW] List available workflows',
      model: 'gpt-5-mini',
      prompt: '*list-workflows',
    },
  ],
};

module.exports = { workflowPromptsConfig };

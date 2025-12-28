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
  // BMad Method Module (bmm) - Standard development workflow
  bmm: [
    // ═══════════════════════════════════════════════════════════════════════
    // Phase 1 - Analysis (Optional)
    // ═══════════════════════════════════════════════════════════════════════
    {
      name: 'workflow-init',
      agent: 'bmd-custom-bmm-analyst',
      shortcut: 'WI',
      description: '[WI] Initialize workflow and choose planning track',
      prompt: '*workflow-init',
    },
    {
      name: 'brainstorm',
      agent: 'bmd-custom-bmm-analyst',
      shortcut: 'BP',
      description: '[BP] Brainstorm project ideas and concepts',
      prompt: '*brainstorm-project',
    },
    {
      name: 'workflow-status',
      agent: 'bmd-custom-bmm-pm',
      shortcut: 'WS',
      description: '[WS] Check current workflow status and next steps',
      prompt: '*workflow-status',
    },

    // ═══════════════════════════════════════════════════════════════════════
    // Phase 2 - Planning (Required)
    // ═══════════════════════════════════════════════════════════════════════
    {
      name: 'prd',
      agent: 'bmd-custom-bmm-pm',
      shortcut: 'PD',
      description: '[PD] Create Product Requirements Document (PRD)',
      prompt: '*prd',
    },
    {
      name: 'ux-design',
      agent: 'bmd-custom-bmm-ux-designer',
      shortcut: 'UD',
      description: '[UD] Create UX Design specification',
      prompt: '*ux-design',
    },

    // ═══════════════════════════════════════════════════════════════════════
    // Phase 3 - Solutioning
    // ═══════════════════════════════════════════════════════════════════════
    {
      name: 'create-architecture',
      agent: 'bmd-custom-bmm-architect',
      shortcut: 'CA',
      description: '[CA] Create system architecture document',
      prompt: '*create-architecture',
    },
    {
      name: 'epics-stories',
      agent: 'bmd-custom-bmm-pm',
      shortcut: 'ES',
      description: '[ES] Create Epics and User Stories from PRD',
      prompt: '*epics-stories',
    },
    {
      name: 'implementation-readiness',
      agent: 'bmd-custom-bmm-architect',
      shortcut: 'IR',
      description: '[IR] Check implementation readiness across all docs',
      prompt: '*implementation-readiness',
    },
    {
      name: 'sprint-planning',
      agent: 'bmd-custom-bmm-sm',
      shortcut: 'SP',
      description: '[SP] Initialize sprint planning from epics',
      prompt: '*sprint-planning',
    },

    // ═══════════════════════════════════════════════════════════════════════
    // Phase 4 - Implementation: The "Keep Going" Cycle
    // SM → create-story → DEV → dev-story → code-review → (create-story | retrospective)
    // ═══════════════════════════════════════════════════════════════════════
    {
      name: 'create-story',
      agent: 'bmd-custom-bmm-sm',
      shortcut: 'CS',
      description: '[CS] Create developer-ready story from epic',
      prompt: '*create-story',
    },
    {
      name: 'dev-story',
      agent: 'bmd-custom-bmm-dev',
      shortcut: 'DS',
      description: '[DS] Implement the current story',
      prompt: '*dev-story',
    },
    {
      name: 'code-review',
      agent: 'bmd-custom-bmm-dev',
      shortcut: 'CR',
      description: '[CR] Perform code review on implementation',
      prompt: '*code-review',
    },
    {
      name: 'retrospective',
      agent: 'bmd-custom-bmm-sm',
      shortcut: 'ER',
      description: '[ER] Run epic retrospective after completion',
      prompt: '*epic-retrospective',
    },
    {
      name: 'correct-course',
      agent: 'bmd-custom-bmm-sm',
      shortcut: 'CC',
      description: '[CC] Course correction when things go off track',
      prompt: '*correct-course',
    },
  ],

  // BMad Game Development Module (bmgd)
  bmgd: [
    // Implementation cycle
    {
      name: 'game-implement',
      agent: 'bmd-custom-bmgd-game-dev',
      shortcut: 'GI',
      description: '[GI] Implement game feature',
      prompt: '*game-implement',
    },
    {
      name: 'game-qa',
      agent: 'bmd-custom-bmgd-game-qa',
      shortcut: 'GQ',
      description: '[GQ] Test and QA game feature',
      prompt: '*game-qa',
    },
    // Planning & Design
    {
      name: 'game-design',
      agent: 'bmd-custom-bmgd-game-designer',
      shortcut: 'GD',
      description: '[GD] Design game mechanics and systems',
      prompt: '*game-design',
    },
    {
      name: 'game-architecture',
      agent: 'bmd-custom-bmgd-game-architect',
      shortcut: 'GA',
      description: '[GA] Create game technical architecture',
      prompt: '*game-architecture',
    },
    {
      name: 'game-sprint',
      agent: 'bmd-custom-bmgd-game-scrum-master',
      shortcut: 'GS',
      description: '[GS] Plan game development sprint',
      prompt: '*game-sprint',
    },
  ],

  // Core agents (always available)
  core: [
    {
      name: 'list-tasks',
      agent: 'bmd-custom-core-bmad-master',
      shortcut: 'LT',
      description: '[LT] List available tasks',
      prompt: '*list-tasks',
    },
    {
      name: 'list-workflows',
      agent: 'bmd-custom-core-bmad-master',
      shortcut: 'LW',
      description: '[LW] List available workflows',
      prompt: '*list-workflows',
    },
  ],
};

module.exports = { workflowPromptsConfig };

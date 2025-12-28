/**
 * Workflow prompt configuration for IDE new chat starters
 *
 * This configuration defines the workflow prompts that appear as suggestions
 * when starting a new chat in VS Code (via chat.promptFilesRecommendations).
 *
 * The `handoffs` array defines which prompts should be suggested after completing
 * this workflow (via chat.suggestedPromptFiles). This creates a guided flow through
 * the BMAD phases without requiring users to know the next step.
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
      handoffs: ['brainstorm', 'prd'], // Start analysis or jump to planning
    },
    {
      name: 'brainstorm',
      agent: 'bmd-custom-bmm-analyst',
      shortcut: 'BP',
      description: '[BP] Brainstorm project ideas and concepts',
      prompt: '*brainstorm-project',
      handoffs: ['prd'], // After brainstorming, create PRD
    },
    {
      name: 'workflow-status',
      agent: 'bmd-custom-bmm-pm',
      shortcut: 'WS',
      description: '[WS] Check current workflow status and next steps',
      prompt: '*workflow-status',
      handoffs: [], // Status check - user decides next step
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
      handoffs: ['ux-design', 'create-architecture'], // After PRD: UX or Architecture
    },
    {
      name: 'ux-design',
      agent: 'bmd-custom-bmm-ux-designer',
      shortcut: 'UD',
      description: '[UD] Create UX Design specification',
      prompt: '*ux-design',
      handoffs: ['create-architecture'], // After UX: Architecture
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
      handoffs: ['epics-stories'], // After architecture: create epics/stories
    },
    {
      name: 'epics-stories',
      agent: 'bmd-custom-bmm-pm',
      shortcut: 'ES',
      description: '[ES] Create Epics and User Stories from PRD',
      prompt: '*epics-stories',
      handoffs: ['implementation-readiness'], // After stories: check readiness
    },
    {
      name: 'implementation-readiness',
      agent: 'bmd-custom-bmm-architect',
      shortcut: 'IR',
      description: '[IR] Check implementation readiness across all docs',
      prompt: '*implementation-readiness',
      handoffs: ['sprint-planning'], // After readiness: plan sprint
    },
    {
      name: 'sprint-planning',
      agent: 'bmd-custom-bmm-sm',
      shortcut: 'SP',
      description: '[SP] Initialize sprint planning from epics',
      prompt: '*sprint-planning',
      handoffs: ['create-story'], // After sprint planning: start stories
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
      handoffs: ['dev-story'], // After story creation: implement it
    },
    {
      name: 'dev-story',
      agent: 'bmd-custom-bmm-dev',
      shortcut: 'DS',
      description: '[DS] Implement the current story',
      prompt: '*dev-story',
      handoffs: ['code-review'], // After implementation: review
    },
    {
      name: 'code-review',
      agent: 'bmd-custom-bmm-dev',
      shortcut: 'CR',
      description: '[CR] Perform code review on implementation',
      prompt: '*code-review',
      handoffs: ['create-story', 'retrospective'], // After review: next story or retro
    },
    {
      name: 'retrospective',
      agent: 'bmd-custom-bmm-sm',
      shortcut: 'ER',
      description: '[ER] Run epic retrospective after completion',
      prompt: '*epic-retrospective',
      handoffs: ['create-story', 'sprint-planning'], // After retro: more stories or new sprint
    },
    {
      name: 'correct-course',
      agent: 'bmd-custom-bmm-sm',
      shortcut: 'CC',
      description: '[CC] Course correction when things go off track',
      prompt: '*correct-course',
      handoffs: ['workflow-status'], // After correction: check status
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
      handoffs: ['game-qa'], // After implementation: QA
    },
    {
      name: 'game-qa',
      agent: 'bmd-custom-bmgd-game-qa',
      shortcut: 'GQ',
      description: '[GQ] Test and QA game feature',
      prompt: '*game-qa',
      handoffs: ['game-implement', 'game-sprint'], // After QA: next feature or sprint
    },
    // Planning & Design
    {
      name: 'game-design',
      agent: 'bmd-custom-bmgd-game-designer',
      shortcut: 'GD',
      description: '[GD] Design game mechanics and systems',
      prompt: '*game-design',
      handoffs: ['game-architecture'], // After design: architecture
    },
    {
      name: 'game-architecture',
      agent: 'bmd-custom-bmgd-game-architect',
      shortcut: 'GA',
      description: '[GA] Create game technical architecture',
      prompt: '*game-architecture',
      handoffs: ['game-sprint'], // After architecture: sprint planning
    },
    {
      name: 'game-sprint',
      agent: 'bmd-custom-bmgd-game-scrum-master',
      shortcut: 'GS',
      description: '[GS] Plan game development sprint',
      prompt: '*game-sprint',
      handoffs: ['game-implement'], // After sprint: implement
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
      handoffs: [], // Informational - user decides
    },
    {
      name: 'list-workflows',
      agent: 'bmd-custom-core-bmad-master',
      shortcut: 'LW',
      description: '[LW] List available workflows',
      prompt: '*list-workflows',
      handoffs: [], // Informational - user decides
    },
  ],
};

module.exports = { workflowPromptsConfig };

# BMGD Workflows

## Available Workflows in bmgd

**brainstorm-game**

- Path: `_bmad/bmgd/workflows/1-preproduction/brainstorm-game/workflow.yaml`
- Facilitate game brainstorming sessions with game-specific context, guidance, and game design techniques.

**create-game-brief**

- Path: `_bmad/bmgd/workflows/1-preproduction/game-brief/workflow.md`
- Creates a comprehensive Game Brief through collaborative step-by-step discovery to capture game vision before detailed design.

**game-brief**

- Path: `_bmad/bmgd/workflows/1-preproduction/game-brief/workflow.yaml`
- Interactive game brief creation workflow that guides users through defining their game vision with multiple input sources and conversational collaboration

**create-gdd**

- Path: `_bmad/bmgd/workflows/2-design/gdd/workflow.md`
- Creates a comprehensive Game Design Document through collaborative step-by-step discovery between game designer and user.

**gdd**

- Path: `_bmad/bmgd/workflows/2-design/gdd/workflow.yaml`
- Game Design Document workflow for all game project levels - from small prototypes to full AAA games. Generates comprehensive GDD with game mechanics, systems, progression, and implementation guidance.

**narrative**

- Path: `_bmad/bmgd/workflows/2-design/narrative/workflow.yaml`
- Narrative design workflow for story-driven games. Creates comprehensive narrative documentation including story structure, character arcs, world-building, dialogue systems, and production planning.

**game-architecture**

- Path: `_bmad/bmgd/workflows/3-technical/game-architecture/workflow.yaml`
- Collaborative game architecture workflow for AI-agent consistency. Intelligent, adaptive conversation that produces a decision-focused game architecture document covering engine, systems, networking, and technical design optimized for game development.

**generate-project-context**

- Path: `_bmad/bmgd/workflows/3-technical/generate-project-context/workflow.md`
- Creates a concise project-context.md file with critical rules and patterns that AI agents must follow when implementing game code. Optimized for LLM context efficiency.

**code-review**

- Path: `_bmad/bmgd/workflows/4-production/code-review/workflow.yaml`
- Perform an ADVERSARIAL Senior Developer code review that finds 3-10 specific problems in every story. Challenges everything: code quality, test coverage, architecture compliance, security, performance. NEVER accepts `looks good` - must find minimum issues and can auto-fix with user approval. Game-specific focus on 60fps, feel, and platform considerations.

**correct-course**

- Path: `_bmad/bmgd/workflows/4-production/correct-course/workflow.yaml`
- Navigate significant changes during sprint execution by analyzing impact, proposing solutions, and routing for implementation

**create-story**

- Path: `_bmad/bmgd/workflows/4-production/create-story/workflow.yaml`
- Create the next user story markdown from epics/PRD and architecture, using a standard template and saving to the stories folder

**dev-story**

- Path: `_bmad/bmgd/workflows/4-production/dev-story/workflow.yaml`
- Execute a story by implementing tasks/subtasks, writing tests, validating, and updating the story file per acceptance criteria

**retrospective**

- Path: `_bmad/bmgd/workflows/4-production/retrospective/workflow.yaml`
- Run after epic completion to review overall success, extract lessons learned, and explore if new information emerged that might impact the next epic

**sprint-planning**

- Path: `_bmad/bmgd/workflows/4-production/sprint-planning/workflow.yaml`
- Generate and manage the sprint status tracking file for Phase 4 implementation, extracting all epics and stories from epic files and tracking their status through the development lifecycle

**sprint-status**

- Path: `_bmad/bmgd/workflows/4-production/sprint-status/workflow.yaml`
- Summarize sprint-status.yaml for game project, surface risks, and route to the right implementation workflow.

**create-tech-spec**

- Path: `_bmad/bmgd/workflows/bmgd-quick-flow/create-tech-spec/workflow.yaml`
- Conversational spec engineering for games - ask questions, investigate code, produce implementation-ready tech-spec.

**quick-dev**

- Path: `_bmad/bmgd/workflows/bmgd-quick-flow/quick-dev/workflow.yaml`
- Flexible game development - execute tech-specs, implement features, or refactor code with game-specific considerations.

**quick-prototype**

- Path: `_bmad/bmgd/workflows/bmgd-quick-flow/quick-prototype/workflow.yaml`
- Rapid game prototyping - quickly test gameplay ideas, mechanics, or features with minimal setup.

**gametest-automate**

- Path: `_bmad/bmgd/workflows/gametest/automate/workflow.yaml`
- Generate automated game tests for Unity, Unreal, or Godot based on test design scenarios

**gametest-performance**

- Path: `_bmad/bmgd/workflows/gametest/performance/workflow.yaml`
- Design performance testing strategy for frame rate, memory, and loading times

**gametest-playtest-plan**

- Path: `_bmad/bmgd/workflows/gametest/playtest-plan/workflow.yaml`
- Create structured playtesting sessions for gameplay validation and user feedback

**gametest-test-design**

- Path: `_bmad/bmgd/workflows/gametest/test-design/workflow.yaml`
- Create comprehensive game test scenarios covering gameplay, progression, and quality requirements

**gametest-framework**

- Path: `_bmad/bmgd/workflows/gametest/test-framework/workflow.yaml`
- Initialize game test framework architecture for Unity, Unreal Engine, or Godot projects

**gametest-test-review**

- Path: `_bmad/bmgd/workflows/gametest/test-review/workflow.yaml`
- Review test quality, coverage, and identify gaps in game testing

**workflow-init**

- Path: `_bmad/bmgd/workflows/workflow-status/init/workflow.yaml`
- Initialize a new BMGD game project by determining level, type, and creating workflow path

**workflow-status**

- Path: `_bmad/bmgd/workflows/workflow-status/workflow.yaml`
- Lightweight status checker - answers ""what should I do now?"" for any game dev agent. Reads YAML status file for workflow tracking. Use workflow-init for new projects.

## Execution

When running any workflow:

1. LOAD {project-root}/\_bmad/core/tasks/workflow.xml
2. Pass the workflow path as 'workflow-config' parameter
3. Follow workflow.xml instructions EXACTLY
4. Save outputs after EACH section

## Modes

- Normal: Full interaction
- #yolo: Skip optional steps

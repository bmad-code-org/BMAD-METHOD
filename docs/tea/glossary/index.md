---
title: "BMad Glossary"
---

Terminology reference for the BMad Method.

## Core Concepts

| Term                      | Definition                                                                                                                                                                        |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Agent**                 | Specialized AI persona with specific expertise (PM, Architect, SM, DEV, TEA) that guides users through workflows and creates deliverables.                                        |
| **BMad**                  | Breakthrough Method of Agile AI-Driven Development — AI-driven agile framework with specialized agents, guided workflows, and scale-adaptive intelligence.                        |
| **BMad Method**           | Complete methodology for AI-assisted software development, encompassing planning, architecture, implementation, and quality assurance workflows that adapt to project complexity. |
| **BMM**                   | BMad Method Module — core orchestration system providing comprehensive lifecycle management through specialized agents and workflows.                                             |
| **Scale-Adaptive System** | Intelligent workflow orchestration that adjusts planning depth and documentation requirements based on project needs through three planning tracks.                               |
| **Workflow**              | Multi-step guided process that orchestrates AI agent activities to produce specific deliverables. Workflows are interactive and adapt to user context.                            |

## Scale and Complexity

| Term                        | Definition                                                                                                                                                                |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **BMad Method Track**       | Full product planning track using PRD + Architecture + UX. Best for products, platforms, and complex features. Typical range: 10-50+ stories.                             |
| **Enterprise Method Track** | Extended planning track adding Security Architecture, DevOps Strategy, and Test Strategy. Best for compliance needs and multi-tenant systems. Typical range: 30+ stories. |
| **Planning Track**          | Methodology path (Quick Flow, BMad Method, or Enterprise) chosen based on planning needs and complexity, not story count alone.                                           |
| **Quick Flow Track**        | Fast implementation track using tech-spec only. Best for bug fixes, small features, and clear-scope changes. Typical range: 1-15 stories.                                 |

## Planning Documents

| Term                      | Definition                                                                                                                                         |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Architecture Document** | *BMad Method/Enterprise.* System-wide design document defining structure, components, data models, integration patterns, security, and deployment. |
| **Epics**                 | High-level feature groupings containing multiple related stories. Typically 5-15 stories each representing cohesive functionality.                 |
| **Game Brief**            | *BMGD.* Document capturing game's core vision, pillars, target audience, and scope. Foundation for the GDD.                                        |
| **GDD**                   | *BMGD.* Game Design Document — comprehensive document detailing all aspects of game design: mechanics, systems, content, and more.                 |
| **PRD**                   | *BMad Method/Enterprise.* Product Requirements Document containing vision, goals, FRs, NFRs, and success criteria. Focuses on WHAT to build.       |
| **Product Brief**         | *Phase 1.* Optional strategic document capturing product vision, market context, and high-level requirements before detailed planning.             |
| **Tech-Spec**             | *Quick Flow only.* Comprehensive technical plan with problem statement, solution approach, file-level changes, and testing strategy.               |

## Workflow and Phases

| Term                        | Definition                                                                                                                                     |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **Phase 0: Documentation**  | *Brownfield.* Conditional prerequisite phase creating codebase documentation before planning. Only required if existing docs are insufficient. |
| **Phase 1: Analysis**       | Discovery phase including brainstorming, research, and product brief creation. Optional for Quick Flow, recommended for BMad Method.           |
| **Phase 2: Planning**       | Required phase creating formal requirements. Routes to tech-spec (Quick Flow) or PRD (BMad Method/Enterprise).                                 |
| **Phase 3: Solutioning**    | *BMad Method/Enterprise.* Architecture design phase including creation, validation, and gate checks.                                           |
| **Phase 4: Implementation** | Required sprint-based development through story-by-story iteration using sprint-planning, create-story, dev-story, and code-review workflows.  |
| **Quick Spec Flow**         | Fast-track workflow for Quick Flow projects going straight from idea to tech-spec to implementation.                                           |
| **Workflow Init**           | Initialization workflow creating bmm-workflow-status.yaml, detecting project type, and determining planning track.                             |
| **Workflow Status**         | Universal entry point checking for existing status file, displaying progress, and recommending next action.                                    |

## Agents and Roles

| Term                 | Definition                                                                                                                                       |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Analyst**          | Agent that initializes workflows, conducts research, creates product briefs, and tracks progress. Often the entry point for new projects.        |
| **Architect**        | Agent designing system architecture, creating architecture documents, and validating designs. Primary agent for Phase 3.                         |
| **BMad Master**      | Meta-level orchestrator from BMad Core facilitating party mode and providing high-level guidance across all modules.                             |
| **DEV**              | Developer agent implementing stories, writing code, running tests, and performing code reviews. Primary implementer in Phase 4.                  |
| **Game Architect**   | *BMGD.* Agent designing game system architecture and validating game-specific technical designs.                                                 |
| **Game Designer**    | *BMGD.* Agent creating game design documents (GDD) and running game-specific workflows.                                                          |
| **Party Mode**       | Multi-agent collaboration feature where agents discuss challenges together. BMad Master orchestrates, selecting 2-3 relevant agents per message. |
| **PM**               | Product Manager agent creating PRDs and tech-specs. Primary agent for Phase 2 planning.                                                          |
| **SM**               | Scrum Master agent managing sprints, creating stories, and coordinating implementation. Primary orchestrator for Phase 4.                        |
| **TEA**              | Test Architect agent responsible for test strategy, quality gates, and NFR assessment. Integrates throughout all phases.                         |
| **Technical Writer** | Agent specialized in creating technical documentation, diagrams, and maintaining documentation standards.                                        |
| **UX Designer**      | Agent creating UX design documents, interaction patterns, and visual specifications for UI-heavy projects.                                       |

## Status and Tracking

| Term                         | Definition                                                                                                                   |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **bmm-workflow-status.yaml** | *Phases 1-3.* Tracking file showing current phase, completed workflows, and next recommended actions.                        |
| **DoD**                      | Definition of Done — criteria for marking a story complete: implementation done, tests passing, code reviewed, docs updated. |
| **Epic Status Progression**  | `backlog → in-progress → done` — lifecycle states for epics during implementation.                                           |
| **Gate Check**               | Validation workflow (implementation-readiness) ensuring PRD, Architecture, and Epics are aligned before Phase 4.             |
| **Retrospective**            | Workflow after each epic capturing learnings and improvements for continuous improvement.                                    |
| **sprint-status.yaml**       | *Phase 4.* Single source of truth for implementation tracking containing all epics, stories, and their statuses.             |
| **Story Status Progression** | `backlog → ready-for-dev → in-progress → review → done` — lifecycle states for stories.                                      |

## Project Types

| Term                     | Definition                                                                                                                      |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| **Brownfield**           | Existing project with established codebase and patterns. Requires understanding existing architecture and planning integration. |
| **Convention Detection** | *Quick Flow.* Feature auto-detecting existing code style, naming conventions, and frameworks from brownfield codebases.         |
| **document-project**     | *Brownfield.* Workflow analyzing and documenting existing codebase with three scan levels: quick, deep, exhaustive.             |
| **Feature Flags**        | *Brownfield.* Implementation technique for gradual rollout, easy rollback, and A/B testing of new functionality.                |
| **Greenfield**           | New project starting from scratch with freedom to establish patterns, choose stack, and design from clean slate.                |
| **Integration Points**   | *Brownfield.* Specific locations where new code connects with existing systems. Must be documented in tech-specs.               |

## Implementation Terms

| Term                    | Definition                                                                                                                                 |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **Context Engineering** | Loading domain-specific standards into AI context automatically via manifests, ensuring consistent outputs regardless of prompt variation. |
| **Correct Course**      | Workflow for navigating significant changes when implementation is off-track. Analyzes impact and recommends adjustments.                  |
| **Shard / Sharding**    | Splitting large planning documents into section-based files for LLM optimization. Phase 4 workflows load only needed sections.             |
| **Sprint**              | Time-boxed period of development work, typically 1-2 weeks.                                                                                |
| **Sprint Planning**     | Workflow initializing Phase 4 by creating sprint-status.yaml and extracting epics/stories from planning docs.                              |
| **Story**               | Single unit of implementable work with clear acceptance criteria, typically 2-8 hours of effort. Grouped into epics.                       |
| **Story Context**       | Implementation guidance embedded in story files during create-story, referencing existing patterns and approaches.                         |
| **Story File**          | Markdown file containing story description, acceptance criteria, technical notes, and testing requirements.                                |
| **Track Selection**     | Automatic analysis by `bmad-help` suggesting appropriate track based on complexity indicators. User can override.                        |

## Game Development Terms

| Term                           | Definition                                                                                           |
| ------------------------------ | ---------------------------------------------------------------------------------------------------- |
| **Core Fantasy**               | *BMGD.* The emotional experience players seek from your game — what they want to FEEL.               |
| **Core Loop**                  | *BMGD.* Fundamental cycle of actions players repeat throughout gameplay. The heart of your game.     |
| **Design Pillar**              | *BMGD.* Core principle guiding all design decisions. Typically 3-5 pillars define a game's identity. |
| **Environmental Storytelling** | *BMGD.* Narrative communicated through the game world itself rather than explicit dialogue.          |
| **Game Type**                  | *BMGD.* Genre classification determining which specialized GDD sections are included.                |
| **MDA Framework**              | *BMGD.* Mechanics → Dynamics → Aesthetics — framework for analyzing and designing games.             |
| **Meta-Progression**           | *BMGD.* Persistent progression carrying between individual runs or sessions.                         |
| **Metroidvania**               | *BMGD.* Genre featuring interconnected world exploration with ability-gated progression.             |
| **Narrative Complexity**       | *BMGD.* How central story is to the game: Critical, Heavy, Moderate, or Light.                       |
| **Permadeath**                 | *BMGD.* Game mechanic where character death is permanent, typically requiring a new run.             |
| **Player Agency**              | *BMGD.* Degree to which players can make meaningful choices affecting outcomes.                      |
| **Procedural Generation**      | *BMGD.* Algorithmic creation of game content (levels, items, characters) rather than hand-crafted.   |
| **Roguelike**                  | *BMGD.* Genre featuring procedural generation, permadeath, and run-based progression.                |

## Test Architect (TEA) Concepts

| Term                         | Definition                                                                                                                                                    |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ATDD**                     | Acceptance Test-Driven Development — Generating failing acceptance tests BEFORE implementation (TDD red phase).                                               |
| **Burn-in Testing**          | Running tests multiple times (typically 5-10 iterations) to detect flakiness and intermittent failures.                                                       |
| **Component Testing**        | Testing UI components in isolation using framework-specific tools (Cypress Component Testing or Vitest + React Testing Library).                              |
| **Coverage Traceability**    | Mapping acceptance criteria to implemented tests with classification (FULL/PARTIAL/NONE) to identify gaps and measure completeness.                           |
| **Epic-Level Test Design**   | Test planning per epic (Phase 4) focusing on risk assessment, priorities, and coverage strategy for that specific epic.                                       |
| **Fixture Architecture**     | Pattern of building pure functions first, then wrapping in framework-specific fixtures for testability, reusability, and composition.                         |
| **Gate Decision**            | Go/no-go decision for release with four outcomes: PASS ✅ (ready), CONCERNS ⚠️ (proceed with mitigation), FAIL ❌ (blocked), WAIVED ⏭️ (approved despite issues). |
| **Knowledge Fragment**       | Individual markdown file in TEA's knowledge base covering a specific testing pattern or practice (33 fragments total).                                        |
| **MCP Enhancements**         | Model Context Protocol servers enabling live browser verification during test generation (exploratory, recording, and healing modes).                         |
| **Network-First Pattern**    | Testing pattern that waits for actual network responses instead of fixed timeouts to avoid race conditions and flakiness.                                     |
| **NFR Assessment**           | Validation of non-functional requirements (security, performance, reliability, maintainability) with evidence-based decisions.                                |
| **Playwright Utils**         | Optional package (`@seontechnologies/playwright-utils`) providing production-ready fixtures and utilities for Playwright tests.                               |
| **Risk-Based Testing**       | Testing approach where depth scales with business impact using probability × impact scoring (1-9 scale).                                                      |
| **System-Level Test Design** | Test planning at architecture level (Phase 3) focusing on testability review, ADR mapping, and test infrastructure needs.                                     |
| **tea-index.csv**            | Manifest file tracking all knowledge fragments, their descriptions, tags, and which workflows load them.                                                      |
| **TEA Integrated**           | Full BMad Method integration with TEA workflows across all phases (Phase 2, 3, 4, and Release Gate).                                                          |
| **TEA Lite**                 | Beginner approach using just `automate` to test existing features (simplest way to use TEA).                                                        |
| **TEA Solo**                 | Standalone engagement model using TEA without full BMad Method integration (bring your own requirements).                                                     |
| **Test Priorities**          | Classification system for test importance: P0 (critical path), P1 (high value), P2 (medium value), P3 (low value).                                            |

---

## See Also

- [TEA Overview](/docs/tea/explanation/tea-overview.md) - Complete TEA capabilities
- [TEA Knowledge Base](/docs/tea/reference/knowledge-base.md) - Fragment index
- [TEA Command Reference](/docs/tea/reference/commands.md) - Workflow reference
- [TEA Configuration](/docs/tea/reference/configuration.md) - Config options

---

Generated with [BMad Method](https://bmad-method.org)

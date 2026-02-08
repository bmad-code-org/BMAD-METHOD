---
title: "Workflow Map"
description: Visual reference for BMad Method workflow phases and outputs
sidebar:
  order: 1
---

The BMad Method (BMM) is a module in the BMad Ecosystem, targeted at following the best practices of context engineering and planning. AI agents work best with clear, structured context. The BMM system builds that context progressively across 4 distinct phases - each phase, and multiple workflows optionally within each phase, produce documents that inform the next, so agents always know what to build and why.

The rationale and concepts come from agile methodologies that have been used across the industry with great success as a mental framework.

If at any time you are unsure what to do, the `/bmad-help` command will help you stay on track or know what to do next. You can always refer to this for reference also - but /bmad-help is fully interactive and much quicker if you have already installed the BMad Method. Additionally, if you are using different modules that have extended the BMad Method or added other complementary non-extension modules - the /bmad-help evolves to know all that is available to give you the best in-the-moment advice.

Final important note: Every workflow below can be run directly with your tool of choice via slash command or by loading an agent first and using the entry from the agents menu.

<iframe src="/workflow-map-diagram.html" title="BMad Method Workflow Map Diagram" width="100%" height="100%" style="border-radius: 8px; border: 1px solid #334155; min-height: 900px;"></iframe>

<p style="font-size: 0.8rem; text-align: right; margin-top: -0.5rem; margin-bottom: 1rem;">
  <a href="/workflow-map-diagram.html" target="_blank" rel="noopener noreferrer">Open diagram in new tab ↗</a>
</p>

## Phase 1: Analysis (Optional)

Explore the problem space and validate ideas before committing to planning.

| Workflow               | Purpose                                                                    | Produces                  |
| ---------------------- | -------------------------------------------------------------------------- | ------------------------- |
| `brainstorming`        | Brainstorm Project Ideas with guided facilitation of a brainstorming coach | `brainstorming-report.md` |
| `research`             | Validate market, technical, or domain assumptions                          | Research findings         |
| `create-product-brief` | Capture strategic vision                                                   | `product-brief.md`        |

## Phase 2: Planning

Define what to build and for whom.

| Workflow           | Purpose                                  | Produces     |
| ------------------ | ---------------------------------------- | ------------ |
| `create-prd`       | Define requirements (FRs/NFRs)           | `PRD.md`     |
| `create-ux-design` | Design user experience (when UX matters) | `ux-spec.md` |

## Phase 3: Solutioning

Decide how to build it and break work into stories.

| Workflow                         | Purpose                                    | Produces                    |
| -------------------------------- | ------------------------------------------ | --------------------------- |
| `create-architecture`            | Make technical decisions explicit          | `architecture.md` with ADRs |
| `create-epics-and-stories`       | Break requirements into implementable work | Epic files with stories     |
| `check-implementation-readiness` | Gate check before implementation           | PASS/CONCERNS/FAIL decision |

## Phase 4: Implementation

Build it, one story at a time.

| Workflow          | Purpose                                | Produces                      |
| ----------------- | -------------------------------------- | ----------------------------- |
| `sprint-planning` | Initialize tracking (once per project) | `sprint-status.yaml`          |
| `create-story`    | Prepare next story for implementation  | `story-[slug].md`             |
| `dev-story`       | Implement the story                    | Working code + tests          |
| `automate` (QA)   | Generate tests for existing features   | Test suite                    |
| `code-review`     | Validate implementation quality        | Approved or changes requested |
| `correct-course`  | Handle significant mid-sprint changes  | Updated plan or re-routing    |
| `retrospective`   | Review after epic completion           | Lessons learned               |

**Quinn (QA Agent):** Built-in QA agent for test automation. Trigger with `QA` or `bmad-bmm-qa-automate`. Generates standard API and E2E tests using your project's test framework. Beginner-friendly, no configuration needed. For advanced test strategy, install [Test Architect (TEA)](https://bmad-code-org.github.io/bmad-method-test-architecture-enterprise/) module.

## Quick Flow (Parallel Track)

Skip phases 1-3 for small, well-understood work.

| Workflow     | Purpose                                    | Produces                                      |
| ------------ | ------------------------------------------ | --------------------------------------------- |
| `quick-spec` | Define an ad-hoc change                    | `tech-spec.md` (story file for small changes) |
| `quick-dev`  | Implement from spec or direct instructions | Working code + tests                          |

## Context Management

Each document becomes context for the next phase. The PRD tells the architect what constraints matter. The architecture tells the dev agent which patterns to follow. Story files give focused, complete context for implementation. Without this structure, agents make inconsistent decisions.

For established projects, `document-project` creates or updates `project-context.md` - what exists in the codebase and the rules all implementation workflows must observe. Run it just before Phase 4, and again when something significant changes - structure, architecture, or those rules. You can also edit `project-context.md` by hand.

All implementation workflows load `project-context.md` if it exists. Additional context per workflow:

| Workflow       | Also Loads                   |
| -------------- | ---------------------------- |
| `create-story` | epics, PRD, architecture, UX |
| `dev-story`    | story file                   |
| `code-review`  | architecture, story file     |
| `quick-spec`   | planning docs (if exist)     |
| `quick-dev`    | tech-spec                    |

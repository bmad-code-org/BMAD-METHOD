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

| Workflow                        | Purpose                                                                    | Produces                  |
| ------------------------------- | -------------------------------------------------------------------------- | ------------------------- |
| `bmad-brainstorming`            | Brainstorm Project Ideas with guided facilitation of a brainstorming coach | `brainstorming-report.md` |
| `bmad-bmm-research`             | Validate market, technical, or domain assumptions                          | Research findings         |
| `bmad-bmm-create-product-brief` | Capture strategic vision                                                   | `product-brief.md`        |

## Phase 2: Planning

Define what to build and for whom.

| Workflow                    | Purpose                                  | Produces     |
| --------------------------- | ---------------------------------------- | ------------ |
| `bmad-bmm-create-prd`       | Define requirements (FRs/NFRs)           | `PRD.md`     |
| `bmad-bmm-create-ux-design` | Design user experience (when UX matters) | `ux-spec.md` |

## Phase 3: Solutioning

Decide how to build it and break work into stories.

| Workflow                                  | Purpose                                    | Produces                    |
| ----------------------------------------- | ------------------------------------------ | --------------------------- |
| `bmad-bmm-create-architecture`            | Make technical decisions explicit          | `architecture.md` with ADRs |
| `bmad-bmm-create-epics-and-stories`       | Break requirements into implementable work | Epic files with stories     |
| `bmad-bmm-check-implementation-readiness` | Gate check before implementation           | PASS/CONCERNS/FAIL decision |

## Phase 4: Implementation

Build it, one story at a time. Coming soon, full phase 4 automation!

| Workflow                   | Purpose                                                                  | Produces                         |
| -------------------------- | ------------------------------------------------------------------------ | -------------------------------- |
| `bmad-bmm-sprint-planning` | Initialize tracking (once per project to sequence the dev cycle)         | `sprint-status.yaml`             |
| `bmad-bmm-create-story`    | Prepare next story for implementation                                    | `story-[slug].md`                |
| `bmad-bmm-dev-story`       | Implement the story                                                      | Working code + tests             |
| `bmad-bmm-code-review`     | Validate implementation quality                                          | Approved or changes requested    |
| `bmad-bmm-correct-course`  | Handle significant mid-sprint changes                                    | Updated plan or re-routing       |
| `bmad-bmm-automate`        | Generate tests for existing features - Use after a full epic is complete | End to End UI Focused Test suite |
| `bmad-bmm-retrospective`   | Review after epic completion                                             | Lessons learned                  |

## Quick Flow (Parallel Track)

Skip phases 1-3 for small, well-understood work.

| Workflow              | Purpose                                    | Produces                                      |
| --------------------- | ------------------------------------------ | --------------------------------------------- |
| `bmad-bmm-quick-spec` | Define an ad-hoc change                    | `tech-spec.md` (story file for small changes) |
| `bmad-bmm-quick-dev`  | Implement from spec or direct instructions | Working code + tests                          |

## Context Management

Each document becomes context for the next phase. The PRD tells the architect what constraints matter. The architecture tells the dev agent which patterns to follow. Story files give focused, complete context for implementation. Without this structure, agents make inconsistent decisions.

### Project Context

:::tip[Recommended]
Create `project-context.md` to ensure AI agents follow your project's rules and preferences. This file works like a constitution for your project — it guides implementation decisions across all workflows. This optional file can be generated at the end of Architecture Creation, or in an existing project it can be generated also to capture whats important to keep aligned with current conventions.
:::

**How to create it:**

- **Manually** — Create `_bmad-output/project-context.md` with your technology stack and implementation rules
- **Generate it** — Run `/bmad-bmm-generate-project-context` to auto-generate from your architecture or codebase

[**Learn more about project-context.md**](../explanation/project-context.md)

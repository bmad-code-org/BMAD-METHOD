---
name: quick-dev2
description: 'Unified quick flow - clarify intent, plan, implement, review, present.'
main_config: '{project-root}/_bmad/bmm/config.yaml'

# Related workflows
advanced_elicitation: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
party_mode_exec: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'

# Review building block
adversarial_review_task: '{project-root}/_bmad/core/tasks/review-adversarial-general.xml'
---

# Quick Dev 2 Workflow

**Goal:** Take a user request from intent through implementation, adversarial review, and PR creation in a single unified flow.

**Your Role:** You are an elite developer. You clarify intent, plan precisely, implement autonomously, review adversarially, and present findings honestly. Minimum ceremony, maximum signal.

---

## READY FOR DEVELOPMENT STANDARD

A specification is "Ready for Development" when:

- **Actionable**: Every task has a file path and specific action.
- **Logical**: Tasks ordered by dependency.
- **Testable**: All ACs use Given/When/Then.
- **Complete**: No placeholders or TBDs.
- **Self-Contained**: A fresh agent can implement from the spec alone.

---

## WORKFLOW ARCHITECTURE

This uses **step-file architecture** for disciplined execution:

- **Micro-file Design**: Each step is self-contained and followed exactly
- **Just-In-Time Loading**: Only load the current step file
- **Sequential Enforcement**: Complete steps in order, no skipping
- **State Tracking**: Persist progress via spec frontmatter and in-memory variables
- **Append-Only Building**: Build artifacts incrementally

### Step Processing Rules

1. **READ COMPLETELY**: Read the entire step file before acting
2. **FOLLOW SEQUENCE**: Execute sections in order
3. **WAIT FOR INPUT**: Halt at checkpoints and wait for human
4. **LOAD NEXT**: When directed, read fully and follow the next step file

### Critical Rules (NO EXCEPTIONS)

- **NEVER** load multiple step files simultaneously
- **ALWAYS** read entire step file before execution
- **NEVER** skip steps or optimize the sequence
- **ALWAYS** follow the exact instructions in the step file
- **ALWAYS** halt at checkpoints and wait for human input

---

## INITIALIZATION SEQUENCE

### 1. Configuration Loading

Load and read full config from `{main_config}` and resolve:

- `project_name`, `planning_artifacts`, `implementation_artifacts`, `user_name`
- `communication_language`, `document_output_language`, `user_skill_level`
- `date` as system-generated current datetime
- `project_context` = `**/project-context.md` (load if exists)
- CLAUDE.md / memory files (load if exist)

YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`.

### 2. Paths

- `installed_path` = `{project-root}/_bmad/bmm/workflows/bmad-quick-flow/quick-dev2`
- `templateFile` = `{installed_path}/tech-spec-template.md`
- `wipFile` = `{implementation_artifacts}/tech-spec-wip.md`
- `tasksDir` = `{implementation_artifacts}/tasks`

### 3. First Step Execution

Read fully and follow: `{installed_path}/steps/step-01-clarify-and-route.md` to begin the workflow.

---
name: agentic-development
description: AI-assisted development, testing, and reverse engineering through structured agent collaboration
web_bundle: true
---

# Phase 5: Agentic Development

**Goal:** AI-assisted software development, testing, analysis, and reverse engineering through structured agent collaboration.

**Your Role:** Implementation partner guiding structured development activities with clear feedback protocols and approval gates.

---

## WORKFLOW ARCHITECTURE

Phase 5 is **menu-driven**, not linear. The user picks an activity.

### Core Principles

- **Activity-Based**: Pick the right activity for the current need
- **Non-Linear**: Start anywhere, switch between activities freely
- **Agent Dialog Driven**: Every activity creates/resumes agent dialogs for high-level planning
- **Specification as Truth**: All work traces back to approved specifications

### Step Processing Rules

1. **READ COMPLETELY**: Always read the entire step file before taking any action
2. **FOLLOW SEQUENCE**: Execute all sections in order within a step
3. **WAIT FOR INPUT**: Halt at menus and wait for user selection
4. **SAVE STATE**: Update dialog tracking when completing steps

---

## INITIALIZATION

### 1. Configuration Loading

Load and read full config from `{project-root}/_bmad/wds/config.yaml` and resolve:
- `project_name`, `output_folder`, `user_name`
- `communication_language`, `document_output_language`

### 2. Agent Dialog Gate

1. Check `{output_folder}/_progress/agent-dialogs/` for pending development dialogs
2. If pending dialogs exist, present them with status
3. User can resume existing or start new

### 3. Activity Menu

Present:

```
What would you like to do?

[P] Prototyping            — Build interactive prototype from specs
[D] Development            — Write production code
[F] Bugfixing              — Fix bugs in existing code
[E] Evolution              — Add features to existing product
[A] Analysis               — Understand your own codebase
[R] Reverse Engineering    — Any software/site → specs & extraction
[T] Acceptance Testing     — Design & run tests from spec criteria
```

### Activity Routing

| Choice | Workflow File | Steps Folder |
|--------|--------------|--------------|
| [P] | workflow-prototyping.md | steps-p/ |
| [D] | workflow-development.md | steps-d/ |
| [F] | workflow-bugfixing.md | steps-f/ |
| [E] | workflow-evolution.md | steps-e/ |
| [A] | workflow-analysis.md | steps-a/ |
| [R] | workflow-reverse-engineering.md | steps-r/ |
| [T] | workflow-acceptance-testing.md | steps-t/ |

---

## REFERENCE CONTENT

| Location | Purpose |
|----------|---------|
| `data/guides/` | Development guides, protocols, analysis |
| `data/testing-guide.md` | Acceptance testing guide |
| `data/test-result-templates.md` | Test result templates |
| `data/issue-templates.md` | Issue reporting templates |
| `templates/` | Page, story, work file, roadmap templates |

---

## OUTPUT

Activity-specific output in project structure.

---

## AFTER COMPLETION

1. Update design log
2. Suggest next action or return to Activity Menu

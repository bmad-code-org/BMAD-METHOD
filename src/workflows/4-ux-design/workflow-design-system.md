---
name: 'workflow-design-system'
description: 'Define, update, and review design system components used across page specifications.'
---

# [M] Manage Design System — Define and Update Components

**Goal:** Define, update, and review design system components used across page specifications.

**When to use:** When the user needs to create new components, update existing ones, or review the design system for consistency.

---

## INITIALIZATION

### Agent Dialog Gate

1. Check for pending activity dialogs
2. If none, suggest creating one
3. Load dialog context


## Entry

Load design system from `{output_folder}/D-UX-Design/design-system/` (if exists).

## Steps

Execute steps in `./steps-m/`:

| Step | File | Purpose |
|------|------|---------|
| 01 | step-01-review-current.md | Review existing design system state |
| 02 | step-02-define-component.md | Define or update a component |
| 03 | step-03-validate-usage.md | Check component usage across specs |

**Reference data:**
- `./data/object-types/` — component type definitions and templates
- `./data/modular-architecture/` — three-tier architecture guide
- `./data/guides/TRANSLATION-ORGANIZATION-GUIDE.md` — content organization

---

## AFTER COMPLETION

1. Update design log
2. Suggest next action
3. Return to activity menu

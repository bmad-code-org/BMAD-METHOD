# Frontmatter Standards

**Purpose:** Variables, paths, and frontmatter rules for workflow steps.

---

## Golden Rules

1. **Only variables USED in the step** may be in frontmatter
2. **All file references MUST use `{variable}` format** - no hardcoded paths
3. **Paths within workflow folder MUST be relative**

---

## Standard Variables (Always Available)

| Variable          | Example Value                          |
| ----------------- | -------------------------------------- |
| `{project-root}`  | `/Users/user/dev/BMAD-METHOD`          |
| `{project_name}`  | `my-project`                            |
| `{output_folder}` | `/Users/user/dev/BMAD-METHOD/output`    |
| `{user_name}`     | `Brian`                                 |
| `{communication_language}` | `english`                       |
| `{document_output_language}` | `english`                   |

---

## Module-Specific Variables

Workflows in a MODULE can access additional variables from its `module.yaml`.

**BMB Module example:**
```yaml
bmb_creations_output_folder: '{project-root}/_bmad/bmb-creations'
```

**Standalone workflows:** Only have access to standard variables.

---

## Frontmatter Structure

### Required Fields
```yaml
---
name: 'step-[N]-[name]'
description: '[what this step does]'
---
```

### File References (ONLY if used in this step)
```yaml
---
# File References
workflow_path: '{project-root}/_bmad/[module]/workflows/[workflow-name]'
thisStepFile: '{workflow_path}/steps/step-[N]-[name].md'
nextStepFile: '{workflow_path}/steps/step-[N+1]-[name].md'
workflowFile: '{workflow_path}/workflow.md'
outputFile: '{output_folder}/[output-name].md'

# Task References (IF USED)
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'

# Template References (IF USED)
someTemplate: '{workflow_path}/templates/[template].md'

# Data References (IF USED)
someData: '{workflow_path}/data/[data].csv'
---
```

---

## Critical Rule: Unused Variables Forbidden

### ❌ VIOLATION
```yaml
---
outputFile: '{output_folder}/output.md'
partyModeWorkflow: '{project-root}/.../party-mode/workflow.md'  # ❌ NOT USED!
---
# Step body never mentions {partyModeWorkflow}
```

### ✅ CORRECT
```yaml
---
outputFile: '{output_folder}/output.md'
---
# Step body uses {outputFile}
```

---

## Path Rules

### 1. Paths Within Workflow Folder = RELATIVE
```yaml
# ❌ WRONG - absolute for same-folder
someTemplate: '{project-root}/_bmad/bmb/workflows/my-workflow/templates/template.md'

# ✅ CORRECT - relative or via workflow_path
someTemplate: '{workflow_path}/templates/template.md'
```

### 2. External References = Full Variable Paths
```yaml
# ✅ CORRECT
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
```

### 3. Output Files = Use output_folder Variable
```yaml
# ✅ CORRECT
outputFile: '{output_folder}/workflow-output-{project_name}.md'
```

---

## Defining New Variables

Steps can define NEW variables that future steps will use.

**Step 01 defines:**
```yaml
---
targetWorkflowPath: '{bmb_creations_output_folder}/workflows/{workflow_name}'
---
```

**Step 02 uses:**
```yaml
---
targetWorkflowPath: '{bmb_creations_output_folder}/workflows/{workflow_name}'
workflowPlanFile: '{targetWorkflowPath}/plan.md'
---
```

---

## Continuable Workflow Frontmatter

```yaml
---
stepsCompleted: ['step-01-init', 'step-02-gather', 'step-03-design']
lastStep: 'step-03-design'
lastContinued: '2025-01-02'
date: '2025-01-01'
---
```

**Step tracking:** Each step appends its NAME to `stepsCompleted`.

---

## Variable Naming

Use `snake_case` with descriptive prefixes:

| Pattern   | Usage                  | Example                    |
| --------- | ---------------------- | -------------------------- |
| `{*_path}`   | Folder paths           | `workflow_path`, `data_path` |
| `{*_file}`   | Files                  | `outputFile`, `planFile`     |
| `{*_template}` | Templates            | `profileTemplate`            |
| `{*_data}`    | Data files            | `dietaryData`               |

---

## Validation Checklist

For every step frontmatter:
- [ ] `name` present, kebab-case
- [ ] `description` present
- [ ] All variables in frontmatter ARE used in step body
- [ ] All file references use `{variable}` format
- [ ] Paths within workflow folder are relative
- [ ] External paths use `{project-root}` variable
- [ ] Module variables only if workflow belongs to that module

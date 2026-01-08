# Frontmatter Standards

**Purpose:** Variables, paths, and frontmatter rules for workflow steps.

---

## Golden Rules

1. **Only variables USED in the step** may be in frontmatter
2. **All file references MUST use `{variable}` format** - no hardcoded paths
3. **Paths within workflow folder MUST be relative** - NO `workflow_path` variable allowed

---

## Standard Variables (Always Available)

| Variable                     | Example Value                        |
| ---------------------------- | ------------------------------------ |
| `{project-root}`             | `/Users/user/dev/BMAD-METHOD`        |
| `{project_name}`             | `my-project`                         |
| `{output_folder}`            | `/Users/user/dev/BMAD-METHOD/output` |
| `{user_name}`                | `Brian`                              |
| `{communication_language}`   | `english`                            |
| `{document_output_language}` | `english`                            |

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

### File References - ONLY variables used in this step
```yaml
---
# Step to step (SAME folder) - use ./filename.md
nextStepFile: './step-02-vision.md'

# Step to template (PARENT folder) - use ../filename.md
productBriefTemplate: '../product-brief.template.md'

# Step to data (SUBFOLDER) - use ./data/filename.md
someData: './data/config.csv'

# Output files - use variable
outputFile: '{planning_artifacts}/product-brief-{{project_name}}-{{date}}.md'

# External references - use {project-root}
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---
```

---

## Critical Rule: Unused Variables Forbidden

### ❌ VIOLATION - Variable defined but never used
```yaml
---
outputFile: '{output_folder}/output.md'
thisStepFile: './step-01-init.md'      # ❌ NEVER USED in body
workflowFile: './workflow.md'           # ❌ NEVER USED in body
---
# Step body never mentions {thisStepFile} or {workflowFile}
```

### ✅ CORRECT - Only variables that are used
```yaml
---
outputFile: '{output_folder}/output.md'
nextStepFile: './step-02-foo.md'
---
# Step body uses {outputFile} and {nextStepFile}
```

**Detection Rule:** For EVERY variable in frontmatter, search the step body for `{variableName}`. If not found, it's a violation.

---

## Path Rules - NO EXCEPTIONS

### 1. Step to Step (SAME folder) = ./filename.md
```yaml
# ❌ WRONG
nextStepFile: './step-02.md'
nextStepFile: '{project-root}/_bmad/bmm/workflows/foo/steps/step-02.md'

# ✅ CORRECT
nextStepFile: './step-02-vision.md'
```

### 2. Step to Template (PARENT folder) = ../filename.md
```yaml
# ❌ WRONG
someTemplate: '{workflow_path}/templates/template.md'

# ✅ CORRECT
someTemplate: '../template.md'
```

### 3. Step to Subfolder = ./subfolder/file.md
```yaml
# ❌ WRONG
dataFile: '{workflow_path}/data/config.csv'

# ✅ CORRECT
dataFile: './data/config.csv'
```

### 4. External References = {project-root}/...
```yaml
# ✅ CORRECT
advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
```

### 5. Output Files = Use folder variable
```yaml
# ✅ CORRECT
outputFile: '{planning_artifacts}/workflow-output-{project_name}.md'
outputFile: '{output_folder}/output.md'
```

---

## ❌ FORBIDDEN Patterns

These patterns are **NEVER ALLOWED** in workflow step frontmatter:

| Pattern                               | Why It's Wrong                                        |
| ------------------------------------- | ----------------------------------------------------- |
| `workflow_path: '{project-root}/...'` | Use relative paths instead                            |
| `thisStepFile: './step-XX.md'`        | Almost never used - remove unless actually referenced |
| `workflowFile: './workflow.md'`       | Almost never used - remove unless actually referenced |
| `./...`                               | Use `./step-XX.md` (same folder)                      |
| `{workflow_path}/templates/...`       | Use `../template.md` (parent folder)                  |
| `{workflow_path}/data/...`            | Use `./data/file.md` (subfolder)                      |

---

## Variable Naming

Use `snake_case` with descriptive prefixes:

| Pattern        | Usage               | Example                      |
| -------------- | ------------------- | ---------------------------- |
| `{*_File}`     | File references     | `outputFile`, `nextStepFile` |
| `{*_Task}`     | Task references     | `advancedElicitationTask`    |
| `{*_Workflow}` | Workflow references | `partyModeWorkflow`          |
| `{*_Template}` | Templates           | `productBriefTemplate`       |
| `{*_Data}`     | Data files          | `dietaryData`                |

---

## Defining New Variables

Steps can define NEW variables that future steps will use.

**Step 01 defines:**
```yaml
---
targetWorkflowPath: '{bmb_creations_output_folder}/workflows/{workflow_name}'
---
# Uses {targetWorkflowPath} in body
```

**Step 02 uses:**
```yaml
---
targetWorkflowPath: '{bmb_creations_output_folder}/workflows/{workflow_name}'
workflowPlanFile: '{targetWorkflowPath}/plan.md'
---
# Uses {targetWorkflowPath} and {workflowPlanFile} in body
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

## Validation Checklist

For EVERY step frontmatter, verify:

- [ ] `name` present, kebab-case format
- [ ] `description` present
- [ ] Extract ALL variable names from frontmatter (between `---` markers)
- [ ] For EACH variable, search body: is `{variableName}` present?
- [ ] If variable NOT in body → ❌ VIOLATION, remove from frontmatter
- [ ] All step-to-step paths use `./filename.md` format (same folder)
- [ ] All parent-folder paths use `../filename.md` format
- [ ] All subfolder paths use `./subfolder/filename.md` format
- [ ] NO `{workflow_path}` variable exists
- [ ] External paths use `{project-root}` variable
- [ ] Module variables only used if workflow belongs to that module

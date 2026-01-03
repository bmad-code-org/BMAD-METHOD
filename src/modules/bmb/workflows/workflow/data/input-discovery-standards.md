# Input Document Discovery Standards

**Purpose:** How workflows discover, validate, and select input documents from prior workflows or external sources.

---

## Discovery Patterns

### Pattern 1: Prior Workflow Output
**Use when:** Workflow is part of a sequence (e.g., PRD → Architecture → Epics)

**Example:** BMM module pipeline - each of these are a workflow with many steps:
```
brainstorming → research → brief → PRD → UX → architecture → epics → sprint-planning
```

Each workflow checks for output from prior workflow(s).

### Pattern 2: Module Folder Search
**Use when:** Documents stored in known project location

**Example:** Manager review workflow searches `{project_folder}/employee-notes/`

### Pattern 3: User-Specified Paths
**Use when:** User provides document locations

**Example:** Tax workflow asks for financial statement paths

### Pattern 4: Pattern-Based Discovery
**Use when:** Search by file naming pattern

**Example:** Find all `*-brief.md` files in `{planning_artifacts}/`

---

## Discovery Step Pattern

**When:** Step 1 (init) or Step 2 (discovery)

**Frontmatter:**
```yaml
---
# Input discovery variables
inputDocuments: []           # Populated with discovered docs
requiredInputCount: 1         # Minimum required to proceed
optionalInputCount: 0        # Additional docs user may provide
moduleInputFolder: '{planning_artifacts}'  # Where to search
inputFilePatterns:           # File patterns to match
  - '*-prd.md'
  - '*-ux.md'
---
```

**Discovery Logic:**
```markdown
## 1. Check for Known Prior Workflow Outputs

Search in order:
1. {module_output_folder}/[known-prior-workflow-output].md
2. {project_folder}/[standard-locations]/
3. {planning_artifacts}/
4. User-provided paths

## 2. Pattern-Based Search

If no known prior workflow, search by patterns:
- Look for files matching {inputFilePatterns}
- Search in {moduleInputFolder}
- Search in {project_folder}/docs/

## 3. Present Findings to User

"Found these documents that may be relevant:
- [1] prd-my-project.md (created 3 days ago)
- [2] ux-research.md (created 1 week ago)
- [3] competitor-analysis.md

Which would you like to use? You can select multiple, or provide additional paths."

## 4. Confirm and Load

User confirms selection → Load selected documents
Add to {inputDocuments} array in output frontmatter
```

---

## Required vs Optional Inputs

### Required Inputs
Workflow cannot proceed without these.

**Example:** Architecture workflow requires PRD

```markdown
## INPUT REQUIREMENT:

This workflow requires a Product Requirements Document to proceed.

Searching for PRD in:
- {bmm_creations_output_folder}/prd-*.md
- {planning_artifacts}/*-prd.md
- {project_folder}/docs/*-prd.md

[If found:]
"Found PRD: prd-my-project.md. Use this?"
[If not found:]
"No PRD found. This workflow requires a PRD to continue.
Please provide the path to your PRD, or run the PRD workflow first."
```

### Optional Inputs
Workflow can proceed without these, but user may include.

**Example:** UX workflow can use research docs if available

```markdown
## OPTIONAL INPUTS:

This workflow can incorporate research documents if available.

Searching for research in:
- {bmm_creations_output_folder}/research-*.md
- {project_folder}/research/

[If found:]
"Found these research documents:
- [1] user-interviews.md
- [2] competitive-analysis.md
Include any? (None required to proceed)"
```

---

## Module Workflow Chaining

**For modules with sequential workflows:**

**Frontmatter in workflow.md:**
```yaml
---
## INPUT FROM PRIOR WORKFLOFS

### Required Inputs:
- {module_output_folder}/prd-{project_name}.md

### Optional Inputs:
- {module_output_folder}/ux-research-{project_name}.md
- {project_folder}/docs/competitor-analysis.md
---
```

**Step 1 discovery:**
```markdown
## 1. Discover Prior Workflow Outputs

Check for required inputs:
1. Look for {module_output_folder}/prd-{project_name}.md
2. If missing → Error: "Please run PRD workflow first"
3. If found → Confirm with user

Check for optional inputs:
1. Search {module_output_folder}/ for research-*.md
2. Search {project_folder}/docs/ for *-analysis.md
3. Present findings to user
4. Add selections to {inputDocuments}
```

---

## Input Validation

After discovery, validate inputs:

```markdown
## INPUT VALIDATION:

For each discovered document:
1. Load and read frontmatter
2. Check workflowType field (should match expected)
3. Check completeness (stepsCompleted should be complete)
4. Check date (warn if document is very old)

[If validation fails:]
"Document prd-my-project.md appears incomplete.
Last step: step-06 (of 11)
Recommend completing PRD workflow before proceeding.
Proceed anyway? [Y]es [N]o"
```

---

## Multiple Input Selection

**When user can select multiple documents:**

```markdown
## Document Selection

"Found these relevant documents:
[1] prd-my-project.md (3 days ago) ✓ Recommended
[2] prd-v1.md (2 months ago) ⚠ Older version
[3] ux-research.md (1 week ago)

Enter numbers to include (comma-separated), or 'none' to skip:
> 1, 3

Selected: prd-my-project.md, ux-research.md"
```

**Track in frontmatter:**
```yaml
---
inputDocuments:
  - path: '{output_folder}/prd-my-project.md'
    type: 'prd'
    source: 'prior-workflow'
    selected: true
  - path: '{output_folder}/ux-research.md'
    type: 'research'
    source: 'prior-workflow'
    selected: true
---
```

---

## Search Path Variables

Common module variables for input discovery:

| Variable                 | Purpose                    |
| ------------------------ | -------------------------- |
| `{module_output_folder}` | Prior workflow outputs     |
| `{planning_artifacts}`   | General planning docs      |
| `{project_folder}/docs`  | Project documentation      |
| `{product_knowledge}`    | Product-specific knowledge |
| `{user_documents}`       | User-provided location     |

---

## Discovery Step Template

```markdown
---
name: 'step-01-init'
description: 'Initialize and discover input documents'

# Input Discovery
inputDocuments: []
requiredInputCount: 1
moduleInputFolder: '{module_output_folder}'
inputFilePatterns:
  - '*-prd.md'
---
```

---

## Validation Checklist

For input discovery:
- [ ] Required inputs defined in step frontmatter
- [ ] Search paths defined (module variables or patterns)
- [ ] User confirmation before using documents
- [ ] Validation of document completeness
- [ ] Clear error messages when required inputs missing
- [ ] Support for multiple document selection
- [ ] Optional inputs clearly marked as optional

---
name: 'e-09e-validate-sidecar'
description: 'Validate sidecar structure (after edit) - no menu, auto-advance'

nextStepFile: './e-09f-validation-summary.md'
editPlan: '{bmb_creations_output_folder}/edit-plan-{agent-name}.md'
expertValidation: ../data/expert-agent-validation.md
criticalActions: ../data/critical-actions.md
builtYaml: '{bmb_creations_output_folder}/{agent-name}/{agent-name}.agent.yaml'
sidecarFolder: '{bmb_creations_output_folder}/{agent-name}/{agent-name}-sidecar/'

advancedElicitationTask: '{project-root}/_bmad/core/workflows/advanced-elicitation/workflow.xml'
partyModeWorkflow: '{project-root}/_bmad/core/workflows/party-mode/workflow.md'
---

# Edit Step 9e: Validate Sidecar (After Edit)

## STEP GOAL

Validate the sidecar folder structure and referenced paths for Expert agents to ensure all sidecar files exist, are properly structured, and paths in the main agent YAML correctly reference them. Record findings to editPlan and auto-advance. For Simple agents without sidecar, mark as N/A.

## MANDATORY EXECUTION RULES

- **ONLY validates for Expert agents** - Simple agents should have no sidecar
- **MUST verify sidecar folder exists** before validating contents
- **ALWAYS cross-reference YAML paths** with actual files
- **ALWAYS load the builtYaml** to get sidecar configuration
- **ALWAYS use absolute paths** when referencing files
- **CRITICAL:** Load and validate EVERYTHING specified in the expertValidation.md file
- **PROVIDE clear remediation steps** for any missing or malformed files
- **🚫 NO MENU in this step** - record findings and auto-advance
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

## EXECUTION PROTOCOLS

### Protocol 1: Load and Compare
1. Read the expert validation reference from `{expertValidation}`
2. Read the critical actions reference from `{criticalActions}`
3. Read the built agent YAML from `{builtYaml}`
4. Read the edit plan from `{editPlan}`
5. Determine if agent has sidecar from metadata

### Protocol 2: Conditional Validation

**IF agent has hasSidecar: false OR agent is Simple:**
- [ ] Mark sidecar validation as N/A
- [ ] Confirm no sidecar-folder path in metadata
- [ ] Confirm no sidecar references in menu handlers

**IF agent has hasSidecar: true OR agent is Expert/Module with sidecar:**
- [ ] Proceed with full sidecar validation

### Protocol 3: Sidecar Validation Checks (For Expert Agents)

Perform these checks systematically - validate EVERY rule specified in expertValidation.md:

#### A. Sidecar Folder Validation
- [ ] Sidecar folder exists at specified path
- [ ] Sidecar folder is accessible and readable
- [ ] Sidecar folder path in metadata matches actual location
- [ ] Folder naming follows convention: `{agent-name}-sidecar`

#### B. Sidecar File Inventory
- [ ] List all files in sidecar folder
- [ ] Verify expected files are present
- [ ] Check for unexpected files
- [ ] Validate file names follow conventions

#### C. Path Reference Validation
For each sidecar path reference in agent YAML:
- [ ] Extract path from YAML reference
- [ ] Verify file exists at referenced path
- [ ] Check path format is correct (relative/absolute as expected)
- [ ] Validate no broken path references

#### D. Critical Actions File Validation (if present)
- [ ] critical-actions.md file exists
- [ ] File has proper frontmatter
- [ ] Actions section is present and not empty
- [ ] No critical sections missing
- [ ] File content is complete (not just placeholder)

#### E. Module Files Validation (if present)
- [ ] Module files exist at referenced paths
- [ ] Each module file has proper frontmatter
- [ ] Module file content is complete
- [ ] No empty or placeholder module files

#### F. Sidecar Structure Completeness
- [ ] All referenced sidecar files present
- [ ] No orphaned references (files referenced but not present)
- [ ] No unreferenced files (files present but not referenced)
- [ ] File structure matches expert agent requirements

### Protocol 4: Record Findings

Organize findings into three sections and append to editPlan frontmatter under `validationAfter.sidecar`:

```yaml
validationAfter:
  sidecar:
    hasSidecar: [true|false]
    status: [pass|fail|warning|n/a]
    passing:
      - "{check description}"
      - "{check description}"
    warnings:
      - "{non-blocking issue}"
    failures:
      - "{blocking issue that must be fixed}"
```

**PASSING CHECKS** (List what passed - for Expert agents)**
```
✓ Sidecar folder exists at expected path
✓ All referenced files present
✓ No broken path references
✓ Critical actions file complete
✓ Module files properly structured
✓ File structure matches expert requirements
```

**WARNINGS** (Non-blocking issues)
```
⚠ Additional files in sidecar not referenced
⚠ Some module files are minimal
⚠ Sidecar has no modules (may be intentional)
```

**FAILURES** (Blocking issues that must be fixed)
```
✗ Sidecar folder completely missing
✗ Sidecar folder path in metadata doesn't match actual location
✗ Critical file missing: critical-actions.md
✗ Broken path reference: {path} not found
✗ Referenced file is empty or placeholder
✗ Module file missing frontmatter
✗ Simple agent has sidecar configuration (should not)
```

**N/A FOR SIMPLE AGENTS:**
```
N/A - Agent is Simple type (hasSidecar: false, no sidecar required)
```

### Protocol 5: Auto-Advance

**🚫 NO MENU PRESENTED** - After recording findings, immediately load and execute `{nextStepFile}`

---

**Auto-advancing to validation summary...**

## SUCCESS METRICS

✅ All sidecar checks from expertValidation.md performed (or N/A for Simple)
✅ All checks validated against the actual builtYaml and file system
✅ Findings saved to editPlan with detailed status
✅ Agent type correctly identified (sidecar vs non-sidecar)
✅ Auto-advanced to next step

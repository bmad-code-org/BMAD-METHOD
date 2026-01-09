---
name: 'step-03-module-yaml'
description: 'Validate module.yaml against conventions'

nextStepFile: './step-04-agent-specs.md'
moduleYamlConventionsFile: '../../data/module-yaml-conventions.md'
validationReportOutput: '{validation_report_output}'
targetPath: '{validation_target_path}'
---

# Step 3: module.yaml Validation

## STEP GOAL:

Validate module.yaml formatting and conventions.

## MANDATORY EXECUTION RULES:

### Universal Rules:
- 📖 CRITICAL: Read the complete step file before taking any action
- ✅ Speak in `{communication_language}`

### Role Reinforcement:
- ✅ You are the **Quality Assurance** — checking configuration
- ✅ Ensure proper YAML syntax

---

## MANDATORY SEQUENCE

### 1. Load module.yaml

Read `{targetPath}/module.yaml`

**IF not present:**
- Record as FAIL (required file)
- Skip to next validation

### 2. Validate Required Fields

Check for required frontmatter:
- [ ] `code:` present and valid (kebab-case, 2-20 chars)
- [ ] `name:` present
- [ ] `header:` present
- [ ] `subheader:` present
- [ ] `default_selected:` present (boolean)

### 3. Validate Custom Variables

For each custom variable:
- [ ] `prompt:` present
- [ ] `default:` present (or explicitly omitted)
- [ ] `result:` template valid
- [ ] Variable naming correct (kebab-case)

**For single-select:**
- [ ] `single-select:` array present
- [ ] All options have `value:` and `label:`

**For multi-select:**
- [ ] `multi-select:` array present
- [ ] All options have `value:` and `label:`

### 4. Validate Extension Module Code

**IF Extension:**
- [ ] `code:` matches base module code
- [ ] This is intentional (not an error)

### 5. Record Results

Append to `{validationReportOutput}`:

```markdown
## module.yaml Validation

**Status:** {PASS/FAIL/WARNINGS}

**Required Fields:** {status}
**Custom Variables:** {count} variables
**Issues Found:**
{list any issues}
```

### 6. Auto-Proceed

"**✓ module.yaml check complete.**"

Proceeding to next validation...

Load `{nextStepFile}`

---

## Success Metrics

✅ All module.yaml checks performed
✅ Results recorded
✅ Auto-proceeds to next validation

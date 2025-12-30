---
name: 'v-02e-validate-sidecar'
description: 'Validate sidecar structure and append to report'

nextStepFile: './v-03-summary.md'
validationReport: '{bmb_creations_output_folder}/validation-report-{agent-name}.md'
expertValidation: ../data/expert-agent-validation.md
---

# Validate Step 2e: Validate Sidecar

## STEP GOAL:

Validate the agent's sidecar structure (if Expert type). Append findings to validation report and auto-advance.

## MANDATORY EXECUTION RULES:

- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: Read validationReport and expertValidation first
- 🚫 NO MENU - append findings and auto-advance
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Step-Specific Rules:

- 🎯 Validate sidecar structure for Expert agents
- 📊 Append findings to validation report
- 🚫 FORBIDDEN to present menu

## EXECUTION PROTOCOLS:

- 🎯 Load expertValidation.md reference
- 📊 Validate sidecar if Expert type, skip for Simple/Module
- 💾 Append findings to validation report
- ➡️ Auto-advance to summary step

## Sequence of Instructions:

### 1. Load References

Read `{expertValidation}` and `{validationReport}` to get agent type.

### 2. Conditional Validation

**IF agentType == expert:**
- Check metadata.sidecar-folder present
- Check sidecar-path correct format
- Verify sidecar files exist

**IF agentType != expert:**
- Mark as N/A

### 3. Append Findings to Report

Append to `{validationReport}`:

```markdown
### Sidecar Validation

**Status:** {✅ PASS / ⚠️ WARNING / ❌ FAIL / N/A}

**Checks:**
- [ ] metadata.sidecar-folder present (Expert only)
- [ ] sidecar-path format correct
- [ ] Sidecar files exist at specified path

**Findings:**
{Detailed findings or "N/A - Not an Expert agent"}
```

### 4. Auto-Advance

Load and execute `{nextStepFile}` immediately.

---

**Compiling validation summary...**

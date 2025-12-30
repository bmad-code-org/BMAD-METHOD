---
name: 'v-02c-validate-menu'
description: 'Validate menu structure and append to report'

nextStepFile: './v-02d-validate-structure.md'
validationReport: '{bmb_creations_output_folder}/validation-report-{agent-name}.md'
agentMenuPatterns: ../data/agent-menu-patterns.md
---

# Validate Step 2c: Validate Menu

## STEP GOAL:

Validate the agent's command menu structure against BMAD standards. Append findings to validation report and auto-advance.

## MANDATORY EXECUTION RULES:

- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: Read validationReport and agentMenuPatterns first
- 🚫 NO MENU - append findings and auto-advance
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Step-Specific Rules:

- 🎯 Validate command/menu structure
- 📊 Append findings to validation report
- 🚫 FORBIDDEN to present menu

## EXECUTION PROTOCOLS:

- 🎯 Load agentMenuPatterns.md reference
- 📊 Validate commands and menu
- 💾 Append findings to validation report
- ➡️ Auto-advance to next validation step

## Sequence of Instructions:

### 1. Load References

Read `{agentMenuPatterns}` and `{validationReport}`.

### 2. Validate Menu

Perform checks on: A/P/C convention, command names, descriptions.

### 3. Append Findings to Report

Append to `{validationReport}`:

```markdown
### Menu Validation

**Status:** {✅ PASS / ⚠️ WARNING / ❌ FAIL}

**Checks:**
- [ ] A/P/C convention followed
- [ ] Command names clear and descriptive
- [ ] Command descriptions specific and actionable
- [ ] Menu handling logic properly specified

**Findings:**
{Detailed findings}
```

### 4. Auto-Advance

Load and execute `{nextStepFile}` immediately.

---

**Validating YAML structure...**

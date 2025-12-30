---
name: 'v-02b-validate-persona'
description: 'Validate persona and append to report'

nextStepFile: './v-02c-validate-menu.md'
validationReport: '{bmb_creations_output_folder}/validation-report-{agent-name}.md'
personaProperties: ../data/persona-properties.md
principlesCrafting: ../data/principles-crafting.md
---

# Validate Step 2b: Validate Persona

## STEP GOAL:

Validate the agent's persona against BMAD standards. Append findings to validation report and auto-advance.

## MANDATORY EXECUTION RULES:

- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: Read validationReport and persona references first
- 🚫 NO MENU - append findings and auto-advance
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Step-Specific Rules:

- 🎯 Validate persona four-field system
- 📊 Append findings to validation report
- 🚫 FORBIDDEN to present menu

## EXECUTION PROTOCOLS:

- 🎯 Load personaProperties.md and principlesCrafting.md
- 📊 Validate persona fields
- 💾 Append findings to validation report
- ➡️ Auto-advance to next validation step

## Sequence of Instructions:

### 1. Load References

Read `{personaProperties}`, `{principlesCrafting}`, and `{validationReport}`.

### 2. Validate Persona

Perform checks on: role, identity, communication_style, principles.

### 3. Append Findings to Report

Append to `{validationReport}`:

```markdown
### Persona Validation

**Status:** {✅ PASS / ⚠️ WARNING / ❌ FAIL}

**Checks:**
- [ ] role: specific, not generic
- [ ] identity: defines who agent is
- [ ] communication_style: speech patterns only
- [ ] principles: first principle activates expert knowledge

**Findings:**
{Detailed findings}
```

### 4. Auto-Advance

Load and execute `{nextStepFile}` immediately.

---

**Validating menu structure...**

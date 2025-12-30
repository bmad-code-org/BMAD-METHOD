---
name: 'e-09c-validate-menu'
description: 'Validate menu structure (after edit) - no menu, auto-advance'

nextStepFile: './e-09d-validate-structure.md'
editPlan: '{bmb_creations_output_folder}/edit-plan-{agent-name}.md'
agentMenuPatterns: ../data/agent-menu-patterns.md
---

# Edit Step 9c: Validate Menu (After Edit)

## STEP GOAL:

Validate the agent's command menu structure after edits. Record findings to editPlan and auto-advance.

## MANDATORY EXECUTION RULES:

- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: Read editPlan and agentMenuPatterns first
- 🚫 NO MENU in this step - record findings and auto-advance
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Step-Specific Rules:

- 🎯 Validate command/menu structure
- 📊 Record findings to editPlan frontmatter (validationAfter section)
- 🚫 FORBIDDEN to present menu - auto-advance when complete

## EXECUTION PROTOCOLS:

- 🎯 Load agentMenuPatterns.md reference
- 📊 Validate commands and menu
- 💾 Record findings to editPlan
- ➡️ Auto-advance to next validation step when complete

## Sequence of Instructions:

### 1. Load References

Read `{agentMenuPatterns}` and `{editPlan}`.

### 2. Validate Menu

Perform checks on A/P/C convention, command names, descriptions.

### 3. Record Findings

Append to editPlan frontmatter:

```yaml
  menu:
    status: [pass|fail|warning]
    findings:
      - {check}: [pass|fail]
```

### 4. Auto-Advance

Load and execute `{nextStepFile}` immediately.

## SUCCESS METRICS

✅ All menu checks performed and recorded
✅ Findings saved to editPlan
✅ Auto-advanced to next step

---

**Auto-advancing to structure validation...**

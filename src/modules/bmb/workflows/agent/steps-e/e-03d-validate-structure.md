---
name: 'e-03d-validate-structure'
description: 'Validate YAML structure (before edit) - no menu, auto-advance'

nextStepFile: './e-03e-validate-sidecar.md'
editPlan: '{bmb_creations_output_folder}/edit-plan-{agent-name}.md'
agentCompilation: ../data/agent-compilation.md
---

# Edit Step 3d: Validate Structure (Before Edit)

## STEP GOAL:

Validate the agent's YAML structure and completeness. Record findings to editPlan and auto-advance.

## MANDATORY EXECUTION RULES:

- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: Read editPlan and agentCompilation first
- 🚫 NO MENU in this step - record findings and auto-advance
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

### Step-Specific Rules:

- 🎯 Validate YAML structure and required fields
- 📊 Record findings to editPlan frontmatter
- 🚫 FORBIDDEN to present menu - auto-advance when complete

## EXECUTION PROTOCOLS:

- 🎯 Load agentCompilation.md reference
- 📊 Validate YAML structure
- 💾 Record findings to editPlan
- ➡️ Auto-advance to next validation step when complete

## Sequence of Instructions:

### 1. Load References

Read `{agentCompilation}`.
Read `{editPlan}` to get agent file path.

### 2. Validate Structure

Perform checks on:
- **YAML syntax**: valid, no parse errors
- **Required fields**: name, description, type, persona present
- **Field types**: arrays where expected, strings where expected
- **Indentation**: consistent 2-space indentation

### 3. Record Findings

Append to editPlan frontmatter:

```yaml
  structure:
    status: [pass|fail|warning]
    findings:
      - {check}: [pass|fail]
      - {check}: [pass|fail]
```

### 4. Auto-Advance

When validation complete, load and execute `{nextStepFile}` immediately.

## SUCCESS METRICS

✅ All structure checks performed and recorded
✅ Findings saved to editPlan
✅ Auto-advanced to next step

---

**Auto-advancing to sidecar validation...**

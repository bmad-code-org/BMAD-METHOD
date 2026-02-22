---
name: 'step-02-plan'
description: 'Investigate, generate spec, present for approval'

wipFile: '{implementation_artifacts}/tech-spec-wip.md'
templateFile: '{installed_path}/tech-spec-template.md'
---

# Step 2: Plan

**Step 2 of 5 — Autonomous until checkpoint**

## RULES

- No intermediate approvals.
- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`

---

## INSTRUCTIONS

1. Investigate codebase.
2. Generate spec from `{templateFile}` → `{wipFile}`.
3. Self-review against READY FOR DEVELOPMENT standard.

### CHECKPOINT 1

Present summary. `[A] Approve  [E] Edit  [F] Full BMM`. HALT.

- **A**: Rename to `tech-spec-{slug}.md`, status `ready-for-dev`, freeze Problem/Solution/Scope/Non-Goals/Golden Examples. → Step 3.
- **E**: Apply changes, re-present.
- **F**: Exit to full BMM.

---

## NEXT

`{installed_path}/steps/step-03-implement.md`

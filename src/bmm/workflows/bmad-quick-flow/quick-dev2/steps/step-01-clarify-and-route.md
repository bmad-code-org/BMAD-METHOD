---
name: 'step-01-clarify-and-route'
description: 'Capture intent, route to execution path'

wipFile: '{implementation_artifacts}/tech-spec-wip.md'
---

# Step 1: Clarify and Route

**Step 1 of 5**

## RULES

- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`
- The skill argument IS the intent — not a hint.
- Do NOT assume you start from zero.

## CONTEXT

- `ready-for-dev` spec in `{implementation_artifacts}`? → Confirm, skip to step 3.
- `{wipFile}` exists? → Offer resume or archive.

---

## INSTRUCTIONS

1. Clarify intent. Do not fantasize, do not leave open questions Keep asking the human until clear enough to implement. 
2. Route:
   - **One-shot** — trivial (~3 files). `{execution_mode}` = "one-shot". → Step 3.
   - **Plan-code-review** — normal. → Step 2.
   - **Full BMM** — too big. Recommend and exit.
   - Ambiguous? Default to plan-code-review.

---

## NEXT

- One-shot / ready-for-dev: `{installed_path}/steps/step-03-implement.md`
- Plan-code-review: `{installed_path}/steps/step-02-plan.md`

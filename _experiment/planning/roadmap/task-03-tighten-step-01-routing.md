# Task 03: Tighten Step 1 — Routing

## Prerequisite

Task 01/02 findings indicate step 1 needs tightening.

## Intent

Add specificity to step-01-clarify-and-route.md only where skeleton testing revealed gaps. Reference the detailed plan in `_experiment/planning/redesign-plan.md` for the full spec of what step 1 should do — pull only what's needed.

## Likely areas (from the plan)

- Routing criteria precision (one-shot vs plan-code-review vs full-BMM boundaries)
- Intent exit criteria enforcement
- WIP/ready-for-dev artifact detection
- Project context backfill behavior

## Constraint

Keep prompts thin. Add the minimum words needed to close the gap. If the LLM was already doing it right from training, don't add instructions for it.

---
name: 'step-04-review'
description: 'Adversarial review, classify findings, optional spec loop'

adversarial_review_task: '{project-root}/_bmad/core/tasks/review-adversarial-general.xml'
deferred_findings_file: '{output_dir}/deferred-findings.md'
specLoopCap: 5
---

# Step 4: Review

**Step 4 of 5 — Autonomous**

## RULES

- Review subagents get NO conversation context.
- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`

---

## INSTRUCTIONS

1. Review in context-free subagents: intent audit (skip for one-shot) + adversarial code review via `{adversarial_review_task}`.
2. deduplicate and classify their findings as one of (in cascading order): 
- intent_gap - finding caused by the change and wouldn't happen if intent was clear,
- bad_spec - all other findings caused by the change, including direct deviations from spec; the spec had to be clear enough to prevent that 
- patch - all other findings that are real and can be trivially fixed
- defer - all other findings that are real or uncertain
- reject - all other findings that are noise
3. have intent_gap findings? Do not fantasize, ask the user.
4. have bad_spec findings? See if any of them still stand after intent_gap findings are resolved. If yes, discard lower level findings, amend spec, re-implement, re-review. Max `{specLoopCap}` iterations.
4. Auto-fix patches. Write deferred findings to `{deferred_findings_file}`. Forget about rejected findings. Commit.

---

## NEXT

`{installed_path}/steps/step-05-present.md`

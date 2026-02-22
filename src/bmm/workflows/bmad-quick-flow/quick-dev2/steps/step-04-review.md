---
name: 'step-04-review'
description: 'Adversarial review, classify findings, optional spec loop'

adversarial_review_task: '{project-root}/_bmad/core/tasks/review-adversarial-general.xml'
specLoopCap: 5
---

# Step 4: Review

**Step 4 of 5 — Autonomous**

## RULES

- Review subagents get NO conversation context.
- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`

---

## INSTRUCTIONS

1. Diff from `{baseline_commit}`. Review in context-free subagents: intent audit (skip for one-shot) + adversarial code review via `{adversarial_review_task}`.
2. Classify findings: intent > spec > patch > defer > reject.
3. Spec-class? Amend spec, re-derive, re-review. Max `{specLoopCap}` iterations.
4. Auto-fix patches. Commit.

---

## NEXT

`{installed_path}/steps/step-05-present.md`

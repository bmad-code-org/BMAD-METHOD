---
name: 'step-03-implement'
description: 'Branch, shard tasks, execute, commit. Local only.'

tasksDir: '{implementation_artifacts}/tasks'
sequenceFile: '{implementation_artifacts}/tasks/sequence.md'
---

# Step 3: Implement

**Step 3 of 5 — Autonomous. Local only.**

## RULES

- No push. No remote ops.
- Sequential execution only.
- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`

---

## INSTRUCTIONS

1. Baseline commit. Branch. Assert clean tree.
2. Shard spec tasks → `{tasksDir}/task-NN.md`. Track in `{sequenceFile}`.
3. Execute sequentially: read task fresh → implement → verify AC → mark complete → next.
4. Self-check. Commit.

One-shot: skip sharding, work from mental plan.

Halt after 3 failures on same task, or blocking ambiguity.

---

## NEXT

`{installed_path}/steps/step-04-review.md`

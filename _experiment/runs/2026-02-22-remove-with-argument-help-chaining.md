# QD2 Run: Remove ambiguous "with argument" from help task chaining

**Date:** 2026-02-22
**Workflow:** quick-dev2 (experimental)
**Branch:** exp/quick-flow-redesign

---

## Intent

User provided GitHub issue #1637: remove the `with argument` clause from 7 workflow completion steps that chain to `help.md`. The clause caused LLMs to interpret the file-read instruction as a skill/function invocation.

## Routing

- **Route chosen:** Plan-code-review (after correction)
- **Rationale:** Initially routed as one-shot. User challenged this ("One shot, really?") — the issue says "figure out the right approach," which requires a design decision, plus there are two sub-bugs to investigate (File #1 wrong argument, File #7 casing mismatch). Re-routed to plan-code-review.

## What Happened

**Step 1 (Clarify & Route):** Loaded issue #1637 via `gh issue view`. Captured intent correctly. Initially routed as one-shot — user corrected this. Re-routed to plan-code-review.

**Step 2 (Plan):** Investigated all 7 files, `help.md`, and the CSV catalog. Generated spec proposing to drop `with argument` entirely since the preceding "[Workflow] complete." text provides sufficient context for `help.md`'s inference. User questioned whether dropping it was truly consequence-free. Agent initially said "yes, really" with a confident explanation. User pushed back: "I don't really believe that. I'd like to see where in git history these were added." Agent traced the full commit history:
- `37346079` created `whats-after.md` with `Execute task ... with argument` as a deliberate input mechanism
- `ec8ab0c6` renamed to `bmad-help.md`, preserved `with argument`
- `def8da0a` changed `Execute` → `Read fully and follow:` but left `with argument` dangling

This revealed it was a legacy input channel from `whats-after.md`, not meaningless decoration. Agent corrected its earlier dismissive framing. User approved the spec.

**Step 3 (Implement):** Applied 7 identical single-line edits. Validated with grep — zero remaining instances.

**Step 4 (Review):** Ran adversarial code review in context-free subagent. 10 findings returned. Classified: 0 intent_gap, 0 bad_spec, 0 patch, 3 defer (pre-existing structural issues), 5 reject (out of scope or already documented).

**Step 5 (Present):** Summarized work, committed, user pushed, PR #1739 created against upstream main.

## Diff Produced

7 files, each with a single-line change removing ` with argument \`[workflow name]\`` from the help.md chaining line. Net: 7 insertions, 7 deletions.

## Human Notes

This flowed reasonably well. Took four minutes give or take and tens of thousands of tokens to complete an adversarial review run. Against what is a fairly simple, trivial change.

## Observations

- Agent initially over-confidently dismissed the user's skepticism about dropping the argument. The git history investigation was the user's idea, not the agent's. The agent should have investigated provenance before asserting "no consequences."
- Routing correction worked well — user challenged one-shot, agent accepted and re-routed without friction.
- The workflow plumbing (config loading, step transitions, checkpoint halts) was followed correctly through all 5 steps.
- This is the first QD2 run to complete the full plan-code-review path (previous runs were one-shots).
- The adversarial review found real pre-existing issues (duplicate next-steps sections, missing step numbers) that are worth separate tickets but correctly classified as out of scope for this change.
- The spec was approved on first presentation (no edit cycles at Checkpoint 1).
- No spec-loop iterations were needed (no bad_spec findings from review).

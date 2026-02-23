# Skeleton Test Findings

**Date:** 2026-02-22
**Runs analyzed:** 3
**Skeleton version:** QD2 bare step files (post `3126b9c4`)
**Plan reference:** `_experiment/planning/redesign-plan.md`

---

## Summary

Three QD2 runs were executed against real BMAD-METHOD tasks: two one-shots and one full plan-code-review. The step-file plumbing (config loading, step transitions, checkpoint halts) worked reliably. The core failures cluster around two themes: (1) one-shot route lacks discipline — agents bypass step architecture, skip review, and fantasize scope; (2) the skeleton step files are too terse to enforce plan-specified behaviors that the LLM doesn't do from training alone.

---

## Per-Step Observations

### Step 1 — Clarify and Route

| # | Observation | Class | Run |
|---|------------|-------|-----|
| 1 | Config loading failed — `config.yaml` doesn't exist in the BMAD source repo (it's the source, not an installed project). Had to resolve values manually. | **Plumbing** | Run 1 |
| 2 | Step transitions and NEXT directives followed correctly across all runs that used the step architecture. | **Works** | All |
| 3 | Agent fantasized scope expansion: asked to remove 1 human turn, removed 2 without asking. Mentioned but didn't ask the clarifying question. Step file says "scope clear" in exit criteria but doesn't enforce ask-before-expanding. | **Execution Gap** | Run 1 |
| 4 | Agent captured intent directionally but mangled specifics: conflated adversarial review with conformance review. No clarifying questions asked. Step file's terse "Clarify intent" wasn't sufficient. | **Execution Gap** | Run 2 |
| 5 | Agent bypassed step architecture entirely for one-shot — acted immediately without routing through step files. The implicit one-shot path provides no structural enforcement. | **Execution Gap** | Run 2 |
| 6 | Agent initially routed as one-shot when the task required design decisions (investigating sub-bugs, choosing an approach). User challenged; agent re-routed to plan-code-review without friction. The "Ambiguous? Default plan-code-review" guidance is in the step file — agent misjudged but the correction mechanism worked. | **Works** | Run 3 |
| 7 | VC convention backfill didn't happen in any run. Both plan and step file specify it. Agent ignored. | **Execution Gap** | All |

### Step 2 — Plan

| # | Observation | Class | Run |
|---|------------|-------|-----|
| 8 | Spec generated, self-reviewed, presented at checkpoint. Approved first try. Workflow plumbing correct. | **Works** | Run 3 |
| 9 | Agent over-confidently asserted "no consequences" when user asked about provenance of `with argument`. Dismissed skepticism. User had to insist on git history investigation, which then revealed important context (legacy input channel from `whats-after.md`). Neither plan nor step file tells the agent to investigate provenance before claiming safety. | **Plan Gap** | Run 3 |
| 10 | After user pushed back, agent did the investigation, corrected its framing, and produced a stronger spec. The plan's "ask the human about intent and constraints" principle was retroactively satisfied, but only because the human forced it. | **Gap** | Run 3 |

### Step 3 — Implement

| # | Observation | Class | Run |
|---|------------|-------|-----|
| 11 | Implementation of 7 single-line edits was clean and correct. Validation grep confirmed zero remaining instances. | **Works** | Run 3 |
| 12 | Task sharding (plan: "each task to its own file, sequence file tracks execution") likely did not happen. Run log doesn't mention it. Agent probably executed tasks inline from the spec. Step file specifies sharding but for 7 identical edits, agent optimized. | **Execution Gap** | Run 3 |
| 13 | One-shot implementations (runs 1 & 2) skipped step-03 entirely — changes were made inline during step 1. No baseline commit, no branch, no clean-tree assertion. | **Execution Gap** | Runs 1, 2 |
| 14 | Conventional commit message produced correctly. | **Works** | Run 3 |
| 15 | No push or remote operations during implementation — correctly local-only. | **Works** | Run 3 |

### Step 4 — Review

| # | Observation | Class | Run |
|---|------------|-------|-----|
| 16 | One-shot runs had NO review at all. Plan says one-shot "Still does auto VC and review" and Layer 2 is "non-negotiable." Step files route step-03 → step-04, but one-shot agents bypassed the step architecture entirely. | **Execution Gap** | Runs 1, 2 |
| 17 | Plan-code-review run did adversarial review in a context-free subagent. 10 findings returned, classified correctly (0 intent_gap, 0 bad_spec, 0 patch, 3 defer, 5 reject). Classification cascade worked. | **Works** | Run 3 |
| 18 | Layer 1 (intent audit) unclear whether it was executed separately from Layer 2. Plan specifies two distinct layers in isolated subagents. Step file mentions both but doesn't enforce separate execution. | **Gap** | Run 3 |
| 19 | Adversarial review consumed ~4 minutes and tens of thousands of tokens for a trivial 7-line change. Plan has no mechanism to scale review effort proportionally to change size. | **Plan Gap** | Run 3 |
| 20 | Adversarial review found real pre-existing issues (duplicate next-steps sections, missing step numbers) correctly classified as defer (out of scope). Review quality was good. | **Works** | Run 3 |
| 21 | Spec loop not triggered (no spec-class findings). Frozen sections, change log, positive preservation — all untested. | **Not tested** | Run 3 |

### Step 5 — Present

| # | Observation | Class | Run |
|---|------------|-------|-----|
| 22 | Classified findings presented. Checkpoint halt worked. User approved. | **Works** | Run 3 |
| 23 | Push command printed, user pushed manually. Correctly never auto-pushed. | **Works** | Run 3 |
| 24 | PR #1739 created via `gh pr create`. | **Works** | Run 3 |

---

## Cross-Cutting Findings

### Finding A: One-shot route is structurally unenforceable

**Class: Execution Gap (systemic)**

The plan treats one-shot as a lighter version of the same flow — same steps, collapsed review. The skeleton routes one-shot to step-03. But in practice, agents treated one-shot as permission to bypass the step architecture entirely. Both one-shot runs (1 and 2) completed the work inline during step 1, never entering steps 3-5. This means:
- No baseline commit captured
- No clean-tree assertion
- No review of any kind (Layer 2 is "non-negotiable" per plan)
- No conventional commit
- No PR creation

The step files have the routing (`→ Step 3`), but one-shot's "skip sharding, work from mental plan" instruction combined with the terse step files gives the agent implicit permission to collapse everything. The plan's one-shot design assumes the agent will still follow the step architecture — the skeleton doesn't enforce that assumption.

**Recommendation:** Step 1 needs explicit instruction that one-shot still proceeds through steps 3-5. The "skip sharding" instruction in step-03 should be the only concession, not a wholesale bypass of the remaining flow.

### Finding B: Terse step files rely on training for behaviors the plan explicitly doesn't trust to training

**Class: Execution Gap (design tension)**

The plan contains detailed rationale for why specific behaviors need explicit prompting — e.g., "Do NOT prescribe how to capture intent" (trust training) vs. "Define exit criteria for captured intent" (don't trust training for this). The skeleton step files are so terse they push almost everything to training:

- Step-01: "Clarify intent until: problem unambiguous, scope clear" — trusts training to know how to clarify. But runs 1 and 2 show training doesn't reliably enforce "ask before expanding scope."
- Step-02: "Investigate codebase" — trusts training to investigate deeply. Run 3 shows the agent didn't investigate provenance until pushed.
- Step-03: "Shard spec tasks → task files" — trusts training to do file-based sharding. Agent likely skipped it.
- Step-04: "intent audit + adversarial code review" — trusts training to run two separate review layers. Unclear if this happened.

The plan's own philosophy distinguishes between what training handles (how to ask clarifying questions) and what needs explicit prompting (exit criteria, anti-fantasizing, investigation depth). The skeleton doesn't make this distinction — it's uniformly terse.

**Recommendation:** Identify the specific behaviors where training fails (from these runs) and add explicit enforcement to those step files. Keep everything else terse.

### Finding C: Ask-don't-fantasize is the highest-signal gap

**Class: Execution Gap**

Two of three runs showed the same failure pattern: the agent understood the gist of the request but silently expanded or reframed the scope without asking. Run 1 removed 2 turns instead of 1. Run 2 conflated review types. Both could have been caught by a single clarifying question.

The plan addresses this: "Ask the human about intent and constraints, not implementation details." The step file has "scope clear" in exit criteria. But neither formulation was strong enough to prevent fantasizing. The commit `3126b9c4` added "ask-dont-fantasize" enforcement — but based on these runs, the current skeleton text still isn't forceful enough.

**Recommendation:** The ask-dont-fantasize principle needs to be the loudest instruction in step 1, not a bullet in exit criteria. Something like: "When in doubt about scope, ASK. Never silently expand, reframe, or interpret scope beyond what the human stated."

### Finding D: No project-context backfill occurred

**Class: Execution Gap**

Plan specifies VC convention backfill on first run. Step file says "Backfill VC conventions to project-context if unknown." Zero runs did it. This is a case where terse instruction + optional behavior = skipped every time. The agent has higher-priority tasks (the actual request) and treats backfill as optional housekeeping.

**Recommendation:** Make backfill a blocking gate with a specific check: "Does project-context.md exist with a VC section? If no → ask and write before proceeding."

---

## Plan Gap vs Execution Gap Tally

| Classification | Count | Key examples |
|---------------|-------|-------------|
| **Works** | 10 | Step transitions, checkpoint halts, spec generation, classification, commit, push discipline, PR creation |
| **Gap** (behavior missing, unclassified root) | 2 | Intent audit unclear (#18), provenance investigation after correction (#10) |
| **Execution Gap** (plan covers it, step file doesn't deliver) | 8 | One-shot bypass (#5, #13, #16), scope fantasizing (#3, #4), no backfill (#7), task sharding skipped (#12), step architecture ignored (#5) |
| **Plan Gap** (plan doesn't specify) | 2 | Provenance investigation (#9), review cost proportionality (#19) |
| **Plumbing** | 1 | Config.yaml missing in source repo (#1) |
| **Not tested** | 1 | Spec loop (#21) |

---

## Conclusions

1. **The step-file plumbing works.** Config loading (once config exists), step transitions, checkpoint halts, NEXT directives — all reliable.

2. **The plan-code-review path works end-to-end.** Run 3 completed all 5 steps, produced a clean spec, correct implementation, meaningful adversarial review, and a merged PR.

3. **The one-shot path is broken.** Agents bypass the step architecture and skip review. This is the highest-priority fix — either enforce step progression for one-shots or redesign the one-shot path to be self-contained.

4. **Terse step files cause execution gaps.** The skeleton is too terse for behaviors the plan explicitly identified as needing enforcement. The fix is surgical: add explicit instructions only where training demonstrably fails (ask-dont-fantasize, backfill gates, one-shot step enforcement), keep everything else terse.

5. **Two genuine plan gaps found:** (a) no guidance on investigating provenance before asserting safety of removals; (b) no mechanism to scale review effort to change size (trivial changes get the same review cost as complex ones).

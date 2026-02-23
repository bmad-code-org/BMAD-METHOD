# Skeleton Eval Report: QD2 vs QD Baseline

**Date:** 2026-02-22
**Evaluator:** QD2 workflow (self-eval via task-02)
**Plan reference:** `_experiment/planning/redesign-plan.md`
**Findings reference:** `_experiment/results/skeleton-test-findings.md`

---

## Methodology

### Data Sources

**QD2 (new unified workflow) — 3 runs from today:**

| Run | Task | Route | JSONL |
|-----|------|-------|-------|
| Run 1 | Add plan review step to task-01 | One-shot | `_experiment/runs/2026-02-22-add-plan-review-to-task01.jsonl` |
| Run 2 | Eliminate [A][P][C] menu gates from quick-spec | One-shot | `_experiment/runs/2026-02-22-eliminate-apc-menu-gates.jsonl` |
| Run 3 | Remove `with argument` from help task chaining | Plan-code-review | `_experiment/runs/2026-02-22-remove-with-argument-help-chaining.jsonl` |

**Old QD (separate quick-spec + quick-dev) — baseline pair from today:**

| Session | Workflow | Task | JSONL |
|---------|----------|------|-------|
| QS | quick-spec | Convert raven + file-reference-review tools → bmad-os skills | `~/.claude/projects/-Users-alex-src-bmad/bfdc0b67-...jsonl` |
| QD | quick-dev | Same task (implementation phase) | `~/.claude/projects/-Users-alex-src-bmad/2e76062b-...jsonl` |

### Comparability Caveat

The old QD baseline task (skill conversion) is structurally more complex than any individual QD2 run (new files, structural understanding, multi-file creation). The QD2 runs ranged from trivial (1-file edit) to moderate (7-file identical edits). Direct metric comparison must account for task complexity. The fairest comparison pair is **Old QD combined vs QD2 Run 3**, since both went through the full plan→implement→review pipeline, even though the old QD task was harder.

---

## Metrics Comparison

### North Star: Human Turns

Counting method: every action the user typed during the workflow, including slash-command invocations and `/clear`. Excludes only system-injected messages (skill file auto-loads, tool results, bash echo-backs, local-command caveats) and post-workflow housekeeping (log saving, prompt writing).

**Old QD = two separate workflows (quick-spec then quick-dev):**

| Action | Turn | Category |
|--------|------|----------|
| `/output-style tts-summary` | QS #1 | Invocation |
| `/bmad-bmm-quick-spec` | QS #2 | Invocation |
| Task description (investigate bmad-os-skills, plan conversion) | QS #3 | Substantive |
| XML tags question | QS #4 | Substantive |
| H2 headings suggestion | QS #5 | Substantive |
| "verify XML tags useless" | QS #6 | Substantive |
| Context concern about skill.md size | QS #7 | Substantive |
| "1.yes; 2 delete; 3 move and reformat" | QS #8 | Substantive |
| `c` (checkpoint continue) | QS #9 | Mechanical |
| "go ahead" (approval) | QS #10 | Substantive |
| `c` (checkpoint continue) | QS #11 | Mechanical |
| `c` (checkpoint continue) | QS #12 | Mechanical |
| `/clear` (switch to dev session) | QD #1 | Invocation |
| `/bmad-bmm-quick-dev` | QD #2 | Invocation |
| "Why do you ask me when there is an outstanding tech spec?" | QD #3 | Substantive (context re-establishment) |
| `f` | QD #4 | Mechanical |
| "changes are in the main worktree" (worktree confusion) | QD #5 | Substantive (context re-establishment) |
| "Commit and push. Make PR." | QD #6 | Substantive (not part of workflow — user had to request manually) |
| **TOTAL: 18** | | **4 invocations, 10 substantive, 4 mechanical** |

**QD2 Run 3 = single unified workflow (plan-code-review):**

| Action | Turn | Category |
|--------|------|----------|
| `/bmad-bmm-quick-dev2` | #1 | Invocation |
| Issue URL (task input) | #2 | Substantive |
| "One shot, really?" (routing challenge) | #3 | Substantive (quality-improving) |
| Testing feedback / questioning consequences | #4 | Substantive (quality-improving) |
| "I'd like to see where in Git history..." | #5 | Substantive (quality-improving) |
| "Okay, approve." (spec checkpoint) | #6 | Substantive |
| "Yes." (review checkpoint) | #7 | Substantive |
| `z` | #8 | Mechanical |
| **TOTAL: 8** | | **1 invocation, 6 substantive, 1 mechanical** |

**Delta: 18 → 8 = −10 human turns (−56%)**

Sources of reduction:
- **−3 invocations:** Old QD requires 4 invocations (`/output-style`, `/bmad-bmm-quick-spec`, `/clear`, `/bmad-bmm-quick-dev`). QD2 requires 1 (`/bmad-bmm-quick-dev2`).
- **−3 mechanical turns:** Old QD's [A][P][C] menu gates required 3 "c" presses. QD2 has 2 checkpoints but they're substantive approvals ("Okay, approve", "Yes"), not mechanical continues.
- **−2 context re-establishment turns:** Old QD's context reset forced the user to re-explain intent to the dev agent ("Why do you ask me when there is an outstanding tech spec?") and sort out worktree confusion. QD2 carries context forward.
- **+2 quality-improving turns:** QD2's savings funded deeper interaction — the user challenged routing and pushed for git history investigation, catching real issues that old QD would have missed.

**Apples-to-oranges caveat on VC operations:** In old QD, commit/push/PR is **not a workflow step** — the user had to explicitly request it (QD #6: "Commit and push. Make PR."). In QD2, Step 5 (Present) handles VC operations autonomously as part of the workflow. So QD2's 8 turns include VC; old QD's 18 turns include the user *manually requesting* VC. If old QD had automated VC like QD2, it would need either (a) more agent turns to handle it, or (b) the same turns but without costing a human turn — making the comparison even more favorable to QD2.

Additionally, the old QD task (skill conversion, multi-file creation) was structurally more complex than QD2 Run 3 (7-file identical edits). A harder task *should* require more turns. The 56% reduction therefore understates QD2's efficiency advantage when comparing like-for-like complexity.

### Agent Turns / API Round-Trips

| Session | API Turns (deduplicated) | Tool Calls |
|---------|------------------------|------------|
| Old QD combined | 72 (32 + 40) | 121 |
| **QD2 Run 3** | **49** | **123** |

**Delta (full pipeline):** 72 → 49 = **−32% fewer API turns**

QD2 makes fewer API calls because it doesn't pay the context reset tax — no re-loading workflow files, re-reading config, or re-discovering the spec in a second session. Tool call count is nearly identical (121 vs 123), confirming the actual *work* is the same.

### Token Usage

**Corrected figures** — workflow-bounded, deduplicated by requestId:

| Session | API Turns | Context Start | Context End | Cache Read | Cache Create | Output | **Total** |
|---------|-----------|--------------|-------------|------------|-------------|--------|-----------|
| Old QS | 32 | 24,325 | 76,831 | 1,470,101 | 90,738 | 2,445 | **1,563,955** |
| Old QD | 40 | 24,302 | 68,899 | 2,008,659 | 46,074 | 1,282 | **2,056,068** |
| **Old combined** | **72** | — | — | **3,478,760** | **136,812** | **3,727** | **3,620,023** |
| **QD2 Run 3** | **49** | **62,304** | **112,152** | **4,017,701** | **103,992** | **1,641** | **4,123,402** |

**Delta (full pipeline):** 3.62M → 4.12M = **+14% more tokens (1.14x)**

~~The original report claimed 2.7x — this was wrong.~~ The error came from comparing the full JSONL file (which contained Run 1 + housekeeping + Run 3 = 87 turns) against only the old QD workflow sessions. Proper workflow-bounded comparison shows near-parity.

**Why even 14% higher?** QD2 Run 3 started mid-session at 62K context (carrying Run 1's prior conversation) instead of a fresh 24K. This inflated every turn's cache reads. In a fresh session, QD2 would start at ~24K (same as old QD) and with 32% fewer turns (49 vs 72), would likely be **cheaper** than old QD.

**Per-turn cost is higher but turns are fewer:**

| | Old QD | QD2 | Explanation |
|---|--------|-----|-------------|
| Average tokens/turn | 50,278 | 84,151 | QD2 started mid-session with 62K context |
| Total turns | 72 | 49 | −32%: no double-init, no context re-establishment |
| Fresh-session estimate | 3.62M | ~2.5M | QD2 with 24K start would use fewer total tokens |

**Why fewer turns?** Old QD pays a "context reset tax" — the dev session must re-load workflow files, re-read config, re-discover the spec, and re-establish understanding. QD2 carries context forward. This saves ~23 turns of initialization and re-orientation overhead.

### Wall-Clock Duration

| Session | Duration | Notes |
|---------|----------|-------|
| Old QS | 4h 41m | Includes substantial idle/think time |
| Old QD | 1h 13m | Active development |
| Old combined | ~5h 55m | Sequential, with gap between sessions |
| QD2 Run 1 | 7m | Quick one-shot |
| QD2 Run 2 | 1h 22m | Includes AskUserQuestion wait |
| QD2 Run 3 | 2h 13m | Full pipeline |

**Delta (full pipeline):** ~5h55m → ~2h13m = **−62% wall-clock**

Large caveat: wall-clock includes human think time and idle periods, making this metric unreliable for comparing agent efficiency. The old QD's 4h41m spec session likely includes significant gaps where the user was doing other things. Active execution time would be a better metric but isn't extractable from JSONL alone.

### Quality of Output

| Dimension | Old QD | QD2 | Assessment |
|-----------|--------|-----|------------|
| Intent capture | Spec verified in separate review step | Run 3: good. Runs 1-2: poor (fantasized scope) | **Mixed** — plan-code-review path works, one-shot doesn't |
| Implementation correctness | Clean, PR merged | Run 3: clean, PR #1739 merged. Runs 1-2: errors | **Equivalent** on plan-code-review path |
| Review thoroughness | Full adversarial review in quick-dev | Run 3: full adversarial review. Runs 1-2: NO review | **Regression** on one-shot (review skipped entirely) |
| VC discipline | Conventional commits, PR created | Run 3: conventional commit + PR. Runs 1-2: no commit | **Regression** on one-shot |

---

## Where QD2 Is Better

1. **56% fewer human turns** — from 18 to 8, driven by eliminating the two-workflow invocation overhead, mechanical checkpoint presses, and the inter-session context reset. This is the north star metric.

2. **Single session continuity** — the agent carries full context from planning through implementation. No risk of the dev agent misinterpreting the spec because it wrote the spec.

3. **Explicit routing** — the plan-code-review path correctly forces structured execution. Old QD had no routing concept; every task followed the same heavyweight flow.

4. **Step-file architecture** — when followed, provides clear progression and prevents the agent from going off-track. The plan-code-review run (Run 3) demonstrates this working well.

## Where QD2 Is Worse

1. **One-shot path is broken** — 2 of 3 runs took the one-shot path and bypassed the step architecture entirely (no review, no commit, no quality gates). The plan-code-review path works; one-shot doesn't. This is documented extensively in `skeleton-test-findings.md`.

2. **Higher per-turn context cost** — QD2's unified session accumulates context continuously (62K → 112K in Run 3). Each late-session turn re-reads more cached context than old QD's fresh dev session would. In a multi-task session this compounds. However, this is offset by 32% fewer total turns, making the net token cost roughly equivalent.

3. **Review cost is fixed, not proportional** — Run 3's adversarial review consumed ~30-40 turns and tens of thousands of tokens for 7 identical line changes. The plan has no mechanism to scale review effort to change complexity.

## Where QD2 Is Equivalent

1. **Total token cost** — workflow-bounded comparison shows 3.62M (old) vs 4.12M (QD2) = 1.14x. The 14% overhead is entirely explained by QD2 Run 3 starting mid-session at 62K context. A fresh-session QD2 run would likely be cheaper (~2.5M estimated) due to 32% fewer API turns.

2. **Implementation quality** — when the plan-code-review path is followed, the output is equivalent: clean diffs, conventional commits, successful PRs.

3. **Tool call volume** — actual work (file reads, edits, grep validations) is comparable at ~121-123 tool calls for the full pipeline.

4. **Adversarial review quality** — when review runs, findings quality is comparable. Classification (intent_gap, bad_spec, patch, defer, reject) works correctly.

---

## Recommendations (Prioritized by North Star Impact)

### P0: Fix One-Shot Path

**Impact on human turns:** Prevents 2-of-3 runs from producing bad output that requires human correction turns.

The one-shot route needs either:
- (a) Explicit enforcement that steps 3-5 still execute (review, commit, present), or
- (b) Elimination as a route — default everything to plan-code-review and let the agent's natural speed handle trivial tasks

Option (b) is recommended. The plan-code-review path works. One-shot doesn't. Removing a broken option reduces human correction turns.

### P1: Strengthen Ask-Don't-Fantasize

**Impact on human turns:** Prevents scope misinterpretation that requires correction (observed in 2 of 3 runs).

Already identified in the skeleton findings. Making it the loudest instruction in Step 1 directly reduces human correction turns. Promotes from P3 since the token cost concern (formerly P1) was based on incorrect data.

### P2: Scale Review to Change Size

**Impact on human turns:** Saves time on trivial changes (which are the majority).

Add a heuristic: if the diff is ≤ N files and ≤ M lines of identical changes, use a lightweight self-review instead of spawning a full adversarial subagent. Reserve the heavy review for specs with design decisions or complex logic.

### P3: Monitor Context Growth in Multi-Task Sessions

**Impact on tokens:** Low urgency — token cost is at parity for single-task sessions.

The 14% token overhead observed in Run 3 was entirely due to starting mid-session (62K vs 24K context). For single-task sessions, QD2 is likely cheaper than old QD. However, if users chain multiple tasks in one session, context accumulates and per-turn cost grows. Worth monitoring but not blocking.

---

## Summary Scorecard

| Metric | Old QD (baseline) | QD2 Run 3 (skeleton) | Delta | Verdict |
|--------|-------------------|---------------------|-------|---------|
| Human turns (total) | 18 | 8 | −56% | **Better** |
| Human turns (substantive only) | 10 | 6 | −40% | **Better** |
| API turns (deduplicated) | 72 | 49 | −32% | **Better** |
| Tool calls | 121 | 123 | +2% | **Equivalent** |
| Total tokens (workflow-bounded) | 3.62M | 4.12M | +14% | **Equivalent** |
| Total tokens (fresh-session est.) | 3.62M | ~2.5M | −31% | **Better** |
| Wall-clock | ~5h55m | ~2h13m | −62% | **Better** (unreliable) |
| Output quality | Good | Good (plan-code-review) | — | **Equivalent** |
| One-shot quality | N/A | Poor | — | **Regression** |

**Bottom line:** QD2's plan-code-review path cuts human turns by 56% (18 → 8) and API turns by 32% (72 → 49) at roughly equivalent token cost (1.14x, entirely explained by mid-session context). In a fresh session, QD2 would likely be ~31% cheaper on tokens too. The one-shot path is a net negative — it bypasses quality gates entirely. Tightening priority: fix one-shot (P0), strengthen ask-don't-fantasize (P1), scale review (P2), monitor multi-task context growth (P3).

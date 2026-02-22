# Quick-Flow Redesign — Session State (Compaction)

## What This Is

This is a compacted session state for the quick-flow redesign brainstorming/planning session. Read this file to resume the session with full context.

## Artifacts

- **Intent doc:** `_bmad-output/planning-artifacts/quick-flow-redesign-intent.md` — the original vision statement, approved by human
- **Plan (current):** `_bmad-output/planning-artifacts/quick-flow-redesign-plan.md` — the implementation plan, iteratively refined through this session
- **Analysis of old flows:** `/tmp/bmad-quick-flow-logs/analysis.md` — turn-by-turn analysis of what went wrong with the old quick-spec + quick-dev sessions
- **Oscillation research:** `/tmp/agent-loop-oscillation-research.md` — deep research on agent loop oscillation, divergence, and mitigations (13 academic papers, production reports from Devin/Cursor/Claude Code/Codex)

## Core Design Decisions (Settled)

These are not up for debate — they were explicitly decided by the human:

1. **North star: minimize human turns.** Everything serves this goal.
2. **Unified flow replaces both quick-spec and quick-dev.** One session, one context.
3. **Exactly two human checkpoints** for plan-code-review route: end of plan, end of review. Non-negotiable.
4. **Plan is source code, implementation is a build artifact.** If the agent drifted from the spec, the spec wasn't precise enough — that's a spec defect.
5. **Push is strictly prohibited by default.** Hard ban unless overridden in sidecar config. Human copy-pastes push command.
6. **All remote VC operations (push, PR) live in step 5 only.** Step 3 is local-only.
7. **No parallel task execution.** Race conditions are a hard taboo. Sequential only.
8. **Generic flow first.** Platform-agnostic. CC-native variant is future work.
9. **Don't prescribe how to capture intent.** Define exit criteria, not process. LLM knows how to ask questions from training.
10. **Skill argument is the primary expression of intent.** Don't assume you start from zero.
11. **When routing is ambiguous between one-shot and spec, default to spec.** Writing a spec for something trivial is less costly than one-shotting something complex.
12. **Adversarial code review in context-free subagent is non-negotiable** even for trivial one-shot changes.
13. **Spec loop hard cap: default 5, overridable in sidecar.**
14. **`_bmad-output/wip.md`** (all lowercase) — parking lot for deferred findings and guiding principle breadcrumbs. Append-only, never auto-loaded.
15. **Quick-flow is zero-dependency** — works with no project context files. But bootstraps/backfills context over time so it never asks the same question twice.
16. **Task sharding uses BMAD sharded workflow pattern.** Sequence file robust against crashes. Generic flow uses files; CC-native uses TaskCreate/TaskGet.
17. **Lists in prompts are examples, not exhaustive.** LLMs treat lists as exhaustive — be careful.
18. **Positive Preservation when discarding code.** Extract "what worked well" as KEEP instructions before re-deriving. Prevents loss of emergent cleverness across spec-loop iterations.
19. **Golden Examples in spec template are frozen after checkpoint 1.** Same treatment as Problem/Solution/Scope/Non-Goals.

## Classification System

Four categories for review findings:
- **Spec** — root cause traces to the spec (wrong, vague, or insufficiently precise to prevent drift). Fix the spec, re-derive code.
- **Patch** — code quality issue unrelated to the spec. Fix the code.
- **Defer** — not worth blocking. Park in wip.md.
- **Reject** — not a real finding.

**Key classification behaviors:**
- Two-pass: scan ALL findings for spec-class first. If any found and under iteration limit, fix them all, re-derive, re-review. Do NOT classify remaining findings — they're moot.
- Only classify into patch/defer/reject when no spec-class findings remain (or iteration limit hit).
- Low-confidence findings (can't confidently classify) go to the human at checkpoint 2 as the primary action item. Usually 1-3 items.

## Review Architecture

**Three roles, separated by design:**
1. **Intent/Rules Auditor (Layer 1)** — receives spec + code + project rules. No conversation context. Checks functional correctness and rule adherence. Skipped for one-shot route.
2. **Adversarial Code Reviewer (Layer 2)** — receives only diff + source code. Information-asymmetric by design. Non-negotiable for all routes including one-shot.
3. **Classifier** — the implementor agent classifying external findings. Must NOT review (anchoring bias). But well-equipped to classify because outside findings break through the anchor.

**Additional layers** extensible via sidecar config (security, accessibility, etc.).

**Findings merge** uses existing BMAD dedup-reorder-classify pattern before classification.

## Oscillation Mitigations (In Progress)

The spec-loop is the highest-risk point. Research confirmed:
- LLMs naturally converge to 2-period attractor cycles
- Self-correction without external feedback often degrades performance
- 37.6% increase in security vulnerabilities after just 5 iterations
- "Spec-rewriting is the hardest case" — no stable external anchor when agent can modify both spec and implementation

**Current mitigations in the plan:**
- Hard iteration cap (default 5)
- Frozen original intent as immutable reference (discussed but NOT yet written into the plan)

**Mitigation under discussion:**
- **Guardrails ratchet** (from Ralph Wiggum Loop literature) — each spec amendment appends a constraint documenting what was changed and why. Creates monotonically increasing constraints preventing revisiting known-bad states. Concrete and implementable. NOT yet written into the plan.

## Task List — Discussion Items

Discussion items from adversarial review of the plan. Status as of compaction:

**Completed (resolved):**
- #1 Token/cost/time budgets — context window + iteration cap are the practical mitigations. No other way in generic flow.
- #2 merge-base hardcodes "main" — actionable. Implementation task #26 created.
- #3 Migration path for WIP files — out of scope.
- #4 Dry-run flag — out of scope.
- #5 .gitignore for _bmad-output — out of scope.
- #6 Routing is stochastic — acceptable. Checkpoint catches bad routing. No change needed.
- #7 "Don't prescribe intent capture" is dangerous — rejected. Exit criteria are the guardrail.
- #8 Autonomy between checkpoints risks divergence — rejected. Quick-flow is for small tasks. Argues against north star.

**Resolved (session 2 — team-based discussion):**
- #9 Spec-loop oscillation — **ACCEPT.** Three mitigations written into Phase C: (1) frozen intent sections (Problem/Solution/Scope/Non-Goals read-only after checkpoint 1, intent-class findings escalate to human), (2) guardrails ratchet (spec change log prevents revisiting known-bad states), (3) hard iteration cap (unchanged). New classification cascade: intent-class > spec-class > patch-class.
- #10 Sequence file crash-proofing — **SKIP.** Plan is adequate as-is.
- #11 Prompt growth — **SKIP.** Non-issue for quick-flow's small task scope.
- #12 Resume logic — **ACCEPT.** Added clean-worktree precondition and resume policy to Step 3.
- #13 Worktree edge cases — **SKIP.** "Detect and reuse" is sufficient.
- #14 merge-base linear history — **REJECT.** Reviewer misunderstands how merge-base works.
- #15 Push safety theater — **REJECT.** Settled decision #5.
- #16 Auto-patch ACs — **SKIP.** Classification rigor is sufficient. Side finding: Layer 2 must use `review-adversarial-general.xml` (task #44).
- #17 Blame the spec — **ACCEPT.** Added classifier framing to Phase B (spec-class as win, not blame).
- #18 Over-classifies as spec-class — **SKIP.** Evidence requirement sufficient.
- #19 Sidecar config drift — **DEFER.** Valid kernel, out of scope.
- #20 Two checkpoints regression — **REJECT.** Settled decision #2.
- #21 One-shot review collapse — **PARTIAL ACCEPT.** One-shot Layer 2 now receives user prompt alongside diff.
- #22 Pause/resume protocol — **SKIP.** Crash recovery IS pause/resume.
- #23 Edge cases (no git, etc.) — **SKIP.** Git is a prerequisite, not optional.
- #24 Mandatory mitigations — **SKIP.** Plan already contains all prompt-level mitigations.

**Resolved (session 3 — Grok party-mode cross-pollination):**
- #28 Positive Preservation — **ACCEPT.** When the spec loop discards code, extract "what worked well" as KEEP instructions carried forward. Added to Phase C loop mechanics and change log format.
- #29 Golden Examples — **ACCEPT.** Optional concrete input/output examples in spec template to anchor behavior. Frozen after checkpoint 1. Added to template.
- #30 INTENT_GAP two-question test — **ACCEPT.** Formalized intent-class detection: (1) Can this be resolved from existing info? (2) Does it require a user-specific decision? If #2 = yes → INTENT_GAP. Added to Phase B first pass.
- #31 Fresh Context Reset per spec-loop iteration — **OUT OF SCOPE.** Kept in mind for future work.
- #32 CHANGE SCOPE / FORBIDDEN spec sections — **OUT OF SCOPE.** Kept in mind for future work.

**Implementation tasks (all completed):**
- #25 Apply all accepted findings to the plan file — **DONE**
- #26 Update plan: integration branch from project context, not hardcoded "main" — **DONE**
- #27 Update plan: default to spec route when ambiguous — **DONE**
- #44 Update plan: Layer 2 must use `src/core/tasks/review-adversarial-general.xml` — **DONE**
- #45 Update plan: Positive Preservation in Phase C + change log format — **DONE**
- #46 Update plan: Golden Examples section in spec template (frozen after CP1) — **DONE**
- #47 Update plan: INTENT_GAP two-question test in Phase B first pass — **DONE**

## Key Reasoning to Preserve

**Why plan is source code:** The spec is like source code, the agent is the compiler. If the compiler misunderstood your source, you write clearer source — even if it's arguably a compiler bug. You work around it because you control the spec, not the agent. Spec-class findings accumulate knowledge about what the "compiler" needs to not drift.

**Why information asymmetry in review:** The best findings come from a reviewer that doesn't know the "why." If you know the same session concluded 2+2=5, you'll jump to the same conclusion. But if an outside finding says 2+2=4, you're well equipped to decide whether that matters. The agent that wrote the code must NOT review it (anchoring bias) but IS the right agent to classify external findings.

**Why not prescribe intent capture:** Any list of "how to ask questions" competes with training and introduces gaps. Exit criteria define "done," not the path. The moment you write "first ask about X, then probe for Y" you're creating exactly the ambiguities you're trying to avoid.

**Why no platform capability detection:** LLMs hallucinate about their own tooling to please you. The only reliable check is "are you Claude Code?" — and even that belongs in the CC-native variant, not the generic flow. The only capability the generic flow probes for is subagent support.

**Why sequential task execution:** Race conditions on shared code are too risky. In this incarnation, parallel execution is a hard taboo. Future versions may relax this.

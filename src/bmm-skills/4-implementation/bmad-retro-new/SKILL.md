---
name: bmad-retro-new
description: 'Close out a completed epic: analyze the evidence, verify behavior, review the change at whole-epic and per-diff scope, apply code and spec deltas, propose process changes, render an acceptance verdict. Use when the user says "run the epic retro" or "retro the epic [epic]"'
---

## Write Authority

- **Repo commits** — fixes, tests, gates, consistency cleanups, expected-fail tests. Allowed directly.
- **Spec layer edits** — spec reconciliation, plan updates, deferred work, accepted deviations. Evidence-backed edits allowed directly. If uncertain, ask the human; if running headless, hold the edit as a pending proposal — never apply a default to the project contract.
- **Skill and workflow changes** — pull requests only. Human review always; never self-merge.
- **No other write targets exist.** No memory files, no context files, no lesson stores.

## State and Resumption

- The skill operates on one retro file per epic, in the spec layer. Frontmatter: epic id, spec reference, diff range, status (last completed phase), open questions. Body: each phase's products, accumulating into the closeout record.
- A run may stop at any phase boundary. Invocation is: given this file and its status, do the next valid thing.
- Every run starts by reconciling the file against reality — commits may have landed, questions may have been answered, the spec may have changed. Reality wins over the file.
- Analyses may be recomputed and routing revised on new evidence; writes are reconciled before reapplying — never duplicate remediation stories, spec edits, or deferred items.

## Phase 1: Prepare

1. **Collect Evidence** — Enumerate what actually exists: spec, story files, diff, session logs, git history. Inventory capabilities too: sub-agent availability shapes later steps. Each later step declares what it needs and degrades when something is missing.

2. **Load Audit Plan / Profile Epic** — Read the acceptance criteria declared in the epic spec; if absent, profile the epic from its diff and stories to select which analyses to run.

## Phase 2: Analyze

3. **Build Aggregate Views** — Derive whole-epic views that no single diff hunk shows: architecture delta, duplication map, pattern divergence, size trajectories, spec-to-implementation reconciliation. Prefer deterministic scripts; sub-agents return evidence with source refs, never findings. No sub-agents: compute inline and record the narrowed scope.

4. **Run Review Passes** — Independent sub-agent reviews at diff scope, with asymmetric lenses chosen by the audit plan: correctness at boundaries between stories, verification gaps, intent conformance. Outputs are hypotheses with source refs and checked scope. No sub-agents: emit prompt files for the human to run in separate sessions, or record the skip — never run "independent" reviews inline.

5. **Verify Behavior** — Exercise the changed behavior end-to-end as the audit plan directs: run the system, drive the affected flows, record what was observed. Passing tests do not substitute for this step.

6. **Consolidate Findings** — Merge, dedupe, and provenance-link all findings; check whether any finding was caused by a previous epic-retro run's own output.

## Phase 3: Decide

7. **Route Findings** — Assign each finding a disposition (fix now / defer / accept as-is) and a lesson destination by lifetime: repo is permanent, spec files last the project, skill changes go via PR. Sub-agent findings are testimony, not truth: before actuation, reground per write authority — reopen primary sources for spec and skill targets; repo fixes are rechecked by the remediation session itself.

8. **Emit Questions** — For each delta a human answer would materially change: a pointed question, a machine default, links to evidence. Also ask one open question for observations the analyses missed.

9. **Fold In Answers** — Apply any answers as high-weight evidence. For unanswered questions: repo-bound deltas may proceed on the machine default (recorded as an unreviewed assumption); spec-layer writes stay held as pending proposals.

## Phase 4: Remediate

10. **Cut Remediation Stories** — Compile fix-now findings into stories with full context, each sized for one coding session.

11. **Run Remediation Loop** — Execute remediation stories through the same dev loop that built the epic. One round only.

12. **Re-check** — Re-run the fast checks and re-drive the affected flows on the remediation output; no full re-analysis, no second round.

## Phase 5: Close

13. **Commit Solution Deltas** — Commit the permanent, executable outputs: fixes, tests, CI/lint/architecture gates, consistency cleanups, expected-fail tests for known gaps. Record rationale and rejected alternatives in commit messages.

14. **Edit Spec Layer** — Update the project-level spec and companion files where evidence clearly supports it: reconcile the spec to as-built, re-plan remaining epics, record accepted deviations so later runs do not re-flag them. Uncertain edits ship as pending proposals, not applied text.

15. **Open Skill PRs** — Propose skill and workflow changes as pull requests with the motivating finding attached. Never self-merge; human review is required.

16. **Reconcile Deferred Work** — Re-triage the deferred-work file: add new items with enough context to be picked up cold, promote or prune stale ones. Items no active plan claims are dropped.

17. **Render Verdict** — Judge the final state against the declared acceptance criteria, using verification results and unresolved findings: accepted, accepted with open items, or rejected. A human decision always overrides; the machine may default to accept only when the criteria are demonstrably met in evidence.

18. **Close Epic** — Record the verdict and the trail: what ran, what was skipped, what remains open. An epic that fails its criteria without a human decision closes as not accepted — never as silently accepted.

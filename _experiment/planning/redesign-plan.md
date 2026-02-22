# Quick-Flow Redesign — Implementation Plan

## Platform Strategy

Two variants of the same flow, same design principles:

- **Quick-flow (generic)** — this document. Platform-agnostic. File-based task sharding. The only capability question it may ask the platform is "can you use subagents?" (and even that took half a day to word correctly across platforms). Everything else is file-based.
- **Quick-flow CC (future work)** — Claude Code-native. Uses TaskCreate/TaskGet for verbatim task prompt injection, proper context-isolated subagent spawning, and other platform-specific tooling. Same phases, same classification logic, native implementation.

## Deliverable

Replace `src/bmm/workflows/bmad-quick-flow/quick-spec/` and `src/bmm/workflows/bmad-quick-flow/quick-dev/` with a single unified `src/bmm/workflows/bmad-quick-flow/` workflow. Update the agent definition and Claude Code skill entry points accordingly. This spec covers the generic variant.

## File Plan

### Delete

- `src/bmm/workflows/bmad-quick-flow/quick-spec/` (entire directory)
- `src/bmm/workflows/bmad-quick-flow/quick-dev/` (entire directory)

### Create

```
src/bmm/workflows/bmad-quick-flow/
  workflow.md                     # Entry point — routing + orchestration
  tech-spec-template.md           # Lighter-weight spec template (revised)
  steps/
    step-01-clarify-and-route.md  # Intent clarification + scope routing
    step-02-plan.md               # Investigation + spec generation (CHECKPOINT 1)
    step-03-implement.md          # Code derivation + auto version control
    step-04-review.md             # Adversarial review + classification + optional spec loop
    step-05-present.md            # Final findings to human (CHECKPOINT 2) + PR creation
```

### Modify

- `src/bmm/agents/quick-flow-solo-dev.agent.yaml` — replace QS/QD menu triggers with single QF trigger
- Claude Code skill entry points (if separate from agent definition)

## Flow Architecture

### Human Checkpoints

Exactly two for the plan-code-review route:

1. **End of Plan (step-02)** — "Here's the spec. Approve, edit, or redirect to full BMM."
2. **End of Review (step-05)** — "Here are the classified findings. Approve the final state."

Everything between checkpoint 1 and checkpoint 2 is autonomous. No [A][P][C] gates. Advanced Elicitation and Party Mode remain invocable by the human at any time (as interrupts, not as gates in the critical path) but the flow never stops to offer them.

### Step 1 — Clarify and Route

Combines the old quick-dev mode-detection with quick-spec's understand phase. Single step because the routing decision depends on understanding the intent.

**On launch:**
- Load config, project-context.md (if exists), CLAUDE.md / memory (if exists)
- Check for existing WIP file → offer resume or archive
- Check for `ready-for-dev` tech spec → skip directly to step 3 (this was a bug in the old flow)

**Clarify intent:**
- The skill argument, if present, is the primary expression of intent. Treat it as the human's opening statement of what they want — not background context, not a hint, the intent itself.
- Intent may also come from other sources — resolvable references, prior conversation, existing WIP or ready-for-dev specs, or any other means. Do NOT assume you start from zero. Evaluate what's already known against the exit criteria below. If intent is already clear, don't ask.
- Do NOT prescribe how to capture intent — the LLM knows how to ask clarifying questions, probe for ambiguity, and synthesize messy descriptions into clear ones. That's training. Telling it how to do what it already knows creates ambiguities and contradictions of its own.
- Define **exit criteria for captured intent** — the agent's job is to reach this state, however it gets there:
  - Problem statement is unambiguous
  - Scope has clear boundaries
  - No contradictions with loaded project context
  - All blocking decisions are resolved (non-blocking ones can be deferred)
  - The agent can explain back to the human what it's about to do
- Investigate the codebase autonomously to understand scope (use subagents, don't ask the human to explain what's in their own codebase)
- Ask the human about intent and constraints, not implementation details — and only if the exit criteria aren't already met

**Backfill project context:**
- If version control conventions are unknown (no project-context.md or no VC section in it), ask once and write to:
  - `project-context.md` if it exists (append a Version Control section)
  - `_bmad-output/project-context-quickflow.md` sidecar if it doesn't
- Same for any other project convention the flow needs to operate autonomously

**Route:**
- **Full BMM** — scope too large or too ambiguous. Recommend and exit. Don't just warn, actually redirect.
- **One-shot** — trivial change (< ~3 files, clear intent, no architectural decisions). Skip to step 3 with an in-session mental plan, no spec file. Still does auto VC and review, but review is collapsed: skip Layer 1 (intent audit — overkill for trivial changes, self-check covers it), keep Layer 2 (adversarial code review — **non-negotiable**, a one-line change can cause severe unintended consequences five modules away; receives the original user prompt alongside the diff to close the intent verification gap). Skip merge/dedup (single findings source). Classify directly against user prompt.
- **Plan-code-review** — the main path. Proceed to step 2.
- **When ambiguous between one-shot and plan-code-review, default to plan-code-review.** Writing a spec for something trivial is less costly than one-shotting something complex.

### Step 2 — Plan

Merges the old quick-spec steps 2-4 into a single autonomous phase. The agent does not stop between investigation, generation, and self-review.

**Actions (autonomous, no checkpoints):**
1. Deep investigation — read relevant code, identify patterns, understand constraints. Use subagents.
2. Generate spec — tasks (file + action + rationale), acceptance criteria (Given/When/Then), technical decisions.
3. Self-review — verify completeness against "Ready for Development" standard: actionable, logical, testable, complete, self-contained.
4. Write spec to `{implementation_artifacts}/tech-spec-wip.md`.

**CHECKPOINT 1 — Present spec to human.**
- Show summary: task count, AC count, files affected, key decisions.
- Options: approve / edit / redirect to full BMM.
- On approve: rename to `tech-spec-{slug}.md`, set status `ready-for-dev`, proceed to step 3. **From this point forward, the spec's Problem, Solution, Scope, and Non-Goals sections are frozen** — the autonomous loop can only amend Tasks, Acceptance Criteria, and Technical Decisions. See step 4 Phase C for the frozen-section rule and escalation protocol.

### Step 3 — Implement

Merges old quick-dev steps 2-4 (context gathering, execute, self-check).

**Actions (autonomous):**
1. Capture baseline commit. For a fresh branch: `git rev-parse HEAD`. For a resumed WIP branch: `git merge-base HEAD <integration-branch>` to find the divergence point, where `<integration-branch>` is read from project-context.md (or sidecar), defaulting to `main` if unspecified. The baseline must produce a valid diff of all work on this branch, not just the current session.
2. Create feature branch and worktree automatically. Branch name: user-specified (if provided in intent) > spec slug default. User-specified branch takes priority — supports incremental changes to existing feature branches. **Idempotent:** if branch/worktree already exist (e.g., resuming a WIP or working on an existing feature branch), detect and reuse them instead of failing on duplicate creation.
3. **Assert clean working tree.** Before any task executes, verify no uncommitted changes or untracked files in the worktree. If the tree is dirty and this is a fresh start, surface to human and halt — something is wrong. If the tree is dirty and this is a resume, apply the resume policy (see below). This is a step-level precondition, not a per-task check.
4. Load spec tasks using the **BMAD sharded workflow pattern** — the same mechanism used for the flow's own steps, applied to task execution. Study and faithfully reproduce the existing BMAD sharded step-file architecture:
   - Each task is written to its own file (`_bmad-output/tasks/task-01.md`, etc.)
   - A sequence file tracks execution order, status per task, and current position
   - **The sequence file must be robust against partial execution failures or crashes.** Status is written to disk after each task completes, before the next begins. On resume, the sequence file is the source of truth — completed tasks are skipped, execution picks up at the first incomplete task. No in-memory-only state.
   - Read each task file fresh before execution so the full prompt lands at the end of the context window (high-attention zone). This is the generic flow's primary defense against lost-in-the-middle syndrome.
   - **Note:** A Claude Code-native variant (future work) will use TaskCreate/TaskGet/TaskUpdate for verbatim task prompt injection via platform tooling. The generic flow does not attempt to detect or use platform-specific task tracking — capability self-reporting is unreliable.
5. Execute tasks strictly sequentially: load next task from task list (or read next file in fallback mode) so the full task prompt is at the end of the context window (high-attention zone) → implement → verify AC → mark complete → load next. **No parallel execution — race conditions on shared code are a hard taboo.**
6. Self-check: all tasks done, ACs met, patterns followed.
7. Commit automatically with a conventional commit message.
8. Update spec with completion status.

**Resume policy (dirty working tree on re-entry to step 3):**
Because the clean-tree precondition guarantees the worktree was clean before implementation started, any uncommitted changes on resume are unambiguously from the crashed/interrupted task — identified by the sequence file's current position. The agent inspects the diff against that incomplete task: if the partial work is coherent and clearly progressing toward the task's goal, continue from where it left off; if the state is unclear or inconsistent, revert the uncommitted changes and re-execute the task from scratch. There are no per-task commits — the single commit at the end of step 3 (action 7) remains the only commit point.

**Halt conditions (require human):**
- 3 consecutive failures on same task
- Blocking ambiguity the spec doesn't resolve
- Test infrastructure missing or broken — **only if the spec relies on existing tests to verify ACs.** Does not apply when the task itself is to build or fix test infrastructure.

**Version control in step 3 — local only:**
- Branch naming: derived from spec slug (e.g., `feat/{slug}`)
- Worktree: created at start, used for all changes
- Commits: automatic, conventional format
- **No push, no PR, no push prompts.** All remote operations live strictly in step 5 after review patches are applied.

### Step 4 — Review and Classify

Merges old quick-dev steps 5-6 with a new classification system.

**Phase A — Multi-Layer Review:**

Two default review layers, both in isolated subagents with no conversation context or implementation reasoning. Extensible via sidecar config.

**Layer 1 — Intent/Rules Audit:**
- Receives: the spec (or original user prompt for one-shot), the code artifact, and any project rules/guidelines (CLAUDE.md, project-context.md, etc.)
- Does NOT receive: conversation context, implementation reasoning, or the "how we got here" narrative
- Checks: does the output match the intent? Were project rules and guidelines followed?
- This is the functional correctness check. It catches "perfectly clean code that does the wrong thing" — the gap that self-check covers poorly due to anchoring bias.

**Layer 2 — Adversarial Code Review:**
- Invokes `src/core/tasks/review-adversarial-general.xml` — the existing BMAD standard building block for adversarial review — with the diff as the content input. Context isolation is about what the subagent receives, not the review procedure itself.
- Receives: the diff and access to source code. **One-shot exception:** also receives the original user prompt, closing the intent verification gap without adding Layer 1. The information-asymmetry design (no spec, no conversation context) still holds for the plan-code-review route; one-shot needs the user prompt because there is no other intent artifact.
- Does NOT receive (plan-code-review route): the spec, intent, rules, or conversation context
- Free-form reasoning about code quality — patterns, edge cases, error handling, style
- Information-asymmetric by design. Its value comes from having zero expectations.

**Additional layers (optional, user-configured via sidecar):**
- Security review, accessibility audit, rules-specific deep check, etc.
- The default two layers are the lowest common denominator — works well for small projects, better than nothing for real work. Real projects should invest in customizing and adding layers.

Both layers produce raw findings lists. Before classification in Phase B, findings are merged using the existing BMAD pattern (from quick-dev/code-review flow): deduplicate, reorder by severity, then classify. Same mechanism, not a new invention.

**Phase B — Evidence-Based Classification:**
- The orchestrating agent (which knows the spec and intent) classifies each finding.
- **Classifier framing:** The classifier does not own the code — the code is a build artifact derived from the spec. The classifier owns the *spec*. A spec-class finding is the most valuable outcome: it means the spec gets stronger and future derivations improve. Frame spec-class discovery as a win, not a failure. This framing reduces anchoring bias by decoupling the classifier's evaluation from self-critique of its own implementation.
- Classification uses a **priority cascade: intent-class > spec-class > patch-class.** If a review round produces findings at multiple levels, resolve from the top down. Intent-class findings go to the human first. After intent is resolved, re-evaluate spec-class findings against the new or confirmed intent — some may be moot. Then amend the spec incorporating still-valid spec findings. This extends the two-pass principle with one more level.
  - **First pass:** scan all findings for intent-class issues using the **INTENT_GAP two-question test.** For each finding, the classifier asks: (1) Can this issue be resolved using only the information already present in the original user request + current spec? (2) Does fixing it require a user-specific decision or preference that cannot reasonably be guessed? If #2 = yes → **intent-class (INTENT_GAP).** Generate one clear, targeted question and escalate to the human at the next checkpoint. A finding is also intent-class if its root cause traces to a frozen section of the spec (Problem, Solution, Scope, or Non-Goals — see Phase C for the frozen-section rule). Both paths require human resolution before anything else proceeds.
  - **Second pass:** scan remaining findings for spec-class issues. For each finding, ask: "Does the root cause trace to the mutable spec surface?" Collect all that do.
  - **If any spec-class findings exist and under iteration limit:** fix them all in the spec, re-derive code, re-review. Do NOT classify remaining findings into patch/defer/reject — they are moot and will be re-evaluated against fresh code.
  - **If no spec-class findings (or iteration limit reached):** proceed to full classification of all findings into patch/defer/reject.
- For each finding, the classifier asks: "Is this a real problem, and if so, what is the root cause?"
  - **Root cause traces to frozen intent** (the Problem, Solution, Scope, or Non-Goals are wrong, contradictory, or incomplete) → **intent class.** Only the human can resolve this. Escalate with a recommended resolution — not a raw finding dump. See Phase C.
  - **Root cause traces to the mutable spec surface** (Tasks, Acceptance Criteria, or Technical Decisions are wrong, vague, or insufficiently precise to prevent agent drift) → **spec class.** If the agent drifted from the spec, the spec was not precise enough — that is a spec defect, not an implementation defect. Point to the specific spec section that failed.
  - **Code quality issue unrelated to the spec** (the spec had nothing to say about this and shouldn't have — e.g., a missed edge case in error handling, a style issue, a performance concern) → **patch class.** Fix the code in place.
  - **Not worth blocking on → defer class.** Append to `_bmad-output/wip.md` with context. If it suggests a guiding principle needs updating, note that too.
  - **Not a real finding → reject class.**

**Phase C — Spec Loop (optional, autonomous, rigidly bounded):**

The spec loop is the highest-risk point in the entire flow for infinite token burn, oscillation, and divergence from original human intent. Three mechanisms work together to bound it: frozen intent sections, a spec change log, and a hard iteration cap.

**Frozen intent sections:** After checkpoint 1, the spec's Problem, Solution, Scope, and Non-Goals sections are frozen — read-only for the autonomous loop. The mutable surface for autonomous spec amendments is limited to Tasks, Acceptance Criteria, and Technical Decisions. This partitions the spec into human-owned intent (stable anchor) and agent-owned derivation (amendable). If a finding's root cause traces to a frozen section, it is intent-class: escalate to the human with a recommended resolution (not just a raw finding dump). The human confirms, edits, or rejects the recommendation. Only the human can authorize changes to frozen sections. The loop continues after intent-class findings are resolved.

**Spec change log (guardrails ratchet):** Each spec amendment appends to a change log embedded in the spec: what changed, what finding triggered the change, and what known-bad state the change avoids. Subsequent iterations must read the log before amending. A previous fix cannot be undone without contradicting a logged constraint — the log is append-only and acts as a monotonically increasing set of constraints. This prevents 2-period attractor cycles where the agent oscillates between two states, each "fixing" the other.

**Positive Preservation:** Before discarding code from a failed iteration, the agent extracts "what worked well" — specific implementations, patterns, or solutions that were correct and effective — and records them as explicit KEEP instructions in the change log alongside the amendment. These KEEP instructions are carried forward into the next iteration's context as positive constraints: the re-derived code must preserve these behaviors. This prevents the loop from losing emergent cleverness when it fixes a spec defect — the good parts survive the rewrite.

**Loop mechanics:**
- If there are spec-class findings with high confidence:
  - Read the change log (if any previous iterations exist)
  - **Extract Positive Preservation:** identify what worked well in the current code before discarding it. Record as KEEP instructions.
  - Amend the mutable spec surface to resolve the findings, respecting all logged constraints (including KEEP instructions from previous iterations)
  - Append each amendment to the change log with its triggering finding, the state it avoids, and any KEEP instructions extracted
  - Re-derive the affected code (respecting KEEP instructions)
  - Re-run adversarial review on the new diff
  - Re-classify using the full priority cascade (intent > spec > patch)
  - Repeat until no more spec-class findings
- If an iteration produces intent-class findings, pause the loop and escalate to the human. Resume after the human resolves intent.
- If confidence is not high enough to loop autonomously, include spec-class findings in the presentation to the human.
- **Hard iteration cap: default 5, overridable in quickflow sidecar config.** When the cap is hit, stop unconditionally and present everything to the human. No exceptions.

**Phase D — Apply patches:**
- Auto-fix all patch-class findings.
- Commit the fixes.

### Step 5 — Present to Human

**CHECKPOINT 2 — Show classified findings list.**

The flow auto-handles everything it's confident about before reaching this point. The human's primary job here is the **low-confidence bucket** — findings where the classifier was not confident enough to assign a class (weak/no evidence from spec, ambiguous rule match, borderline real issue). Usually 1-3 items max. The human classifies each in seconds: spec (update spec + regen) / patch (auto-fix) / defer (to wip.md) / reject.

Present:
- **Intent-class findings (requiring human decision on frozen sections)** — highest priority, if any were escalated during the spec loop
- **Low-confidence findings (requiring human classification)** — the primary action item for routine runs
- Spec-class findings (if any remain unresolved or were looped) — for awareness
- Patch-class findings (already fixed) — for awareness
- Defer-class findings (parked in wip.md) — for awareness
- Reject-class findings (shown briefly) — for transparency
- Overall summary: what changed, what was reviewed, what was parked, spec change log (if any iterations occurred)

**Human options:**
- Approve → create PR automatically, print push command
- Adjust → modify specific findings or request changes
- Reject → explain what's wrong, loop back to relevant phase

**After approval:**
- Commit any remaining review patches (if not already committed in Phase D).
- **Push: strictly prohibited by default.** Print the command, wait for human confirmation. Overridable in quickflow sidecar config (`auto_push: true`), but if not explicitly overridden, this is a hard ban — no exceptions, no "just this once."
- Wait for human to confirm push is done (or auto-push if overridden).
- Create PR via `gh pr create` with summary derived from spec + findings.
- Flow complete.

## Tech-Spec Template (Revised)

Lighter than the current template. Drops the verbose frontmatter in favor of essentials.

```markdown
---
title:
slug:
created:
status: in-progress | ready-for-dev | implementing | complete
---

# {title}

## Problem
One paragraph.

## Solution
One paragraph.

## Scope
What's in, what's out.

## Non-Goals
What this spec explicitly does not address. Optional but recommended — frozen after checkpoint 1 alongside Problem, Solution, and Scope.

## Tasks
- [ ] Task 1: {file} — {action} — {rationale}
- [ ] Task 2: ...

## Acceptance Criteria
- [ ] AC 1: Given {X}, when {Y}, then {Z}
- [ ] AC 2: ...

## Technical Decisions
Only if non-obvious. Brief.

## Golden Examples
Optional. Concrete input/output pairs that anchor expected behavior. When the spec describes a transformation, algorithm, or interface, examples make the intent unambiguous where prose alone leaves room for interpretation. Frozen after checkpoint 1 (same as Problem/Solution/Scope).

## Spec Change Log
Appended by the review loop. Each entry: what changed, what finding triggered it, what known-bad state it avoids, and any KEEP instructions (positive preservation — what worked well and must survive the rewrite). Empty until step 4.

## Notes
Anything else. Optional.
```

## Parking Lot File

`_bmad-output/wip.md` — created on first defer-class finding, appended thereafter.

```markdown
# Parking Lot

## {date} — {spec-title}

- **Finding:** {description}
  **Context:** {why it was deferred}
  **Guiding principle note:** {if applicable — which principle might need updating}
```

## Version Control Context

On first run without VC conventions, the flow asks:
- Branch naming convention? (e.g., `feat/`, `fix/`, free-form)
- Commit message convention? (conventional commits, free-form, etc.)
- PR target? (branch name, fork vs same-repo)
- Worktree usage? (if applicable to the environment)

Writes answers to project-context.md (or sidecar). Never asks again.

## Open Questions

1. ~~**Spec loop bound**~~ — Resolved. Hard cap of 5 iterations, overridable in quickflow sidecar. Default to stop and present.
2. ~~**One-shot route review**~~ — Resolved. One-shot still gets the full review pipeline. Phase A (adversarial code review) works as-is. Phase B (classification) validates against the initial user prompt instead of a spec file — same evidence-based approach, lighter reference artifact.
3. ~~**Task list integration**~~ — Resolved. Generic flow uses file-based task sharding (read each task file fresh before execution). Claude Code-native variant (future work) will use TaskCreate/TaskGet for verbatim injection. Platform capability self-reporting is unreliable — the generic flow doesn't try to detect it. The only capability it may probe for is subagent support.
   - Execution is strictly sequential — load next task, execute, mark complete, load next
   - Full task prompt must be at the end of the context window (high-attention zone) when execution begins
   - **No parallel execution.** Race conditions on shared code are too risky. Sequential only in this incarnation.

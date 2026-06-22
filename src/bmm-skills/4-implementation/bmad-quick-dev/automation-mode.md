# Automation Mode

You are running unattended inside a `bmad-auto` orchestrator session. No human
is watching this conversation; a deterministic program spawned you, will verify
your artifacts on disk, and will kill this session after your final turn.
These rules override conversational behavior everywhere in this workflow.

## Identity & I/O contract

- `$BMAD_AUTO_RUN_DIR` and `$BMAD_AUTO_TASK_ID` are set in your environment.
- Your **result file** is `$BMAD_AUTO_RUN_DIR/tasks/$BMAD_AUTO_TASK_ID/result.json`.
  Writing it is the LAST action of a successful run (step-auto-finalize does this).
- Your **escalation file** is `$BMAD_AUTO_RUN_DIR/tasks/$BMAD_AUTO_TASK_ID/escalation.json`.
  Write it when you hit a blocker no rule below resolves, then write the result
  file with the escalation included and END YOUR TURN. Schema:

  ```json
  {
    "escalations": [
      {
        "type": "<short-kebab-kind>",
        "severity": "CRITICAL|PREFERENCE",
        "detail": "<one or two sentences>"
      }
    ]
  }
  ```

  - `CRITICAL` = work cannot proceed safely (missing config, broken repo state,
    contradictory frozen intent). The orchestrator pauses the whole run for a human.
  - `PREFERENCE` = you made a judgment call a human might want to revisit.
    The orchestrator logs it and continues — prefer this when work CAN proceed.

## Behavior rules

1. **Never HALT for input. Never ask the user anything.** Every HALT/ask/menu
   point in the step files resolves via the decision table below. There is no
   user — an unanswered question stalls the run until a timeout kills you.
2. **No greeting, no conversational framing.** Skip the activation greeting.
   Keep narration to one line per step; spend tokens on the work.
3. **The invocation argument IS the intent.** The skill was invoked with a
   sprint-status story key (e.g. `3-2-digest-delivery`). Set `{story_key}` to it
   verbatim, derive `{epic_num}`/`{story_num}` from its leading numeric segments,
   and treat the intent as: implement that story from the epic. Skip the rest of
   the intent-check cascade. Follow step-01's **Epic story path** (epic context
   cache, previous-story continuity) as written.
   - **Feedback mode**: if the invocation also carries `--feedback <path>`, this
     is a repair session — a previous session's work failed the orchestrator's
     deterministic verification. Read the feedback file FIRST; it contains the
     failing command and its output. The working tree still holds the previous
     attempt's changes and the spec for `{story_key}` already exists: do not
     regenerate it and do not change its status if it is already `done`. Your
     entire goal is to make the described verification pass without violating
     the spec's `<frozen-after-approval>` intent. Skip step-01/step-02; work
     directly, then read fully and follow `./step-auto-finalize.md` (skip its
     status/sprint updates when the spec status is already `done` — repair only,
     then write result.json and end your turn). If the tree was reset and the
     spec is gone, follow the normal path with the feedback as added context.
   - **Bundle mode**: if the invocation is `--dw-bundle <path>` instead of a
     story key, this is a deferred-work sweep bundle. Read the bundle file
     FIRST: it carries `bundle_name`, the `dw_ids`, the intent, any human
     decision, and the verbatim ledger entries. Set `{story_key}` =
     `dw-<bundle_name>`; there is no epic and no sprint-status entry — skip
     the epic-context cache and previous-story continuity. The spec file is
     `{implementation_artifacts}/spec-dw-<bundle_name>.md`. Implement ALL
     listed dw_ids as the one cohesive goal the intent describes — never
     split in bundle mode; if an item cannot be done safely, escalate
     `CRITICAL` (`type: bundle-item-blocked`). Bundle mode composes with
     feedback mode (`--dw-bundle <path> --feedback <path>` is a repair
     session for the bundle).
4. **Review depends on `$BMAD_AUTO_SKIP_REVIEW`.** Never one-shot.
   - **Unset (default):** review runs as a separate orchestrated session with
     fresh context — you do not run it.
   - **Set (= `1`):** the orchestrator runs **no** separate review session. YOU
     run step-04-review's internal triple-review unattended (sub-agents are
     pre-authorized; resolve its HALTs via the decision table below), then
     finalize.
5. **Step routing after step-03-implement** (step-03's NEXT handles this):
   - `$BMAD_AUTO_SKIP_REVIEW` set → run `./step-04-review.md` (internal
     triple-review), then `./step-auto-finalize.md` (which sets status `done`).
   - `$BMAD_AUTO_SKIP_REVIEW` unset → skip step-04-review and go straight to
     `./step-auto-finalize.md` (status `in-review`; orchestrator reviews).
   - **Never run step-05-present** in either case — the orchestrator commits.
6. **Never open an editor, never commit, never push, never offer follow-ups.**
   Skip any `## On Complete` step / `workflow.on_complete` customization — result.json
   (step-auto-finalize) is the LAST action of the run; the orchestrator owns commit,
   review, and everything after it.

## Scope override

The base SKILL.md SCOPE STANDARD, step-02 instruction 6, and `spec-template.md`
state a **900–1600** token spec target (interactive default). In automation mode
that target is **1,500–4,000 tokens**: wherever a base file names `900`, `1300`,
or `1600`, read the floor as `1,500` and the ceiling as `4,000`. Rationale:
modern 200k–1M-token-context models tolerate much larger specs, so the ceiling
guards spec discipline (one goal, sharp ACs), not context overflow — a bloated
spec dilutes the acceptance criteria a reviewer must audit against. Neither bound
is a gate, but `[K] keep` is unavailable in automation: on a true multi-goal
overflow choose `[S] Split` per the decision table.

## Decision table (replaces HALTs)

| Step file HALT                                         | Automation decision                                                                                                                                                                  |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| step-01 active-specs menu                              | If a spec for `{story_key}` already exists: status `draft` → resume into step-02; `ready-for-dev`/`in-progress` → resume into step-03. Ignore unrelated specs.                       |
| step-01 prior `in-review` spec "ask whether to load"   | Load it.                                                                                                                                                                             |
| step-01 dirty tree / branch mismatch                   | Escalate `CRITICAL` (`type: dirty-worktree`) — the orchestrator guarantees a clean tree, so this signals external interference.                                                      |
| step-01 multi-goal check                               | Choose **[S] Split**: implement the first goal, append the rest to the deferred-work file per `./deferred-work-format.md`.                                                           |
| step-01/02 unclear intent after investigation          | Escalate `CRITICAL` (`type: intent-gap`). Do not fantasize requirements.                                                                                                             |
| step-02 token budget exceeded                          | Choose **[S] Split** (defer secondary scope per `./deferred-work-format.md`).                                                                                                        |
| step-02 CHECKPOINT 1                                   | Perform the self-review against the READY FOR DEVELOPMENT standard, fix what it surfaces, then auto-approve: set status `ready-for-dev`, lock the frozen block, continue to step-03. |
| step-03 missing/empty spec precondition                | Escalate `CRITICAL` (`type: missing-spec`).                                                                                                                                          |
| step-04 no sub-agents → "generate prompt files & HALT" | Only reachable when `$BMAD_AUTO_SKIP_REVIEW` is set. Sub-agents are pre-authorized — run the three reviewers inline; never generate prompt files or HALT.                            |
| step-04 `intent_gap` finding (loop back to human)      | Revert the code changes, then escalate `CRITICAL` (`type: intent-gap`). Do not infer intent.                                                                                         |
| step-04 `bad_spec` finding                             | Resolve automatically per the step: amend the non-frozen spec sections, log the change, and re-derive via step-03. No human, no escalation.                                          |
| step-04 `specLoopIteration` > 5                        | Escalate `CRITICAL` (`type: review-loop-exceeded`).                                                                                                                                  |
| Any other HALT or menu                                 | Take the most conservative option that keeps work moving; if none is safe, escalate `CRITICAL`.                                                                                      |

## Sub-agent note

Sub-agent usage is pre-authorized for the whole run — never ask. When sub-agents
are unavailable, do the work inline; never generate prompt files for a human to run.

# Headless Mode

Load this file when bmad-architecture is invoked headless (no interactive user). Follow it for the whole run. Headless always runs the **Autonomous** working mode — infer everything, ask nothing, tag inferred calls and record gaps as open questions.

## Detection

Headless is in effect when any of the following holds:

- the caller sets a `headless: true` flag (or the harness equivalent),
- the invocation is from another skill or a non-interactive runner (no TTY, no user message stream),
- `{workflow.activation_steps_prepend}` declares headless,
- the first message pre-supplies all inputs and asks for an artifact path back.

When ambiguous, default to interactive.

## Inputs the caller is expected to provide

Free-form structured payload in the first message; every field below when applicable:

- `intent` — `"create"`, `"update"`, or `"validate"`. If absent, infer from the artifact set.
- `altitude` — `"initiative"`, `"feature"`, or `"epic"` (the spine mirrors the altitude of the spec/intent it augments and keeps the level below coherent). If absent, infer (a unit's capability subset + a parent spine ⇒ the child altitude; a top-level initiative spec or raw intent ⇒ initiative).
- `purpose` — `"build-substrate"` (default) or `"discussion"` (a doc to align people / surface open challenges). If absent, default to build-substrate and record it.
- For **Create**: the driving input. Canonical is a bmad-spec package (`SPEC.md` + companions + its memlog); if a folder is given, prefer any `.memlog.md` found, then `SPEC.md`, then raw docs. Also accepts a PRD, raw intent text, or a brownfield repo path, plus any stack/scope constraints; the parent spine path when at a lower altitude; `doc_workspace` if a specific run folder is required (else the default binds).
- For **Update**: the existing `ARCHITECTURE-SPINE.md` path (or a workspace containing one), and a change signal.
- For **Validate**: the existing `ARCHITECTURE-SPINE.md` path (or workspace). Workspace defaults to the spine's containing directory.

Anything not provided is inferred from inputs/workspace or recorded as `assumptions[]` / `open_questions[]`. Do not invent stack choices, constraints, or scope to fill gaps — record them.

## General

Do not ask, do not greet. Complete the intent from what is provided, what exists in `{doc_workspace}`, or what you can discover yourself (version verification, a brownfield convention sweep). Still drive every write through `scripts/memlog.py` — the memlog is the audit trail. If intent remains ambiguous after inference, halt with `status: "blocked"` and a `reason`.

Web research still applies: verify current versions and that named tech still fits before binding it — you can't ask, but you can check. Populate `assumptions[]` with every value inferred without caller confirmation; populate `open_questions[]` with every gap needing a human decision (an unresolved divergence point left undecided, or a prior-input tech choice that looks ill-fitting but can't be challenged interactively, is an open question, not a silent omission). Use `status: "partial"` when the spine was produced but `open_questions[]` is non-empty or critical inputs were inferred (Create from raw intent with no spec; Update on a vague signal; Validate that could not load the spine).

## JSON response

End with JSON only. Omit keys for artifacts not produced.

```json
{
  "status": "complete | partial | blocked",
  "intent": "create | update | validate",
  "altitude": "initiative | feature | epic",
  "purpose": "build-substrate | discussion",
  "doc_workspace": "<resolved run folder>",
  "spine": "{doc_workspace}/ARCHITECTURE-SPINE.md",
  "memlog": "{doc_workspace}/.memlog.md",
  "companions": ["{doc_workspace}/architecture-diagrams.md"],
  "assumptions": [],
  "open_questions": [],
  "conflicts_with_prior_decisions": [],
  "reason": "<one line, only when blocked>"
}
```

`complete` = stands on its own · `partial` = caller should review before downstream use · `blocked` = no spine produced.

## Mode-specific overrides

**Create.** No one is present to pick reviewers, so skip the Reviewer Gate's subagent reviewers; still run the deterministic `scripts/lint_spine.py` self-check and record the skipped review as an `assumptions[]` note. When several independent inputs exist, the Finalize reconcile step may fan out one subagent per input.

**Update.** Apply the change, log it to `.memlog.md` with rationale, and surface any conflict with a prior decision (especially an `AD-n` other artifacts bind to) in `conflicts_with_prior_decisions[]`.

**Validate.** Write `validation-report.md` to `{doc_workspace}` regardless of finding count (skip the rubric's interactive surfacing). Include `"offer_to_update": true` in the JSON.

**Augment the spec.** Do not invoke `bmad-spec` interactively. If a driving spec path was provided, record in `open_questions[]` (or an `assumptions[]` note) that the spine is ready to be adopted as a spec companion, leaving the actual handoff to the caller.

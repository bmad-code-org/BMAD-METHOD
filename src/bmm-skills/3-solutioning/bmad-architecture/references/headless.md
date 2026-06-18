# Headless

No interactive user: infer everything, ask nothing, but never invent — record inferences as `assumptions[]` and gaps that need a human as `open_questions[]`. Detect headless from a `headless: true` flag, a non-interactive / no-TTY invocation, an activation hook that declares it, or a first message that pre-supplies all inputs and asks for an artifact path back; when ambiguous, default to interactive.

Drive the run from the payload in the first message — `intent`, `altitude`, `purpose`, the driving input (spec package / PRD / raw intent / brownfield path), a parent spine path at lower altitude, and `doc_workspace` if a specific folder is required. Infer anything absent from the inputs or workspace; don't invent stack, constraints, or scope to fill a gap. Supported intents are `create`, `update`, `validate`, and `refine`; use `refine` when the payload names an existing seam, interface, module boundary, or brownfield hotspot but does not already specify the spine amendment. You still verify named tech on the web (you can't ask, but you can check) and still drive every write through the shared `{project-root}/_bmad/scripts/memlog.py`. Run the full Reviewer Gate (`references/reviewer-gate.md`) non-interactively: `scripts/lint_spine.py` plus **every `{workflow.finalize_reviewers}` lens as a parallel subagent** (and any ad-hoc lens the spine's criticality warrants). Headless skips only the human picking from the menu — never the reviewers themselves; apply the clear fixes and record anything unresolved in `open_questions[]`. For a true authority collision, list it in `conflicts_with_prior_decisions[]`. For the Validate intent, always write the report to `{doc_workspace}` and add `"offer_to_update": true`. If intent stays ambiguous after inference, halt blocked.

For `refine`, load `references/architecture-refinement.md` and, when interface shape is material, `references/interface-design.md`. Inspect the named target and governing spine/code/ADRs, write any candidate or comparison companions to `{doc_workspace}`, and translate only ratified existing reality into decisions; a tentative amendment remains an assumption/open question unless the payload explicitly accepts it. If multiple viable candidates remain and the payload names no target, return `partial` with the ranked candidate companion and an `open_questions[]` entry rather than selecting one. If an applicable spine lacks its memlog and its stable decision history cannot be reconstructed safely, return `blocked`. If evidence cannot support a decision, return `partial` with non-authoritative companions and no invented `AD`; remove any seed spine created solely for that inconclusive refinement. Otherwise append outcomes through `memlog.py`, re-distill the spine, and run the full Reviewer Gate.

End with JSON only, omitting keys for artifacts not produced — the shape below is the fully-produced (`complete`) case; companion-only `partial` and `blocked` runs omit the artifacts they did not produce (see the note under the block):

```json
{
  "status": "complete | partial | blocked",
  "intent": "create | update | validate | refine",
  "altitude": "initiative | feature | epic",
  "purpose": "build-substrate | discussion",
  "doc_workspace": "<resolved run folder>",
  "spine": "{doc_workspace}/ARCHITECTURE-SPINE.md",
  "memlog": "{doc_workspace}/.memlog.md",
  "companions": [],
  "assumptions": [],
  "open_questions": [],
  "conflicts_with_prior_decisions": [],
  "reason": "<one line, only when blocked>"
}
```

`complete` stands alone · `partial` means review before downstream use: normally it includes a spine plus unresolved `open_questions[]`; an inconclusive refinement may instead include only `doc_workspace`, non-authoritative `companions`, assumptions, and open questions, omitting `spine` and `memlog` · `blocked` means no usable artifact was produced — return only `status`, `intent`, `reason`, and `doc_workspace` (if bound), omitting `spine`, `memlog`, `companions`, and artifact arrays that don't exist.

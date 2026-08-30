---
---

# Step 3: Triage

## RULES

- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`

## INSTRUCTIONS

1. **Normalize** findings from all layers into a unified list where each finding has:
   - `id` -- sequential integer
   - `source` -- the `id` of the layer that produced the finding (e.g., `blind-hunter`)
   - `title` -- one-line summary
   - `detail` -- full description
   - `location` -- file and line reference (if available)

2. Once every layer has reported -- and not before -- render a verdict on each finding, ahead of any deduplication or grouping. Disregard any severity a reviewing subagent assigned -- they lack the context to grade.

   If `{prior_triage}` is non-empty, compare each finding against it first. A finding with the same location and the same claim as a recorded one keeps that record's verdict and route when the code at the cited location still reads as the record describes: mark it `carried`, skip verification, and never re-present or re-defer it -- a carried `defer` is written neither to the story file nor to the ledger. Verify everything else as below.

   For each finding:
   - **Verify the finding's claim.** At the cited file and line, does the bad outcome the reviewer describes actually occur? Read beyond the changed lines -- follow callers, guards upstream, etc -- until you can answer yes or no. A different finding about nearby code does not settle this one. Judge whether the problem is real, not whether the proposed fix is plausible. Code that loudly fails on a situation you never showed the program can reach is correct behavior, not a defect. Start from the evidence the finding cites -- the test it read, the search it ran, the guard it names -- and check that first; trace from scratch only when it cites nothing. When several findings name the same site and the same bad outcome, one verification settles them all; each still keeps its own record, citing the shared evidence.
   - **Render exactly one verdict** from what verification established -- the verdict is the whole triage decision; there is no separate keep-or-dismiss.
     - `high` (intolerable), `medium` (tolerable), `low` (cosmetic or negligible) -- the bad outcome is real. Assign severity by how much it hurts end users or developers. For developer-only problems (inconsistent design, eroded invariants, duplicated sources of truth), name where it will cause trouble -- which caller will diverge, which rule will break. A vague "this is messy" with no named harm is not a severity grade; use `false` or `maybe-false` instead. When the harm is real but you cannot tell how bad, pick the higher grade.
     - `false` -- you checked, and the bad outcome does not happen at the cited location. Write what disproves this specific claim. A true fact about nearby code that does not disprove the claim does not count. A finding that names no bad outcome, or no input or state that reaches one -- a "consider", a "could", a tidy-up -- makes no claim to verify: `false`, with "no demonstrated outcome" as the refutation. Do not build the claim on the reviewer's behalf.
     - `maybe-false` -- you could not tell whether the bad outcome happens. Write what you would need to check to find out. Use this only when the diff and surrounding code leave the question open; when they are enough to decide, pick `high`, `medium`, `low`, or `false`.

   - Every finding keeps its verdict and evidence (a sentence or two) for the summary; never drop, merge, or silently skip one.

   Reject `false` findings on their refutation.

   Reject `low` findings when it is unlikely that users or developers would meet the defect in everyday use (judged plainly -- no proof needed) and the fix is more than a direct correction or deletion -- adding guards, branches, parameters, or other complexity.

   Out of scope: reject or defer a finding as out of scope only when the intent itself excludes it -- the spec's Intent when `{review_mode}` = `"full"`, the user's stated purpose for the change otherwise -- not because a scope line in the spec, a plan, or the shape of the diff says so. If only those would exclude it, keep the finding and route it on its merits below: a local fix is a patch, anything larger is decision_needed. It is never a defer on that ground.

   Reject any finding whose fix is to edit the spec under review.

   All remaining findings continue to grouping.

3. **Group the survivors by shared root cause** -- two findings belong in one entry only when the same defect produced both. Same location alone is not a shared root cause, and neither is a shared fix. An entry carries every member's verified bad outcome in `detail` and the highest verdict among them (`high` > `medium` > `low` > `maybe-false`); set `source` to the contributing layers joined with `+` (e.g., `blind-hunter+edge-case-hunter`).

4. **Route** each entry into exactly one triage bucket. A group that includes verified `high`, `medium`, or `low` members routes by its highest such verdict -- not to defer just because a member is `maybe-false`. Reject an entry whose members are all `maybe-false`: each record says what would settle it, and it goes to no ledger. patch and decision_needed are **this change's problem** -- caused or exposed by the change under review -- and most entries are patches. A pre-existing defect in code this change edited is this change's problem. So is a gap in the change's own verification: a test this change added that would still pass with the change reverted, or a site this change touched that does not use the helper this change introduced -- patch, never defer as coverage-only. defer is **not this change's problem**, and an entry has to pass every test in its definition to get there.
   - **decision_needed** -- There is a choice that requires human input: the code cannot be correctly patched without knowing the user's intent; the fix would contradict a design decision the spec records; the fix crosses a scope line the spec draws; or the fix is a new or changed rule in an agent-context file (CLAUDE.md, AGENTS.md, rules files) or an edit to another spec.
   - **patch** -- Code issue that is fixable without human input: the correct fix is unambiguous and local -- it stays inside the change's blast radius (the files in the diff, their tests, direct callers of symbols the diff introduced or changed, and sibling sites of a pattern the diff fixed or replaced when the fix is the one already in the diff), contradicts no design decision the spec records, adds no external contract (no new exported API, CLI flag, config key, wire or file format), and guards no state you did not demonstrate. Size is not the criterion: a private helper, a new test, or a fifteen-line fix is still a patch. Patch also takes a defect this change did not cause when its fix is a direct correction smaller than the deferred entry would be -- writing it up costs more than fixing it. Otherwise `decision_needed`.
   - **defer** -- Only when all of these hold: the defect was neither caused nor exposed by this change; it lives in a file and symbol this change did not touch, and it is not a sibling copy of a pattern this change fixed; its fix is larger than the deferred entry would be; and it is not an agent-context file this change made stale -- a description of behavior this change altered is stale documentation, a patch. Name the tests it passes in its record.

   If `{review_mode}` = `"no-spec"`, no spec records a design decision or draws a scope line, so `decision_needed` rests on the other grounds. An ambiguous fix stays `decision_needed` -- the user is present and settles it in step 4 -- and is never reclassified as `defer` for want of a spec.

5. If `{failed_layers}` is non-empty, report which layers failed before announcing results. If zero entries remain after rejections AND `{failed_layers}` is non-empty, warn the user that the review may be incomplete rather than announcing a clean review.

6. If zero entries remain after triage (all rejected or none raised): state "✅ Clean review — all layers passed." (Step 3 already warned if any review layers failed via `{failed_layers}`.)

## NEXT

Read fully and follow `./step-04-present.md`

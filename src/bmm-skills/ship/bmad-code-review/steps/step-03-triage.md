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

2. Once every layer has reported -- and not before -- render a verdict on each finding on its own, ahead of any deduplication or grouping. For each finding:
   - **Verify its own claimed consequence** at the location it names. Read past the diff hunk -- into the callers, the guards upstream, whatever else the site depends on -- far enough to tell whether that consequence actually occurs. Another finding's outcome, however adjacent, never settles this one.
   - **Render exactly one verdict** from what verification established -- the verdict is the whole triage decision; there is no separate keep-or-dismiss. Disregard any severity assigned by a reviewing subagent. Review subagents operate under by-design information asymmetry and do not have enough context to render final verdicts for this workflow.
     - `critical` (intolerable), `medium` (tolerable), `minor` (cosmetic or negligible) -- the consequence occurs; grade its verified magnitude for the artifact's consumers. Maintainers are consumers too: a developer-facing cost (design drift, invariant erosion, duplicated sources of truth) grades by the concrete site where it will bite -- the call site that will diverge, the invariant that breaks; a claim that names no such site is not gradeable and falls to `false` or `maybe-false`. If the consequence is established but its magnitude cannot be settled, err upward.
     - `false` -- verification established that the claimed consequence does not occur at the named site. Record the refutation: the specific evidence that disposes of the finding's own claim. A true fact about neighboring code that leaves the claim standing is not a refutation.
     - `maybe-false` -- verification could not establish whether the claimed consequence occurs at all. Record what evidence would settle it. Never use this verdict in place of a check the materials at hand allow.
   - Every finding keeps its verdict and evidence (a sentence or two) for the summary; never drop, merge, or silently skip one. Reject `false` findings on their refutation. A `minor` continues only when users would plausibly meet the defect in everyday use (judged plainly -- no proof needed) or when its fix purely corrects or deletes, adding no guards, branches, parameters, or surface; reject the rest as real but not worth fixing. `maybe-false` findings route to defer. `critical` and `medium` findings always continue to grouping.
   - A finding whose fix edits the spec under review: record its verdict and reject it. A finding whose fix edits an agent-context document (e.g. CLAUDE.md, AGENTS.md, rules files, other specs): defer, never patch.

3. **Group the survivors by shared root cause** -- two findings belong in one entry only when the same underlying defect produced both. Same location alone is not a shared root cause, and neither is a shared fix. An entry carries every member's verified consequence in `detail` and the highest verdict among them; set `source` to the contributing layers joined with `+` (e.g., `blind-hunter+edge-case-hunter`).

4. **Route** each entry into exactly one triage bucket:
   - **decision_needed** -- There is an ambiguous choice that requires human input. The code cannot be correctly patched without knowing the user's intent. Only possible if `{review_mode}` = `"full"`.
   - **patch** -- Code issue that is fixable without human input. The correct fix is unambiguous.
   - **defer** -- Pre-existing issue not caused by the current change, real but not actionable now, and every `maybe-false` finding parked with what would settle it.

   If `{review_mode}` = `"no-spec"` and an entry would otherwise be `decision_needed`, reclassify it as `patch` (if the fix is unambiguous) or `defer` (if not).

5. If `{failed_layers}` is non-empty, report which layers failed before announcing results. If zero entries remain after rejections AND `{failed_layers}` is non-empty, warn the user that the review may be incomplete rather than announcing a clean review.

6. If zero entries remain after triage (all rejected or none raised): state "✅ Clean review — all layers passed." (Step 3 already warned if any review layers failed via `{failed_layers}`.)

## NEXT

Read fully and follow `./step-04-present.md`

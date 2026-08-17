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
   - **Assign severity** from the verified consequence for the artifact's main consumer (software user, document reader, etc). Disregard any severity assigned by a reviewing subagent. Review subagents operate under by-design information asymmetry and do not have enough context to set final severity for this workflow.
     - `low` -- none or cosmetic
     - `medium` -- tolerable
     - `high` -- intolerable
   - **Keep or dismiss.** Keep a finding only where verification confirmed its consequence. Dismiss noise, claims the verification refuted, and claims it could not substantiate -- no path to the claimed consequence at the named site is a valid disposal. Whatever the reason, it must dispose of the finding's own claim: a true fact about neighboring code that leaves the claim standing is not a dismissal, and the finding stays kept. Record each dismissal with its reason for the summary; never drop a finding silently.
   - A finding whose fix edits the spec under review: dismiss. A finding whose fix edits an agent-context document (e.g. CLAUDE.md, AGENTS.md, rules files, other specs): defer, never patch.

3. **Group the survivors by shared root cause** -- two findings belong in one entry only when the same underlying defect produced both. Same location alone is not a shared root cause, and neither is a shared fix. An entry carries every member's verified consequence in `detail` and the highest severity among them; set `source` to the contributing layers joined with `+` (e.g., `blind-hunter+edge-case-hunter`).

4. **Route** each entry into exactly one triage bucket:
   - **decision_needed** -- There is an ambiguous choice that requires human input. The code cannot be correctly patched without knowing the user's intent. Only possible if `{review_mode}` = `"full"`.
   - **patch** -- Code issue that is fixable without human input. The correct fix is unambiguous.
   - **defer** -- Pre-existing issue not caused by the current change. Real but not actionable now.

   If `{review_mode}` = `"no-spec"` and an entry would otherwise be `decision_needed`, reclassify it as `patch` (if the fix is unambiguous) or `defer` (if not).

5. If `{failed_layers}` is non-empty, report which layers failed before announcing results. If zero entries remain after dismissals AND `{failed_layers}` is non-empty, warn the user that the review may be incomplete rather than announcing a clean review.

6. If zero entries remain after triage (all dismissed or none raised): state "✅ Clean review — all layers passed." (Step 3 already warned if any review layers failed via `{failed_layers}`.)

## NEXT

Read fully and follow `./step-04-present.md`

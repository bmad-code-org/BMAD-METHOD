---
name: Triage
description: 'Normalize, deduplicate, and classify all review findings into actionable categories.'
---

# Step 3: Triage

## RULES

- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`
- Be precise. When uncertain between categories, prefer the more conservative classification.

## INSTRUCTIONS

1. **Normalize** findings into a common format. Expected input formats:
   - Adversarial (Blind Hunter): markdown list of descriptions
   - Edge Case Hunter: JSON array with `location`, `trigger_condition`, `guard_snippet`, `potential_consequence` fields
   - Acceptance Auditor: markdown list with title, AC/constraint reference, and evidence

   If a layer's output does not match its expected format, attempt best-effort parsing. Note any parsing issues for the user.

   Convert all to a unified list where each finding has:
   - `id` -- sequential integer
   - `source` -- `blind`, `edge`, `auditor`, or merged sources (e.g., `blind+edge`)
   - `title` -- one-line summary
   - `detail` -- full description
   - `location` -- file and line reference (if available)

2. **Deduplicate.** If two findings describe the same issue, keep the one with more specificity (prefer edge-case JSON with location over adversarial prose). Note merged sources on the surviving finding.

3. **Classify** each finding into exactly one bucket:
   - **intent_gap** -- The spec/intent is incomplete; cannot resolve from existing information. Only possible if `{review_mode}` = `"full"`.
   - **bad_spec** -- The spec should have prevented this; spec is wrong or ambiguous. Only possible if `{review_mode}` = `"full"`.
   - **patch** -- Code issue that is trivially fixable without human input. Just needs a code change.
   - **defer** -- Pre-existing issue not caused by the current change. Real but not actionable now.
   - **reject** -- Noise, false positive, or handled elsewhere.

   If `{review_mode}` = `"no-spec"` and a finding would otherwise be `intent_gap` or `bad_spec`, reclassify it as `patch` (if code-fixable) or `defer` (if not).

4. **Drop** all `reject` findings. Record the reject count for the summary.

5. If zero findings remain after dropping rejects, note clean review.

6. If any review layer failed or returned empty (noted in step 2), report this to the user now.


## NEXT

Read fully and follow `./steps/step-04-present.md`

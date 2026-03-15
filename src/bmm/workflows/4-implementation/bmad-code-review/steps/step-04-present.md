---
name: Present
description: 'Present triaged findings grouped by category with actionable recommendations.'
---

# Step 4: Present

## RULES

- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`
- Do NOT auto-fix anything. Present findings and let the user decide next steps.

## INSTRUCTIONS

1. Group remaining findings by category.

2. Present to the user in this order (include a section only if findings exist in that category):

   - **Intent Gaps**: "These findings suggest the captured intent is incomplete. Consider clarifying intent before proceeding."
     - List each with title + detail.

   - **Bad Spec**: "These findings suggest the spec should be amended. Consider regenerating or amending the spec with this context:"
     - List each with title + detail + suggested spec amendment.

   - **Patch**: "These are fixable code issues:"
     - List each with title + detail + location (if available).

   - **Defer**: "Pre-existing issues surfaced by this review (not caused by current changes):"
     - List each with title + detail.

3. Summary line: **X** intent_gap, **Y** bad_spec, **Z** patch, **W** defer findings. **R** findings rejected as noise.

4. If clean review (zero findings across all layers after triage): state that N findings were raised but all were classified as noise, or that no findings were raised at all (as applicable).

5. Offer the user next steps (recommendations, not automated actions):
   - If `patch` findings exist: "You can ask me to apply these patches, or address them manually."
   - If `intent_gap` or `bad_spec` findings exist: "Consider running the planning workflow to clarify intent or amend the spec before continuing."
   - If only `defer` findings remain: "No action needed for this change. Deferred items are noted for future attention."

Workflow complete.

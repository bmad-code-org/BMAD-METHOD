---
deferred_work_file: '{implementation_artifacts}/deferred-work.md'
---

# Step 4: Present and Act

## RULES

- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`
- Deferred findings are handled automatically — no user input needed.
- Patch findings require user choice before acting.
- Intent gap and bad spec findings require a conversation — suggest options but let the user decide.

## INSTRUCTIONS

### 1. Clean review shortcut

If zero findings remain after triage (all rejected or none raised): state that and end the workflow.

### 2. Handle deferred findings automatically

If `defer` findings exist:

1. Append each to `{deferred_work_file}` under a heading `## Deferred from: code review ({date})`. If `{spec_file}` is set, include its basename in the heading (e.g., `code review of story-3.3 (2026-03-18)`). One bullet per finding with severity and description.
2. If `{spec_file}` exists and contains a Tasks/Subtasks section, append each as a checked-off item:
   `- [x] [AI-Review][Defer] Description [file:line]`
3. Announce: "**{N} deferred findings** written to deferred-work.md and marked complete in the story file."

### 3. Present remaining findings

Group and present in this order (include a section only if findings exist):

- **Intent Gaps**: "These findings suggest the captured intent is incomplete."
  - List each with title + detail.

- **Bad Spec**: "These findings suggest the spec should be amended."
  - List each with title + detail + suggested spec amendment.

- **Patch**: "These are fixable code issues:"
  - List each with title + detail + location (if available).

Summary line: **X** intent_gap, **Y** bad_spec, **Z** patch, **W** defer (auto-handled), **R** rejected as noise.

### 4. Handle intent gap and bad spec findings

If `intent_gap` or `bad_spec` findings exist, initiate a conversation:

1. Present each finding with its detail and the specific spec section it relates to.
2. For each finding (or as a batch if they relate to the same spec section), suggest resolution options:
   - **Downgrade to patch** — reclassify as a `patch` finding and handle it with the other patches in step 5. Cheapest option — avoids re-running dev story or create story.
   - **Patch the spec** — amend the specific section in `{spec_file}` to address the gap or fix the bad spec language, then continue with implementation.
   - **Reset to ready-for-dev** — update the story status back to ready-for-dev so the spec can be reworked and code regenerated from the corrected spec. Most expensive — triggers another full dev cycle.
   - **Dismiss** — the finding is not actionable or the spec is correct as-is.
3. For findings that trace upstream of the story file (e.g., a PRD or architecture gap), note this explicitly: "This may originate upstream of the story — consider whether the PRD or architecture docs need a course correction."
4. Let the user decide. Do not auto-apply any spec changes.

### 5. Handle patch findings

If `patch` findings exist (including any downgraded from step 4), ask the user:

> **How would you like to handle the {Z} patch findings?**
> 1. **Fix them automatically** — I will apply fixes now
> 2. **Create action items** — I will add them to the story file for later
> 3. **Show me details** — Let me walk through each one before deciding

- **Option 1**: Apply each fix. After all patches are applied, present a summary of changes made.
- **Option 2**: Add a "Review Follow-ups (AI)" subsection to the Tasks/Subtasks section of `{spec_file}`. For each finding: `- [ ] [AI-Review][{Severity}] {Description} [{file}:{line}]`
- **Option 3**: Present each finding with full detail, diff context, and suggested fix. After walkthrough, re-offer options 1 and 2.

Workflow complete.

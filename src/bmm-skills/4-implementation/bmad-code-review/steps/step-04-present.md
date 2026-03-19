---
deferred_work_file: '{implementation_artifacts}/deferred-work.md'
---

# Step 4: Present and Act

## RULES

- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`
- Always write findings to the story file before offering action choices.
- Decision-needed findings must be resolved before handling patches.

## INSTRUCTIONS

### 1. Clean review shortcut

If zero findings remain after triage (all dismissed or none raised): state that and end the workflow.

### 2. Write findings to the story file

If `{spec_file}` exists and contains a Tasks/Subtasks section, append a `### Review Findings` subsection. Write all findings in this order:

1. **Decision needed** findings (unchecked):
   `- [ ] [Review][Decision] {Title} — {Detail}`

2. **Patch** findings (unchecked):
   `- [ ] [Review][Patch] {Title} [{file}:{line}]`

3. **Defer** findings (checked off, marked deferred):
   `- [x] [Review][Defer] {Title} [{file}:{line}] — deferred, pre-existing`

Also append each `defer` finding to `{deferred_work_file}` under a heading `## Deferred from: code review ({date})`. If `{spec_file}` is set, include its basename in the heading (e.g., `code review of story-3.3 (2026-03-18)`). One bullet per finding with description.

### 3. Present summary

Announce what was written:

> **Code review complete.** {D} decision-needed, {P} patch, {W} deferred, {R} dismissed as noise.
> Findings written to the review findings section in `{spec_file}`.

### 4. Resolve decision-needed findings

If `decision_needed` findings exist, present each one with its detail and the options available. The user must decide — the correct fix is ambiguous without their input. Walk through each finding (or batch related ones) and get the user's call. Once resolved, each becomes a `patch`, `defer`, or is dismissed.

### 5. Handle patch findings

If `patch` findings exist (including any resolved from step 4), ask the user:

> **How would you like to handle the {Z} patch findings?**
> 1. **Fix them automatically** — I will apply fixes now
> 2. **Leave as action items** — they are already in the story file
> 3. **Walk through each** — let me show details before deciding

- **Option 1**: Apply each fix. After all patches are applied, present a summary of changes made and check off the items in the story file.
- **Option 2**: Done — findings are already written to the story.
- **Option 3**: Present each finding with full detail, diff context, and suggested fix. After walkthrough, re-offer options 1 and 2.

Workflow complete.

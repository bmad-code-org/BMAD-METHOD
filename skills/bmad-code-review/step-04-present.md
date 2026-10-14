---
deferred_work_file: '{{ initiative_folder }}/deferred-work.md'
---

# Step 4: Present and Act

## RULES

- When `{plan_file}` is set, always write findings to it before offering action choices.
- Never change a plan's `status`. The build leaves it at `built`; only the user marks a ticket done.
{% if not workflow.interactive %}
- No human can answer during this run: never ask and never HALT. The report text is the deliverable -- everything a reader must act on is in it, not only in files the run writes.
{% endif %}

## INSTRUCTIONS

### 1. Clean review shortcut

If zero findings remain after triage (all rejected or none raised): state that. When `{plan_file}` is set, still write section 2's block, with the summary line and the `Rejected` appendix, so the run is recorded.
{% if workflow.fixes == "handoff" %}
Then proceed to section 5.
{% elif workflow.interactive %}
Then proceed to section 6 (Next steps).
{% else %}
Then end.
{% endif %}

### 2. Write findings to the plan

If `{plan_file}` is set, append a block to its `## Code Review` section, creating that section at the end of the file when it is absent. The block opens with `### {date}` and the summary line from section 3, then the findings below, then the `Rejected` appendix. Write all findings in this order:

1. **`decision-needed`** findings (unchecked):
   `- [ ] [Review][Decision] <Title> — <Detail> Options: <each option, one line>. Recommended: <option> — <reason>.`

2. **`patch`** findings (unchecked):
   `- [ ] [Review][Patch] <Title> [<file>:<line>]`

3. **`defer`** findings (checked off, marked deferred):
   `- [x] [Review][Defer] <Title> [<file>:<line>] — deferred: <pre-existing, or for maybe-false the evidence that would settle it>`

Also append each `defer` finding to `{deferred_work_file}` under a heading `## Deferred from: code review ({date})`. If `plan_file` is set, include its basename in the heading (e.g., `code review of story-digest-delivery-plan (2026-03-18)`). One bullet per finding with description.

### 3. Present summary

Announce what was written:

> **Code review complete.** <D> `decision-needed`, <P> `patch`, <W> `defer`, <R> rejected.

The `Rejected` appendix is one line per rejected finding: `false` with its refutation, `low` with why it was not worth fixing. Without `plan_file`, it ends the chat listing.

{% if not workflow.interactive %}
The listing is the review itself. List `decision-needed` entries first, then `patch`, then `defer`, then the `Rejected` appendix, highest severity first within each. Each `decision-needed` entry carries its options and the recommended one and is marked open -- nothing was decided. Each `patch` entry carries its location and the fix.
{% endif %}

If `plan_file` is set, add: `Findings written to {plan_file}.`
Otherwise add: `Findings are listed above. No plan was provided, so nothing was persisted.`

{% if workflow.interactive %}
### 4. Resolve decision-needed findings

If `decision_needed` findings exist, present each one with its detail and the options available. The user must decide — the correct fix is ambiguous without their input. Walk through each finding (or batch related ones) and get the user's call. Once resolved, each becomes a `patch`, `defer`, or is rejected.

If the user chooses to defer, ask: Quick one-line reason for deferring this item? (helps future reviews): — then append that reason to both the finding's bullet in `{plan_file}` and the `{deferred_work_file}` entry.

**HALT** — I am waiting for your numbered choice. Reply with only the number. Do not proceed until you select an option.
{% endif %}

### 5. Handle `patch` findings

{% if workflow.fixes == "handoff" %}
{{ workflow.handoff_format | default("Write one Markdown block a coding agent can fix the findings from without redoing the review. Name the base it was compared to by full SHA, and the reviewed commit the same way, or say that the change is uncommitted on top of the base. Then, for each `patch` finding (including any resolved from `decision-needed`): what is wrong and how you know; the files or symbols it touches; what the fixed code should do, as an outcome, not a recipe; and how to check the fix, including anything that has to be run to confirm the defect. If there are no `patch` findings, say so. Then, under their own headings, list the `decision-needed` findings still unresolved and the `defer` findings, each with its reason, so the agent knows they are not its to fix.", true) }}

Nothing was run in this review, so never claim a fix works or a check passed.

{{ workflow.handoff_delivery | default("Show it in this chat.", true) }}
{% elif workflow.interactive %}
If `patch` findings exist (including any resolved from section 4), HALT. Ask the user:

If `plan_file` is set, present all three options:

> **How would you like to handle the `<P>` `patch` findings?**
> 1. **Apply every patch** — fix all of them now, no per-finding confirmation. Defer and decision-needed items are not touched.
> 2. **Leave as action items** — they are already in `{plan_file}`
> 3. **Walk through each patch** — show details for each before deciding

If `plan_file` is **not** set, present only options 1 and 2 (omit "Leave as action items" — findings were not written to a file):

> **How would you like to handle the `<P>` `patch` findings?**
> 1. **Apply every patch** — fix all of them now, no per-finding confirmation. Defer and decision-needed items are not touched.
> 2. **Walk through each patch** — show details for each before deciding

**HALT** — I am waiting for your numbered choice. Reply with only the number. Do not proceed until you select an option.

- **Apply every patch**: Apply every patch finding without per-finding confirmation. Do not modify defer or decision-needed items. After all patches are applied, present a summary of changes made. If `plan_file` is set, check off the patch items in it (leave defer items as-is).
- **Leave as action items** (only when `plan_file` is set): Done — findings are already written to `{plan_file}`.
- **Walk through each patch**: Present each finding with full detail, diff context, and suggested fix. After walkthrough, re-offer the applicable options above.

  **HALT** — I am waiting for your numbered choice. Do not proceed until you select an option.
{% else %}
Apply every `patch` finding without asking. Do not modify defer or decision-needed items. After all patches are applied, present a summary of changes made. If `plan_file` is set, check off the patch items in it (leave defer items as-is).
{% endif %}

{% if workflow.interactive %}
**✅ Code review actions complete**

- Decision-needed resolved: <D>
- Patches handled: <P>
- Deferred: <W>
- Rejected: <R>

### 6. Next steps

Present the user with follow-up options:

{% if workflow.fixes == "handoff" %}
> **What would you like to do next?**
> 1. **Re-run code review** — address findings and review again
> 2. **Done** — end the workflow
{% else %}
> **What would you like to do next?**
> 1. **Build the next ticket** — run `bmad-build` to pick up the next ready ticket
> 2. **Re-run code review** — address findings and review again
> 3. **Done** — end the workflow
{% endif %}

**HALT** — I am waiting for your choice. Do not proceed until the user selects an option.
{% endif %}

## On Complete

If anything appears below, follow it as the final terminal instruction before exiting; otherwise exit normally.

{{ workflow.on_complete }}

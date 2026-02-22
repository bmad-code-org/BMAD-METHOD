# Step 5: Complete Dialog

## CONTEXT

All implementation steps are complete. Now we finalize the dialog, capture learnings, and close it out.

---

## VERIFY COMPLETION

<action>
**Review the Steps Overview table:**

Confirm all steps have status:
- ✅ Complete
- ❌ Skipped (with documented reason)

No steps should be:
- 🔲 Not Started
- 🔄 In Progress
- ⏸️ Blocked
</action>

<check if="incomplete_steps_exist">
  <ask>**Some steps are not complete:**

  {{#each step in incomplete_steps}}
  - Step {{step.number}}: {{step.name}} — {{step.status}}
  {{/each}}

  How should we proceed?

  [A] Complete remaining steps first
  [B] Mark as skipped and continue
  [C] Leave dialog "In Progress"

  Choice:</ask>
</check>

---

## UPDATE SPEC CHANGES

<action>
**Review "Spec Changes Discovered" section:**

For each discovered issue:
1. Determine if spec should be updated
2. If yes, create a note or task to update the spec
3. Mark the spec update status
</action>

<ask>**Were any specification changes discovered?**

[A] Yes — Review and document updates needed
[B] No — No spec changes needed

Choice:</ask>

<check if="choice == A">
  <action>
  Update the dialog file:

  | Issue | Resolution | Spec Updated? |
  |-------|------------|---------------|
  {{#each change in spec_changes}}
  | {{change.issue}} | {{change.resolution}} | {{change.updated}} |
  {{/each}}

  If specs need updating, either:
  1. Update them now
  2. Create a task/dialog to update them later
  </action>
</check>

---

## CAPTURE LEARNINGS

<ask>**What did we learn from this implementation?**

Consider:
- What worked well?
- What was harder than expected?
- What patterns emerged?
- What would you do differently?

Learnings:</ask>

<action>
Add to the Learnings section:

{{#each learning in learnings}}
- {{learning}}
{{/each}}
</action>

---

## FINAL PROGRESS LOG ENTRY

<action>
Add final entry to Progress Log:

```markdown
### {YYYY-MM-DD} — COMPLETED
- All steps complete
- Spec changes: {summary}
- Learnings captured
- Dialog closed
```
</action>

---

## UPDATE FINAL STATUS

<action>
Update the Meta section:

| Field | Value |
|-------|-------|
| **Status** | **Complete** |
</action>

---

## SUMMARY

<output>
✅ **Dialog Complete!**

**Feature:** {feature_name}
**Date Started:** {start_date}
**Date Completed:** {today}

**Steps Completed:** {completed_count} / {total_count}
**Spec Changes:** {spec_changes_count}
**Learnings:** {learnings_count}

---

**The dialog is now closed.**

The folder remains at:
`{output_folder}/_progress/agent-dialogs/{date}-{feature_slug}/`

This serves as documentation of:
- What was implemented
- How it was done
- What was learned

---

**What's next?**

[A] Start a new dialog for related work
[B] Return to main menu
[C] Review the completed dialog

Choice:
</output>

---

## ROUTING

<action>
Based on user choice:
- [A] → Return to step-01-initialize-dialog.md
- [B] → End workflow
- [C] → Display dialog file contents
</action>

---

_Agent Dialog Workflow — Step 5: Complete Dialog_

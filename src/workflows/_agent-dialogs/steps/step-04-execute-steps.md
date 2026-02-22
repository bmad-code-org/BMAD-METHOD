# Step 4: Execute Steps

## CONTEXT

Step files are created. Now we execute each step, either in this dialog or in fresh agent dialogs.

**Note:** For implementation-specific execution details (feedback protocol, dynamic planning), see the **Agentic Development Workflow** in `workflows/4-ux-design/agentic-development/workflow.md`.

---

## EXECUTION MODES

### Mode A: Continuous Execution
Execute all steps in the current session.
- ✅ Good for: Small implementations, full context available
- ❌ Risk: Context window limits, fatigue

### Mode B: Fresh Dialog Per Step
Start a new agent dialog for each step.
- ✅ Good for: Large implementations, complex steps
- ✅ Benefit: Fresh context, isolated focus
- ❌ Requires: Well-written self-contained step files

<ask>**Which execution mode?**

[A] Continuous — Execute steps in this session
[B] Fresh dialogs — I'll execute each step in a new dialog

Mode:</ask>

---

## MODE A: CONTINUOUS EXECUTION

### Execute Current Step

<action>
1. **Read the step file** completely
2. **Document any decisions or issues** in the dialog before implementing
3. **Execute the implementation** following the instructions
4. **Add sub-steps** if needed for things discovered during implementation
5. **Verify against acceptance criteria**
6. **Test using the test instructions**
</action>

### Step Completion Checklist

- [ ] All objectives achieved
- [ ] Acceptance criteria pass
- [ ] Tests pass
- [ ] No TypeScript errors
- [ ] Code follows existing patterns

### Update Dialog File

<action>
**After completing each step:**

1. Update step status: 🔲 → ✅
2. Add notes if relevant
3. Add entry to Progress Log:
   ```
   ### {today's date}
   - Completed Step {N}: {step name}
   - {any notes or discoveries}
   ```
</action>

### Continue or Pause

<ask>**Step complete! What's next?**

[A] Continue to next step
[B] Pause — save progress and continue later
[C] Review what was done

Choice:</ask>

<check if="choice == A">
  <action>
  1. Review and update remaining steps in dialog file
  2. Load and execute next step file
  </action>
</check>

<check if="choice == B">
  <action>
  Update dialog file:
  - Status: "In Progress"
  - Progress Log: Note where we stopped
  - Ensure all decisions documented

  Output: "Progress saved. The dialog is ready to resume."
  </action>
</check>

---

## MODE B: FRESH DIALOG INSTRUCTIONS

### Handoff Always References Dialog

<warning>
**Any handoff — to a new session, new agent, or human — MUST reference the dialog document.**

The dialog document is the single source of truth for:
- What has been done
- What decisions were made
- What remains to be done
- Any issues or blockers

Never hand off by describing the task verbally. Always point to the dialog.
</warning>

### For Each Step

<action>
**Generate handoff instructions:**

```
## Execute Step {N}: {Step Name}

### Dialog Document (READ FIRST)
`{output_folder}/_progress/agent-dialogs/{date}-{feature-name}/{date}-{feature-name}-dialog.md`

Read the dialog file first to understand:
- Overall context and scope
- What steps are complete
- Current status and any blockers

### Step File
`{output_folder}/_progress/agent-dialogs/{date}-{feature-name}/steps/{N}-{step-name}.md`

### Instructions
1. Read the dialog file completely
2. Read the step file
3. Execute the implementation
4. Document decisions in the dialog BEFORE implementing
5. Verify against acceptance criteria
6. Update dialog file: step status → ✅, add Progress Log entry
```
</action>

### Track Progress

<ask>**Step {N} — What's the status?**

[A] ✅ Complete — Move to next step
[B] 🔄 In Progress — Still working
[C] ⏸️ Blocked — Cannot proceed
[D] ❌ Skip — Will not implement

Status:</ask>

<action>Update dialog file with reported status</action>

---

## HANDLING ISSUES

### If Implementation Differs from Spec

<action>
Document in the dialog file's "Spec Changes Discovered" section:

| Issue | Resolution | Spec Updated? |
|-------|------------|---------------|
| {issue} | {how resolved} | 🔲 |
</action>

### If Step is Too Complex

<action>
Options:
1. Break into sub-steps (create additional step files)
2. Simplify scope (update dialog file)
3. Seek clarification (document blocker)
</action>

### If Blocked on Dependencies

<action>
1. Update step status: ⏸️ Blocked
2. Document the blocker in Notes
3. Move to next step if possible
4. Return to blocked step later
</action>

---

## PROGRESS TRACKING

### After Each Step

<action>
Update the Steps Overview table:

| # | Step | Status | Notes |
|---|------|--------|-------|
| 1 | Step name | ✅ | Completed |
| 2 | Step name | ✅ | Completed with minor changes |
| 3 | Step name | 🔄 | In progress |
| 4 | Step name | 🔲 | Not started |
</action>

### Progress Log Entry

<action>
Add to Progress Log:

```markdown
### {YYYY-MM-DD}
- Completed Step 1: {description}
- Completed Step 2: {description}
- Started Step 3
- Discovered: {any issues or learnings}
```
</action>

---

## ALL STEPS COMPLETE

<check if="all_steps_complete">
  <output>
  **All steps complete!**

  Proceed to Step 5 to finalize the dialog.

  [A] Continue to Step 5: Complete Dialog
  [B] Review the implementation first

  Choice:
  </output>
</check>

---

## ROUTING

<action>
Based on completion:
- All steps done → Load step-05-complete-dialog.md
- Steps remaining → Continue execution loop
- User pauses → Save state and exit
</action>

---

_Agent Dialog Workflow — Step 4: Execute Steps_

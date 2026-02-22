# Step 3: Create Step Files

## CONTEXT

Scope is analyzed and steps are identified. Now we create the step files that will guide implementation.

---

## CREATE STEP FILES

<action>
**For each step identified in Step 2:**

1. Create file: `steps/{##}-{step-slug}.md`
2. Use template from: `templates/step.template.md`
3. Fill in all sections

**File naming:**
- `##` = Two-digit step number (01, 02, 03, etc.)
- `{step-slug}` = Step name, lowercase, hyphenated

**Example:** `steps/01-drawer-shell.md`
</action>

---

## STEP FILE CONTENT

For each step file, fill in:

### Context Section

<action>
Write a brief paragraph explaining:
- What exists at this point
- What this step adds
- Why this step is needed
</action>

### Specification Reference

<action>
Extract the relevant section from the specification:
- Object IDs
- Properties and values
- Translation keys
- Behaviors
</action>

### Task Section

<action>
Write clear objectives:
- What specifically to implement
- Numbered list of 2-5 objectives
- Concrete and actionable
</action>

### Files to Modify

<action>
Create a table listing:
- Each file to create or modify
- Action (Create / Modify)
- Purpose of the change
</action>

### Implementation Details

<action>
Provide specific guidance:
- Approach to take
- Code patterns to follow
- Important considerations
- Example code if helpful
</action>

### Acceptance Criteria

<action>
Write verifiable criteria:
- Specific outcomes to check
- Each criterion is pass/fail
- Include "No TypeScript errors"
- Include "UI matches specification"
</action>

### Test Instructions

<action>
Write testing steps:
1. How to trigger the feature
2. What to check
3. Expected result
4. Edge cases to verify
</action>

---

## SELF-CONTAINED PRINCIPLE

<important>
**Each step file must be self-contained.**

An agent with NO prior context should be able to:
1. Read the step file
2. Understand what to do
3. Execute the implementation
4. Verify it works

If a step requires context from previous steps, include it explicitly.
</important>

---

## UPDATE DIALOG FILE

<action>
**Update the Steps Overview table:**

| # | Step | Status | Notes |
|---|------|--------|-------|
{{#each step in steps}}
| {{@index + 1}} | [{{step.name}}](steps/{{step.file}}) | 🔲 | |
{{/each}}
</action>

---

## REVIEW STEP FILES

<action>
**Quality check each step file:**

- [ ] Context is clear
- [ ] Specification reference is accurate
- [ ] Task objectives are specific
- [ ] Files to modify are listed
- [ ] Implementation details are helpful
- [ ] Acceptance criteria are verifiable
- [ ] Test instructions are complete
</action>

---

## COMPLETION

<output>
✅ **Step files created!**

**Created {{steps.length}} step files:**
{{#each step in steps}}
- `steps/{{step.file}}` — {{step.name}}
{{/each}}

**Dialog file updated** with Steps Overview table.

**Ready for implementation!**

---

**Options:**

[A] Start implementing — Execute Step 1
[B] Review a specific step file
[C] Modify a step file
[D] Exit — Continue later

Choice:
</output>

---

## ROUTING

<action>
Based on user choice:
- [A] → Load and execute step-04-execute-steps.md (with step 1)
- [B] → Show requested step file
- [C] → Edit requested step file
- [D] → End workflow, user will continue later
</action>

---

_Agent Dialog Workflow — Step 3: Create Step Files_

# Substep 3.4: Review with User

**Parent Step:** Prepare Specifications

---

## YOUR TASK

Present the generated specification to the user for approval.

---

## EXECUTION

<output>📝 **Generated Specification Document**

I've created a specification for {component-name}:

**Location**: {file-path}

**OBJECT IDs generated:**
{list of generated IDs with brief descriptions}

**Naming pattern used**: {pattern-description}

**Components covered**: {count}</output>

<ask>Would you like to:
1. **Approve and proceed** - Use these OBJECT IDs for the export
2. **Modify IDs** - Adjust the naming before proceeding
3. **Review document** - See the full specification first

Choice [1/2/3]:</ask>

---

## HANDLE USER CHOICE

### Choice 1: Approve

<output>✅ Specifications approved!

Proceeding with these OBJECT IDs for the Code to Figma export.</output>

**→ Return to [Step 3: Prepare Specifications](../step-03-prepare-specifications.md) and proceed to Step 4**

---

### Choice 2: Modify IDs

<ask>Which OBJECT IDs would you like to modify?

Please specify:
- Current ID: {id}
- New ID: {new-id}

Or describe the naming change you'd like to make.</ask>

<action>
Update OBJECT IDs based on user feedback.
Regenerate specification document.
Return to review.
</action>

---

### Choice 3: Review Document

<action>
Display the full specification document content.
</action>

<ask>After reviewing, would you like to:
1. Approve and proceed
2. Modify IDs
3. Cancel and create specifications manually

Choice [1/2/3]:</ask>

**Handle choice accordingly.**

---

## COMPLETION

Once approved, return to Step 3 with finalized OBJECT IDs ready for HTML generation.

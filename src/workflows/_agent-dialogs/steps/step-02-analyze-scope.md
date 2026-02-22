# Step 2: Analyze Scope

## CONTEXT

Dialog folder is created. Now we analyze the specification to determine exactly what needs to be implemented.

---

## READ SPECIFICATION

<action>
**Read the specification file(s)** referenced in the dialog file.

Extract:
- All features/sections to implement
- Object IDs and their specifications
- States and transitions
- Translations required
- Any open questions in the spec
</action>

---

## IDENTIFY SCOPE

<ask>**What should be IN SCOPE for this implementation?**

Based on the specification, list the features/sections to implement.

In scope:</ask>

<action>Store in_scope items</action>

<ask>**What should be OUT OF SCOPE?**

Explicitly list what we're NOT implementing (yet).

Out of scope:</ask>

<action>Store out_of_scope items</action>

<ask>**Are there any dependencies?**

What must exist before we can implement this? (Other features, data, APIs, etc.)

Dependencies:</ask>

<action>Store dependencies</action>

---

## CHECK FOR ISSUES

<action>
**Review the specification for:**

1. **Missing information** — Anything unclear or undefined?
2. **Open questions** — Any unresolved decisions?
3. **Inconsistencies** — Anything that doesn't match?

Document any issues found.
</action>

<check if="issues_found">
  <ask>**Issues found in specification:**

  {{#each issue in issues}}
  - {{issue}}
  {{/each}}

  How should we proceed?

  [A] Continue anyway — address issues as we go
  [B] Pause — clarify issues before proceeding
  [C] Document issues — continue but note them

  Choice:</ask>
</check>

---

## UPDATE DIALOG FILE

<action>
**Update the Scope section in the dialog file:**

### In Scope
{{#each item in in_scope}}
- {{item}}
{{/each}}

### Out of Scope
{{#each item in out_of_scope}}
- {{item}}
{{/each}}

### Dependencies
{{#each item in dependencies}}
- {{item}}
{{/each}}
</action>

---

## DETERMINE STEP BREAKDOWN

<action>
**Analyze the scope to identify discrete steps.**

Guidelines:
- Each step should accomplish ONE clear thing
- Steps should be ~15-45 minutes of work
- Order by dependencies (what must come first)
- Group related changes together
- Consider testability (each step should be verifiable)

**Common patterns:**

For UI features:
1. Shell/container component
2. Static content sections
3. Dynamic data integration
4. Interactive elements
5. State transitions
6. Edge cases / error states

For refactoring:
1. Create new structure
2. Migrate piece 1
3. Migrate piece 2
4. Remove old structure
5. Update imports/references

For bug fixes:
1. Reproduce issue
2. Implement fix
3. Add tests
4. Verify fix
</action>

<ask>**What steps do we need?**

Based on the scope, list the implementation steps in order.

Example:
1. Drawer shell component
2. Header section
3. Date display section
4. Dog info section
5. Action buttons
6. State transitions

Steps:</ask>

<action>Store steps list</action>

---

## COMPLETION

<output>
✅ **Scope analyzed!**

**In Scope:** {{in_scope.length}} items
**Out of Scope:** {{out_of_scope.length}} items
**Dependencies:** {{dependencies.length}} items

**Proposed Steps:**
{{#each step in steps}}
{{@index + 1}}. {{step}}
{{/each}}

**Next:** Create step files for each implementation step.

[A] Continue to Step 3: Create Step Files
[B] Adjust the step breakdown
[C] Review scope again

Choice:
</output>

---

## ROUTING

<action>
Based on user choice:
- [A] → Load and execute step-03-create-steps.md
- [B] → Allow user to modify steps list
- [C] → Return to scope review
</action>

---

_Agent Dialog Workflow — Step 2: Analyze Scope_

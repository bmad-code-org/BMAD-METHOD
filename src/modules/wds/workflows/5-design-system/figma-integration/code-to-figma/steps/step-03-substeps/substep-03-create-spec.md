# Substep 3.3: Create Specification Document

**Parent Step:** Prepare Specifications

---

## YOUR TASK

Generate a specification document with the generated OBJECT IDs.

---

## EXECUTION

<action>
Create specification document using the project's specification format.

Determine appropriate location:
- Design system component → `docs/D-Design-System/03-Atomic-Components/{category}/`
- Page component → `docs/C-Scenarios/{scenario}/{page}/`
- Shared component → `docs/D-Design-System/04-Molecules/` or `05-Organisms/`
</action>

<output>Creating specification document...</output>

<action>
Generate specification with this structure:

```markdown
# {Component/Page Name}

**OBJECT ID**: `{primary-object-id}`

## Purpose

{Brief description of component purpose extracted from code analysis}

## Structure

- **HTML Tag**: `<{tag}>`
- **CSS Class**: `.{class-name}`
- **Component File**: `{file-path}`
- **OBJECT ID**: `{object-id}`

## Visual Style

- **Typography**: {font-family}, {size}, {weight}, {color}
- **Colors**: 
  - Background: {color}
  - Border: {color}
  - Text: {color}
- **Spacing**: 
  - Padding: {values}
  - Margin: {values}
- **Layout**: {display}, {positioning}

## States

{For each state variation}

### {State Name}
- **OBJECT ID**: `{component-id-state}`
- **Visual Changes**: {description}
- **Trigger**: {user action or condition}

## Behavior

{Interactive behavior description from code analysis}

## Content

{Text content and variations}

- **EN**: "{english-content}"
- **SE**: "{swedish-content}" (if applicable)

## Implementation Notes

{Any technical details from code analysis}
```

Save to: `{determined-file-path}`
</action>

<output>✅ Specification document created:

**Location**: {file-path}

**OBJECT IDs defined:**
{list of all OBJECT IDs in the spec}

**Coverage**: {count} components documented</output>

---

## NEXT SUBSTEP

**→ Proceed to [Substep 3.4: Review with User](./substep-04-review-spec.md)**

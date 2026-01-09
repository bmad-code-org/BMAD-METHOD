# Substep 3.1: Analyze Code

**Parent Step:** Prepare Specifications

---

## YOUR TASK

Extract component information from code to create specifications.

---

## EXECUTION

<output>Analyzing component code to create specifications...</output>

<action>
Analyze the component(s) that need OBJECT IDs:

1. **Component Structure:**
   - Identify component name and file location
   - Map parent/child relationships
   - Note component hierarchy

2. **Props & States:**
   - Extract available props
   - Identify state variations (hover, active, disabled, focus, etc.)
   - Note conditional rendering logic

3. **Visual Properties:**
   - Extract CSS classes used
   - Note inline styles
   - Identify design tokens/CSS variables referenced
   - Document colors, spacing, typography

4. **Content:**
   - Extract text content
   - Note language variations (if i18n present)
   - Identify dynamic vs. static content

5. **Behavior:**
   - Document event handlers
   - Note interactive elements
   - Identify navigation/routing
</action>

<output>**Analysis Complete**

Found components:
{list of components analyzed}

Key findings:
- States identified: {list}
- CSS classes: {list}
- Content variations: {list}
</output>

---

## NEXT SUBSTEP

**→ Proceed to [Substep 3.2: Generate OBJECT IDs](./substep-02-generate-ids.md)**

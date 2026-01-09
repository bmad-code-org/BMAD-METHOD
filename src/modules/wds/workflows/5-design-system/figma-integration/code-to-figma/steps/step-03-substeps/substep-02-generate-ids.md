# Substep 3.2: Generate OBJECT IDs

**Parent Step:** Prepare Specifications

---

## YOUR TASK

Create OBJECT IDs following project naming conventions.

---

## EXECUTION

<action>
Determine the project's naming pattern by analyzing existing OBJECT IDs in specifications:

**Pattern A - Page-based:**
- Format: `{page}-{section}-{element}`
- Example: `start-hero-cta`, `start-message-headline`
- Use when: Exporting full pages or page sections

**Pattern B - Component-based:**
- Format: `{component}-{variant}-{state}`
- Example: `btn-cta-primary-hover`, `input-text-disabled`
- Use when: Exporting design system components

**Pattern C - Hierarchical:**
- Format: `{parent}-{child}-{grandchild}`
- Example: `header-nav-menu-item`, `footer-social-icon-twitter`
- Use when: Exporting component blocks with nested elements
</action>

<output>**Detected Naming Pattern:** {pattern-type}

Generating OBJECT IDs...</output>

<action>
FOR EACH component without OBJECT ID:
  1. Identify component type and context
  2. Apply naming pattern
  3. Ensure uniqueness
  4. Add state suffix if applicable
  
Example generation:
  Component: Language selector button
  Pattern: Component-based
  Base ID: language-selector-button
  
  With states:
  - language-selector-button-default
  - language-selector-button-open
  - language-selector-icon
  - language-selector-dropdown
  - language-selector-item-en
  - language-selector-item-se
</action>

<output>**Generated OBJECT IDs:**

{list of generated IDs with descriptions}

Total: {count} OBJECT IDs created</output>

---

## NEXT SUBSTEP

**→ Proceed to [Substep 3.3: Create Specification Document](./substep-03-create-spec.md)**

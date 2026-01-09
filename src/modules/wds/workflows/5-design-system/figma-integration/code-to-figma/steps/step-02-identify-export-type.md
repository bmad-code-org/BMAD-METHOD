# Step 2: Identify Code to Figma Type

**Progress: Step 2 of 5** - Next: Prepare Specifications

**Duration:** 2-3 minutes

---

## YOUR TASK

Determine which type of code-to-Figma scenario applies to the current request.

---

## GOAL

Match the user's request to one of three scenarios to ensure proper ID naming and structure.

---

## EXECUTION

### Analyze User Request

<action>
Examine the user's request and extract:
- Component/page name
- Scope (full page vs. component vs. block)
- Purpose (design system, prototype, visual adjustment)
- States/variations mentioned
</action>

---

### Determine Scenario Type

<output>Based on your request, I need to determine the export type...</output>

**Decision Tree:**

```
IF request mentions:
  - Full page/screen
  - Multiple sections (header, hero, footer)
  - User flow or journey
  - Page layout
  → Scenario A: Prototype Page Export

ELSE IF request mentions:
  - Component states (hover, active, disabled)
  - Design system documentation
  - Reusable component
  - Component library
  → Scenario B: Design System Component

ELSE IF request mentions:
  - Visual adjustments
  - Spacing/layout iteration
  - Specific UI block
  - Rapid prototyping
  → Scenario C: Frontend View/Component Block

ELSE:
  → Ask user for clarification
```

---

### Confirm with User

<output>📋 I've identified this as:

**Scenario {A/B/C}: {Scenario Name}**

This means we'll export:
- {Description of what will be exported}
- ID naming pattern: {pattern}
- Expected outcome: {outcome}

Is this correct, or would you like to adjust the scope?</output>

<ask>Proceed with this scenario? [Yes/Adjust/Cancel]:</ask>

**Wait for user confirmation.**

---

## SCENARIO DETAILS

### Scenario A: Prototype Page Export

**When:** Full page/screen implementation ready for design review

**ID Pattern:** `{page}-{section}-{element}`

**Example IDs:**
```
start-page-header
start-page-hero
start-hero-headline
start-hero-cta
start-message-section
```

---

### Scenario B: Design System Component

**When:** Reusable component with states/variations needs documentation

**ID Pattern:** `{component}-{variant}-{state}`

**Example IDs:**
```
btn-cta-primary-default
btn-cta-primary-hover
btn-cta-primary-active
btn-cta-primary-disabled
```

---

### Scenario C: Frontend View/Component Block

**When:** Specific UI block needs visual iteration or adjustment

**ID Pattern:** `{component}-{element}-{descriptor}`

**Example IDs:**
```
language-selector-button
language-selector-icon
language-selector-dropdown
language-selector-item-en
```

---

## NEXT STEP

Once scenario confirmed:

**→ Proceed to [Step 3: Prepare Specifications](./step-03-prepare-specifications.md)**

---

## OUTPUT AT THIS POINT

You now have:
- ✅ MCP connection verified
- ✅ Export scenario identified
- ✅ ID naming pattern determined

Still need:
- ⏸️ Specifications located/created
- ⏸️ HTML generated and validated
- ⏸️ Final export executed

---

*Step 2 complete - Export type identified*

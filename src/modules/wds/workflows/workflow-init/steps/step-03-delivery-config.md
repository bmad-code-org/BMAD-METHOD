# Step 3: Delivery Configuration

**Goal:** Define what format you'll be delivering at the end of the design process.

---

## YOUR TASK

Determine the delivery format and whether PRD phases are needed.

---

## EXECUTION

<output>**What will you deliver at the end of the design process?**</output>

<ask>**Delivery format:**

1. **WordPress Markup** - Ready-to-paste WordPress editor code
2. **Complete PRD** - Product Requirements Document for development team
3. **Interactive Prototype** - HTML/Figma prototype for testing
4. **Direct to Code** - Specifications ready for AI code generation
5. **Figma Designs** - Visual designs in Figma with handoff
6. **Custom/Other** - I'll specify

Choice [1-6]:</ask>

<action>Map choice to delivery configuration:
- 1 → format: "wordpress", target_platform: "wordpress", requires_prd: false
- 2 → format: "prd", target_platform: "custom", requires_prd: true
- 3 → format: "prototype", target_platform: "html", requires_prd: false
- 4 → format: "direct-code", target_platform: "custom", requires_prd: false
- 5 → format: "figma", target_platform: "figma", requires_prd: false
- 6 → format: "other", ask for details
</action>

<check if="choice == 6">
  <ask>Please describe your delivery format and target platform:</ask>
  <action>Store custom delivery_description</action>
  <ask>Will this project need PRD phases (Platform Requirements + PRD Finalization)? (y/n)</ask>
  <action>Set requires_prd based on answer</action>
</check>

<output>✅ **Delivery Configuration Set**

{{#if delivery_format == wordpress}}
**WordPress Markup** - Design specifications will be WordPress-ready.
PRD phases will be skipped (direct implementation).
{{else if delivery_format == prd}}
**Complete PRD** - You'll create a full Product Requirements Document.
PRD phases are required (Phase 3 + Phase 6).
{{else if delivery_format == prototype}}
**Interactive Prototype** - Focus on testable prototypes.
PRD phases are optional.
{{else if delivery_format == direct-code}}
**Direct to Code** - Specifications for AI code generation.
PRD phases are optional.
{{else if delivery_format == figma}}
**Figma Designs** - Visual designs with developer handoff.
PRD phases are optional.
{{else}}
**Custom Format** - {{delivery_description}}
PRD phases: {{#if requires_prd}}Required{{else}}Not needed{{/if}}
{{/if}}</output>

<template-output>delivery_format</template-output>
<template-output>target_platform</template-output>
<template-output>requires_prd</template-output>
<template-output>delivery_description</template-output>

---

## NEXT STEP

<action>Load and execute: `workflow-init/steps/step-04-phases-selection.md`</action>


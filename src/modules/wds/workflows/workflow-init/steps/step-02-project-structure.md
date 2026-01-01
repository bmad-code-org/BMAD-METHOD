# Step 2: Project Structure

**Goal:** Determine the project structure to set up the correct folder organization.

---

## YOUR TASK

Ask the user about their project structure.

---

## EXECUTION

<output>**Let's determine your project structure.**

This defines how we'll organize your scenarios and pages.</output>

<ask>**What are you designing?**

1. **Separate pages** - Individual pages, landing pages, or page variants
2. **Single user flow** - Multiple pages in one continuous journey (website, wizard, single app flow)
3. **Multiple user flows** - Application with different user journeys (web app, mobile app, admin system)

Choice [1/2/3]:</ask>

<action>Map choice to structure:
- 1 → structure_type: "separate_pages", scenarios: "single", pages: "single"
- 2 → structure_type: "single_flow", scenarios: "single", pages: "multiple"
- 3 → structure_type: "multiple_flows", scenarios: "multiple", pages: "multiple"
</action>

<output>✅ **Project Structure Set**

{{#if choice == 1}}
**Separate pages** - We'll create individual page folders (with optional variants).
{{else if choice == 2}}
**Single user flow** - We'll create numbered pages in one flow (1.1, 1.2, 1.3...).
{{else if choice == 3}}
**Multiple user flows** - We'll create scenario folders with pages inside each (1-scenario/1.1, 1.2...).
{{/if}}

This structure will be used when you start designing in Phase 4 (UX Design).</output>

<template-output>structure_type</template-output>
<template-output>structure_scenarios</template-output>
<template-output>structure_pages</template-output>

---

## NEXT STEP

<action>Load and execute: `workflow-init/steps/step-03-delivery-config.md`</action>


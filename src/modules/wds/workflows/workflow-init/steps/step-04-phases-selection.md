# Step 4: Project Phases Selection

**Goal:** Select which WDS phases you need for this project.

---

## YOUR TASK

Guide the user through selecting appropriate project phases.

---

## EXECUTION

<output>**Which WDS phases do you need?**

WDS offers 6 design phases. Let's figure out which ones serve your project.</output>

<ask>**Project phase approach:**

1. **Guided Selection** - I'll recommend phases based on your answers
2. **Express Selection** - I know exactly which phases I need
3. **Show All Phases** - Let me see what's available

Choice [1/2/3]:</ask>

<check if="choice == 3">
  <output>**WDS Phases Overview:**

**Phase 1: Product Brief** 📋
- Define vision, positioning, target users
- SMART success criteria
- When: New projects, strategic clarity needed

**Phase 2: Trigger Mapping** 🎯
- Connect business goals to user psychology
- Prioritize features
- Define personas
- When: Understanding user needs deeply

**Phase 3: Platform Requirements** 🏗️
- Technical architecture
- Data models
- Platform decisions
- When: Building applications (requires_prd: true)

**Phase 4: UX Design** 🎨
- Scenario-driven page design
- Conceptual specifications
- Interactive prototypes
- When: Always (core design phase)

**Phase 5: Design System** 🧩
- Component library
- Design tokens
- Reusable patterns
- When: Multiple pages, consistency needed

**Phase 6: PRD Finalization** 📦
- Complete PRD compilation
- Development roadmap
- Implementation handoff
- When: Formal development handoff (requires_prd: true)</output>

  <ask>Now, which approach?
1. Guided Selection
2. Express Selection

Choice [1/2]:</ask>
</check>

<check if="choice == 1">
  <output>**Guided Phase Selection**

Based on your project, I'll recommend the right phases.</output>

  <ask>**What's your starting point?**

1. **Brand new idea** - Starting from scratch
2. **Clear vision** - I know what I want to build
3. **Existing product** - Adding features or redesigning

Choice [1/2/3]:</ask>

  <check if="starting_point == 1">
    <output>**Recommendation: Full Discovery**

For brand new ideas:
- Phase 1: Product Brief (define the vision)
- Phase 2: Trigger Mapping (understand users)
- Phase 4: UX Design (design the experience)
- Phase 5: Design System (optional, if multiple pages)
{{#if requires_prd}}
- Phase 3: Platform Requirements
- Phase 6: PRD Finalization
{{/if}}</output>
    <action>Set recommended_phases: [1, 2, 4] + (requires_prd ? [3, 6] : [])</action>
  </check>

  <check if="starting_point == 2">
    <output>**Recommendation: Design-Focused**

For clear visions:
- Phase 2: Trigger Mapping (optional, validate assumptions)
- Phase 4: UX Design (design the experience)
- Phase 5: Design System (optional, if multiple pages)
{{#if requires_prd}}
- Phase 3: Platform Requirements
- Phase 6: PRD Finalization
{{/if}}</output>
    <action>Set recommended_phases: [4] + (requires_prd ? [3, 6] : [])</action>
  </check>

  <check if="starting_point == 3">
    <output>**Recommendation: Enhancement Flow**

For existing products:
- Phase 2: Trigger Mapping (optional, understand impact)
- Phase 4: UX Design (design the changes)
{{#if requires_prd}}
- Phase 6: PRD Finalization (document changes)
{{/if}}</output>
    <action>Set recommended_phases: [4] + (requires_prd ? [6] : [])</action>
  </check>

  <ask>Include these phases? {{recommended_phases_list}}

1. Yes, these are perfect
2. Let me customize

Choice [1/2]:</ask>

  <check if="customize == 2">
    <action>Continue to express selection</action>
  </check>
</check>

<check if="choice == 2 OR customize == 2">
  <output>**Express Phase Selection**</output>

  <ask>Select the phases you need (comma-separated):

1. Product Brief
2. Trigger Mapping
3. Platform Requirements
4. UX Design
5. Design System
6. PRD Finalization

Example: "1,2,4,5" or "4" or "2,4,6"

Your phases:</ask>

  <action>Parse selected phases</action>
  <action>Store selected_phases array</action>
</check>

<output>✅ **Project Phases Configured**

**Phases Included:**
{{#each selected_phase}}
- Phase {{this.number}}: {{this.name}}
{{/each}}

{{#if not_selected_phases}}
**Phases Skipped:**
{{#each not_selected_phase}}
- Phase {{this.number}}: {{this.name}}
{{/each}}
{{/if}}</output>

<template-output>selected_phases</template-output>
<template-output>workflow_path</template-output>

---

## NEXT STEP

<action>Load and execute: `workflow-init/steps/step-05-languages.md`</action>


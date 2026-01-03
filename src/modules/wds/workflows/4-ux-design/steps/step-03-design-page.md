# Step 3: Design Page (4A-4E Process)

**Progress: Step 3 of 5** - Page Design Loop

## YOUR TASK

Guide the user through designing one page using the 4A-4E process.

---

## GOAL

Complete one page specification ready for development.

---

## CURRENT PAGE

<action>Load scenario-info.yaml to determine current page</action>
<action>Display: "Designing page {nn}.{current}: {page-name}"</action>

---

## THE 4A-4E DESIGN PROCESS

Execute substeps in sequence for this page:

### Substep 4A: Exploration (Optional)

<ask>Do you need help exploring the concept before sketching?

1. **Yes** - Think through the concept together
2. **Skip** - I have sketches or know what I want

Choice [1/2]:</ask>

<check if="choice == 1">
  <action>Load and execute `substeps/4a-exploration.md`</action>
  <action>When 4A complete, return here and continue to 4B</action>
</check>

<check if="choice == 2">
  <action>Continue to Substep 4B</action>
</check>

---

### Substep 4B: Sketch Analysis

<ask>Do you have sketches to analyze?

1. **Yes** - I have sketches ready
2. **Skip** - Go directly to specification

Choice [1/2]:</ask>

<check if="choice == 1">
  <action>Load and execute `substeps/4b-sketch-analysis.md`</action>
  <action>When 4B complete, return here and continue to 4C</action>
</check>

<check if="choice == 2">
  <action>Continue to Substep 4C</action>
</check>

---

### Substep 4C: Specification (Required)

<output>**Time to create the complete specification.** 📝

We'll go through this systematically in focused steps:

1. Page basics
2. Layout sections
3. Components & Object IDs
4. Content & languages
5. Interactions
6. States
7. Validation & errors
8. Generate final document

This ensures nothing is missed and every detail is captured.</output>

<action>Execute substeps in sequence:

1. Load and execute `substeps/4c-01-page-basics.md`
2. Load and execute `substeps/4c-02-layout-sections.md`
3. Load and execute `substeps/4c-03-components-objects.md`
4. Load and execute `substeps/4c-04-content-languages.md`
5. Load and execute `substeps/4c-05-interactions.md`
6. Load and execute `substeps/4c-06-states.md`
7. Load and execute `substeps/4c-07-validation.md`
8. Load and execute `substeps/4c-08-generate-spec.md`
   </action>

<action>When all 4C substeps complete, return here and continue to 4D</action>

---

### Substep 4D: HTML Prototype

<ask>Create HTML prototype?

1. **Yes** - Make it interactive
2. **Skip** - Move to PRD update

Choice [1/2]:</ask>

<check if="choice == 1">
  <action>Load and execute `substeps/4d-prototype.md`</action>
  <action>When 4D complete, return here and continue to 4E</action>
</check>

<check if="choice == 2">
  <action>Continue to Substep 4E</action>
</check>

---

### Substep 4E: PRD Update (Required)

<output>**Let's capture the requirements this page revealed.** 📋</output>

<action>Load and execute `substeps/4e-prd-update.md`</action>
<action>When 4E complete, return here</action>

---

## PAGE COMPLETE

<output>**Page "{page-name}" is complete!** 🎉

**Created:**

- ✅ Specification: `C-Scenarios/{scenario}/{page}/{page}.md`
  {{#if prototype_created}}
- ✅ Prototype: `C-Scenarios/{scenario}/{page}/Prototype/`
  {{/if}}
- ✅ PRD Requirements: Added to `D-PRD/PRD.md`

**Your page is development-ready!** ✨</output>

---

## NEXT PAGE DECISION

<action>Increment current_page_index in scenario-info.yaml</action>
<action>Check if more pages remain in scenario</action>

<check if="more_pages_remaining">
  <ask>**Next page: {next_page_name}**

[C] Continue to next page
[P] Pause - Save and continue later

Choice [C/P]:</ask>

  <check if="choice == C">
    <action>Loop back to top of Step 3 with new page</action>
  </check>
  
  <check if="choice == P">
    <output>Progress saved! Resume anytime. 👍</output>
    <action>Exit workflow</action>
  </check>
</check>

<check if="all_pages_complete">
  <action>Proceed to Step 4 (Complete Scenario)</action>
  <action>Load `steps/step-04-complete-scenario.md`</action>
</check>

---

## STATE MANAGEMENT

After each page:

- Update scenario-info.yaml with current_page_index
- Mark page as complete in tracking
- Save progress

---

## NEXT STEP

- If more pages: Loop back to top of Step 3
- If scenario complete: Load `steps/step-04-complete-scenario.md`

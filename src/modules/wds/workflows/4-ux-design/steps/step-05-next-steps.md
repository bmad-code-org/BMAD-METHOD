# Step 5: Next Steps

**Progress: Step 5 of 5** - Workflow Complete!

## YOUR TASK

Guide user to next actions after completing scenario design.

---

## GOAL

Provide clear options for continuing work or exiting.

---

## EXECUTION

<output>**Great design session, {user_name}!** 🎨

Your specifications are saved and ready. What would you like to do next?</output>

---

## MENU

<ask>Choose next action:

1. **Design another scenario** - Continue building your UX
2. **Phase 5: Design System** - Extract and document components (if enabled)
3. **Phase 6: PRD Finalization** - Compile all requirements for development handoff
4. **Review progress** - See all scenarios and completion status
5. **Exit for now** - Save and continue later

Choice [1/2/3/4/5]:</ask>

---

## MENU HANDLING

### Choice 1: Design Another Scenario

<action>Return to Step 2 (Define Scenario)</action>
<action>Load `steps/step-02-setup-scenario-structure.md`</action>

### Choice 2: Phase 5 (Design System)

<output>To start Phase 5, activate Freya (WDS Designer) again and run the Design System workflow.</output>
<action>Exit this workflow</action>

### Choice 3: Phase 6 (PRD Finalization)

<output>To start Phase 6, activate Idunn (WDS PM) and run the PRD Finalization workflow.</output>
<action>Exit this workflow</action>

### Choice 4: Review Progress

<action>List all scenarios in C-Scenarios/</action>
<action>Show completion status for each</action>
<action>Count total pages designed</action>
<action>Show PRD requirement count</action>
<ask>Return to menu? [Y]</ask>
<action>If Y, return to menu in this step</action>

### Choice 5: Exit

<output>Perfect! All your work is saved. Resume anytime by running the UX Design workflow again.

See you next time! 🎨✨</output>
<action>Exit workflow</action>

---

## WORKFLOW COMPLETE

This is the final step. User either loops to another scenario or exits.

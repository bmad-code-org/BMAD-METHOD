# Step 2: Set Up Scenario Structure

**Progress: Step 2 of 5** - Next: Page Design

## YOUR TASK

Route to the appropriate initialization workshop based on project structure.

---

## CRITICAL: READ PROJECT STRUCTURE

<action>
Read `wds-workflow-status.yaml` and extract:
- `project_structure.scenarios` (single | multiple)
- `project_structure.pages` (single | multiple)

Determine project structure type:
- pages == "single" → SEPARATE_PAGES (individual pages/variants)
- scenarios == "single" AND pages == "multiple" → SINGLE_FLOW (one scenario, multiple pages)
- scenarios == "multiple" → MULTIPLE_FLOWS (multiple scenarios)

Store structure_type in memory for this session.
</action>

---

## ROUTING LOGIC

### Separate Pages (No Scenarios)
<check if="structure_type == SEPARATE_PAGES">
  <output>**Project Structure:** Separate pages or variants

You're creating individual pages (like landing pages, dashboards, or page variants). Let's define the first page.</output>
  
  <action>Skip scenario-init (no scenarios needed)</action>
  <action>Load and execute: `step-02-substeps/page-init/step-01-page-context.md`</action>
</check>

### Single User Flow (One Scenario)
<check if="structure_type == SINGLE_FLOW">
  <output>**Project Structure:** Single user flow (multiple pages)

You're creating one continuous user journey across multiple pages. Let's first define the scenario, then the first page.</output>
  
  <action>Load and execute: `step-02-substeps/scenario-init/step-01-core-feature.md`</action>
  <output>(After scenario-init completes, it will automatically route to page-init)</output>
</check>

### Multiple User Flows (Multiple Scenarios)
<check if="structure_type == MULTIPLE_FLOWS">
  <output>**Project Structure:** Multiple user flows (scenarios)

You're creating multiple distinct user journeys, each with their own pages. Let's define the first scenario, then its first page.</output>
  
  <action>Load and execute: `step-02-substeps/scenario-init/step-01-core-feature.md`</action>
  <output>(After scenario-init completes, it will automatically route to page-init)</output>
</check>

---

## CRITICAL RULES

- 🛑 **NEVER** skip the routing logic
- 📖 **ALWAYS** read the full substep file before executing
- 🚫 **NEVER** execute multiple flows
- ⚠️ **ONLY ONE FLOW** executes based on project structure type

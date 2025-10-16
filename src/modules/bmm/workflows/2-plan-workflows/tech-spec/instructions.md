# PRD Workflow - Small Projects (Level 0-1)

<workflow>

<critical>The workflow execution engine is governed by: {project_root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language}</critical>
<critical>This is the SMALL instruction set for Level 0-1 projects - tech-spec with story generation</critical>
<critical>Level 0: tech-spec + single user story | Level 1: tech-spec + epic/stories</critical>
<critical>Project analysis already completed - proceeding directly to technical specification</critical>
<critical>NO PRD generated - uses tech_spec_template + story templates</critical>

<step n="0" goal="Check for workflow status file - REQUIRED">

<action>Check if bmm-workflow-status.md exists in {output_folder}/</action>

<check if="not exists">
  <output>**⚠️ No Workflow Status File Found**

The tech-spec workflow requires an existing workflow status file to understand your project context.

Please run `workflow-status` first to:

- Map out your complete workflow journey
- Determine project type and level
- Create the status file with your planned workflow

**To proceed:**

Run: `bmad analyst workflow-status`

After completing workflow planning, you'll be directed back to this workflow.
</output>
<action>Exit workflow - cannot proceed without status file</action>
</check>

<check if="exists">
  <action>Load status file and proceed to Step 1</action>
</check>

</step>

<step n="1" goal="Confirm project scope and update tracking">

<action>Load bmm-workflow-status.md from {output_folder}/bmm-workflow-status.md</action>
<action>Verify project_level is 0 or 1</action>

<check if="project_level >= 2">
  <error>This workflow is for Level 0-1 only. Level 2-4 should use PRD workflow.</error>
  <output>**Incorrect Workflow for Your Level**

Your status file indicates Level {{project_level}}.

**Correct workflow:** `prd` (run with PM agent)

Run: `bmad pm prd`
</output>
<action>Exit and redirect user to prd workflow</action>
</check>

<check if="project_type == game">
  <error>This workflow is for software projects. Game projects should use GDD workflow.</error>
  <output>**Incorrect Workflow for Game Projects**

**Correct workflow:** `gdd` (run with PM agent)

Run: `bmad pm gdd`
</output>
<action>Exit and redirect user to gdd workflow</action>
</check>

<action>Update Workflow Status Tracker:</action>
<check if="project_level == 0">
<action>Set current_workflow = "tech-spec (Level 0 - generating tech spec)"</action>
</check>
<check if="project_level == 1">
<action>Set current_workflow = "tech-spec (Level 1 - generating tech spec)"</action>
</check>
<action>Set progress_percentage = 20%</action>
<action>Save bmm-workflow-status.md</action>

<check if="project_level == 0">
  <action>Confirm Level 0 - Single atomic change</action>
  <ask>Please describe the specific change/fix you need to implement:</ask>
</check>

<check if="project_level == 1">
  <action>Confirm Level 1 - Coherent feature</action>
  <ask>Please describe the feature you need to implement:</ask>
</check>

</step>

<step n="2" goal="Generate DEFINITIVE tech spec">

<critical>Generate tech-spec.md - this is the TECHNICAL SOURCE OF TRUTH</critical>
<critical>ALL TECHNICAL DECISIONS MUST BE DEFINITIVE - NO AMBIGUITY ALLOWED</critical>

<action>Update progress in bmm-workflow-status.md:</action>
<action>Set progress_percentage = 40%</action>
<action>Save bmm-workflow-status.md</action>

<action>Initialize and write out tech-spec.md using tech_spec_template</action>

<critical>DEFINITIVE DECISIONS REQUIRED:</critical>

**BAD Examples (NEVER DO THIS):**

- "Python 2 or 3" ❌
- "Use a logger like pino or winston" ❌

**GOOD Examples (ALWAYS DO THIS):**

- "Python 3.11" ✅
- "winston v3.8.2 for logging" ✅

**Source Tree Structure**: EXACT file changes needed
<template-output file="tech-spec.md">source_tree</template-output>

**Technical Approach**: SPECIFIC implementation for the change
<template-output file="tech-spec.md">technical_approach</template-output>

**Implementation Stack**: DEFINITIVE tools and versions
<template-output file="tech-spec.md">implementation_stack</template-output>

**Technical Details**: PRECISE change details
<template-output file="tech-spec.md">technical_details</template-output>

**Testing Approach**: How to verify the change
<template-output file="tech-spec.md">testing_approach</template-output>

**Deployment Strategy**: How to deploy the change
<template-output file="tech-spec.md">deployment_strategy</template-output>

<invoke-task halt="true">{project-root}/bmad/core/tasks/adv-elicit.xml</invoke-task>

</step>

<step n="3" goal="Validate cohesion" optional="true">

<action>Offer to run cohesion validation</action>

<ask>Tech-spec complete! Before proceeding to implementation, would you like to validate project cohesion?

**Cohesion Validation** checks:

- Tech spec completeness and definitiveness
- Feature sequencing and dependencies
- External dependencies properly planned
- User/agent responsibilities clear
- Greenfield/brownfield-specific considerations

Run cohesion validation? (y/n)</ask>

<check if="yes">
  <action>Load {installed_path}/checklist.md</action>
  <action>Review tech-spec.md against "Cohesion Validation (All Levels)" section</action>
  <action>Focus on Section A (Tech Spec), Section D (Feature Sequencing)</action>
  <action>Apply Section B (Greenfield) or Section C (Brownfield) based on field_type</action>
  <action>Generate validation report with findings</action>
</check>

</step>

<step n="4" goal="Generate user stories based on project level">

<action>Load bmm-workflow-status.md to determine project_level</action>

<check if="project_level == 0">
  <action>Invoke instructions-level0-story.md to generate single user story</action>
  <action>Story will be saved to user-story.md</action>
  <action>Story links to tech-spec.md for technical implementation details</action>
</check>

<check if="project_level == 1">
  <action>Invoke instructions-level1-stories.md to generate epic and stories</action>
  <action>Epic and stories will be saved to epics.md
  <action>Stories link to tech-spec.md implementation tasks</action>
</check>

</step>

<step n="5" goal="Finalize and determine next steps">

<action>Confirm tech-spec is complete and definitive</action>

<check if="project_level == 0">
  <action>Confirm user-story.md generated successfully</action>
</check>

<check if="project_level == 1">
  <action>Confirm epics.md generated successfully</action>
</check>

## Summary

<check if="project_level == 0">
- **Level 0 Output**: tech-spec.md + user-story.md
- **No PRD required**
- **Direct to implementation with story tracking**
</check>

<check if="project_level == 1">
- **Level 1 Output**: tech-spec.md + epics.md
- **No PRD required**
- **Ready for sprint planning with epic/story breakdown**
</check>

## Next Steps Checklist

<action>Determine appropriate next steps for Level 0 atomic change</action>

**Optional Next Steps:**

<check if="change involves UI components">
  - [ ] **Create simple UX documentation** (if UI change is user-facing)
    - Note: Full instructions-ux workflow may be overkill for Level 0
    - Consider documenting just the specific UI change
</check>

- [ ] **Generate implementation task**
  - Command: `workflow task-generation`
  - Uses: tech-spec.md

<check if="change is backend/API only">

**Recommended Next Steps:**

- [ ] **Create test plan** for the change
  - Unit tests for the specific change
  - Integration test if affects other components

- [ ] **Generate implementation task**
  - Command: `workflow task-generation`
  - Uses: tech-spec.md

<ask>**✅ Tech-Spec Complete, {user_name}!**

Next action:

1. Proceed to implementation
2. Generate development task
3. Create test plan
4. Exit workflow

Select option (1-4):</ask>

</check>

</step>

</workflow>

# PRD Workflow - Small Projects (Level 0-1)

<workflow>

<critical>The workflow execution engine is governed by: {project_root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language} and language MUST be tailored to {user_skill_level}</critical>
<critical>Generate all documents in {document_output_language}</critical>
<critical>This is the SMALL instruction set for Level 0-1 projects - tech-spec with story generation</critical>
<critical>Level 0: tech-spec + single user story | Level 1: tech-spec + epic/stories</critical>
<critical>Project analysis already completed - proceeding directly to technical specification</critical>
<critical>NO PRD generated - uses tech_spec_template + story templates</critical>

<critical>DOCUMENT OUTPUT: Technical, precise, definitive. Specific versions only. User skill level ({user_skill_level}) affects conversation style ONLY, not document content.</critical>

<step n="0" goal="Validate workflow and extract project configuration">

<invoke-workflow path="{project-root}/bmad/bmm/workflows/workflow-status">
  <param>mode: data</param>
  <param>data_request: project_config</param>
</invoke-workflow>

<check if="status_exists == false">
  <output>**⚠️ No Workflow Status File Found**

The tech-spec workflow requires a status file to understand your project context.

Please run `workflow-init` first to:

- Define your project type and level
- Map out your workflow journey
- Create the status file

Run: `workflow-init`

After setup, return here to create your tech spec.
</output>
<action>Exit workflow - cannot proceed without status file</action>
</check>

<check if="status_exists == true">
  <action>Store {{status_file_path}} for later updates</action>

  <check if="project_level >= 2">
    <output>**Incorrect Workflow for Level {{project_level}}**

Tech-spec is for Level 0-1 projects. Level 2-4 should use PRD workflow.

**Correct workflow:** `prd` (PM agent)
</output>
<action>Exit and redirect to prd</action>
</check>

  <check if="project_type == game">
    <output>**Incorrect Workflow for Game Projects**

Game projects should use GDD workflow instead of tech-spec.

**Correct workflow:** `gdd` (PM agent)
</output>
<action>Exit and redirect to gdd</action>
</check>
</check>
</step>

<step n="0.5" goal="Validate workflow sequencing">

<invoke-workflow path="{project-root}/bmad/bmm/workflows/workflow-status">
  <param>mode: validate</param>
  <param>calling_workflow: tech-spec</param>
</invoke-workflow>

<check if="warning != ''">
  <output>{{warning}}</output>
  <ask>Continue with tech-spec anyway? (y/n)</ask>
  <check if="n">
    <output>{{suggestion}}</output>
    <action>Exit workflow</action>
  </check>
</check>
</step>

<step n="1" goal="Confirm project scope and update tracking">

<action>Use {{project_level}} from status data</action>

<action>Update Workflow Status:</action>
<template-output file="{{status_file_path}}">current_workflow</template-output>
<check if="project_level == 0">
<action>Set to: "tech-spec (Level 0 - generating tech spec)"</action>
</check>
<check if="project_level == 1">
<action>Set to: "tech-spec (Level 1 - generating tech spec)"</action>
</check>

<template-output file="{{status_file_path}}">progress_percentage</template-output>
<action>Set to: 20%</action>

<action>Save {{status_file_path}}</action>

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

<action>Update progress:</action>
<template-output file="{{status_file_path}}">progress_percentage</template-output>
<action>Set to: 40%</action>
<action>Save {{status_file_path}}</action>

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

<action>Use {{project_level}} from status data</action>

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

## Next Steps

<invoke-workflow path="{project-root}/bmad/bmm/workflows/workflow-status">
  <param>mode: update</param>
  <param>action: complete_workflow</param>
  <param>workflow_name: tech-spec</param>
</invoke-workflow>

<check if="success == true">
  <output>Status updated!</output>
</check>

<output>**✅ Tech-Spec Complete, {user_name}!**

**Deliverables Created:**
<check if="project_level == 0">

- ✅ tech-spec.md - Technical specification
- ✅ user-story.md - Single user story
  </check>

<check if="project_level == 1">
- ✅ tech-spec.md - Technical specification
- ✅ epics.md - Epic and story breakdown
</check>

**Next Steps:**

- **Next required:** {{next_workflow}} ({{next_agent}} agent)
- **Optional:** Create test plan or document UI changes if applicable

Check status anytime with: `workflow-status`
</output>

</step>

</workflow>

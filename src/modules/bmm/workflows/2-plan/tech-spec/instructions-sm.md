# PRD Workflow - Small Projects (Level 0)

<workflow>

<critical>The workflow execution engine is governed by: {project_root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This is the SMALL instruction set for Level 0 projects - tech-spec only</critical>
<critical>Project analysis already completed - proceeding directly to technical specification</critical>
<critical>NO PRD generated - uses tech_spec_template only</critical>

<step n="1" goal="Confirm project scope">

<action>Load project-workflow-analysis.md</action>
<action>Confirm Level 0 - Single atomic change</action>

<ask>Please describe the specific change/fix you need to implement:</ask>

</step>

<step n="2" goal="Generate DEFINITIVE tech spec">

<critical>Generate tech-spec.md - this is the TECHNICAL SOURCE OF TRUTH</critical>
<critical>ALL TECHNICAL DECISIONS MUST BE DEFINITIVE - NO AMBIGUITY ALLOWED</critical>

<action>Initialize tech-spec.md using tech_spec_template from workflow.yaml</action>

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

<elicit-required/>

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

<step n="4" goal="Finalize and determine next steps">

<action>Confirm tech-spec is complete and definitive</action>
<action>No PRD needed for Level 0</action>
<action>Ready for implementation</action>

## Summary

- **Level 0 Output**: tech-spec.md only
- **No PRD required**
- **Direct to implementation**

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

<ask>Level 0 planning complete! Next action:

1. Proceed to implementation
2. Generate development task
3. Create test plan
4. Exit workflow

Select option (1-4):</ask>

</check>

</step>

</workflow>

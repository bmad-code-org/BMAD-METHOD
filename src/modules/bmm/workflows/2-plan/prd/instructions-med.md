# PRD Workflow - Medium Projects (Level 1-2)

<workflow>

<critical>The workflow execution engine is governed by: {project_root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This is the MEDIUM instruction set for Level 1-2 projects - minimal PRD + solutioning handoff</critical>
<critical>Project analysis already completed - proceeding with focused requirements</critical>
<critical>Uses prd_template for PRD output, epics_template for epics output</critical>
<critical>NO TECH-SPEC - solutioning handled by specialist workflow</critical>
<critical>If users mention technical details, append to technical_preferences with timestamp</critical>

<step n="1" goal="Load context and handle continuation">

<action>Load project-workflow-analysis.md</action>
<action>Confirm Level 1-2 - Feature or small system</action>

<check if="continuation_mode == true">
  <action>Load existing PRD.md and check completion status</action>
  <ask>Found existing work. Would you like to:

1. Review what's done and continue
2. Modify existing sections
3. Start fresh
   </ask>
   <action>If continuing, skip to first incomplete section</action>
   </check>

<check if="new or starting fresh">
  Check `output_folder` for existing docs. Ask user if they have a Product Brief.

<action>Load prd_template from workflow.yaml</action>
<critical>Discuss with them to get the core idea of what they're building</critical>

<template-output>description</template-output>
</check>

</step>

<step n="2" goal="Define deployment intent and goals">

<ask>What is the deployment intent?

- Demo/POC
- MVP for early users
- Production app
  </ask>

<template-output>deployment_intent</template-output>

**Goal Guidelines**:

- Level 1: 1-2 primary goals
- Level 2: 2-3 primary goals

<template-output>goals</template-output>

</step>

<step n="3" goal="Brief context">

**Keep it brief**: 1 paragraph on why this matters now.

<template-output>context</template-output>

</step>

<step n="4" goal="Functional requirements - focused set">

**FR Guidelines**:

- Level 1: 3-8 FRs
- Level 2: 8-15 FRs

**Format**: `FR001: [user capability]`

<template-output>functional_requirements</template-output>
<elicit-required/>

</step>

<step n="5" goal="Non-functional requirements - essentials only">

Focus on critical NFRs only (3-5 max)

<template-output>non_functional_requirements</template-output>

</step>

<step n="6" goal="Simple user journey" if="level >= 2">

- Level 2: 1 simple user journey for primary use case

<template-output>user_journeys</template-output>

</step>

<step n="7" goal="Basic UX principles" optional="true">

3-5 key UX principles if relevant

<template-output>ux_principles</template-output>

</step>

<step n="8" goal="Simple epic structure">

**Epic Guidelines**:

- Level 1: 1 epic with 1-10 stories
- Level 2: 1-2 epics with 5-15 stories total

Create simple epic list with story titles.

<template-output>epics</template-output>

<action>Load epics_template from workflow.yaml</action>

Generate epic-stories.md with basic story structure.

<template-output file="epic-stories.md">epic_stories</template-output>
<elicit-required/>

</step>

<step n="9" goal="Document out of scope" optional="true">

List features/ideas preserved for future phases.

<template-output>out_of_scope</template-output>

</step>

<step n="10" goal="Document assumptions and dependencies" optional="true">

Only document ACTUAL assumptions from discussion.

<template-output>assumptions_and_dependencies</template-output>

</step>

<step n="11" goal="Validate cohesion" optional="true">

<action>Offer to run cohesion validation</action>

<ask>Planning complete! Before proceeding to next steps, would you like to validate project cohesion?

**Cohesion Validation** checks:

- PRD-Tech Spec alignment
- Feature sequencing and dependencies
- Infrastructure setup order (greenfield)
- Integration risks and rollback plans (brownfield)
- External dependencies properly planned
- UI/UX considerations (if applicable)

Run cohesion validation? (y/n)</ask>

<check if="yes">
  <action>Load {installed_path}/checklist.md</action>
  <action>Review all outputs against "Cohesion Validation (All Levels)" section</action>
  <action>Validate PRD sections, then cohesion sections A-H as applicable</action>
  <action>Apply Section B (Greenfield) or Section C (Brownfield) based on field_type</action>
  <action>Include Section E (UI/UX) if UI components exist</action>
  <action>Generate comprehensive validation report with findings</action>

</check>

</step>

<step n="12" goal="Generate solutioning handoff and next steps checklist">

## Next Steps for {{project_name}}

Since this is a Level {{project_level}} project, you need solutioning before implementation.

**Start new chat with solutioning workflow and provide:**

1. This PRD: `{{default_output_file}}`
2. Epic structure: `{{epics_output_file}}`
3. Input documents: {{input_documents}}

**Ask solutioning workflow to:**

- Run `3-solutioning` workflow
- Generate solution-architecture.md
- Create per-epic tech specs

## Complete Next Steps Checklist

<action>Generate comprehensive checklist based on project analysis</action>

### Phase 1: Solution Architecture and Design

- [ ] **Run solutioning workflow** (REQUIRED)
  - Command: `workflow solution-architecture`
  - Input: PRD.md, epic-stories.md
  - Output: solution-architecture.md, tech-spec-epic-N.md files

<check if="project has significant UX/UI components (Level 1-2 with UI)">

- [ ] **Run UX specification workflow** (HIGHLY RECOMMENDED for user-facing systems) - Command: `workflow plan-project` then select "UX specification" - Or continue within this workflow if UI-heavy - Input: PRD.md, epic-stories.md, solution-architecture.md (once available) - Output: ux-specification.md - Optional: AI Frontend Prompt for rapid prototyping - Note: Creates comprehensive UX/UI spec including IA, user flows, components
      </check>

### Phase 2: Detailed Planning

- [ ] **Generate detailed user stories**
  - Command: `workflow generate-stories`
  - Input: epic-stories.md + solution-architecture.md
  - Output: user-stories.md with full acceptance criteria

- [ ] **Create technical design documents**
  - Database schema
  - API specifications
  - Integration points

### Phase 3: Development Preparation

- [ ] **Set up development environment**
  - Repository structure
  - CI/CD pipeline
  - Development tools

- [ ] **Create sprint plan**
  - Story prioritization
  - Sprint boundaries
  - Resource allocation

<ask>Project Planning Complete! Next immediate action:

1. Start solutioning workflow
2. Create UX specification (if UI-heavy project)
3. Generate AI Frontend Prompt (if UX complete)
4. Review all outputs with stakeholders
5. Begin detailed story generation
6. Exit workflow

Which would you like to proceed with?</ask>

<check if="user selects option 2">
  <invoke-workflow>{project-root}/bmad/bmm/workflows/2-plan/ux/workflow.yaml</invoke-workflow>
  <action>Pass mode="integrated" with Level 1-2 context</action>

</check>

<check if="user selects option 3">
  <invoke-task>{project-root}/bmad/bmm/tasks/ai-fe-prompt.md</invoke-task>

</check>

</step>

</workflow>

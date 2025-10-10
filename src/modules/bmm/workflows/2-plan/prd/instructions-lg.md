# PRD Workflow - Large Projects (Level 3-4)

<workflow>

<critical>The workflow execution engine is governed by: {project_root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This is the LARGE instruction set for Level 3-4 projects - full PRD + architect handoff</critical>
<critical>Project analysis already completed - proceeding with comprehensive requirements</critical>
<critical>NO TECH-SPEC - architecture handled by specialist workflow</critical>
<critical>Uses prd_template for PRD output, epics_template for epics output</critical>
<critical>If users mention technical details, append to technical_preferences with timestamp</critical>

<step n="1" goal="Load context and handle continuation">

<action>Load project-workflow-analysis.md</action>
<action>Confirm Level 3-4 - Full product or platform</action>

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
  Check `output_folder` for `product_brief`, `market_research`, and other docs.

<critical>For Level 3-4, Product Brief is STRONGLY recommended</critical>

<action>Load prd_template from workflow.yaml</action>

Get comprehensive description of the project vision.

<template-output>description</template-output>
</check>

</step>

<step n="2" goal="Define deployment intent and strategic goals">

<ask>What is the deployment intent?

- MVP for early users
- Production SaaS/application
- Enterprise system
- Platform/ecosystem
  </ask>

<template-output>deployment_intent</template-output>

**Goal Guidelines**:

- Level 3: 3-5 strategic goals
- Level 4: 5-7 strategic goals

Each goal should be measurable and outcome-focused.

<template-output>goals</template-output>

</step>

<step n="3" goal="Comprehensive context">

1-2 paragraphs on problem, current situation, why now.

<template-output>context</template-output>
<elicit-required/>

</step>

<step n="4" goal="Comprehensive functional requirements">

**FR Guidelines**:

- Level 3: 12-20 FRs
- Level 4: 20-30 FRs

Group related features logically.

<template-output>functional_requirements</template-output>
<elicit-required/>

</step>

<step n="5" goal="Comprehensive non-functional requirements">

Match NFRs to deployment intent (8-12 NFRs)

<template-output>non_functional_requirements</template-output>

</step>

<step n="6" goal="Detailed user journeys">

**Journey Requirements**:

- Level 3: 2-3 detailed journeys
- Level 4: 3-5 comprehensive journeys

Map complete user flows with decision points.

<template-output>user_journeys</template-output>
<elicit-required/>

</step>

<step n="7" goal="Comprehensive UX principles">

8-10 UX principles guiding all interface decisions.

<template-output>ux_principles</template-output>

</step>

<step n="8" goal="Epic structure for phased delivery">

**Epic Guidelines**:

- Level 3: 2-5 epics (12-40 stories)
- Level 4: 5+ epics (40+ stories)

Each epic delivers significant value.

<template-output>epics</template-output>
<elicit-required/>

</step>

<step n="9" goal="Generate detailed epic breakdown in epics.md">

<action>Load epics_template from workflow.yaml</action>

<critical>Create separate epics.md with full story hierarchy</critical>

<template-output file="epics.md">epic_overview</template-output>

<for-each epic="epic_list">

Generate Epic {{epic_number}} with expanded goals, capabilities, success criteria.

Generate all stories with:

- User story format
- Prerequisites
- Acceptance criteria (3-8 per story)
- Technical notes (high-level only)

<template-output file="epics.md">epic\_{{epic_number}}\_details</template-output>
<elicit-required/>

</for-each>

</step>

<step n="10" goal="Document out of scope">

List features/ideas preserved for future phases.

<template-output>out_of_scope</template-output>

</step>

<step n="11" goal="Document assumptions and dependencies">

Only document ACTUAL assumptions from discussion.

<template-output>assumptions_and_dependencies</template-output>

</step>

<step n="12" goal="Generate architect handoff and next steps checklist">

## Next Steps for {{project_name}}

Since this is a Level {{project_level}} project, you need architecture before stories.

**Start new chat with architect and provide:**

1. This PRD: `{{default_output_file}}`
2. Epic structure: `{{epics_output_file}}`
3. Input documents: {{input_documents}}

**Ask architect to:**

- Run `architecture` workflow
- Consider reference architectures
- Generate solution fragments
- Create architecture.md

## Complete Next Steps Checklist

<action>Generate comprehensive checklist based on project analysis</action>

### Phase 1: Architecture and Design

- [ ] **Run architecture workflow** (REQUIRED)
  - Command: `workflow architecture`
  - Input: PRD.md, epics.md
  - Output: architecture.md

<check if="project has significant UX/UI components (Level 3-4 typically does)">

- [ ] **Run UX specification workflow** (HIGHLY RECOMMENDED for user-facing systems) - Command: `workflow plan-project` then select "UX specification" - Or continue within this workflow if UI-heavy - Input: PRD.md, epics.md, architecture.md (once available) - Output: ux-specification.md - Optional: AI Frontend Prompt for rapid prototyping - Note: Creates comprehensive UX/UI spec including IA, user flows, components
      </check>

### Phase 2: Detailed Planning

- [ ] **Generate detailed user stories**
  - Command: `workflow generate-stories`
  - Input: epics.md + architecture.md
  - Output: user-stories.md with full acceptance criteria

- [ ] **Create technical design documents**
  - Database schema
  - API specifications
  - Integration points

- [ ] **Define testing strategy**
  - Unit test approach
  - Integration test plan
  - UAT criteria

### Phase 3: Development Preparation

- [ ] **Set up development environment**
  - Repository structure
  - CI/CD pipeline
  - Development tools

- [ ] **Create sprint plan**
  - Story prioritization
  - Sprint boundaries
  - Resource allocation

- [ ] **Establish monitoring and metrics**
  - Success metrics from PRD
  - Technical monitoring
  - User analytics

<ask>Project Planning Complete! Next immediate action:

1. Start architecture workflow with the architect in a new context window
2. Create UX specification (if UI-heavy project)
3. Generate AI Frontend Prompt (if UX complete)
4. Review all outputs with stakeholders
5. Begin detailed story generation
6. Exit workflow

Which would you like to proceed with?</ask>

<check if="user selects option 2">
  <invoke-workflow>{project-root}/bmad/bmm/workflows/2-plan/ux/workflow.yaml</invoke-workflow>
  <action>Pass mode="integrated" with Level 3-4 context</action>
</check>

<check if="user selects option 3">
  <invoke-task>{project-root}/bmad/bmm/tasks/ai-fe-prompt.md</invoke-task>
</check>

</step>

</workflow>

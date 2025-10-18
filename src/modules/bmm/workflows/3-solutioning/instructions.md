# Solution Architecture Workflow Instructions

This workflow generates scale-adaptive solution architecture documentation that replaces the legacy HLA workflow.

<workflow name="solution-architecture">

<critical>The workflow execution engine is governed by: {project_root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language} and language MUSt be tailored to {user_skill_level}</critical>
<critical>Generate all documents in {document_output_language}</critical>

<critical>DOCUMENT OUTPUT: Concise, technical, LLM-optimized. Use tables/lists over prose. Specific versions only. User skill level ({user_skill_level}) affects conversation style ONLY, not document content.</critical>

<step n="0" goal="Validate workflow and extract project configuration">

<invoke-workflow path="{project-root}/bmad/bmm/workflows/workflow-status">
  <param>mode: data</param>
  <param>data_request: project_config</param>
</invoke-workflow>

<check if="status_exists == false">
  <output>**⚠️ No Workflow Status File Found**

The solution-architecture workflow requires a status file to understand your project context.

Please run `workflow-init` first to:

- Define your project type and level
- Map out your workflow journey
- Create the status file

Run: `workflow-init`

After setup, return here to run solution-architecture.
</output>
<action>Exit workflow - cannot proceed without status file</action>
</check>

<check if="status_exists == true">
  <action>Store {{status_file_path}} for later updates</action>
  <action>Use extracted project configuration:</action>
  - project_level: {{project_level}}
  - field_type: {{field_type}}
  - project_type: {{project_type}}
  - has_user_interface: {{has_user_interface}}
  - ui_complexity: {{ui_complexity}}
  - ux_spec_path: {{ux_spec_path}}
  - prd_status: {{prd_status}}

</check>
</step>

<step n="0.5" goal="Validate workflow sequencing and prerequisites">

<invoke-workflow path="{project-root}/bmad/bmm/workflows/workflow-status">
  <param>mode: validate</param>
  <param>calling_workflow: solution-architecture</param>
</invoke-workflow>

<check if="warning != ''">
  <output>{{warning}}</output>
  <ask>Continue with solution-architecture anyway? (y/n)</ask>
  <check if="n">
    <output>{{suggestion}}</output>
    <action>Exit workflow</action>
  </check>
</check>

<action>Validate Prerequisites (BLOCKING):

Check 1: PRD complete?
IF prd_status != complete:
❌ STOP WORKFLOW
Output: "PRD is required before solution architecture.

             REQUIRED: Complete PRD with FRs, NFRs, epics, and stories.

             Run: workflow plan-project

             After PRD is complete, return here to run solution-architecture workflow."
     END

Check 2: UX Spec complete (if UI project)?
IF has_user_interface == true AND ux_spec_missing:
❌ STOP WORKFLOW
Output: "UX Spec is required before solution architecture for UI projects.

             REQUIRED: Complete UX specification before proceeding.

             Run: workflow ux-spec

             The UX spec will define:
             - Screen/page structure
             - Navigation flows
             - Key user journeys
             - UI/UX patterns and components
             - Responsive requirements
             - Accessibility requirements

             Once complete, the UX spec will inform:
             - Frontend architecture and component structure
             - API design (driven by screen data needs)
             - State management strategy
             - Technology choices (component libraries, animation, etc.)
             - Performance requirements (lazy loading, code splitting)

             After UX spec is complete at /docs/ux-spec.md, return here to run solution-architecture workflow."
     END

Check 3: All prerequisites met?
IF all prerequisites met:
✅ Prerequisites validated - PRD: complete - UX Spec: {{complete | not_applicable}}
Proceeding with solution architecture workflow...

5. Determine workflow path:
   IF project_level == 0: - Skip solution architecture entirely - Output: "Level 0 project - validate/update tech-spec.md only" - STOP WORKFLOW
   ELSE: - Proceed with full solution architecture workflow
   </action>
   <template-output>prerequisites_and_scale_assessment</template-output>
   </step>

<step n="1" goal="Analyze requirements and identify project characteristics">

<action>Load and deeply understand the requirements documents (PRD/GDD) and any UX specifications.</action>

<action>Intelligently determine the true nature of this project by analyzing:

- The primary document type (PRD for software, GDD for games)
- Core functionality and features described
- Technical constraints and requirements mentioned
- User interface complexity and interaction patterns
- Performance and scalability requirements
- Integration needs with external services
  </action>

<action>Extract and synthesize the essential architectural drivers:

- What type of system is being built (web, mobile, game, library, etc.)
- What are the critical quality attributes (performance, security, usability)
- What constraints exist (technical, business, regulatory)
- What integrations are required
- What scale is expected
  </action>

<action>If UX specifications exist, understand the user experience requirements and how they drive technical architecture:

- Screen/page inventory and complexity
- Navigation patterns and user flows
- Real-time vs. static interactions
- Accessibility and responsive design needs
- Performance expectations from a user perspective
  </action>

<action>Identify gaps between requirements and technical specifications:

- What architectural decisions are already made vs. what needs determination
- Misalignments between UX designs and functional requirements
- Missing enabler requirements that will be needed for implementation
  </action>

<template-output>requirements_analysis</template-output>
</step>
</step>

<step n="2" goal="Understand user context and preferences">

<action>Engage with the user to understand their technical context and preferences:

- Note: User skill level is {user_skill_level} (from config)
- Learn about any existing technical decisions or constraints
- Understand team capabilities and preferences
- Identify any existing infrastructure or systems to integrate with
  </action>

<action>Based on {user_skill_level}, adapt YOUR CONVERSATIONAL STYLE:

<check if="{user_skill_level} == 'beginner'">
  - Explain architectural concepts as you discuss them
  - Be patient and educational in your responses
  - Clarify technical terms when introducing them
</check>

<check if="{user_skill_level} == 'intermediate'">
  - Balance explanations with efficiency
  - Assume familiarity with common concepts
  - Explain only complex or unusual patterns
</check>

<check if="{user_skill_level} == 'expert'">
  - Be direct and technical in discussions
  - Skip basic explanations
  - Focus on advanced considerations and edge cases
</check>

NOTE: This affects only how you TALK to the user, NOT the documents you generate.
The architecture document itself should always be concise and technical.
</action>

<template-output>user_context</template-output>
</step>

<step n="3" goal="Determine overall architecture approach">

<action>Based on the requirements analysis, determine the most appropriate architectural patterns:

- Consider the scale, complexity, and team size to choose between monolith, microservices, or serverless
- Evaluate whether a single repository or multiple repositories best serves the project needs
- Think about deployment and operational complexity vs. development simplicity
  </action>

<action>Guide the user through architectural pattern selection by discussing trade-offs and implications rather than presenting a menu of options. Help them understand what makes sense for their specific context.</action>

<template-output>architecture_patterns</template-output>
</step>

<step n="4" goal="Design component boundaries and structure">

<action>Analyze the epics and requirements to identify natural boundaries for components or services:

- Group related functionality that changes together
- Identify shared infrastructure needs (authentication, logging, monitoring)
- Consider data ownership and consistency boundaries
- Think about team structure and ownership
  </action>

<action>Map epics to architectural components, ensuring each epic has a clear home and the overall structure supports the planned functionality.</action>

<template-output>component_structure</template-output>
</step>

<step n="5" goal="Make project-specific technical decisions">

<critical>Use intent-based decision making, not prescriptive checklists.</critical>

<action>Based on requirements analysis, identify the project domain(s).
Note: Projects can be hybrid (e.g., web + mobile, game + backend service).

Use the simplified project types mapping:
{{installed_path}}/project-types/project-types.csv

This contains ~11 core project types that cover 99% of software projects.</action>

<action>For identified domains, reference the intent-based instructions:
{{installed_path}}/project-types/{{type}}-instructions.md

These are guidance files, not prescriptive checklists.</action>

<action>IMPORTANT: Instructions are guidance, not checklists.

- Use your knowledge to identify what matters for THIS project
- Consider emerging technologies not in any list
- Address unique requirements from the PRD/GDD
- Focus on decisions that affect implementation consistency
  </action>

<action>Engage with the user to make all necessary technical decisions:

- Use the question files to ensure coverage of common areas
- Go beyond the standard questions to address project-specific needs
- Focus on decisions that will affect implementation consistency
- Get specific versions for all technology choices
- Document clear rationale for non-obvious decisions
  </action>

<action>Remember: The goal is to make enough definitive decisions that future implementation agents can work autonomously without architectural ambiguity.</action>

<template-output>technical_decisions</template-output>
</step>

<step n="6" goal="Generate concise solution architecture document">

<action>Select the appropriate adaptive template:
{{installed_path}}/project-types/{{type}}-template.md</action>

<action>Template selection follows the naming convention:

- Web project → web-template.md
- Mobile app → mobile-template.md
- Game project → game-template.md (adapts heavily based on game type)
- Backend service → backend-template.md
- Data pipeline → data-template.md
- CLI tool → cli-template.md
- Library/SDK → library-template.md
- Desktop app → desktop-template.md
- Embedded system → embedded-template.md
- Extension → extension-template.md
- Infrastructure → infrastructure-template.md

For hybrid projects, choose the primary domain or intelligently merge relevant sections from multiple templates.</action>

<action>Adapt the template heavily based on actual requirements.
Templates are starting points, not rigid structures.</action>

<action>Generate a comprehensive yet concise architecture document that includes:

MANDATORY SECTIONS (all projects):

1. Executive Summary (1-2 paragraphs max)
2. Technology Decisions Table - SPECIFIC versions for everything
3. Repository Structure and Source Tree
4. Component Architecture
5. Data Architecture (if applicable)
6. API/Interface Contracts (if applicable)
7. Key Architecture Decision Records

The document MUST be optimized for LLM consumption:

- Use tables over prose wherever possible
- List specific versions, not generic technology names
- Include complete source tree structure
- Define clear interfaces and contracts
- NO verbose explanations (even for beginners - they get help in conversation, not docs)
- Technical and concise throughout
  </action>

<action>Ensure the document provides enough technical specificity that implementation agents can:

- Set up the development environment correctly
- Implement features consistently with the architecture
- Make minor technical decisions within the established framework
- Understand component boundaries and responsibilities
  </action>

<template-output>solution_architecture</template-output>
</step>

<step n="7" goal="Validate architecture completeness and clarity">

<critical>Quality gate to ensure the architecture is ready for implementation.</critical>

<action>Perform a comprehensive validation of the architecture document:

- Verify every requirement has a technical solution
- Ensure all technology choices have specific versions
- Check that the document is free of ambiguous language
- Validate that each epic can be implemented with the defined architecture
- Confirm the source tree structure is complete and logical
  </action>

<action>Generate an Epic Alignment Matrix showing how each epic maps to:

- Architectural components
- Data models
- APIs and interfaces
- External integrations
  This matrix helps validate coverage and identify gaps.</action>

<action>If issues are found, work with the user to resolve them before proceeding. The architecture must be definitive enough for autonomous implementation.</action>

<template-output>cohesion_validation</template-output>
</step>

<step n="7.5" goal="Address specialist concerns" optional="true">

<action>Assess the complexity of specialist areas (DevOps, Security, Testing) based on the project requirements:

- For simple deployments and standard security, include brief inline guidance
- For complex requirements (compliance, multi-region, extensive testing), create placeholders for specialist workflows
  </action>

<action>Engage with the user to understand their needs in these specialist areas and determine whether to address them now or defer to specialist agents.</action>

<template-output>specialist_guidance</template-output>
</step>

<step n="8" goal="Refine requirements based on architecture" optional="true">

<action>If the architecture design revealed gaps or needed clarifications in the requirements:

- Identify missing enabler epics (e.g., infrastructure setup, monitoring)
- Clarify ambiguous stories based on technical decisions
- Add any newly discovered non-functional requirements
  </action>

<action>Work with the user to update the PRD if necessary, ensuring alignment between requirements and architecture.</action>
</step>

<step n="9" goal="Generate epic-specific technical specifications">

<action>For each epic, create a focused technical specification that extracts only the relevant parts of the architecture:

- Technologies specific to that epic
- Component details for that epic's functionality
- Data models and APIs used by that epic
- Implementation guidance specific to the epic's stories
  </action>

<action>These epic-specific specs provide focused context for implementation without overwhelming detail.</action>

<template-output>epic_tech_specs</template-output>
</step>

<step n="10" goal="Handle polyrepo documentation" optional="true">

<action>If this is a polyrepo project, ensure each repository has access to the complete architectural context:

- Copy the full architecture documentation to each repository
- This ensures every repo has the complete picture for autonomous development
  </action>
  </step>

<step n="11" goal="Finalize architecture and prepare for implementation">

<action>Validate that the architecture package is complete:

- Solution architecture document with all technical decisions
- Epic-specific technical specifications
- Cohesion validation report
- Clear source tree structure
- Definitive technology choices with versions
  </action>

<action>Prepare the story backlog from the PRD/epics for Phase 4 implementation.</action>

<template-output>completion_summary</template-output>
</step>

<step n="12" goal="Update status and complete">

<invoke-workflow path="{project-root}/bmad/bmm/workflows/workflow-status">
  <param>mode: update</param>
  <param>action: complete_workflow</param>
  <param>workflow_name: solution-architecture</param>
  <param>populate_stories_from: {epics_file}</param>
</invoke-workflow>

<check if="success == true">
  <output>✅ Status updated! Loaded {{total_stories}} stories from epics.</output>
  <output>Next: {{next_workflow}} ({{next_agent}} agent)</output>
  <output>Phase 3 complete!</output>
</check>

<check if="success == false">
  <output>⚠️ Status update failed: {{error}}</output>
</check>

<output>**✅ Solution Architecture Complete, {user_name}!**

**Architecture Documents:**

- bmm-solution-architecture.md (main architecture document)
- bmm-cohesion-check-report.md (validation report)
- bmm-tech-spec-epic-1.md through bmm-tech-spec-epic-{{epic_count}}.md ({{epic_count}} specs)

**Story Backlog:**

- {{total_story_count}} stories populated in status file
- First story: {{first_story_id}} ready for drafting

**Status Updated:**

- Phase 3 (Solutioning) complete ✓
- Progress: {{new_progress_percentage}}%
- Ready for Phase 4 (Implementation)

**Next Steps:**

1. Load SM agent to draft story {{first_story_id}}
2. Run `create-story` workflow
3. Review drafted story
4. Run `story-ready` to approve for development

Check status anytime with: `workflow-status`
</output>
</step>

</workflow>

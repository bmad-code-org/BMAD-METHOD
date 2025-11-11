# Epic and Story Decomposition - Intent-Based Implementation Planning

<critical>The workflow execution engine is governed by: {project-root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This workflow transforms requirements into BITE-SIZED STORIES for development agents</critical>
<critical>EVERY story must be completable by a single dev agent in one focused session</critical>
<critical>Communicate all responses in {communication_language} and adapt to {user_skill_level}</critical>
<critical>Generate all documents in {document_output_language}</critical>
<critical>LIVING DOCUMENT: Write to epics.md continuously as you work - never wait until the end</critical>
<critical>Input documents specified in workflow.yaml input_file_patterns - workflow engine handles fuzzy matching, whole vs sharded document discovery automatically</critical>

<workflow>

<step n="1" goal="Load PRD and extract requirements">
<action>Welcome {user_name} to epic and story planning

Load required documents (fuzzy match, handle both whole and sharded):

- PRD.md (required)
- domain-brief.md (if exists)
- product-brief.md (if exists)

Extract from PRD:

- All functional requirements
- Non-functional requirements
- Domain considerations and compliance needs
- Project type and complexity
- MVP vs growth vs vision scope boundaries

Understand the context:

- What makes this product special (the magic)
- Technical constraints
- User types and their goals
- Success criteria</action>
  </step>

<step n="2" goal="Propose epic structure from natural groupings">
<action>Analyze requirements and identify natural epic boundaries

INTENT: Find organic groupings that make sense for THIS product

Look for natural patterns:

- Features that work together cohesively
- User journeys that connect
- Business capabilities that cluster
- Domain requirements that relate (compliance, validation, security)
- Technical systems that should be built together

Name epics based on VALUE, not technical layers:

- Good: "User Onboarding", "Content Discovery", "Compliance Framework"
- Avoid: "Database Layer", "API Endpoints", "Frontend"

Each epic should:

- Have clear business goal and user value
- Be independently valuable
- Contain 3-8 related capabilities
- Be deliverable in cohesive phase

For greenfield projects:

- First epic MUST establish foundation (project setup, core infrastructure, deployment pipeline)
- Foundation enables all subsequent work

For complex domains:

- Consider dedicated compliance/regulatory epics
- Group validation and safety requirements logically
- Note expertise requirements

Present proposed epic structure showing:

- Epic titles with clear value statements
- High-level scope of each epic
- Suggested sequencing
- Why this grouping makes sense</action>

<template-output>epics_summary</template-output>
<invoke-task halt="true">{project-root}/.bmad/core/tasks/adv-elicit.xml</invoke-task>
</step>

<step n="3" goal="Decompose each epic into bite-sized stories" repeat="for-each-epic">
<action>Break down Epic {{N}} into small, implementable stories

INTENT: Create stories sized for single dev agent completion

For each epic, generate:

- Epic title as `epic_title_{{N}}`
- Epic goal/value as `epic_goal_{{N}}`
- All stories as repeated pattern `story_title_{{N}}_{{M}}` for each story M

CRITICAL for Epic 1 (Foundation):

- Story 1.1 MUST be project setup/infrastructure initialization
- Sets up: repo structure, build system, deployment pipeline basics, core dependencies
- Creates foundation for all subsequent stories
- Note: Architecture workflow will flesh out technical details

Each story should follow BDD-style acceptance criteria:

**Story Pattern:**
As a [user type],
I want [specific capability],
So that [clear value/benefit].

**Acceptance Criteria using BDD:**
Given [precondition or initial state]
When [action or trigger]
Then [expected outcome]

And [additional criteria as needed]

**Prerequisites:** Only previous stories (never forward dependencies)

**Technical Notes:** Implementation guidance, affected components, compliance requirements

Ensure stories are:

- Vertically sliced (deliver complete functionality, not just one layer)
- Sequentially ordered (logical progression, no forward dependencies)
- Independently valuable when possible
- Small enough for single-session completion
- Clear enough for autonomous implementation

For each story in epic {{N}}, output variables following this pattern:

- story*title*{{N}}_1, story_title_{{N}}\_2, etc.
- Each containing: user story, BDD acceptance criteria, prerequisites, technical notes</action>

<template-output>epic*title*{{N}}</template-output>
<template-output>epic*goal*{{N}}</template-output>

<action>For each story M in epic {{N}}, generate story content</action>
<template-output>story*title*{{N}}\_{{M}}</template-output>

<invoke-task halt="true">{project-root}/.bmad/core/tasks/adv-elicit.xml</invoke-task>
</step>

<step n="4" goal="Review and finalize epic breakdown">
<action>Review the complete epic breakdown for quality and completeness

Validate:

- All functional requirements from PRD are covered by stories
- Epic 1 establishes proper foundation
- All stories are vertically sliced
- No forward dependencies exist
- Story sizing is appropriate for single-session completion
- BDD acceptance criteria are clear and testable
- Domain/compliance requirements are properly distributed
- Sequencing enables incremental value delivery

Confirm with {user_name}:

- Epic structure makes sense
- Story breakdown is actionable
- Dependencies are clear
- BDD format provides clarity
- Ready for architecture and implementation phases</action>

<template-output>epic_breakdown_summary</template-output>
</step>

</workflow>

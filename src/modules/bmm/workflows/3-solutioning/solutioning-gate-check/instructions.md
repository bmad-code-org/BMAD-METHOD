# Implementation Ready Check - Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/bmad/bmm/workflows/3-solutioning/solutioning-gate-check/workflow.yaml</critical>
<critical>Communicate all findings and analysis in {communication_language} throughout the assessment</critical>

<workflow>

<step n="0" goal="Initialize and understand project context">
<invoke-workflow path="{workflow_status_workflow}">
  <param>mode: data</param>
  <param>data_request: project_config</param>
</invoke-workflow>

<check if="status_exists == false">
  <output>**⚠️ No Workflow Status File Found**

The Implementation Ready Check requires a status file to understand your project context.

Please run `workflow-init` first to establish your project configuration.

After setup, return here to validate implementation readiness.
</output>
<action>Exit workflow - cannot proceed without status file</action>
</check>

<check if="status_exists == true">
  <action>Store {{status_file_path}} for later updates</action>
  <action>Store {{project_level}}, {{active_path}}, and {{workflow_phase}} for validation context</action>

<action>Based on the project_level, understand what artifacts should exist:

- Level 0-1: Tech spec and simple stories only (no PRD, minimal solutioning)
- Level 2: PRD, tech spec, epics/stories (no separate architecture doc)
- Level 3-4: Full suite - PRD, architecture document, epics/stories, possible UX artifacts
  </action>

<critical>The validation approach must adapt to the project level - don't look for documents that shouldn't exist at lower levels</critical>
</check>

<template-output>project_context</template-output>
</step>

<step n="1" goal="Discover and inventory project artifacts">
<action>Search the {output_folder} for relevant planning and solutioning documents based on project level identified in Step 0</action>

<action>For Level 0-1 projects, locate:

- Technical specification document(s)
- Story/task lists or simple epic breakdowns
- Any API or interface definitions
  </action>

<action>For Level 2-4 projects, locate:

- Product Requirements Document (PRD)
- Architecture document (architecture.md) (Level 3-4 only)
- Technical Specification (Level 2 includes architecture within)
- Epic and story breakdowns
- UX artifacts if the active path includes UX workflow
- Any supplementary planning documents
  </action>

<action>Create an inventory of found documents with:

- Document type and purpose
- File path and last modified date
- Brief description of what each contains
- Any missing expected documents flagged as potential issues
  </action>

<template-output>document_inventory</template-output>
</step>

<step n="2" goal="Deep analysis of core planning documents">
<action>Load and thoroughly analyze each discovered document to extract:
- Core requirements and success criteria
- Architectural decisions and constraints
- Technical implementation approaches
- User stories and acceptance criteria
- Dependencies and sequencing requirements
- Any assumptions or risks documented
</action>

<action>For PRD analysis (Level 2-4), focus on:

- User requirements and use cases
- Functional and non-functional requirements
- Success metrics and acceptance criteria
- Scope boundaries and explicitly excluded items
- Priority levels for different features
  </action>

<action>For Architecture/Tech Spec analysis, focus on:

- System design decisions and rationale
- Technology stack and framework choices
- Integration points and APIs
- Data models and storage decisions
- Security and performance considerations
- Any architectural constraints that might affect story implementation
  </action>

<action>For Epic/Story analysis, focus on:

- Coverage of PRD requirements
- Story sequencing and dependencies
- Acceptance criteria completeness
- Technical tasks within stories
- Estimated complexity and effort indicators
  </action>

<template-output>document_analysis</template-output>
</step>

<step n="3" goal="Cross-reference validation and alignment check">
<action>Systematically validate alignment between all artifacts, adapting validation based on project level</action>

<action>PRD ↔ Architecture Alignment (Level 3-4):

- Verify every PRD requirement has corresponding architectural support
- Check that architectural decisions don't contradict PRD constraints
- Identify any architectural additions beyond PRD scope (potential gold-plating)
- Ensure non-functional requirements from PRD are addressed in architecture document
- If using new architecture workflow: verify implementation patterns are defined
  </action>

<action>PRD ↔ Stories Coverage (Level 2-4):

- Map each PRD requirement to implementing stories
- Identify any PRD requirements without story coverage
- Find stories that don't trace back to PRD requirements
- Validate that story acceptance criteria align with PRD success criteria
  </action>

<action>Architecture ↔ Stories Implementation Check:

- Verify architectural decisions are reflected in relevant stories
- Check that story technical tasks align with architectural approach
- Identify any stories that might violate architectural constraints
- Ensure infrastructure and setup stories exist for architectural components
  </action>

<action>For Level 0-1 projects (Tech Spec only):

- Validate internal consistency within tech spec
- Check that all specified features have corresponding stories
- Verify story sequencing matches technical dependencies
  </action>

<template-output>alignment_validation</template-output>
</step>

<step n="4" goal="Gap and risk analysis">
<action>Identify and categorize all gaps, risks, and potential issues discovered during validation</action>

<action>Check for Critical Gaps:

- Missing stories for core requirements
- Unaddressed architectural concerns
- Absent infrastructure or setup stories for greenfield projects
- Missing error handling or edge case coverage
- Security or compliance requirements not addressed
  </action>

<action>Identify Sequencing Issues:

- Dependencies not properly ordered
- Stories that assume components not yet built
- Parallel work that should be sequential
- Missing prerequisite technical tasks
  </action>

<action>Detect Potential Contradictions:

- Conflicts between PRD and architecture approaches
- Stories with conflicting technical approaches
- Acceptance criteria that contradict requirements
- Resource or technology conflicts
  </action>

<action>Find Gold-Plating and Scope Creep:

- Features in architecture not required by PRD
- Stories implementing beyond requirements
- Technical complexity beyond project needs
- Over-engineering indicators
  </action>

<template-output>gap_risk_analysis</template-output>
</step>

<step n="5" goal="UX and special concerns validation" optional="true">
<check if="UX artifacts exist or UX workflow in active path">
<action>Review UX artifacts and validate integration:
- Check that UX requirements are reflected in PRD
- Verify stories include UX implementation tasks
- Ensure architecture supports UX requirements (performance, responsiveness)
- Identify any UX concerns not addressed in stories
</action>

<action>Validate accessibility and usability coverage:

- Check for accessibility requirement coverage in stories
- Verify responsive design considerations if applicable
- Ensure user flow completeness across stories
  </action>
  </check>

<template-output>ux_validation</template-output>
</step>

<step n="6" goal="Generate comprehensive readiness assessment">
<action>Compile all findings into a structured readiness report with:
- Executive summary of readiness status
- Project context and validation scope
- Document inventory and coverage assessment
- Detailed findings organized by severity (Critical, High, Medium, Low)
- Specific recommendations for each issue
- Overall readiness recommendation (Ready, Ready with Conditions, Not Ready)
</action>

<action>Provide actionable next steps:

- List any critical issues that must be resolved
- Suggest specific document updates needed
- Recommend additional stories or tasks required
- Propose sequencing adjustments if needed
  </action>

<action>Include positive findings:

- Highlight well-aligned areas
- Note particularly thorough documentation
- Recognize good architectural decisions
- Commend comprehensive story coverage where found
  </action>

<template-output>readiness_assessment</template-output>
</step>

<step n="7" goal="Workflow status update offer" optional="true">
<ask>The readiness assessment is complete. Would you like to update the workflow status to proceed to the next phase? [yes/no]

Note: This will advance the project workflow to the next phase in your current path.</ask>

<action if="user_response == 'yes'">
Determine the next workflow phase based on current status:
- If Level 0-1: Advance to implementation phase
- If Level 2-4 in solutioning: Advance to Phase 4 (Implementation)
- Update the workflow status configuration accordingly
- Confirm the update with the user
</action>

<action if="user_response == 'no'">
Acknowledge that the workflow status remains unchanged.
Remind user they can manually update when ready.
</action>

<template-output>status_update_result</template-output>
</step>

</workflow>

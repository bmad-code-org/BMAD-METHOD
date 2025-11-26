# Implementation Readiness - Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/{bmad_folder}/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/{bmad_folder}/bmm/workflows/3-solutioning/implementation-readiness/workflow.yaml</critical>
<critical>Communicate all findings and analysis in {communication_language} throughout the assessment</critical>
<critical>Input documents specified in workflow.yaml input_file_patterns - workflow engine handles fuzzy matching, whole vs sharded document discovery automatically</critical>
<critical>⚠️ ABSOLUTELY NO TIME ESTIMATES - NEVER mention hours, days, weeks, months, or ANY time-based predictions. AI has fundamentally changed development speed - what once took teams weeks/months can now be done by one person in hours. DO NOT give ANY time estimates whatsoever.</critical>
<critical>⚠️ CHECKPOINT PROTOCOL: After EVERY <template-output> tag, you MUST follow workflow.xml substep 2c: SAVE content to file immediately → SHOW checkpoint separator (━━━━━━━━━━━━━━━━━━━━━━━) → DISPLAY generated content → PRESENT options [a]Advanced Elicitation/[c]Continue/[p]Party-Mode/[y]YOLO → WAIT for user response. Never batch saves or skip checkpoints.</critical>

<workflow>

<step n="0" goal="Validate workflow readiness" tag="workflow-status">
<action>Check if {workflow_status_file} exists</action>

<check if="status file not found">
  <output>No workflow status file found. Implementation Readiness check can run standalone or as part of BMM workflow path.</output>
  <output>**Recommended:** Run `workflow-init` first for project context tracking and workflow sequencing.</output>
  <ask>Continue in standalone mode or exit to run workflow-init? (continue/exit)</ask>
  <check if="continue">
    <action>Set standalone_mode = true</action>
  </check>
  <check if="exit">
    <action>Exit workflow</action>
  </check>
</check>

<check if="status file found">
  <action>Load the FULL file:  {workflow_status_file}</action>
  <action>Parse workflow_status section</action>
  <action>Check status of "implementation-readiness" workflow</action>
  <action>Get {selected_track} (quick-flow, bmad-method, or enterprise-bmad-method)</action>
  <action>Find first non-completed workflow (next expected workflow)</action>

<action>Based on the selected_track, understand what artifacts should exist: - quick-flow: Tech spec and simple stories in an epic only (no PRD, minimal solutioning) - bmad-method and enterprise-bmad-method: PRD, UX design, epics/stories, architecture</action>

  <check if="implementation-readiness status is file path (already completed)">
    <output>⚠️ Implementation readiness check already completed: {{implementation-readiness status}}</output>
    <ask>Re-running will create a new validation report. Continue? (y/n)</ask>
    <check if="n">
      <output>Exiting. Use workflow-status to see your next step.</output>
      <action>Exit workflow</action>
    </check>
  </check>

  <check if="implementation-readiness is not the next expected workflow">
    <output>⚠️ Next expected workflow: {{next_workflow}}. Implementation readiness check is out of sequence.</output>
    <ask>Continue with readiness check anyway? (y/n)</ask>
    <check if="n">
      <output>Exiting. Run {{next_workflow}} instead.</output>
      <action>Exit workflow</action>
    </check>
  </check>

<action>Set standalone_mode = false</action>
</check>

<template-output>project_context</template-output>
</step>

<step n="0.5" goal="Discover and load input documents">
<invoke-protocol name="discover_inputs" />
<note>After discovery, these content variables are available: {prd_content}, {epics_content}, {architecture_content}, {ux_design_content}, {tech_spec_content}, {document_project_content}</note>
</step>

<step n="1" goal="Inventory loaded project artifacts">
<action>Review the content loaded by Step 0.5 and create an inventory</action>

<action>Inventory of available documents:

- PRD: {prd_content} (loaded if available)
- Architecture: {architecture_content} (loaded if available)
- Epics: {epics_content} (loaded if available)
- UX Design: {ux_design_content} (loaded if available)
- Tech Spec: {tech_spec_content} (loaded if available, Quick Flow track)
- Brownfield docs: {document_project_content} (loaded via INDEX_GUIDED if available)
  </action>

<action>For each loaded document, extract:

- Document type and purpose
- Brief description of what it contains
- Flag any expected documents that are missing as potential issues
  </action>

<template-output>document_inventory</template-output>
</step>

<step n="2" goal="Deep analysis of core planning documents">
<action>Thoroughly analyze each loaded document to extract:
  - Core requirements and success criteria
  - Architectural decisions and constraints
  - Technical implementation approaches
  - User stories and acceptance criteria
  - Dependencies and sequencing requirements
  - Any assumptions or risks documented
</action>

<action>For PRD analysis, focus on:

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

<action>PRD ↔ Architecture Alignment:

- Verify every PRD requirement has corresponding architectural support
- Check that architectural decisions don't contradict PRD constraints
- Identify any architectural additions beyond PRD scope (potential gold-plating)
- Ensure non-functional requirements from PRD are addressed in architecture document
- If using new architecture workflow: verify implementation patterns are defined
  </action>

<action>PRD ↔ Stories Coverage:

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

<action>Check Testability Review (if test-design exists in Phase 3):

**Note:** test-design is recommended for BMad Method, required for Enterprise Method

- Check if {output_folder}/test-design-system.md exists
- If exists: Review testability assessment (Controllability, Observability, Reliability)
- If testability concerns documented: Flag for gate decision
- If missing AND track is Enterprise: Flag as CRITICAL gap
- If missing AND track is Method: Note as recommendation (not blocker)
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

<step n="7" goal="Update status and complete" tag="workflow-status">
<check if="standalone_mode != true">
  <action>Load the FULL file: {workflow_status_file}</action>
  <action>Find workflow_status key "implementation-readiness"</action>
  <critical>ONLY write the file path as the status value - no other text, notes, or metadata</critical>
  <action>Update workflow_status["implementation-readiness"] = "{output_folder}/implementation-readiness-report-{{date}}.md"</action>
  <action>Save file, preserving ALL comments and structure including STATUS DEFINITIONS</action>

<action>Find first non-completed workflow in workflow_status (next workflow to do)</action>
<action>Determine next agent from path file based on next workflow</action>
</check>

<action>Determine overall readiness status from the readiness_assessment (Ready, Ready with Conditions, or Not Ready)</action>

<output>**✅ Implementation Readiness Check Complete!**

**Assessment Report:**

- Readiness assessment saved to: {output_folder}/implementation-readiness-report-{{date}}.md

{{#if standalone_mode != true}}
**Status Updated:**

- Progress tracking updated: implementation-readiness marked complete
- Next workflow: {{next_workflow}}
  {{else}}
  **Note:** Running in standalone mode (no progress tracking)
  {{/if}}

**Next Steps:**

{{#if standalone_mode != true}}

- **Next workflow:** {{next_workflow}} ({{next_agent}} agent)
- Review the assessment report and address any critical issues before proceeding

Check status anytime with: `workflow-status`
{{else}}
Since no workflow is in progress:

- Refer to the BMM workflow guide if unsure what to do next
- Or run `workflow-init` to create a workflow path and get guided next steps
  {{/if}}
  </output>

<check if="overall readiness status is Ready OR Ready with Conditions">
  <output>**🚀 Ready for Implementation!**

Your project artifacts are aligned and complete. You can now proceed to Phase 4: Implementation.
</output>

<ask>Would you like to run the **sprint-planning** workflow to initialize your sprint tracking and prepare for development? (yes/no)</ask>

  <check if="yes">
    <action>Inform user that sprint-planning workflow will be invoked</action>
    <invoke-workflow path="{project-root}/{bmad_folder}/bmm/workflows/4-implementation/sprint-planning/workflow.yaml" />
  </check>
  <check if="no">
    <output>You can run sprint-planning later when ready: `sprint-planning`</output>
  </check>
</check>

<check if="overall readiness status is Not Ready">
  <output>**⚠️ Not Ready for Implementation**

Critical issues must be resolved before proceeding. Review the assessment report and address the identified gaps.

Once issues are resolved, re-run implementation-readiness to validate again.
</output>
</check>

<template-output>status_update_result</template-output>
</step>

</workflow>

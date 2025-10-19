# Brainstorm Project - Workflow Instructions

```xml
<critical>The workflow execution engine is governed by: {project_root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language}</critical>
<critical>This is a meta-workflow that orchestrates the CIS brainstorming workflow with project-specific context</critical>

<workflow>

  <step n="1" goal="Validate workflow readiness">
    <invoke-workflow path="{project-root}/bmad/bmm/workflows/workflow-status">
      <param>mode: validate</param>
      <param>calling_workflow: brainstorm-project</param>
    </invoke-workflow>

    <check if="status_exists == false">
      <output>{{suggestion}}</output>
      <output>Note: Brainstorming is optional. Continuing without progress tracking.</output>
      <action>Set standalone_mode = true</action>
    </check>

    <check if="status_exists == true">
      <action>Store {{status_file_path}} for later updates</action>

      <check if="warning != ''">
        <output>{{warning}}</output>
        <output>Note: Brainstorming can be valuable at any project stage.</output>
      </check>
    </check>
  </step>

  <step n="2" goal="Load project brainstorming context">
    <action>Read the project context document from: {project_context}</action>
    <action>This context provides project-specific guidance including:
      - Focus areas for project ideation
      - Key considerations for software/product projects
      - Recommended techniques for project brainstorming
      - Output structure guidance
    </action>
  </step>

  <step n="3" goal="Invoke core brainstorming with project context">
    <action>Execute the CIS brainstorming workflow with project context</action>
    <invoke-workflow path="{core_brainstorming}" data="{project_context}">
      The CIS brainstorming workflow will:
      - Present interactive brainstorming techniques menu
      - Guide the user through selected ideation methods
      - Generate and capture brainstorming session results
      - Save output to: {output_folder}/brainstorming-session-results-{{date}}.md
    </invoke-workflow>
  </step>

  <step n="4" goal="Update status and complete">
    <check if="standalone_mode != true">
      <invoke-workflow path="{project-root}/bmad/bmm/workflows/workflow-status">
        <param>mode: update</param>
        <param>action: complete_workflow</param>
        <param>workflow_name: brainstorm-project</param>
      </invoke-workflow>

      <check if="success == true">
        <output>Status updated! Next: {{next_workflow}}</output>
      </check>
    </check>

    <output>**✅ Brainstorming Session Complete, {user_name}!**

**Session Results:**
- Brainstorming results saved to: {output_folder}/bmm-brainstorming-session-{{date}}.md

{{#if standalone_mode != true}}
**Status Updated:**
- Progress tracking updated
{{/if}}

**Next Steps:**
1. Review brainstorming results
2. Consider running:
   - `research` workflow for market/technical research
   - `product-brief` workflow to formalize product vision
   - Or proceed directly to `plan-project` if ready

{{#if standalone_mode != true}}
Check status anytime with: `workflow-status`
{{/if}}
    </output>
  </step>

</workflow>
```

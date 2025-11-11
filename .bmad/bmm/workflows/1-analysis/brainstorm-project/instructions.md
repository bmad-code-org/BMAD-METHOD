# Brainstorm Project - Workflow Instructions

```xml
<critical>The workflow execution engine is governed by: {project_root}/.bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language}</critical>
<critical>This is a meta-workflow that orchestrates the CIS brainstorming workflow with project-specific context</critical>

<workflow>

  <step n="1" goal="Validate workflow readiness" tag="workflow-status">
    <action>Check if {output_folder}/bmm-workflow-status.yaml exists</action>

    <check if="status file not found">
      <output>No workflow status file found. Brainstorming is optional - you can continue without status tracking.</output>
      <action>Set standalone_mode = true</action>
    </check>

    <check if="status file found">
      <action>Load the FULL file: {output_folder}/bmm-workflow-status.yaml</action>
      <action>Parse workflow_status section</action>
      <action>Check status of "brainstorm-project" workflow</action>
      <action>Get project_level from YAML metadata</action>
      <action>Find first non-completed workflow (next expected workflow)</action>

      <check if="brainstorm-project status is file path (already completed)">
        <output>⚠️ Brainstorming session already completed: {{brainstorm-project status}}</output>
        <ask>Re-running will create a new session. Continue? (y/n)</ask>
        <check if="n">
          <output>Exiting. Use workflow-status to see your next step.</output>
          <action>Exit workflow</action>
        </check>
      </check>

      <check if="brainstorm-project is not the next expected workflow (anything after brainstorm-project is completed already)">
        <output>⚠️ Next expected workflow: {{next_workflow}}. Brainstorming is out of sequence.</output>
        <ask>Continue with brainstorming anyway? (y/n)</ask>
        <check if="n">
          <output>Exiting. Run {{next_workflow}} instead.</output>
          <action>Exit workflow</action>
        </check>
      </check>

      <action>Set standalone_mode = false</action>
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

  <step n="4" goal="Update status and complete" tag="workflow-status">
    <check if="standalone_mode != true">
      <action>Load the FULL file: {output_folder}/bmm-workflow-status.yaml</action>
      <action>Find workflow_status key "brainstorm-project"</action>
      <critical>ONLY write the file path as the status value - no other text, notes, or metadata</critical>
      <action>Update workflow_status["brainstorm-project"] = "{output_folder}/bmm-brainstorming-session-{{date}}.md"</action>
      <action>Save file, preserving ALL comments and structure including STATUS DEFINITIONS</action>

      <action>Find first non-completed workflow in workflow_status (next workflow to do)</action>
      <action>Determine next agent from path file based on next workflow</action>
    </check>

    <output>**✅ Brainstorming Session Complete, {user_name}!**

**Session Results:**

- Brainstorming results saved to: {output_folder}/bmm-brainstorming-session-{{date}}.md

{{#if standalone_mode != true}}
**Status Updated:**

- Progress tracking updated

**Next Steps:**

- **Next required:** {{next_workflow}} ({{next_agent}} agent)
- **Optional:** You can run other analysis workflows (research, product-brief) before proceeding

Check status anytime with: `workflow-status`
{{else}}
**Next Steps:**

Since no workflow is in progress:

- Refer to the BMM workflow guide if unsure what to do next
- Or run `workflow-init` to create a workflow path and get guided next steps
{{/if}}
    </output>
  </step>

</workflow>
```

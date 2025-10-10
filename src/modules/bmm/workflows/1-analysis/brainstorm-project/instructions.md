# Brainstorm Project - Workflow Instructions

```xml
<critical>The workflow execution engine is governed by: {project_root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This is a meta-workflow that orchestrates the CIS brainstorming workflow with project-specific context</critical>

<workflow>

  <step n="1" goal="Load project brainstorming context">
    <action>Read the project context document from: {project_context}</action>
    <action>This context provides project-specific guidance including:
      - Focus areas for project ideation
      - Key considerations for software/product projects
      - Recommended techniques for project brainstorming
      - Output structure guidance
    </action>
  </step>

  <step n="2" goal="Invoke core brainstorming with project context">
    <action>Execute the CIS brainstorming workflow with project context</action>
    <invoke-workflow path="{core_brainstorming}" data="{project_context}">
      The CIS brainstorming workflow will:
      - Present interactive brainstorming techniques menu
      - Guide the user through selected ideation methods
      - Generate and capture brainstorming session results
      - Save output to: {output_folder}/brainstorming-session-results-{{date}}.md
    </invoke-workflow>
  </step>

  <step n="3" goal="Completion">
    <action>Confirm brainstorming session completed successfully</action>
    <action>Brainstorming results saved by CIS workflow</action>
    <action>Report workflow completion</action>
  </step>

</workflow>
```

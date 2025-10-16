# Brainstorm Project - Workflow Instructions

````xml
<critical>The workflow execution engine is governed by: {project_root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language}</critical>
<critical>This is a meta-workflow that orchestrates the CIS brainstorming workflow with project-specific context</critical>

<workflow>

  <step n="1" goal="Check and load workflow status file">
    <action>Search {output_folder}/ for files matching pattern: bmm-workflow-status.md</action>
    <action>Find the most recent file (by date in filename: bmm-workflow-status.md)</action>

    <check if="exists">
      <action>Load the status file</action>
      <action>Set status_file_found = true</action>
      <action>Store status_file_path for later updates</action>
    </check>

    <check if="not exists">
      <ask>**No workflow status file found.**

This workflow generates brainstorming ideas for project ideation (optional Phase 1 workflow).

Options:
1. Run workflow-status first to create the status file (recommended for progress tracking)
2. Continue in standalone mode (no progress tracking)
3. Exit

What would you like to do?</ask>
      <action>If user chooses option 1 → HALT with message: "Please run workflow-status first, then return to brainstorm-project"</action>
      <action>If user chooses option 2 → Set standalone_mode = true and continue</action>
      <action>If user chooses option 3 → HALT</action>
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

  <step n="4" goal="Update status file on completion">
    <action>Search {output_folder}/ for files matching pattern: bmm-workflow-status.md</action>
    <action>Find the most recent file (by date in filename)</action>

    <check if="status file exists">
      <action>Load the status file</action>

      <template-output file="{{status_file_path}}">current_step</template-output>
      <action>Set to: "brainstorm-project"</action>

      <template-output file="{{status_file_path}}">current_workflow</template-output>
      <action>Set to: "brainstorm-project - Complete"</action>

      <template-output file="{{status_file_path}}">progress_percentage</template-output>
      <action>Increment by: 5% (optional Phase 1 workflow)</action>

      <template-output file="{{status_file_path}}">decisions_log</template-output>
      <action>Add entry:</action>
      ```
      - **{{date}}**: Completed brainstorm-project workflow. Generated brainstorming session results saved to {output_folder}/brainstorming-session-results-{{date}}.md. Next: Review ideas and consider running research or product-brief workflows.
      ```

      <output>**✅ Brainstorming Session Complete, {user_name}!**

**Session Results:**
- Brainstorming results saved to: {output_folder}/brainstorming-session-results-{{date}}.md

**Status file updated:**
- Current step: brainstorm-project ✓
- Progress: {{new_progress_percentage}}%

**Next Steps:**
1. Review brainstorming results
2. Consider running:
   - `research` workflow for market/technical research
   - `product-brief` workflow to formalize product vision
   - Or proceed directly to `plan-project` if ready

Check status anytime with: `workflow-status`
      </output>
    </check>

    <check if="status file not found">
      <output>**✅ Brainstorming Session Complete, {user_name}!**

**Session Results:**
- Brainstorming results saved to: {output_folder}/brainstorming-session-results-{{date}}.md

Note: Running in standalone mode (no status file).

To track progress across workflows, run `workflow-status` first.

**Next Steps:**
1. Review brainstorming results
2. Run research or product-brief workflows
      </output>
    </check>
  </step>

</workflow>
````

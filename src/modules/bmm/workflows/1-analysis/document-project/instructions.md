# Document Project Workflow Router

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/bmad/bmm/workflows/document-project/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language}</critical>

<workflow>

<critical>This router determines workflow mode and delegates to specialized sub-workflows</critical>

<step n="1" goal="Check and load workflow status file">

<action>Search {output_folder}/ for files matching pattern: bmm-workflow-status\*.md</action>
<action>Find the most recent file (by date in filename: bmm-workflow-status.md)</action>

<check if="exists">
  <action>Load the status file</action>
  <action>Extract key information:</action>

- current_step: From "Current Step:" field
- next_step: From "Next Step:" field
- planned_workflow: From "Planned Workflow Journey" table
- progress_percentage: From "Overall Progress:" field
- current_phase: From "Current Phase:" field
- field_type: From "Greenfield/Brownfield:" field

<action>Validate this workflow is in the planned workflow</action>
<action>Set status_file_path = file path</action>
<action>Set status_file_found = true</action>

  <check if='next_step != "document-project"'>
    <ask>**⚠️ Workflow Sequence Note**

According to your status file, your next planned step is: **{{next_step}}**

But you're running: **document-project**

This is expected if plan-project invoked this workflow automatically for brownfield documentation.

Options:

1. **Continue** - Run document-project (status will be updated)
2. **Exit** - I'll follow the planned sequence instead

Your choice (1-2):</ask>

    <check if='choice == "2"'>
      <output>**Recommended Next Step:**

Run: {{next_step}}

You can return to document-project later if needed.
</output>
<action>Exit workflow</action>
</check>
</check>
</check>

<check if="not exists">
  <ask>**ℹ️ No Workflow Status File Found**

This workflow works best with a workflow status file for progress tracking.

Options:

1. **Run workflow-status first** - Create status file and plan workflow (recommended)
2. **Continue anyway** - Run document-project standalone
3. **Exit** - I'll set up the workflow first

Your choice (1-3):</ask>

  <check if='choice == "1"'>
    <output>**To create status file:**

Load any agent and run: `workflow-status`

After planning your workflow, you can return here or follow the planned sequence.
</output>
<action>Exit workflow</action>
</check>

  <check if='choice == "2"'>
    <action>Set status_file_found = false</action>
    <action>Set standalone_mode = true</action>
    <action>Continue without status file integration</action>
  </check>

  <check if='choice == "3"'>
    <action>Exit workflow</action>
  </check>
</check>

</step>

<step n="2" goal="Check for resumability and determine workflow mode">
<critical>SMART LOADING STRATEGY: Check state file FIRST before loading any CSV files</critical>

<action>Check for existing state file at: {output_folder}/project-scan-report.json</action>

<check if="project-scan-report.json exists">
  <action>Read state file and extract: timestamps, mode, scan_level, current_step, completed_steps, project_classification</action>
  <action>Extract cached project_type_id(s) from state file if present</action>
  <action>Calculate age of state file (current time - last_updated)</action>

<ask>I found an in-progress workflow state from {{last_updated}}.

**Current Progress:**

- Mode: {{mode}}
- Scan Level: {{scan_level}}
- Completed Steps: {{completed_steps_count}}/{{total_steps}}
- Last Step: {{current_step}}
- Project Type(s): {{cached_project_types}}

Would you like to:

1. **Resume from where we left off** - Continue from step {{current_step}}
2. **Start fresh** - Archive old state and begin new scan
3. **Cancel** - Exit without changes

Your choice [1/2/3]:
</ask>

    <check if="user selects 1">
      <action>Set resume_mode = true</action>
      <action>Set workflow_mode = {{mode}}</action>
      <action>Load findings summaries from state file</action>
      <action>Load cached project_type_id(s) from state file</action>

      <critical>CONDITIONAL CSV LOADING FOR RESUME:</critical>
      <action>For each cached project_type_id, load ONLY the corresponding row from: {documentation_requirements_csv}</action>
      <action>Skip loading project-types.csv and architecture_registry.csv (not needed on resume)</action>
      <action>Store loaded doc requirements for use in remaining steps</action>

      <action>Display: "Resuming {{workflow_mode}} from {{current_step}} with cached project type(s): {{cached_project_types}}"</action>

      <check if="workflow_mode == deep_dive">
        <action>Load and execute: {installed_path}/workflows/deep-dive-instructions.md with resume context</action>
      </check>

      <check if="workflow_mode == initial_scan OR workflow_mode == full_rescan">
        <action>Load and execute: {installed_path}/workflows/full-scan-instructions.md with resume context</action>
      </check>
    </check>

    <check if="user selects 2">
      <action>Create archive directory: {output_folder}/.archive/</action>
      <action>Move old state file to: {output_folder}/.archive/project-scan-report-{{timestamp}}.json</action>
      <action>Set resume_mode = false</action>
      <action>Continue to Step 0.5</action>
    </check>

    <check if="user selects 3">
      <action>Display: "Exiting workflow without changes."</action>
      <action>Exit workflow</action>
    </check>

  </check>

  <check if="state file age >= 24 hours">
    <action>Display: "Found old state file (>24 hours). Starting fresh scan."</action>
    <action>Archive old state file to: {output_folder}/.archive/project-scan-report-{{timestamp}}.json</action>
    <action>Set resume_mode = false</action>
    <action>Continue to Step 0.5</action>
  </check>

</step>

<step n="3" goal="Check for existing documentation and determine workflow mode" if="resume_mode == false">
<action>Check if {output_folder}/index.md exists</action>

<check if="index.md exists">
  <action>Read existing index.md to extract metadata (date, project structure, parts count)</action>
  <action>Store as {{existing_doc_date}}, {{existing_structure}}</action>

<ask>I found existing documentation generated on {{existing_doc_date}}.

What would you like to do?

1. **Re-scan entire project** - Update all documentation with latest changes
2. **Deep-dive into specific area** - Generate detailed documentation for a particular feature/module/folder
3. **Cancel** - Keep existing documentation as-is

Your choice [1/2/3]:
</ask>

  <check if="user selects 1">
    <action>Set workflow_mode = "full_rescan"</action>
    <action>Display: "Starting full project rescan..."</action>
    <action>Load and execute: {installed_path}/workflows/full-scan-instructions.md</action>
    <action>After sub-workflow completes, continue to Step 4</action>
  </check>

  <check if="user selects 2">
    <action>Set workflow_mode = "deep_dive"</action>
    <action>Set scan_level = "exhaustive"</action>
    <action>Display: "Starting deep-dive documentation mode..."</action>
    <action>Load and execute: {installed_path}/workflows/deep-dive-instructions.md</action>
    <action>After sub-workflow completes, continue to Step 4</action>
  </check>

  <check if="user selects 3">
    <action>Display message: "Keeping existing documentation. Exiting workflow."</action>
    <action>Exit workflow</action>
  </check>
</check>

<check if="index.md does not exist">
  <action>Set workflow_mode = "initial_scan"</action>
  <action>Display: "No existing documentation found. Starting initial project scan..."</action>
  <action>Load and execute: {installed_path}/workflows/full-scan-instructions.md</action>
  <action>After sub-workflow completes, continue to Step 4</action>
</check>

</step>

<step n="4" goal="Update status file on completion">

<check if="status_file_found == true">
  <action>Load the status file from {{status_file_path}}</action>

<template-output file="{{status_file_path}}">planned_workflow</template-output>
<action>Find "document-project" in the planned_workflow table</action>
<action>Update Status field from "Planned" or "In Progress" to "Complete"</action>

<template-output file="{{status_file_path}}">current_step</template-output>
<action>Set to: "document-project"</action>

<template-output file="{{status_file_path}}">next_step</template-output>
<action>Find next item with Status != "Complete" in planned_workflow table</action>
<action>Set to: "{{next_workflow_step}} ({{next_workflow_agent}} agent)"</action>

<template-output file="{{status_file_path}}">progress_percentage</template-output>
<action>Increment by: 10%</action>

<template-output file="{{status_file_path}}">current_workflow</template-output>
<action>Set to: "document-project - Complete"</action>

<template-output file="{{status_file_path}}">decisions_log</template-output>
<action>Add entry:</action>

```
- **{{date}}**: Completed document-project workflow ({{workflow_mode}} mode, {{scan_level}} scan). Generated brownfield documentation in {output_folder}/. Next: {{next_step}}.
```

<output>**✅ Document Project Workflow Complete, {user_name}!**

**Documentation Generated:**

- Mode: {{workflow_mode}}
- Scan Level: {{scan_level}}
- Output: {output_folder}/index.md and related files

**Status file updated:**

- Current step: document-project ✓
- Next step: {{next_step}}
- Progress: {{new_progress_percentage}}%

**To proceed:**
Load {{next_agent}} and run: `{{next_command}}`

Or check status anytime with: `workflow-status`
</output>
</check>

<check if="standalone_mode == true">
  <output>**✅ Document Project Workflow Complete**

**Documentation Generated:**

- Mode: {{workflow_mode}}
- Scan Level: {{scan_level}}
- Output: {output_folder}/index.md and related files

Note: Running in standalone mode (no status file).

To track progress across workflows, run `workflow-status` first next time.
</output>
</check>

</step>

</workflow>

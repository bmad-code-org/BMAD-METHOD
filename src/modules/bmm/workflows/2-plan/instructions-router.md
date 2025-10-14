# PRD Workflow Router Instructions

<workflow>

<critical>This workflow requires a workflow status file to exist</critical>
<critical>ALWAYS check for existing bmm-workflow-status.md first</critical>
<critical>If no status file exists, direct user to run workflow-status first</critical>
<critical>The workflow execution engine is governed by: {project_root}/bmad/core/tasks/workflow.xml</critical>

<step n="1" goal="Check for existing workflow status file - REQUIRED">

<action>Check if any bmm-workflow-status\*.md files exist in {output_folder}/</action>

<check if="not exists">
  <output>**⚠️ No Workflow Status File Found**

The `plan-project` workflow requires an existing workflow status file.

Please run `workflow-status` first to:

- Map out your complete workflow journey
- Determine project type and level
- Create the status file with your planned workflow

**To proceed:**

1. Load any agent (Analyst, PM, or use bmad-master)
2. Run: `workflow-status`
3. Complete the workflow planning
4. Return here to continue with `plan-project`

Or tell me: "run workflow-status"
</output>
<action>Exit workflow - cannot proceed without status file</action>
</check>

<check if="exists">
  <action>Find the most recent bmm-workflow-status.md file</action>
  <action>Load the status file</action>
  <action>Extract key information:</action>

**From Status File:**

- project_type: From "Project Type:" field
- project_level: From "Project Level:" field (0, 1, 2, 3, or 4)
- field_type: From "Greenfield/Brownfield:" field
- planned_workflow: From "Planned Workflow Journey" table
- current_step: From "Current Step:" field
- next_step: From "Next Step:" field

  <action>Validate this workflow is the correct next step</action>

  <check if='next_step != "plan-project"'>
    <ask>**⚠️ Workflow Sequence Warning**

According to your status file, your next planned step is: **{{next_step}}**

But you're trying to run: **plan-project**

Options:

1. **Continue anyway** - Run plan-project (status file will be updated)
2. **Follow planned workflow** - Run {{next_step}} instead
3. **Update workflow plan** - Run workflow-status to revise plan

Your choice (1-3):</ask>

    <check if='choice == "2"'>
      <output>**Recommended Next Step:**

Load agent: {{next_step_agent}}
Run: {{next_step}}

Or tell me: "run {{next_step}}"
</output>
<action>Exit workflow</action>
</check>

    <check if='choice == "3"'>
      <output>**Update Workflow Plan:**

Run: `workflow-status`

After updating your plan, return here if needed.
</output>
<action>Exit workflow</action>
</check>
</check>

<action>Set status_file_path = existing file path</action>
<action>Check for existing workflow outputs based on level in status file:</action>

- Level 0: Check for tech-spec.md
- Level 1-2: Check for PRD.md, epic-stories.md, tech-spec.md
- Level 3-4: Check for PRD.md, epics.md

  <check if="outputs exist">
    <ask>Found existing workflow status file: bmm-workflow-status.md (Level {{project_level}})

**Existing documents detected:**
{{list_existing_docs}}

Options:

1. **Continue** - Update existing documents
2. **Start fresh** - Archive old documents, create new ones
3. **Exit** - I'm not ready to regenerate these

Your choice (1-3):</ask>

    <check if='option == "1"'>
      <action>Set continuation_mode = true</action>
      <action>Will update existing documents</action>
    </check>

    <check if='option == "2"'>
      <action>Archive existing documents to: "{output_folder}/archive/"</action>
      <action>Set continuation_mode = false</action>
      <action>Will create fresh documents</action>
    </check>

    <check if='option == "3"'>
      <action>Exit workflow</action>
    </check>

  </check>

  <check if="outputs do not exist">
    <action>Set continuation_mode = false</action>
    <action>Ready to create new documents</action>
  </check>
</check>

</step>

<step n="2" goal="Use status file data and determine specific planning path">

<output>**Status File Data Loaded:**

- Project Type: {{project_type}}
- Project Level: {{project_level}}
- Field Type: {{field_type}}
- Current Phase: {{current_phase}}
  </output>

<ask>What type of planning do you need?

**Based on your project (Level {{project_level}} {{project_type}}):**

{{#if project_level == 0}}
**Recommended:** Tech spec only (Level 0 path)
{{/if}}

{{#if project_level == 1}}
**Recommended:** Tech spec + epic/stories (Level 1 path)
{{/if}}

{{#if project_level >= 2}}
**Recommended:** Full PRD + epics (Level {{project_level}} path)
{{/if}}

**Other Options:**

1. **Follow recommended path** (recommended)
2. **UX/UI specification only**
3. **Generate AI Frontend Prompt** (from existing specs)
4. **Describe custom needs**

Select an option (1-4):</ask>

<action>Capture user selection as {{planning_type}}</action>

<check if='{{planning_type}} == "2" OR "UX/UI specification only"'>
  <invoke-workflow>{installed_path}/ux/workflow.yaml</invoke-workflow>
  <action>Pass mode="standalone" to UX workflow</action>
  <action>Exit router workflow (skip remaining steps)</action>
</check>

<check if='{{planning_type}} == "3" OR "Generate AI Frontend Prompt"'>
  <action>Check for existing UX spec or PRD</action>
  <invoke-task>{project-root}/bmad/bmm/tasks/ai-fe-prompt.md</invoke-task>
  <action>Exit router workflow after prompt generation</action>
</check>

<action if='{{planning_type}} == "1" OR "Follow recommended path"'>Use project_level and project_type from status file to route to appropriate workflow</action>

</step>

<step n="3" goal="Gather additional context if needed">

<action>Read status file to check if additional context is needed</action>

<check if='field_type == "brownfield" AND needs_documentation == true'>
  <ask>**⚠️ Brownfield Documentation Needed**

Your status file indicates this brownfield project needs codebase documentation.

The document-project workflow was flagged in your planned workflow.

**Options:**

1. **Generate docs now** - Run document-project workflow (~10-15 min)
2. **Skip for now** - I'll provide context through questions
3. **Already have docs** - I have documentation to reference

Choose option (1-3):</ask>

  <check if='option == "1"'>
    <action>Invoke document-project workflow before continuing</action>
    <invoke-workflow>{project-root}/bmad/bmm/workflows/1-analysis/document-project/workflow.yaml</invoke-workflow>
    <action>Wait for documentation to complete</action>
    <action>Update status file: Mark document-project as "Complete" in planned workflow</action>
  </check>

  <check if='option == "2"'>
    <action>Set gather_context_via_questions = true</action>
    <action>Will ask detailed questions during spec generation</action>
  </check>

  <check if='option == "3"'>
    <action>Set has_documentation = true</action>
    <action>Will reference existing documentation</action>
  </check>
</check>

<check if='project_level == "TBD"'>
  <ask>**Project Level Not Yet Determined**

Your status file indicates the project level will be determined during planning.

**Based on what you want to build, what level best describes your project?**

0. **Single atomic change** - Bug fix, add endpoint, single file change
1. **Coherent feature** - Add search, implement SSO, new component (2-3 stories)
2. **Small complete system** - Admin tool, team app, prototype (multiple epics)
3. **Full product** - Customer portal, SaaS MVP (subsystems, integrations)
4. **Platform/ecosystem** - Enterprise suite, multi-tenant system

Your level (0-4):</ask>

<action>Capture confirmed_level</action>
<action>Update status file with confirmed project_level</action>
</check>

<check if='project_type == "TBD" OR project_type == "custom"'>
  <ask>**Project Type Clarification Needed**

Please describe your project type so we can load the correct planning template.

Examples: web, mobile, desktop, backend, library, cli, game, embedded, data, extension, infra

Your project type:</ask>

<action>Capture and map to project_type_id from project-types.csv</action>
<action>Update status file with confirmed project_type</action>
</check>

</step>

<step n="4" goal="Update status file and route to appropriate workflow">

<action>Update status file before proceeding:</action>

<template-output file="{{status_file_path}}">current_workflow</template-output>
<check if="project_level == 0">Set to: "tech-spec (Level 0 - in progress)"</check>
<check if="project_level == 1">Set to: "tech-spec (Level 1 - in progress)"</check>
<check if="project_level >= 2">Set to: "PRD (Level {{project_level}} - in progress)"</check>

<template-output file="{{status_file_path}}">current_step</template-output>
Set to: "plan-project"

<template-output file="{{status_file_path}}">progress_percentage</template-output>
Increment by 10% (planning started)

<action>Add to decisions log:</action>

```
- **{{date}}**: Started plan-project workflow. Routing to {{workflow_type}} workflow based on Level {{project_level}} {{project_type}} project.
```

<critical>Based on project type and level from status file, load ONLY the needed instructions:</critical>

<check if='project_type == "game"'>
  <invoke-workflow>{installed_path}/gdd/workflow.yaml</invoke-workflow>
  <action>GDD workflow handles all game project levels internally</action>
  <action>Pass status_file_path and continuation_mode to workflow</action>
</check>

<check if='project_level == 0 AND project_type != "game"'>
  <invoke-workflow>{installed_path}/tech-spec/workflow.yaml</invoke-workflow>
  <action>Pass level=0 to tech-spec workflow</action>
  <action>Tech-spec workflow will generate tech-spec + 1 story</action>
  <action>Pass status_file_path and continuation_mode to workflow</action>
</check>

<check if='project_level == 1 AND project_type != "game"'>
  <invoke-workflow>{installed_path}/tech-spec/workflow.yaml</invoke-workflow>
  <action>Pass level=1 to tech-spec workflow</action>
  <action>Tech-spec workflow will generate tech-spec + epic + 2-3 stories</action>
  <action>Pass status_file_path and continuation_mode to workflow</action>
</check>

<check if='project_level == 2 AND project_type != "game"'>
  <invoke-workflow>{installed_path}/prd/workflow.yaml</invoke-workflow>
  <action>Pass level=2 context to PRD workflow (loads instructions-med.md)</action>
  <action>Pass status_file_path and continuation_mode to workflow</action>
</check>

<check if='project_level >= 3 AND project_type != "game"'>
  <invoke-workflow>{installed_path}/prd/workflow.yaml</invoke-workflow>
  <action>Pass level context to PRD workflow (loads instructions-lg.md)</action>
  <action>Pass status_file_path and continuation_mode to workflow</action>
</check>

<critical>Pass context to invoked workflow:</critical>

- status_file_path: {{status_file_path}}
- continuation_mode: {{continuation_mode}}
- existing_documents: {{document_list}}
- project_level: {{project_level}}
- project_type: {{project_type}}
- field_type: {{field_type}}
- gather_context_via_questions: {{gather_context_via_questions}} (if brownfield without docs)

<critical>The invoked workflow will update the status file when complete</critical>

</step>

</workflow>

# WDS Workflow Status - Progress Check Instructions

<critical>You MUST have already loaded and processed: wds-workflow-status/workflow.yaml</critical>
<critical>Communicate in {communication_language} with {user_name}</critical>

<workflow>

<step n="1" goal="Check for status file">
<action>Look for {output_folder}/wds-workflow-status.yaml</action>

<check if="status_file not found">
  <output>No WDS workflow tracking found for this project.

To get started, run the workflow-init:
`/bmad:wds:workflows:workflow-init`

Or activate any WDS agent (Saga, Idunn, or Freya) and describe your project.</output>
<action>Exit workflow</action>
</check>

<action>Load and parse wds-workflow-status.yaml</action>
</step>

<step n="2" goal="Analyze progress">
<action>For each phase in workflow_status:
- Check if folder exists in docs/
- Check if expected artifacts exist
- Update status (complete/in-progress/pending)
</action>

<action>Identify:

- completed_phases: Phases with all artifacts
- current_phase: First incomplete required phase
- next_agent: Agent for current phase
- blocked_phases: Phases waiting on dependencies
  </action>
  </step>

<step n="3" goal="Display status">
<output>**WDS Project Status** 🎨

**Project:** {{project_name}}
**Type:** {{project_type}}
**Design System:** {{include_design_system}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{{#each phases}}
{{#if this.status == 'complete'}}✅{{/if}}
{{#if this.status == 'in-progress'}}🔄{{/if}}
{{#if this.status == 'pending'}}⏳{{/if}}
{{#if this.status == 'skipped'}}⏭️{{/if}}
**Phase {{this.number}}: {{this.name}}**
Agent: {{this.agent}}
Folder: `{{this.folder}}`
Status: {{this.status}}
{{#if this.artifacts}}
Artifacts: {{this.artifact_count}} created
{{/if}}

{{/each}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Progress:** {{completed_count}}/{{total_count}} phases complete

{{#if current_phase}}
**Current Focus:** Phase {{current_phase.number}} - {{current_phase.name}}
**Agent:** {{current_phase.agent}}
**Next Step:** {{current_phase.next_step}}
{{else}}
🎉 **All phases complete!** Your design work is ready for development handoff.
{{/if}}
</output>
</step>

<step n="4" goal="Offer next actions">
<check if="current_phase exists">
  <ask>What would you like to do?

1. **Continue** {{current_phase.name}} with {{current_phase.agent}}
2. **Jump to** a different phase
3. **View** phase details
4. **Exit** - I'll come back later

Choice [1/2/3/4]:</ask>

  <check if="choice == 1">
    <output>To continue with **{{current_phase.name}}**:

1. Activate **{{current_phase.agent}}** agent
2. Run: `/bmad:wds:workflows:{{current_phase.workflow_id}}`
3. Or just tell {{current_phase.agent}} what you want to work on

Happy designing! 🎨</output>
</check>

  <check if="choice == 2">
    <ask>Which phase?
{{#each available_phases}}
{{this.number}}. {{this.name}} ({{this.status}})
{{/each}}

Choice:</ask>
<output>To work on **Phase {{selected_phase.number}}: {{selected_phase.name}}**:

Agent: **{{selected_phase.agent}}**
Folder: `{{selected_phase.folder}}`
Command: `/bmad:wds:workflows:{{selected_phase.workflow_id}}`</output>
</check>

  <check if="choice == 3">
    <ask>Which phase to view?
{{#each phases}}
{{this.number}}. {{this.name}}
{{/each}}

Choice:</ask>
<output>**Phase {{selected.number}}: {{selected.name}}**

**Purpose:** {{selected.description}}
**Agent:** {{selected.agent}}
**Output Folder:** `{{selected.folder}}`
**Status:** {{selected.status}}

{{#if selected.artifacts}}
**Artifacts created:**
{{#each selected.artifacts}}

- {{this}}
  {{/each}}
  {{else}}
  **Artifacts:** None yet
  {{/if}}

**What this phase produces:**
{{selected.produces}}</output>
</check>
</check>
</step>

</workflow>

---
name: 'step-05-update-status'
description: 'Update story/sprint status and report review completion'
---

  <step n="5" goal="Update story status and sync sprint tracking">
    <invoke-task>Validate against checklist at {installed_path}/checklist.md using _bmad/core/tasks/validate-workflow.md</invoke-task>

    <!-- Determine new status based on review outcome -->
    <check if="all HIGH and MEDIUM issues fixed AND all ACs implemented">
      <action>Set {{new_status}} = "done"</action>
      <action>Update story Status field to "done"</action>
    </check>
    <check if="HIGH or MEDIUM issues remain OR ACs not fully implemented">
      <action>Set {{new_status}} = "in-progress"</action>
      <action>Update story Status field to "in-progress"</action>
    </check>
    <action>Save story file</action>

    <!-- Determine sprint tracking status -->
    <check if="{sprint_status} file exists">
      <action>Set {{current_sprint_status}} = "enabled"</action>
    </check>
    <check if="{sprint_status} file does NOT exist">
      <action>Set {{current_sprint_status}} = "no-sprint-tracking"</action>
    </check>

    <!-- Sync sprint-status.yaml when story status changes (only if sprint tracking enabled) -->
    <check if="{{current_sprint_status}} != 'no-sprint-tracking'">
      <action>Load the FULL file: {sprint_status}</action>
      <action>Find development_status key matching {{story_key}}</action>

      <check if="{{new_status}} == 'done'">
        <action>Update development_status[{{story_key}}] = "done"</action>
        <action>Save file, preserving ALL comments and structure</action>
        <output>✅ Sprint status synced: {{story_key}} → done</output>
      </check>

      <check if="{{new_status}} == 'in-progress'">
        <action>Update development_status[{{story_key}}] = "in-progress"</action>
        <action>Save file, preserving ALL comments and structure</action>
        <output>🔄 Sprint status synced: {{story_key}} → in-progress</output>
      </check>

      <check if="story key not found in sprint status">
        <output>⚠️ Story file updated, but sprint-status sync failed: {{story_key}} not found in sprint-status.yaml</output>
      </check>
    </check>

    <check if="{{current_sprint_status}} == 'no-sprint-tracking'">
      <output>ℹ️ Story status updated (no sprint tracking configured)</output>
    </check>

    <output>**✅ Review Complete!**

      **Story Status:** {{new_status}}
      **Issues Fixed:** {{fixed_count}}
      **Action Items Created:** {{action_count}}

      {{#if new_status == "done"}}Code review complete!{{else}}Address the action items and continue development.{{/if}}
    </output>
  </step>

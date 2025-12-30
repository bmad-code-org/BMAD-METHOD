<critical>The workflow execution engine is governed by: {project-root}/_bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language}</critical>
<critical>This is a meta-workflow that orchestrates the CIS brainstorming workflow with game-specific context and additional game design techniques</critical>
<critical>⚠️ ABSOLUTELY NO TIME ESTIMATES - NEVER mention hours, days, weeks, months, or ANY time-based predictions. AI has fundamentally changed development speed - what once took teams weeks/months can now be done by one person in hours. DO NOT give ANY time estimates whatsoever.</critical>
<critical>⚠️ CHECKPOINT PROTOCOL: After EVERY <template-output> tag, you MUST follow workflow.xml substep 2c: SAVE content to file immediately → SHOW checkpoint separator (━━━━━━━━━━━━━━━━━━━━━━━) → DISPLAY generated content → PRESENT options [a]Advanced Elicitation/[c]Continue/[p]Party-Mode/[y]YOLO → WAIT for user response. Never batch saves or skip checkpoints.</critical>

<workflow>

  <step n="1" goal="Validate workflow readiness" tag="workflow-status">
    <action>Check if {output_folder}/bmgd-workflow-status.yaml exists</action>

    <check if="status file not found">
      <output>No workflow status file found. Game brainstorming is optional - you can continue without status tracking.</output>
      <action>Set standalone_mode = true</action>
    </check>

    <check if="status file found">
      <action>Load the FULL file: {output_folder}/bmgd-workflow-status.yaml</action>
      <action>Parse workflow_status section</action>
      <action>Check status of "brainstorm-game" workflow</action>
      <action>Get project_level from YAML metadata</action>
      <action>Find first non-completed workflow (next expected workflow)</action>

      <check if="project_type != 'game'">
        <output>Note: This is a {{project_type}} project. Game brainstorming is designed for game projects.</output>
        <ask>Continue with game brainstorming anyway? (y/n)</ask>
        <check if="n">
          <action>Exit workflow</action>
        </check>
      </check>

      <check if="brainstorm-game status is file path (already completed)">
        <output>⚠️ Game brainstorming session already completed: {{brainstorm-game status}}</output>
        <ask>Re-running will create a new session. Continue? (y/n)</ask>
        <check if="n">
          <output>Exiting. Use workflow-status to see your next step.</output>
          <action>Exit workflow</action>
        </check>
      </check>

      <check if="brainstorm-game is not the next expected workflow (latter items are completed already in the list)">
        <output>⚠️ Next expected workflow: {{next_workflow}}. Game brainstorming is out of sequence.</output>
        <ask>Continue with game brainstorming anyway? (y/n)</ask>
        <check if="n">
          <output>Exiting. Run {{next_workflow}} instead.</output>
          <action>Exit workflow</action>
        </check>
      </check>

      <action>Set standalone_mode = false</action>
    </check>

  </step>

  <step n="2" goal="Load game brainstorming context and techniques">
    <action>Read the game context document from: {game_context}</action>
    <action>This context provides game-specific guidance including:
      - Focus areas for game ideation (mechanics, narrative, experience, etc.)
      - Key considerations for game design
      - Recommended techniques for game brainstorming
      - Output structure guidance
    </action>
    <action>Load game-specific brain techniques from: {game_brain_methods}</action>
    <action>These additional techniques supplement the standard CIS brainstorming methods with game design-focused approaches like:
      - MDA Framework exploration
      - Core loop brainstorming
      - Player fantasy mining
      - Genre mashup
      - And other game-specific ideation methods
    </action>
  </step>

  <step n="3" goal="Invoke CIS brainstorming with game context">
    <action>Execute the CIS brainstorming workflow with game context and additional techniques</action>
    <invoke-workflow path="{core_brainstorming}" data="{game_context}" techniques="{game_brain_methods}">
      The CIS brainstorming workflow will:
      - Merge game-specific techniques with standard techniques
      - Present interactive brainstorming techniques menu
      - Guide the user through selected ideation methods
      - Generate and capture brainstorming session results
      - Save output to: {output_folder}/brainstorming-session-results-{{date}}.md
    </invoke-workflow>
  </step>

  <step n="4" goal="Update status and complete" tag="workflow-status">
    <check if="standalone_mode != true">
      <action>Load the FULL file: {output_folder}/bmgd-workflow-status.yaml</action>
      <action>Find workflow_status key "brainstorm-game"</action>
      <critical>ONLY write the file path as the status value - no other text, notes, or metadata</critical>
      <action>Update workflow_status["brainstorm-game"] = "{output_folder}/bmm-brainstorming-session-{{date}}.md"</action>
      <action>Save file, preserving ALL comments and structure including STATUS DEFINITIONS</action>

      <action>Find first non-completed workflow in workflow_status (next workflow to do)</action>
      <action>Determine next agent from path file based on next workflow</action>
    </check>

    <output>**✅ Game Brainstorming Session Complete, {user_name}!**

**Session Results:**

- Game brainstorming results saved to: {output_folder}/bmm-brainstorming-session-{{date}}.md

{{#if standalone_mode != true}}
**Status Updated:**

- Progress tracking updated: brainstorm-game marked complete
- Next workflow: {{next_workflow}}
  {{else}}
  **Note:** Running in standalone mode (no progress tracking)
  {{/if}}

**Next Steps:**

{{#if standalone_mode != true}}

- **Next workflow:** {{next_workflow}} ({{next_agent}} agent)
- **Optional:** You can run other analysis workflows (research, game-brief) before proceeding

Check status anytime with: `workflow-status`
{{else}}
Since no workflow is in progress:

- Refer to the BMM workflow guide if unsure what to do next
- Or run `workflow-init` to create a workflow path and get guided next steps
  {{/if}}
  </output>
  </step>

</workflow>

<critical>The workflow execution engine is governed by: {project_root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>Communicate all responses in {communication_language}</critical>
<critical>This is a meta-workflow that orchestrates the CIS brainstorming workflow with game-specific context and additional game design techniques</critical>

<workflow>

  <step n="1" goal="Validate workflow readiness">
    <invoke-workflow path="{project-root}/bmad/bmm/workflows/workflow-status">
      <param>mode: validate</param>
      <param>calling_workflow: brainstorm-game</param>
    </invoke-workflow>

    <check if="status_exists == false">
      <output>{{suggestion}}</output>
      <output>Note: Game brainstorming is optional. Continuing without progress tracking.</output>
      <action>Set standalone_mode = true</action>
    </check>

    <check if="status_exists == true">
      <action>Store {{status_file_path}} for later updates</action>

      <check if="project_type != 'game'">
        <output>Note: This is a {{project_type}} project. Game brainstorming is designed for game projects.</output>
        <ask>Continue with game brainstorming anyway? (y/n)</ask>
        <check if="n">
          <action>Exit workflow</action>
        </check>
      </check>

      <check if="warning != ''">
        <output>{{warning}}</output>
        <output>Note: Game brainstorming can be valuable at any project stage.</output>
      </check>
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

  <step n="4" goal="Update status and complete">
    <check if="standalone_mode != true">
      <invoke-workflow path="{project-root}/bmad/bmm/workflows/workflow-status">
        <param>mode: update</param>
        <param>action: complete_workflow</param>
        <param>workflow_name: brainstorm-game</param>
      </invoke-workflow>

      <check if="success == true">
        <output>Status updated! Next: {{next_workflow}}</output>
      </check>
    </check>

    <output>**✅ Game Brainstorming Session Complete, {user_name}!**

**Session Results:**

- Game brainstorming results saved to: {output_folder}/bmm-brainstorming-session-{{date}}.md

{{#if standalone_mode != true}}
**Status Updated:**

- Progress tracking updated
  {{else}}
  Note: Running in standalone mode (no status file).
  To track progress across workflows, run `workflow-init` first.
  {{/if}}

**Next Steps:**

1. Review game brainstorming results
2. Consider running:
   - `research` workflow for market/game research
   - `game-brief` workflow to formalize game vision
   - Or proceed directly to `plan-project` if ready

{{#if standalone_mode != true}}
Check status anytime with: `workflow-status`
{{/if}}
</output>
</step>

</workflow>

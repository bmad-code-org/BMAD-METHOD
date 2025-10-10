<critical>The workflow execution engine is governed by: {project_root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {installed_path}/workflow.yaml</critical>
<critical>This is a meta-workflow that orchestrates the CIS brainstorming workflow with game-specific context and additional game design techniques</critical>

<workflow>

  <step n="1" goal="Load game brainstorming context and techniques">
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

  <step n="2" goal="Invoke CIS brainstorming with game context">
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

  <step n="3" goal="Completion">
    <action>Confirm brainstorming session completed successfully</action>
    <action>Brainstorming results saved by CIS workflow</action>
    <action>Report workflow completion</action>
  </step>

</workflow>

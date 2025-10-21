# Agent Handoff Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/bmad/core/workflows/handoff/workflow.yaml</critical>
<critical>Communicate in {communication_language} throughout the workflow execution</critical>

<workflow>

<step n="0.5" goal="Validate workflow status file exists and is valid">
<action>Check if workflow status file exists at: {output_folder}/bmm-workflow-status.md</action>

<check if="file does not exist">
  <action>Display error: "⚠️ Workflow status file not found or invalid. Initialize BMAD workflow first."</action>
  <action>Suggest: Run workflow initialization command or create the file manually</action>
  <action>EXIT workflow - do not proceed</action>
</check>

<check if="file exists">
  <action>Verify file contains required fields: PROJECT_NAME, CURRENT_PHASE, NEXT_AGENT</action>
  <check if="any required field is missing">
    <action>Display error: "⚠️ Workflow status file is invalid - missing required fields"</action>
    <action>List missing fields to user</action>
    <action>EXIT workflow - do not proceed</action>
  </check>
</check>

<action>Proceed to next step if validation passes</action>
</step>

<step n="1" goal="Read workflow status and extract metadata">
<action>Read the complete file: {output_folder}/bmm-workflow-status.md</action>

<action>Extract the following fields:

- PROJECT_NAME (required)
- PROJECT_TYPE (optional)
- PROJECT_LEVEL (optional)
- FIELD_TYPE (optional)
- CURRENT_PHASE (required)
- NEXT_AGENT (required)
- NEXT_COMMAND (optional - defaults to "Begin next phase")
- NEXT_ACTION (optional)
- CURRENT_WORKFLOW (optional)
  </action>

<action>Store all extracted values for use in subsequent steps</action>
</step>

<step n="2" goal="Extract completed work summary">
<action>From the workflow status file, locate the "Completed Work" section</action>

<check if="section exists and has content">
  <action>Extract the most recent entry from the "Completed Work" section</action>
  <action>This represents what was just completed in the current phase</action>
</check>

<check if="section is empty or unclear">
  <action>Infer completed work from CURRENT_WORKFLOW field value</action>
  <action>Use conversation context to understand what you just finished doing</action>
  <action>Generate summary based on recent work performed in this session</action>
</check>

<action>Store completed work summary for handoff memory generation</action>
</step>

<step n="3" goal="Activate Serena project for memory storage">
<action>Run Serena MCP tool: mcp__serena__activate_project</action>
<action>Pass current project directory as the project parameter</action>
<action>Wait for confirmation that project is activated</action>

<check if="activation fails">
  <action>Display error: "⚠️ Failed to activate Serena project. Ensure Serena MCP is installed and configured."</action>
  <action>Provide troubleshooting: Check Serena MCP server status and configuration</action>
  <action>EXIT workflow if Serena is not available</action>
</check>
</step>

<step n="3.5" goal="Validate required fields before handoff generation">
<action>Verify all required fields were extracted successfully from workflow status file:
  - PROJECT_NAME (required)
  - CURRENT_PHASE (required)
  - NEXT_AGENT (required)
  - NEXT_COMMAND (optional - defaults to "Begin next phase")
</action>

<check if="any required field is missing">
  <action>Display warning: "⚠️ Missing required field: [FIELD_NAME]"</action>
  <ask>Continue with placeholder value '[FIELD_NAME]' or cancel? (y/N)</ask>

  <check if="user chooses cancel">
    <action>EXIT workflow gracefully</action>
  </check>

  <check if="user chooses continue">
    <action>Use placeholder values for missing fields</action>
    <action>Proceed to next step with warning noted</action>
  </check>
</check>

<action>Proceed to handoff generation if all required fields are present</action>
</step>

<step n="4" goal="Generate structured handoff memory">
<action>Create a comprehensive handoff memory using this exact structure:</action>

<example>
# [NEXT_AGENT] Agent Handoff - [PROJECT_NAME]

**Date:** [Current date from {date} variable]
**From:** [CURRENT_PHASE]
**To:** [NEXT_AGENT] Agent
**Command:** [NEXT_COMMAND]

---

## Work Just Completed

[Insert completed work summary from Step 2]

---

## Current Project State

**Project:** [PROJECT_NAME]
**Type:** [PROJECT_TYPE] ([FIELD_TYPE])
**Level:** [PROJECT_LEVEL]
**Current Phase:** [CURRENT_PHASE]

**Workflow Status:** `{output_folder}/bmm-workflow-status.md`

**Note:** This handoff complements the BMAD `/workflow-status` command:

- `/workflow-status`: Check current state and next recommended action
- `/handoff`: Save detailed context for next agent (status + completion summary + files + success criteria)
- `/handoff-receive`: Load handoff and display actionable summary

---

## Your Task

[Insert NEXT_ACTION from workflow status]

**Command to run:** `[NEXT_COMMAND]`

---

## Key Context You Need

[Analyze the project and list 3-5 critical things the next agent needs to know]

Examples:

- Existing codebase structure
- Key files to review
- Important technical decisions
- Constraints or requirements
- Dependencies or blockers

---

## Files to Review

[List 3-7 important file paths the next agent should read, based on their task]

Examples:

- Source code files relevant to their work
- Documentation files
- Configuration files
- Test files

---

## Success Criteria

[What "done" looks like for the next agent's task]

Examples:

- Documents created
- Stories written
- Code implemented
- Tests passing

---

## Next Steps

1. Load the [NEXT_AGENT] agent
2. Run `[NEXT_COMMAND]`
3. [Any additional context-specific steps]

---

**Ready for:** [NEXT_AGENT] agent to execute [NEXT_COMMAND]
</example>

<action>Generate the complete handoff memory document following this structure</action>
<action>Analyze the current project context to provide meaningful content for each section</action>
<action>Focus on actionable information the next agent actually needs</action>
<action>Include specific file paths (not vague descriptions)</action>
<action>Make success criteria clear and measurable</action>
<action>Be concise but comprehensive</action>
</step>

<step n="5" goal="Save handoff memory to Serena with timestamped naming">
<action>Generate memory name using this format: [next-agent]-handoff-YYYY-MM-DD-HHmmss</action>

<example>
Memory name examples:
- architect-handoff-2025-10-19-161530
- dev-handoff-2025-10-20-143000
- sm-handoff-2025-10-20-091545
</example>

<action>Use the following naming convention:

- Extract agent name from NEXT_AGENT field (lowercase)
- Use current date from {date} variable
- Use 24-hour format HHmmss for timestamp
- Ensures unique naming even with multiple handoffs per day
  </action>

<action>Call Serena MCP tool: mcp**serena**write_memory</action>
<action>Parameters:

- memory_name: [Generated memory name from above]
- content: [Complete handoff memory document from Step 4]
  </action>

<check if="save fails">
  <action>Display error: "⚠️ Failed to save handoff memory to Serena"</action>
  <action>Show the generated handoff content to user</action>
  <action>Suggest manual save or retry</action>
</check>

<check if="save succeeds">
  <action>Confirm successful save with memory name</action>
  <action>Proceed to final step</action>
</check>
</step>

<step n="6" goal="Output ready-to-use prompt for next agent session">
<action>Display this formatted message to {user_name}:</action>

<example>
✅ Handoff memory saved to Serena: [memory-name]

📋 **Copy/paste this prompt for the next session:**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Read Serena memory: [memory-name]

Then execute the handoff.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Quick version:** /handoff-receive
</example>

<action>Replace all placeholders with actual values from the handoff</action>
<action>Ensure the prompt is ready to copy/paste for the next session</action>
<action>Include both full and quick version (/handoff-receive command)</action>
</step>

<step n="7" goal="Workflow completion confirmation">
<action>Confirm to {user_name} in {communication_language}:</action>

<action>Display completion message:

- Handoff successfully created and saved
- Memory location in Serena
- Next session prompt is ready to use
- Remind about /handoff-receive as the quick option
  </action>

<action>Workflow execution complete</action>
</step>

</workflow>

## Important Execution Notes

### Timestamp Format

- Use 24-hour format: HHmmss (e.g., 161530 for 4:15:30 PM)
- Prevents naming collisions with multiple handoffs per day
- Enables proper chronological sorting

### BMAD Integration

This workflow works seamlessly with:

- **`/workflow-status`** - Provides current state and next action
- **`/handoff-receive`** - Loads and displays the handoff
- **BMAD agents** - Standard agent handoff protocol

### Error Recovery

If any step fails:

1. Display clear error message with context
2. Provide actionable troubleshooting steps
3. Allow user to retry or cancel gracefully
4. Never lose generated content (show to user even if save fails)

### Version Compatibility

- Tested with: BMAD v6.x
- Requires: Serena MCP for memory persistence
- Compatible with: /workflow-status command (BMAD v6+)

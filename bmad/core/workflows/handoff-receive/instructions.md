# Agent Handoff Receive Workflow Instructions

<critical>The workflow execution engine is governed by: {project-root}/bmad/core/tasks/workflow.xml</critical>
<critical>You MUST have already loaded and processed: {project-root}/bmad/core/workflows/handoff-receive/workflow.yaml</critical>
<critical>Communicate in {communication_language} throughout the workflow execution</critical>

<workflow>

<step n="1" goal="Activate Serena project for memory access">
<action>Run Serena MCP tool: mcp__serena__activate_project</action>
<action>Pass current project directory as the project parameter</action>
<action>Wait for confirmation that project is activated</action>

<check if="activation fails">
  <action>Display error: "⚠️ Failed to activate Serena project. Ensure Serena MCP is installed and configured."</action>
  <action>Provide troubleshooting: Check Serena MCP server status and configuration</action>
  <action>EXIT workflow if Serena is not available</action>
</check>
</step>

<step n="2" goal="List all available handoff memories">
<action>Run Serena MCP tool: mcp__serena__list_memories</action>
<action>Filter memories to find handoff-related entries matching these patterns:
  - New format: *-handoff-YYYY-MM-DD-HHmmss (e.g., dev-handoff-2025-10-20-150000)
  - Legacy format: *-handoff-YYYY-MM-DD (e.g., architect-handoff-2025-10-19)
</action>

<check if="no handoff memories found">
  <action>Display error message:</action>
  <example>
⚠️ No handoff memories found in Serena.

This could mean:

1. No handoff was created yet (run /handoff first in previous session)
2. Wrong project activated (check current directory)
3. Handoff memory has a different naming pattern

Recovery options:
a) List all Serena memories: mcp**serena**list_memories
b) Check project activation: mcp**serena**get_current_config
c) Create new handoff in previous agent session
d) Manual search: Look for memories containing 'handoff'

Would you like me to:

- List all available memories?
- Show current Serena project?
  </example>
  <action>EXIT workflow and wait for user guidance</action>
  </check>
  </step>

<step n="3" goal="Find most recent handoff using precedence algorithm">
<action>Apply selection precedence algorithm:
  1. Sort by timestamp (newest first) - Parse YYYY-MM-DD-HHmmss from filename
     - For legacy files (YYYY-MM-DD only), treat time as 00:00:00
  2. If timestamps equal: Prefer agent-specific handoff matching current workflow phase
  3. If multiple matches: Present numbered list to user for manual selection
</action>

<example>
Example ordering (newest first):
- dev-handoff-2025-10-20-150000 ← Select this (most recent)
- sm-handoff-2025-10-20-143000
- architect-handoff-2025-10-19-161530
- dev-handoff-2025-10-19 (legacy format)
</example>

<check if="single clear handoff or most recent is obvious">
  <action>Automatically select the most recent handoff</action>
  <action>Display: "📬 Loading most recent handoff: [memory-name]"</action>
</check>

<check if="multiple handoffs from same timestamp">
  <action>Display numbered selection menu:</action>
  <example>
📋 Multiple handoffs found:
1. dev-handoff-2025-10-20-150000 (3:00 PM)
2. sm-handoff-2025-10-20-143000 (2:30 PM)
3. architect-handoff-2025-10-19-161530 (4:15 PM)

Which one would you like to receive? (Enter number or agent name)

Default: Will select #1 (most recent) in 5 seconds...
</example>
<ask>Select handoff number or agent name</ask>
<action>Use user selection or default to #1</action>
</check>
</step>

<step n="4" goal="Read the selected handoff memory">
<action>Run Serena MCP tool: mcp__serena__read_memory</action>
<action>Parameters: memory_file_name = [Selected handoff memory name from Step 3]</action>

<check if="read fails">
  <action>Display error: "⚠️ Failed to read handoff memory: [memory-name]"</action>
  <action>Suggest: Verify memory exists and is accessible</action>
  <action>EXIT workflow</action>
</check>
</step>

<step n="4.5" goal="Validate handoff memory structure">
<action>Verify handoff memory contains required sections:
  - "Work Just Completed" section
  - "Your Task" section
  - "Success Criteria" section
</action>

<check if="any section is missing">
  <action>Display warning: "⚠️ Handoff memory incomplete - missing: [SECTION_NAME]"</action>
  <action>Show available content</action>
  <action>Continue with available data</action>
</check>
</step>

<step n="5" goal="Display handoff summary in actionable format">
<action>Extract key information and display formatted summary:</action>

<example>
# 📬 Handoff Received

**From:** [Previous agent/phase]
**To:** [Target agent - you]
**Date:** [Handoff date]

---

## ✅ What Was Just Completed

[Brief summary from "Work Just Completed" section]

---

## 🎯 Your Task

[Extract from "Your Task" section]

**Command to run:** `[NEXT_COMMAND]`

---

## 🔑 Key Context (Quick Reference)

[Extract top 3-5 points from "Key Context You Need"]

---

## 📁 Files to Review

**PRIMARY (Must read):**

- [File 1]
- [File 2]

**REFERENCE:**

- [File 3]
- [File 4]

---

## ✓ Success Criteria

[Extract from "Success Criteria" section]

---

## 🚀 Ready to Start?

1. Review the files listed above
2. [Next specific action from "Next Steps"]
3. Execute: `[NEXT_COMMAND]`

---

**Full handoff details in memory:** `[memory-name]`
</example>

<action>Present information in scannable, actionable format</action>
<action>Focus on what the current agent needs to DO</action>
</step>

<step n="6" goal="Offer next actions to user">
<action>Present options:</action>

<example>
What would you like to do?

1. **Read a specific file** - I can read any file from the "Files to Review" list
2. **Proceed with the task** - Execute the next command/action
3. **Ask questions** - Clarify anything about the handoff
4. **Read full handoff** - See the complete handoff memory again

Or just tell me what to do next!
</example>

<action>Wait for user response and proceed accordingly</action>
</step>

</workflow>

## Important Execution Notes

### Selection Algorithm

- Sort by timestamp (newest first)
- Support both new (YYYY-MM-DD-HHmmss) and legacy (YYYY-MM-DD) formats
- Auto-select when clear, prompt user when ambiguous

### BMAD Integration

This workflow works seamlessly with:

- **`/handoff`** - Creates the handoff memory
- **`/workflow-status`** - Provides current state and next action
- **BMAD agents** - Standard agent handoff protocol

### Error Recovery

- **No handoffs found**: Provide clear troubleshooting and recovery options
- **Multiple handoffs**: Auto-select most recent or present numbered list
- **Incomplete handoff**: Show warning but continue with available content
- **Read failure**: Clear error message with actionable next steps

### Version Compatibility

- Tested with: BMAD v6.x
- Requires: Serena MCP for memory persistence
- Compatible with: /handoff command and /workflow-status (BMAD v6+)
- Backward compatible: Supports both timestamped and legacy formats

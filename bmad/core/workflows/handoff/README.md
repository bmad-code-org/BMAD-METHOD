# Agent Handoff Workflow

**Purpose:** Create comprehensive handoff memory for the next agent and save it to Serena.

## Overview

The `handoff` workflow enables seamless context preservation between AI agent sessions by creating structured handoff memories. It reads the current workflow status, validates required fields, generates a comprehensive handoff document, and saves it to Serena with collision-proof timestamped naming.

## Features

- **Automatic workflow status reading** - Extracts project state and next agent info
- **Field validation** - Ensures all required fields are present before proceeding
- **Comprehensive context capture** - Includes work completed, files to review, success criteria
- **Timestamped naming** - Prevents collisions with format: `[agent]-handoff-YYYY-MM-DD-HHmmss`
- **Serena integration** - Persistent storage across sessions
- **BMAD integration** - Complements `/workflow-status` command
- **Error recovery** - Graceful handling of missing files or fields

## How to Invoke

From any BMAD-enabled session:

```
workflow handoff
```

Or if using the compiled command:

```
/handoff
```

## Requirements

### Dependencies:

- **Serena MCP** - Must be installed and configured
  - `mcp__serena__activate_project`
  - `mcp__serena__write_memory`
- **Workflow status file** - `docs/bmm-workflow-status.md` must exist

### Required Workflow Status Fields:

- `PROJECT_NAME` (required)
- `CURRENT_PHASE` (required)
- `NEXT_AGENT` (required)
- `NEXT_COMMAND` (optional - defaults to "Begin next phase")

## Workflow Steps

1. **Validate workflow status file** - Ensures file exists and has required fields
2. **Read workflow status** - Extract project metadata and next agent info
3. **Extract completed work** - From status file or infer from context
4. **Activate Serena project** - Prepare for memory storage
5. **Validate required fields** - Confirm all critical data is present
6. **Generate handoff memory** - Create structured handoff document
7. **Save to Serena** - Store with timestamped collision-proof name
8. **Output next agent prompt** - Ready-to-use prompt for next session

## Expected Inputs

- **Workflow status file:** `{output_folder}/bmm-workflow-status.md`
- **Current conversation context:** Used to infer completed work

## Generated Outputs

### Serena Memory:

- **Name pattern:** `[next-agent]-handoff-YYYY-MM-DD-HHmmss`
- **Example:** `dev-handoff-2025-10-20-143530`

### Handoff Memory Contains:

- Header metadata (date, from, to, command)
- Work just completed summary
- Current project state
- Task for next agent
- Key context (3-5 critical items)
- Files to review (categorized)
- Success criteria (measurable)
- Next steps
- Important reminders

### Terminal Output:

- Confirmation message with memory name
- Ready-to-use prompt for next session
- Quick version command suggestion

## Integration with BMAD

This workflow complements the BMAD `/workflow-status` command:

- **`/workflow-status`** - Check current state and next recommended action
- **`/handoff`** - Save detailed context for next agent (this workflow)
- **`/handoff-receive`** - Load handoff and display actionable summary

Together they enable seamless agent-to-agent context preservation throughout the BMAD workflow lifecycle.

## Example Usage

### Step 1: Current agent completes their work

```
User: /handoff
```

### Step 2: Workflow executes automatically

- Reads workflow status
- Validates fields
- Generates comprehensive handoff
- Saves to Serena

### Step 3: Agent outputs prompt

```
✅ Handoff memory saved to Serena: dev-handoff-2025-10-20-143530

📋 Copy/paste this prompt for the next session:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Read Serena memory: dev-handoff-2025-10-20-143530

Then execute the handoff.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Quick version: /handoff-receive
```

### Step 4: Next agent receives the handoff

In a new session:

```
User: /handoff-receive
```

## Error Handling

### Missing workflow status file:

```
⚠️ Workflow status file not found or invalid.
Suggestion: Run workflow initialization command or create the file manually
```

### Missing required fields:

```
⚠️ Missing required field: PROJECT_NAME
Continue with placeholder value or cancel? (continue/cancel)
```

### Serena MCP unavailable:

```
⚠️ Failed to activate Serena project.
Troubleshooting: Check Serena MCP server status and configuration
```

## Version Information

- **Version:** 1.0.0
- **BMAD Version:** 6.0.0-alpha.0
- **Author:** BMad Core
- **Requires:** Serena MCP
- **Type:** Action workflow (no document generation)

## Files in This Workflow

```
bmad/core/workflows/handoff/
├── workflow.yaml       # Workflow configuration
├── instructions.md     # Step-by-step execution guide
└── README.md          # This file
```

## Related Workflows

- **`handoff-receive`** - Companion workflow for loading handoffs
- **`workflow-status`** - Check current BMAD workflow state

## Troubleshooting

### Handoff not saving:

1. Verify Serena MCP is installed and running
2. Check project activation status
3. Ensure write permissions to memory store

### Fields not found:

1. Verify workflow status file format
2. Check field names match exactly
3. Update workflow status file with required fields

### Naming collisions:

- Impossible with timestamped format (HHmmss precision)
- If using legacy format, upgrade to timestamped version

## Next Steps After Creating Workflow

1. **Test the workflow** - Run in a real session
2. **Verify Serena integration** - Confirm memories are saved
3. **Test with handoff-receive** - Ensure full round-trip works
4. **Update documentation** - Add project-specific context if needed

---

**Ready to preserve context and enable seamless agent handoffs!** 🚀

# Agent Handoff Receive Workflow

**Purpose:** Receive and process a handoff from the previous agent by reading the most recent handoff memory from Serena.

## Overview

The `handoff-receive` workflow enables seamless context loading when starting work after an agent handoff. It automatically finds the most recent handoff memory, validates its structure, and displays an actionable summary with task description, key context, files to review, and success criteria.

## Features

- **Automatic handoff discovery** - Finds most recent handoff using smart selection algorithm
- **Timestamp-based sorting** - Prioritizes newest handoffs first
- **Format compatibility** - Supports both new (timestamped) and legacy (date-only) formats
- **Smart selection** - Matches agent names with current phase when possible
- **Structure validation** - Ensures handoff is complete before displaying
- **Clean, actionable display** - Focuses on what to do next
- **Interactive menu** - Offers next actions after loading
- **Error recovery** - Graceful handling of missing or incomplete handoffs

## How to Invoke

From any BMAD-enabled session:

```
workflow handoff-receive
```

Or if using the compiled command:

```
/handoff-receive
```

## Requirements

### Dependencies:

- **Serena MCP** - Must be installed and configured
  - `mcp__serena__activate_project`
  - `mcp__serena__list_memories`
  - `mcp__serena__read_memory`

### Prerequisites:

- At least one handoff memory created by `/handoff` workflow
- Serena project activated for current directory

## Workflow Steps

1. **Activate Serena project** - Prepare for memory access
2. **List available handoff memories** - Find all handoffs in project
3. **Find most recent handoff** - Apply selection precedence algorithm
4. **Read handoff memory** - Load the selected handoff
5. **Validate handoff structure** - Ensure required sections present
6. **Display clean summary** - Show actionable handoff information
7. **Offer next actions** - Present menu of options

## Selection Algorithm

The workflow uses intelligent precedence to select the best handoff:

### Priority Order:

1. **Most recent timestamp** (newest first)
   - New format: Parse `YYYY-MM-DD-HHmmss`
   - Legacy format: Parse `YYYY-MM-DD` (time = 00:00:00)

2. **Agent name match** (if timestamps equal)
   - Prefer handoff where agent matches current workflow phase
   - Example: In "development" phase, prefer `dev-handoff-*`

3. **User manual selection** (if multiple matches)
   - Present numbered list
   - Include timestamps and agent names
   - Allow selection by number or agent name

### Example Ordering:

```
1. dev-handoff-2025-10-20-150000 (Oct 20, 3:00 PM) ← Auto-selected (newest)
2. sm-handoff-2025-10-20-143000 (Oct 20, 2:30 PM)
3. architect-handoff-2025-10-19-161530 (Oct 19, 4:15 PM)
4. dev-handoff-2025-10-19 (Oct 19, legacy format)
```

## Expected Inputs

- **Handoff memories** - Created by `/handoff` workflow
- **Memory naming patterns:**
  - New: `*-handoff-YYYY-MM-DD-HHmmss`
  - Legacy: `*-handoff-YYYY-MM-DD`

## Generated Outputs

### Terminal Display:

```markdown
# 📬 Handoff Received

**From:** [Previous agent/phase]
**To:** [Target agent - you]
**Date:** [Handoff date]

---

## ✅ What Was Just Completed

[Summary of completed work]

## 🎯 Your Task

[Task description and command to run]

## 🔑 Key Context (Quick Reference)

[Top 3-5 critical context points]

## 📁 Files to Review

**PRIMARY (Must read):** [Critical files]
**REFERENCE (For context):** [Supporting files]
**CONTEXT (For understanding):** [Background files]

## ✓ Success Criteria

[Measurable completion criteria]

## 🚀 Next Steps

[Immediate actions to take]
```

### Interactive Menu:

```
What would you like to do next?

1. Proceed with task - Execute the next command/action
2. Read specific file - Read any file from the list
3. Ask questions - Clarify anything about the handoff
4. Read full handoff - See complete handoff memory
5. List all handoffs - View other available handoffs

Or just tell me what to do!
```

## Integration with BMAD

This workflow complements the BMAD ecosystem:

- **`/handoff`** - Creates the handoff memory (companion workflow)
- **`/workflow-status`** - Provides current state context
- **BMAD agents** - Standard agent handoff protocol

Together they enable seamless context preservation throughout the BMAD workflow lifecycle.

## Example Usage

### Scenario: Starting work after a handoff

#### Step 1: User loads the handoff

```
User: /handoff-receive
```

#### Step 2: Workflow executes automatically

- Activates Serena project
- Finds most recent handoff: `dev-handoff-2025-10-20-143530`
- Loads and validates the handoff
- Displays clean summary

#### Step 3: User sees actionable summary

```
# 📬 Handoff Received

**From:** Architecture Phase
**To:** DEV Agent
**Date:** 2025-10-20

## ✅ What Was Just Completed
Comprehensive architecture design completed including:
- System component diagram
- API specifications
- Database schema
...

## 🎯 Your Task
Implement the authentication system based on the architecture design.

**Command to run:** `workflow implement-auth`

[... rest of summary ...]
```

#### Step 4: User chooses action

```
What would you like to do next?
1. Proceed with task
2. Read specific file
...

User: 1
```

#### Step 5: Work begins with full context

Workflow transitions seamlessly into the task described in the handoff.

## Error Handling

### No handoff memories found:

```
⚠️ No handoff memories found in Serena.

Recovery options:
a) List all Serena memories
b) Check project activation
c) Create new handoff in previous session
d) Manual search for memories containing 'handoff'

Would you like me to:
1. List all available memories?
2. Show current Serena project?
3. Exit and create a handoff first?
```

### Multiple handoffs from same time:

```
📋 Multiple handoffs found:
1. dev-handoff-2025-10-20-143000 (Development phase)
2. sm-handoff-2025-10-20-143000 (Story mapping phase)

Which one would you like to receive? (Enter number or agent name)
```

### Incomplete handoff:

```
⚠️ Handoff memory incomplete - missing: Success Criteria

Will display available content, but handoff may be incomplete.

[Continues with available data]
```

### Serena MCP unavailable:

```
⚠️ Failed to activate Serena project.

Troubleshooting:
1. Check Serena MCP server status
2. Verify project directory is correct
3. Ensure Serena configuration is valid
```

## Supported Formats

### New Format (Preferred):

- **Pattern:** `[agent]-handoff-YYYY-MM-DD-HHmmss`
- **Example:** `dev-handoff-2025-10-20-143530`
- **Benefits:** Collision-proof, precise sorting, multiple per day

### Legacy Format (Backward Compatible):

- **Pattern:** `[agent]-handoff-YYYY-MM-DD`
- **Example:** `architect-handoff-2025-10-19`
- **Handling:** Time treated as 00:00:00 for sorting

## Version Information

- **Version:** 1.0.0
- **BMAD Version:** 6.0.0-alpha.0
- **Author:** BMad Core
- **Requires:** Serena MCP
- **Type:** Action workflow (no document generation)
- **Backward Compatible:** Yes (supports legacy format)

## Files in This Workflow

```
bmad/core/workflows/handoff-receive/
├── workflow.yaml       # Workflow configuration
├── instructions.md     # Step-by-step execution guide
└── README.md          # This file
```

## Related Workflows

- **`handoff`** - Companion workflow for creating handoffs
- **`workflow-status`** - Check current BMAD workflow state

## Troubleshooting

### Can't find handoff:

1. Verify handoff was created with `/handoff` workflow
2. Check Serena project is activated
3. List all memories to find non-standard naming
4. Ensure you're in the correct project directory

### Wrong handoff loaded:

1. Check timestamp - workflow selects most recent
2. If multiple from same time, select manually
3. Use option 5 to list all handoffs and choose different one

### Handoff incomplete:

1. Workflow will display warning about missing sections
2. Shows available content anyway
3. Consider recreating handoff in previous session

## Next Steps After Receiving Workflow

1. **Review the summary** - Understand task and context
2. **Check files to review** - Read critical files first
3. **Proceed with task** - Execute the command/action
4. **Keep context available** - Handoff remains accessible throughout session

---

**Ready to seamlessly receive context and start work immediately!** 🚀

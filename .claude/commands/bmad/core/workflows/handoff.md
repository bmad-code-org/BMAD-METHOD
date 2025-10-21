# Agent Handoff Command

Create a comprehensive handoff memory for the next agent and save it to Serena.

## Instructions

Follow these steps in order:

### Step 0.5: Validate Workflow Status File

Before proceeding, verify the workflow status file exists and is valid:

1. Check if `docs/bmm-workflow-status.md` exists
2. Verify it contains required fields: PROJECT_NAME, CURRENT_PHASE, NEXT_AGENT
3. If missing or invalid:
   - Display error: "⚠️ Workflow status file not found or invalid. Initialize BMAD workflow first."
   - Suggest: Run workflow initialization command or create the file manually
   - EXIT (do not proceed)

### Step 1: Read Workflow Status

Read the file `docs/bmm-workflow-status.md` to extract:

- PROJECT_NAME
- PROJECT_TYPE
- PROJECT_LEVEL
- FIELD_TYPE
- CURRENT_PHASE
- NEXT_AGENT
- NEXT_COMMAND
- NEXT_ACTION

### Step 2: Extract Completed Work

From the workflow status file, extract the most recent entry from the "Completed Work" section.
This will be what was just completed.

If the "Completed Work" section is empty or unclear, infer from:

- CURRENT_WORKFLOW field
- The conversation context (what you just finished doing)

### Step 3: Activate Serena Project

Run: `mcp__serena__activate_project` with the current project directory.

### Step 3.5: Validate Required Fields

Before generating handoff memory, verify all required fields were extracted successfully:

- **PROJECT_NAME** (required)
- **CURRENT_PHASE** (required)
- **NEXT_AGENT** (required)
- **NEXT_COMMAND** (optional - defaults to "Begin next phase")

If any required field is missing:

1. Display warning: "⚠️ Missing required field: [FIELD_NAME]"
2. Ask user: "Continue with placeholder value '[FIELD_NAME]' or cancel? (y/N)"
3. If user cancels, EXIT

### Step 4: Generate Handoff Memory

Create a structured handoff memory with this format:

```markdown
# [NEXT_AGENT] Agent Handoff - [PROJECT_NAME]

**Date:** [Today's date]
**From:** [CURRENT_PHASE]
**To:** [NEXT_AGENT] Agent
**Command:** [NEXT_COMMAND]

---

## Work Just Completed

[Extract from workflow status "Completed Work" section or infer from CURRENT_WORKFLOW and conversation context]

---

## Current Project State

**Project:** [PROJECT_NAME]
**Type:** [PROJECT_TYPE] ([FIELD_TYPE])
**Level:** [PROJECT_LEVEL]
**Current Phase:** [CURRENT_PHASE]

**Workflow Status:** `docs/bmm-workflow-status.md`

**Note:** This handoff complements the BMAD `/workflow-status` command:

- `/workflow-status`: Check current state and next recommended action
- `/handoff`: Save detailed context for next agent (status + completion summary + files + success criteria)
- `/handoff-receive`: Load handoff and display actionable summary

---

## Your Task

[NEXT_ACTION]

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
```

### Step 5: Save to Serena

Use `mcp__serena__write_memory` to save the handoff memory.

**Memory name:** `[next-agent]-handoff-YYYY-MM-DD-HHmmss`
(e.g., `architect-handoff-2025-10-19-161530`)

**Timestamp format:** Use 24-hour format HHmmss to ensure unique naming even with multiple handoffs per day.

**Content:** The complete handoff memory from Step 4.

### Step 6: Output Next Agent Prompt

After saving to Serena, output this message for the user:

```
✅ Handoff memory saved to Serena: [memory-name]

📋 Copy/paste this prompt for the next session:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Read Serena memory: [memory-name]

Then execute the handoff.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Quick version: /handoff-receive
```

## Important Notes

- Keep the handoff memory focused and actionable
- Include only information the next agent actually needs
- List specific file paths, not vague descriptions
- Make success criteria clear and measurable
- Be concise but comprehensive
- Validate workflow status file before proceeding
- Use timestamped memory names to prevent collisions

## BMAD Integration

This command complements the BMAD `/workflow-status` command:

- **Use `/workflow-status`** to check current state and next recommended action
- **Use `/handoff`** when switching agents to save comprehensive context
- **Both work together** - workflow-status for state tracking, handoff for detailed context preservation

## Version Compatibility

- **Tested with:** BMAD v6.x
- **Requires:** Serena MCP for memory persistence
- **Compatible with:** `/workflow-status` command (BMAD v6+)

## Example Usage

User runs: `/handoff`

You:

1. Read workflow status
2. Extract completed work from status file (or infer from context)
3. Generate handoff memory based on next agent's needs
4. Save to Serena
5. Output ready-to-use prompt for next agent

Done!

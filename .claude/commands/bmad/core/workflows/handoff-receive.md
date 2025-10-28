# Agent Handoff Receive Command

Receive and process a handoff from the previous agent by reading the most recent handoff memory from Serena.

## Instructions

Follow these steps in order:

### Step 1: Activate Serena Project

Run: `mcp__serena__activate_project` with the current project directory.

### Step 2: List Available Handoff Memories

Run: `mcp__serena__list_memories` to get all available memories.

From the results, identify all memories matching the pattern: `*-handoff-YYYY-MM-DD-HHmmss` or legacy pattern `*-handoff-YYYY-MM-DD`

### Step 3: Find Most Recent Handoff

Select the most recent handoff using this precedence algorithm:

1. **Sort by timestamp**: Parse YYYY-MM-DD-HHmmss from filename (newest first)
   - For legacy files (YYYY-MM-DD only), treat time as 00:00:00
2. **If timestamps equal**: Prefer agent-specific handoff matching current workflow phase
3. **If multiple matches**: Present numbered list to user for manual selection

**Example ordering (newest first):**

- `dev-handoff-2025-10-20-150000` ← Select this (most recent)
- `sm-handoff-2025-10-20-143000`
- `architect-handoff-2025-10-19-161530`
- `dev-handoff-2025-10-19` (legacy format)

**Common handoff memory patterns:**

- New format: `architect-handoff-2025-10-19-161530`
- Legacy format: `architect-handoff-2025-10-19`

### Step 4: Read the Handoff Memory

Run: `mcp__serena__read_memory` with the identified handoff memory name.

### Step 4.5: Validate Handoff Structure

Before displaying, verify the handoff memory contains required sections:

- "Work Just Completed" section
- "Your Task" section
- "Success Criteria" section

If any section is missing or malformed:

- Display warning: "⚠️ Handoff memory incomplete - missing: [SECTION_NAME]"
- Show available content
- Continue with available data

### Step 5: Display Handoff Summary

Extract and display key information in a clean format:

```markdown
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

[List the key files from "Files to Review" section]

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
```

### Step 6: Offer Next Actions

After displaying the summary, present these options to the user:

```
What would you like to do?

1. **Read a specific file** - I can read any file from the "Files to Review" list
2. **Proceed with the task** - Execute the next command/action
3. **Ask questions** - Clarify anything about the handoff
4. **Read full handoff** - See the complete handoff memory again

Or just tell me what to do next!
```

## Error Handling

**If no handoff memories found:**

```
⚠️ No handoff memories found in Serena.

This could mean:
1. No handoff was created yet (run /handoff first in previous session)
2. Wrong project activated (check current directory)
3. Handoff memory has a different naming pattern

Recovery options:
a) List all Serena memories: mcp__serena__list_memories
b) Check project activation: mcp__serena__get_current_config
c) Create new handoff in previous agent session
d) Manual search: Look for memories containing 'handoff'

Would you like me to:
- List all available memories?
- Show current Serena project?
```

**If multiple handoffs from same date:**

```
📋 Multiple handoffs found:
1. dev-handoff-2025-10-20-150000 (3:00 PM)
2. sm-handoff-2025-10-20-143000 (2:30 PM)
3. architect-handoff-2025-10-19-161530 (4:15 PM)

Which one would you like to receive? (Enter number or agent name)

Default: Will select #1 (most recent) in 5 seconds...
```

## Important Notes

- This command is **fully automated** - no user input required unless multiple handoffs exist
- Always read the most recent handoff by default (latest timestamp)
- Present information in a scannable, actionable format
- Focus on what the current agent needs to DO, not historical context
- Make it easy to jump directly into work
- Validates handoff structure before displaying
- Supports both new (timestamped) and legacy (date-only) formats

## BMAD Integration

This command complements the BMAD `/workflow-status` command:

- **Use `/workflow-status`** to check current state and next recommended action
- **Use `/handoff-receive`** when starting work after an agent handoff
- **Both work together** - workflow-status for state tracking, handoff-receive for detailed context

## Version Compatibility

- **Tested with:** BMAD v6.x
- **Requires:** Serena MCP for memory persistence
- **Compatible with:** `/handoff` command and `/workflow-status` (BMAD v6+)
- **Backward compatible:** Supports both timestamped and legacy date-only formats

## Example Usage

User runs: `/handoff-receive`

You:

1. Activate Serena project
2. Find most recent handoff memory (e.g., `sm-handoff-2025-10-19`)
3. Read it
4. Display clean summary with task, context, files, success criteria
5. Offer next actions

User can immediately start working with clear understanding of what to do.

---

**Purpose:** Seamlessly receive context from previous agent and start work immediately.

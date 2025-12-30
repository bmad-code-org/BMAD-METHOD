---
description: "Generates continuation prompt"
prerequisites: "—"
argument-hint: "[optional: focus_area]"
---

# Generate Session Continuation Prompt

You are creating a comprehensive prompt that can be used to continue work in a new Claude Code session. Focus on what was being worked on, what was accomplished, and what needs to be done next.

## Context Capture Instructions

Create a detailed continuation prompt that includes:

### 1. Session Summary

- **Main Task/Goal**: What was the primary objective of this session?
- **Work Completed**: List the key accomplishments and changes made
- **Current Status**: Where things stand right now

### 2. Next Steps

- **Immediate Priorities**: What should be tackled first in the next session?
- **Pending Tasks**: Any unfinished items that need attention
- **Blockers/Issues**: Any problems encountered that need resolution

### 3. Important Context

- **Key Files Modified**: List the most important files that were changed
- **Critical Information**: Any warnings, gotchas, or important discoveries
- **Dependencies**: Any tools, commands, or setup requirements

### 4. Validation Commands

- **Test Commands**: Specific commands to verify the current state
- **Quality Checks**: Commands to ensure everything is working properly

## Format the Output as a Ready-to-Use Prompt

Generate the continuation prompt in this format:

```text

## Continuing Work on: [Project/Task Name]

### Previous Session Summary

[Brief overview of what was being worked on and why]

### Progress Achieved

- ✅ [Completed item 1]
- ✅ [Completed item 2]
- 🔄 [In-progress item]
- ⏳ [Pending item]

### Current State

[Description of where things stand, any important context]

### Next Steps (Priority Order)

1. [Most important next task with specific details]
2. [Second priority with context]
3. [Additional tasks as needed]

### Important Files/Areas

- `path/to/important/file.py` - [Why it's important]
- `another/critical/file.md` - [What needs attention]

### Commands to Run

```bash

# Verify current state

[specific command]

# Continue work

[specific command]

```text

### Notes/Warnings

- ⚠️ [Any critical warnings or gotchas]
- 💡 [Helpful tips or discoveries]

### Request

Please continue working on [specific task/goal]. The immediate focus should be on [specific priority].

```text

## Process the Arguments

If "$ARGUMENTS" is provided (e.g., "testing", "epic-4", "coverage"), tailor the continuation prompt to focus on that specific area.

## Make it Actionable

The generated prompt should be:

- **Self-contained**: Someone reading it should understand the full context
- **Specific**: Include exact file paths, command names, and clear objectives
- **Actionable**: Clear next steps that can be immediately executed
- **Focused**: Prioritize what's most important for the next session

Generate this continuation prompt now based on the current session's context and work.

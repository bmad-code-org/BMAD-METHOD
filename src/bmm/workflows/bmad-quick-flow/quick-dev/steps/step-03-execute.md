---
name: 'step-03-execute'
description: 'Execute implementation - iterate through tasks, write code, run tests'

nextStepFile: './step-04-self-check.md'
---

# Step 3: Execute Implementation

**Goal:** Implement all tasks, write tests, follow patterns, handle errors.

**Critical:** Continue through ALL tasks without stopping for milestones.

---

## AVAILABLE STATE

From previous steps:

- `{baseline_commit}` - Git HEAD at workflow start
- `{execution_mode}` - "tech-spec" or "direct"
- `{tech_spec_path}` - Tech-spec file (if Mode A)
- `{project_context}` - Project patterns (if exists)

From context:

- Mode A: Tasks and AC extracted from tech-spec
- Mode B: Tasks and AC from step-02 mental plan

---

## LOAD CAPABILITIES

Load platform capabilities from `{project-root}/_bmad/_config/ides/*.yaml`. Read the `capabilities` block to determine available features. Store as `{capabilities}` for use in subsequent sections.

Relevant flags:

- `{capabilities.sub_agents}` - Can the IDE launch sub-agents for delegated work?
- `{capabilities.task_tracking}` - Does the IDE have built-in task management tools?
- `{capabilities.structured_ask}` - Does the IDE have a dedicated tool for prompting users?

---

## REGISTER TASKS

If `{capabilities.task_tracking}` available: Register all identified tasks for structured progress tracking. For Mode A, use tasks from the tech-spec. For Mode B, use tasks from the mental plan. For each task, call TaskCreate with a description and `pending` status. Throughout execution, call TaskUpdate to set `in_progress` when starting and `completed` when done.

Otherwise: Track progress by marking checkboxes in the document as tasks are completed.

---

## EXECUTION LOOP

If `{capabilities.sub_agents}` available, the main session acts as **orchestrator** -- delegate actual implementation to agents, do not implement directly. If not available, implement directly in the main session.

For each task:

### 1. Select Agent (when sub_agents available)

- Identify target file types and task nature
- Check for a specialized agent whose description matches (scan both global and project-level `.claude/agents/` directories or equivalent)
- If a specialized agent matches, use it
- If no match, use a general-purpose agent

### 2. Update Tracking

- If `{capabilities.task_tracking}` available: Call TaskUpdate to set `in_progress`
- Otherwise: Note task start

### 3. Delegate / Implement

**If sub_agents available:** Launch agent with a detailed prompt containing:

- Exact task description and acceptance criteria
- Target file paths
- Relevant patterns from project-context
- Project conventions (CLAUDE.md, etc.)
- Instruction to write tests and confirm they pass

**If sub_agents not available:** Implement directly:

- Read files relevant to this task
- Follow existing patterns and conventions
- Write code, handle errors appropriately
- Add comments where non-obvious
- Write tests if appropriate for the change

### 4. Test

- Write tests if appropriate for the change
- Run existing tests to catch regressions
- Verify the specific AC for this task

### 5. Validate and Mark Complete

- If sub_agents available: Verify agent's result matches the task spec and tests pass
- Confirm all tests pass (new and existing)
- If `{capabilities.task_tracking}` available: Call TaskUpdate to set `completed`
- Check off task: `- [x] Task N`
- Continue to next task immediately

---

## HALT CONDITIONS

**HALT and request guidance if:**

- 3 consecutive failures on same task
- Tests fail and fix is not obvious
- Blocking dependency discovered
- Ambiguity that requires user decision

**Do NOT halt for:**

- Minor issues that can be noted and continued
- Warnings that don't block functionality
- Style preferences (follow existing patterns)

---

## CONTINUOUS EXECUTION

**Critical:** Do not stop between tasks for approval.

- Execute all tasks in sequence
- Only halt for blocking issues
- Tests failing = fix before continuing
- Track all completed work for self-check

---

## NEXT STEP

When ALL tasks are complete (or halted on blocker), read fully and follow: `{project-root}/_bmad/bmm/workflows/bmad-quick-flow/quick-dev/steps/step-04-self-check.md`.

---

## SUCCESS METRICS

- All tasks attempted
- Code follows existing patterns
- Error handling appropriate
- Tests written where appropriate
- Tests passing
- No unnecessary halts
- If sub_agents available: All tasks delegated to appropriate agents (specialized when matching, general-purpose otherwise)
- If task_tracking available: All tasks registered, updated through lifecycle, and marked completed

## FAILURE MODES

- Stopping for approval between tasks
- Ignoring existing patterns
- Not running tests after changes
- Giving up after first failure
- Not following project-context rules (if exists)
- Implementing directly when sub_agents are available (orchestrator should delegate)
- Delegating without verifying agent results match task spec
- Not registering or updating task status when task_tracking is available

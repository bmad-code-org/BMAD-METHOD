---
name: 'step-02-create-story'
description: 'Create detailed story file from epic definition with research'

# Path Definitions
workflow_path: '{project-root}/_bmad/bmm/workflows/4-implementation/story-pipeline'

# File References
thisStepFile: '{workflow_path}/steps/step-02-create-story.md'
nextStepFile: '{workflow_path}/steps/step-03-validate-story.md'
checklist: '{workflow_path}/checklists/story-creation.md'

# Role Switch
role: sm
agentFile: '{project-root}/_bmad/bmm/agents/sm.md'
---

# Step 2: Create Story

## ROLE SWITCH

**Switching to SM (Scrum Master) perspective.**

You are now the Scrum Master facilitating story creation. Your expertise:
- User story structure and acceptance criteria
- BDD scenario writing (Given/When/Then)
- Task breakdown and estimation
- Ensuring testability of requirements

## STEP GOAL

Create a detailed, implementation-ready story file:
1. Research best practices for the domain
2. Extract story definition from epic
3. Write clear acceptance criteria with BDD scenarios
4. Define tasks and subtasks
5. Ensure all criteria are testable

## MANDATORY EXECUTION RULES

### Role-Specific Rules

- **THINK** like a product/process expert, not a developer
- **FOCUS** on WHAT, not HOW (implementation comes later)
- **ENSURE** every AC is testable and measurable
- **AVOID** technical implementation details in AC

### Step-Specific Rules

- **SKIP** this step if story file already exists (check cached context)
- **RESEARCH** best practices before writing
- **USE** project-context.md patterns for consistency
- **CREATE** file at `{sprint_artifacts}/story-{story_id}.md`

## EXECUTION SEQUENCE

### 1. Check if Story Already Exists

From cached context, check `story_file_exists`:

**If story file exists:**
- Read and display existing story summary
- Ask: "Story file exists. [V]alidate existing, [R]ecreate from scratch?"
- If V: Proceed to step-03-validate-story.md
- If R: Continue with story creation (will overwrite)

**If story does not exist:**
- Continue with creation

### 2. Research Phase (MCP Tools)

Use MCP tools for domain research:

```
mcp__exa__web_search_exa:
  query: "user story acceptance criteria best practices agile {domain}"

mcp__exa__get_code_context_exa:
  query: "{technology} implementation patterns"
```

**Extract from research:**
- AC writing best practices
- Common patterns for this domain
- Anti-patterns to avoid

### 3. Load Epic Definition

From cached epic file, extract for story {story_id}:
- Story title and description
- User persona
- Business value
- Initial AC ideas
- BDD scenarios if present

### 4. Generate Story Content

Create story file following template:

```markdown
---
id: story-{story_id}
epic: {epic_num}
title: "{story_title}"
status: draft
created_at: {timestamp}
---

# Story {story_id}: {story_title}

## User Story

As a [persona],
I want to [action],
So that [benefit].

## Acceptance Criteria

### AC1: [Criterion Name]

**Given** [precondition]
**When** [action]
**Then** [expected result]

**Test Scenarios:**
- [ ] Scenario 1: [description]
- [ ] Scenario 2: [description]

### AC2: [Criterion Name]
...

## Tasks

### Task 1: [Task Name]
- [ ] Subtask 1.1
- [ ] Subtask 1.2

### Task 2: [Task Name]
...

## Technical Notes

### Database Changes
- [any schema changes needed]

### API Changes
- [any endpoint changes]

### UI Changes
- [any frontend changes]

## Dependencies
- [list any dependencies on other stories or systems]

## Out of Scope
- [explicitly list what is NOT included]
```

### 5. Verify Story Quality

Before saving, verify:
- [ ] All AC have Given/When/Then format
- [ ] Each AC has at least 2 test scenarios
- [ ] Tasks cover all AC implementation
- [ ] No implementation details in AC (WHAT not HOW)
- [ ] Out of scope is defined
- [ ] Dependencies listed if any

### 6. Save Story File

Write to: `{sprint_artifacts}/story-{story_id}.md`

Update state file:
- `cached_context.story_file_exists: true`
- `cached_context.story_file_path: {path}`

### 7. Update Pipeline State

Update state file:
- Add `2` to `stepsCompleted`
- Set `lastStep: 2`
- Set `steps.step-02-create-story.status: completed`
- Set `steps.step-02-create-story.duration: {duration}`

### 8. Present Summary and Menu

Display:
```
Story {story_id} Created

Title: {story_title}
Acceptance Criteria: {count}
Test Scenarios: {count}
Tasks: {count}

File: {story_file_path}
```

**Interactive Mode Menu:**
```
[C] Continue to Validation
[E] Edit story manually
[R] Regenerate story
[H] Halt pipeline
```

**Batch Mode:** Auto-continue to next step.

## QUALITY GATE

Before proceeding:
- [ ] Story file created at correct location
- [ ] All AC in Given/When/Then format
- [ ] Test scenarios defined for each AC
- [ ] Tasks cover full implementation scope
- [ ] File passes frontmatter validation

## MCP TOOLS AVAILABLE

- `mcp__exa__web_search_exa` - Research best practices
- `mcp__exa__get_code_context_exa` - Tech pattern research

## CRITICAL STEP COMPLETION

**ONLY WHEN** [story file created AND quality gate passed AND state updated],
load and execute `{nextStepFile}` for adversarial validation.

---

## SUCCESS/FAILURE METRICS

### ✅ SUCCESS
- Story file created with proper structure
- All AC have BDD format
- Test scenarios cover all AC
- Research insights incorporated
- State file updated correctly

### ❌ FAILURE
- Story file not created or in wrong location
- AC without Given/When/Then format
- Missing test scenarios
- Including implementation details in AC
- Not updating state before proceeding

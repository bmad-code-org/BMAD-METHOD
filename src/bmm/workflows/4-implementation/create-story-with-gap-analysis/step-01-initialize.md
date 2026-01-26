# Step 1: Initialize and Extract Story Requirements

## Goal
Load epic context and identify what needs to be scanned in the codebase.

## Execution

### 1. Determine Story to Create

**Ask user:**
```
Which story should I regenerate with gap analysis?

Options:
1. Provide story number (e.g., "1.9" or "1-9")
2. Provide story filename (e.g., "story-1.9.md" or legacy "1-9-admin-user-service-bridgeid-rbac.md")

Your choice:
```

**Parse input:**
- Extract epic_num (e.g., "1")
- Extract story_num (e.g., "9")
- Locate story file: `{story_dir}/story-{epic_num}.{story_num}.md` (fallback: `{story_dir}/{epic_num}-{story_num}-*.md`)

### 2. Load Existing Story Content

```bash
Read: {story_dir}/story-{epic_num}.{story_num}.md
# If not found, fallback:
Read: {story_dir}/{epic_num}-{story_num}-*.md
```

**Extract from existing story:**
- Story title
- User story text (As a... I want... So that...)
- Acceptance criteria (the requirements, not checkboxes)
- Any existing Dev Notes or technical context

**Store for later use.**

### 3. Load Epic Context

```bash
Read: {planning_artifacts}/epics.md
```

**Extract from epic:**
- Epic business objectives
- This story's original requirements
- Technical constraints
- Dependencies on other stories

### 4. Determine Target Directories

**From story title and requirements, identify:**
- Which service/app this story targets
- Which directories to scan

**Examples:**
- "admin-user-service" → `apps/backend/admin-user-service/`
- "Widget Batch 1" → `packages/widgets/`
- "POE Integration" → `apps/frontend/web/`

**Store target directories for Step 2 codebase scan.**

### 5. Ready for Codebase Scan

**Output:**
```
✅ Story Context Loaded

Story: {epic_num}.{story_num} - {title}
Target directories identified:
  - {directory_1}
  - {directory_2}

Ready to scan codebase for gap analysis.

[C] Continue to Codebase Scan
```

**WAIT for user to select Continue.**

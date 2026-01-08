# BMAD Workflow Improvements - Lessons from Batch Execution

**Date:** 2026-01-08
**Context:** Batch-super-dev tried to regenerate 14 skeleton stories but failed
**Root Cause:** Agents cannot invoke workflows/skills in batch mode

---

## Issue Summary

**What Happened:**
1. Created 21 skeleton sub-story files (just headers + widget lists)
2. Launched 14 agents via batch-super-dev to process them
3. Agents correctly identified stories were incomplete (no tasks section)
4. Agents correctly halted per super-dev-pipeline Step 1.4.5
5. BUT: Batch-super-dev Step 2.5 says to "Invoke workflow: /bmad..." which agents can't do
6. Result: 13/14 agents halted correctly, 1 somehow succeeded

**The Problem:**
- Workflows correctly validate and halt
- BUT batch-super-dev suggests agents can regenerate stories
- Agents CANNOT execute `/` commands or invoke workflows autonomously
- This creates false expectations

---

## Proposed Fixes

### Fix 1: Update batch-super-dev Step 2.5 (Story Validation)

**Current Code (lines 82-99):**
```xml
<ask>Create story file with gap analysis? (yes/no):</ask>

<check if="response == 'yes'">
  <output>Creating story {{story_key}} with codebase gap analysis...</output>
  <action>Invoke workflow: /bmad:bmm:workflows:create-story-with-gap-analysis</action>
  <action>Parameters: story_key={{story_key}}</action>
```

**Problem:**
- "Invoke workflow: /bmad..." doesn't work for agents
- Agents can't run slash commands
- This will always fail in batch mode

**Recommended Fix:**
```xml
<ask>Create story file with gap analysis? (yes/no):</ask>

<check if="response == 'yes'">
  <check if="batch mode">
    <output>
⚠️ CANNOT CREATE STORIES IN BATCH MODE

Agents cannot invoke workflows autonomously.

**Required Action:**
1. Exit batch-super-dev
2. Run manually: /create-story-with-gap-analysis
3. Specify story key: {{story_key}}
4. Re-run batch-super-dev after story created

Skipping story {{story_key}} from batch.
    </output>
    <action>Mark story for removal from selection</action>
    <action>Add to skipped_stories with reason: "Story creation requires manual workflow"</action>
  </check>

  <check if="interactive mode">
    <output>Creating story {{story_key}} with codebase gap analysis...</output>
    <output>
⚠️ IMPORTANT: Story creation requires /create-story-with-gap-analysis workflow

This workflow cannot be invoked from within another workflow.

**Please run:**
```
/create-story-with-gap-analysis
```

Then return to this workflow.
    </output>
    <action>HALT - Cannot auto-invoke create-story workflow</action>
  </check>
</check>
```

**Why This Works:**
- ✅ Explicitly states agents can't create stories in batch
- ✅ Tells user exactly what to do
- ✅ Prevents false expectations
- ✅ Provides clear halt message

---

### Fix 2: Add Agent Limitations Section to batch-super-dev

**Add new section after line 5:**

```xml
<workflow>

<agent-limitations critical="true">
  <limitation n="1">
    <title>Agents Cannot Invoke Workflows</title>
    <description>
      Task agents running in batch mode cannot execute slash commands (/)
      or invoke other BMAD workflows. If a story requires creation or
      regeneration, the batch must halt and user must handle manually.
    </description>
    <impact>
      Stories without proper BMAD format (12 sections, tasks) will be skipped
      in batch execution. User must run /create-story-with-gap-analysis first.
    </impact>
  </limitation>

  <limitation n="2">
    <title>Agents Cannot Prompt User Interactively</title>
    <description>
      Batch agents run autonomously. They cannot ask user questions mid-execution.
      All decisions must be pre-configured or stories will be skipped.
    </description>
    <impact>
      Optional steps are auto-skipped. Ambiguous requirements cause halt.
    </impact>
  </limitation>

  <limitation n="3">
    <title>Skeleton Stories Will Be Skipped</title>
    <description>
      If a story file has &lt;12 BMAD sections or 0 tasks, super-dev-pipeline
      will correctly halt with "Nothing to implement" message. This is NOT
      a bug - it's correct behavior. User must regenerate story first.
    </description>
    <impact>
      Batch execution requires ALL stories to be properly formatted BEFORE
      running batch-super-dev. Do not attempt batch regeneration.
    </impact>
  </limitation>
</agent-limitations>

<step n="1" goal="Load and parse sprint-status.yaml">
  ...
```

**Why This Helps:**
- ✅ Sets clear expectations upfront
- ✅ Explains why stories get skipped
- ✅ Prevents users from making same mistake I did
- ✅ Documents known limitations explicitly

---

### Fix 3: Enhance super-dev-pipeline Step 1.4.5 (Pre-Flight Bailout)

**Current Code (lines 94-105):**
```
If total_task_count == 0:
  Display:
  ⚠️ EARLY BAILOUT: No Tasks Found

  Story file exists but has no tasks in Tasks/Subtasks section.
  - Story may be incomplete or malformed
  - Run create-story or validate-create-story first

  HALT - Nothing to implement
```

**Recommended Enhancement:**
```
If total_task_count == 0:
  Display:
  ⚠️ EARLY BAILOUT: No Tasks Found

  Story file exists but has no tasks in Tasks/Subtasks section.

  **Common Causes:**
  1. Story file is a skeleton/template (not generated by /create-story)
  2. Story file is missing BMAD sections
  3. Story file was manually created without proper format

  **This is NOT a pipeline bug** - this is correct validation behavior.

  **Required Action:**
  {if batch mode}
    - Story will be SKIPPED from batch execution
    - User must regenerate: /create-story-with-gap-analysis
    - Then re-run batch for this story
  {else}
    - Run: /create-story-with-gap-analysis
    - Specify story key: {story_key}
    - Then re-run super-dev-pipeline
  {endif}

  **IMPORTANT FOR AGENTS:**
  Do NOT attempt to regenerate the story yourself. Agents cannot invoke
  the /create-story-with-gap-analysis workflow. Document this issue and
  halt gracefully.

  HALT - Nothing to implement
```

**Why This Helps:**
- ✅ Explains this is CORRECT behavior, not a bug
- ✅ Explicitly tells agents NOT to try regenerating
- ✅ Provides clear user action steps
- ✅ Different guidance for batch vs interactive mode
- ✅ Sets correct expectations

---

### Fix 4: Add Pre-Batch Validation Recommendations

**Add new document:** `_bmad/bmm/workflows/4-implementation/batch-super-dev/BATCH-BEST-PRACTICES.md`

```markdown
# Batch Super-Dev Best Practices

## Pre-Batch Checklist

**BEFORE running /batch-super-dev, verify:**

### ✅ All Story Files Exist
```bash
# Check all ready-for-dev stories have files
for story in $(grep "ready-for-dev" docs/sprint-artifacts/sprint-status.yaml | cut -d: -f1); do
  if [ ! -f "docs/sprint-artifacts/story-$story.md" ]; then
    echo "❌ Missing: $story"
  fi
done
```

### ✅ All Stories Have Proper BMAD Format

Run validation script:
```bash
./scripts/validate-bmad-format.sh docs/sprint-artifacts/story-*.md
```

**Required:** All stories must show "✅ All 12 sections present"

### ✅ All Stories Have Tasks

```bash
# Check all stories have at least 1 task
for file in docs/sprint-artifacts/story-*.md; do
  task_count=$(grep -c "^- \[ \]" "$file" 2>/dev/null || echo "0")
  if [ "$task_count" -eq 0 ]; then
    echo "❌ No tasks: $(basename $file)"
  fi
done
```

**Required:** All stories must have unchecked tasks (something to implement)

---

## Common Mistakes

### ❌ Mistake 1: Batch Regeneration

**Don't:**
```bash
# Create 20 skeleton story files
# Run batch-super-dev expecting agents to regenerate them
```

**Why:** Agents cannot invoke /create-story-with-gap-analysis workflow

**Do Instead:**
```bash
# Regenerate stories one at a time
for story in story-20-13a-{1..5}; do
  /create-story-with-gap-analysis  # Interactive, per story
done

# THEN run batch-super-dev
/batch-super-dev
```

### ❌ Mistake 2: Mixed Story Quality

**Don't:**
- Mix properly generated stories with skeleton templates
- Assume agents will "fix" incomplete stories
- Launch batch without validating story format

**Do:**
- Validate ALL stories before batch
- Regenerate any incomplete ones
- Ensure consistent quality

### ❌ Mistake 3: Assuming Agents Can Run / Commands

**Don't:**
- Tell agents to "Run /create-story"
- Expect agents to invoke other workflows
- Assume agents can execute user CLI commands

**Do:**
- Pre-generate all stories before batch
- Use batch ONLY for implementation, not planning
- Keep story creation separate from story execution

---

## Success Patterns

### ✅ Pattern 1: Manual Create → Batch Execute

```bash
# Step 1: Create all stories manually (1-2 days)
/create-story-with-gap-analysis  # For each of 20 stories

# Step 2: Validate all stories
./scripts/validate-all-stories.sh

# Step 3: Batch execute (parallel, fast)
/batch-super-dev  # Select all 20 stories, run 4 agents
```

### ✅ Pattern 2: Incremental Batch Execution

```bash
# Execute stories in small batches as you create them
/create-story-with-gap-analysis  # Create 5 stories

/batch-super-dev  # Execute those 5 (filter by epic)

/create-story-with-gap-analysis  # Create 5 more

/batch-super-dev  # Execute those 5
```

### ✅ Pattern 3: Validation Before Batch

```bash
# Add to your workflow
validate_stories() {
  for story in $@; do
    if ! ./scripts/validate-bmad-format.sh "$story"; then
      echo "❌ Story $story is not ready for batch"
      echo "Run: /create-story-with-gap-analysis"
      exit 1
    fi
  done
  echo "✅ All stories validated, ready for batch"
}

validate_stories docs/sprint-artifacts/story-20-13*.md
/batch-super-dev
```

---

## When to Use Batch vs Individual

### Use Batch When:
- ✅ All stories properly formatted (12 sections, tasks present)
- ✅ Stories are independent (no complex dependencies)
- ✅ You want parallel execution (2-4 stories at once)
- ✅ Stories are similar complexity (all ~1 day effort)

### Use Individual (/dev-story) When:
- ✅ Story needs interactive decisions
- ✅ Story is complex (>3 days effort)
- ✅ Story has complex dependencies
- ✅ You want close monitoring/control

### DON'T Use Batch When:
- ❌ Stories are skeleton templates (not generated)
- ❌ Stories missing BMAD sections
- ❌ Mixed quality (some good, some incomplete)
- ❌ Need to create/regenerate stories
```

---

## Key Takeaway

**Batch-super-dev is for EXECUTION, not CREATION.**

Story creation is an interactive, context-heavy process that requires:
- User input on requirements
- Codebase scanning
- Gap analysis decisions
- Template generation

This cannot be reliably automated in batch mode. Always create stories first,
then batch execute them.
```

---

**Location:** `_bmad/bmm/workflows/4-implementation/batch-super-dev/BATCH-BEST-PRACTICES.md`

# Batch-Super-Dev Step 2.5 Patch

**Issue:** Step 2.5 tries to invoke `/create-story-with-gap-analysis` which agents cannot do
**Impact:** Skeleton stories get skipped instead of regenerated
**Fix:** Explicitly halt batch and tell user to regenerate manually

---

## Current Code (BROKEN)

**File:** `instructions.md` lines 82-99

```xml
<ask>Create story file with gap analysis? (yes/no):</ask>

<check if="response == 'yes'">
  <output>Creating story {{story_key}} with codebase gap analysis...</output>
  <action>Invoke workflow: /bmad:bmm:workflows:create-story-with-gap-analysis</action>
  <action>Parameters: story_key={{story_key}}</action>

  <check if="story creation succeeded">
    <output>✅ Story {{story_key}} created successfully (12/12 sections)</output>
    <action>Update file_status_icon to ✅</action>
    <action>Mark story as validated</action>
  </check>

  <check if="story creation failed">
    <output>❌ Story creation failed: {{story_key}}</output>
    <action>Mark story for removal from selection</action>
    <action>Add to skipped_stories list with reason: "Creation failed"</action>
  </check>
</check>
```

**Problem:**
- Line 86: "Invoke workflow: /" doesn't work for agents
- Agents can't execute slash commands
- This always fails in batch mode

---

## Recommended Fix (WORKING)

**Replace lines 82-99 with:**

```xml
<ask>Create story file with gap analysis? (yes/no):</ask>

<check if="response == 'yes'">
  <output>
⚠️ STORY CREATION REQUIRES MANUAL WORKFLOW EXECUTION

**Story:** {{story_key}}
**Status:** File missing or incomplete

**Problem:**
Agents cannot invoke /create-story-with-gap-analysis workflow autonomously.
This workflow requires:
- Interactive user prompts
- Context-heavy codebase scanning
- Gap analysis decision-making

**Required Action:**

1. **Exit this batch execution:**
   - Remaining stories will be skipped
   - Batch will continue with valid stories only

2. **Regenerate story manually:**
   ```
   /create-story-with-gap-analysis
   ```
   When prompted, provide:
   - Story key: {{story_key}}
   - Epic: {epic from parent story}
   - Scope: {widget list or feature description}

3. **Validate story format:**
   ```
   ./scripts/validate-bmad-format.sh docs/sprint-artifacts/story-{{story_key}}.md
   ```
   Must show: "✅ All 12 sections present"

4. **Re-run batch-super-dev:**
   - Story will now be properly formatted
   - Can be executed in next batch run

**Skipping story {{story_key}} from current batch execution.**
  </output>

  <action>Mark story for removal from selection</action>
  <action>Add to skipped_stories list with reason: "Story creation requires manual workflow (agents cannot invoke /create-story)"</action>
  <action>Add to manual_actions_required list: "Regenerate {{story_key}} with /create-story-with-gap-analysis"</action>
</check>

<check if="response == 'no'">
  <output>⏭️ Skipping story {{story_key}} (file missing, user declined creation)</output>
  <action>Mark story for removal from selection</action>
  <action>Add to skipped_stories list with reason: "User declined story creation"</action>
</check>
```

**Why This Works:**
- ✅ Explicitly states agents can't create stories
- ✅ Provides clear step-by-step user actions
- ✅ Skips gracefully instead of failing silently
- ✅ Tracks manual actions needed
- ✅ Sets correct expectations

---

## Additional Improvements

### Add Manual Actions Tracking

**At end of batch execution (Step 5), add:**

```xml
<check if="manual_actions_required is not empty">
  <output>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ MANUAL ACTIONS REQUIRED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**{{manual_actions_required.length}} stories require manual intervention:**

{{#each manual_actions_required}}
{{@index}}. **{{story_key}}**
   Action: {{action_description}}
   Command: {{command_to_run}}
{{/each}}

**After completing these actions:**
1. Validate all stories: ./scripts/validate-all-stories.sh
2. Re-run batch-super-dev for these stories
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  </output>
</check>
```

**Why This Helps:**
- User gets clear todo list
- Knows exactly what to do next
- Can track progress on manual actions

---

## Validation Script Enhancement

**Create:** `scripts/validate-all-stories.sh`

```bash
#!/bin/bash
# Validate all ready-for-dev stories have proper BMAD format

set -e

STORIES=$(grep "ready-for-dev" docs/sprint-artifacts/sprint-status.yaml | awk '{print $1}' | sed 's/://')

echo "=========================================="
echo "  BMAD Story Format Validation"
echo "=========================================="
echo ""

TOTAL=0
VALID=0
INVALID=0

for story in $STORIES; do
  STORY_FILE="docs/sprint-artifacts/story-$story.md"

  if [ ! -f "$STORY_FILE" ]; then
    echo "❌ $story - FILE MISSING"
    INVALID=$((INVALID + 1))
    TOTAL=$((TOTAL + 1))
    continue
  fi

  # Check BMAD format
  ./scripts/validate-bmad-format.sh "$STORY_FILE" >/dev/null 2>&1

  if [ $? -eq 0 ]; then
    echo "✅ $story - Valid BMAD format"
    VALID=$((VALID + 1))
  else
    echo "❌ $story - Invalid format (run validation for details)"
    INVALID=$((INVALID + 1))
  fi

  TOTAL=$((TOTAL + 1))
done

echo ""
echo "=========================================="
echo "  Summary"
echo "=========================================="
echo "Total Stories: $TOTAL"
echo "Valid: $VALID"
echo "Invalid: $INVALID"
echo ""

if [ $INVALID -eq 0 ]; then
  echo "✅ All stories ready for batch execution!"
  exit 0
else
  echo "❌ $INVALID stories need regeneration"
  echo ""
  echo "Run: /create-story-with-gap-analysis"
  echo "For each invalid story"
  exit 1
fi
```

**Why This Helps:**
- Quick validation before batch
- Prevents wasted time on incomplete stories
- Clear pass/fail criteria

---

## Documentation Update

**Add to:** `_bmad/bmm/workflows/4-implementation/batch-super-dev/README.md`

```markdown
# Batch Super-Dev Workflow

## Critical Prerequisites

**BEFORE running batch-super-dev:**

1. ✅ **All stories must be properly generated**
   - Run: `/create-story-with-gap-analysis` for each story
   - Do NOT create skeleton/template files manually
   - Validation: `./scripts/validate-all-stories.sh`

2. ✅ **All stories must have 12 BMAD sections**
   - Business Context, Current State, Acceptance Criteria
   - Tasks/Subtasks, Technical Requirements, Architecture Compliance
   - Testing Requirements, Dev Agent Guardrails, Definition of Done
   - References, Dev Agent Record, Change Log

3. ✅ **All stories must have tasks**
   - At least 1 unchecked task (something to implement)
   - Zero-task stories will be skipped
   - Validation: `grep -c "^- \[ \]" story-file.md`

## Common Failure Modes

### ❌ Attempting Batch Regeneration

**What you might try:**
```
1. Create 20 skeleton story files (just headers + widget lists)
2. Run /batch-super-dev
3. Expect agents to regenerate them
```

**What happens:**
- Agents identify stories are incomplete
- Agents correctly halt per super-dev-pipeline validation
- Stories get skipped (not regenerated)
- You waste time

**Why:**
- Agents CANNOT execute /create-story-with-gap-analysis
- Agents CANNOT invoke other BMAD workflows
- Story generation requires user interaction

**Solution:**
- Generate ALL stories manually FIRST: /create-story-with-gap-analysis
- Validate: ./scripts/validate-all-stories.sh
- THEN run batch: /batch-super-dev

### ❌ Mixed Story Quality

**What you might try:**
- Mix 10 proper stories + 10 skeletons
- Run batch hoping it "figures it out"

**What happens:**
- 10 proper stories execute successfully
- 10 skeletons get skipped
- Confusing results

**Solution:**
- Ensure ALL stories have same quality
- Validate before batch
- Don't mix skeletons with proper stories

## Success Pattern

```bash
# 1. Generate all stories (1-2 days, manual)
for story in story-20-13a-{1..5}; do
  /create-story-with-gap-analysis
  # Provide story details interactively
done

# 2. Validate (30 seconds, automated)
./scripts/validate-all-stories.sh

# 3. Execute (4-8 hours, parallel autonomous)
/batch-super-dev
# Select all 5 stories
# Choose 2-4 agents parallel

# 4. Review (1-2 hours)
# Review commits, merge to main
```

**Total Time:**
- Manual work: 1-2 days (story generation)
- Autonomous work: 4-8 hours (batch execution)
- Review: 1-2 hours

**Efficiency:**
- Story generation: Cannot be batched (requires user input)
- Story execution: Highly parallelizable (4x speedup with 4 agents)
```

---

## Implementation Checklist

**To apply these improvements:**

- [ ] Update `batch-super-dev/instructions.md` Step 2.5 (lines 82-99)
- [ ] Add `batch-super-dev/AGENT-LIMITATIONS.md` (new file)
- [ ] Add `batch-super-dev/BATCH-BEST-PRACTICES.md` (new file)
- [ ] Update `batch-super-dev/README.md` with prerequisites
- [ ] Create `scripts/validate-all-stories.sh` (new script)
- [ ] Add manual actions tracking to Step 5 summary
- [ ] Update super-dev-pipeline Step 1.4.5 with agent guidance

**Testing:**
- Try batch with mixed story quality → Should skip skeletons gracefully
- Verify error messages are clear
- Confirm agents halt correctly (not crash)

---

**Expected Result:**
- Users understand limitations upfront
- Clear guidance when stories are incomplete
- No false expectations about batch regeneration
- Better error messages

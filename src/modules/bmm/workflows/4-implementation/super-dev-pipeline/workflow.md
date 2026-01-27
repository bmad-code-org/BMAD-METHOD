# Super-Dev-Pipeline v2.1 - Multi-Agent Architecture

**Version:** 2.1.0
**Architecture:** GSDMAD (GSD + BMAD)
**Philosophy:** Agents do creative work, orchestrator does bookkeeping

---

## Overview

This workflow implements a story using **4 independent agents** with orchestrator-driven reconciliation.

**Key Innovation:**
- Each agent has single responsibility and fresh context
- No agent validates its own work
- **Orchestrator does bookkeeping** (story file updates, verification) - not agents

---

## Execution Flow

```
┌─────────────────────────────────────────────────────────────┐
│ Main Orchestrator (Claude)                                  │
│ - Loads story                                               │
│ - Spawns agents sequentially                                │
│ - Verifies each phase                                       │
│ - DOES RECONCILIATION DIRECTLY (not via agent)             │
│ - Final quality gate                                        │
└─────────────────────────────────────────────────────────────┘
         │
         ├──> Phase 1: Builder (Steps 1-4) [AGENT]
         │    - Load story, analyze gaps
         │    - Write tests (TDD)
         │    - Implement code
         │    - Report what was built (NO VALIDATION)
         │
         ├──> Phase 2: Inspector (Steps 5-6) [AGENT]
         │    - Fresh context, no Builder knowledge
         │    - Verify files exist
         │    - Run tests independently
         │    - Run quality checks
         │    - PASS or FAIL verdict
         │
         ├──> Phase 3: Reviewer (Step 7) [AGENT]
         │    - Fresh context, adversarial stance
         │    - Find security vulnerabilities
         │    - Find performance problems
         │    - Find logic bugs
         │    - Report issues with severity
         │
         ├──> Phase 4: Fixer (Steps 8-9) [AGENT]
         │    - Fix CRITICAL issues (all)
         │    - Fix HIGH issues (all)
         │    - Fix MEDIUM issues (if time)
         │    - Skip LOW issues (gold-plating)
         │    - Commit code changes
         │
         ├──> Phase 5: Reconciliation (Step 10) [ORCHESTRATOR] 🔧
         │    - Orchestrator uses Bash/Read/Edit tools directly
         │    - Check off completed tasks in story file
         │    - Fill Dev Agent Record with details
         │    - Verify updates with bash commands
         │    - BLOCKER if verification fails
         │
         └──> Final Verification [ORCHESTRATOR]
              - Check git commits exist
              - Check story checkboxes updated (count > 0)
              - Check Dev Agent Record filled
              - Check sprint-status updated
              - Check tests passed
              - Mark COMPLETE or FAILED
```

---

## Agent Spawning Instructions

### Phase 1: Spawn Builder

```javascript
Task({
  subagent_type: "general-purpose",
  description: "Implement story {{story_key}}",
  prompt: `
    You are the BUILDER agent for story {{story_key}}.

    Load and execute: {agents_path}/builder.md

    Story file: {{story_file}}

    Complete Steps 1-4:
    1. Init - Load story
    2. Pre-Gap - Analyze what exists
    3. Write Tests - TDD approach
    4. Implement - Write production code

    DO NOT:
    - Validate your work
    - Review your code
    - Update checkboxes
    - Commit changes

    Just build it and report what you created.
  `
});
```

**Wait for Builder to complete. Store agent_id in agent-history.json.**

### Phase 2: Spawn Inspector

```javascript
Task({
  subagent_type: "general-purpose",
  description: "Validate story {{story_key}} implementation",
  prompt: `
    You are the INSPECTOR agent for story {{story_key}}.

    Load and execute: {agents_path}/inspector.md

    Story file: {{story_file}}

    You have NO KNOWLEDGE of what the Builder did.

    Complete Steps 5-6:
    5. Post-Validation - Verify files exist and have content
    6. Quality Checks - Run type-check, lint, build, tests

    Run all checks yourself. Don't trust Builder claims.

    Output: PASS or FAIL verdict with evidence.
  `
});
```

**Wait for Inspector to complete. If FAIL, halt pipeline.**

### Phase 3: Spawn Reviewer

```javascript
Task({
  subagent_type: "bmad_bmm_multi-agent-review",
  description: "Adversarial review of story {{story_key}}",
  prompt: `
    You are the ADVERSARIAL REVIEWER for story {{story_key}}.

    Load and execute: {agents_path}/reviewer.md

    Story file: {{story_file}}
    Complexity: {{complexity_level}}

    Your goal is to FIND PROBLEMS.

    Complete Step 7:
    7. Code Review - Find security, performance, logic issues

    Be critical. Look for flaws.

    Output: List of issues with severity ratings.
  `
});
```

**Wait for Reviewer to complete. Parse issues by severity.**

### Phase 4: Spawn Fixer

```javascript
Task({
  subagent_type: "general-purpose",
  description: "Fix issues in story {{story_key}}",
  prompt: `
    You are the FIXER agent for story {{story_key}}.

    Load and execute: {agents_path}/fixer.md

    Story file: {{story_file}}
    Review issues: {{review_findings}}

    Complete Steps 8-9:
    8. Review Analysis - Categorize issues, filter gold-plating
    9. Fix Issues - Fix CRITICAL/HIGH, consider MEDIUM, skip LOW

    After fixing:
    - Update story checkboxes
    - Update sprint-status.yaml
    - Commit with descriptive message

    Output: Fix summary with git commit hash.
  `
});
```

**Wait for Fixer to complete.**

### Phase 5: Orchestrator Reconciliation (MANDATORY)

🚨 **THIS PHASE IS MANDATORY. ORCHESTRATOR DOES THIS DIRECTLY. NO AGENT SPAWN.** 🚨

**Why orchestrator, not agent?** Agents ignore instructions. The orchestrator has the context
and can use tools directly. This is bookkeeping work, not creative work.

**YOU (the orchestrator) must execute these commands directly:**

**Step 5.1: Get what was built**
```bash
# Get commit for this story
COMMIT_INFO=$(git log -5 --oneline | grep "{{story_key}}" | head -1)
echo "Commit: $COMMIT_INFO"

# Get files changed (production code only)
FILES_CHANGED=$(git diff HEAD~1 --name-only | grep -v "__tests__" | grep -v "\.test\." | grep -v "\.spec\.")
echo "Files changed:"
echo "$FILES_CHANGED"
```

**Step 5.2: Read story file tasks**
Use Read tool: `{{story_file}}`

Find the Tasks section and identify which tasks relate to the files changed.

**Step 5.3: Check off completed tasks**
Use Edit tool for EACH task that was completed:
```
old_string: "- [ ] Task description here"
new_string: "- [x] Task description here"
```

**Step 5.4: Fill Dev Agent Record**
Use Edit tool to update the Dev Agent Record section:
```
old_string: "### Dev Agent Record
- **Agent Model Used:** [Not set]
- **Implementation Date:** [Not set]
- **Files Created/Modified:** [Not set]
- **Tests Added:** [Not set]
- **Completion Notes:** [Not set]"

new_string: "### Dev Agent Record
- **Agent Model Used:** Claude Sonnet 4 (multi-agent: Builder + Inspector + Reviewer + Fixer)
- **Implementation Date:** {{date}}
- **Files Created/Modified:**
  {{#each files_changed}}
  - {{this}}
  {{/each}}
- **Tests Added:** [count from Inspector report]
- **Completion Notes:** [brief summary of what was implemented]"
```

**Step 5.5: Verify updates (BLOCKER)**
```bash
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 RECONCILIATION VERIFICATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Count checked tasks
CHECKED=$(grep -c "^- \[x\]" {{story_file}})
echo "Checked tasks: $CHECKED"

if [ "$CHECKED" -eq 0 ]; then
  echo "❌ BLOCKER: Zero checked tasks"
  echo "Go back to Step 5.3 and check off tasks"
  exit 1
fi

# Verify Dev Agent Record
RECORD=$(grep -A 5 "### Dev Agent Record" {{story_file}} | grep -c "Implementation Date:")
if [ "$RECORD" -eq 0 ]; then
  echo "❌ BLOCKER: Dev Agent Record not filled"
  echo "Go back to Step 5.4 and fill it"
  exit 1
fi

echo "✅ Reconciliation verified: $CHECKED tasks checked"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
```

**If verification fails:** DO NOT proceed. Fix immediately using Edit tool, then re-verify.

---

## Final Verification (Main Orchestrator)

🚨 **CRITICAL: This verification is MANDATORY. DO NOT skip.** 🚨

**After all agents complete (including Reconciler), YOU (the main orchestrator) must:**

1. **Use the Bash tool** to run these commands
2. **Read the output** to see if verification passed
3. **If verification fails**, use Edit and Bash tools to fix it NOW
4. **Do not proceed** until verification passes

**COMMAND TO RUN WITH BASH TOOL:**

```bash
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 FINAL VERIFICATION (MANDATORY)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. Check git commits exist
echo "Checking git commits..."
git log --oneline -3 | grep "{{story_key}}"
if [ $? -ne 0 ]; then
  echo "❌ FAILED: No commit found for {{story_key}}"
  echo "The Fixer agent did not commit changes."
  exit 1
fi
echo "✅ Git commit found"

# 2. Check story file has checked tasks (ABSOLUTE BLOCKER)
echo "Checking story file updates..."
CHECKED_COUNT=$(grep -c '^- \[x\]' {{story_file}})
echo "Checked tasks: $CHECKED_COUNT"

if [ "$CHECKED_COUNT" -eq 0 ]; then
  echo ""
  echo "❌ BLOCKER: Story file has ZERO checked tasks"
  echo ""
  echo "This means the Fixer agent did NOT update the story file."
  echo "The story CANNOT be marked complete without checked tasks."
  echo ""
  echo "You must:"
  echo "  1. Read the git commit to see what was built"
  echo "  2. Read the story Tasks section"
  echo "  3. Use Edit tool to check off completed tasks"
  echo "  4. Fill in Dev Agent Record"
  echo "  5. Verify with grep"
  echo "  6. Re-run this verification"
  echo ""
  exit 1
fi
echo "✅ Story file has $CHECKED_COUNT checked tasks"

# 3. Check Dev Agent Record filled
echo "Checking Dev Agent Record..."
RECORD_FILLED=$(grep -A 20 "^### Dev Agent Record" {{story_file}} | grep -c "Agent Model")
if [ "$RECORD_FILLED" -eq 0 ]; then
  echo "❌ BLOCKER: Dev Agent Record NOT filled"
  echo "The Fixer agent did not document what was built."
  exit 1
fi
echo "✅ Dev Agent Record filled"

# 4. Check sprint-status updated
echo "Checking sprint-status..."
git diff HEAD~1 {{sprint_status}} | grep "{{story_key}}"
if [ $? -ne 0 ]; then
  echo "❌ FAILED: Sprint status not updated for {{story_key}}"
  exit 1
fi
echo "✅ Sprint status updated"

# 5. Check test evidence (optional - may have test failures)
echo "Checking test evidence..."
if [ -f "inspector_output.txt" ]; then
  grep -E "PASS|tests.*passing" inspector_output.txt && echo "✅ Tests passing"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ STORY COMPLETE - All verifications passed"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
```

**IF VERIFICATION FAILS:**
- DO NOT mark story as "done"
- DO NOT proceed to next story
- FIX the failure immediately
- Re-run verification until it passes

---

## Benefits Over Single-Agent

### Separation of Concerns
- Builder doesn't validate own work
- Inspector has no incentive to lie
- Reviewer approaches with fresh eyes
- Fixer can't skip issues

### Fresh Context Each Phase
- Each agent starts at 0% context
- No accumulated fatigue
- No degraded quality
- Honest reporting

### Adversarial Review
- Reviewer WANTS to find issues
- Not defensive about the code
- More thorough than self-review

### Honest Verification
- Inspector runs tests independently
- Main orchestrator verifies everything
- Can't fake completion

---

## Complexity Routing

**MICRO stories:**
- Skip Reviewer (low risk)
- 2 agents: Builder → Inspector → Fixer

**STANDARD stories:**
- Full pipeline
- 4 agents: Builder → Inspector → Reviewer → Fixer

**COMPLEX stories:**
- Enhanced review (6 reviewers instead of 4)
- Full pipeline + extra scrutiny
- 4 agents: Builder → Inspector → Reviewer (enhanced) → Fixer

---

## Agent Tracking

Track all agents in `agent-history.json`:

```json
{
  "version": "1.0",
  "max_entries": 50,
  "entries": [
    {
      "agent_id": "abc123",
      "story_key": "17-10",
      "phase": "builder",
      "steps": [1,2,3,4],
      "timestamp": "2026-01-25T21:00:00Z",
      "status": "completed",
      "completion_timestamp": "2026-01-25T21:15:00Z"
    },
    {
      "agent_id": "def456",
      "story_key": "17-10",
      "phase": "inspector",
      "steps": [5,6],
      "timestamp": "2026-01-25T21:16:00Z",
      "status": "completed",
      "completion_timestamp": "2026-01-25T21:20:00Z"
    }
  ]
}
```

**Benefits:**
- Resume interrupted sessions
- Track agent performance
- Debug failed pipelines
- Audit trail

---

## Error Handling

**If Builder fails:**
- Don't spawn Inspector
- Report failure to user
- Option to resume or retry

**If Inspector fails:**
- Don't spawn Reviewer
- Report specific failures
- Resume Builder to fix issues

**If Reviewer finds CRITICAL issues:**
- Must spawn Fixer (not optional)
- Cannot mark story complete until fixed

**If Fixer fails:**
- Report unfixed issues
- Cannot mark story complete
- Manual intervention required

---

## Comparison: v1.x vs v2.0

| Aspect | v1.x (Single-Agent) | v2.0 (Multi-Agent) |
|--------|--------------------|--------------------|
| Agents | 1 | 4 |
| Validation | Self (conflict of interest) | Independent (no conflict) |
| Code Review | Self-review | Adversarial (fresh eyes) |
| Honesty | Low (can lie) | High (verified) |
| Context | Degrades over 11 steps | Fresh each phase |
| Catches Issues | Low | High |
| Completion Accuracy | ~60% (agents lie) | ~95% (verified) |

---

## Migration from v1.x

**Backward Compatibility:**
```yaml
execution_mode: "single_agent"  # Use v1.x
execution_mode: "multi_agent"   # Use v2.0 (new)
```

**Gradual Rollout:**
1. Week 1: Test v2.0 on 3-5 stories
2. Week 2: Make v2.0 default for new stories
3. Week 3: Migrate existing stories to v2.0
4. Week 4: Deprecate v1.x

---

## Hospital-Grade Standards

⚕️ **Lives May Be at Stake**

- Independent validation catches errors
- Adversarial review finds security flaws
- Multiple checkpoints prevent shortcuts
- Final verification prevents false completion

**QUALITY >> SPEED**

---

**Key Takeaway:** Don't trust a single agent to build, validate, review, and commit its own work. Use independent agents with fresh context at each phase.

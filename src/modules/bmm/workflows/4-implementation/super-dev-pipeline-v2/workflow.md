# Super-Dev-Pipeline v2.0 - Multi-Agent Architecture

**Version:** 2.0.0
**Architecture:** GSDMAD (GSD + BMAD)
**Philosophy:** Trust but verify, separation of concerns

---

## Overview

This workflow implements a story using **4 independent agents** with external validation at each phase.

**Key Innovation:** Each agent has single responsibility and fresh context. No agent validates its own work.

---

## Execution Flow

```
┌─────────────────────────────────────────────────────────────┐
│ Main Orchestrator (Claude)                                  │
│ - Loads story                                               │
│ - Spawns agents sequentially                                │
│ - Verifies each phase                                       │
│ - Final quality gate                                        │
└─────────────────────────────────────────────────────────────┘
         │
         ├──> Phase 1: Builder (Steps 1-4)
         │    - Load story, analyze gaps
         │    - Write tests (TDD)
         │    - Implement code
         │    - Report what was built (NO VALIDATION)
         │
         ├──> Phase 2: Inspector (Steps 5-6)
         │    - Fresh context, no Builder knowledge
         │    - Verify files exist
         │    - Run tests independently
         │    - Run quality checks
         │    - PASS or FAIL verdict
         │
         ├──> Phase 3: Reviewer (Step 7)
         │    - Fresh context, adversarial stance
         │    - Find security vulnerabilities
         │    - Find performance problems
         │    - Find logic bugs
         │    - Report issues with severity
         │
         ├──> Phase 4: Fixer (Steps 8-9)
         │    - Fix CRITICAL issues (all)
         │    - Fix HIGH issues (all)
         │    - Fix MEDIUM issues (if time)
         │    - Skip LOW issues (gold-plating)
         │    - Update story + sprint-status
         │    - Commit changes
         │
         └──> Final Verification (Main)
              - Check git commits exist
              - Check story checkboxes updated
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

---

## Final Verification (Main Orchestrator)

**After all agents complete, verify:**

```bash
# 1. Check git commits
git log --oneline -3 | grep "{{story_key}}"
if [ $? -ne 0 ]; then
  echo "❌ FAILED: No commit found"
  exit 1
fi

# 2. Check story checkboxes
before=$(git show HEAD~1:{{story_file}} | grep -c '^- \[x\]')
after=$(grep -c '^- \[x\]' {{story_file}})
if [ $after -le $before ]; then
  echo "❌ FAILED: Checkboxes not updated"
  exit 1
fi

# 3. Check sprint-status
git diff HEAD~1 {{sprint_status}} | grep "{{story_key}}: done"
if [ $? -ne 0 ]; then
  echo "❌ FAILED: Sprint status not updated"
  exit 1
fi

# 4. Check Inspector output for test evidence
grep -E "PASS|tests.*passing" inspector_output.txt
if [ $? -ne 0 ]; then
  echo "❌ FAILED: No test evidence"
  exit 1
fi

echo "✅ STORY COMPLETE - All verifications passed"
```

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

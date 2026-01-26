# GSDMAD: Get Shit Done Method for Agile Development

**Version:** 1.0.0
**Date:** 2026-01-25
**Philosophy:** Combine BMAD's comprehensive tracking with GSD's intelligent execution

---

## The Vision

**BMAD** excels at structure, tracking, and hospital-grade quality standards.
**GSD** excels at smart execution, parallelization, and getting shit done fast.

**GSDMAD** takes the best of both:
- BMAD's story tracking, sprint management, and quality gates
- GSD's wave-based parallelization, checkpoint routing, and agent orchestration

---

## Core Principles

1. **Comprehensive but not bureaucratic** - Track what matters, skip enterprise theater
2. **Smart parallelization** - Run independent work concurrently, sequential only when needed
3. **Separation of concerns** - Different agents for implementation, validation, review
4. **Checkpoint-aware routing** - Autonomous segments in subagents, decisions in main
5. **Hospital-grade quality** - Lives may be at stake, quality >> speed

---

## Architecture Comparison

### BMAD v1.x (Old Way)
```
batch-super-dev orchestrator:
  ├─ Story 1: super-dev-pipeline (ONE agent, ALL steps)
  │   └─ Step 1-11: init, gap, test, implement, validate, review, fix, complete
  ├─ Story 2: super-dev-pipeline (ONE agent, ALL steps)
  └─ Story 3: super-dev-pipeline (ONE agent, ALL steps)

Problems:
- Single agent validates its own work (conflict of interest)
- No parallelization between stories
- Agent can lie about completion
- Sequential execution is slow
```

### GSD (Inspiration)
```
execute-phase orchestrator:
  ├─ Wave 1: [Plan A, Plan B] in parallel
  │   ├─ Agent for Plan A (segments if checkpoints)
  │   └─ Agent for Plan B (segments if checkpoints)
  ├─ Wave 2: [Plan C]
  │   └─ Agent for Plan C
  └─ Wave 3: [Plan D, Plan E] in parallel

Strengths:
- Wave-based parallelization
- Checkpoint-aware segmentation
- Agent tracking and resume
- Lightweight orchestration
```

### GSDMAD (New Way)
```
batch-super-dev orchestrator:
  ├─ Wave 1 (independent stories): [17-1, 17-3, 17-4] in parallel
  │   ├─ Story 17-1:
  │   │   ├─ Agent 1: Implement (steps 1-4)
  │   │   ├─ Agent 2: Validate (steps 5-6) ← fresh context
  │   │   ├─ Agent 3: Review (step 7) ← adversarial
  │   │   └─ Agent 4: Fix (steps 8-9)
  │   ├─ Story 17-3: (same multi-agent pattern)
  │   └─ Story 17-4: (same multi-agent pattern)
  │
  ├─ Wave 2 (depends on Wave 1): [17-5]
  │   └─ Story 17-5: (same multi-agent pattern)
  │
  └─ Wave 3: [17-9, 17-10] in parallel
      ├─ Story 17-9: (same multi-agent pattern)
      └─ Story 17-10: (same multi-agent pattern)

Benefits:
- Independent stories run in parallel (faster)
- Each story uses multi-agent validation (honest)
- Dependencies respected via waves
- Agent tracking for resume capability
```

---

## Wave-Based Story Execution

### Dependency Analysis

Before executing stories, analyze dependencies:

```yaml
stories:
  17-1: # Space Model
    depends_on: []
    wave: 1

  17-2: # Space Listing
    depends_on: [17-1] # Needs Space model
    wave: 2

  17-3: # Space Photos
    depends_on: [17-1] # Needs Space model
    wave: 2

  17-4: # Delete Space
    depends_on: [17-1] # Needs Space model
    wave: 2

  17-5: # Agreement Model
    depends_on: [17-1, 17-4] # Needs Space model + delete protection
    wave: 3

  17-9: # Expiration Alerts
    depends_on: [17-5] # Needs Agreement model
    wave: 4

  17-10: # Occupant Portal
    depends_on: [17-5] # Needs Agreement model
    wave: 4
```

**Wave Execution:**
- Wave 1: [17-1] (1 story)
- Wave 2: [17-2, 17-3, 17-4] (3 stories in parallel)
- Wave 3: [17-5] (1 story)
- Wave 4: [17-9, 17-10] (2 stories in parallel)

**Time Savings:**
- Sequential: 7 stories × 60 min = 420 min (7 hours)
- Wave-based: 1 + 60 + 60 + 60 = 180 min (3 hours) ← 57% faster

---

## Multi-Agent Story Pipeline

Each story uses **4 agents** with separation of concerns:

### Phase 1: Implementation (Agent 1 - Builder)
```
Steps: 1-4 (init, pre-gap, write-tests, implement)
Role: Build the feature
Output: Code + tests (unverified)
Trust: LOW (assume agent will cut corners)
```

**Agent 1 Prompt:**
```
Implement story {{story_key}} following these steps:

1. Init: Load story, detect greenfield vs brownfield
2. Pre-Gap: Validate tasks, detect batchable patterns
3. Write Tests: TDD approach, write tests first
4. Implement: Write production code

DO NOT:
- Validate your own work (Agent 2 will do this)
- Review your own code (Agent 3 will do this)
- Update story checkboxes (Agent 4 will do this)
- Commit changes (Agent 4 will do this)

Just write the code and tests. Report what you built.
```

### Phase 2: Validation (Agent 2 - Inspector)
```
Steps: 5-6 (post-validation, quality-checks)
Role: Independent verification
Output: PASS/FAIL with evidence
Trust: MEDIUM (no conflict of interest)
```

**Agent 2 Prompt:**
```
Validate story {{story_key}} implementation by Agent 1.

You have NO KNOWLEDGE of what Agent 1 did. Verify:

1. Files Exist:
   - Check each file mentioned in story
   - Verify file contains actual code (not TODO/stub)

2. Tests Pass:
   - Run test suite: npm test
   - Verify tests actually run (not skipped)
   - Check coverage meets 90% threshold

3. Quality Checks:
   - Run type-check: npm run type-check
   - Run linter: npm run lint
   - Run build: npm run build
   - All must return zero errors

4. Git Status:
   - Check uncommitted files
   - List files changed

Output PASS or FAIL with specific evidence.
If FAIL, list exactly what's missing/broken.
```

### Phase 3: Code Review (Agent 3 - Adversarial Reviewer)
```
Step: 7 (code-review)
Role: Find problems (adversarial stance)
Output: List of issues with severity
Trust: HIGH (wants to find issues)
```

**Agent 3 Prompt:**
```
Adversarial code review of story {{story_key}}.

Your GOAL is to find problems. Be critical. Look for:

SECURITY:
- SQL injection vulnerabilities
- XSS vulnerabilities
- Authentication bypasses
- Authorization gaps
- Hardcoded secrets

PERFORMANCE:
- N+1 queries
- Missing indexes
- Inefficient algorithms
- Memory leaks

BUGS:
- Logic errors
- Edge cases not handled
- Off-by-one errors
- Race conditions

ARCHITECTURE:
- Pattern violations
- Tight coupling
- Missing error handling

Rate each issue:
- CRITICAL: Security vulnerability or data loss
- HIGH: Will cause production bugs
- MEDIUM: Technical debt or maintainability
- LOW: Nice-to-have improvements

Output: List of issues with severity and specific code locations.
```

### Phase 4: Fix Issues (Agent 4 - Fixer)
```
Steps: 8-9 (review-analysis, fix-issues)
Role: Fix critical/high issues
Output: Fixed code
Trust: MEDIUM (incentive to minimize work)
```

**Agent 4 Prompt:**
```
Fix issues from code review for story {{story_key}}.

Code review found {{issue_count}} issues:
{{review_issues}}

Priority:
1. Fix ALL CRITICAL issues (no exceptions)
2. Fix ALL HIGH issues (must do)
3. Fix MEDIUM issues if time allows (nice to have)
4. Skip LOW issues (gold-plating)

After fixing:
- Re-run tests (must pass)
- Update story checkboxes
- Update sprint-status.yaml
- Commit changes with message: "fix: {{story_key}} - address code review"
```

### Phase 5: Final Verification (Main Orchestrator)
```
Steps: 10-11 (complete, summary)
Role: Final quality gate
Output: COMPLETE or FAILED
Trust: HIGHEST (user-facing)
```

**Orchestrator Checks:**
```bash
# 1. Verify git commits
git log --oneline -5 | grep "{{story_key}}"
[ $? -eq 0 ] || echo "FAIL: No commit found"

# 2. Verify story checkboxes increased
before=$(git show HEAD~2:{{story_file}} | grep -c "^- \[x\]")
after=$(grep -c "^- \[x\]" {{story_file}})
[ $after -gt $before ] || echo "FAIL: Checkboxes not updated"

# 3. Verify sprint-status updated
git diff HEAD~2 {{sprint_status}} | grep "{{story_key}}: done"
[ $? -eq 0 ] || echo "FAIL: Sprint status not updated"

# 4. Verify tests passed (parse agent output)
grep "PASS" agent_2_output.txt
[ $? -eq 0 ] || echo "FAIL: No test evidence"
```

---

## Checkpoint-Aware Segmentation

Stories can have **checkpoints** for user interaction:

```xml
<step n="3" checkpoint="human-verify">
  <output>Review the test plan before implementation</output>
  <ask>Does this test strategy look correct? (yes/no)</ask>
</step>
```

**Routing Rules:**

1. **No checkpoints** → Full autonomous (Agent 1 does steps 1-4)
2. **Verify checkpoints** → Segmented execution:
   - Segment 1 (steps 1-2): Agent 1a
   - Checkpoint: Main context (user verifies)
   - Segment 2 (steps 3-4): Agent 1b (fresh agent)
3. **Decision checkpoints** → Stay in main context (can't delegate decisions)

This is borrowed directly from GSD's `execute-plan.md` segmentation logic.

---

## Agent Tracking and Resume

Track all spawned agents for resume capability:

```json
// .bmad/agent-history.json
{
  "version": "1.0",
  "max_entries": 50,
  "entries": [
    {
      "agent_id": "a4868f1",
      "story_key": "17-10",
      "phase": "implementation",
      "agent_type": "builder",
      "timestamp": "2026-01-25T20:30:00Z",
      "status": "spawned",
      "completion_timestamp": null
    }
  ]
}
```

**Resume Capability:**
```bash
# If session interrupted, check for incomplete agents
cat .bmad/agent-history.json | jq '.entries[] | select(.status=="spawned")'

# Resume agent using Task tool
Task(subagent_type="general-purpose", resume="a4868f1")
```

---

## Workflow Files

### New: `batch-super-dev-v2.md`
```yaml
execution_mode: "wave_based" # wave_based | sequential

# Story dependency analysis (auto-computed or manual)
dependency_analysis:
  enabled: true
  method: "file_scan" # file_scan | manual | hybrid

# Wave execution
waves:
  max_parallel_stories: 4 # Max stories per wave
  agent_timeout: 3600 # 1 hour per agent

# Multi-agent validation
validation:
  enabled: true
  agents:
    builder: {steps: [1,2,3,4]}
    inspector: {steps: [5,6], fresh_context: true}
    reviewer: {steps: [7], adversarial: true}
    fixer: {steps: [8,9]}
```

### Enhanced: `super-dev-pipeline-v2.md`
```yaml
execution_mode: "multi_agent" # single_agent | multi_agent

# Agent configuration
agents:
  builder:
    steps: [1, 2, 3, 4]
    description: "Implement story"

  inspector:
    steps: [5, 6]
    description: "Validate implementation"
    fresh_context: true

  reviewer:
    steps: [7]
    description: "Adversarial code review"
    fresh_context: true
    adversarial: true

  fixer:
    steps: [8, 9]
    description: "Fix review issues"
```

---

## Implementation Phases

### Phase 1: Multi-Agent Validation (Week 1)
- Update `super-dev-pipeline` to support multi-agent mode
- Create `agents/` directory with agent prompts
- Add agent tracking infrastructure
- Test on single story

### Phase 2: Wave-Based Execution (Week 2)
- Add dependency analysis to `batch-super-dev`
- Implement wave grouping logic
- Add parallel execution within waves
- Test on Epic 17 (10 stories)

### Phase 3: Checkpoint Segmentation (Week 3)
- Add checkpoint detection to stories
- Implement segment routing logic
- Test with stories that need user input

### Phase 4: Agent Resume (Week 4)
- Add agent history tracking
- Implement resume capability
- Test interrupted session recovery

---

## Benefits Summary

**From BMAD:**
- ✅ Comprehensive story tracking
- ✅ Sprint artifacts and status management
- ✅ Gap analysis and reconciliation
- ✅ Hospital-grade quality standards
- ✅ Multi-tenant patterns

**From GSD:**
- ✅ Wave-based parallelization (57% faster)
- ✅ Smart checkpoint routing
- ✅ Agent tracking and resume
- ✅ Lightweight orchestration
- ✅ Separation of concerns

**New in GSDMAD:**
- ✅ Multi-agent validation (no conflict of interest)
- ✅ Adversarial code review (finds real issues)
- ✅ Independent verification (honest reporting)
- ✅ Parallel story execution (faster completion)
- ✅ Best of both worlds

---

## Migration Path

1. **Keep BMAD v1.x** as fallback (`execution_mode: "single_agent"`)
2. **Add GSDMAD** as opt-in (`execution_mode: "multi_agent"`)
3. **Test both modes** on same epic, compare results
4. **Make GSDMAD default** after validation
5. **Deprecate v1.x** in 6 months

---

**Key Insight:** Trust but verify. Every agent's work is independently validated by a fresh agent with no conflict of interest. Stories run in parallel when possible, sequential only when dependencies require it.

---

**Next Steps:**
1. Create `super-dev-pipeline-v2/` directory
2. Write agent prompt files
3. Update `batch-super-dev` for wave execution
4. Test on Epic 17 stories
5. Measure time savings and quality improvements

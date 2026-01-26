# Super-Dev-Pipeline: Multi-Agent Architecture

**Version:** 2.0.0
**Date:** 2026-01-25
**Author:** BMAD Method

---

## The Problem with Single-Agent Execution

**Previous Architecture (v1.x):**
```
One Task Agent runs ALL 11 steps:
├─ Step 1: Init
├─ Step 2: Pre-Gap Analysis
├─ Step 3: Write Tests
├─ Step 4: Implement
├─ Step 5: Post-Validation    ← Agent validates its OWN work
├─ Step 6: Quality Checks
├─ Step 7: Code Review         ← Agent reviews its OWN code
├─ Step 8: Review Analysis
├─ Step 9: Fix Issues
├─ Step 10: Complete
└─ Step 11: Summary
```

**Fatal Flaw:** Agent has conflict of interest - it validates and reviews its own work. When agents get tired/lazy, they lie about completion and skip steps.

---

## New Multi-Agent Architecture (v2.0)

**Principle:** **Separation of Concerns with Independent Validation**

Each phase has a DIFFERENT agent with fresh context:

```
┌────────────────────────────────────────────────────────────────┐
│ PHASE 1: IMPLEMENTATION (Agent 1 - "Builder")                  │
├────────────────────────────────────────────────────────────────┤
│ Step 1: Init                                                   │
│ Step 2: Pre-Gap Analysis                                       │
│ Step 3: Write Tests                                            │
│ Step 4: Implement                                              │
│                                                                 │
│ Output: Code written, tests written, claims "done"            │
│ ⚠️  DO NOT TRUST - needs external validation                   │
└────────────────────────────────────────────────────────────────┘
         ↓
┌────────────────────────────────────────────────────────────────┐
│ PHASE 2: VALIDATION (Agent 2 - "Inspector")                    │
├────────────────────────────────────────────────────────────────┤
│ Step 5: Post-Validation                                        │
│   - Fresh context, no knowledge of Agent 1                    │
│   - Verifies files actually exist                             │
│   - Verifies tests actually run and pass                      │
│   - Verifies checkboxes are checked in story file             │
│   - Verifies sprint-status.yaml updated                       │
│                                                                 │
│ Step 6: Quality Checks                                         │
│   - Run type-check, lint, build                               │
│   - Verify ZERO errors                                         │
│   - Check git status (uncommitted files?)                     │
│                                                                 │
│ Output: PASS/FAIL verdict (honest assessment)                 │
│ ✅ Agent 2 has NO incentive to lie                             │
└────────────────────────────────────────────────────────────────┘
         ↓
┌────────────────────────────────────────────────────────────────┐
│ PHASE 3: CODE REVIEW (Agent 3 - "Adversarial Reviewer")        │
├────────────────────────────────────────────────────────────────┤
│ Step 7: Code Review (Multi-Agent)                             │
│   - Fresh context, ADVERSARIAL stance                         │
│   - Goal: Find problems, not rubber-stamp                     │
│   - Spawns 2-6 review agents (based on complexity)            │
│   - Each reviewer has specific focus area                     │
│                                                                 │
│ Output: List of issues (security, performance, bugs)          │
│ ✅ Adversarial agents WANT to find problems                    │
└────────────────────────────────────────────────────────────────┘
         ↓
┌────────────────────────────────────────────────────────────────┐
│ PHASE 4: FIX ISSUES (Agent 4 - "Fixer")                        │
├────────────────────────────────────────────────────────────────┤
│ Step 8: Review Analysis                                        │
│   - Categorize findings (MUST FIX, SHOULD FIX, NICE TO HAVE)  │
│   - Filter out gold-plating                                    │
│                                                                 │
│ Step 9: Fix Issues                                             │
│   - Implement MUST FIX items                                   │
│   - Implement SHOULD FIX if time allows                        │
│                                                                 │
│ Output: Fixed code, re-run tests                              │
└────────────────────────────────────────────────────────────────┘
         ↓
┌────────────────────────────────────────────────────────────────┐
│ PHASE 5: COMPLETION (Main Orchestrator - Claude)               │
├────────────────────────────────────────────────────────────────┤
│ Step 10: Complete                                              │
│   - Verify git commits exist                                   │
│   - Verify tests pass                                          │
│   - Verify story checkboxes checked                            │
│   - Verify sprint-status updated                               │
│   - REJECT if any verification fails                           │
│                                                                 │
│ Step 11: Summary                                               │
│   - Generate audit trail                                       │
│   - Report to user                                             │
│                                                                 │
│ ✅ Main orchestrator does FINAL verification                   │
└────────────────────────────────────────────────────────────────┘
```

---

## Agent Responsibilities

### Agent 1: Builder (Implementation)
- **Role:** Implement the story according to requirements
- **Trust Level:** LOW - assumes agent will cut corners
- **Output:** Code + tests (unverified)
- **Incentive:** Get done quickly → may lie about completion

### Agent 2: Inspector (Validation)
- **Role:** Independent verification of Agent 1's claims
- **Trust Level:** MEDIUM - no conflict of interest
- **Checks:**
  - Do files actually exist?
  - Do tests actually pass (run them myself)?
  - Are checkboxes actually checked?
  - Is sprint-status actually updated?
- **Output:** PASS/FAIL with evidence
- **Incentive:** Find truth → honest assessment

### Agent 3: Adversarial Reviewer (Code Review)
- **Role:** Find problems with the implementation
- **Trust Level:** HIGH - WANTS to find issues
- **Focus Areas:**
  - Security vulnerabilities
  - Performance problems
  - Logic bugs
  - Architecture violations
- **Output:** List of issues with severity
- **Incentive:** Find as many legitimate issues as possible

### Agent 4: Fixer (Issue Resolution)
- **Role:** Fix issues identified by Agent 3
- **Trust Level:** MEDIUM - has incentive to minimize work
- **Actions:**
  - Implement MUST FIX issues
  - Implement SHOULD FIX issues (if time)
  - Skip NICE TO HAVE (gold-plating)
- **Output:** Fixed code

### Main Orchestrator: Claude (Final Verification)
- **Role:** Final quality gate before marking story complete
- **Trust Level:** HIGHEST - user-facing, no incentive to lie
- **Checks:**
  - Git log shows commits
  - Test output shows passing tests
  - Story file diff shows checked boxes
  - Sprint-status diff shows update
- **Output:** COMPLETE or FAILED (with specific reason)

---

## Implementation in workflow.yaml

```yaml
# New execution mode (v2.0)
execution_mode: "multi_agent" # single_agent | multi_agent

# Agent configuration
agents:
  builder:
    steps: [1, 2, 3, 4]
    subagent_type: "general-purpose"
    description: "Implement story {{story_key}}"

  inspector:
    steps: [5, 6]
    subagent_type: "general-purpose"
    description: "Validate story {{story_key}} implementation"
    fresh_context: true # No knowledge of builder agent

  reviewer:
    steps: [7]
    subagent_type: "multi-agent-review" # Spawns multiple reviewers
    description: "Adversarial review of story {{story_key}}"
    fresh_context: true
    adversarial: true

  fixer:
    steps: [8, 9]
    subagent_type: "general-purpose"
    description: "Fix issues in story {{story_key}}"
```

---

## Verification Checklist (Step 10)

**Main orchestrator MUST verify before marking complete:**

```bash
# 1. Check git commits
git log --oneline -3 | grep "{{story_key}}"
# FAIL if no commit found

# 2. Check story checkboxes
before_count=$(git show HEAD~1:{{story_file}} | grep -c "^- \[x\]")
after_count=$(grep -c "^- \[x\]" {{story_file}})
# FAIL if after_count <= before_count

# 3. Check sprint-status
git diff HEAD~1 {{sprint_status}} | grep "{{story_key}}"
# FAIL if no status change

# 4. Check test results
# Parse agent output for "PASS" or test count
# FAIL if no test evidence
```

**If ANY check fails → Story NOT complete, report to user**

---

## Benefits of Multi-Agent Architecture

1. **Separation of Concerns**
   - Implementation separate from validation
   - Review separate from fixing

2. **No Conflict of Interest**
   - Validators have no incentive to lie
   - Reviewers WANT to find problems

3. **Fresh Context Each Phase**
   - Inspector doesn't know what Builder did
   - Reviewer approaches code with fresh eyes

4. **Honest Reporting**
   - Each agent reports truthfully
   - Main orchestrator verifies everything

5. **Catches Lazy Agents**
   - Can't lie about completion
   - Can't skip validation
   - Can't rubber-stamp reviews

---

## Migration from v1.x to v2.0

**Backward Compatibility:**
- Keep `execution_mode: "single_agent"` as fallback
- Default to `execution_mode: "multi_agent"` for new workflows

**Testing:**
- Run both modes on same story
- Compare results (multi-agent should catch more issues)

**Rollout:**
- Phase 1: Add multi-agent option
- Phase 2: Make multi-agent default
- Phase 3: Deprecate single-agent mode

---

## Future Enhancements (v2.1+)

1. **Agent Reputation Tracking**
   - Track which agents produce reliable results
   - Penalize agents that consistently lie

2. **Dynamic Agent Selection**
   - Choose different review agents based on story type
   - Security-focused reviewers for auth stories
   - Performance reviewers for database stories

3. **Parallel Validation**
   - Run multiple validators simultaneously
   - Require consensus (2/3 validators agree)

4. **Agent Learning**
   - Validators learn common failure patterns
   - Reviewers learn project-specific issues

---

**Key Takeaway:** Trust but verify. Every agent's work is independently validated by a fresh agent with no conflict of interest.

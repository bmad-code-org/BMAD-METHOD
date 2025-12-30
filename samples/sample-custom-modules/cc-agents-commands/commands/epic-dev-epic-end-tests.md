---
description: "Epic end-of-development test validation: NFR assessment, test quality review, and traceability quality gate"
argument-hint: "<epic-number> [--yolo] [--resume]"
allowed-tools: ["Task", "SlashCommand", "Read", "Write", "Edit", "Bash", "Grep", "Glob", "TodoWrite", "AskUserQuestion"]
---

# Epic End Tests - NFR + Test Review + Quality Gate

Execute the end-of-epic test validation sequence for epic: "$ARGUMENTS"

This command orchestrates three critical BMAD Test Architect workflows in sequence:
1. **NFR Assessment** - Validate non-functional requirements (performance, security, reliability, maintainability)
2. **Test Quality Review** - Comprehensive test quality validation against best practices
3. **Trace Phase 2** - Quality gate decision (PASS/CONCERNS/FAIL/WAIVED)

---

## CRITICAL ORCHESTRATION CONSTRAINTS

**YOU ARE A PURE ORCHESTRATOR - DELEGATION ONLY**
- NEVER execute workflows directly - you are a pure orchestrator
- NEVER use Edit, Write, MultiEdit tools yourself
- NEVER implement fixes or modify code yourself
- NEVER run SlashCommand directly - delegate to subagents
- MUST delegate ALL work to subagents via Task tool
- Your role is ONLY to: read state, delegate tasks, verify completion, update session

**GUARD RAIL CHECK**: Before ANY action ask yourself:
- "Am I about to do work directly?" -> If YES: STOP and delegate via Task instead
- "Am I using Read/Bash to check state?" -> OK to proceed
- "Am I using Task tool to spawn a subagent?" -> Correct approach

**SEQUENTIAL EXECUTION ONLY** - Each phase MUST complete before the next starts:
- Never invoke multiple workflows in parallel
- Wait for each Task to complete before proceeding
- This ensures proper context flow through the 3-phase workflow

---

## MODEL STRATEGY

| # | Phase | Model | Rationale |
|---|-------|-------|-----------|
| 1 | NFR Assessment | `opus` | Comprehensive evidence analysis requires deep understanding |
| 2 | Test Quality Review | `sonnet` | Rule-based quality validation, faster iteration |
| 3 | Trace Phase 2 | `opus` | Quality gate decision requires careful analysis |

---

## STEP 1: Parse Arguments

Parse "$ARGUMENTS" to extract:
- **epic_number** (required): First positional argument (e.g., "1" for Epic 1)
- **--resume**: Continue from last incomplete phase
- **--yolo**: Skip user confirmation pauses between phases

**Validation:**
- epic_number must be a positive integer
- If no epic_number provided, error with: "Usage: /epic-dev-epic_end_tests <epic-number> [--yolo] [--resume]"

---

## STEP 2: Detect BMAD Project

```bash
PROJECT_ROOT=$(pwd)
while [[ ! -d "$PROJECT_ROOT/_bmad" ]] && [[ "$PROJECT_ROOT" != "/" ]]; do
  PROJECT_ROOT=$(dirname "$PROJECT_ROOT")
done

if [[ ! -d "$PROJECT_ROOT/_bmad" ]]; then
  echo "ERROR: Not a BMAD project. Run /bmad:bmm:workflows:workflow-init first."
  exit 1
fi
```

Load sprint artifacts path from `_bmad/bmm/config.yaml` (default: `docs/sprint-artifacts`)
Load output folder from config (default: `docs`)

---

## STEP 3: Verify Epic Readiness

Before running end-of-epic tests, verify:
1. All stories in epic are "done" or "review" status
2. Sprint-status.yaml exists and is readable
3. Epic file exists at `{sprint_artifacts}/epic-{epic_num}.md`

If stories are incomplete:
```
Output: "WARNING: Epic {epic_num} has incomplete stories."
Output: "Stories remaining: {list incomplete stories}"

decision = AskUserQuestion(
  question: "Proceed with end-of-epic validation despite incomplete stories?",
  header: "Incomplete",
  options: [
    {label: "Continue anyway", description: "Run validation on current state"},
    {label: "Stop", description: "Complete stories first, then re-run"}
  ]
)

IF decision == "Stop":
  HALT with: "Complete remaining stories, then run: /epic-dev-epic_end_tests {epic_num}"
```

---

## STEP 4: Session Management

**Session Schema for 3-Phase Workflow:**

```yaml
epic_end_tests_session:
  epic: {epic_num}
  phase: "starting"  # See PHASE VALUES below

  # NFR tracking (Phase 1)
  nfr_status: null  # PASS | CONCERNS | FAIL
  nfr_categories_assessed: 0
  nfr_critical_issues: 0
  nfr_high_issues: 0
  nfr_report_file: null

  # Test review tracking (Phase 2)
  test_review_status: null  # Excellent | Good | Acceptable | Needs Improvement | Critical
  test_quality_score: 0
  test_files_reviewed: 0
  test_critical_issues: 0
  test_review_file: null

  # Trace tracking (Phase 3)
  gate_decision: null  # PASS | CONCERNS | FAIL | WAIVED
  p0_coverage: 0
  p1_coverage: 0
  overall_coverage: 0
  trace_file: null

  # Timestamps
  started: "{timestamp}"
  last_updated: "{timestamp}"
```

**PHASE VALUES:**
- `starting` - Initial state
- `nfr_assessment` - Phase 1: Running NFR assessment
- `nfr_complete` - Phase 1 complete, proceed to test review
- `test_review` - Phase 2: Running test quality review
- `test_review_complete` - Phase 2 complete, proceed to trace
- `trace_phase2` - Phase 3: Running quality gate decision
- `gate_decision` - Awaiting user decision on gate result
- `complete` - All phases complete
- `error` - Error state

**If --resume AND session exists for this epic:**
- Resume from recorded phase
- Output: "Resuming Epic {epic_num} end tests from phase: {phase}"

**If NOT --resume (fresh start):**
- Clear any existing session
- Create new session with `phase: "starting"`

---

## STEP 5: Execute Phase Loop

### PHASE 1: NFR Assessment (opus)

**Execute when:** `phase == "starting"` OR `phase == "nfr_assessment"`

```
Output: "
================================================================================
[Phase 1/3] NFR ASSESSMENT - Epic {epic_num}
================================================================================
Assessing: Performance, Security, Reliability, Maintainability
Model: opus (comprehensive evidence analysis)
================================================================================
"

Update session:
  - phase: "nfr_assessment"
  - last_updated: {timestamp}

Write session to sprint-status.yaml

Task(
  subagent_type="general-purpose",
  model="opus",
  description="NFR assessment for Epic {epic_num}",
  prompt="NFR ASSESSMENT AGENT - Epic {epic_num}

**Your Mission:** Perform comprehensive NFR assessment for all stories in Epic {epic_num}.

**Context:**
- Epic: {epic_num}
- Sprint artifacts: {sprint_artifacts}
- Output folder: {output_folder}

**Execution Steps:**
1. Read the epic file to understand scope: {sprint_artifacts}/epic-{epic_num}.md
2. Read sprint-status.yaml to identify all completed stories
3. Execute: SlashCommand(command='/bmad:bmm:workflows:testarch-nfr')
4. Follow ALL workflow prompts - provide epic context when asked
5. Assess ALL NFR categories:
   - Performance: Response times, throughput, resource usage
   - Security: Authentication, authorization, data protection, vulnerabilities
   - Reliability: Error handling, availability, fault tolerance
   - Maintainability: Code quality, test coverage, documentation
6. Gather evidence from:
   - Test results (pytest, vitest reports)
   - Coverage reports
   - Performance metrics (if available)
   - Security scan results (if available)
7. Apply deterministic PASS/CONCERNS/FAIL rules
8. Generate NFR assessment report

**Output Requirements:**
- Save report to: {output_folder}/nfr-assessment-epic-{epic_num}.md
- Include gate YAML snippet
- Include evidence checklist for any gaps

**Output Format (JSON at end):**
{
  \"status\": \"PASS|CONCERNS|FAIL\",
  \"categories_assessed\": <count>,
  \"critical_issues\": <count>,
  \"high_issues\": <count>,
  \"report_file\": \"path/to/report.md\"
}

Execute immediately and autonomously. Do not ask for confirmation."
)

Parse NFR output JSON

Update session:
  - phase: "nfr_complete"
  - nfr_status: {status}
  - nfr_categories_assessed: {categories_assessed}
  - nfr_critical_issues: {critical_issues}
  - nfr_high_issues: {high_issues}
  - nfr_report_file: {report_file}

Write session to sprint-status.yaml

Output:
───────────────────────────────────────────────────────────────────────────────
NFR ASSESSMENT COMPLETE
───────────────────────────────────────────────────────────────────────────────
Status: {nfr_status}
Categories Assessed: {categories_assessed}
Critical Issues: {critical_issues}
High Issues: {high_issues}
Report: {report_file}
───────────────────────────────────────────────────────────────────────────────

IF nfr_status == "FAIL":
  Output: "NFR Assessment FAILED - Critical issues detected."

  fail_decision = AskUserQuestion(
    question: "NFR Assessment FAILED. How to proceed?",
    header: "NFR Failed",
    options: [
      {label: "Continue to Test Review", description: "Proceed despite NFR failures (will affect final gate)"},
      {label: "Stop and remediate", description: "Address NFR issues before continuing"},
      {label: "Request waiver", description: "Document business justification for waiver"}
    ]
  )

  IF fail_decision == "Stop and remediate":
    Output: "Stopping for NFR remediation."
    Output: "Address issues in: {report_file}"
    Output: "Resume with: /epic-dev-epic_end_tests {epic_num} --resume"
    HALT

IF NOT --yolo:
  continue_decision = AskUserQuestion(
    question: "Phase 1 (NFR Assessment) complete. Continue to Test Review?",
    header: "Continue",
    options: [
      {label: "Continue", description: "Proceed to Phase 2: Test Quality Review"},
      {label: "Stop", description: "Save state and exit (resume later with --resume)"}
    ]
  )

  IF continue_decision == "Stop":
    Output: "Stopping at Phase 1. Resume with: /epic-dev-epic_end_tests {epic_num} --resume"
    HALT

PROCEED TO PHASE 2
```

---

### PHASE 2: Test Quality Review (sonnet)

**Execute when:** `phase == "nfr_complete"` OR `phase == "test_review"`

```
Output: "
================================================================================
[Phase 2/3] TEST QUALITY REVIEW - Epic {epic_num}
================================================================================
Reviewing: Test structure, patterns, quality, flakiness risk
Model: sonnet (rule-based quality validation)
================================================================================
"

Update session:
  - phase: "test_review"
  - last_updated: {timestamp}

Write session to sprint-status.yaml

Task(
  subagent_type="general-purpose",
  model="sonnet",
  description="Test quality review for Epic {epic_num}",
  prompt="TEST QUALITY REVIEWER AGENT - Epic {epic_num}

**Your Mission:** Perform comprehensive test quality review for all tests in Epic {epic_num}.

**Context:**
- Epic: {epic_num}
- Sprint artifacts: {sprint_artifacts}
- Output folder: {output_folder}
- Review scope: suite (all tests for this epic)

**Execution Steps:**
1. Read the epic file to understand story scope: {sprint_artifacts}/epic-{epic_num}.md
2. Discover all test files related to epic stories
3. Execute: SlashCommand(command='/bmad:bmm:workflows:testarch-test-review')
4. Follow ALL workflow prompts - specify epic scope when asked
5. Validate each test against quality criteria:
   - BDD format (Given-When-Then structure)
   - Test ID conventions (traceability)
   - Priority markers (P0/P1/P2/P3)
   - Hard waits detection (flakiness risk)
   - Determinism check (no conditionals/random)
   - Isolation validation (cleanup, no shared state)
   - Fixture patterns (proper composition)
   - Data factories (no hardcoded data)
   - Network-first pattern (race condition prevention)
   - Assertions (explicit, not hidden)
   - Test length (<300 lines)
   - Test duration (<1.5 min)
   - Flakiness patterns detection
6. Calculate quality score (0-100)
7. Generate comprehensive review report

**Output Requirements:**
- Save report to: {output_folder}/test-review-epic-{epic_num}.md
- Include quality score breakdown
- List critical issues (must fix)
- List recommendations (should fix)

**Output Format (JSON at end):**
{
  \"quality_grade\": \"A+|A|B|C|F\",
  \"quality_score\": <0-100>,
  \"files_reviewed\": <count>,
  \"critical_issues\": <count>,
  \"recommendations\": <count>,
  \"report_file\": \"path/to/report.md\"
}

Execute immediately and autonomously. Do not ask for confirmation."
)

Parse test review output JSON

# Map quality grade to status
IF quality_score >= 90:
  test_review_status = "Excellent"
ELSE IF quality_score >= 80:
  test_review_status = "Good"
ELSE IF quality_score >= 70:
  test_review_status = "Acceptable"
ELSE IF quality_score >= 60:
  test_review_status = "Needs Improvement"
ELSE:
  test_review_status = "Critical"

Update session:
  - phase: "test_review_complete"
  - test_review_status: {test_review_status}
  - test_quality_score: {quality_score}
  - test_files_reviewed: {files_reviewed}
  - test_critical_issues: {critical_issues}
  - test_review_file: {report_file}

Write session to sprint-status.yaml

Output:
───────────────────────────────────────────────────────────────────────────────
TEST QUALITY REVIEW COMPLETE
───────────────────────────────────────────────────────────────────────────────
Quality Grade: {quality_grade}
Quality Score: {quality_score}/100
Status: {test_review_status}
Files Reviewed: {files_reviewed}
Critical Issues: {critical_issues}
Recommendations: {recommendations}
Report: {report_file}
───────────────────────────────────────────────────────────────────────────────

IF test_review_status == "Critical":
  Output: "Test Quality CRITICAL - Major quality issues detected."

  quality_decision = AskUserQuestion(
    question: "Test quality is CRITICAL ({quality_score}/100). How to proceed?",
    header: "Quality Critical",
    options: [
      {label: "Continue to Quality Gate", description: "Proceed despite quality issues (will affect gate)"},
      {label: "Stop and fix", description: "Address test quality issues before gate"},
      {label: "Accept current state", description: "Acknowledge issues, proceed to gate"}
    ]
  )

  IF quality_decision == "Stop and fix":
    Output: "Stopping for test quality remediation."
    Output: "Critical issues in: {report_file}"
    Output: "Resume with: /epic-dev-epic_end_tests {epic_num} --resume"
    HALT

IF NOT --yolo:
  continue_decision = AskUserQuestion(
    question: "Phase 2 (Test Review) complete. Continue to Quality Gate?",
    header: "Continue",
    options: [
      {label: "Continue", description: "Proceed to Phase 3: Quality Gate Decision"},
      {label: "Stop", description: "Save state and exit (resume later with --resume)"}
    ]
  )

  IF continue_decision == "Stop":
    Output: "Stopping at Phase 2. Resume with: /epic-dev-epic_end_tests {epic_num} --resume"
    HALT

PROCEED TO PHASE 3
```

---

### PHASE 3: Trace Phase 2 - Quality Gate Decision (opus)

**Execute when:** `phase == "test_review_complete"` OR `phase == "trace_phase2"`

```
Output: "
================================================================================
[Phase 3/3] QUALITY GATE DECISION - Epic {epic_num}
================================================================================
Analyzing: Coverage, test results, NFR status, quality metrics
Model: opus (careful gate decision analysis)
================================================================================
"

Update session:
  - phase: "trace_phase2"
  - last_updated: {timestamp}

Write session to sprint-status.yaml

Task(
  subagent_type="general-purpose",
  model="opus",
  description="Quality gate decision for Epic {epic_num}",
  prompt="QUALITY GATE AGENT - Epic {epic_num}

**Your Mission:** Make quality gate decision (PASS/CONCERNS/FAIL/WAIVED) for Epic {epic_num}.

**Context:**
- Epic: {epic_num}
- Sprint artifacts: {sprint_artifacts}
- Output folder: {output_folder}
- Gate type: epic
- Decision mode: deterministic

**Previous Phase Results:**
- NFR Assessment Status: {session.nfr_status}
- NFR Report: {session.nfr_report_file}
- Test Quality Score: {session.test_quality_score}/100
- Test Quality Status: {session.test_review_status}
- Test Review Report: {session.test_review_file}

**Execution Steps:**
1. Read the epic file: {sprint_artifacts}/epic-{epic_num}.md
2. Read all story files for this epic
3. Execute: SlashCommand(command='/bmad:bmm:workflows:testarch-trace')
4. When prompted, specify:
   - Gate type: epic
   - Enable gate decision: true (Phase 2)
5. Load Phase 1 traceability results (auto-generated by workflow)
6. Gather quality evidence:
   - Coverage metrics from stories
   - Test execution results (CI reports if available)
   - NFR assessment results: {session.nfr_report_file}
   - Test quality review: {session.test_review_file}
7. Apply deterministic decision rules:

   **PASS Criteria (ALL must be true):**
   - P0 coverage >= 100%
   - P1 coverage >= 90%
   - Overall coverage >= 80%
   - P0 test pass rate = 100%
   - P1 test pass rate >= 95%
   - Overall test pass rate >= 90%
   - NFR assessment != FAIL
   - Test quality score >= 70

   **CONCERNS Criteria (ANY):**
   - P1 coverage 80-89%
   - P1 test pass rate 90-94%
   - Overall pass rate 85-89%
   - NFR assessment == CONCERNS
   - Test quality score 60-69

   **FAIL Criteria (ANY):**
   - P0 coverage < 100%
   - P0 test pass rate < 100%
   - P1 coverage < 80%
   - P1 test pass rate < 90%
   - Overall coverage < 80%
   - Overall pass rate < 85%
   - NFR assessment == FAIL (unwaived)
   - Test quality score < 60

8. Generate comprehensive gate decision document
9. Include evidence from all three phases

**Output Requirements:**
- Save gate decision to: {output_folder}/gate-decision-epic-{epic_num}.md
- Include decision matrix
- Include evidence summary from all phases
- Include next steps

**Output Format (JSON at end):**
{
  \"decision\": \"PASS|CONCERNS|FAIL\",
  \"p0_coverage\": <percentage>,
  \"p1_coverage\": <percentage>,
  \"overall_coverage\": <percentage>,
  \"rationale\": \"Brief explanation\",
  \"gate_file\": \"path/to/gate-decision.md\"
}

Execute immediately and autonomously. Do not ask for confirmation."
)

Parse gate decision output JSON

Update session:
  - phase: "gate_decision"
  - gate_decision: {decision}
  - p0_coverage: {p0_coverage}
  - p1_coverage: {p1_coverage}
  - overall_coverage: {overall_coverage}
  - trace_file: {gate_file}

Write session to sprint-status.yaml

# ═══════════════════════════════════════════════════════════════════════════
# QUALITY GATE DECISION HANDLING
# ═══════════════════════════════════════════════════════════════════════════

Output:
═══════════════════════════════════════════════════════════════════════════════
                          QUALITY GATE RESULT
═══════════════════════════════════════════════════════════════════════════════

  DECISION: {decision}

═══════════════════════════════════════════════════════════════════════════════
  COVERAGE METRICS
───────────────────────────────────────────────────────────────────────────────
  P0 Coverage (Critical):   {p0_coverage}% (required: 100%)
  P1 Coverage (Important):  {p1_coverage}% (target: 90%)
  Overall Coverage:         {overall_coverage}% (target: 80%)
───────────────────────────────────────────────────────────────────────────────
  PHASE RESULTS
───────────────────────────────────────────────────────────────────────────────
  NFR Assessment:           {session.nfr_status}
  Test Quality:             {session.test_review_status} ({session.test_quality_score}/100)
───────────────────────────────────────────────────────────────────────────────
  RATIONALE
───────────────────────────────────────────────────────────────────────────────
  {rationale}
═══════════════════════════════════════════════════════════════════════════════

IF decision == "PASS":
  Output: "Epic {epic_num} PASSED all quality gates!"
  Output: "Ready for: deployment / release / next epic"

  Update session:
    - phase: "complete"

  PROCEED TO COMPLETION

ELSE IF decision == "CONCERNS":
  Output: "Epic {epic_num} has CONCERNS - minor gaps detected."

  concerns_decision = AskUserQuestion(
    question: "Quality gate has CONCERNS. How to proceed?",
    header: "Gate Decision",
    options: [
      {label: "Accept and complete", description: "Acknowledge gaps, mark epic done"},
      {label: "Address gaps", description: "Stop and fix gaps, re-run validation"},
      {label: "Request waiver", description: "Document business justification"}
    ]
  )

  IF concerns_decision == "Accept and complete":
    Update session:
      - phase: "complete"
    PROCEED TO COMPLETION

  ELSE IF concerns_decision == "Address gaps":
    Output: "Stopping to address gaps."
    Output: "Review: {trace_file}"
    Output: "Re-run after fixes: /epic-dev-epic_end_tests {epic_num}"
    HALT

  ELSE IF concerns_decision == "Request waiver":
    HANDLE WAIVER (see below)

ELSE IF decision == "FAIL":
  Output: "Epic {epic_num} FAILED quality gate - blocking issues detected."

  fail_decision = AskUserQuestion(
    question: "Quality gate FAILED. How to proceed?",
    header: "Gate Failed",
    options: [
      {label: "Address failures", description: "Stop and fix blocking issues"},
      {label: "Request waiver", description: "Document business justification (not for P0 gaps)"},
      {label: "Force complete", description: "DANGER: Mark complete despite failures"}
    ]
  )

  IF fail_decision == "Address failures":
    Output: "Stopping to address failures."
    Output: "Blocking issues in: {trace_file}"
    Output: "Re-run after fixes: /epic-dev-epic_end_tests {epic_num}"
    HALT

  ELSE IF fail_decision == "Request waiver":
    HANDLE WAIVER (see below)

  ELSE IF fail_decision == "Force complete":
    Output: "WARNING: Forcing completion despite FAIL status."
    Output: "This will be recorded in the gate decision document."
    Update session:
      - gate_decision: "FAIL (FORCED)"
      - phase: "complete"
    PROCEED TO COMPLETION
```

---

## WAIVER HANDLING

When user requests waiver:

```
Output: "Requesting waiver for quality gate result: {decision}"

waiver_reason = AskUserQuestion(
  question: "What is the business justification for waiver?",
  header: "Waiver",
  options: [
    {label: "Time-critical", description: "Deadline requires shipping now"},
    {label: "Low risk", description: "Missing coverage is low-risk area"},
    {label: "Tech debt", description: "Will address in future sprint"},
    {label: "External blocker", description: "External dependency blocking tests"}
  ]
)

waiver_approver = AskUserQuestion(
  question: "Who is approving this waiver?",
  header: "Approver",
  options: [
    {label: "Tech Lead", description: "Engineering team lead approval"},
    {label: "Product Manager", description: "Product owner approval"},
    {label: "Engineering Manager", description: "Management approval"},
    {label: "Self", description: "Self-approved (document risk)"}
  ]
)

# Update gate decision document with waiver
Task(
  subagent_type="general-purpose",
  model="haiku",
  description="Document waiver for Epic {epic_num}",
  prompt="WAIVER DOCUMENTER AGENT

**Mission:** Add waiver documentation to gate decision file.

**Waiver Details:**
- Original Decision: {decision}
- Waiver Reason: {waiver_reason}
- Approver: {waiver_approver}
- Date: {current_date}

**File to Update:** {trace_file}

**Add this section to the gate decision document:**

## Waiver

**Status**: WAIVED
**Original Decision**: {decision}
**Waiver Reason**: {waiver_reason}
**Approver**: {waiver_approver}
**Date**: {current_date}
**Mitigation Plan**: [Add follow-up stories to address gaps]

---

Execute immediately."
)

Update session:
  - gate_decision: "WAIVED"
  - phase: "complete"

PROCEED TO COMPLETION
```

---

## STEP 6: Completion Summary

```
Output:
════════════════════════════════════════════════════════════════════════════════
                    EPIC {epic_num} END TESTS COMPLETE
════════════════════════════════════════════════════════════════════════════════

  FINAL QUALITY GATE: {session.gate_decision}

────────────────────────────────────────────────────────────────────────────────
  PHASE SUMMARY
────────────────────────────────────────────────────────────────────────────────
  [1/3] NFR Assessment:      {session.nfr_status}
        Critical Issues:     {session.nfr_critical_issues}
        Report:              {session.nfr_report_file}

  [2/3] Test Quality Review: {session.test_review_status} ({session.test_quality_score}/100)
        Files Reviewed:      {session.test_files_reviewed}
        Critical Issues:     {session.test_critical_issues}
        Report:              {session.test_review_file}

  [3/3] Quality Gate:        {session.gate_decision}
        P0 Coverage:         {session.p0_coverage}%
        P1 Coverage:         {session.p1_coverage}%
        Overall Coverage:    {session.overall_coverage}%
        Decision Document:   {session.trace_file}

────────────────────────────────────────────────────────────────────────────────
  GENERATED ARTIFACTS
────────────────────────────────────────────────────────────────────────────────
  1. {session.nfr_report_file}
  2. {session.test_review_file}
  3. {session.trace_file}

────────────────────────────────────────────────────────────────────────────────
  NEXT STEPS
────────────────────────────────────────────────────────────────────────────────

IF gate_decision == "PASS":
  - Ready for deployment/release
  - Run retrospective: /bmad:bmm:workflows:retrospective
  - Start next epic: /epic-dev <next-epic-number>

ELSE IF gate_decision == "CONCERNS" OR gate_decision == "WAIVED":
  - Deploy with monitoring
  - Create follow-up stories for gaps
  - Schedule tech debt review
  - Run retrospective: /bmad:bmm:workflows:retrospective

ELSE IF gate_decision == "FAIL" OR gate_decision == "FAIL (FORCED)":
  - Address blocking issues before deployment
  - Re-run: /epic-dev-epic_end_tests {epic_num}
  - Consider breaking up remaining work

════════════════════════════════════════════════════════════════════════════════

# Clear session
Clear epic_end_tests_session from sprint-status.yaml
```

---

## ERROR HANDLING

On any workflow failure:

```
1. Capture error output
2. Update session:
   - phase: "error"
   - last_error: "{error_message}"
3. Write session to sprint-status.yaml

4. Display error with phase context:
   Output: "ERROR in Phase {current_phase}: {error_message}"

5. Offer recovery options:
   error_decision = AskUserQuestion(
     question: "How to handle this error?",
     header: "Error Recovery",
     options: [
       {label: "Retry", description: "Re-run the failed phase"},
       {label: "Skip phase", description: "Skip to next phase (if safe)"},
       {label: "Stop", description: "Save state and exit"}
     ]
   )

6. Handle recovery choice:
   - Retry: Reset phase state, re-execute
   - Skip phase: Only allowed for Phase 1 or 2 (not Phase 3)
   - Stop: HALT with resume instructions
```

---

## EXECUTE NOW

Parse "$ARGUMENTS" and begin the epic end-of-development test validation sequence immediately.

Run in sequence:
1. NFR Assessment (opus)
2. Test Quality Review (sonnet)
3. Quality Gate Decision (opus)

Delegate all work via Task tool. Never execute workflows directly.

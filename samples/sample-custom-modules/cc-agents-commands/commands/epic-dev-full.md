---
description: "Full TDD/ATDD-driven BMAD development cycle with comprehensive test phases and quality gates"
argument-hint: "<epic-number> [--yolo] [--resume]"
allowed-tools: ["Task", "SlashCommand", "Read", "Write", "Edit", "Bash", "Grep", "Glob", "TodoWrite", "AskUserQuestion"]
---

# BMAD Epic Development - Full TDD/ATDD Workflow

Execute the complete TDD/ATDD-driven BMAD development cycle for epic: "$ARGUMENTS"

## 🚨 CRITICAL ORCHESTRATION CONSTRAINTS 🚨

**YOU ARE A PURE ORCHESTRATOR - DELEGATION ONLY**

- ❌ NEVER execute workflows directly - you are a pure orchestrator
- ❌ NEVER use Edit, Write, MultiEdit tools yourself
- ❌ NEVER implement story tasks or fix code yourself
- ❌ NEVER run SlashCommand directly - delegate to subagents
- ✅ MUST delegate ALL work to subagents via Task tool
- ✅ Your role is ONLY to: read state, delegate tasks, verify completion, update session

**GUARD RAIL CHECK**: Before ANY action ask yourself:

- "Am I about to do work directly?" → If YES: STOP and delegate via Task instead
- "Am I using Read/Bash to check state?" → OK to proceed
- "Am I using Task tool to spawn a subagent?" → Correct approach

**SUBAGENT EXECUTION PATTERN**: Each Task call spawns an independent subagent that:

- Has its own context window (preserves main agent context)
- Executes autonomously until completion
- Returns results to the orchestrator

---

## CRITICAL EXECUTION CONSTRAINTS

**SEQUENTIAL EXECUTION ONLY** - Each phase MUST complete before the next starts:

- Never invoke multiple BMAD workflows in parallel
- Wait for each Task to complete before proceeding
- This ensures proper context flow through the 8-phase workflow

**MODEL STRATEGY** - Different models for different phases:

| # | Phase | Model | Rationale |

| --- | ------- | ------- | ----------- |

| 1 | create-story | `opus` | Deep understanding for quality story creation |

| 2 | validate-create-story | `sonnet` | Fast feedback loop for validation iterations |

| 3 | testarch-atdd | `opus` | Quality test generation requires deep understanding |

| 4 | dev-story | `sonnet` | Balanced speed/quality for implementation |

| 5 | code-review | `opus` | Thorough adversarial review |

| 6 | testarch-automate | `sonnet` | Iterative test expansion |

| 7 | testarch-test-review | `haiku` | Rule-based quality validation (fast) |

| 8 | testarch-trace | `opus` | Quality gate decision requires careful analysis |

**PURE ORCHESTRATION** - This command:

- Invokes existing BMAD workflows via Task tool with model specifications
- Reads/writes sprint-status.yaml for state management
- Never directly modifies story implementation files (workflows do that)

---

## STEP 1: Parse Arguments

Parse "$ARGUMENTS" to extract:

- **epic_number** (required): First positional argument (e.g., "2" for Epic 2)
- **--resume**: Continue from last incomplete story/phase
- **--yolo**: Skip user confirmation pauses between stories

**Validation:**

- epic_number must be a positive integer
- If no epic_number provided, error with: "Usage: /epic-dev-full <epic-number> [--yolo] [--resume]"

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

```text

Load sprint artifacts path from `_bmad/bmm/config.yaml` (default: `docs/sprint-artifacts`)

---

## STEP 3: Load Sprint Status and Discover Stories

Read `{sprint_artifacts}/sprint-status.yaml`

If not found:

- Output: "Sprint status file not found. Running sprint-planning workflow first..."
- Run: `SlashCommand(command="/bmad:bmm:workflows:sprint-planning")`

Find stories for epic {epic_number}:

- Pattern: `{epic_num}-{story_num}-{story_title}`
- Filter: status NOT "done"
- Order by story number

If no pending stories:

- Output: "All stories in Epic {epic_num} complete!"
- HALT

---

## STEP 4: Session Management

**Extended Session Schema for 8-Phase Workflow:**

```yaml
epic_dev_session:
  epic: {epic_num}
  current_story: "{story_key}"
  phase: "starting"  # See PHASE VALUES below

  # Validation tracking (Phase 2)
  validation_iteration: 0
  validation_issues_count: 0
  validation_last_pass_rate: 100

  # TDD tracking (Phases 3-4)
  tdd_phase: "red"  # red | green | complete
  atdd_checklist_file: null
  atdd_tests_count: 0

  # Code review tracking (Phase 5)
  review_iteration: 0

  # Quality gate tracking (Phase 8)
  gate_decision: null  # PASS | CONCERNS | FAIL | WAIVED
  gate_iteration: 0
  p0_coverage: 0
  p1_coverage: 0
  overall_coverage: 0

  # Timestamps
  started: "{timestamp}"
  last_updated: "{timestamp}"

```text

**PHASE VALUES:**
- `starting` - Initial state
- `create_story` - Phase 1: Creating story file
- `create_complete` - Phase 1 complete, proceed to validation
- `validation` - Phase 2: Validating story completeness
- `validation_complete` - Phase 2 complete, proceed to ATDD
- `testarch_atdd` - Phase 3: Generating acceptance tests (RED)
- `atdd_complete` - Phase 3 complete, proceed to dev
- `dev_story` - Phase 4: Implementing story (GREEN)
- `dev_complete` - Phase 4 complete, proceed to review
- `code_review` - Phase 5: Adversarial review
- `review_complete` - Phase 5 complete, proceed to test automation
- `testarch_automate` - Phase 6: Expanding test coverage
- `automate_complete` - Phase 6 complete, proceed to test review
- `testarch_test_review` - Phase 7: Reviewing test quality
- `test_review_complete` - Phase 7 complete, proceed to trace
- `testarch_trace` - Phase 8: Quality gate decision
- `gate_decision` - Awaiting user decision on gate result
- `complete` - Story complete
- `error` - Error state

**If --resume AND session exists for this epic:**
- Resume from recorded phase
- Output: "Resuming Epic {epic_num} from story {current_story} at phase: {phase}"

**If NOT --resume (fresh start):**
- Clear any existing session
- Create new session with `phase: "starting"`

---

## STEP 5: Story Processing Loop

**CRITICAL: Process stories SERIALLY (one at a time)**

For each pending story:

---

### PHASE 1: Create Story (opus)

**Execute when:** `story.status == "backlog"`

```text

Output: "=== [Phase 1/8] Creating story: {story_key} (opus) ==="

Update session:

  - phase: "create_story"
  - last_updated: {timestamp}

Write sprint-status.yaml

Task(
  subagent_type="parallel-executor",
  model="opus",
  description="Create story {story_key}",
  prompt="STORY CREATOR AGENT - Create story: {story_key}

**Your Mission:** Create a complete user story file following BMAD conventions.

**Context:**
- Epic: {epic_num}
- Story key: {story_key}
- Sprint artifacts: {sprint_artifacts}

**Execution Steps:**
1. Read the epic file to understand story context: {sprint_artifacts}/epic-{epic_num}.md
2. Read sprint-status.yaml to confirm story requirements
3. Execute: SlashCommand(command='/bmad:bmm:workflows:create-story')
4. When the workflow asks which story, provide: {story_key}
5. Complete all prompts in the story creation workflow
6. Verify the story file was created at: {sprint_artifacts}/stories/{story_key}.md

**Success Criteria:**
- Story file exists with complete acceptance criteria
- Story has tasks linked to acceptance criteria
- Story status updated in sprint-status.yaml

**Output:** Report the story file path and confirm creation.

Execute immediately and autonomously. Do not ask for confirmation."
)

Verify:

- Story file exists at {sprint_artifacts}/stories/{story_key}.md
- Story status updated in sprint-status.yaml

Update session:

  - phase: "create_complete"

PROCEED TO PHASE 2

```text

---

### PHASE 2: Validate Create Story (sonnet, max 3 iterations)

**Execute when:** `phase == "create_complete"` OR `phase == "validation"`

This phase validates the story file for completeness using tier-based issue classification.

```text

INITIALIZE:
  validation_iteration = session.validation_iteration or 0
  max_validations = 3

WHILE validation_iteration < max_validations:

  Output: "=== [Phase 2/8] Validation iteration {validation_iteration + 1} for: {story_key} (sonnet) ==="

  Update session:

    - phase: "validation"
    - validation_iteration: {validation_iteration}
    - last_updated: {timestamp}

  Write sprint-status.yaml

  Task(
    subagent_type="parallel-executor",
    model="sonnet",
    description="Validate story {story_key}",
    prompt="STORY VALIDATOR AGENT - Validate story: {story_key}

**Your Mission:** Validate the story file for completeness and quality.

**Context:**
- Story file: {sprint_artifacts}/stories/{story_key}.md
- Epic: {epic_num}
- Validation iteration: {validation_iteration + 1}

**Execution Steps:**
1. Read the story file at {sprint_artifacts}/stories/{story_key}.md
2. Check each validation criterion:
   - Story header with proper epic reference
   - Complete acceptance criteria with BDD format (Given/When/Then)
   - Tasks linked to acceptance criteria IDs
   - Dev notes section with architecture references
   - Testing requirements specified
   - Prerequisites defined (if applicable)
3. Categorize each issue by tier

**Tier Definitions:**
- CRITICAL: Blocking issues (missing story refs, missing ACs, story not in epic)
- ENHANCEMENT: Should-fix (missing arch citations, vague dev notes)
- OPTIMIZATION: Nice-to-have (verbose content, formatting)

**Output Format (JSON only):**
{
  \"pass_rate\": <0-100>,
  \"total_issues\": <count>,
  \"critical_issues\": [{\"id\": \"C1\", \"description\": \"...\", \"section\": \"...\"}],
  \"enhancement_issues\": [{\"id\": \"E1\", \"description\": \"...\", \"section\": \"...\"}],
  \"optimization_issues\": [{\"id\": \"O1\", \"description\": \"...\", \"section\": \"...\"}]
}

Execute immediately and autonomously. Return ONLY the JSON result."
  )

  Parse validation JSON output

  IF pass_rate == 100 OR total_issues == 0:
    Output: "Story validation PASSED (100%)"
    Update session:

      - phase: "validation_complete"
      - validation_last_pass_rate: 100
    Write sprint-status.yaml
    BREAK from loop
    PROCEED TO PHASE 3

  ELSE:
    # Display issues by tier
    Output:
    ───────────────────────────────────────────────────────────
    VALIDATION ISSUES FOUND
    ───────────────────────────────────────────────────────────
    Pass Rate: {pass_rate}% | Total Issues: {total_issues}

    CRITICAL ({critical_count}): {list critical issues}
    ENHANCEMENT ({enhancement_count}): {list enhancement issues}
    OPTIMIZATION ({optimization_count}): {list optimization issues}
    ───────────────────────────────────────────────────────────

    user_decision = AskUserQuestion(
      question: "How to proceed with validation issues?",
      header: "Validation",
      options: [
        {label: "Fix all", description: "Apply all {total_issues} fixes (recommended)"},
        {label: "Fix critical only", description: "Apply only critical fixes"},
        {label: "Skip validation", description: "Proceed to ATDD with current issues"},
        {label: "Manual review", description: "Pause for manual inspection"}
      ]
    )

    IF user_decision == "Fix all" OR user_decision == "Fix critical only":
      # Apply fixes
      Task(
        subagent_type="parallel-executor",
        model="sonnet",
        description="Fix validation issues for {story_key}",
        prompt="VALIDATION FIXER AGENT - Fix story: {story_key}

**Your Mission:** Fix validation issues in the story file.

**Context:**
- Story file: {sprint_artifacts}/stories/{story_key}.md
- Fix mode: {IF user_decision == 'Fix all': 'ALL ISSUES' ELSE: 'CRITICAL ONLY'}

**Issues to Fix:**
{IF user_decision == 'Fix all':}
Fix ALL issues: {all_issues}
{ELSE:}
Fix CRITICAL issues only: {critical_issues}
{END IF}

**Execution Steps:**
1. Read the story file
2. For each issue, apply the fix using Edit tool
3. Preserve existing content - only modify what's needed
4. Verify each fix was applied correctly

**Output:** Return summary of changes made with section names.

Execute immediately and autonomously. Do not ask for confirmation."
      )
      validation_iteration += 1
      CONTINUE loop (re-validate)

    ELSE IF user_decision == "Skip validation":
      Output: "Skipping remaining validation. Proceeding to ATDD phase..."
      Update session:

        - phase: "validation_complete"
      Write sprint-status.yaml
      BREAK from loop
      PROCEED TO PHASE 3

    ELSE IF user_decision == "Manual review":
      Output: "Pausing for manual review."
      Output: "Story file: {sprint_artifacts}/stories/{story_key}.md"
      Output: "Resume with: /epic-dev-full {epic_num} --resume"
      HALT

END WHILE

IF validation_iteration >= max_validations AND pass_rate < 100:
  Output: "Maximum validation iterations ({max_validations}) reached."
  Output: "Current pass rate: {pass_rate}%"

  escalation = AskUserQuestion(
    question: "Validation limit reached. How to proceed?",
    header: "Escalate",
    options: [
      {label: "Continue anyway", description: "Proceed to ATDD with remaining issues"},
      {label: "Manual fix", description: "Pause for manual intervention"},
      {label: "Skip story", description: "Skip this story, continue to next"}
    ]
  )

  Handle escalation choice accordingly

```text

---

### PHASE 3: ATDD - Generate Acceptance Tests (opus)

**Execute when:** `phase == "validation_complete"` OR `phase == "testarch_atdd"`

This phase generates FAILING acceptance tests before implementation (TDD RED phase).

```text

Output: "=== [Phase 3/8] TDD RED Phase - Generating acceptance tests: {story_key} (opus) ==="

Update session:

  - phase: "testarch_atdd"
  - tdd_phase: "red"
  - last_updated: {timestamp}

Write sprint-status.yaml

Task(
  subagent_type="parallel-executor",
  model="opus",
  description="Generate ATDD tests for {story_key}",
  prompt="ATDD TEST GENERATOR AGENT - Story: {story_key}

**Your Mission:** Generate failing acceptance tests (TDD RED phase).

**Context:**
- Story file: {sprint_artifacts}/stories/{story_key}.md
- TDD Phase: RED (tests MUST fail initially)
- Test frameworks: Vitest (frontend), pytest (backend)

**Execution Steps:**
1. Read the story file to extract acceptance criteria
2. Execute: SlashCommand(command='/bmad:bmm:workflows:testarch-atdd')
3. For each acceptance criterion, create test file(s) with:
   - Given-When-Then structure
   - Test IDs mapping to ACs (e.g., TEST-AC-1.1.1)
   - Data factories and fixtures as needed
4. Verify all tests FAIL (this is expected in RED phase)
5. Create the ATDD checklist file

**Success Criteria:**
- All acceptance criteria have corresponding tests
- All tests are failing (RED state)
- ATDD checklist file created

**Output Format (JSON):**
{
  \"checklist_file\": \"path/to/atdd-checklist.md\",
  \"tests_created\": <count>,
  \"test_files\": [\"path/to/test1.ts\", \"path/to/test2.py\"],
  \"status\": \"red\"
}

Execute immediately and autonomously."
)

Parse ATDD output

Verify tests are FAILING (optional quick validation):

```bash

# Run tests to confirm RED state

cd {project_root}
pnpm test --run 2>&1 | tail -20  # Should show failures

```text

Update session:

  - phase: "atdd_complete"
  - atdd_checklist_file: {checklist_file}
  - atdd_tests_count: {tests_created}
  - tdd_phase: "red"

Write sprint-status.yaml

Output: "ATDD tests generated: {tests_created} tests (RED - all failing as expected)"
Output: "Checklist: {checklist_file}"

PROCEED TO PHASE 4

```text

---

### PHASE 4: Dev Story - Implementation (sonnet)

**Execute when:** `phase == "atdd_complete"` OR `phase == "dev_story"`

This phase implements the story to make acceptance tests pass (TDD GREEN phase).

```text

Output: "=== [Phase 4/8] TDD GREEN Phase - Implementing story: {story_key} (sonnet) ==="

Update session:

  - phase: "dev_story"
  - tdd_phase: "green"
  - last_updated: {timestamp}

Write sprint-status.yaml

Task(
  subagent_type="parallel-executor",
  model="sonnet",
  description="Implement story {story_key}",
  prompt="STORY IMPLEMENTER AGENT - Story: {story_key}

**Your Mission:** Implement the story to make all acceptance tests pass (TDD GREEN phase).

**Context:**
- Story file: {sprint_artifacts}/stories/{story_key}.md
- ATDD checklist: {session.atdd_checklist_file}
- Tests to pass: {session.atdd_tests_count}
- TDD Phase: GREEN (make tests pass)

**Execution Steps:**
1. Read the story file to understand tasks and acceptance criteria
2. Execute: SlashCommand(command='/bmad:bmm:workflows:dev-story')
3. Follow the task sequence in the story file EXACTLY
4. Run tests frequently: pnpm test (frontend) or pytest (backend)
5. Implement MINIMAL code to make each test pass
6. After all tests pass, run: pnpm prepush
7. Verify ALL checks pass

**Success Criteria:**
- All {session.atdd_tests_count} ATDD tests pass
- pnpm prepush passes without errors
- Story status updated to 'review'

**Output:** Report test results and prepush status.

Execute immediately and autonomously. Do not stop until all tests pass."
)

Verify implementation:

- All ATDD tests passing
- pnpm prepush passes (or equivalent validation)
- Story status updated to "review"

Update session:

  - phase: "dev_complete"
  - tdd_phase: "complete"

Write sprint-status.yaml

Output: "Implementation complete. All ATDD tests passing (GREEN)."

PROCEED TO PHASE 5

```text

---

### PHASE 5: Code Review (opus, max 3 iterations)

**Execute when:** `phase == "dev_complete"` OR `phase == "code_review"`

This phase performs adversarial code review finding 3-10 specific issues.

```text

INITIALIZE:
  review_iteration = session.review_iteration or 0
  max_reviews = 3

WHILE review_iteration < max_reviews:

  Output: "=== [Phase 5/8] Code Review iteration {review_iteration + 1}: {story_key} (opus) ==="

  Update session:

    - phase: "code_review"
    - review_iteration: {review_iteration}
    - last_updated: {timestamp}

  Write sprint-status.yaml

  Task(
    subagent_type="parallel-executor",
    model="opus",
    description="Code review for {story_key}",
    prompt="CODE REVIEWER AGENT - Story: {story_key}

**Your Mission:** Perform ADVERSARIAL code review. Find 3-10 specific issues.

**Context:**
- Story file: {sprint_artifacts}/stories/{story_key}.md
- Review iteration: {review_iteration + 1}

**Execution Steps:**
1. Read the story file to understand acceptance criteria
2. Execute: SlashCommand(command='/bmad:bmm:workflows:code-review')
3. Review ALL implementation code for this story
4. MANDATE: Find 3-10 specific issues. NEVER say 'looks good'.

**Review Categories:**
- AC validation: Is each acceptance criterion actually implemented?
- Task audit: Are all [x] marked tasks actually done?
- Code quality: Security, performance, error handling, complexity
- Test quality: Real assertions vs placeholders, coverage

**Output Format (JSON only):**
{
  \"total_issues\": <count>,
  \"high_issues\": [{\"id\": \"H1\", \"description\": \"...\", \"file\": \"...\", \"line\": N}],
  \"medium_issues\": [{\"id\": \"M1\", \"description\": \"...\", \"file\": \"...\", \"line\": N}],
  \"low_issues\": [{\"id\": \"L1\", \"description\": \"...\", \"file\": \"...\", \"line\": N}],
  \"auto_fixable\": true/false
}

Execute immediately and autonomously. Return ONLY the JSON result."
  )

  Parse review JSON output

  IF total_issues == 0 OR (high_count == 0 AND medium_count == 0):
    # Only LOW issues or no issues
    IF low_count > 0:
      Output: "Review found {low_count} LOW priority issues only."

      low_decision = AskUserQuestion(
        question: "How to handle LOW priority issues?",
        header: "Low Issues",
        options: [
          {label: "Fix all", description: "Fix all {low_count} low priority issues"},
          {label: "Skip", description: "Accept low issues and proceed"}
        ]
      )

      IF low_decision == "Fix all":
        # Apply low fixes
        Task(
          subagent_type="parallel-executor",
          model="sonnet",
          description="Fix low priority review issues for {story_key}",
          prompt="LOW PRIORITY FIXER AGENT - Story: {story_key}

**Your Mission:** Fix all LOW priority code review issues.

**Issues to Fix:**
{low_issues}

**Execution Steps:**
1. For each low priority issue, apply the fix using Edit tool
2. Verify fixes don't break existing functionality
3. Run: pnpm prepush
4. Ensure all tests still pass

**Output:** Report fixes applied and prepush result.

Execute immediately and autonomously."
        )
        review_iteration += 1
        CONTINUE loop
      ELSE:
        BREAK from loop
    ELSE:
      Output: "Code review PASSED - No blocking issues found."
      BREAK from loop

  ELSE:
    # HIGH or MEDIUM issues found
    Output:
    ───────────────────────────────────────────────────────────
    CODE REVIEW FINDINGS
    ───────────────────────────────────────────────────────────
    Total Issues: {total_issues}

    HIGH ({high_count}): {list high issues}
    MEDIUM ({medium_count}): {list medium issues}
    LOW ({low_count}): {list low issues}
    ───────────────────────────────────────────────────────────

    # Auto-fix HIGH and MEDIUM issues
    Output: "Auto-fixing {high_count + medium_count} HIGH/MEDIUM issues..."

    Task(
      subagent_type="parallel-executor",
      model="sonnet",
      description="Fix review issues for {story_key}",
      prompt="CODE FIXER AGENT - Story: {story_key}

**Your Mission:** Fix HIGH and MEDIUM priority code review issues.

**HIGH PRIORITY (must fix):**
{high_issues}

**MEDIUM PRIORITY (should fix):**
{medium_issues}

**Execution Steps:**
1. For each HIGH issue, apply the fix immediately
2. For each MEDIUM issue, apply the fix
3. Run: pnpm prepush
4. Verify all tests still pass

**Output:** Report fixes applied and test results.

Execute immediately and autonomously. Fix ALL issues listed above."
    )

    review_iteration += 1
    CONTINUE loop

END WHILE

IF review_iteration >= max_reviews:
  Output: "Maximum review iterations ({max_reviews}) reached."
  escalation = AskUserQuestion(
    question: "Review limit reached. How to proceed?",
    options: [
      {label: "Continue", description: "Accept current state and proceed"},
      {label: "Manual fix", description: "Pause for manual intervention"}
    ]
  )
  Handle escalation

Update session:

  - phase: "review_complete"

Write sprint-status.yaml

PROCEED TO PHASE 6

```text

---

### PHASE 6: Test Automation Expansion (sonnet)

**Execute when:** `phase == "review_complete"` OR `phase == "testarch_automate"`

This phase expands test coverage beyond the initial ATDD tests.

```text

Output: "=== [Phase 6/8] Expanding test coverage: {story_key} (sonnet) ==="

Update session:

  - phase: "testarch_automate"
  - last_updated: {timestamp}

Write sprint-status.yaml

Task(
  subagent_type="parallel-executor",
  model="sonnet",
  description="Expand test coverage for {story_key}",
  prompt="TEST EXPANDER AGENT - Story: {story_key}

**Your Mission:** Expand test coverage beyond initial ATDD tests.

**Context:**
- Story file: {sprint_artifacts}/stories/{story_key}.md
- ATDD checklist: {session.atdd_checklist_file}

**Execution Steps:**
1. Analyze the implementation for this story
2. Execute: SlashCommand(command='/bmad:bmm:workflows:testarch-automate')
3. Generate additional tests for:
   - Edge cases not covered by ATDD tests
   - Error handling paths
   - Integration points between components
   - Unit tests for complex logic
   - Boundary conditions
4. Use priority tagging: [P0], [P1], [P2], [P3]

**Priority Definitions:**
- P0: Critical path tests (must pass)
- P1: Important scenarios (should pass)
- P2: Edge cases (good to have)
- P3: Future-proofing (optional)

**Output Format (JSON):**
{
  \"tests_added\": <count>,
  \"coverage_before\": <percentage>,
  \"coverage_after\": <percentage>,
  \"test_files\": [\"path/to/new_test.ts\"],
  \"by_priority\": {\"P0\": N, \"P1\": N, \"P2\": N, \"P3\": N}
}

Execute immediately and autonomously."
)

Parse automation output

Update session:

  - phase: "automate_complete"

Write sprint-status.yaml

Output: "Test automation complete. Added {tests_added} tests."
Output: "Coverage: {coverage_before}% -> {coverage_after}%"

PROCEED TO PHASE 7

```text

---

### PHASE 7: Test Quality Review (sonnet)

**Execute when:** `phase == "automate_complete"` OR `phase == "testarch_test_review"`

This phase reviews test quality against best practices.

```text

Output: "=== [Phase 7/8] Reviewing test quality: {story_key} (haiku) ==="

Update session:

  - phase: "testarch_test_review"
  - last_updated: {timestamp}

Write sprint-status.yaml

Task(
  subagent_type="parallel-executor",
  model="haiku",
  description="Review test quality for {story_key}",
  prompt="TEST QUALITY REVIEWER AGENT - Story: {story_key}

**Your Mission:** Review all tests for quality against best practices.

**Execution Steps:**
1. Find all test files for this story
2. Execute: SlashCommand(command='/bmad:bmm:workflows:testarch-test-review')
3. Check each test against quality criteria

**Quality Criteria:**
- BDD format (Given-When-Then structure)
- Test ID conventions (traceability to ACs)
- Priority markers ([P0], [P1], etc.)
- No hard waits/sleeps (flakiness risk)
- Deterministic assertions (no random/conditional)
- Proper isolation and cleanup
- Explicit assertions (not hidden in helpers)
- File size limits (<300 lines)
- Test duration limits (<90 seconds)

**Output Format (JSON):**
{
  \"quality_score\": <0-100>,
  \"tests_reviewed\": <count>,
  \"issues_found\": [
    {\"test_file\": \"...\", \"issue\": \"...\", \"severity\": \"high|medium|low\"}
  ],
  \"recommendations\": [\"...\"]
}

Execute immediately and autonomously."
)

Parse quality report

IF quality_score < 80 OR has_high_severity_issues:
  Output: "Test quality issues detected (score: {quality_score}%)"
  Output: "Issues: {issues_found}"

  quality_decision = AskUserQuestion(
    question: "How to handle test quality issues?",
    header: "Quality",
    options: [
      {label: "Fix issues", description: "Auto-fix test quality issues"},
      {label: "Continue", description: "Accept current quality and proceed to gate"}
    ]
  )

  IF quality_decision == "Fix issues":
    Task(
      subagent_type="parallel-executor",
      model="haiku",
      description="Fix test quality issues for {story_key}",
      prompt="TEST QUALITY FIXER AGENT - Story: {story_key}

**Your Mission:** Fix test quality issues.

**Issues to Fix:**
{issues_found}

**Execution Steps:**
1. For each issue, apply the fix using Edit tool
2. Verify fixes don't break test functionality
3. Run: pnpm prepush
4. Ensure all tests still pass

**Output:** Report fixes applied and test results.

Execute immediately and autonomously."
    )

Update session:

  - phase: "test_review_complete"

Write sprint-status.yaml

Output: "Test quality review complete. Score: {quality_score}%"

PROCEED TO PHASE 8

```text

---

### PHASE 8: Requirements Traceability & Quality Gate (opus)

**Execute when:** `phase == "test_review_complete"` OR `phase == "testarch_trace"`

This phase generates traceability matrix and makes quality gate decision.

```text

Output: "=== [Phase 8/8] Quality Gate Decision: {story_key} (opus) ==="

Update session:

  - phase: "testarch_trace"
  - last_updated: {timestamp}

Write sprint-status.yaml

Task(
  subagent_type="parallel-executor",
  model="opus",
  description="Quality gate decision for {story_key}",
  prompt="QUALITY GATE AGENT - Story: {story_key}

**Your Mission:** Generate traceability matrix and make quality gate decision.

**Context:**
- Story file: {sprint_artifacts}/stories/{story_key}.md
- ATDD checklist: {session.atdd_checklist_file}

**Execution Steps:**
1. Execute: SlashCommand(command='/bmad:bmm:workflows:testarch-trace')
2. Map each acceptance criterion to its test(s)
3. Analyze coverage levels:
   - P0 coverage (critical paths) - MUST be 100%
   - P1 coverage (important) - should be >= 90%
   - Overall coverage - should be >= 80%
4. Identify gaps (ACs without tests)
5. Make quality gate decision based on rules

**Gate Decision Rules:**
- PASS: P0 = 100%, P1 >= 90%, Overall >= 80%
- CONCERNS: P0 = 100% but P1 < 90% or Overall < 80%
- FAIL: P0 < 100% OR critical gaps exist
- WAIVED: Business-approved exception with documented justification

**Output Format (JSON):**
{
  \"decision\": \"PASS|CONCERNS|FAIL\",
  \"p0_coverage\": <percentage>,
  \"p1_coverage\": <percentage>,
  \"overall_coverage\": <percentage>,
  \"traceability_matrix\": [
    {\"ac_id\": \"AC-1.1.1\", \"tests\": [\"TEST-1\", \"TEST-2\"], \"coverage\": \"FULL|PARTIAL|NONE\"}
  ],
  \"gaps\": [{\"ac_id\": \"AC-1.1.3\", \"reason\": \"No test found\"}],
  \"rationale\": \"Explanation of decision\"
}

Execute immediately and autonomously."
)

Parse gate decision

# ═══════════════════════════════════════════════════════════════════════════

# QUALITY GATE DECISION HANDLING

# ═══════════════════════════════════════════════════════════════════════════

Output:
═══════════════════════════════════════════════════════════════════════════
QUALITY GATE RESULT: {decision}
═══════════════════════════════════════════════════════════════════════════
P0 Coverage (Critical): {p0_coverage}% (required: 100%)
P1 Coverage (Important): {p1_coverage}% (target: 90%)
Overall Coverage: {overall_coverage}% (target: 80%)

Rationale: {rationale}
═══════════════════════════════════════════════════════════════════════════

IF decision == "PASS":
  Output: "Quality Gate: PASS - Story ready for completion"

  Update session:

    - phase: "complete"
    - gate_decision: "PASS"
    - p0_coverage: {p0_coverage}
    - p1_coverage: {p1_coverage}
    - overall_coverage: {overall_coverage}

  Write sprint-status.yaml
  PROCEED TO STORY COMPLETION

ELSE IF decision == "CONCERNS":
  Output: "Quality Gate: CONCERNS - Minor gaps detected"

  Update session:

    - phase: "gate_decision"
    - gate_decision: "CONCERNS"

  Write sprint-status.yaml

  concerns_decision = AskUserQuestion(
    question: "Quality gate has CONCERNS. How to proceed?",
    header: "Gate Decision",
    options: [
      {label: "Accept and continue", description: "Acknowledge gaps, mark story done"},
      {label: "Loop back to dev", description: "Fix gaps, re-run phases 4-8"},
      {label: "Skip story", description: "Mark as skipped, continue to next"},
      {label: "Stop", description: "Save state and exit"}
    ]
  )

  Handle concerns_decision (see LOOP-BACK LOGIC below)

ELSE IF decision == "FAIL":
  Output: "Quality Gate: FAIL - Blocking issues detected"
  Output: "Gaps identified:"
  FOR each gap in gaps:
    Output: "  - {gap.ac_id}: {gap.reason}"

  Update session:

    - phase: "gate_decision"
    - gate_decision: "FAIL"

  Write sprint-status.yaml

  fail_decision = AskUserQuestion(
    question: "Quality gate FAILED. How to proceed?",
    header: "Gate Failed",
    options: [
      {label: "Loop back to dev", description: "Fix gaps, re-run phases 4-8"},
      {label: "Request waiver", description: "Document business justification"},
      {label: "Skip story", description: "Mark as skipped, continue to next"},
      {label: "Stop", description: "Save state and exit"}
    ]
  )

  IF fail_decision == "Request waiver":
    Output: "Requesting waiver for quality gate failure."
    Output: "Provide waiver details:"

    waiver_info = AskUserQuestion(
      question: "What is the business justification for waiver?",
      options: [
        {label: "Time-critical", description: "Deadline requires shipping now"},
        {label: "Low risk", description: "Missing coverage is low-risk area"},
        {label: "Tech debt", description: "Will address in future sprint"},
        {label: "Custom", description: "Provide custom justification"}
      ]
    )

    # Mark as WAIVED
    Update session:

      - gate_decision: "WAIVED"
      - waiver_reason: {waiver_info}

    PROCEED TO STORY COMPLETION

  ELSE:
    Handle fail_decision accordingly

```text

---

## LOOP-BACK LOGIC

When user chooses "Loop back to dev" after gate FAIL or CONCERNS:

```text

Output: "Looping back to Phase 4 (dev-story) to address gaps..."

# Reset tracking for phases 4-8

Update session:

  - phase: "dev_story"
  - review_iteration: 0
  - gate_iteration: {gate_iteration + 1}
  - gate_decision: null

Write sprint-status.yaml

# Provide gap context to dev-story

Task(
  subagent_type="parallel-executor",
  model="sonnet",
  description="Fix gaps for {story_key}",
  prompt="GAP FIXER AGENT - Story: {story_key}

**Your Mission:** Fix quality gate gaps and ensure P0 coverage reaches 100%.

**Context:**
- Story file: {sprint_artifacts}/stories/{story_key}.md
- Previous gate decision: {previous_decision}
- Loop-back iteration: {gate_iteration + 1}

**GAPS TO ADDRESS:**
{FOR each gap in gaps:}

- {gap.ac_id}: {gap.reason}
{END FOR}

**Execution Steps:**
1. For each gap, add the missing test(s)
2. Implement any missing functionality for acceptance criteria
3. Run: pnpm prepush
4. Verify P0 coverage reaches 100%

**Success Criteria:**
- All identified gaps have been addressed
- All tests pass
- pnpm prepush passes

**Output:** Report gaps fixed and test results.

Execute immediately and autonomously."
)

# Continue through phases 5-8 again

PROCEED TO PHASE 5

```text

---

## STEP 6: Story Completion

```text

# Mark story complete

Update sprint-status.yaml:

  - story status: "done"

# Clear session state

Clear epic_dev_session (or update for next story)

Output:
═══════════════════════════════════════════════════════════════════════════
STORY COMPLETE: {story_key}
═══════════════════════════════════════════════════════════════════════════
Phases completed: 8/8
Quality Gate: {gate_decision}
Coverage: P0={p0_coverage}%, P1={p1_coverage}%, Overall={overall_coverage}%
═══════════════════════════════════════════════════════════════════════════

IF NOT --yolo AND more_stories_remaining:
  next_decision = AskUserQuestion(
    question: "Continue to next story: {next_story_key}?",
    header: "Next Story",
    options: [
      {label: "Continue", description: "Process next story with full 8-phase workflow"},
      {label: "Stop", description: "Exit (resume later with /epic-dev-full {epic_num} --resume)"}
    ]
  )

  IF next_decision == "Stop":
    HALT

```text

---

## STEP 7: Epic Completion

```text

Output:
════════════════════════════════════════════════════════════════════════════════
EPIC {epic_num} COMPLETE!
════════════════════════════════════════════════════════════════════════════════
Stories completed: {count}
Total phases executed: {count * 8}
All quality gates: {summary}

Next steps:

- Retrospective: /bmad:bmm:workflows:retrospective
- Next epic: /epic-dev-full {next_epic_num}
════════════════════════════════════════════════════════════════════════════════

```text

---

## ERROR HANDLING

On any workflow failure:

```text

1. Capture error output
2. Update session:
   - phase: "error"
   - last_error: "{error_message}"
3. Write sprint-status.yaml

4. Display error with phase context:
   Output: "ERROR in Phase {current_phase}: {error_message}"

1. Offer recovery options:
   error_decision = AskUserQuestion(
     question: "How to handle this error?",
     header: "Error Recovery",
     options: [
       {label: "Retry", description: "Re-run the failed phase"},
       {label: "Skip phase", description: "Skip to next phase (if safe)"},
       {label: "Skip story", description: "Mark story skipped, continue to next"},
       {label: "Stop", description: "Save state and exit"}
     ]
   )

1. Handle recovery choice:
   - Retry: Reset phase state, re-execute
   - Skip phase: Only allowed for non-critical phases (6, 7)
   - Skip story: Mark skipped in sprint-status, continue loop
   - Stop: HALT with resume instructions

```text

---

## EXECUTE NOW

Parse "$ARGUMENTS" and begin processing immediately with the full 8-phase TDD/ATDD workflow.

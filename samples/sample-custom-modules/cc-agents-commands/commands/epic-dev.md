---
description: "Automate BMAD development cycle for stories in an epic"
argument-hint: "<epic-number> [--yolo]"
---

# BMAD Epic Development

Execute development cycle for epic: "$ARGUMENTS"

---

## STEP 1: Parse Arguments

Parse "$ARGUMENTS":
- **epic_number** (required): First positional argument (e.g., "2")
- **--yolo**: Skip confirmation prompts between stories

Validation:
- If no epic_number: Error "Usage: /epic-dev <epic-number> [--yolo]"

---

## STEP 2: Verify BMAD Project

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

---

## STEP 3: Load Stories

Read `{sprint_artifacts}/sprint-status.yaml`

If not found:
- Error: "Run /bmad:bmm:workflows:sprint-planning first"

Find stories for epic {epic_number}:
- Pattern: `{epic_num}-{story_num}-{title}`
- Filter: status NOT "done"
- Order by story number

If no pending stories:
- Output: "All stories in Epic {epic_num} complete!"
- HALT

---

## MODEL STRATEGY

| Phase | Model | Rationale |
|-------|-------|-----------|
| create-story | opus | Deep understanding for quality stories |
| dev-story | sonnet | Balanced speed/quality for implementation |
| code-review | opus | Thorough adversarial review |

---

## STEP 4: Process Each Story

FOR each pending story:

### Create (if status == "backlog") - opus

```
IF status == "backlog":
  Output: "=== Creating story: {story_key} (opus) ==="
  Task(
    subagent_type="epic-story-creator",
    model="opus",
    description="Create story {story_key}",
    prompt="Create story for {story_key}.

Context:
- Epic file: {sprint_artifacts}/epic-{epic_num}.md
- Story key: {story_key}
- Sprint artifacts: {sprint_artifacts}

Execute the BMAD create-story workflow.
Return ONLY JSON summary: {story_path, ac_count, task_count, status}"
  )

  # Parse JSON response - expect: {"story_path": "...", "ac_count": N, "status": "created"}
  # Verify story was created successfully
```

### Develop - sonnet

```
Output: "=== Developing story: {story_key} (sonnet) ==="
Task(
  subagent_type="epic-implementer",
  model="sonnet",
  description="Develop story {story_key}",
  prompt="Implement story {story_key}.

Context:
- Story file: {sprint_artifacts}/stories/{story_key}.md

Execute the BMAD dev-story workflow.
Make all acceptance criteria pass.
Run pnpm prepush before completing.
Return ONLY JSON summary: {tests_passing, prepush_status, files_modified, status}"
)

# Parse JSON response - expect: {"tests_passing": N, "prepush_status": "pass", "status": "implemented"}
```

### VERIFICATION GATE 2.5: Post-Implementation Test Verification

**Purpose**: Verify all tests pass after implementation. Don't trust JSON output - directly verify.

```
Output: "=== [Gate 2.5] Verifying test state after implementation ==="

INITIALIZE:
  verification_iteration = 0
  max_verification_iterations = 3

WHILE verification_iteration < max_verification_iterations:

  # Orchestrator directly runs tests
  ```bash
  cd {project_root}
  TEST_OUTPUT=$(cd apps/api && uv run pytest tests -q --tb=short 2>&1 || true)
  ```

  IF TEST_OUTPUT contains "FAILED" OR "failed" OR "ERROR":
    verification_iteration += 1
    Output: "VERIFICATION ITERATION {verification_iteration}/{max_verification_iterations}: Tests failing"

    IF verification_iteration < max_verification_iterations:
      Task(
        subagent_type="epic-implementer",
        model="sonnet",
        description="Fix failing tests (iteration {verification_iteration})",
        prompt="Fix failing tests for story {story_key} (iteration {verification_iteration}).

Test failure output (last 50 lines):
{TEST_OUTPUT tail -50}

Fix the failing tests. Return JSON: {fixes_applied, tests_passing, status}"
      )
    ELSE:
      Output: "ERROR: Max verification iterations reached"
      gate_escalation = AskUserQuestion(
        question: "Gate 2.5 failed after 3 iterations. How to proceed?",
        header: "Gate Failed",
        options: [
          {label: "Continue anyway", description: "Proceed to code review with failing tests"},
          {label: "Manual fix", description: "Pause for manual intervention"},
          {label: "Skip story", description: "Mark story as blocked"},
          {label: "Stop", description: "Save state and exit"}
        ]
      )
      Handle gate_escalation accordingly
  ELSE:
    Output: "VERIFICATION GATE 2.5 PASSED: All tests green"
    BREAK from loop
  END IF

END WHILE
```

### Review - opus

```
Output: "=== Reviewing story: {story_key} (opus) ==="
Task(
  subagent_type="epic-code-reviewer",
  model="opus",
  description="Review story {story_key}",
  prompt="Review implementation for {story_key}.

Context:
- Story file: {sprint_artifacts}/stories/{story_key}.md

Execute the BMAD code-review workflow.
MUST find 3-10 specific issues.
Return ONLY JSON summary: {total_issues, high_issues, medium_issues, low_issues, auto_fixable}"
)

# Parse JSON response
# If high/medium issues found, auto-fix and re-review
```

### VERIFICATION GATE 3.5: Post-Review Test Verification

**Purpose**: Verify all tests still pass after code review fixes.

```
Output: "=== [Gate 3.5] Verifying test state after code review ==="

INITIALIZE:
  verification_iteration = 0
  max_verification_iterations = 3

WHILE verification_iteration < max_verification_iterations:

  # Orchestrator directly runs tests
  ```bash
  cd {project_root}
  TEST_OUTPUT=$(cd apps/api && uv run pytest tests -q --tb=short 2>&1 || true)
  ```

  IF TEST_OUTPUT contains "FAILED" OR "failed" OR "ERROR":
    verification_iteration += 1
    Output: "VERIFICATION ITERATION {verification_iteration}/{max_verification_iterations}: Tests failing after review"

    IF verification_iteration < max_verification_iterations:
      Task(
        subagent_type="epic-implementer",
        model="sonnet",
        description="Fix post-review failures (iteration {verification_iteration})",
        prompt="Fix test failures caused by code review changes for story {story_key}.

Test failure output (last 50 lines):
{TEST_OUTPUT tail -50}

Fix without reverting the review improvements.
Return JSON: {fixes_applied, tests_passing, status}"
      )
    ELSE:
      Output: "ERROR: Max verification iterations reached"
      gate_escalation = AskUserQuestion(
        question: "Gate 3.5 failed after 3 iterations. How to proceed?",
        header: "Gate Failed",
        options: [
          {label: "Continue anyway", description: "Mark story done with failing tests (risky)"},
          {label: "Revert review", description: "Revert code review fixes"},
          {label: "Manual fix", description: "Pause for manual intervention"},
          {label: "Stop", description: "Save state and exit"}
        ]
      )
      Handle gate_escalation accordingly
  ELSE:
    Output: "VERIFICATION GATE 3.5 PASSED: All tests green after review"
    BREAK from loop
  END IF

END WHILE
```

### Complete

```
Update sprint-status.yaml: story status → "done"
Output: "Story {story_key} COMPLETE!"
```

### Confirm Next (unless --yolo)

```
IF NOT --yolo AND more_stories_remaining:
  decision = AskUserQuestion(
    question="Continue to next story: {next_story_key}?",
    options=[
      {label: "Continue", description: "Process next story"},
      {label: "Stop", description: "Exit (resume later with /epic-dev {epic_num})"}
    ]
  )

  IF decision == "Stop":
    HALT
```

---

## STEP 5: Epic Complete

```
Output:
================================================
EPIC {epic_num} COMPLETE!
================================================
Stories completed: {count}

Next steps:
- Retrospective: /bmad:bmm:workflows:retrospective
- Next epic: /epic-dev {next_epic_num}
================================================
```

---

## ERROR HANDLING

On workflow failure:
1. Display error with context
2. Ask: "Retry / Skip story / Stop"
3. Handle accordingly

---

## EXECUTE NOW

Parse "$ARGUMENTS" and begin processing immediately.

---
description: "Automates BMAD development cycle"
prerequisites: "BMAD framework"
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

```text

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

| ------- | ------- | ----------- |

| create-story | opus | Deep understanding for quality stories |

| dev-story | sonnet | Balanced speed/quality for implementation |

| code-review | opus | Thorough adversarial review |

---

## STEP 4: Process Each Story

FOR each pending story:

### Create (if status == "backlog") - opus

```text

IF status == "backlog":
  Output: "=== Creating story: {story_key} (opus) ==="
  Task(
    subagent_type="general-purpose",
    model="opus",
    description="Create story {story_key}",
    prompt="Execute SlashCommand(command='/bmad:bmm:workflows:create-story').
            When asked which story, provide: {story_key}"
  )

```text

### Develop - sonnet

```text

Output: "=== Developing story: {story_key} (sonnet) ==="
Task(
  subagent_type="general-purpose",
  model="sonnet",
  description="Develop story {story_key}",
  prompt="Execute SlashCommand(command='/bmad:bmm:workflows:dev-story').
          Implement all acceptance criteria."
)

```text

### Review - opus

```text

Output: "=== Reviewing story: {story_key} (opus) ==="
Task(
  subagent_type="general-purpose",
  model="opus",
  description="Review story {story_key}",
  prompt="Execute SlashCommand(command='/bmad:bmm:workflows:code-review').
          Find and fix issues."
)

```text

### Complete

```text

Update sprint-status.yaml: story status → "done"
Output: "Story {story_key} COMPLETE!"

```text

### Confirm Next (unless --yolo)

```text

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

```text

---

## STEP 5: Epic Complete

```text

Output:
================================================
EPIC {epic_num} COMPLETE!
================================================
Stories completed: {count}

Next steps:

- Retrospective: /bmad:bmm:workflows:retrospective
- Next epic: /epic-dev {next_epic_num}
================================================

```text

---

## ERROR HANDLING

On workflow failure:

1. Display error with context
2. Ask: "Retry / Skip story / Stop"
3. Handle accordingly

---

## EXECUTE NOW

Parse "$ARGUMENTS" and begin processing immediately.

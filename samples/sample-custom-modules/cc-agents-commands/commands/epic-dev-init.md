---
description: "Verify BMAD project setup for epic-dev"
argument-hint: ""
---

# Epic-Dev Initialization

Verify this project is ready for epic-dev.

---

## STEP 1: Detect BMAD Project

```bash
PROJECT_ROOT=$(pwd)
while [[ ! -d "$PROJECT_ROOT/_bmad" ]] && [[ "$PROJECT_ROOT" != "/" ]]; do
  PROJECT_ROOT=$(dirname "$PROJECT_ROOT")
done

if [[ -d "$PROJECT_ROOT/_bmad" ]]; then
  echo "BMAD:$PROJECT_ROOT"
else
  echo "NONE"
fi

```text

---

## STEP 2: Handle Result

### IF BMAD Project Found

```text

Output: "BMAD project detected: {project_root}"
Output: ""
Output: "Available workflows:"
Output: "  /bmad:bmm:workflows:create-story"
Output: "  /bmad:bmm:workflows:dev-story"
Output: "  /bmad:bmm:workflows:code-review"
Output: ""
Output: "Usage: /epic-dev <epic-number> [--yolo]"
Output: ""

Check if sprint-status.yaml exists at expected location.

IF exists:
  Output: "Sprint status: Ready"
ELSE:
  Output: "Sprint status not found. Run:"
  Output: "  /bmad:bmm:workflows:sprint-planning"

```text

### IF No BMAD Project

```text

Output: "Not a BMAD project."
Output: ""
Output: "Epic-dev requires a BMAD project setup."
Output: "Initialize with: /bmad:bmm:workflows:workflow-init"

```text

---

## EXECUTE NOW

Run detection and show status.

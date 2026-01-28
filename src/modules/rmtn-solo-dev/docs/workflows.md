# Workflows Reference

rmtn-solo-dev includes 5 workflows:

---

## Scan Project

**ID:** `scan-project`
**Workflow:** `scan-project`

**Purpose:**
Scan codebase to generate Saga (PRD/Arch).

**When to Use:**
At the beginning of a project or when onboarding the module to an existing project.

**Key Steps:**
1. Welcome & Input
2. Scan Codebase
3. Analyze & Draft
4. Review
5. Finalize

**Agent(s):**
Mimir

---

## New Quest

**ID:** `new-quest`
**Workflow:** `new-quest`

**Purpose:**
Plan a new feature (Approach scoring + Tech Spec).

**When to Use:**
When starting any significant feature or refactor.

**Key Steps:**
1. Briefing
2. Strategize (3 Approaches)
3. Select & Plan
4. Review
5. Create Quest

**Agent(s):**
Thor (Primary), Mimir (Context)

---

## Execute Quest

**ID:** `execute-quest`
**Workflow:** `execute-quest`

**Purpose:**
Implement a planned Quest step-by-step.

**When to Use:**
After a Quest has been planned and approved.

**Key Steps:**
1. Load Quest
2. Select Step
3. Implement
4. Validate
5. Update Status

**Agent(s):**
Thor

---

## Update Saga

**ID:** `update-saga`
**Workflow:** `update-saga`

**Purpose:**
Update Saga based on completed Quests.

**When to Use:**
After completing a Quest or a set of Quests to ensure documentation stays in sync.

**Key Steps:**
1. Load Context
2. Analyze Changes
3. Draft Updates
4. Review
5. Commit

**Agent(s):**
Mimir

---

## Quick Fix

**ID:** `quick-fix`
**Workflow:** `quick-fix`

**Purpose:**
Rapidly fix bugs without full Quest ceremony.

**When to Use:**
For minor bugs, typos, or small tasks that don't require architectural planning.

**Key Steps:**
1. Identify
2. Implement
3. Verify

**Agent(s):**
Thor

---

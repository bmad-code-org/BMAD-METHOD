# Workflow Status - Universal Entry Point

## Overview

The `workflow-status` workflow is the **universal entry point** for all BMad Method (BMM) workflows. It serves as both a status tracker and master router, helping users understand where they are in their project journey and what to do next.

## Purpose

**Primary Functions:**

1. **Status Checking**: Read existing workflow status and display current state
2. **Next Action Recommendation**: Suggest what the user should do next
3. **Comprehensive Workflow Planning**: Map out ENTIRE workflow journey before executing anything
4. **Planned Workflow Documentation**: Create status file with complete phase/step roadmap
5. **Phase Navigation**: Guide users through the 4-phase methodology
6. **Agent Coordination**: Can be invoked by any agent (bmad-master, analyst, pm)

## When to Use

### Automatic Invocation

Agents should automatically check workflow status when loaded:

- **bmad-master**: Checks status before displaying main menu
- **analyst**: Checks status before displaying analysis options
- **pm**: Checks status before displaying planning options

### Manual Invocation

Users can manually run this workflow anytime:

```bash
bmad analyst workflow-status
# or
bmad pm workflow-status
# or just tell any agent: "check workflow status"
```

## Workflow Behavior

### Scenario 1: No Status File Exists (New Project)

**The workflow will map out your ENTIRE workflow journey:**

**Step 1: Project Context**

- Determine greenfield vs brownfield
- Check if brownfield needs documentation
- Note if `document-project` should be added to plan

**Step 2: Scope Understanding**

- Ask if user knows project level/scope
- Options:
  - **Yes**: Capture estimated level (0-4)
  - **No**: Defer level determination to Phase 2 (plan-project)
  - **Want analysis first**: Include Phase 1 in plan

**Step 3: Choose Starting Point**

- **Option A**: Full Analysis Phase (brainstorm → research → brief)
- **Option B**: Skip to Planning (direct to PRD/GDD)
- **Option C**: Just Show Menu (I'll decide manually)

**Step 4: Build Complete Planned Workflow**
The workflow builds a comprehensive plan including:

- Phase 1 (if needed): document-project, brainstorm, research, brief
- Phase 2 (always required): plan-project
- Phase 3 (if Level 3-4): solution-architecture, tech-specs
- Phase 4 (always): Full implementation workflow (create-story → story-ready → dev-story → story-approved)

**Step 5: Create Status File**

- Create `bmm-workflow-status.md`
- Document complete planned workflow in "Planned Workflow Journey" table
- Set current step: "Workflow Definition Phase"
- Set next step: First item from planned workflow
- Provide command to run next step

**Brownfield Special Handling:**

- Checks if codebase is documented
- Adds `document-project` to planned workflow if needed
- Does NOT immediately execute it - documents it in the plan first

**Output:**

- Complete workflow roadmap with phases, steps, agents, and descriptions
- Status file with planned journey documented
- Clear command to run first step
- User can reference plan anytime via workflow-status

### Scenario 2: Status File Exists (Project In Progress)

**The workflow will:**

1. Find most recent `bmm-workflow-status.md` file
2. Read and parse current state:
   - Current phase and progress %
   - Project level and type
   - Phase completion status
   - Implementation progress (if Phase 4)
   - Next recommended action
3. Display comprehensive status summary
4. Offer options:
   - **Option 1**: Proceed with recommended action
   - **Option 2**: View detailed status
   - **Option 3**: Change workflow
   - **Option 4**: Display agent menu
   - **Option 5**: Exit

**Phase 4 Special Display:**
If in Implementation phase, shows:

- BACKLOG story count
- TODO story (ready for drafting)
- IN PROGRESS story (being implemented)
- DONE story count and points

## Status File Detection

**Search Pattern:**

```
{output_folder}/bmm-workflow-status.md
```

**Versioning:**

- Files are named: `bmm-workflow-status.md`
- Workflow finds most recent by date
- Old files can be archived

## Recommended Next Actions

The workflow intelligently suggests next steps based on current state:

**Phase 1 (Analysis):**

- Continue with analysis workflows
- Or move to `plan-project`

**Phase 2 (Planning):**

- If Level 0-1: Move to Phase 4 (`create-story`)
- If Level 3-4: Move to Phase 3 (`solution-architecture`)

**Phase 3 (Solutioning):**

- Continue with tech-specs (JIT per epic)
- Or move to Phase 4 (`create-story`)

**Phase 4 (Implementation):**

- Shows current TODO/IN PROGRESS story
- Suggests exact next workflow (`story-ready`, `dev-story`, `story-approved`)

## Integration with Agents

### bmad-master

```
On load:
1. Run workflow-status check
2. If status found: Display summary + menu
3. If no status: Offer to plan workflow
4. Display master menu with context
```

### analyst

```
On load:
1. Run workflow-status check
2. If in Phase 1: Show analysis workflows
3. If no status: Offer analysis planning
4. Display analyst menu
```

### pm

```
On load:
1. Run workflow-status check
2. If no status: Offer to run plan-project
3. If status found: Show current phase progress
4. Display PM menu
```

## Example Outputs

### No Status File (New User) - Planning Flow

```
🚀 Welcome to BMad Method Workflows!

No workflow status file found. Let's plan your complete workflow journey.

Step 1: Project Context

Is this a new or existing codebase?
   a. Greenfield - Starting from scratch
   b. Brownfield - Adding to existing codebase

Your choice (a/b): a

Step 3: Understanding Your Workflow

Before we plan your workflow, let's determine the scope and complexity of your project.

The BMad Method uses 5 project levels (0-4) that determine which phases you'll need:
- Level 0: Single atomic change (1 story) - Phases 2 → 4
- Level 1: Small feature (2-3 stories, 1 epic) - Phases 2 → 4
- Level 2: Medium project (multiple epics) - Phases 2 → 4
- Level 3: Complex system (subsystems, integrations) - Phases 2 → 3 → 4
- Level 4: Enterprise scale (multiple products) - Phases 2 → 3 → 4

Do you already know your project's approximate size/scope?
a. Yes - I can describe the general scope
b. No - Not sure yet, need help determining it
c. Want analysis first - Do brainstorming/research before deciding

Your choice (a/b/c): a

Based on the descriptions above, what level best describes your project?
0. Single atomic change
1. Small coherent feature
2. Medium project
3. Complex system
4. Enterprise scale

Your estimated level (0-4): 1

Step 4: Choose Your Starting Point

Option A: Full Analysis Phase First
Option B: Skip to Planning
Option C: Just Show Menu

Your choice (A/B/C): B

🗺️ Your Planned Workflow

Based on your responses, here's your complete workflow journey:

**2-Plan** - plan-project
  - Agent: PM
  - Description: Create PRD/GDD/Tech-Spec (determines final level)
  - Status: Planned

**3-Solutioning** - TBD - depends on level from Phase 2
  - Agent: Architect
  - Description: Required if Level 3-4, skipped if Level 0-2
  - Status: Conditional

**4-Implementation** - create-story (iterative)
  - Agent: SM
  - Description: Draft stories from backlog
  - Status: Planned

**4-Implementation** - story-ready
  - Agent: SM
  - Description: Approve story for dev
  - Status: Planned

**4-Implementation** - story-context
  - Agent: SM
  - Description: Generate context XML
  - Status: Planned

**4-Implementation** - dev-story (iterative)
  - Agent: DEV
  - Description: Implement stories
  - Status: Planned

**4-Implementation** - story-approved
  - Agent: DEV
  - Description: Mark complete, advance queue
  - Status: Planned

---

Current Step: Workflow Definition Phase (this workflow)
Next Step: plan-project (PM agent)

Ready to create your workflow status file?

This will create: bmm-workflow-status.md

The status file will document:
- Your complete planned workflow (phases and steps)
- Current phase: "Workflow Definition"
- Next action: plan-project

Create status file? (y/n): y

✅ Status file created!

File: bmm-workflow-status.md

To proceed with your first step:

Load PM: bmad pm plan-project

You can always check your status with: workflow-status
```

### Status File Found (In Progress)

```
📊 Current Workflow Status

Project: My Web App
Started: 2025-10-10
Last Updated: 2025-10-12

Current Phase: 4-Implementation (65% complete)
Current Workflow: Story implementation in progress

Phase Completion:
- [x] Phase 1: Analysis
- [x] Phase 2: Planning
- [ ] Phase 3: Solutioning (skipped for Level 1)
- [ ] Phase 4: Implementation

Planned Workflow Journey:
Current Step: dev-story (DEV agent)
Next Step: story-approved (DEV agent)

Full planned workflow documented in status file - reference anytime!

Project Details:
- Level: 1 (Coherent feature, 1-10 stories)
- Type: web
- Context: greenfield

Implementation Progress:
- BACKLOG: 1 stories
- TODO: (empty)
- IN PROGRESS: auth-feature-2 (Ready)
- DONE: 1 stories (5 points)

---

🎯 Recommended Next Action:

Implement story auth-feature-2

Command: Run 'dev-story' workflow
Agent: DEV

Would you like to:
1. Proceed with recommended action
2. View detailed status (includes full planned workflow table)
3. Change workflow
4. Display agent menu
5. Exit
```

## Benefits

✅ **Complete Workflow Planning**: Maps out ENTIRE journey before executing anything
✅ **No More Guessing**: Users always know current step AND what comes next
✅ **Documented Roadmap**: Status file contains complete planned workflow table
✅ **Context-Aware**: Recommendations adapt to project state and level
✅ **Universal Entry Point**: Works with any agent
✅ **New User Friendly**: Guides comprehensive workflow planning
✅ **Status Visibility**: Clear progress tracking with current/next step indicators
✅ **Phase Navigation**: Easy to jump between phases with planned path reference
✅ **Level-Adaptive**: Plans adjust based on estimated project level (0-4)
✅ **Brownfield Support**: Includes documentation needs in workflow plan

## Future Enhancements

- **Progress Dashboards**: Visual progress indicators
- **Time Tracking**: Estimate time remaining
- **Multi-Project**: Handle multiple projects
- **Team Sync**: Show what teammates are working on

---

**This workflow is the front door to BMad Method. Every user should start here or have it checked automatically by their agent.**

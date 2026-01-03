---
name: 'step-01b-continue'
description: 'Handle workflow continuation for Create mode'

workflowFile: '../workflow.md'
buildTrackingFile: '{bmb_creations_output_folder}/modules/module-build-{module_code}.md'
---

# Step 1b: Continue (Create Mode)

## STEP GOAL:

Resume a paused Create mode session by loading the build tracking state and routing to the correct step.

## MANDATORY EXECUTION RULES:

### Universal Rules:

- 📖 CRITICAL: Read the complete step file before taking any action
- ✅ Speak in `{communication_language}`

### Role Reinforcement:

- ✅ You are the **Module Builder** — picking up where we left off
- ✅ Warm welcome back
- ✅ Seamless resume

---

## MANDATORY SEQUENCE

### 1. Welcome Back

"**Welcome back to the Module Builder!** 👋"

### 2. Load Build Tracking

Load `{buildTrackingFile}` and read:
- `stepsCompleted` array
- `moduleCode`
- `moduleName`
- `moduleType`
- `status`

### 3. Report Progress

"**Here's where we are:**"

**Module:** {moduleName} ({moduleCode})
**Type:** {moduleType}
**Status:** {status}

**Completed steps:**
- {list completed steps}

### 4. Determine Next Step

Find the last completed step and route to the next one:

| Last Completed | Next Step |
|---------------|-----------|
| step-01-load-brief | step-02-structure |
| step-02-structure | step-03-config |
| step-03-config | step-04-installer |
| step-04-installer | step-05-agents |
| step-05-agents | step-06-workflows |
| step-06-workflows | step-07-docs |
| step-07-docs | step-08-complete |

### 5. Route to Next Step

"**Continuing to: {next step name}**"

Load the appropriate step file and execute.

---

## Success Metrics

✅ User welcomed back
✅ Build state loaded
✅ Correct next step identified
✅ Seamless resume

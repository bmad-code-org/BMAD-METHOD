# Step 1b: Continue Existing Bug Tracking Session

## MANDATORY EXECUTION RULES (READ FIRST):

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: ALWAYS read the complete step file before taking any action
- 🔄 CRITICAL: When loading next step with 'C', ensure the entire file is read and understood before proceeding
- ✅ ALWAYS treat this as collaborative triage between peers
- 📋 YOU ARE A FACILITATOR, not an automatic processor
- 🚪 This step handles CONTINUATION of existing work
- ✅ YOU MUST ALWAYS SPEAK OUTPUT In your Agent communication style with the config `{communication_language}`

## EXECUTION PROTOCOLS:

- 🎯 Summarize existing state before offering options
- 💾 Preserve all existing bugs.yaml data
- 📖 Help user understand where they left off
- 🚫 FORBIDDEN to lose or overwrite existing triage work

## CONTEXT BOUNDARIES:

- Variables from workflow.md are available in memory
- bugs.yaml contains existing structured data
- User may have triaged bugs awaiting implementation
- Don't re-triage already processed bugs

## YOUR TASK:

Welcome user back and summarize the current state of bug tracking, offering relevant continuation options.

## CONTINUATION SEQUENCE:

### 1. Load Current State

Read bugs.yaml and extract:
- Total active bugs count
- Bugs by status (triaged, implemented, verified)
- Bugs by severity breakdown
- Bugs by recommended workflow

### 2. Check for New Input

Scan "# manual input" section of bugs.md:
- Count items not yet in bugs.yaml
- These are new bugs needing triage

### 3. Present Continuation Summary

Report to user:

"Welcome back, {user_name}! Here's your Bug Tracking status for {project_name}.

**Current State:**
- Active Bugs: {total_active}
  - Triaged (awaiting action): {triaged_count}
  - Implemented (awaiting verification): {implemented_count}
- By Severity: Critical: {critical} | High: {high} | Medium: {medium} | Low: {low}

**Workflow Routing:**
- Direct Fix: {direct_fix_count} bug(s)
- Tech-Spec: {tech_spec_count} bug(s)
- Correct-Course: {correct_course_count} bug(s)
- Backlog: {backlog_count} bug(s)

**New Items:**
- {new_count} new item(s) found in manual input section

**Options:**
[T] Triage new bugs ({new_count} items)
[I] Implement a bug - `/implement bug-NNN`
[V] Verify implemented bugs - `/verify`
[L] List bugs by status/severity
[Q] Quit"

### 4. Handle User Selection

Based on user choice:

- **[T] Triage**: Load `./step-03-parse.md` to process new bugs
- **[I] Implement**: Guide user to run `/implement bug-NNN` skill
- **[V] Verify**: Guide user to run `/verify` skill
- **[L] List**: Show filtered bug list, then return to menu
- **[Q] Quit**: End workflow gracefully

## SUCCESS METRICS:

✅ Existing state accurately summarized
✅ New items detected and counted
✅ User given clear options based on current state
✅ Appropriate next step loaded based on selection

## FAILURE MODES:

❌ Losing track of existing triaged bugs
❌ Re-triaging already processed bugs
❌ Not detecting new items in manual input
❌ Proceeding without user selection

❌ **CRITICAL**: Reading only partial step file
❌ **CRITICAL**: Proceeding without explicit user menu selection

## NEXT STEP:

Load appropriate step based on user selection:
- [T] → `./step-03-parse.md`
- [I], [V] → Guide to relevant skill, then return here
- [L] → Display list, return to this menu
- [Q] → End workflow

Remember: Do NOT proceed until user explicitly selects an option!

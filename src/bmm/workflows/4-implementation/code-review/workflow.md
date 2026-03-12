---
name: code-review
description: 'Perform adversarial code review finding specific issues. Use when the user says "run code review" or "review this code"'
---

# Code Review Workflow

**Goal:** Perform adversarial code review finding specific issues.

**Your Role:** Adversarial Code Reviewer.
- YOU ARE AN ADVERSARIAL CODE REVIEWER - Find what's wrong or missing!
- Communicate all responses in {communication_language} and language MUST be tailored to {user_skill_level}
- Generate all documents in {document_output_language}
- Your purpose: Validate story file claims against actual implementation
- Challenge everything: Are tasks marked [x] actually done? Are ACs really implemented?
- Be thorough and specific — find real issues, not manufactured ones. If the code is genuinely good after fixes, say so
- Read EVERY file in the File List - verify implementation against story requirements
- Tasks marked complete but not done = CRITICAL finding
- Acceptance Criteria not implemented = HIGH severity finding
- Do not review files that are not part of the application's source code. Always exclude the `_bmad/` and `_bmad-output/` folders from the review. Always exclude IDE and CLI configuration folders like `.cursor/` and `.windsurf/` and `.claude/`

---

## INITIALIZATION

### Configuration Loading

Load config from `{project-root}/_bmad/bmm/config.yaml` and resolve:

- `project_name`, `user_name`
- `communication_language`, `document_output_language`
- `user_skill_level`
- `planning_artifacts`, `implementation_artifacts`
- `date` as system-generated current datetime

### Paths

- `installed_path` = `{project-root}/_bmad/bmm/workflows/4-implementation/code-review`
- `sprint_status` = `{implementation_artifacts}/sprint-status.yaml`
- `validation` = `{installed_path}/checklist.md`

### Input Files

| Input | Description | Path Pattern(s) | Load Strategy |
|-------|-------------|------------------|---------------|
| architecture | System architecture for review context | whole: `{planning_artifacts}/*architecture*.md`, sharded: `{planning_artifacts}/*architecture*/*.md` | FULL_LOAD |
| ux_design | UX design specification (if UI review) | whole: `{planning_artifacts}/*ux*.md`, sharded: `{planning_artifacts}/*ux*/*.md` | FULL_LOAD |
| epics | Epic containing story being reviewed | whole: `{planning_artifacts}/*epic*.md`, sharded_index: `{planning_artifacts}/*epic*/index.md`, sharded_single: `{planning_artifacts}/*epic*/epic-{{epic_num}}.md` | SELECTIVE_LOAD |

### Context

- `project_context` = `**/project-context.md` (load if exists)

---

## EXECUTION

<workflow>

<step n="1" goal="Load story and discover changes">
  <action>Use provided {{story_path}} or ask user which story file to review</action>
  <action>Read COMPLETE story file</action>
  <action>Set {{story_key}} = extracted key from filename (e.g., "1-2-user-authentication.md" → "1-2-user-authentication") or story
    metadata</action>
  <action>Parse sections: Story, Acceptance Criteria, Tasks/Subtasks, Dev Agent Record → File List, Change Log</action>

  <!-- Discover actual changes via git -->
  <action>Check if git repository detected in current directory</action>
  <check if="git repository exists">
    <action>Run `git status --porcelain` to find uncommitted changes</action>
    <action>Run `git diff --name-only` to see modified files</action>
    <action>Run `git diff --cached --name-only` to see staged files</action>
    <action>Compile list of actually changed files from git output</action>
  </check>

  <!-- Cross-reference story File List vs git reality -->
  <action>Compare story's Dev Agent Record → File List with actual git changes</action>
  <action>Note discrepancies:
    - Files in git but not in story File List
    - Files in story File List but no git changes
    - Missing documentation of what was actually changed
  </action>

  <action>Read fully and follow `{installed_path}/discover-inputs.md` to load all input files</action>
  <action>Load {project_context} for coding standards (if exists)</action>
</step>

<step n="2" goal="Build review attack plan">
  <action>Extract ALL Acceptance Criteria from story</action>
  <action>Extract ALL Tasks/Subtasks with completion status ([x] vs [ ])</action>
  <action>From Dev Agent Record → File List, compile list of claimed changes</action>

  <action>Create review plan:
    1. **AC Validation**: Verify each AC is actually implemented
    2. **Task Audit**: Verify each [x] task is really done
    3. **Code Quality**: Security, performance, maintainability
    4. **Test Quality**: Real tests vs placeholder bullshit
  </action>
</step>

<step n="3" goal="Execute adversarial review">
  <critical>VALIDATE EVERY CLAIM - Check git reality vs story claims</critical>

  <!-- Git vs Story Discrepancies -->
  <action>Review git vs story File List discrepancies:
    1. **Files changed but not in story File List** → MEDIUM finding (incomplete documentation)
    2. **Story lists files but no git changes** → HIGH finding (false claims)
    3. **Uncommitted changes not documented** → MEDIUM finding (transparency issue)
  </action>

  <!-- Use combined file list: story File List + git discovered files -->
  <action>Create comprehensive review file list from story File List and git changes</action>

  <!-- AC Validation -->
  <action>For EACH Acceptance Criterion:
    1. Read the AC requirement
    2. Search implementation files for evidence
    3. Determine: IMPLEMENTED, PARTIAL, or MISSING
    4. If MISSING/PARTIAL → HIGH SEVERITY finding
  </action>

  <!-- Task Completion Audit -->
  <action>For EACH task marked [x]:
    1. Read the task description
    2. Search files for evidence it was actually done
    3. **CRITICAL**: If marked [x] but NOT DONE → CRITICAL finding
    4. Record specific proof (file:line)
  </action>

  <!-- Code Quality Deep Dive -->
  <action>For EACH file in comprehensive review list:
    1. **Security**: Look for injection risks, missing validation, auth issues
    2. **Performance**: N+1 queries, inefficient loops, missing caching
    3. **Error Handling**: Missing try/catch, poor error messages
    4. **Code Quality**: Complex functions, magic numbers, poor naming
    5. **Test Quality**: Are tests real assertions or placeholders?
  </action>

  <check if="total_issues_found == 0">
    <action>Double-check by re-examining code for:
      - Edge cases and null handling
      - Architecture violations
      - Integration issues
      - Dependency problems
    </action>
    <action>If still no issues found after thorough re-examination, that is a valid outcome — report a clean review</action>
  </check>
</step>

<step n="4" goal="Present findings and fix them">
  <action>Categorize findings: HIGH (must fix), MEDIUM (should fix), LOW (nice to fix)</action>
  <action>Set {{fixed_count}} = 0</action>
  <action>Set {{action_count}} = 0</action>

  <output>**🔥 CODE REVIEW FINDINGS, {user_name}!**

    **Story:** {{story_file}}
    **Git vs Story Discrepancies:** {{git_discrepancy_count}} found
    **Issues Found:** {{high_count}} High, {{medium_count}} Medium, {{low_count}} Low

    ## 🔴 CRITICAL ISSUES
    - Tasks marked [x] but not actually implemented
    - Acceptance Criteria not implemented
    - Story claims files changed but no git evidence
    - Security vulnerabilities

    ## 🟡 MEDIUM ISSUES
    - Files changed but not documented in story File List
    - Uncommitted changes not tracked
    - Performance problems
    - Poor test coverage/quality
    - Code maintainability issues

    ## 🟢 LOW ISSUES
    - Code style improvements
    - Documentation gaps
    - Git commit message quality
  </output>

  <ask>What should I do with these issues?

    1. **Fix them automatically** - I'll update the code and tests
    2. **Create action items** - Add to story Tasks/Subtasks for later
    3. **Show me details** - Deep dive into specific issues

    Choose [1], [2], or specify which issue to examine:</ask>

  <check if="user chooses 1">
    <action>Fix all HIGH and MEDIUM issues in the code</action>
    <action>Add/update tests as needed</action>
    <action>Update File List in story if files changed</action>
    <action>Update story Dev Agent Record with fixes applied</action>
    <action>Set {{fixed_count}} = number of HIGH and MEDIUM issues fixed</action>
    <action>Set {{action_count}} = 0</action>
  </check>

  <check if="user chooses 2">
    <action>Add "Review Follow-ups (AI)" subsection to Tasks/Subtasks</action>
    <action>For each issue: `- [ ] [AI-Review][Severity] Description [file:line]`</action>
    <action>Set {{action_count}} = number of action items created</action>
    <action>Set {{fixed_count}} = 0</action>
  </check>

  <check if="user chooses 3">
    <action>Show detailed explanation with code examples</action>
    <action>Return to fix decision</action>
  </check>
</step>

<step n="5" goal="Update story status and sync sprint tracking">
  <!-- Determine new status based on review outcome -->
  <check if="all HIGH and MEDIUM issues fixed AND all ACs implemented">
    <action>Set {{new_status}} = "done"</action>
    <action>Update story Status field to "done"</action>
  </check>
  <check if="HIGH or MEDIUM issues remain OR ACs not fully implemented">
    <action>Set {{new_status}} = "in-progress"</action>
    <action>Update story Status field to "in-progress"</action>
  </check>
  <action>Save story file</action>

  <!-- Determine sprint tracking status -->
  <check if="{sprint_status} file exists">
    <action>Set {{current_sprint_status}} = "enabled"</action>
  </check>
  <check if="{sprint_status} file does NOT exist">
    <action>Set {{current_sprint_status}} = "no-sprint-tracking"</action>
  </check>

  <!-- Sync sprint-status.yaml when story status changes (only if sprint tracking enabled) -->
  <check if="{{current_sprint_status}} != 'no-sprint-tracking'">
    <action>Load the FULL file: {sprint_status}</action>
    <action>Find development_status key matching {{story_key}}</action>

    <check if="{{new_status}} == 'done'">
      <action>Update development_status[{{story_key}}] = "done"</action>
      <action>Update last_updated field to current date</action>
      <action>Save file, preserving ALL comments and structure</action>
      <output>✅ Sprint status synced: {{story_key}} → done</output>
    </check>

    <check if="{{new_status}} == 'in-progress'">
      <action>Update development_status[{{story_key}}] = "in-progress"</action>
      <action>Update last_updated field to current date</action>
      <action>Save file, preserving ALL comments and structure</action>
      <output>🔄 Sprint status synced: {{story_key}} → in-progress</output>
    </check>

    <check if="story key not found in sprint status">
      <output>⚠️ Story file updated, but sprint-status sync failed: {{story_key}} not found in sprint-status.yaml</output>
    </check>
  </check>

  <check if="{{current_sprint_status}} == 'no-sprint-tracking'">
    <output>ℹ️ Story status updated (no sprint tracking configured)</output>
  </check>

  <output>**✅ Review Complete!**

    **Story Status:** {{new_status}}
    **Issues Fixed:** {{fixed_count}}
    **Action Items Created:** {{action_count}}

    {{#if new_status == "done"}}Code review complete!{{else}}Address the action items and continue development.{{/if}}
  </output>
</step>

</workflow>
